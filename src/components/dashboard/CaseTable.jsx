import React, { useState } from 'react';
import { Eye, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import useStore from '../../store/useStore';

const cases = [
  { id: 'CASE-2024-00847', applicant: 'Rajesh Textiles Pvt. Ltd.', amount: '₹45,00,000', stage: 'Human Approval', risk: 'LOW', status: 'Pending', page: 'human-approval' },
  { id: 'CASE-2024-00841', applicant: 'Mehta Auto Components', amount: '₹28,00,000', stage: 'Credit Risk', risk: 'MEDIUM', status: 'In Progress', page: 'credit-risk' },
  { id: 'CASE-2024-00835', applicant: 'Patel Agro Exports', amount: '₹62,00,000', stage: 'Fraud Check', risk: 'LOW', status: 'In Progress', page: 'fraud-investigation' },
  { id: 'CASE-2024-00829', applicant: 'Sharma Electronics', amount: '₹15,50,000', stage: 'Policy Check', risk: 'HIGH', status: 'Flagged', page: 'fraud-investigation' },
  { id: 'CASE-2024-00822', applicant: 'Gupta Food Industries', amount: '₹38,00,000', stage: 'CAM Review', risk: 'LOW', status: 'In Progress', page: 'cam-viewer' },
  { id: 'CASE-2024-00815', applicant: 'Verma Steel Works', amount: '₹52,00,000', stage: 'Approved', risk: 'LOW', status: 'Approved', page: 'case-detail' },
];

const riskStyle = {
  LOW: { bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' },
  MEDIUM: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
  HIGH: { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
};

const statusStyle = {
  Pending: { bg: '#FFFBEB', color: '#92400E' },
  'In Progress': { bg: '#EFF6FF', color: '#1D4ED8' },
  Flagged: { bg: '#FEF2F2', color: '#991B1B' },
  Approved: { bg: '#ECFDF5', color: '#065F46' },
};

const tabs = ['All', 'In Progress', 'Pending', 'Flagged'];

const CaseTable = () => {
  const { setPage } = useStore();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? cases : cases.filter(c => c.status === activeTab);

  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px',
      boxShadow: '0px 1px 3px rgba(15,32,68,0.05)', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>Active Cases</h3>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '4px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '12px',
              fontWeight: activeTab === tab ? 600 : 400,
              backgroundColor: activeTab === tab ? '#1A56DB' : '#F1F5F9',
              color: activeTab === tab ? '#fff' : '#6B7280',
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC' }}>
              {['Case ID', 'Applicant', 'Loan Amount', 'Stage', 'Risk', 'Status', 'Action'].map(col => (
                <th key={col} style={{
                  padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.04em', color: '#6B7280',
                  borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap'
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const rs = riskStyle[c.risk] || riskStyle.LOW;
              const ss = statusStyle[c.status] || statusStyle.Pending;
              return (
                <tr
                  key={c.id}
                  style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8FAFC', cursor: 'pointer' }}
                  onClick={() => setPage(c.page)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#fff' : '#F8FAFC'}
                >
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1A56DB', fontWeight: 600 }}>{c.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 500 }}>{c.applicant}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{c.amount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>{c.stage}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px',
                      backgroundColor: rs.bg, border: `1px solid ${rs.border}`, color: rs.color
                    }}>{c.risk}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px',
                      backgroundColor: ss.bg, color: ss.color
                    }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {c.status === 'Pending' && (
                        <button onClick={e => { e.stopPropagation(); setPage('human-approval'); }} style={{
                          padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px',
                          border: 'none', cursor: 'pointer', backgroundColor: '#059669', color: '#fff'
                        }}>Approve</button>
                      )}
                      {c.status === 'Flagged' && (
                        <button onClick={e => { e.stopPropagation(); setPage('fraud-investigation'); }} style={{
                          padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px',
                          border: 'none', cursor: 'pointer', backgroundColor: '#DC2626', color: '#fff'
                        }}>Investigate</button>
                      )}
                      <button onClick={e => { e.stopPropagation(); setPage(c.page); }} style={{
                        padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px',
                        border: '1px solid #E2E8F0', cursor: 'pointer', backgroundColor: '#fff', color: '#111827'
                      }}>View</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseTable;
