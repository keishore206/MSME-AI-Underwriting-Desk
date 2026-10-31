import React from 'react';
import {
  Building2, LayoutDashboard, FileText, Activity, Search,
  Shield, ClipboardList, BookOpen, UserCheck, Wallet, MonitorPlay
} from 'lucide-react';
import useStore from '../../store/useStore';

const navGroups = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
      { icon: MonitorPlay, label: '🎬 Video Walkthrough', page: 'video-walkthrough' },
    ],
  },
  {
    label: 'Case: CASE-2024-00847',
    items: [
      { icon: FileText, label: 'Case Details', page: 'case-detail' },
      { icon: Activity, label: 'Cash-Flow Analysis', page: 'cash-flow' },
      { icon: Search, label: 'Fraud Investigation', page: 'fraud-investigation' },
      { icon: Shield, label: 'Credit Risk', page: 'credit-risk' },
      { icon: ClipboardList, label: 'Policy & Compliance', page: 'policy-compliance' },
      { icon: BookOpen, label: 'CAM Viewer', page: 'cam-viewer' },
      { icon: UserCheck, label: 'Human Approval', page: 'human-approval' },
    ],
  },
];

const Sidebar = () => {
  const { currentPage, setPage } = useStore();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: '100vh', width: '240px',
      backgroundColor: '#0F2044', display: 'flex', flexDirection: 'column',
      zIndex: 100, borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#1A56DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Building2 size={20} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>MSME AI</div>
            <div style={{ color: '#93C5FD', fontSize: '11px', fontWeight: 400 }}>Underwriting Desk</div>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav style={{ flex: 1, padding: '12px' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 8px 6px' }}>
              {group.label}
            </div>
            {group.items.map(({ icon: Icon, label, page }) => {
              const active = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => setPage(page)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    backgroundColor: active ? '#1A56DB' : 'transparent',
                    color: active ? '#fff' : '#94A3B8', marginBottom: '2px',
                    fontSize: '13px', fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {page === 'human-approval' && (
                    <span style={{ marginLeft: 'auto', background: '#D97706', color: 'white', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px' }}>PENDING</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Agent Status */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
            <div style={{
              position: 'absolute', top: '-2px', left: '-2px', width: '12px', height: '12px',
              borderRadius: '50%', backgroundColor: 'rgba(5,150,105,0.3)',
              animation: 'pulse 2s infinite'
            }} />
          </div>
          <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 500 }}>Pipeline Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#1A56DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0
          }}>AS</div>
          <div>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Arun Sharma</div>
            <div style={{ color: '#6B7280', fontSize: '11px' }}>Senior Underwriter</div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }`}</style>
    </div>
  );
};

export default Sidebar;
