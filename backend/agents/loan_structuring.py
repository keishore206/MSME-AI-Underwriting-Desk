"""
Agent 6 — Loan Structuring Agent
Proposes compliant loan terms: amount, rate, tenor, EMI, security, covenants.
Emits TERMS_PROPOSED / TERMS_REVISED.
"""
from __future__ import annotations
from datetime import datetime
from backend.models.schemas import CaseFile, LoanTerms, A2AMessage
from backend.data.synthetic_data import LOAN_REQUEST, COLLATERAL
from backend.tools.calculators import calculate_emi, pricing_model


MCLR_BASE = 9.50   # Mock MCLR rate (%)
RISK_PREMIUM_BPS = 25  # Risk premium for A- rated MSME


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] LoanStructuringAgent: Structuring loan terms")

    # Interest rate: MCLR + risk premium + rating spread
    rate = pricing_model(MCLR_BASE, RISK_PREMIUM_BPS, case.credit_risk.rating_band)
    amount = LOAN_REQUEST["amount_lakhs"]
    tenor = 60  # months

    emi = calculate_emi(amount, rate, tenor)
    processing_fee = round(amount * 0.01, 2)

    covenants = [
        "Submit annual audited financial statements within 90 days of FY close",
        "File quarterly GST returns on time; share copies with lender",
        "Maintain DSCR >= 1.25x throughout loan tenure",
        "No further borrowings above ₹10L without prior lender approval",
        "Property mortgage documents to be registered before first disbursement",
        "NACH mandate for EMI auto-debit mandatory",
    ]

    signal = "TERMS_PROPOSED"

    case.loan_terms = LoanTerms(
        amount=amount,
        tenor_months=tenor,
        rate_pct=rate,
        emi=emi,
        processing_fee=processing_fee,
        security_primary=COLLATERAL["primary"],
        security_collateral=COLLATERAL["collateral"],
        moratorium_months=3,
        covenants=covenants,
        terms_signal=signal,
    )

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="LoanStructuringAgent",
        type=signal,
        detail=f"₹{amount}L @ {rate}% / {tenor}m | EMI ₹{emi:.2f}L | Fee ₹{processing_fee}L",
    ))
    case.status = "TERMS_STRUCTURED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] LoanStructuringAgent: Emitting {signal}")
    return case

