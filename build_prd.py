"""
Build MSME Loan Underwriting Desk — PRD.docx
"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

# ── helpers ──────────────────────────────────────────────────────────────────
NAV   = RGBColor(0x0F, 0x20, 0x44)   # Deep Navy  #0F2044
BLUE  = RGBColor(0x1A, 0x56, 0xDB)   # Royal Blue #1A56DB
GREEN = RGBColor(0x05, 0x96, 0x69)   # Emerald    #059669
AMBER = RGBColor(0xD9, 0x77, 0x06)   # Amber      #D97706
RED   = RGBColor(0xDC, 0x26, 0x26)   # Crimson    #DC2626
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT = RGBColor(0xF0, 0xF3, 0xFF)   # light blue tint
HROW  = RGBColor(0xE7, 0xEE, 0xFE)   # table header bg

def rgb_hex(rgb: RGBColor) -> str:
    """Return 6-char uppercase hex from RGBColor (works across python-docx versions)."""
    return str(rgb).upper()          # str(RGBColor) returns e.g. '0F2044'

def set_cell_bg(cell, rgb: RGBColor):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd  = OxmlElement('w:shd')
    shd.set(qn('w:val'),   'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'),  rgb_hex(rgb))
    tcPr.append(shd)

def set_cell_border(cell, top=None, bottom=None, left=None, right=None):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for side, val in [('top',top),('bottom',bottom),('left',left),('right',right)]:
        if val:
            el = OxmlElement(f'w:{side}')
            el.set(qn('w:val'),  val.get('val','single'))
            el.set(qn('w:sz'),   val.get('sz','4'))
            el.set(qn('w:space'),'0')
            el.set(qn('w:color'),val.get('color','auto'))
            tcBorders.append(el)
    tcPr.append(tcBorders)
    return tcBorders

def style_table(table):
    """Apply alternating row shading + header styling to a table."""
    table.style = 'Table Grid'
    for i, row in enumerate(table.rows):
        for j, cell in enumerate(row.cells):
            if i == 0:
                set_cell_bg(cell, NAV)
                for para in cell.paragraphs:
                    for run in para.runs:
                        run.font.color.rgb = WHITE
                        run.font.bold = True
                        run.font.size = Pt(9)
            elif i % 2 == 0:
                set_cell_bg(cell, RGBColor(0xF0, 0xF3, 0xFF))
            for para in cell.paragraphs:
                para.paragraph_format.space_before = Pt(3)
                para.paragraph_format.space_after  = Pt(3)
                if i > 0:
                    for run in para.runs:
                        run.font.size = Pt(9)
                        run.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

def cell_text(cell, text, bold=False, color=None, size=9, align=None):
    para = cell.paragraphs[0]
    para.clear()
    run = para.add_run(text)
    run.font.size  = Pt(size)
    run.font.bold  = bold
    if color:
        run.font.color.rgb = color
    if align:
        para.alignment = align
    return run

def add_section_header(doc, number, title, color=NAV):
    doc.add_paragraph()
    p  = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after  = Pt(4)
    # Left border decoration
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    left = OxmlElement('w:left')
    left.set(qn('w:val'),   'single')
    left.set(qn('w:sz'),    '20')
    left.set(qn('w:space'), '8')
    left.set(qn('w:color'), rgb_hex(color))
    pBdr.append(left)
    pPr.append(pBdr)
    run_num = p.add_run(f"{number}.  ")
    run_num.font.size  = Pt(13)
    run_num.font.bold  = True
    run_num.font.color.rgb = color
    run_tit = p.add_run(title)
    run_tit.font.size  = Pt(13)
    run_tit.font.bold  = True
    run_tit.font.color.rgb = color
    return p

def add_callout(doc, label, text, bg: RGBColor, border: RGBColor, label_color: RGBColor):
    """Render a callout box using a 1-cell table."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0,0)
    set_cell_bg(cell, bg)
    bc = rgb_hex(border)
    set_cell_border(cell,
        top    = {'val':'single','sz':'6', 'color': bc},
        bottom = {'val':'single','sz':'6', 'color': bc},
        left   = {'val':'single','sz':'24','color': bc},
        right  = {'val':'single','sz':'6', 'color': bc},
    )
    p1 = cell.paragraphs[0]
    r1 = p1.add_run(f"  {label}  ")
    r1.font.bold  = True
    r1.font.size  = Pt(9)
    r1.font.color.rgb = label_color
    p2 = cell.add_paragraph()
    r2 = p2.add_run(f"  {text}")
    r2.font.size  = Pt(9.5)
    r2.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    p2.paragraph_format.space_after = Pt(4)
    doc.add_paragraph()

