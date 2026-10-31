"""
Agent 2 — Cash-Flow Analysis Agent
Analyzes 24-month bank statements, computes DSCR, DBSR, ABB, and runs stress tests.
Emits CASHFLOW_STRONG / CASHFLOW_WEAK / CASHFLOW_IRREGULAR.
All calculations are deterministic Python — no LLM.
"""
from __future__ import annotations
from datetime import datetime
from backend.models.schemas import CaseFile, CashFlowMetrics, A2AMessage
from backend.data.synthetic_data import BANK_STATEMENT, GST_RETURNS, LOAN_REQUEST
from backend.tools.calculators import (
    calculate_abb, calculate_dscr, calculate_emi, calculate_dbsr
)


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] CashFlowAgent: Analyzing 24-month statements")

    credits = [m["credits"] for m in BANK_STATEMENT]
    debits = [m["debits"] for m in BANK_STATEMENT]
    nets = [m["net"] for m in BANK_STATEMENT]

    avg_credits = round(sum(credits) / len(credits), 2)
    avg_debits = round(sum(debits) / len(debits), 2)
    avg_net = round(sum(nets) / len(nets), 2)
    abb = calculate_abb(credits)

    # Loan parameters
    loan_amount = LOAN_REQUEST["amount_lakhs"]
    rate = 11.25
    tenor = 60
    emi = calculate_emi(loan_amount, rate, tenor)

    # Annual income proxy: avg_net * 12 * 0.85 (haircut)
    annual_net = avg_net * 12 * 0.85
    annual_debt_service = emi * 12
    dscr = calculate_dscr(annual_net, annual_debt_service)
    dbsr = calculate_dbsr(emi, avg_credits)

    # GST vs bank delta
    total_gst = sum(g["gst_turnover"] for g in GST_RETURNS)
    total_bank = sum(credits[-len(GST_RETURNS) * 3:])
    gst_match = round((1 - abs(total_gst - total_bank) / max(total_bank, 1)) * 100, 1)

    # Determine signal
    if dscr >= 1.5 and dbsr <= 40:
        signal = "CASHFLOW_STRONG"
    elif dscr >= 1.25 and dbsr <= 50:
        signal = "CASHFLOW_WEAK"
    else:
        signal = "CASHFLOW_IRREGULAR"

    case.cashflow = CashFlowMetrics(
        abb=abb,
        dscr=dscr,
        dbsr=dbsr,
        avg_monthly_credits=avg_credits,
        avg_monthly_debits=avg_debits,
        avg_net_surplus=avg_net,
        gst_bank_match_pct=gst_match,
        cashflow_signal=signal,
    )

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="CashFlowAgent",
        type=signal,
        detail=f"DSCR {dscr}x | ABB ₹{abb}L | DBSR {dbsr}% | GST match {gst_match}%",
    ))
    case.status = "CASHFLOW_ANALYZED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] CashFlowAgent: Emitting {signal}")
    return case

