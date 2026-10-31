import React, { useState } from 'react';
import Layout from '../layout/Layout';
import { AlertTriangle, Shield, Network, Search, Eye } from 'lucide-react';

const C = { navy: '#0F2044', blue: '#1A56DB', green: '#059669', amber: '#D97706', red: '#DC2626', bg: '#F8FAFC', surface: '#FFFFFF', text: '#111827', muted: '#6B7280', border: '#E2E8F0' };
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', ...style }}>{children}</div>
);

const fraudFlags = [
  { id: 'TXN-8847-01', type: 'Round-Trip', amount: '₹2,40,000', date: '2024-08-12', parties: 'Acc 1 → XYZ Trading → Acc 2', risk: 'Medium', color: C.amber },
  { id: 'TXN-8847-02', type: 'Velocity Spike', amount: '₹7,80,000', date: '2024-09-03', parties: 'Single-day mass credits from 11 parties', risk: 'Low', color: C.blue },
  { id: 'TXN-8847-03', type: 'GST-Bank Delta', amount: '₹3.7% gap', date: 'Sep–Oct 24', parties: 'GST declared vs bank credits mismatch', risk: 'Low', color: C.blue },
];

const graphNodes = [
  { id: 'main', label: 'Rajesh Textiles', x: 220, y: 180, color: C.blue, r: 30, status: 'primary' },
  { id: 'supp1', label: 'Kumar Fabrics', x: 80, y: 80, color: C.green, r: 20, status: 'clean' },
  { id: 'supp2', label: 'Sharma Traders', x: 380, y: 80, color: C.green, r: 20, status: 'clean' },
  { id: 'supp3', label: 'XYZ Trading', x: 80, y: 300, color: C.amber, r: 22, status: 'flagged' },
  { id: 'bank1', label: 'HDFC Acc 1', x: 380, y: 300, color: C.navy, r: 18, status: 'clean' },
  { id: 'shell', label: 'Shell Co?', x: 220, y: 360, color: C.red, r: 16, status: 'suspect' },
];

const graphEdges = [
  { from: 'main', to: 'supp1', label: 'Payment', color: C.green },
  { from: 'main', to: 'supp2', label: 'Payment', color: C.green },
  { from: 'supp3', to: 'main', label: 'Credit', color: C.amber },
  { from: 'main', to: 'supp3', label: 'Return', color: C.amber },
  { from: 'main', to: 'bank1', label: 'Transfer', color: C.navy },
  { from: 'supp3', to: 'shell', label: 'Round-trip?', color: C.red },
];

function getNode(id) { return graphNodes.find(n => n.id === id); }

const SVGGraph = ({ onNodeClick, selectedNode }) => (
  <svg width="100%" height="420" viewBox="0 0 460 420" style={{ fontFamily: 'Inter, sans-serif' }}>
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill={C.muted} />
      </marker>
    </defs>
    {graphEdges.map((e, i) => {
      const from = getNode(e.from), to = getNode(e.to);
      if (!from || !to) return null;
      const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
      return (
        <g key={i}>
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={e.color} strokeWidth={1.8} strokeDasharray={e.color === C.red ? '5 3' : 'none'} markerEnd="url(#arrow)" opacity={0.7} />
          <text x={mx} y={my - 6} textAnchor="middle" fontSize={9} fill={e.color} fontWeight={600}>{e.label}</text>
        </g>
      );
    })}
    {graphNodes.map((n) => (
      <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => onNodeClick(n)}>
        <circle cx={n.x} cy={n.y} r={n.r + 4} fill={n.color + '22'} stroke={selectedNode?.id === n.id ? C.navy : 'none'} strokeWidth={2} />
        <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.9} />
        {n.status === 'flagged' && <circle cx={n.x + n.r - 4} cy={n.y - n.r + 4} r={6} fill={C.amber} />}
        {n.status === 'suspect' && <circle cx={n.x + n.r - 4} cy={n.y - n.r + 4} r={6} fill={C.red} />}
        <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fontSize={10} fill={C.text} fontWeight={600}>{n.label}</text>
      </g>
    ))}
  </svg>
);