def add_bullet(doc, text, level=0, color=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent   = Cm(0.5 + level*0.5)
    p.paragraph_format.space_before  = Pt(2)
    p.paragraph_format.space_after   = Pt(2)
    run = p.add_run(text)
    run.font.size = Pt(10)
    if color:
        run.font.color.rgb = color
    return p

def add_kv_bullet(doc, key, value):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent  = Cm(0.5)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after  = Pt(2)
    rk = p.add_run(f"{key}: ")
    rk.font.bold = True
    rk.font.size = Pt(10)
    rv = p.add_run(value)
    rv.font.size = Pt(10)

def add_agent_card(doc, agent_num, name, rows_data):
    """Agent spec as a 2-col property table."""
    # Sub-heading
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after  = Pt(4)
    p.paragraph_format.left_indent  = Cm(0.3)
    r = p.add_run(f"  Agent {agent_num} — {name}")
    r.font.bold = True
    r.font.size = Pt(10.5)
    r.font.color.rgb = BLUE

    tbl = doc.add_table(rows=len(rows_data)+1, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl.columns[0].width = Cm(4)
    tbl.columns[1].width = Cm(12)

    # Header
    set_cell_bg(tbl.cell(0,0), BLUE)
    set_cell_bg(tbl.cell(0,1), BLUE)
    cell_text(tbl.cell(0,0), "Property", bold=True, color=WHITE, size=9)
    cell_text(tbl.cell(0,1), "Detail",   bold=True, color=WHITE, size=9)

    for i, (prop, detail) in enumerate(rows_data, start=1):
        bg = RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE
        set_cell_bg(tbl.cell(i,0), bg)
        set_cell_bg(tbl.cell(i,1), bg)
        cell_text(tbl.cell(i,0), prop,   bold=True,  size=9,
                  color=RGBColor(0x43,0x46,0x54))
        cell_text(tbl.cell(i,1), detail, bold=False, size=9)

    for row in tbl.rows:
        for cell in row.cells:
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    doc.add_paragraph()


# ═════════════════════════════════════════════════════════════════════════════
#  DOCUMENT BUILD
# ═════════════════════════════════════════════════════════════════════════════
doc = Document()

# ── Page margins ─────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin   = Cm(2.2)
    section.right_margin  = Cm(2.2)

# ── Default paragraph style ──────────────────────────────────────────────────
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(10)

# ══════════════════════════════════════════════════════════════════════════════
#  COVER / TITLE
# ══════════════════════════════════════════════════════════════════════════════
tbl = doc.add_table(rows=1, cols=1)
tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
cover = tbl.cell(0,0)
set_cell_bg(cover, NAV)
set_cell_border(cover,
    top={'val':'single','sz':'12','color':'1A56DB'},
    bottom={'val':'single','sz':'12','color':'1A56DB'},
    left={'val':'single','sz':'12','color':'1A56DB'},
    right={'val':'single','sz':'12','color':'1A56DB'},
)
cover.width = Cm(16.6)

p_tag = cover.paragraphs[0]
p_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_tag.paragraph_format.space_before = Pt(24)
r_tag = p_tag.add_run("PRODUCT REQUIREMENTS DOCUMENT")
r_tag.font.size  = Pt(9)
r_tag.font.bold  = True
r_tag.font.color.rgb = RGBColor(0xB5,0xC4,0xFF)
r_tag.font.name  = 'Calibri'

p_title = cover.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_title = p_title.add_run("MSME Loan Underwriting Desk")
r_title.font.size  = Pt(26)
r_title.font.bold  = True
r_title.font.color.rgb = WHITE
r_title.font.name  = 'Calibri'

p_sub = cover.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_sub = p_sub.add_run("Multi-Agent Agentic AI System")
r_sub.font.size  = Pt(14)
r_sub.font.color.rgb = RGBColor(0x68,0xDB,0xA9)
r_sub.font.name  = 'Calibri'

p_meta = cover.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_meta.paragraph_format.space_before = Pt(20)
p_meta.paragraph_format.space_after  = Pt(24)
r_meta = p_meta.add_run("Version 1.0  |  October 2026  |  Status: Draft for Review\nDocument Owner: AI Solutions Team  |  Next Review: November 2026")
r_meta.font.size  = Pt(9)
r_meta.font.color.rgb = RGBColor(0xC3,0xC5,0xD7)
r_meta.font.name  = 'Calibri'

doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 1 — EXECUTIVE SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 1, "Executive Summary")

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(6)
r = p.add_run(
    "The MSME Loan Underwriting Desk is a multi-agent AI system that transforms the slow, "
    "inconsistent, manual underwriting process into a fast, auditable, evidence-backed decision "
    "pipeline. Specialized AI agents independently analyze documents, cash flows, fraud signals, "
    "credit risk, compliance, and loan structure — coordinated by an orchestrator — culminating "
    "in a human-approved Credit Appraisal Memo (CAM) posted to a mock core-banking ledger."
)
r.font.size = Pt(10)

add_callout(doc,
    "⚠  CRITICAL CONTROL",
    "No autonomous disbursal occurs. Human approval is mandatory before any sanction is finalized. "
    "The system is physically blocked from disbursing funds without a human JWT-signed approval.",
    RGBColor(0xFF,0xFB,0xEB), RGBColor(0xD9,0x77,0x06), AMBER
)

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 2 — PROBLEM STATEMENT
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 2, "Problem Statement")

