"""
Mock API functions simulating external bureau, GST, Udyam, and AML lookups.
All responses are deterministic synthetic data — no real API calls.
"""
from __future__ import annotations
import asyncio
from backend.data.synthetic_data import APPLICANT, BUREAU, KYC


async def verify_gstin(gstin: str) -> dict:
    """Mock GSTN verification."""
    await asyncio.sleep(0.05)
    if gstin == APPLICANT["gstin"]:
        return {"status": "ACTIVE", "legal_name": APPLICANT["name"], "gstin": gstin,
                "registration_date": "2018-07-15", "gst_category": "Regular", "verified": True}
    return {"status": "NOT_FOUND", "verified": False}


async def verify_pan(pan: str) -> dict:
    """Mock PAN verification."""
    await asyncio.sleep(0.05)
    if pan in (APPLICANT["pan"], APPLICANT["promoter_pan"]):
        return {"status": "ACTIVE", "pan": pan, "name_match": True, "verified": True}
    return {"status": "NOT_FOUND", "verified": False}


async def verify_udyam(udyam: str) -> dict:
    """Mock Udyam (MSME) registration verification."""
    await asyncio.sleep(0.05)
    if udyam == APPLICANT["udyam"]:
        return {
            "status": "ACTIVE", "udyam_number": udyam,
            "enterprise_name": APPLICANT["name"], "category": "Small",
            "activity": "Manufacturing", "verified": True,
            "registration_date": "2020-04-10"
        }
    return {"status": "NOT_FOUND", "verified": False}


async def fetch_bureau_report(entity_pan: str, promoter_pan: str) -> dict:
    """Mock CIBIL/Experian bureau report."""
    await asyncio.sleep(0.1)
    return {
        "entity_cibil": BUREAU["entity_cibil"],
        "promoter_cibil": BUREAU["promoter_cibil"],
        "existing_exposure_lakhs": BUREAU["existing_exposure_lakhs"],
        "overdue_amount": BUREAU["overdue_amount"],
        "dpd_24m": BUREAU["dpd_24m"],
        "enquiries_6m": BUREAU["enquiries_6m"],
        "lender": BUREAU["lender"],
        "facility": BUREAU["facility"],
        "report_date": "2024-10-28",
        "source": "CIBIL mock",
    }


async def check_aml_screening(name: str, pan: str) -> dict:
    """Mock AML / OFAC / RBI Defaulter List screening."""
    await asyncio.sleep(0.05)
    return {
        "status": "CLEAR",
        "watchlists_checked": ["RBI Defaulter", "CIBIL Wilful Defaulter", "OFAC SDN", "UN Sanctions"],
        "hits": 0,
        "entity_name": name,
        "screened_at": "2024-10-28T09:00:00Z",
    }

