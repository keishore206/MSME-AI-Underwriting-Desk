"""Pydantic models for the MSME underwriting system."""
from __future__ import annotations
from typing import Any, Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# ---------------------------------------------------------------------------
# A2A Message
# ---------------------------------------------------------------------------
class A2AMessage(BaseModel):
    time: str
    agent: str
    type: str
    detail: str


# ---------------------------------------------------------------------------
# Case File — shared blackboard between agents
# ---------------------------------------------------------------------------
class DocumentStatus(BaseModel):
    bank_statements: bool = False
    gst_returns: bool = False
    itr: bool = False
    kyc: bool = False
    financial_statements: bool = False
    bureau_report: bool = False


class CashFlowMetrics(BaseModel):
    abb: float = 0.0           # Average bank balance (lakhs)
    dscr: float = 0.0          # Debt service coverage ratio
    dbsr: float = 0.0          # Debt burden service ratio (%)
    avg_monthly_credits: float = 0.0
    avg_monthly_debits: float = 0.0
    avg_net_surplus: float = 0.0
    gst_bank_match_pct: float = 0.0
    cashflow_signal: str = "PENDING"


class FraudMetrics(BaseModel):
    fraud_score: int = 0       # 0-100
    kyc_match_pct: float = 0.0
    flagged_txn_count: int = 0
    aml_status: str = "PENDING"
    fraud_signal: str = "PENDING"


class CreditRiskMetrics(BaseModel):
    internal_score: int = 0    # 0-100
    rating_band: str = ""
    entity_cibil: int = 0
    promoter_cibil: int = 0
    pd: float = 0.0            # Probability of default (%)
    lgd: float = 0.0           # Loss given default (%)
    expected_loss: float = 0.0 # Lakhs
    risk_signal: str = "PENDING"


class PolicyResult(BaseModel):
    rules_passed: int = 0
    rules_total: int = 0
    breaches: list[str] = []
    policy_signal: str = "PENDING"


class LoanTerms(BaseModel):
    amount: float = 0.0        # Lakhs
    tenor_months: int = 0
    rate_pct: float = 0.0
    emi: float = 0.0
    processing_fee: float = 0.0
    security_primary: str = ""
    security_collateral: str = ""
    moratorium_months: int = 0
    covenants: list[str] = []
    terms_signal: str = "PENDING"


class CaseFile(BaseModel):
    case_id: str
    applicant_name: str
    loan_amount_requested: float  # Lakhs
    loan_purpose: str
    status: str = "INITIATED"
    reroute_count: int = 0

    documents: DocumentStatus = Field(default_factory=DocumentStatus)
    cashflow: CashFlowMetrics = Field(default_factory=CashFlowMetrics)
    fraud: FraudMetrics = Field(default_factory=FraudMetrics)
    credit_risk: CreditRiskMetrics = Field(default_factory=CreditRiskMetrics)
    policy: PolicyResult = Field(default_factory=PolicyResult)
    loan_terms: LoanTerms = Field(default_factory=LoanTerms)
    cam_text: Optional[str] = None
    cam_signal: str = "PENDING"
    ledger_ref: Optional[str] = None
    approval_status: str = "PENDING"

    a2a_messages: list[A2AMessage] = Field(default_factory=list)
    agent_log: list[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ---------------------------------------------------------------------------
# API Request / Response
# ---------------------------------------------------------------------------
class NewCaseRequest(BaseModel):
    applicant_name: str
    loan_amount_requested: float
    loan_purpose: str = "Working Capital / Equipment Finance"


class ApprovalRequest(BaseModel):
    action: Literal["approve", "reject", "request_more_info"]
    officer_id: str
    officer_name: str
    notes: Optional[str] = None


class PipelineStatusResponse(BaseModel):
    case_id: str
    status: str
    approval_status: str
    a2a_messages: list[A2AMessage]
    cashflow: CashFlowMetrics
    fraud: FraudMetrics
    credit_risk: CreditRiskMetrics
    policy: PolicyResult
    loan_terms: LoanTerms
    cam_signal: str
    ledger_ref: Optional[str]