pain_data = [
    ("Pain Point", "Business Impact"),
    ("Manual review of 6+ document types per application", "5–10 day underwriting turnaround time"),
    ("Inconsistent officer judgments across branches", "High variance in risk assessments, audit risk"),
    ("Fraud detection relies on individual expertise", "Missed synthetic identities & transaction laundering"),
    ("No shared case memory across branches", "Repeat fraudsters approved at different branches"),
    ("Thin-file MSMEs rejected by rule-of-thumb", "Loss of creditworthy customers, financial exclusion"),
    ("No end-to-end audit trail", "Regulatory & compliance exposure; RBI inspection risk"),
]
tbl = doc.add_table(rows=len(pain_data), cols=2)
tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl.columns[0].width = Cm(7.5)
tbl.columns[1].width = Cm(9.1)
for i, (a, b) in enumerate(pain_data):
    bg = NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc = WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    set_cell_bg(tbl.cell(i,0), bg); set_cell_bg(tbl.cell(i,1), bg)
    cell_text(tbl.cell(i,0), a, bold=(i==0), color=fc, size=9)
    cell_text(tbl.cell(i,1), b, bold=(i==0), color=fc, size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 3 — GOALS & KPIs
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 3, "Goals & Success Metrics")

p = doc.add_paragraph()
r = p.add_run("3.1  Primary Goals")
r.font.bold = True; r.font.size = Pt(11); r.font.color.rgb = BLUE

goals = [
    "Reduce underwriting TAT from 5–10 days → < 4 hours",
    "Achieve > 90% consistency in risk scoring vs. expert panel benchmark",
    "Detect fraud signals with ≥ 85% precision on synthetic test set",
    "Generate fully traceable CAM with evidence linked to source documents",
    "Enable thin-file MSME credit access via alternative data analysis",
]
for g in goals:
    add_bullet(doc, g)

doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run("3.2  Key Performance Indicators (KPIs)")
r.font.bold = True; r.font.size = Pt(11); r.font.color.rgb = BLUE

kpi_data = [
    ("Metric", "Baseline", "Target"),
    ("Avg. underwriting TAT", "7 days", "< 4 hours"),
    ("Risk score variance (σ)", "High", "< 10%"),
    ("Fraud detection precision", "~60% manual", "≥ 85%"),
    ("CAM generation time", "2–3 days", "< 30 min"),
    ("Human override rate", "N/A", "< 15%"),
]
tbl = doc.add_table(rows=len(kpi_data), cols=3)
tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl.columns[0].width = Cm(7); tbl.columns[1].width = Cm(4); tbl.columns[2].width = Cm(5.6)
for i, row in enumerate(kpi_data):
    bg = NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc = WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    for j, txt in enumerate(row):
        set_cell_bg(tbl.cell(i,j), bg)
        cell_text(tbl.cell(i,j), txt, bold=(i==0), color=fc, size=9,
                  align=WD_ALIGN_PARAGRAPH.CENTER if j>0 else None)
        if i > 0 and j == 2:
            tbl.cell(i,j).paragraphs[0].runs[0].font.color.rgb = GREEN
            tbl.cell(i,j).paragraphs[0].runs[0].font.bold = True
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 4 — SCOPE
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 4, "Use Case Scope")

p = doc.add_paragraph()
r = p.add_run("4.1  In Scope"); r.font.bold=True; r.font.size=Pt(11); r.font.color.rgb=GREEN
in_scope = [
    "MSME term loans, working capital, and OD facilities",
    "Synthetic/mock data: bank statements, GST, ITR, KYC, bureau",
    "Multi-agent orchestration with Agent-to-Agent (A2A) messaging",
    "Mock core-banking ledger integration",
    "Human-in-the-loop approval workflow",
    "Evidence-backed CAM generation with source traceability",
]
for s in in_scope: add_bullet(doc, s, color=RGBColor(0x11,0x18,0x27))

doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run("4.2  Out of Scope (v1)"); r.font.bold=True; r.font.size=Pt(11); r.font.color.rgb=RED
out_scope = [
    "Production banking system integration",
    "Real KYC / bureau API calls",
    "Retail / home loan underwriting",
    "Autonomous disbursement (by design)",
]
for s in out_scope: add_bullet(doc, s, color=RGBColor(0x6B,0x72,0x80))

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 5 — SYSTEM ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 5, "System Architecture")

arch_desc = (
    "The system employs a multi-agent orchestration pattern with a shared Case File / Blackboard "
    "as the central knowledge store. The Orchestrator Agent dynamically routes tasks between "
    "specialized agents based on findings and A2A messages. Hard policy controls are enforced "
    "in deterministic code — not LLM inference — ensuring auditability and regulatory defensibility."
)
p = doc.add_paragraph(arch_desc)
p.runs[0].font.size = Pt(10)
p.paragraph_format.space_after = Pt(8)

