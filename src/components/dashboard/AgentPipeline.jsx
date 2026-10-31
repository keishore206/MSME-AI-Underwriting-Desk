import React from 'react';
import { CheckCircle, Loader, Clock } from 'lucide-react';
import useStore from '../../store/useStore';

const msgColor = {
  CASHFLOW_STRONG: '#059669', FRAUD_CLEAR: '#059669', RISK_LOW: '#059669',
  POLICY_PASS: '#059669', DOCS_READY: '#1A56DB', TERMS_PROPOSED: '#1A56DB',
  CAM_READY: '#7C3AED', LEDGER_POSTED: '#D97706',
};

const agentPageMap = {
  1: 'case-detail',
  2: 'cash-flow',
  3: 'fraud-investigation',
  4: 'credit-risk',
  5: 'policy-compliance',
  6: 'cam-viewer',
  7: 'cam-viewer',
  8: 'human-approval',
};

const AgentPipeline = () => {
  const { agentPipeline, setPage } = useStore();

  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px',
      padding: '20px', boxShadow: '0px 1px 3px rgba(15,32,68,0.05)'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', margin: '0 0 16px 0' }}>
        Agent Pipeline
      </h3>

      <div style={{ position: 'relative' }}>
        {agentPipeline.map((step, idx) => {
          const isLast = idx === agentPipeline.length - 1;
          const isComplete = step.status === 'complete';
          const isRunning = step.status === 'running';

          return (
            <div
              key={step.id}
              onClick={() => agentPageMap[step.id] && setPage(agentPageMap[step.id])}
              style={{
                display: 'flex', gap: '12px', position: 'relative', cursor: agentPageMap[step.id] ? 'pointer' : 'default',
                padding: '4px 6px', borderRadius: '6px', transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => { if (agentPageMap[step.id]) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              title={agentPageMap[step.id] ? `Click to view ${step.agentName} details` : ''}
            >
              {/* Line */}
              {!isLast && (
                <div style={{
                  position: 'absolute', left: '11px', top: '26px',
                  width: '2px', height: 'calc(100% - 2px)',
                  backgroundColor: isComplete ? '#059669' : '#E2E8F0',
                }} />
              )}

              {/* Circle */}
              <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                {isComplete ? (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle size={14} color="#fff" />
                  </div>
                ) : isRunning ? (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: '#1A56DB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'spin 1s linear infinite'
                  }}>
                    <Loader size={14} color="#fff" />
                  </div>
                ) : (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: '2px solid #CBD5E1', backgroundColor: '#fff'
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '13px', fontWeight: isComplete || isRunning ? 600 : 400,
                    color: isComplete ? '#111827' : isRunning ? '#1A56DB' : '#9CA3AF'
                  }}>
                    {step.agentName}
                  </span>
                  {step.duration && isComplete && (
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{step.duration}</span>
                  )}
                  {isRunning && (
                    <span style={{ fontSize: '11px', color: '#1A56DB', fontWeight: 600 }}>Running...</span>
                  )}
                </div>
                {step.message && isComplete && (
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '9999px',
                    backgroundColor: 'rgba(5,150,105,0.08)', color: msgColor[step.message] || '#6B7280',
                    display: 'inline-block', marginTop: '3px', letterSpacing: '0.02em'
                  }}>
                    {step.message}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default AgentPipeline;
