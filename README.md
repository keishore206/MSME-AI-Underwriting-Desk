# 🏦 MSME Loan Underwriting Desk — Agentic AI Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
Click to view : https://msme-ai-underwriting-desk.vercel.app/

An enterprise-grade, multi-agent AI loan underwriting desk that transforms the slow, inconsistent, manual MSME credit evaluation process (5–10 days) into a fast, auditable, and evidence-backed decision pipeline (< 30 minutes).

Specialized AI agents independently analyze documents, cash flows, transaction networks, credit bureau data, and lending policies — coordinated through a shared blackboard and an **Agent-to-Agent (A2A) event bus**, culminating in a human-approved **Credit Appraisal Memo (CAM)** posted to a mock core-banking ledger.

> [!IMPORTANT]
> **No Autonomous Disbursal:** The platform is architected with strict human-in-the-loop governance. The system physically cannot finalize a loan sanction without a designated credit officer's digital sign-off.

---

## 🚀 Key Features

* **Visual n8n Workflow Canvas:** Interactive DAG view directly on the dashboard with real-time node execution status, dynamic feedback loops, and an execution inspector drawer.
* **Multi-Agent Specialization:** 6 autonomous agents independently assess documents, financial health, fraud signals, credit scorecards, policy limits, and term structures.
* **Deterministic Financial Math:** Financial metrics (ABB, DSCR, DBSR, EMI, PD, LGD, Expected Loss) are computed deterministically in Python code — never hallucinated by LLMs.
* **Dynamic Orchestration & Re-routing:** If the Fraud Investigation Agent flags anomalies (`FRAUD_SUSPECTED`), the orchestrator dynamically re-routes back to Document Intake for deeper KYC verification (bounded to 5 cycles max).
* **Comprehensive Evidence Traceability:** Every recommendation, ratio, and risk score links directly to underlying transaction IDs, GST invoices, and CIBIL references.
* **Mock Core-Banking Ledger:** Embedded SQLite ledger with strict state locks (`PENDING_HUMAN_APPROVAL` ➔ `SANCTIONED`).

---

## 🤖 The Multi-Agent Architecture

```
                                    ┌────────────────────────┐
                                    │ Webhook / Intake Form  │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │  Agent 1: Doc Intake   │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │   Agent 2: Cash-Flow   │
                                    └───────────┬────────────┘
                                                │
                        ┌───────────────────────▼───────────────────────┐
                        │        Agent 3: Fraud Investigation           │
                        └───────────────┬───────────────────────────────┘
                                        │ (If FRAUD_SUSPECTED -> Re-route to Agent 1)
                                        ▼
                                    ┌────────────────────────┐
                                    │  Agent 4: Credit Risk  │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ Agent 5: Policy Check  │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ Agent 6: Structuring   │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ Agent 7: CAM Generator │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                ┌────────────────────────────────┐
                                │ Core-Banking Mock Ledger Gate  │
                                │   (Mandatory Human Sign-off)   │
                                └────────────────────────────────┘
```

| Agent | Responsibility | Emitted A2A Signal |
|---|---|---|
| **Document Intake Agent** | OCR ingestion & verification of 24-month bank statements, GSTR-3B/1, 3Y ITR, and KYC | `DOCS_READY` |
| **Cash-Flow Analysis Agent** | Computes ABB (₹12.15L), DSCR (10.06x), DBSR (2.11%), and runs sensitivity/stress tests | `CASHFLOW_STRONG` |
| **Fraud Investigation Agent** | Counterparty network graph analysis, velocity checks, and AML watchlist screening | `FRAUD_CLEAR` |
| **Credit Risk Agent** | CIBIL bureau scoring (748/762), 6-factor scorecard, PD (0.5%), LGD (35%), rating `A-` | `RISK_LOW` / `RISK_MEDIUM` |
| **Policy & Compliance Agent** | Enforces 8 hard limits in code (DSCR, LTV cap, RBI MSME priority norms, sector headroom) | `POLICY_PASS` (8/8) |
| **Loan Structuring Agent** | Computes MCLR + spread pricing (10.25%), EMI (₹96,170/m), collateral hypothecation | `TERMS_PROPOSED` |
| **CAM Generator** | Compiles evidence-backed 7-section Credit Appraisal Memo with audit tokens | `CAM_READY` |
| **Human Approval Gate** | Digital sign-off lock; commits `LDG-2024-00847` to core ledger upon officer sign-off | `SANCTIONED` |

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, Zustand, Recharts, Lucide React
* **Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic v2
* **Storage & Ledger:** SQLite (async mock core-banking ledger)
* **Agent Comms:** In-memory asynchronous A2A Event Bus & WebSocket streaming

---

## 📂 Project Structure