# Architecture component table
arch_data = [
    ("Component", "Role", "Technology"),
    ("Orchestrator Agent",     "Dynamic routing, iteration control, A2A bus management", "Python / LangGraph"),
    ("Shared Case File",       "Central blackboard — all agents read/write findings",     "In-memory dict + Redis mock"),
    ("Document Intake Agent",  "Parse, extract, classify all submitted documents",        "OCR + Entity normalizer"),
    ("Cash-Flow Analysis",     "DSCR, DBSR, ABB, stress tests, seasonality",             "Deterministic calculators"),
    ("Fraud Investigation",    "Transaction graph, velocity checks, KYC match",           "Graph traversal + fuzzy match"),
    ("Credit Risk Agent",      "Credit scoring, PD, LGD, EL calculation",                "Scorecard + bureau parser"),
    ("Policy & Compliance",    "RBI / internal policy rule engine",                       "Policy YAML + rule engine"),
    ("Loan Structuring",       "Pricing, amortization, covenant generation",              "Financial calculators"),
    ("CAM Generator",          "12-section memo with evidence traceability",              "LLM + template engine"),
    ("Mock Ledger",            "Pending sanction entry — BLOCKED until approval",        "SQLite simulation"),
    ("Human Approval Gate",    "JWT-signed officer decision — mandatory",                 "FastAPI + React UI"),
]
tbl = doc.add_table(rows=len(arch_data), cols=3)
tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl.columns[0].width = Cm(4.5)
tbl.columns[1].width = Cm(8.0)
tbl.columns[2].width = Cm(4.1)
for i, row in enumerate(arch_data):
    bg = NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc = WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    for j, txt in enumerate(row):
        set_cell_bg(tbl.cell(i,j), bg)
        cell_text(tbl.cell(i,j), txt, bold=(i==0 or j==0), color=fc if i>0 else WHITE, size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 6 — AGENT SPECIFICATIONS
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 6, "Agent Specifications")

agents = [
    ("Document Intake Agent", [
        ("Input",        "Raw documents: PDF bank statements, GST returns (GSTR-3B/1), ITR XML, KYC JSON, financial statements"),
        ("Output",       "Structured case file with extracted entities, anomaly flags, document quality score"),
        ("Tools",        "OCR parser, table extractor, entity normalizer, document classifier, PAN/GST verifier"),
        ("A2A Messages", "Emits: DOCS_READY | DOCS_INCOMPLETE | SUSPICIOUS_DOCS"),
        ("Controls",     "Max 3 re-parse retries; incomplete docs trigger DOCS_INCOMPLETE and halt pipeline"),
    ]),
    ("Cash-Flow Analysis Agent", [
        ("Input",        "Parsed bank statements (12–24 months), GST turnover data, ITR net revenue"),
        ("Output",       "Monthly ABB, DSCR, DBSR, cash-flow trend chart, seasonality report, stress-test results"),
        ("Tools",        "Deterministic calculators: DSCR, EMI, DBSR, Working Capital, Stress Test (15%/25%/35% drops)"),
        ("A2A Messages", "Emits: CASHFLOW_STRONG | CASHFLOW_WEAK | CASHFLOW_IRREGULAR"),
        ("Thresholds",   "DSCR ≥ 1.25 (pass); DBSR ≥ 1.20 (pass); GST vs. bank credit delta ≤ 5%"),
    ]),
    ("Fraud Investigation Agent", [
        ("Input",        "Transaction graph (nodes + edges), KYC documents, GST-turnover vs. bank-credit delta, bureau data"),
        ("Output",       "Fraud score 0–100, flagged transaction IDs with severity, risk narrative, network analysis"),
        ("Tools",        "Graph traversal, velocity checks, round-tripping detector, name-match fuzzy (Levenshtein), MCA21 mock API"),
        ("A2A Messages", "Emits: FRAUD_CLEAR | FRAUD_SUSPECTED | FRAUD_CONFIRMED"),
        ("Re-routing",   "FRAUD_SUSPECTED → Orchestrator loops back to Document Intake for enhanced KYC check"),
    ]),
    ("Credit Risk Agent", [
        ("Input",        "Bureau report (entity + promoters), financials, cash-flow agent output, fraud flags"),
        ("Output",       "Internal credit score, PD (probability of default), LGD, EL, rating band (AAA → D)"),
        ("Tools",        "Scorecard calculator, bureau parser, LGD estimator, financial ratio analyzer"),
        ("A2A Messages", "Emits: RISK_LOW | RISK_MEDIUM | RISK_HIGH | RISK_DECLINE"),
        ("Thresholds",   "Min bureau score 700; PD > 5% → RISK_HIGH; PD > 12% → RISK_DECLINE"),
    ]),
    ("Policy & Compliance Agent", [
        ("Input",        "Loan request, credit risk output, current exposure portfolio, RBI MSME norms, internal policy YAML"),
        ("Output",       "Policy pass/fail checklist (8 rules), breach citations, RBI sector classification, AML/KYC flags"),
        ("Tools",        "Policy rule engine, exposure calculator, LTV checker, AML screening mock API, CGTMSE eligibility check"),
        ("A2A Messages", "Emits: POLICY_PASS | POLICY_BREACH | POLICY_EXCEPTION_REQUIRED"),
        ("Controls",     "Hard limits enforced in code: LTV ≤ 75%, DSCR ≥ 1.25, max exposure per borrower ≤ ₹50L"),
    ]),
    ("Loan Structuring Agent", [
        ("Input",        "Policy pass confirmation, risk rating, cash-flow output, applicant's loan request"),
        ("Output",       "Proposed terms: sanction amount, interest rate, tenor, EMI, moratorium, security, covenants"),
        ("Tools",        "Pricing model (MCLR-linked), amortization calculator, covenant generator"),
        ("A2A Messages", "Emits: TERMS_PROPOSED | TERMS_REVISED"),
        ("Covenants",    "Auto-generates 4 standard covenants: annual financials, QIS, no additional borrowing, DSCR maintenance"),
    ]),
]
for i, (name, rows) in enumerate(agents, 1):
    add_agent_card(doc, i, name, rows)

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 7 — WORKFLOW PIPELINE
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 7, "Workflow Pipeline")

