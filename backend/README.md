# MSME Underwriting AI — Python Backend

FastAPI + multi-agent orchestration backend for the MSME Loan Underwriting Desk demo.

## Architecture

```
backend/
├── main.py                  # FastAPI app (routes + WebSocket)
├── run.py                   # uvicorn runner
├── requirements.txt
├── models/
│   └── schemas.py           # Pydantic models (CaseFile, A2AMessage, etc.)
├── data/
│   └── synthetic_data.py    # All synthetic/mock case data
├── tools/
│   ├── calculators.py       # Deterministic financial calculators (DSCR, EMI, PD…)
│   └── mock_apis.py         # Async mock APIs (GST, Bureau, AML, Udyam)
├── ledger/
│   └── mock_ledger.py       # SQLite mock core-banking ledger
└── agents/
    ├── orchestrator.py      # Pipeline coordinator (LangGraph-style)
    ├── doc_intake.py        # Agent 1 — Document Intake
    ├── cashflow.py          # Agent 2 — Cash-Flow Analysis
    ├── fraud.py             # Agent 3 — Fraud Investigation
    ├── credit_risk.py       # Agent 4 — Credit Risk
    ├── policy.py            # Agent 5 — Policy & Compliance
    ├── loan_structuring.py  # Agent 6 — Loan Structuring
    └── cam_generator.py     # Agent 7 — CAM Generator
```

## Setup

```bash
cd D:\virtusa\demo
pip install -r backend/requirements.txt
```

## Run

```bash
cd D:\virtusa\demo
python -m uvicorn backend.main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /cases | List all cases |
| POST | /cases | Create new case |
| GET | /cases/{id} | Get case status |
| POST | /cases/{id}/run-pipeline | Run full underwriting pipeline |
| GET | /cases/{id}/cam | Get CAM text |
| GET | /cases/{id}/log | Get agent execution log |
| POST | /cases/{id}/approve | Human approval/rejection gate |
| GET | /ledger | View all ledger entries |
| WS | /ws | Real-time A2A event stream |

## Demo Flow

```bash
# 1. Run pipeline for demo case
curl -X POST http://localhost:8000/cases/CASE-2024-00847/run-pipeline

# 2. View results
curl http://localhost:8000/cases/CASE-2024-00847

# 3. Human approval (no autonomous disbursal without this)
curl -X POST http://localhost:8000/cases/CASE-2024-00847/approve \
  -H "Content-Type: application/json" \
  -d '{"action":"approve","officer_id":"OFF-001","officer_name":"Arun Sharma","notes":"All checks passed"}'

# 4. View ledger
curl http://localhost:8000/ledger
```

## Controls

- **Hard policy limits**: Enforced in `tools/calculators.py` and `agents/policy.py` — never delegated to LLM
- **No autonomous disbursal**: Ledger entries stay `PENDING_HUMAN_APPROVAL` until POST /approve
- **MAX_REROUTES = 5**: Fraud re-routing loop is bounded
- **Evidence traceability**: Every A2A message includes agent name, type, and detail
- **Deterministic calculators**: DSCR, EMI, PD, LGD, EL, LTV — all pure Python math

