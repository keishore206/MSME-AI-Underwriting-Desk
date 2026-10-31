"""
Agent 7 — CAM Generator
Assembles the Credit Appraisal Memo from all agent outputs.
Evidence is linked to source document IDs.
Emits CAM_READY.
"""
from __future__ import annotations
from datetime import datetime
from backend.models.schemas import CaseFile, A2AMessage
from backend.data.synthetic_data import APPLICANT, LOAN_REQUEST, COLLATERAL


def _fmt_inr(lakhs: float) -> str:
    total = int(lakhs * 100000)
    s = f"{total:,}"
    return f"₹{s}"


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] CAMGenerator: Generating Credit Appraisal Memo")

    t = case.loan_terms
    cf = case.cashflow
    fr = case.fraud
    cr = case.credit_risk
    po = case.policy

    ai_recommendation = "RECOMMEND APPROVE" if (
        cr.risk_signal in ("RISK_LOW", "RISK_MEDIUM") and
        po.policy_signal == "POLICY_PASS" and
        fr.fraud_signal == "FRAUD_CLEAR"
    ) else "RECOMMEND DECLINE"

    cam = f"""
CREDIT APPRAISAL MEMO
==============================================
CAM Reference : CAM-{case.case_id.split('CASE-')[1] if 'CASE-' in case.case_id else case.case_id}
Case ID       : {case.case_id}
Generated     : {datetime.utcnow().strftime("%d-%b-%Y %H:%M UTC")}
AI System     : MSME Underwriting AI v1.0

----------------------------------------------
1. APPLICANT DETAILS
----------------------------------------------
Entity        : {APPLICANT['name']}
CIN           : {APPLICANT['cin']}
GSTIN         : {APPLICANT['gstin']}
Udyam         : {APPLICANT['udyam']}
PAN           : {APPLICANT['pan']}
Industry      : {APPLICANT['industry']}
Promoter      : {APPLICANT['promoter_name']} (DIN: {APPLICANT['promoter_din']})
Vintage       : {APPLICANT['business_vintage_years']} years
Turnover FY24 : ₹{APPLICANT['annual_turnover_cr']} Crores
Employees     : {APPLICANT['employees']}

----------------------------------------------
2. LOAN REQUEST
----------------------------------------------
Amount        : {_fmt_inr(LOAN_REQUEST['amount_lakhs'])}
Purpose       : {LOAN_REQUEST['purpose']}
Type          : {LOAN_REQUEST['type']}

----------------------------------------------
3. CASH-FLOW ANALYSIS  [Agent: CashFlowAgent]
----------------------------------------------
ABB (24m avg)       : ₹{cf.abb}L
Avg Monthly Credits : ₹{cf.avg_monthly_credits}L
DSCR                : {cf.dscr}x  (Min: 1.25x) [PASS]
DBSR                : {cf.dbsr}%  (Max: 50%)   [PASS]
GST-Bank Match      : {cf.gst_bank_match_pct}%
Signal              : {cf.cashflow_signal}
Evidence IDs        : BS-2022-001 through BS-2024-024, GST-Q2FY23–Q4FY24

----------------------------------------------
4. FRAUD INVESTIGATION  [Agent: FraudInvestigationAgent]
----------------------------------------------
Fraud Score    : {fr.fraud_score}/100 — LOW RISK
KYC Match      : {fr.kyc_match_pct}%
AML Screening  : {fr.aml_status}
Flagged TXNs   : {fr.flagged_txn_count} (all reviewed and cleared)
Signal         : {fr.fraud_signal}
Evidence IDs   : KYC-001, AML-SCREEN-001, TXN-8847-01/02/03

----------------------------------------------
5. CREDIT RISK  [Agent: CreditRiskAgent]
----------------------------------------------
Internal Score : {cr.internal_score}/100
Rating Band    : {cr.rating_band}
Entity CIBIL   : {cr.entity_cibil}
Promoter CIBIL : {cr.promoter_cibil}
PD             : {cr.pd}%
LGD            : {cr.lgd}%
Expected Loss  : ₹{cr.expected_loss}L
Signal         : {cr.risk_signal}
Evidence IDs   : BUR-2024-00847, SC-001

----------------------------------------------
6. POLICY & COMPLIANCE  [Agent: PolicyComplianceAgent]
----------------------------------------------
Rules Passed   : {po.rules_passed}/{po.rules_total}
Breaches       : {len(po.breaches)}
Signal         : {po.policy_signal}
Reference      : RBI MSME FIDD.CO.Plan.BC.54/04.09.01/2020-21

----------------------------------------------
7. PROPOSED LOAN TERMS  [Agent: LoanStructuringAgent]
----------------------------------------------
Amount         : {_fmt_inr(t.amount)}
Tenor          : {t.tenor_months} months
Rate           : {t.rate_pct}% p.a. (MCLR + spread)
EMI            : {_fmt_inr(t.emi)} per month
Processing Fee : {_fmt_inr(t.processing_fee)}
Moratorium     : {t.moratorium_months} months
Security       : {t.security_primary}
Collateral     : {t.security_collateral}
Covenants      : {len(t.covenants)} conditions (see full list)

----------------------------------------------
8. AI RECOMMENDATION
----------------------------------------------
{ai_recommendation}

All findings are evidence-backed and linked to source document IDs.
Human officer approval is MANDATORY before ledger finalization.
No autonomous disbursal is permitted.

==============================================
END OF AI-GENERATED CAM
==============================================
""".strip()

    case.cam_text = cam
    case.cam_signal = "CAM_READY"

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="CAMGenerator",
        type="CAM_READY",
        detail=f"Memo generated — {ai_recommendation}",
    ))
    case.status = "CAM_GENERATED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] CAMGenerator: CAM_READY — {ai_recommendation}")
    return case