pipeline_steps = [
    ("Step 1", "Document Intake",         "Bank statements, GST, ITR, KYC, financials parsed and structured"),
    ("Step 2", "Cash-Flow Analysis",      "DSCR, DBSR, ABB computed; seasonality and stress tests run"),
    ("Step 3", "Fraud Investigation",     "Transaction graph analyzed; KYC verified; fraud score computed"),
    ("Step 4", "Credit Risk Assessment",  "Bureau parsed; scorecard run; PD/LGD/EL calculated"),
    ("Step 5", "Policy & Compliance",     "8 RBI/internal policy rules evaluated; AML/KYC checked"),
    ("Step 6", "Loan Structuring",        "Terms, pricing, covenants proposed based on risk and policy output"),
    ("Step 7", "CAM Generation",          "12-section Credit Appraisal Memo compiled with 47+ evidence links"),
    ("Step 8", "Mock Ledger Post",        "Pending sanction posted to core-banking ledger; auto-disbursal BLOCKED"),
    ("Step 9", "Human Approval Gate",     "Officer reviews CAM, checks conditions, and signs off (JWT-gated)"),
]
tbl = doc.add_table(rows=len(pipeline_steps)+1, cols=3)
tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl.columns[0].width = Cm(2.0)
tbl.columns[1].width = Cm(5.0)
tbl.columns[2].width = Cm(9.6)

set_cell_bg(tbl.cell(0,0), NAV); set_cell_bg(tbl.cell(0,1), NAV); set_cell_bg(tbl.cell(0,2), NAV)
cell_text(tbl.cell(0,0),"Step",  bold=True,color=WHITE,size=9)
cell_text(tbl.cell(0,1),"Agent", bold=True,color=WHITE,size=9)
cell_text(tbl.cell(0,2),"Key Action / Output", bold=True,color=WHITE,size=9)

step_colors = [BLUE,GREEN,RED,GREEN,GREEN,BLUE,RGBColor(0x7C,0x3A,0xED),AMBER,AMBER]
for i,(step,agent,action) in enumerate(pipeline_steps, 1):
    bg = RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE
    set_cell_bg(tbl.cell(i,0),bg); set_cell_bg(tbl.cell(i,1),bg); set_cell_bg(tbl.cell(i,2),bg)
    cell_text(tbl.cell(i,0), step,   bold=True, color=step_colors[i-1], size=9)
    cell_text(tbl.cell(i,1), agent,  bold=True, color=RGBColor(0x11,0x18,0x27), size=9)
    cell_text(tbl.cell(i,2), action, bold=False,color=RGBColor(0x43,0x46,0x54), size=9)

doc.add_paragraph()
add_callout(doc,
    "ℹ  ORCHESTRATOR RE-ROUTING",
    "If Fraud Agent emits FRAUD_SUSPECTED, the Orchestrator dynamically re-routes the pipeline "
    "back to Document Intake for an enhanced KYC deep-dive before proceeding. "
    "Maximum 5 re-routing cycles per case; a watchdog timer enforces the limit.",
    RGBColor(0xEF,0xF6,0xFF), BLUE, BLUE
)

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 8 — DATA SOURCES
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 8, "Data Sources (Synthetic / Mock)")

data_src = [
    ("Source",             "Format",         "Coverage / Detail"),
    ("Bank Statements",    "CSV / PDF",       "24 months, 3 accounts, 2,847+ transactions"),
    ("GST Returns",        "JSON",            "GSTR-3B/1 — 12 months; ITC claimed, turnover"),
    ("Income Tax Returns", "XML",             "FY22, FY23, FY24 — revenue, PAT, tax paid"),
    ("Financial Statements","JSON",           "P&L, Balance Sheet, Cash Flow — 3 years"),
    ("KYC Documents",      "JSON + Image refs","PAN, Aadhaar, Udyam, GST Certificate"),
    ("Bureau Report",      "JSON",            "CIBIL/Experian mock — entity + promoters score, DPD"),
    ("Transaction Graph",  "JSON nodes+edges","Linked entities, beneficial owners, counterparties"),
    ("Lending Policies",   "YAML",            "Internal credit policy + RBI MSME priority sector norms"),
    ("Historical Cases",   "Vector DB (mock)","500 synthetic past underwriting cases for memory"),
]
tbl = doc.add_table(rows=len(data_src), cols=3)
tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl.columns[0].width = Cm(4.5); tbl.columns[1].width = Cm(3.5); tbl.columns[2].width = Cm(8.6)
for i,(a,b,c) in enumerate(data_src):
    bg = NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc = WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    set_cell_bg(tbl.cell(i,0),bg); set_cell_bg(tbl.cell(i,1),bg); set_cell_bg(tbl.cell(i,2),bg)
    cell_text(tbl.cell(i,0),a,bold=(i==0),color=fc,size=9)
    cell_text(tbl.cell(i,1),b,bold=(i==0),color=fc,size=9)
    cell_text(tbl.cell(i,2),c,bold=(i==0),color=fc,size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 9 — CONTROLS & GUARDRAILS
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 9, "Controls & Guardrails")

