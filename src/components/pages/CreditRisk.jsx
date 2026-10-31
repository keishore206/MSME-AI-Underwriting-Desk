import React from 'react';
import Layout from '../layout/Layout';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Shield, TrendingUp, Award, AlertTriangle } from 'lucide-react';

const C = { navy: '#0F2044', blue: '#1A56DB', green: '#059669', amber: '#D97706', red: '#DC2626', bg: '#F8FAFC', surface: '#FFFFFF', text: '#111827', muted: '#6B7280', border: '#E2E8F0' };
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', ...style }}>{children}</div>
);

const radarData = [
  { factor: 'Cash Flow', entity: 88, promoter: 82 },
  { factor: 'Credit History', entity: 91, promoter: 87 },
  { factor: 'Business Vintage', entity: 85, promoter: 90 },
  { factor: 'Financials', entity: 79, promoter: 75 },
  { factor: 'Collateral', entity: 72, promoter: 68 },
  { factor: 'Industry', entity: 76, promoter: 80 },
];

const scorecardItems = [
  { category: 'Financial Health', weight: 30, score: 88, max: 100 },
  { category: 'Repayment Track Record', weight: 25, score: 91, max: 100 },
  { category: 'Business Vintage & Stability', weight: 20, score: 85, max: 100 },
  { category: 'Management Quality', weight: 10, score: 80, max: 100 },
  { category: 'Industry Outlook', weight: 10, score: 76, max: 100 },
  { category: 'Collateral Coverage', weight: 5, score: 72, max: 100 },
];

const weightedScore = Math.round(scorecardItems.reduce((sum, s) => sum + (s.score * s.weight) / 100, 0));

const ProgressBar = ({ value, max = 100, color = C.blue }) => (
  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
    <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
  </div>
);

export default function CreditRisk() {
  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Credit Risk Assessment</h1>
          <div style={{ color: C.muted, fontSize: '13px', marginTop: '4px' }}>CASE-2024-00847 · Rajesh Textiles Pvt. Ltd. · CIBIL + Internal Scorecard</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: '#f0fdf4', color: C.green, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>✓ RISK_LOW</span>
          <span style={{ background: '#eff6ff', color: C.blue, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>Agent: CreditRiskAgent</span>
        </div>
      </div>

      {/* Score summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Internal Credit Score', value: weightedScore, suffix: '/100', note: 'A- Band', color: C.green, icon: Award },
          { label: 'Entity CIBIL Score', value: '748', suffix: '', note: 'Good — above 700', color: C.green, icon: Shield },
          { label: 'Promoter CIBIL Score', value: '762', suffix: '', note: 'Good — above 750', color: C.green, icon: Shield },
          { label: 'Probability of Default', value: '2.8%', suffix: '', note: 'Expected Loss: ₹1.26L', color: C.amber, icon: AlertTriangle },
        ].map((m, i) => (
          <Card key={i} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <m.icon size={16} color={m.color} />
              <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{m.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: m.color }}>{m.value}<span style={{ fontSize: '14px', color: C.muted }}>{m.suffix}</span></div>
            <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{m.note}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Scorecard detail */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '16px' }}>Weighted Scorecard Breakdown</div>
          {scorecardItems.map((s, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{s.category}</span>
                <span style={{ fontSize: '12px', color: C.muted }}>Weight {s.weight}% · Score <strong style={{ color: s.score >= 80 ? C.green : s.score >= 65 ? C.amber : C.red }}>{s.score}</strong></span>
              </div>
              <ProgressBar value={s.score} color={s.score >= 80 ? C.green : s.score >= 65 ? C.amber : C.red} />
            </div>
          ))}
          <div style={{ marginTop: '12px', textAlign: 'center', padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: C.muted }}>Composite Weighted Score</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: C.green }}>{weightedScore} / 100</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: C.green }}>Rating Band: A-  (Recommended: Approve)</div>
          </div>
        </Card>

        {/* Radar chart */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>Entity vs Promoter Profile</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: C.muted }} />
              <Radar name="Entity" dataKey="entity" stroke={C.blue} fill={C.blue} fillOpacity={0.25} />
              <Radar name="Promoter" dataKey="promoter" stroke={C.green} fill={C.green} fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '4px', fontSize: '12px' }}>
            <span><span style={{ color: C.blue }}>●</span> Entity Score</span>
            <span><span style={{ color: C.green }}>●</span> Promoter Score</span>
          </div>
        </Card>
      </div>

      {/* Bureau & Risk Parameters */}
      <Card>
        <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '14px' }}>Bureau Report Summary & Risk Parameters</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Existing Credit Exposure', value: '₹18.5L', sub: 'CC limit from SBI', ok: true },
            { label: 'Overdue Amount', value: '₹0', sub: 'No DPD in 24 months', ok: true },
            { label: 'Number of Enquiries (6m)', value: '2', sub: 'Normal range', ok: true },
            { label: 'LGD Estimate', value: '35%', sub: 'Stock + Property collateral', ok: true },
            { label: 'LTV Ratio', value: '58.4%', sub: 'Against property ₹77L', ok: true },
            { label: 'Expected Loss (EL)', value: '₹1.26L', sub: 'PD × LGD × EAD', ok: true },
          ].map((p, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>{p.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: p.ok ? C.text : C.red, margin: '4px 0' }}>{p.value}</div>
              <div style={{ fontSize: '11px', color: C.muted }}>{p.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '14px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: C.green, fontWeight: 600 }}>
          ✓ Agent Signal: RISK_LOW — Composite score {weightedScore}/100, Rating A-, PD 2.8%, No bureau delinquency. Recommend proceeding to Policy Check.
        </div>
      </Card>
    </Layout>
  );
}

