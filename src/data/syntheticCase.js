// Synthetic MSME Loan Application Data

export const applicantData = {
  id: "CASE-2024-00847",
  applicantName: "Rajesh Textiles Pvt. Ltd.",
  promoter: "Rajesh Kumar Sharma",
  pan: "AABCR1234M",
  gstin: "27AABCR1234M1Z5",
  udyam: "UDYAM-MH-15-0034521",
  businessType: "Manufacturing — Textile",
  vintage: "8 years",
  location: "Bhiwandi, Maharashtra",
  loanRequest: {
    amount: 4500000,
    purpose: "Working Capital + Machinery Upgrade",
    tenor: 60,
    type: "Term Loan + CC Limit",
  },
};

export const bankStatementSummary = {
  months: 24,
  avgMonthlyCredit: 1250000,
  avgMonthlyDebit: 1080000,
  avgBalance: 320000,
  emiObligations: 42000,
  bounces: 3,
  creditTurnover: [
    { month: "Jan-23", amount: 1120000 },
    { month: "Feb-23", amount: 1340000 },
    { month: "Mar-23", amount: 1560000 },
    { month: "Apr-23", amount: 1180000 },
    { month: "May-23", amount: 1290000 },
    { month: "Jun-23", amount: 980000 },
    { month: "Jul-23", amount: 1050000 },
    { month: "Aug-23", amount: 1420000 },
    { month: "Sep-23", amount: 1680000 },
    { month: "Oct-23", amount: 1750000 },
    { month: "Nov-23", amount: 1820000 },
    { month: "Dec-23", amount: 2100000 },
    { month: "Jan-24", amount: 1380000 },
    { month: "Feb-24", amount: 1290000 },
    { month: "Mar-24", amount: 1650000 },
    { month: "Apr-24", amount: 1140000 },
    { month: "May-24", amount: 1310000 },
    { month: "Jun-24", amount: 1090000 },
    { month: "Jul-24", amount: 1210000 },
    { month: "Aug-24", amount: 1480000 },
    { month: "Sep-24", amount: 1720000 },
    { month: "Oct-24", amount: 1890000 },
    { month: "Nov-24", amount: 1950000 },
    { month: "Dec-24", amount: 2250000 },
  ],
};

export const gstData = {
  annualTurnover2023: 14800000,
  annualTurnover2024: 17200000,
  gstCompliance: "Regular",
  filingStatus: "Up to date",
  itcClaimed: 820000,
  bankCreditVsGst: 97.2, // % match
};

export const itrData = {
  fy2022: { revenue: 12500000, netProfit: 820000, taxPaid: 185000 },
  fy2023: { revenue: 14800000, netProfit: 1040000, taxPaid: 245000 },
  fy2024: { revenue: 17200000, netProfit: 1380000, taxPaid: 320000 },
};

export const bureauData = {
  entityScore: 748,
  promoterScore: 762,
  existingLiabilities: 1800000,
  dpd: "0 DPD (clean)",
  writtenOff: "None",
  enquiries: 2,
  rating: "A-",
};

export const financialRatios = {
  currentRatio: 1.48,
  debtEquityRatio: 1.12,
  dscr: 1.87,
  dbsr: 1.64,
  grossProfitMargin: 24.8,
  netProfitMargin: 8.02,
  interestCoverageRatio: 3.2,
};

export const fraudSignals = [
  {
    id: "TXN-2024-03-14-001",
    type: "Round-trip transaction",
    severity: "Low",
    description: "₹180,000 credit from M/s Prakash Trading followed by debit within 48h",
    status: "Investigated — benign (supplier advance)",
    resolved: true,
  },
  {
    id: "TXN-2024-07-22-003",
    type: "Cash withdrawal spike",
    severity: "Medium",
    description: "₹420,000 cash withdrawal — deviates 3.4σ from monthly avg",
    status: "Investigated — confirmed festival bonus payout",
    resolved: true,
  },
];

export const lendingPolicyChecklist = [
  { rule: "Minimum DSCR ≥ 1.25", value: "1.87", status: "PASS" },
  { rule: "Minimum bureau score ≥ 700", value: "748", status: "PASS" },
  { rule: "Maximum LTV ≤ 75%", value: "68%", status: "PASS" },
  { rule: "Maximum exposure per borrower ≤ ₹50L", value: "₹45L", status: "PASS" },
  { rule: "No write-off / NPA history", value: "Clean", status: "PASS" },
  { rule: "Minimum vintage ≥ 3 years", value: "8 years", status: "PASS" },
  { rule: "GST filing current", value: "Up to date", status: "PASS" },
  { rule: "ITR filed last 3 years", value: "Yes", status: "PASS" },
];