controls = [
    ("Hard Policy Limits",       "Enforced in deterministic code — NOT LLM inference. LTV cap, exposure ceiling, minimum DSCR are absolute code-level gates."),
    ("Evidence Traceability",    "Every agent finding links to doc_id + page number + transaction_id. Full audit chain preserved in case file."),
    ("Fraud Flag Linkage",       "Each fraud signal is tied to a specific transaction_id. No orphan flags; every alert is evidence-anchored."),
    ("Prompt Injection Defense", "Input sanitization on all ingested documents. Structured schemas enforce tool calls. No raw user text passed to LLM prompts."),
    ("Rate / Iteration Limits",  "Max 5 re-routing cycles per case. Per-agent token budget enforced. Watchdog timer kills stalled pipelines."),
    ("No Autonomous Disbursal",  "System physically cannot post a disbursement record without a human JWT-signed approval. No code path exists to bypass this."),
    ("Token-Aware Routing",      "Long-context document parsing → larger model (Gemini 1.5 Pro). Scoring & classification → smaller/faster model (Gemini Flash)."),
    ("Mandatory Human Approval", "The approval gate is a hard stop. LLM recommendation is advisory only; the officer's decision is the binding action."),
]
tbl = doc.add_table(rows=len(controls)+1, cols=2)
tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl.columns[0].width = Cm(5.0); tbl.columns[1].width = Cm(11.6)
set_cell_bg(tbl.cell(0,0),NAV); set_cell_bg(tbl.cell(0,1),NAV)
cell_text(tbl.cell(0,0),"Control",       bold=True,color=WHITE,size=9)
cell_text(tbl.cell(0,1),"Implementation",bold=True,color=WHITE,size=9)
for i,(ctrl,impl) in enumerate(controls, 1):
    bg = RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE
    set_cell_bg(tbl.cell(i,0),bg); set_cell_bg(tbl.cell(i,1),bg)
    cell_text(tbl.cell(i,0),ctrl,bold=True, color=RGBColor(0x0F,0x20,0x44),size=9)
    cell_text(tbl.cell(i,1),impl,bold=False,color=RGBColor(0x43,0x46,0x54),size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 10 — TECHNOLOGY STACK
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 10, "Technology Stack")

p = doc.add_paragraph(); r=p.add_run("10.1  Frontend (Demo Dashboard)")
r.font.bold=True; r.font.size=Pt(11); r.font.color.rgb=BLUE

fe_data = [
    ("Layer","Technology","Purpose"),
    ("Framework","React 18 + Vite","Component-based SPA with fast HMR builds"),
    ("UI Components","shadcn/ui + Tailwind CSS","Accessible, design-system-consistent components"),
    ("State Management","Zustand","Lightweight global state for agent pipeline & case data"),
    ("Charts","Recharts","Cash-flow trend, DSCR waterfall, fraud score gauge"),
    ("Icons","Lucide React","Consistent line-style icon set"),
    ("Design System","Custom tokens — DESIGN.md","Inter font, Navy/Blue/Green/Amber/Red palette"),
]
tbl = doc.add_table(rows=len(fe_data), cols=3)
tbl.columns[0].width=Cm(3.8); tbl.columns[1].width=Cm(5.0); tbl.columns[2].width=Cm(7.8)
for i,(a,b,c) in enumerate(fe_data):
    bg=NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc=WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    for j,txt in enumerate([a,b,c]):
        set_cell_bg(tbl.cell(i,j),bg)
        cell_text(tbl.cell(i,j),txt,bold=(i==0),color=fc,size=9)
doc.add_paragraph()

p = doc.add_paragraph(); r=p.add_run("10.2  Backend / Agent Infrastructure")
r.font.bold=True; r.font.size=Pt(11); r.font.color.rgb=BLUE

