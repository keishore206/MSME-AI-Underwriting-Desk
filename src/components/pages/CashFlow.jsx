import React from 'react';
import Layout from '../layout/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Activity } from 'lucide-react';

const C = { navy: '#0F2044', blue: '#1A56DB', green: '#059669', amber: '#D97706', red: '#DC2626', bg: '#F8FAFC', surface: '#FFFFFF', text: '#111827', muted: '#6B7280', border: '#E2E8F0' };

const monthlyData = [
  { month: 'Nov 22', credits: 38.2, debits: 29.1, net: 9.1 },
  { month: 'Dec 22', credits: 42.5, debits: 31.8, net: 10.7 },
  { month: 'Jan 23', credits: 35.1, debits: 28.4, net: 6.7 },
  { month: 'Feb 23', credits: 39.8, debits: 30.2, net: 9.6 },
  { month: 'Mar 23', credits: 55.4, debits: 38.9, net: 16.5 },
  { month: 'Apr 23', credits: 37.2, debits: 29.6, net: 7.6 },
  { month: 'May 23', credits: 40.1, debits: 31.3, net: 8.8 },
  { month: 'Jun 23', credits: 43.7, debits: 33.1, net: 10.6 },
  { month: 'Jul 23', credits: 46.2, debits: 34.8, net: 11.4 },
  { month: 'Aug 23', credits: 41.9, debits: 32.4, net: 9.5 },
  { month: 'Sep 23', credits: 44.3, debits: 33.7, net: 10.6 },
  { month: 'Oct 23', credits: 53.1, debits: 39.2, net: 13.9 },
  { month: 'Nov 23', credits: 47.8, debits: 35.6, net: 12.2 },
  { month: 'Dec 23', credits: 58.9, debits: 42.1, net: 16.8 },
  { month: 'Jan 24', credits: 42.3, debits: 33.5, net: 8.8 },
  { month: 'Feb 24', credits: 45.6, debits: 34.9, net: 10.7 },
  { month: 'Mar 24', credits: 62.1, debits: 44.3, net: 17.8 },
  { month: 'Apr 24', credits: 43.5, debits: 33.8, net: 9.7 },
  { month: 'May 24', credits: 46.2, debits: 35.1, net: 11.1 },
  { month: 'Jun 24', credits: 48.9, debits: 36.4, net: 12.5 },
  { month: 'Jul 24', credits: 51.3, debits: 37.9, net: 13.4 },
  { month: 'Aug 24', credits: 49.1, debits: 36.8, net: 12.3 },
  { month: 'Sep 24', credits: 52.4, debits: 38.5, net: 13.9 },
  { month: 'Oct 24', credits: 55.7, debits: 40.2, net: 15.5 },
];

const dscrTrend = [
  { q: 'Q1 FY23', dscr: 1.62 }, { q: 'Q2 FY23', dscr: 1.74 }, { q: 'Q3 FY23', dscr: 1.71 },
  { q: 'Q4 FY23', dscr: 1.83 }, { q: 'Q1 FY24', dscr: 1.79 }, { q: 'Q2 FY24', dscr: 1.86 },
  { q: 'Q3 FY24', dscr: 1.84 }, { q: 'Q4 FY24', dscr: 1.87 },
];

const metrics = [
  { label: 'Avg Monthly Balance (ABB)', value: '₹12.4L', sub: '24-month average', color: C.blue, icon: DollarSign, status: 'good' },
  { label: 'DSCR (Debt Service Coverage)', value: '1.87x', sub: 'Threshold: ≥ 1.25x', color: C.green, icon: CheckCircle, status: 'good' },
  { label: 'DBSR (Debt-Burden Ratio)', value: '38.2%', sub: 'Threshold: ≤ 50%', color: C.green, icon: TrendingDown, status: 'good' },
  { label: 'Gross Monthly Credits', value: '₹47.8L', sub: 'Avg over 24 months', color: C.navy, icon: TrendingUp, status: 'good' },
  { label: 'GST Turnover Match', value: '96.3%', sub: 'Bank vs GST delta: 3.7%', color: C.amber, icon: AlertTriangle, status: 'warn' },
  { label: 'Cash-Flow Trend', value: '+12.4%', sub: 'YoY growth (FY23→FY24)', color: C.green, icon: Activity, status: 'good' },
];

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background: color + '1A', color, fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '999px' }}>{label}</span>
);

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#fff' }}>
      <div style={{ fontWeight: 700, marginBottom: '6px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>₹{p.value}L — {p.name}</div>
      ))}
    </div>
  );
};

