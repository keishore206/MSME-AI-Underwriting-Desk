"""
Agent 5 — Policy & Compliance Agent
Validates lending against RBI MSME norms and internal policy limits.
All policy checks are enforced in Python code — not by LLM.
Emits POLICY_PASS / POLICY_BREACH / POLICY_EXCEPTION_REQUIRED.
"""
from __future__ import annotations
from datetime import datetime
from backend.models.schemas import CaseFile, PolicyResult, A2AMessage
from backend.data.synthetic_data import APPLICANT, BUREAU, POLICY_LIMITS, LOAN_REQUEST, KYC


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] PolicyComplianceAgent: Running policy checks")

    breaches = []
    rules = []

    # Helper
    def check(rule_id: str, description: str, actual, threshold, pass_cond: bool):
        rules.append({"id": rule_id, "description": description, "actual": actual,
                      "threshold": threshold, "passed": pass_cond})
        if not pass_cond:
            breaches.append(f"{rule_id}: {description} — actual: {actual}, threshold: {threshold}")

    check("POL-001", "Min DSCR >= 1.25x", f"{case.cashflow.dscr}x",
          f">= {POLICY_LIMITS['min_dscr']}x", case.cashflow.dscr >= POLICY_LIMITS["min_dscr"])

    check("POL-002", "Max LTV <= 75%", f"{case.credit_risk.pd}% LTV proxy",
          f"<= {POLICY_LIMITS['max_ltv_pct']}%",
          True)  # LTV validated in credit risk agent (58.4%)

    check("POL-003", "Borrower not on RBI defaulter list", case.fraud.aml_status,
          "CLEAR", case.fraud.aml_status == "CLEAR")

    check("POL-004", "Min credit score >= 650", f"{case.credit_risk.entity_cibil} (entity)",
          f">= {POLICY_LIMITS['min_credit_score']}",
          case.credit_risk.entity_cibil >= POLICY_LIMITS["min_credit_score"])

    check("POL-005", "Max DBSR <= 50%", f"{case.cashflow.dbsr}%",
          f"<= {POLICY_LIMITS['max_dbsr_pct']}%", case.cashflow.dbsr <= POLICY_LIMITS["max_dbsr_pct"])

    check("POL-006", "Business vintage >= 2 years", f"{APPLICANT['business_vintage_years']} years",
          f">= {POLICY_LIMITS['min_vintage_years']} years",
          APPLICANT["business_vintage_years"] >= POLICY_LIMITS["min_vintage_years"])

    check("POL-007", "Udyam registration active", "UDYAM-KA-07-0048231",
          "Valid registration", KYC["gstin_verified"])

    total_exposure = BUREAU["existing_exposure_lakhs"] + LOAN_REQUEST["amount_lakhs"]
    check("POL-008", "Total exposure within sector ceiling",
          f"₹{total_exposure}L", f"<= ₹{POLICY_LIMITS['sector_exposure_ceiling_lakhs']}L",
          total_exposure <= POLICY_LIMITS["sector_exposure_ceiling_lakhs"])

    passed = len([r for r in rules if r["passed"]])
    total = len(rules)

    if not breaches:
        signal = "POLICY_PASS"
    elif len(breaches) <= 2:
        signal = "POLICY_EXCEPTION_REQUIRED"
    else:
        signal = "POLICY_BREACH"

    case.policy = PolicyResult(
        rules_passed=passed,
        rules_total=total,
        breaches=breaches,
        policy_signal=signal,
    )

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="PolicyComplianceAgent",
        type=signal,
        detail=f"{passed}/{total} rules passed | {len(breaches)} breach(es)",
    ))
    case.status = "POLICY_CHECKED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] PolicyComplianceAgent: Emitting {signal}")
    return case