export const proposedLoanTerms = {
  sanctionedAmount: 4500000,
  interestRate: "11.25% p.a. (floating, MCLR + 2.75%)",
  tenor: "60 months",
  emi: 97842,
  moratorium: "3 months",
  security: "Hypothecation of stock + book debts; Personal guarantee of Rajesh Kumar Sharma",
  processingFee: "1% + GST",
  covenants: [
    "Annual audited financials submission within 90 days of FY close",
    "QIS submission every quarter",
    "No additional secured borrowing without prior consent",
    "Maintain DSCR ≥ 1.25 at all times",
  ],
};

export const agentSteps = [
  {
    id: 1,
    agentName: "Document Intake Agent",
    icon: "FileText",
    status: "complete",
    duration: "8s",
    findings: [
      "Bank statements (24 months) parsed — 2,847 transactions extracted",
      "GSTR-3B (12 months) verified — turnover match 97.2%",
      "ITR (3 years) validated — consistent PAN linkage",
      "KYC: PAN ✓ | Aadhaar ✓ | Udyam ✓ | GST Cert ✓",
      "2 minor anomalies flagged for Fraud Agent review",
    ],
    message: "DOCS_READY",
    color: "blue",
  },
  {
    id: 2,
    agentName: "Cash-Flow Analysis Agent",
    icon: "TrendingUp",
    status: "complete",
    duration: "12s",
    findings: [
      "Avg Monthly Credit: ₹12.5L (24-month avg)",
      "DSCR: 1.87 ✓ (threshold: 1.25)",
      "DBSR: 1.64 ✓ (strong buffer)",
      "Seasonality: Q4 peak (textiles festival demand)",
      "YoY credit growth: +16.2% — consistent with GST turnover",
      "No round-tripping pattern detected in bulk credits",
    ],
    message: "CASHFLOW_STRONG",
    color: "green",
  },
  {
    id: 3,
    agentName: "Fraud Investigation Agent",
    icon: "Search",
    status: "complete",
    duration: "15s",
    findings: [
      "Transaction graph: 34 unique counterparties — no shell entity pattern",
      "GST vs Bank credit delta: 2.8% variance — within tolerance",
      "2 flagged transactions investigated (see Fraud Panel)",
      "Promoter name match (Aadhaar-PAN): 100% match",
      "Udyam registration verified — authentic",
      "Fraud Score: 14/100 (Low Risk)",
    ],
    message: "FRAUD_CLEAR",
    color: "green",
  },
  {
    id: 4,
    agentName: "Credit Risk Agent",
    icon: "BarChart2",
    status: "complete",
    duration: "10s",
    findings: [
      "Internal Credit Score: 748 (Entity) | 762 (Promoter)",
      "Rating Band: A-",
      "PD (1-year): 1.8%",
      "LGD estimate: 28%",
      "EL (Expected Loss): 0.5% — within appetite",
      "Existing liabilities: ₹18L — fully disclosed",
    ],
    message: "RISK_LOW",
    color: "green",
  },
  {
    id: 5,
    agentName: "Policy & Compliance Agent",
    icon: "Shield",
    status: "complete",
    duration: "6s",
    findings: [
      "All 8 policy rules: PASSED ✓",
      "RBI MSME priority sector classification: Eligible",
      "Exposure post-sanction: ₹45L — within ₹50L limit",
      "No AML/KYC flags",
      "No connected party / group exposure breach",
    ],
    message: "POLICY_PASS",
    color: "green",
  },
  {
    id: 6,
    agentName: "Loan Structuring Agent",
    icon: "Settings",
    status: "complete",
    duration: "8s",
    findings: [
      "Sanctioned: ₹45,00,000 (Term Loan + CC)",
      "Rate: 11.25% p.a. floating",
      "Tenor: 60 months | EMI: ₹97,842",
      "Moratorium: 3 months (machinery installation)",
      "Security: Stock hypothecation + Personal guarantee",
      "4 covenants proposed",
    ],
    message: "TERMS_PROPOSED",
    color: "blue",
  },
  {
    id: 7,
    agentName: "CAM Generator",
    icon: "FileCheck",
    status: "complete",
    duration: "18s",
    findings: [
      "Credit Appraisal Memo generated — 12 sections",
      "Evidence links: 47 transaction IDs referenced",
      "Risk narrative: complete",
      "Recommendation: APPROVE with conditions",
    ],
    message: "CAM_READY",
    color: "purple",
  },
  {
    id: 8,
    agentName: "Mock Ledger Post",
    icon: "Database",
    status: "complete",
    duration: "3s",
    findings: [
      "Pending sanction posted to core-banking ledger",
      "Ledger ID: LDG-2024-00847",
      "Status: PENDING_HUMAN_APPROVAL",
      "Auto-disbursement: BLOCKED until approval",
    ],
    message: "LEDGER_POSTED",
    color: "orange",
  },
];

