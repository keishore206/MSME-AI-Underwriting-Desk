"""
Deterministic financial calculators for MSME underwriting.
All calculations are performed in Python code — never delegated to LLMs.
"""
from __future__ import annotations
import math


def calculate_abb(monthly_credits: list[float]) -> float:
    """Average Bank Balance proxy from monthly credits."""
    if not monthly_credits:
        return 0.0
    return round(sum(monthly_credits) / len(monthly_credits) * 0.26, 2)  # ~26% retention heuristic


def calculate_dscr(net_annual_income: float, annual_debt_service: float) -> float:
    """Debt Service Coverage Ratio = Net Operating Income / Annual Debt Service."""
    if annual_debt_service <= 0:
        return 0.0
    return round(net_annual_income / annual_debt_service, 2)


def calculate_emi(principal: float, rate_annual_pct: float, tenor_months: int) -> float:
    """Calculate monthly EMI using reducing-balance formula (amounts in lakhs)."""
    if tenor_months <= 0 or rate_annual_pct <= 0:
        return round(principal / max(tenor_months, 1), 2)
    r = rate_annual_pct / (12 * 100)
    emi = principal * r * math.pow(1 + r, tenor_months) / (math.pow(1 + r, tenor_months) - 1)
    return round(emi, 4)


def calculate_dbsr(monthly_emi: float, avg_monthly_credits: float) -> float:
    """Debt Burden Service Ratio = Monthly EMI / Avg Monthly Credits × 100 (%)."""
    if avg_monthly_credits <= 0:
        return 100.0
    return round((monthly_emi / avg_monthly_credits) * 100, 2)


def calculate_pd(credit_score: int, dpd_count: int, vintage_years: int) -> float:
    """Simplified PD (Probability of Default) estimate (%)."""
    base = max(0, (850 - credit_score) / 850 * 15)
    dpd_penalty = dpd_count * 2.5
    vintage_discount = max(0, (vintage_years - 2) * 0.3)
    pd = max(0.5, base + dpd_penalty - vintage_discount)
    return round(min(pd, 99.0), 2)


def calculate_lgd(ltv_pct: float) -> float:
    """Loss Given Default estimate based on LTV (%)."""
    if ltv_pct < 50:
        return 25.0
    elif ltv_pct < 65:
        return 35.0
    elif ltv_pct < 75:
        return 45.0
    return 55.0


def calculate_expected_loss(principal_lakhs: float, pd_pct: float, lgd_pct: float) -> float:
    """Expected Loss = PD × LGD × EAD (in lakhs)."""
    return round(principal_lakhs * (pd_pct / 100) * (lgd_pct / 100), 2)


def calculate_ltv(loan_amount_lakhs: float, collateral_value_lakhs: float) -> float:
    """Loan-to-Value Ratio (%)."""
    if collateral_value_lakhs <= 0:
        return 100.0
    return round((loan_amount_lakhs / collateral_value_lakhs) * 100, 2)


def stress_test(base_dscr: float, revenue_shock_pct: float, rate_shock_bps: int,
                monthly_emi: float, avg_monthly_credits: float, principal_lakhs: float,
                original_rate_pct: float, tenor_months: int) -> dict:
    """Run a stress scenario and return DSCR + EMI under stress."""
    shocked_credits = avg_monthly_credits * (1 - revenue_shock_pct / 100)
    shocked_rate = original_rate_pct + rate_shock_bps / 100
    shocked_emi = calculate_emi(principal_lakhs, shocked_rate, tenor_months)
    annual_income = shocked_credits * 12 * 0.24  # net income proxy
    annual_debt = shocked_emi * 12
    stressed_dscr = calculate_dscr(annual_income, annual_debt)
    return {
        "revenue_shock_pct": revenue_shock_pct,
        "rate_shock_bps": rate_shock_bps,
        "stressed_dscr": stressed_dscr,
        "stressed_emi_lakhs": shocked_emi,
        "pass": stressed_dscr >= 1.25,
    }


def internal_credit_score(
    dscr: float,
    entity_cibil: int,
    promoter_cibil: int,
    vintage_years: int,
    revenue_growth_pct: float,
    ltv_pct: float,
) -> tuple[int, str]:
    """Compute weighted internal credit score and return (score, rating_band)."""
    # Individual component scores (0-100)
    cashflow_score = min(100, max(0, int((dscr / 3.0) * 100)))
    credit_score = min(100, max(0, int(((entity_cibil - 300) / 600) * 100)))
    promoter_credit = min(100, max(0, int(((promoter_cibil - 300) / 600) * 100)))
    vintage_score = min(100, max(0, int((min(vintage_years, 15) / 15) * 100)))
    growth_score = min(100, max(0, 50 + int(revenue_growth_pct * 2)))
    collateral_score = min(100, max(0, int((1 - ltv_pct / 100) * 100)))

    weighted = int(
        cashflow_score * 0.25 +
        credit_score * 0.20 +
        promoter_credit * 0.15 +
        vintage_score * 0.15 +
        growth_score * 0.15 +
        collateral_score * 0.10
    )

    if weighted >= 85:
        band = "AA"
    elif weighted >= 78:
        band = "A+"
    elif weighted >= 72:
        band = "A-"
    elif weighted >= 65:
        band = "BBB"
    elif weighted >= 55:
        band = "BB"
    else:
        band = "B or below"

    return weighted, band


def pricing_model(base_rate_pct: float, risk_premium_bps: int, rating_band: str) -> float:
    """Determine final interest rate based on risk rating."""
    band_premium = {
        "AA": 0, "A+": 25, "A-": 50, "BBB": 100, "BB": 175, "B or below": 250
    }
    premium = band_premium.get(rating_band, 200) + risk_premium_bps
    return round(base_rate_pct + premium / 100, 2)

