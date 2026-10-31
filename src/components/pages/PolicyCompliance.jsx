import React from 'react';
import Layout from '../layout/Layout';
import { CheckCircle, XCircle, AlertTriangle, FileText, Shield } from 'lucide-react';

const C = { navy: '#0F2044', blue: '#1A56DB', green: '#059669', amber: '#D97706', red: '#DC2626', bg: '#F8FAFC', surface: '#FFFFFF', text: '#111827', muted: '#6B7280', border: '#E2E8F0' };
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', ...style }}>{children}</div>
);

const policyRules = [
  { id: 'POL-001', rule: 'Minimum DSCR ≥ 1.25x', actual: '1.87x', threshold: '≥ 1.25x', status: 'pass', category: 'Cash Flow' },
  { id: 'POL-002', rule: 'Maximum LTV ≤ 75%', actual: '58.4%', threshold: '≤ 75%', status: 'pass', category: 'Collateral' },
  { id: 'POL-003', rule: 'Borrower not on RBI defaulter list', actual: 'Not listed', threshold: 'Must be clear', status: 'pass', category: 'AML/KYC' },
  { id: 'POL-004', rule: 'Minimum credit score ≥ 650', actual: '748 (entity), 762 (promoter)', threshold: '≥ 650', status: 'pass', category: 'Credit' },
  { id: 'POL-005', rule: 'Maximum DBSR ≤ 50%', actual: '38.2%', threshold: '≤ 50%', status: 'pass', category: 'Cash Flow' },
  { id: 'POL-006', rule: 'Business vintage ≥ 2 years', actual: '8 years', threshold: '≥ 2 years', status: 'pass', category: 'Eligibility' },
  { id: 'POL-007', rule: 'Udyam registration active', actual: 'UDYAM-KA-07-0048231', threshold: 'Must be valid', status: 'pass', category: 'AML/KYC' },
  { id: 'POL-008', rule: 'GST registration active for ≥ 12 months', actual: '29AAJCR8732L1Z2 — 6 years', threshold: '≥ 12 months', status: 'pass', category: 'Eligibility' },
];

const exposureData = [
  { label: 'Proposed Loan Amount', value: '₹45,00,000', note: 'Term loan — textiles machinery' },
  { label: 'Existing Exposure (SBI CC)', value: '₹18,50,000', note: 'Current outstanding' },
  { label: 'Total Group Exposure', value: '₹63,50,000', note: 'Post-sanction combined' },
  { label: 'Internal Exposure Ceiling (MSME)', value: '₹1,50,00,000', note: 'RBI MSME sector limit' },
  { label: 'Headroom Available', value: '₹86,50,000', note: 'Well within limit' },
];

const StatusIcon = ({ status }) => {
  if (status === 'pass') return <CheckCircle size={18} color={C.green} />;
  if (status === 'fail') return <XCircle size={18} color={C.red} />;
  return <AlertTriangle size={18} color={C.amber} />;
};

const categoryColors = { 'Cash Flow': C.blue, 'Collateral': C.amber, 'AML/KYC': C.navy, 'Credit': C.green, 'Eligibility': '#7c3aed' };

export default function PolicyCompliance() {
  const passCount = policyRules.filter(r => r.status === 'pass').length;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Policy & Compliance Check</h1>
          <div style={{ color: C.muted, fontSize: '13px', marginTop: '4px' }}>CASE-2024-00847 · RBI MSME Guidelines + Internal Lending Policy</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: '#f0fdf4', color: C.green, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>✓ POLICY_PASS</span>
          <span style={{ background: '#eff6ff', color: C.blue, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>Agent: PolicyComplianceAgent</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Rules Passed', value: `${passCount}/${policyRules.length}`, color: C.green, icon: CheckCircle },
          { label: 'Hard Breaches', value: '0', color: C.green, icon: Shield },
          { label: 'Exceptions Required', value: '0', color: C.green, icon: FileText },
          { label: 'Exposure Headroom', value: '₹86.5L', color: C.blue, icon: AlertTriangle },
        ].map((m, i) => (
          <Card key={i} style={{ padding: '16px', textAlign: 'center' }}>
            <m.icon size={24} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '26px', fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Policy Rules Table */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '14px' }}>Policy Rule Checklist ({passCount}/{policyRules.length} passed)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['ID', 'Rule', 'Category', 'Actual', 'Threshold', 'Result'].map((h) => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policyRules.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px', color: C.muted, fontFamily: 'monospace', fontSize: '11px' }}>{r.id}</td>
                  <td style={{ padding: '10px', fontWeight: 600, color: C.text }}>{r.rule}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: (categoryColors[r.category] || C.blue) + '18', color: categoryColors[r.category] || C.blue, fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                      {r.category}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: C.text }}>{r.actual}</td>
                  <td style={{ padding: '10px', color: C.muted }}>{r.threshold}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StatusIcon status={r.status} />
                      <span style={{ color: r.status === 'pass' ? C.green : C.red, fontWeight: 700, fontSize: '11px' }}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: C.green, fontWeight: 600 }}>
            ✓ Agent Signal: POLICY_PASS — All {policyRules.length}/{policyRules.length} rules satisfied. No exceptions required. Forwarding to Loan Structuring.
          </div>
        </Card>

        {/* Exposure Calculator */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '14px' }}>Exposure Calculator</div>
          {exposureData.map((e, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < exposureData.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{e.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: i === 3 ? C.red : i === 4 ? C.green : C.text }}>{e.value}</span>
              </div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{e.note}</div>
            </div>
          ))}

          <div style={{ marginTop: '14px', background: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: C.muted, marginBottom: '6px', fontWeight: 600 }}>Exposure Utilization</div>
            <div style={{ background: C.border, borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: '42.3%', height: '100%', background: C.green, borderRadius: '999px' }} />
            </div>
            <div style={{ fontSize: '11px', color: C.green, fontWeight: 700, marginTop: '4px' }}>42.3% of sector ceiling — Well within limits</div>
          </div>

          <div style={{ marginTop: '12px', background: '#eff6ff', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: C.blue }}>
            <strong>RBI Reference:</strong> MSME sector exposure norms as per Master Circular FIDD.CO.Plan.BC.54/04.09.01/2020-21
          </div>
        </Card>
      </div>
    </Layout>
  );
}

