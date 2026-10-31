import React from 'react';
import { Search, Bell, Plus, ChevronRight, Home } from 'lucide-react';
import useStore from '../../store/useStore';

const pageLabels = {
  dashboard: 'Dashboard',
  'new-application': 'New Application',
  'all-cases': 'All Cases',
  reports: 'Reports',
  settings: 'Settings',
  'case-detail': 'Case Detail (CASE-2024-00847)',
  'cash-flow': 'Cash Flow Analysis',
  'fraud-investigation': 'Fraud Investigation',
  'credit-risk': 'Credit Risk Assessment',
  'policy-compliance': 'Policy & Compliance Check',
  'cam-viewer': 'Credit Appraisal Memo (CAM)',
  'human-approval': 'Human Approval Gate',
};

const TopBar = () => {
  const { currentPage, setPage } = useStore();
  const label = pageLabels[currentPage] || currentPage;

  return (
    <div style={{
      position: 'fixed', top: 0, left: '240px', right: 0, height: '64px',
      backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', zIndex: 99,
      boxShadow: '0px 1px 3px rgba(15,32,68,0.05)'
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '13px' }}>
        <Home size={14} />
        <span>Home</span>
        <ChevronRight size={14} />
        <span style={{ color: '#111827', fontWeight: 600 }}>{label}</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            placeholder="Search cases..."
            style={{
              height: '36px', paddingLeft: '34px', paddingRight: '12px',
              border: '1px solid #D1D5DB', borderRadius: '6px',
              fontSize: '13px', color: '#111827', backgroundColor: '#F8FAFC',
              outline: 'none', width: '220px'
            }}
          />
        </div>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#6B7280" />
          <div style={{
            position: 'absolute', top: '-6px', right: '-6px',
            backgroundColor: '#DC2626', color: '#fff', borderRadius: '50%',
            width: '16px', height: '16px', fontSize: '9px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>3</div>
        </div>

        {/* New Application Button */}
        <button
          onClick={() => setPage('new-application')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#1A56DB', color: '#fff',
            border: 'none', borderRadius: '6px', padding: '0 14px',
            height: '36px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <Plus size={15} />
          New Application
        </button>
      </div>
    </div>
  );
};

export default TopBar;
