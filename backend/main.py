"""
FastAPI application — MSME Underwriting AI Backend
Exposes REST endpoints + WebSocket for real-time pipeline events.
"""
from __future__ import annotations
import asyncio
import json
from datetime import datetime

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from backend.models.schemas import (
    NewCaseRequest, ApprovalRequest, PipelineStatusResponse, CaseFile
)
from backend.agents.orchestrator import (
    run_pipeline, approve_case, reject_case,
    get_case, list_cases, create_case, _preload_demo_case,
)
from backend.data.synthetic_data import CASE_ID, APPLICANT, LOAN_REQUEST
from backend.ledger.mock_ledger import init_ledger, list_sanctions

app = FastAPI(
    title="MSME Loan Underwriting AI",
    description="Multi-agent AI underwriting system — demo backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections
_ws_clients: list[WebSocket] = []


@app.on_event("startup")
async def startup():
    init_ledger()
    _preload_demo_case()


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat(), "service": "MSME Underwriting AI"}


# ---------------------------------------------------------------------------
# Cases
# ---------------------------------------------------------------------------
@app.get("/cases")
async def get_all_cases():
    """List all cases."""
    cases = list_cases()
    return [
        {
            "case_id": c.case_id,
            "applicant_name": c.applicant_name,
            "loan_amount_requested": c.loan_amount_requested,
            "status": c.status,
            "approval_status": c.approval_status,
            "created_at": c.created_at,
        }
        for c in cases
    ]


@app.post("/cases")
async def create_new_case(req: NewCaseRequest):
    """Create a new underwriting case."""
    case_id = f"CASE-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    case = create_case(case_id, req.applicant_name, req.loan_amount_requested, req.loan_purpose)
    return {"case_id": case.case_id, "status": case.status}


@app.get("/cases/{case_id}", response_model=PipelineStatusResponse)
async def get_case_detail(case_id: str):
    """Get full case status including all agent outputs."""
    case = get_case(case_id)
    if not case:
        # Auto-create the demo case if requested
        if case_id == CASE_ID:
            _preload_demo_case()
            case = get_case(case_id)
        else:
            raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return PipelineStatusResponse(
        case_id=case.case_id,
        status=case.status,
        approval_status=case.approval_status,
        a2a_messages=case.a2a_messages,
        cashflow=case.cashflow,
        fraud=case.fraud,
        credit_risk=case.credit_risk,
        policy=case.policy,
        loan_terms=case.loan_terms,
        cam_signal=case.cam_signal,
        ledger_ref=case.ledger_ref,
    )


@app.post("/cases/{case_id}/run-pipeline")
async def run_case_pipeline(case_id: str):
    """
    Trigger the full underwriting pipeline for a case.
    Runs all 6 agents + CAM + Ledger posting.
    """
    if case_id == CASE_ID:
        _preload_demo_case()

    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    if case.status == "PIPELINE_RUNNING":
        raise HTTPException(status_code=409, detail="Pipeline already running for this case")

    # Run pipeline
    result = await run_pipeline(case_id)

    # Broadcast to WebSocket clients
    await _broadcast({
        "event": "PIPELINE_COMPLETE",
        "case_id": case_id,
        "status": result.status,
        "a2a_count": len(result.a2a_messages),
    })

    return {
        "case_id": result.case_id,
        "status": result.status,
        "approval_status": result.approval_status,
        "ledger_ref": result.ledger_ref,
        "a2a_messages": [m.model_dump() for m in result.a2a_messages],
        "fraud_score": result.fraud.fraud_score,
        "dscr": result.cashflow.dscr,
        "rating_band": result.credit_risk.rating_band,
        "policy_signal": result.policy.policy_signal,
        "cam_signal": result.cam_signal,
    }


@app.get("/cases/{case_id}/cam")
async def get_cam(case_id: str):
    """Get the raw CAM text for a case."""
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    if not case.cam_text:
        raise HTTPException(status_code=404, detail="CAM not yet generated. Run the pipeline first.")
    return {"case_id": case_id, "cam_text": case.cam_text, "cam_signal": case.cam_signal}


@app.get("/cases/{case_id}/log")
async def get_agent_log(case_id: str):
    """Get agent execution log for a case."""
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return {"case_id": case_id, "log": case.agent_log}


# ---------------------------------------------------------------------------
# Human Approval Gate
# ---------------------------------------------------------------------------
@app.post("/cases/{case_id}/approve")
async def approve_case_route(case_id: str, req: ApprovalRequest):
    """
    Human officer approval gate.
    action: 'approve' | 'reject' | 'request_more_info'
    This is the ONLY way to finalize a sanction — no autonomous path exists.
    """
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    if case.approval_status in ("APPROVED", "REJECTED"):
        raise HTTPException(status_code=409, detail=f"Case already {case.approval_status}")

    if req.action == "approve":
        result = await approve_case(case_id, req.officer_id, req.officer_name, req.notes)
        await _broadcast({"event": "CASE_APPROVED", "case_id": case_id, "officer": req.officer_name})
        return {"case_id": case_id, "status": result.status, "ledger_ref": result.ledger_ref}

    elif req.action == "reject":
        result = await reject_case(case_id, req.officer_id, req.officer_name, req.notes)
        await _broadcast({"event": "CASE_REJECTED", "case_id": case_id, "officer": req.officer_name})
        return {"case_id": case_id, "status": result.status}

    elif req.action == "request_more_info":
        case.status = "MORE_INFO_REQUESTED"
        case.a2a_messages.append(
            __import__("backend.models.schemas", fromlist=["A2AMessage"]).A2AMessage(
                time=datetime.utcnow().strftime("%H:%M:%S"),
                agent="HumanUnderwriter",
                type="MORE_INFO_REQUESTED",
                detail=f"Requested by {req.officer_name}: {req.notes or 'Additional documents needed'}",
            )
        )
        return {"case_id": case_id, "status": "MORE_INFO_REQUESTED"}

    raise HTTPException(status_code=400, detail=f"Invalid action: {req.action}")


# ---------------------------------------------------------------------------
# Ledger
# ---------------------------------------------------------------------------
@app.get("/ledger")
async def get_ledger():
    """View all mock ledger entries."""
    return list_sanctions()


# ---------------------------------------------------------------------------
# WebSocket — real-time A2A event streaming
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    _ws_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        _ws_clients.remove(websocket)


async def _broadcast(data: dict):
    """Broadcast a message to all connected WebSocket clients."""
    msg = json.dumps(data)
    dead = []
    for ws in _ws_clients:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.append(ws)
    for ws in dead:
        _ws_clients.remove(ws)

