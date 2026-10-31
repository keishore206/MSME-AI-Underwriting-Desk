import React from 'react';

const KPICard = ({ title, value, subtitle, icon: Icon, iconBg, trend, trendColor }) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0px 1px 3px rgba(15,32,68,0.05)',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.04em', color: '#6B7280'
        }}>{title}</span>
        {Icon && (
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            backgroundColor: iconBg || '#EFF6FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Icon size={18} color="#1A56DB" />
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827', lineHeight: 1, marginBottom: '10px' }}>
        {value}
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {trend && (
          <span style={{
            fontSize: '12px', fontWeight: 600,
            backgroundColor: trendColor === 'green' ? '#ECFDF5' : trendColor === 'red' ? '#FEF2F2' : '#FFFBEB',
            color: trendColor === 'green' ? '#065F46' : trendColor === 'red' ? '#991B1B' : '#92400E',
            padding: '2px 8px', borderRadius: '9999px'
          }}>{trend}</span>
        )}
        {subtitle && (
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default KPICard;