// Fraud score gauge SVG
const FraudGauge = ({ score }) => {
  const angle = -135 + (score / 100) * 270;
  const rad = (a) => (a * Math.PI) / 180;
  const cx = 100, cy = 100, r = 70;
  const x2 = cx + r * 0.8 * Math.cos(rad(angle));
  const y2 = cy + r * 0.8 * Math.sin(rad(angle));
  const arcColor = score < 30 ? C.green : score < 60 ? C.amber : C.red;
  return (
    <svg width="200" height="130" viewBox="0 0 200 130">
      <path d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`} fill="none" stroke="#e2e8f0" strokeWidth={12} strokeLinecap="round" />
      <path d={`M ${cx - r * Math.cos(rad(-135))},${cy - r * Math.sin(rad(-135))} A ${r},${r} 0 ${angle > 0 ? 1 : 0},1 ${x2},${y2}`}
        fill="none" stroke={arcColor} strokeWidth={12} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill={C.navy} />
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize={28} fontWeight={800} fill={arcColor}>{score}</text>
      <text x={cx} y={cy + 44} textAnchor="middle" fontSize={11} fill={C.muted}>/ 100</text>
      <text x={cx} y={cy + 60} textAnchor="middle" fontSize={10} fill={arcColor} fontWeight={700}>LOW RISK</text>
    </svg>
  );
};

export default function FraudInvestigation() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedFlag, setExpandedFlag] = useState(null);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Fraud Investigation</h1>
          <div style={{ color: C.muted, fontSize: '13px', marginTop: '4px' }}>CASE-2024-00847 · Transaction Graph Analysis · KYC Verification</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: '#f0fdf4', color: C.green, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>✓ FRAUD_CLEAR</span>
          <span style={{ background: '#eff6ff', color: C.blue, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>Agent: FraudInvestigationAgent</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
        {/* Fraud Score */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>Overall Fraud Score</div>
          <FraudGauge score={14} />
          <div style={{ width: '100%', marginTop: '8px' }}>
            {[
              { label: 'KYC Match', value: '98%', ok: true },
              { label: 'Identity Flags', value: '0', ok: true },
              { label: 'AML Screening', value: 'CLEAR', ok: true },
              { label: 'Round-trips', value: '1 (low amt)', ok: true },
              { label: 'Velocity Anomalies', value: '1 (explained)', ok: true },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none', fontSize: '12px' }}>
                <span style={{ color: C.muted }}>{f.label}</span>
                <span style={{ color: f.ok ? C.green : C.red, fontWeight: 700 }}>{f.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Transaction Graph */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>Transaction Network Graph</div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
              <span>🟢 Clean</span><span>🟡 Flagged</span><span>🔴 Suspect</span>
            </div>
          </div>
          <SVGGraph onNodeClick={setSelectedNode} selectedNode={selectedNode} />
          {selectedNode && (
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', marginTop: '4px' }}>
              <strong>{selectedNode.label}</strong> — Status: <strong style={{ color: selectedNode.color }}>{selectedNode.status}</strong>
              {selectedNode.status === 'flagged' && <span style={{ color: C.amber }}> · Involved in 1 round-trip pattern (low amount, under review)</span>}
              {selectedNode.status === 'suspect' && <span style={{ color: C.red }}> · Possible shell — no Udyam registration found</span>}
              {selectedNode.status === 'clean' && <span style={{ color: C.green }}> · GST verified, regular transaction pattern</span>}
            </div>
          )}
        </Card>
      </div>

      {/* Fraud Flag Details */}
      <Card>
        <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '14px' }}>
          <AlertTriangle size={16} style={{ marginRight: '6px', verticalAlign: 'middle', color: C.amber }} />
          Flagged Transactions ({fraudFlags.length} items — all resolved)
        </div>
        {fraudFlags.map((f, i) => (
          <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', background: expandedFlag === i ? '#f8fafc' : 'white' }}
              onClick={() => setExpandedFlag(expandedFlag === i ? null : i)}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <code style={{ fontSize: '11px', color: C.muted, background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{f.id}</code>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{f.type}</span>
                <span style={{ fontSize: '13px', color: C.muted }}>{f.amount}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: f.color + '1A', color: f.color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>{f.risk}</span>
                <span style={{ color: C.muted }}>{expandedFlag === i ? '▲' : '▼'}</span>
              </div>
            </div>
            {expandedFlag === i && (
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, fontSize: '12px', background: '#fafafa' }}>
                <div><strong>Date:</strong> {f.date}</div>
                <div><strong>Parties:</strong> {f.parties}</div>
                <div style={{ marginTop: '8px', color: C.green }}>
                  ✓ <strong>Agent Assessment:</strong> Amount below threshold (₹5L). Pattern consistent with seasonal trade returns. Marked as low-risk after cross-referencing GST invoices.
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: C.green, fontWeight: 600 }}>
          ✓ All flags reviewed and cleared. Fraud score 14/100 — no suspicious patterns requiring escalation. Proceeding to Credit Risk.
        </div>
      </Card>
    </Layout>
  );
}