be_data = [
    ("Layer","Technology","Purpose"),
    ("Agent Orchestration","Python — LangGraph / custom loop","DAG-based agent routing, state management, A2A bus"),
    ("LLM Providers","Google Gemini 1.5 Pro / Flash","Configurable; token-aware model routing per task"),
    ("Agent Communication","A2A message bus (in-memory / Redis mock)","Typed message passing between agents with schema validation"),
    ("Financial Calculators","Python deterministic code","DSCR, DBSR, EMI, LTV, stress test — no LLM in critical calc"),
    ("Case Memory","ChromaDB (mock vector store)","500 synthetic historical cases for context retrieval"),
    ("Mock APIs","FastAPI services","Bureau, GST verification, Udyam, MCA21 — all synthetic"),
    ("Mock Ledger","SQLite simulation","Core-banking sanction entry; disbursement physically gated"),
    ("Human Approval API","FastAPI + JWT auth","Officer sign-off endpoint; logs timestamp + officer ID"),
]
tbl = doc.add_table(rows=len(be_data), cols=3)
tbl.columns[0].width=Cm(4.0); tbl.columns[1].width=Cm(5.0); tbl.columns[2].width=Cm(7.6)
for i,(a,b,c) in enumerate(be_data):
    bg=NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc=WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    for j,txt in enumerate([a,b,c]):
        set_cell_bg(tbl.cell(i,j),bg)
        cell_text(tbl.cell(i,j),txt,bold=(i==0),color=fc,size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 11 — DEMO SCOPE
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 11, "Demo Scope (Phase 1 — Prototype)")

demo_items = [
    ("1. Application Dashboard",    "Case list, KPI cards, status tracker, real-time queue view"),
    ("2. Document Intake Panel",    "Document checklist, extraction status, anomaly flags, A2A message log"),
    ("3. Cash-Flow Analysis",       "24-month bar chart, DSCR/DBSR cards, stress test scenarios, GST reconciliation"),
    ("4. Fraud Investigation",      "Fraud score gauge, transaction graph visualization, flagged transaction table"),
    ("5. Credit Risk Panel",        "Credit score display, PD/LGD/EL cards, financial ratio scorecard, trend charts"),
    ("6. Policy & Compliance",      "8-rule checklist, RBI classification, exposure analysis, AML/KYC results"),
    ("7. CAM Viewer",               "12-section Credit Appraisal Memo with 47 evidence links, PDF download"),
    ("8. Mock Ledger",              "Pending sanction entry LDG-2024-00847; auto-disbursal BLOCKED indicator"),
    ("9. Human Approval Gate",      "Decision modal with conditions checklist; Approve / Reject / Request More Info"),
]
tbl = doc.add_table(rows=len(demo_items)+1, cols=2)
tbl.columns[0].width=Cm(5.5); tbl.columns[1].width=Cm(11.1)
set_cell_bg(tbl.cell(0,0),NAV); set_cell_bg(tbl.cell(0,1),NAV)
cell_text(tbl.cell(0,0),"Demo Screen",   bold=True,color=WHITE,size=9)
cell_text(tbl.cell(0,1),"Key Features",  bold=True,color=WHITE,size=9)
for i,(screen,feat) in enumerate(demo_items, 1):
    bg=RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE
    set_cell_bg(tbl.cell(i,0),bg); set_cell_bg(tbl.cell(i,1),bg)
    cell_text(tbl.cell(i,0),screen,bold=True, color=BLUE,size=9)
    cell_text(tbl.cell(i,1),feat,  bold=False,color=RGBColor(0x43,0x46,0x54),size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 12 — IMPLEMENTATION ROADMAP
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 12, "Implementation Roadmap (10 Weeks)")

road_data = [
    ("Phase","Duration","Deliverable","Owner"),
    ("1 — UI Demo Shell",     "2 weeks","React dashboard, synthetic data loader, 9-page Stitch designs","Frontend Team"),
    ("2 — Agent Logic",       "3 weeks","6 specialized agents, tool registry, deterministic calculators","AI/ML Team"),
    ("3 — Orchestration",     "2 weeks","Orchestrator, A2A bus, dynamic re-routing, blackboard pattern","AI/ML Team"),
    ("4 — CAM & Ledger",      "2 weeks","CAM generator (12 sections), mock SQLite core-banking ledger","Backend Team"),
    ("5 — Demo Polish",       "1 week", "Human approval gate, fraud graph, presentation mode, QA","Full Team"),
    ("Total",                 "10 weeks","Full working demo ready for stakeholder presentation","Program Lead"),
]
tbl = doc.add_table(rows=len(road_data), cols=4)
tbl.columns[0].width=Cm(4.2); tbl.columns[1].width=Cm(2.5); tbl.columns[2].width=Cm(8.0); tbl.columns[3].width=Cm(2.0)
for i,row in enumerate(road_data):
    bg = NAV if i==0 else (RGBColor(0x05,0x96,0x69,) if i==len(road_data)-1 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE))
    fc = WHITE if (i==0 or i==len(road_data)-1) else RGBColor(0x11,0x18,0x27)
    for j,txt in enumerate(row):
        set_cell_bg(tbl.cell(i,j),bg if i!=len(road_data)-1 else GREEN)
        cell_text(tbl.cell(i,j),txt,bold=(i==0 or i==len(road_data)-1),color=fc,size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 13 — RISK REGISTER
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 13, "Risk Register & Mitigations")

