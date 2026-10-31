import React, { useState } from 'react';
import Layout from '../layout/Layout';
import { ChevronDown, ChevronRight, FileText, CheckCircle, Link, Download } from 'lucide-react';

const C = { navy: '#0F2044', blue: '#1A56DB', green: '#059669', amber: '#D97706', red: '#DC2626', bg: '#F8FAFC', surface: '#FFFFFF', text: '#111827', muted: '#6B7280', border: '#E2E8F0' };
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', ...style }}>{children}</div>
);

const camSections = [
  {
    id: 'exec',
    title: '1. Executive Summary',
    agent: 'Orchestrator',
    content: (
      <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#374151' }}>
        <p>Rajesh Textiles Pvt. Ltd. (RTPL), incorporated in 2016 and headquartered in Surat, Gujarat, is an established manufacturer and exporter of synthetic textiles. The company has applied for a term loan of <strong>₹45,00,000</strong> for acquisition of new weaving machinery to expand production capacity by ~30%.</p>
        <p style={{ marginTop: '10px' }}>After a comprehensive multi-agent analysis, the Credit Committee recommends <strong style={{ color: C.green }}>APPROVAL</strong> of the loan with the proposed terms detailed herein. All 8 policy rules pass without exception. Fraud score is 14/100 (LOW RISK). DSCR stands at 1.87x, well above the 1.25x minimum threshold.</p>
        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', fontSize: '12px' }}>
          <strong style={{ color: C.green }}>AI Recommendation: RECOMMEND APPROVE</strong> — Evidence-backed, auditable decision. Human officer approval required before disbursal.
        </div>
      </div>
    ),
  },
  {
    id: 'applicant',
    title: '2. Applicant Profile',
    agent: 'DocumentIntakeAgent',
    content: (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <tbody>
          {[
            ['Entity Name', 'Rajesh Textiles Pvt. Ltd.'], ['CIN', 'U17114GJ2016PTC082341'],
            ['GSTIN', '29AAJCR8732L1Z2'], ['Udyam', 'UDYAM-KA-07-0048231'],
            ['PAN', 'AAJCR8732L'], ['Industry', 'Synthetic Textile Manufacturing (NIC 13121)'],
            ['Promoter', 'Rajesh Kumar Sharma (DIN: 07432198)'], ['Business Vintage', '8 years (est. 2016)'],
            ['Annual Turnover FY24', '₹5.82 Crores'], ['Employees', '47 (as per Udyam)'],
          ].map(([k, v], i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: '8px 12px', fontWeight: 600, color: C.muted, width: '35%' }}>{k}</td>
              <td style={{ padding: '8px 12px', color: C.text }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    id: 'cashflow',
    title: '3. Cash-Flow Analysis',
    agent: 'CashFlowAgent',
    content: (
      <div style={{ fontSize: '13px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          {[
            { label: 'Average Bank Balance (ABB)', value: '₹12.4L', ok: true },
            { label: 'Gross Monthly Credits', value: '₹47.8L avg', ok: true },
            { label: 'Net Monthly Surplus', value: '₹11.6L avg', ok: true },
            { label: 'DSCR', value: '1.87x', ok: true },
            { label: 'DBSR', value: '38.2%', ok: true },
            { label: 'GST-Bank Credit Match', value: '96.3%', ok: true },
          ].map((m, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: m.ok ? C.green : C.red, marginTop: '4px' }}>{m.value}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#374151', lineHeight: 1.6 }}>24-month analysis of bank statements confirms strong, consistent cash flows. Minor seasonality observed in Mar/Dec (year-end/festival cycles) — consistent with textile industry norms. Stress test confirms DSCR ≥ 1.25x under -20% revenue shock.</p>
        <div style={{ marginTop: '8px', fontSize: '11px', color: C.muted }}>
          <Link size={11} style={{ marginRight: '4px' }} />Source: Bank Statements ACC-001, ACC-002, ACC-003 | Evidence IDs: BS-2022-001 through BS-2024-024
        </div>
      </div>
    ),
  },
  {
    id: 'fraud',
    title: '4. Fraud Investigation Report',
    agent: 'FraudInvestigationAgent',
    content: (
      <div style={{ fontSize: '13px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '12px 16px', flex: 1 }}>
            <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>Fraud Score</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: C.green }}>14<span style={{ fontSize: '14px' }}>/100</span></div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: C.green }}>LOW RISK</div>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '12px 16px', flex: 2, lineHeight: 1.7 }}>
            <p><strong>KYC Match:</strong> 98% — Aadhaar, PAN, GSTIN verified ✓</p>
            <p><strong>AML Screening:</strong> Not on any watchlist ✓</p>
            <p><strong>Round-trip Pattern:</strong> 1 instance (TXN-8847-01, ₹2.4L) — explained by seasonal trade return ✓</p>
            <p><strong>Identity Fraud:</strong> No synthetic identity indicators ✓</p>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: C.muted }}>
          <Link size={11} style={{ marginRight: '4px' }} />Evidence IDs: KYC-001, AML-SCREEN-001, TXN-8847-01 (reviewed)
        </div>
      </div>
    ),
  },
  {
    id: 'risk',
    title: '5. Credit Risk Assessment',
    agent: 'CreditRiskAgent',
    content: (
      <div style={{ fontSize: '13px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          {[
            { l: 'Internal Score', v: '85/100', c: C.green }, { l: 'Rating Band', v: 'A-', c: C.green },
            { l: 'Entity CIBIL', v: '748', c: C.green }, { l: 'Promoter CIBIL', v: '762', c: C.green },
            { l: 'PD', v: '2.8%', c: C.amber }, { l: 'LGD', v: '35%', c: C.amber },
            { l: 'Expected Loss', v: '₹1.26L', c: C.amber }, { l: 'No DPD', v: '24 months', c: C.green },
          ].map((m, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', padding: '8px 10px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: m.c }}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: C.muted }}>
          <Link size={11} style={{ marginRight: '4px' }} />Source: Bureau Report BUR-2024-00847 | Scorecard SC-001
        </div>
      </div>
    ),
  },
  {
    id: 'terms',
    title: '6. Proposed Loan Terms',
    agent: 'LoanStructuringAgent',
    content: (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <tbody>
          {[
            ['Loan Type', 'Term Loan — Equipment Finance'],
            ['Sanctioned Amount', '₹45,00,000'],
            ['Tenor', '60 months (5 years)'],
            ['Interest Rate', '11.25% p.a. (floating — MCLR + 1.75%)'],
            ['EMI', '₹97,456 per month'],
            ['Processing Fee', '1% of sanctioned amount (₹45,000)'],
            ['Security — Primary', 'Hypothecation of machinery (₹58L estimated value)'],
            ['Security — Collateral', 'Equitable mortgage — commercial property, Surat (₹77L)'],
            ['Guarantor', 'Rajesh Kumar Sharma (personal guarantee)'],
            ['Moratorium', '3 months (disbursement to production start-up)'],
            ['Prepayment', '2% penalty if prepaid within 24 months'],
            ['Covenants', 'Annual audited financials, quarterly GST returns, DSCR ≥ 1.25x maintained'],
          ].map(([k, v], i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#f8fafc' : 'white' }}>
              <td style={{ padding: '9px 12px', fontWeight: 600, color: C.muted, width: '40%' }}>{k}</td>
              <td style={{ padding: '9px 12px', color: C.text, fontWeight: [1, 2, 3].includes(i) ? 700 : 400 }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    id: 'recommendation',
    title: '7. Recommendation & Conditions',
    agent: 'Orchestrator',
    content: (
      <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '14px 16px', marginBottom: '12px', border: `1px solid ${C.green}40` }}>
          <div style={{ fontWeight: 800, color: C.green, fontSize: '15px', marginBottom: '6px' }}>RECOMMENDATION: APPROVE</div>
          <p>Based on the comprehensive multi-agent analysis, the Credit Committee recommends approval of the term loan of ₹45,00,000 to Rajesh Textiles Pvt. Ltd. subject to the conditions below.</p>
        </div>
        <strong>Conditions Precedent:</strong>
        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Registration of equitable mortgage on Surat property before disbursement</li>
          <li>Submission of original machinery proforma invoice from approved supplier</li>
          <li>Personal guarantee deed from Rajesh Kumar Sharma duly notarized</li>
          <li>NACH mandate registration for EMI auto-debit</li>
          <li>No adverse change in financial position between sanction and disbursement</li>
        </ol>
        <div style={{ marginTop: '10px', background: '#fff7ed', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: C.amber, fontWeight: 600 }}>
          ⚠ This memo is AI-generated and requires mandatory human officer approval before ledger finalization. No autonomous disbursal permitted.
        </div>
      </div>
    ),
  },
];

export default function CAMViewer() {
  const [openSections, setOpenSections] = useState({ exec: true, terms: true, recommendation: true });
  const toggle = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Credit Appraisal Memo (CAM)</h1>
          <div style={{ color: C.muted, fontSize: '13px', marginTop: '4px' }}>CAM-2024-00847 · Rajesh Textiles Pvt. Ltd. · Generated by AI</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: '#f0fdf4', color: C.green, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>✓ CAM_READY</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blue, color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* CAM Header Block */}
      <Card style={{ marginBottom: '16px', background: C.navy, borderColor: C.navy }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '20px' }}>
          {[
            { label: 'Applicant', value: 'Rajesh Textiles Pvt. Ltd.' },
            { label: 'Case ID', value: 'CASE-2024-00847' },
            { label: 'CAM Reference', value: 'CAM-2024-00847' },
            { label: 'Sanctioned Amount', value: '₹45,00,000' },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(5,150,105,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} color='#34d399' />
          <span style={{ color: '#34d399', fontWeight: 700, fontSize: '13px' }}>AI Recommendation: RECOMMEND APPROVE — 8/8 policy rules passed · Fraud score 14/100 · DSCR 1.87x · Rating A-</span>
        </div>
      </Card>

      {/* Accordion Sections */}
      {camSections.map((section) => (
        <div key={section.id} style={{ marginBottom: '8px', border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: openSections[section.id] ? '#f8fafc' : 'white', cursor: 'pointer' }}
            onClick={() => toggle(section.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {openSections[section.id] ? <ChevronDown size={16} color={C.blue} /> : <ChevronRight size={16} color={C.muted} />}
              <span style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{section.title}</span>
              <span style={{ fontSize: '10px', background: C.blue + '18', color: C.blue, padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>{section.agent}</span>
            </div>
            <CheckCircle size={16} color={C.green} />
          </div>
          {openSections[section.id] && (
            <div style={{ padding: '16px 18px', borderTop: `1px solid ${C.border}` }}>
              {section.content}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: '16px', background: '#fff7ed', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: C.amber, fontWeight: 600, border: `1px solid ${C.amber}40` }}>
        ⚠ This Credit Appraisal Memo has been generated by the MSME AI Underwriting System. It represents an AI recommendation only. A qualified credit officer must review, sign, and approve this CAM before any funds are committed or disbursed. Ledger entry status: PENDING_HUMAN_APPROVAL.
      </div>
    </Layout>
  );
}

