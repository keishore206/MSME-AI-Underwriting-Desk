"""Synthetic data for CASE-2024-00847: Rajesh Textiles Pvt. Ltd."""
from __future__ import annotations

CASE_ID = "CASE-2024-00847"
APPLICANT = {
    "name": "Rajesh Textiles Pvt. Ltd.",
    "cin": "U17114GJ2016PTC082341",
    "gstin": "29AAJCR8732L1Z2",
    "udyam": "UDYAM-KA-07-0048231",
    "pan": "AAJCR8732L",
    "industry": "Synthetic Textile Manufacturing (NIC 13121)",
    "promoter_name": "Rajesh Kumar Sharma",
    "promoter_din": "07432198",
    "promoter_pan": "BRQPS4892K",
    "business_vintage_years": 8,
    "annual_turnover_cr": 5.82,
    "employees": 47,
    "city": "Surat",
    "state": "Gujarat",
}

LOAN_REQUEST = {
    "amount_lakhs": 45.0,
    "purpose": "Acquisition of new weaving machinery to expand production capacity by 30%",
    "type": "Term Loan — Equipment Finance",
}

# 24-month bank statement summary (amounts in lakhs)
BANK_STATEMENT = [
    {"month": "Nov-22", "credits": 38.2, "debits": 29.1, "net": 9.1},
    {"month": "Dec-22", "credits": 42.5, "debits": 31.8, "net": 10.7},
    {"month": "Jan-23", "credits": 35.1, "debits": 28.4, "net": 6.7},
    {"month": "Feb-23", "credits": 39.8, "debits": 30.2, "net": 9.6},
    {"month": "Mar-23", "credits": 55.4, "debits": 38.9, "net": 16.5},
    {"month": "Apr-23", "credits": 37.2, "debits": 29.6, "net": 7.6},
    {"month": "May-23", "credits": 40.1, "debits": 31.3, "net": 8.8},
    {"month": "Jun-23", "credits": 43.7, "debits": 33.1, "net": 10.6},
    {"month": "Jul-23", "credits": 46.2, "debits": 34.8, "net": 11.4},
    {"month": "Aug-23", "credits": 41.9, "debits": 32.4, "net": 9.5},
    {"month": "Sep-23", "credits": 44.3, "debits": 33.7, "net": 10.6},
    {"month": "Oct-23", "credits": 53.1, "debits": 39.2, "net": 13.9},
    {"month": "Nov-23", "credits": 47.8, "debits": 35.6, "net": 12.2},
    {"month": "Dec-23", "credits": 58.9, "debits": 42.1, "net": 16.8},
    {"month": "Jan-24", "credits": 42.3, "debits": 33.5, "net": 8.8},
    {"month": "Feb-24", "credits": 45.6, "debits": 34.9, "net": 10.7},
    {"month": "Mar-24", "credits": 62.1, "debits": 44.3, "net": 17.8},
    {"month": "Apr-24", "credits": 43.5, "debits": 33.8, "net": 9.7},
    {"month": "May-24", "credits": 46.2, "debits": 35.1, "net": 11.1},
    {"month": "Jun-24", "credits": 48.9, "debits": 36.4, "net": 12.5},
    {"month": "Jul-24", "credits": 51.3, "debits": 37.9, "net": 13.4},
    {"month": "Aug-24", "credits": 49.1, "debits": 36.8, "net": 12.3},
    {"month": "Sep-24", "credits": 52.4, "debits": 38.5, "net": 13.9},
    {"month": "Oct-24", "credits": 55.7, "debits": 40.2, "net": 15.5},
]

# GST returns (quarterly, in lakhs)
GST_RETURNS = [
    {"period": "Q2 FY23", "gst_turnover": 108.4},
    {"period": "Q3 FY23", "gst_turnover": 119.2},
    {"period": "Q4 FY23", "gst_turnover": 148.5},
    {"period": "Q1 FY24", "gst_turnover": 115.7},
    {"period": "Q2 FY24", "gst_turnover": 124.8},
    {"period": "Q3 FY24", "gst_turnover": 138.2},
    {"period": "Q4 FY24", "gst_turnover": 157.4},
]

# Bureau data
BUREAU = {
    "entity_cibil": 748,
    "promoter_cibil": 762,
    "existing_exposure_lakhs": 18.5,
    "overdue_amount": 0,
    "dpd_24m": 0,
    "enquiries_6m": 2,
    "lender": "State Bank of India",
    "facility": "Cash Credit",
}

# KYC data
KYC = {
    "aadhaar_verified": True,
    "pan_verified": True,
    "gstin_verified": True,
    "udyam_verified": True,
    "aml_clear": True,
    "kyc_match_pct": 98.0,
}

# Flagged transactions
FLAGGED_TXN = [
    {"id": "TXN-8847-01", "type": "Round-Trip", "amount_lakhs": 2.4, "date": "2024-08-12",
     "parties": "Acc 1 -> XYZ Trading -> Acc 2", "risk": "Medium", "resolved": True,
     "resolution": "Amount below ₹5L threshold. Pattern consistent with seasonal trade return."},
    {"id": "TXN-8847-02", "type": "Velocity Spike", "amount_lakhs": 7.8, "date": "2024-09-03",
     "parties": "Single-day mass credits from 11 parties", "risk": "Low", "resolved": True,
     "resolution": "Festival season advance payments from distributors — GST invoices matched."},
    {"id": "TXN-8847-03", "type": "GST-Bank Delta", "amount_lakhs": None, "date": "Sep-Oct 24",
     "parties": "GST declared vs bank credits mismatch 3.7%", "risk": "Low", "resolved": True,
     "resolution": "3.7% delta within acceptable 5% threshold."},
]

# Financial statements summary
FINANCIALS = {
    "fy22": {"revenue_cr": 4.12, "ebitda_cr": 0.64, "pat_cr": 0.38, "total_debt_lakhs": 22.4},
    "fy23": {"revenue_cr": 4.91, "ebitda_cr": 0.79, "pat_cr": 0.47, "total_debt_lakhs": 20.1},
    "fy24": {"revenue_cr": 5.82, "ebitda_cr": 0.97, "pat_cr": 0.61, "total_debt_lakhs": 18.5},
}

# Proposed collateral
COLLATERAL = {
    "primary": "Hypothecation of machinery (estimated value ₹58L)",
    "collateral": "Equitable mortgage — commercial property, Surat (₹77L)",
    "property_value_lakhs": 77.0,
    "machinery_value_lakhs": 58.0,
}

# Lending policy limits (hard-coded, enforced in code)
POLICY_LIMITS = {
    "min_dscr": 1.25,
    "max_ltv_pct": 75.0,
    "min_credit_score": 650,
    "max_dbsr_pct": 50.0,
    "min_vintage_years": 2,
    "sector_exposure_ceiling_lakhs": 150.0,
    "max_reroutes": 5,
}

