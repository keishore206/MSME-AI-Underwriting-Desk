import React from 'react';
import useStore from '../../store/useStore';

const typeColor = {
  CASHFLOW_STRONG: '#34D399', FRAUD_CLEAR: '#34D399', RISK_LOW: '#34D399',
  POLICY_PASS: '#34D399', DOCS_READY: '#60A5FA', TERMS_PROPOSED: '#60A5FA',
  CAM_READY: '#A78BFA', LEDGER_POSTED: '#FCD34D', APPROVED: '#34D399',
  FRAUD: '#F87171',
};

const A2ALog = () => {
  const { a2aMessages } = useStore();
  const last8 = a2aMessages.slice(-8);

  return (
    <div style={{
      backgroundColor: '#0A1630', borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
          <div style={{
            position: 'absolute', top: '-2px', left: '-2px', width: '12px', height: '12px',
            borderRadius: '50%', backgroundColor: 'rgba(5,150,105,0.3)', animation: 'pulse 2s infinite'
          }} />
        </div>
        <span style={{ color: '#CBD5E1', fontSize: '12px', fontWeight: 600 }}>Multi-Agent Event Bus</span>
      </div>

      {/* Log lines */}
      <div style={{
        maxHeight: '192px', overflowY: 'auto', padding: '10px 0',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
      }}>
        {last8.map((msg, i) => (
          <div key={i} style={{
            padding: '3px 16px', display: 'flex', alignItems: 'baseline', gap: '6px',
            fontSize: '11px', lineHeight: '18px'
          }}>
            <span style={{ color: '#4B5563', flexShrink: 0 }}>[{msg.time}]</span>
            <span style={{ color: '#93C5FD', flexShrink: 0 }}>{msg.agent}</span>
            <span style={{ color: '#4B5563' }}>→</span>
            <span style={{ color: typeColor[msg.type] || '#94A3B8', fontWeight: 700, flexShrink: 0 }}>{msg.type}</span>
            <span style={{ color: '#6B7280' }}>{msg.detail}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }`}</style>
    </div>
  );
};

export default A2ALog;
