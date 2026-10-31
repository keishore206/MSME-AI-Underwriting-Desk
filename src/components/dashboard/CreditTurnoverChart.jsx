import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { bankStatementSummary } from '../../data/syntheticCase';

const formatINR = (val) => {
  const lakhs = val / 100000;
  return `₹${lakhs.toFixed(1)}L`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    return (
      <div style={{
        backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px',
        padding: '10px 14px', boxShadow: '0 4px 12px rgba(15,32,68,0.1)'
      }}>
        <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{formatted}</p>
      </div>
    );
  }
  return null;
};

const CreditTurnoverChart = () => {
  const data = bankStatementSummary.creditTurnover;

  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px',
      padding: '24px', boxShadow: '0px 1px 3px rgba(15,32,68,0.05)'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
          Monthly Credit Turnover — Rajesh Textiles (24 months)
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false} tickLine={false}
            interval={2}
          />
          <YAxis
            tickFormatter={formatINR}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false} tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,86,219,0.04)' }} />
          <ReferenceLine
            y={1250000} stroke="#059669" strokeDasharray="5 4"
            label={{ value: 'WC Threshold', position: 'right', fontSize: 10, fill: '#059669' }}
          />
          <Bar dataKey="amount" fill="#1A56DB" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#1A56DB' }} />
          <span style={{ fontSize: '12px', color: '#6B7280' }}>Actual Inflow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '2px', backgroundColor: '#059669', borderTop: '2px dashed #059669' }} />
          <span style={{ fontSize: '12px', color: '#6B7280' }}>WC Threshold (₹12.5L)</span>
        </div>
      </div>
    </div>
  );
};

export default CreditTurnoverChart;
