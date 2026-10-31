"""
Orchestrator — LangGraph-style pipeline coordinator.
Chains all 6 agents + CAM + Ledger in sequence.
Supports dynamic re-routing if FRAUD_SUSPECTED (max MAX_REROUTES=5).
No autonomous disbursal — ledger entry stays PENDING_HUMAN_APPROVAL.
"""
from __future__ import annotations
import asyncio
from datetime import datetime
from typing import AsyncGenerator

from backend.models.schemas import CaseFile, A2AMessage
from backend.data.synthetic_data import (
    CASE_ID, APPLICANT, LOAN_REQUEST, POLICY_LIMITS
)
from backend.agents import (
    doc_intake,
    cashflow,
    fraud,
    credit_risk,
    policy,
    loan_structuring,
    cam_generator,
)
from backend.ledger.mock_ledger import post_pending_sanction

MAX_REROUTES = POLICY_LIMITS["max_reroutes"]

# In-memory case store (production would use DB)
_cases: dict[str, CaseFile] = {}


def get_case(case_id: str) -> CaseFile | None:
    return _cases.get(case_id)


def list_cases() -> list[CaseFile]:
    return list(_cases.values())


def create_case(case_id: str, applicant_name: str, loan_amount: float, loan_purpose: str) -> CaseFile:
    case = CaseFile(
        case_id=case_id,
        applicant_name=applicant_name,
        loan_amount_requested=loan_amount,
        loan_purpose=loan_purpose,
        status="INITIATED",
    )
    _cases[case_id] = case
    return case


# Pre-load the demo case
def _preload_demo_case():
    if CASE_ID not in _cases:
        _cases[CASE_ID] = CaseFile(
            case_id=CASE_ID,
            applicant_name=APPLICANT["name"],
            loan_amount_requested=LOAN_REQUEST["amount_lakhs"],
            loan_purpose=LOAN_REQUEST["purpose"],
            status="INITIATED",
        )


async def run_pipeline(case_id: str) -> CaseFile:
    """
    Execute the full underwriting pipeline for a given case.
    Returns the final case file.
    """
    _preload_demo_case()
    case = _cases.get(case_id)
    if not case:
        raise ValueError(f"Case {case_id} not found")

    case.status = "PIPELINE_RUNNING"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] Orchestrator: Pipeline started for {case_id}")

    # Step 1: Document Intake
    case = await doc_intake.run(case)
    _cases[case_id] = case

    if "INCOMPLETE" in case.a2a_messages[-1].type:
        case.status = "DOCS_INCOMPLETE"
        return case

    # Step 2: Cash-Flow Analysis
    case = await cashflow.run(case)
    _cases[case_id] = case

    # Step 3: Fraud Investigation (with re-routing support)
    while True:
        case = await fraud.run(case)
        _cases[case_id] = case

        if case.fraud.fraud_signal == "FRAUD_CONFIRMED":
            case.status = "FRAUD_CONFIRMED_DECLINED"
            case.a2a_messages.append(A2AMessage(
                time=datetime.utcnow().strftime("%H:%M:%S"),
                agent="Orchestrator",
                type="PIPELINE_HALTED",
                detail="FRAUD_CONFIRMED — Pipeline halted. Case referred to investigation team.",
            ))
            return case

        if case.fraud.fraud_signal == "FRAUD_SUSPECTED" and case.reroute_count < MAX_REROUTES:
            case.reroute_count += 1
            case.agent_log.append(
                f"[{datetime.utcnow().isoformat()}] Orchestrator: FRAUD_SUSPECTED — re-routing to DocIntake "
                f"(attempt {case.reroute_count}/{MAX_REROUTES})"
            )
            case.a2a_messages.append(A2AMessage(
                time=datetime.utcnow().strftime("%H:%M:%S"),
                agent="Orchestrator",
                type="REROUTE",
                detail=f"FRAUD_SUSPECTED — deeper KYC re-check #{case.reroute_count}",
            ))
            case = await doc_intake.run(case)  # deeper doc check
            _cases[case_id] = case
            continue

        break  # FRAUD_CLEAR or max reroutes exhausted

    # Step 4: Credit Risk
    case = await credit_risk.run(case)
    _cases[case_id] = case

    if case.credit_risk.risk_signal == "RISK_DECLINE":
        case.status = "RISK_DECLINED"
        return case

    # Step 5: Policy & Compliance
    case = await policy.run(case)
    _cases[case_id] = case

    if case.policy.policy_signal == "POLICY_BREACH":
        case.status = "POLICY_DECLINED"
        return case

    # Step 6: Loan Structuring
    case = await loan_structuring.run(case)
    _cases[case_id] = case

    # Step 7: CAM Generation
    case = await cam_generator.run(case)
    _cases[case_id] = case

    # Step 8: Post to Mock Ledger (PENDING_HUMAN_APPROVAL — no disbursal)
    t = case.loan_terms
    ledger_ref = post_pending_sanction(
        case_id=case_id,
        applicant_name=case.applicant_name,
        amount_lakhs=t.amount,
        rate_pct=t.rate_pct,
        tenor_months=t.tenor_months,
        emi_lakhs=t.emi,
    )
    case.ledger_ref = ledger_ref
    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="MockLedgerPost",
        type="LEDGER_POSTED",
        detail=f"{ledger_ref} — PENDING_HUMAN_APPROVAL",
    ))

    case.status = "AWAITING_HUMAN_APPROVAL"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] Orchestrator: Pipeline complete — awaiting human approval")
    _cases[case_id] = case
    return case


async def approve_case(case_id: str, officer_id: str, officer_name: str, notes: str | None) -> CaseFile:
    """Human officer approves the sanction."""
    from backend.ledger.mock_ledger import approve_sanction
    case = _cases.get(case_id)
    if not case:
        raise ValueError(f"Case {case_id} not found")
    if case.ledger_ref:
        approve_sanction(case.ledger_ref, officer_id, officer_name, notes)
    case.approval_status = "APPROVED"
    case.status = "SANCTIONED"
    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="HumanUnderwriter",
        type="APPROVED",
        detail=f"Approved by {officer_name} (ID: {officer_id})",
    ))
    _cases[case_id] = case
    return case


async def reject_case(case_id: str, officer_id: str, officer_name: str, notes: str | None) -> CaseFile:
    """Human officer rejects the application."""
    from backend.ledger.mock_ledger import reject_sanction
    case = _cases.get(case_id)
    if not case:
        raise ValueError(f"Case {case_id} not found")
    if case.ledger_ref:
        reject_sanction(case.ledger_ref, officer_id, officer_name, notes)
    case.approval_status = "REJECTED"
    case.status = "DECLINED"
    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="HumanUnderwriter",
        type="REJECTED",
        detail=f"Declined by {officer_name} (ID: {officer_id}). Reason: {notes or 'Not specified'}",
    ))
    _cases[case_id] = case
    return case