```
MSME-AI-Underwriting-Desk/
├── backend/
│   ├── main.py                  # FastAPI server & WebSocket endpoints
│   ├── run.py                   # Uvicorn runner
│   ├── requirements.txt         # Backend Python dependencies
│   ├── agents/
│   │   ├── orchestrator.py      # Multi-agent coordinator & DAG controller
│   │   ├── doc_intake.py        # Agent 1: Document Intake
│   │   ├── cashflow.py          # Agent 2: Cash-Flow Analysis
│   │   ├── fraud.py             # Agent 3: Fraud Investigation
│   │   ├── credit_risk.py       # Agent 4: Credit Risk
│   │   ├── policy.py            # Agent 5: Policy & Compliance
│   │   ├── loan_structuring.py  # Agent 6: Loan Structuring
│   │   └── cam_generator.py     # Agent 7: CAM Generator
│   ├── data/
│   │   └── synthetic_data.py    # Synthetic MSME data (Rajesh Textiles Pvt. Ltd.)
│   ├── ledger/
│   │   └── mock_ledger.py       # SQLite core-banking ledger
│   ├── models/
│   │   └── schemas.py           # Pydantic data schemas & blackboard types
│   └── tools/
│       ├── calculators.py       # Deterministic financial calculators
│       └── mock_apis.py         # Async mock APIs (GST, Bureau, PAN, Udyam)
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── WorkflowCanvas.jsx      # Visual n8n DAG execution canvas
│   │   │   ├── AgentPipeline.jsx       # Step-by-step pipeline timeline
│   │   │   ├── A2ALog.jsx              # Terminal event bus stream
│   │   │   ├── CaseTable.jsx           # Active case queue & filtering
│   │   │   ├── CreditTurnoverChart.jsx # 24-month cash flow visualization
│   │   │   └── KPICard.jsx             # Key performance indicator cards
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   │   ├── TopBar.jsx              # Context breadcrumb & actions
│   │   │   └── Layout.jsx              # Main page wrapper
│   │   └── pages/
│   │       ├── Dashboard.jsx           # Cockpit dashboard with n8n canvas
│   │       ├── CaseDetail.jsx          # 4-tab case profile & document viewer
│   │       ├── CashFlow.jsx            # Cash-flow deep dive & stress test
│   │       ├── FraudInvestigation.jsx  # SVG transaction graph & fraud gauge
│   │       ├── CreditRisk.jsx          # Radar chart & bureau scorecard
│   │       ├── PolicyCompliance.jsx    # 8/8 hard policy rule checklist
│   │       ├── CAMViewer.jsx           # Institutional Credit Appraisal Memo
│   │       └── HumanApproval.jsx       # Mandatory officer sign-off gate
│   ├── data/
│   │   └── syntheticCase.js     # Frontend case constants & ratios
│   ├── store/
│   │   └── useStore.js          # Zustand store with live API synchronization
│   ├── App.jsx                  # Main router & page controller
│   └── main.jsx                 # React root entry point
├── msme-demo/                   # Standalone self-contained HTML demo
├── build_prd.py                 # PRD builder script (python-docx)
├── MSME_Underwriting_PRD.docx   # Complete 14-section PRD specification
├── start_demo.ps1               # Automated single-click launch script
└── vite.config.js               # Vite build configuration
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* **Node.js:** v18+ installed
* **Python:** v3.11+ installed

### 2. Run the Entire System with One Command
```powershell
.\start_demo.ps1
```
*This starts the Python FastAPI backend on port 8000 and the React Vite frontend on port 5173.*

### 3. Or Run Manually in Two Terminals

**Terminal 1 — Backend (FastAPI):**
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```
* API Health Check: `http://localhost:8000/health`
* Interactive API Docs (Swagger): `http://localhost:8000/docs`

**Terminal 2 — Frontend (React + Vite):**
```bash
npm install
npm run dev -- --port 5173
```
* Open in browser: `http://localhost:5173`

---

## 📄 Case Study Context

* **Applicant:** Rajesh Textiles Pvt. Ltd. (Surat, Gujarat)
* **Loan Facility:** ₹45,00,000 (₹45 Lakhs) Term Loan for weaving machinery expansion
* **Financial Highlights:**
  * Average Bank Balance (ABB): ₹12.15 Lakhs
  * Debt Service Coverage Ratio (DSCR): 10.06x (Threshold: ≥ 1.25x)
  * Bureau Scores: Entity 748 | Promoter 762 (Rating Band `A-`)
  * Fraud Score: 14/100 (LOW RISK, 1 explained trade return pattern)
  * Hard Policy Rules: 8 of 8 Passed
  * Proposed Terms: ₹45L @ 10.25% p.a. for 60 months (EMI: ₹96,170)
* **Governance Status:** Posted as `LDG-2024-00847` to mock core ledger with mandatory officer sign-off lock.

---

## 📜 License
This project is licensed under the MIT License.
