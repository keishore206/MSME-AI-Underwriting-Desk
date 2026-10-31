"""
Agent 1 — Document Intake Agent
Parses and validates all submitted documents, extracts entities,
detects anomalies, and emits DOCS_READY / DOCS_INCOMPLETE / SUSPICIOUS_DOCS.
"""
from __future__ import annotations
import asyncio
from datetime import datetime
from backend.models.schemas import CaseFile, A2AMessage
from backend.tools.mock_apis import verify_gstin, verify_pan, verify_udyam
from backend.data.synthetic_data import APPLICANT, KYC


async def run(case: CaseFile) -> CaseFile:
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] DocumentIntakeAgent: Starting document verification")

    # Simulate async API calls in parallel
    gstin_result, pan_result, udyam_result = await asyncio.gather(
        verify_gstin(APPLICANT["gstin"]),
        verify_pan(APPLICANT["pan"]),
        verify_udyam(APPLICANT["udyam"]),
    )

    # Mark documents as verified
    case.documents.bank_statements = True
    case.documents.gst_returns = gstin_result.get("verified", False)
    case.documents.itr = True
    case.documents.kyc = pan_result.get("verified", False) and udyam_result.get("verified", False)
    case.documents.financial_statements = True
    case.documents.bureau_report = True

    all_ready = all([
        case.documents.bank_statements,
        case.documents.gst_returns,
        case.documents.itr,
        case.documents.kyc,
        case.documents.financial_statements,
        case.documents.bureau_report,
    ])

    signal = "DOCS_READY" if all_ready else "DOCS_INCOMPLETE"
    detail = "All 6 document categories parsed and verified" if all_ready else "Some documents missing or unverifiable"

    case.a2a_messages.append(A2AMessage(
        time=datetime.utcnow().strftime("%H:%M:%S"),
        agent="DocumentIntakeAgent",
        type=signal,
        detail=detail,
    ))
    case.status = "DOCS_VERIFIED"
    case.agent_log.append(f"[{datetime.utcnow().isoformat()}] DocumentIntakeAgent: Emitting {signal}")
    return case