export default function CashFlow() {
  return (
    <Layout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Cash-Flow Analysis</h1>
          <div style={{ color: C.muted, fontSize: '13px', marginTop: '4px' }}>CASE-2024-00847 · Rajesh Textiles Pvt. Ltd. · 24-month analysis</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge label="Agent: CashFlowAgent" color={C.blue} />
          <Badge label="✓ CASHFLOW_STRONG" color={C.green} />
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {metrics.map((m, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px' }}>
            <div style={{ background: m.color + '18', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
              <m.icon size={20} color={m.color} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: m.color, lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{m.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Monthly Cash Flow Bar Chart */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '16px' }}>Monthly Credits vs Debits (₹ Lakhs) — 24 Months</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.muted }} tickLine={false} />
              <Tooltip content={<TooltipCustom />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="credits" fill={C.blue} name="Credits" radius={[2, 2, 0, 0]} />
              <Bar dataKey="debits" fill={C.amber} name="Debits" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* DSCR Trend */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '16px' }}>DSCR Trend (Quarterly)</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dscrTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: C.muted }} tickLine={false} />
              <YAxis domain={[1.2, 2.0]} tick={{ fontSize: 10, fill: C.muted }} tickLine={false} />
              <Tooltip formatter={(v) => [v.toFixed(2), 'DSCR']} />
              <ReferenceLine y={1.25} stroke={C.red} strokeDasharray="4 4" label={{ value: 'Min 1.25', fill: C.red, fontSize: 10 }} />
              <Line type="monotone" dataKey="dscr" stroke={C.green} strokeWidth={2.5} dot={{ fill: C.green, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Seasonality & Stress Test */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '12px' }}>Seasonality Analysis</div>
          {[
            { period: 'Jan–Mar (Year End / Festival)', level: 'Peak', note: 'Credits +38% above avg', color: C.green },
            { period: 'Apr–Jun (Post GST filing)', level: 'Normal', note: 'Credits at average range', color: C.blue },
            { period: 'Jul–Sep (Mid-year build-up)', level: 'Moderate', note: 'Credits +11% above avg', color: C.amber },
            { period: 'Oct–Dec (Pre-festival)', level: 'High', note: 'Credits +22% above avg', color: C.blue },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{s.period}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{s.note}</div>
              </div>
              <Badge label={s.level} color={s.color} />
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '12px' }}>Stress Test Results</div>
          {[
            { scenario: 'Base Case', dscr: '1.87x', emi: '₹97,456', pass: true },
            { scenario: 'Revenue -20%', dscr: '1.41x', emi: '₹97,456', pass: true },
            { scenario: 'Revenue -35%', dscr: '1.18x', emi: '₹97,456', pass: false },
            { scenario: 'Rate +150 bps', dscr: '1.64x', emi: '₹1,07,230', pass: true },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{s.scenario}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>EMI: {s.emi} | DSCR: {s.dscr}</div>
              </div>
              <span style={{ color: s.pass ? C.green : C.red, fontWeight: 700, fontSize: '13px' }}>{s.pass ? '✓ PASS' : '✗ FAIL'}</span>
            </div>
          ))}
          <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: C.green, fontWeight: 600 }}>
            ✓ Agent Signal: CASHFLOW_STRONG — 3/4 stress scenarios pass minimum DSCR 1.25x
          </div>
        </Card>
      </div>
    </Layout>
  );
}