risk_data = [
    ("Risk","Likelihood","Impact","Mitigation"),
    ("LLM hallucination in financial calculations","High","Critical","Deterministic Python calculators for all numbers; LLM only narrates results"),
    ("Prompt injection via malicious document content","Medium","High","Schema-enforced tool calls; input sanitization on all ingested documents"),
    ("Demo synthetic data appears unrealistic","Medium","Medium","Professional synthetic data with coherent multi-year business narratives"),
    ("Re-routing loops cause pipeline to stall/freeze","Low","High","Max 5 iteration hard cap + 30-second watchdog timer per agent"),
    ("Human approval gate bypassed in demo","Low","Critical","JWT-gated API endpoint; no alternative code path exists for disbursement"),
    ("Agent A2A message schema mismatch","Medium","Medium","Pydantic schema validation on all A2A messages; typed message bus"),
    ("Over-reliance on LLM for risk decisions","High","High","Risk score is always deterministic; LLM only generates narrative explanation"),
]
tbl = doc.add_table(rows=len(risk_data), cols=4)
tbl.columns[0].width=Cm(4.8); tbl.columns[1].width=Cm(2.2); tbl.columns[2].width=Cm(1.8); tbl.columns[3].width=Cm(7.8)
likelihood_color = {"High":RED,"Medium":AMBER,"Low":GREEN}
impact_color     = {"Critical":RED,"High":RED,"Medium":AMBER,"Low":GREEN}
for i,row in enumerate(risk_data):
    bg = NAV if i==0 else (RGBColor(0xF0,0xF3,0xFF) if i%2==0 else WHITE)
    fc = WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    set_cell_bg(tbl.cell(i,0),bg); cell_text(tbl.cell(i,0),row[0],bold=(i==0),color=fc,size=9)
    set_cell_bg(tbl.cell(i,1),bg); cell_text(tbl.cell(i,1),row[1],bold=(i==0),
        color=likelihood_color.get(row[1],fc) if i>0 else WHITE, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_bg(tbl.cell(i,2),bg); cell_text(tbl.cell(i,2),row[2],bold=(i==0),
        color=impact_color.get(row[2],fc) if i>0 else WHITE, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_bg(tbl.cell(i,3),bg); cell_text(tbl.cell(i,3),row[3],bold=(i==0),color=fc,size=9)
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  SECTION 14 — ENTERPRISE IMPACT
# ══════════════════════════════════════════════════════════════════════════════
add_section_header(doc, 14, "Enterprise Impact Summary")

impact_data = [
    ("Business Dimension","Impact","Quantified Benefit"),
    ("Speed / TAT",         "7-day → 4-hour underwriting turnaround",            "~42x faster per case"),
    ("Consistency",         "Standardized AI scoring eliminates officer bias",    "> 90% score consistency target"),
    ("Fraud Detection",     "Graph-based detection catches synthetic identities", "≥ 85% precision vs. ~60% manual"),
    ("Audit & Compliance",  "Full evidence trail for regulator inspections",      "100% traceable findings"),
    ("Financial Inclusion", "Thin-file MSMEs assessed via alternative data",      "Expanded addressable market"),
    ("Cost Efficiency",     "Fewer analyst hours per case; scalable throughput",  "Est. 60–70% cost per case reduction"),
    ("Risk Management",     "Deterministic policy enforcement — no LLM guessing","Zero hard-policy breaches possible"),
]
tbl = doc.add_table(rows=len(impact_data), cols=3)
tbl.columns[0].width=Cm(3.8); tbl.columns[1].width=Cm(7.5); tbl.columns[2].width=Cm(5.3)
for i,row in enumerate(impact_data):
    bg = NAV if i==0 else (RGBColor(0xEF,0xFF,0xF7) if i%2==0 else WHITE)
    fc = WHITE if i==0 else RGBColor(0x11,0x18,0x27)
    for j,txt in enumerate(row):
        set_cell_bg(tbl.cell(i,j),bg)
        cell_text(tbl.cell(i,j),txt,bold=(i==0 or j==0),color=fc,size=9)
        if i>0 and j==2:
            tbl.cell(i,j).paragraphs[0].runs[0].font.color.rgb = GREEN
            tbl.cell(i,j).paragraphs[0].runs[0].font.bold = True
doc.add_paragraph()

# ══════════════════════════════════════════════════════════════════════════════
#  FOOTER NOTE
# ══════════════════════════════════════════════════════════════════════════════
doc.add_paragraph()
tbl = doc.add_table(rows=1, cols=1)
foot = tbl.cell(0,0)
set_cell_bg(foot, NAV)
p_f = foot.paragraphs[0]
p_f.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_f.paragraph_format.space_before = Pt(8)
p_f.paragraph_format.space_after  = Pt(8)
r_f = p_f.add_run(
    "MSME Loan Underwriting Desk — PRD v1.0  |  AI Solutions Team  |  October 2026  |  CONFIDENTIAL\n"
    "This document is a product requirements specification for a demonstration system using synthetic data. "
    "No real customer data, production APIs, or live banking systems are referenced."
)
r_f.font.size  = Pt(8)
r_f.font.color.rgb = RGBColor(0xC3,0xC5,0xD7)
r_f.font.name  = 'Calibri'

# ── Save ─────────────────────────────────────────────────────────────────────
out_path = r"D:\virtusa\demo\MSME_Underwriting_PRD.docx"
doc.save(out_path)
print(f"SUCCESS: {out_path}")

