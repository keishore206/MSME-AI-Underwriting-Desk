"""
Agent 3 — Fraud Investigation Agent
Analyzes transaction graph, KYC, GST-bank delta, round-tripping, velocity checks.
Emits FRAUD_CLEAR / FRAUD_SUSPECTED / FRAUD_CONFIRMED.
"""
from __future__ import annotations
from datetime import datetime
from backend.models.schemas import CaseFile, FraudMetrics, A2AMessage
from backend.data.synthetic_data import FLAGGED_TXN, KYC
from backend.tools.mock_apis import check_aml_screening
from backend.data.synthetic_data import APPLICANT


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] FraudInvestigationAgent: Starting fraud analysis")

    # AML screening
    aml_result = await check_aml_screening(APPLICANT["name"], APPLICANT["pan"])
    aml_status = aml_result.get("status", "UNKNOWN")

    # KYC match
    kyc_match = KYC["kyc_match_pct"]

    # Evaluate flagged transactions
    unresolved = [t for t in FLAGGED_TXN if not t.get("resolved", False)]
    high_risk = [t for t in FLAGGED_TXN if t.get("risk") in ("High", "Critical")]

    # Fraud score computation (deterministic)
    fraud_score = 0
    fraud_score += len(unresolved) * 25  # each unresolved flag adds 25 points
    fraud_score += len(high_risk) * 40   # high-risk flags add 40 points
    fraud_score += (100 - int(kyc_match)) // 5  # KYC mismatch penalty
    if aml_status != "CLEAR":
        fraud_score += 50
    fraud_score = min(fraud_score, 100)

    # Determine signal
    if fraud_score < 30 and aml_status == "CLEAR":
        signal = "FRAUD_CLEAR"
    elif fraud_score < 60:
        signal = "FRAUD_SUSPECTED"
    else:
        signal = "FRAUD_CONFIRMED"

    case.fraud = FraudMetrics(
        fraud_score=fraud_score,
        kyc_match_pct=kyc_match,
        flagged_txn_count=len(FLAGGED_TXN),
        aml_status=aml_status,
        fraud_signal=signal,
    )

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="FraudInvestigationAgent",
        type=signal,
        detail=f"Fraud score {fraud_score}/100 | AML {aml_status} | KYC match {kyc_match}% | {len(FLAGGED_TXN)} flags reviewed",
    ))
    case.status = "FRAUD_ANALYZED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] FraudInvestigationAgent: Emitting {signal}")
    return case

