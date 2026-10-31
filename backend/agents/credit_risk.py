"""
Agent 4 — Credit Risk Agent
Computes internal credit score, PD, LGD, EL, rating band.
Emits RISK_LOW / RISK_MEDIUM / RISK_HIGH / RISK_DECLINE.
"""
from __future__ import annotations
from datetime import datetime
from backend.models.schemas import CaseFile, CreditRiskMetrics, A2AMessage
from backend.data.synthetic_data import BUREAU, COLLATERAL, APPLICANT, FINANCIALS, LOAN_REQUEST
from backend.tools.calculators import (
    calculate_pd, calculate_lgd, calculate_expected_loss,
    calculate_ltv, internal_credit_score,
)


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] CreditRiskAgent: Computing credit risk metrics")

    entity_cibil = BUREAU["entity_cibil"]
    promoter_cibil = BUREAU["promoter_cibil"]
    dpd = BUREAU["dpd_24m"]
    vintage = APPLICANT["business_vintage_years"]
    property_value = COLLATERAL["property_value_lakhs"]
    loan_amount = LOAN_REQUEST["amount_lakhs"]

    ltv = calculate_ltv(loan_amount, property_value)
    pd = calculate_pd(entity_cibil, dpd, vintage)
    lgd = calculate_lgd(ltv)
    el = calculate_expected_loss(loan_amount, pd, lgd)

    # Revenue growth FY23 -> FY24
    rev_fy23 = FINANCIALS["fy23"]["revenue_cr"]
    rev_fy24 = FINANCIALS["fy24"]["revenue_cr"]
    rev_growth = ((rev_fy24 - rev_fy23) / rev_fy23) * 100

    score, band = internal_credit_score(
        dscr=case.cashflow.dscr,
        entity_cibil=entity_cibil,
        promoter_cibil=promoter_cibil,
        vintage_years=vintage,
        revenue_growth_pct=rev_growth,
        ltv_pct=ltv,
    )

    # Determine signal
    if score >= 80 and pd < 5:
        signal = "RISK_LOW"
    elif score >= 65 and pd < 10:
        signal = "RISK_MEDIUM"
    elif score >= 50:
        signal = "RISK_HIGH"
    else:
        signal = "RISK_DECLINE"

    case.credit_risk = CreditRiskMetrics(
        internal_score=score,
        rating_band=band,
        entity_cibil=entity_cibil,
        promoter_cibil=promoter_cibil,
        pd=pd,
        lgd=lgd,
        expected_loss=el,
        risk_signal=signal,
    )

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="CreditRiskAgent",
        type=signal,
        detail=f"Score {score}/100 | Band {band} | PD {pd}% | LGD {lgd}% | EL ₹{el}L",
    ))
    case.status = "RISK_ASSESSED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] CreditRiskAgent: Emitting {signal}")
    return case

