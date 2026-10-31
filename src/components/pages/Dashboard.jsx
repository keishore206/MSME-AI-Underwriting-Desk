import React from 'react';
import Layout from '../layout/Layout';
import useStore from '../../store/useStore';
import KPICard from '../dashboard/KPICard';
import CaseTable from '../dashboard/CaseTable';
import AgentPipeline from '../dashboard/AgentPipeline';
import A2ALog from '../dashboard/A2ALog';
import CreditTurnoverChart from '../dashboard/CreditTurnoverChart';
import WorkflowCanvas from '../dashboard/WorkflowCanvas';
import { FileStack, Clock, CheckCircle, AlertCircle, Zap, Activity } from 'lucide-react';

const Dashboard = () => {
  const { runLivePipeline, isPipelineRunning } = useStore();

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
            MSME Credit Desk Cockpit
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8',
              padding: '2px 10px', borderRadius: '9999px', border: '1px solid #BFDBFE'
            }}>Autonomous Node v4.2</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#059669', animation: 'pulse2 2s infinite' }} />
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 500 }}>Live Sync</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => runLivePipeline()}
            disabled={isPipelineRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: isPipelineRunning ? '#93C5FD' : '#1A56DB',
              color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 18px', fontSize: '13px', fontWeight: 600,
              cursor: isPipelineRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(26,86,219,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={16} />
            {isPipelineRunning ? 'Running 6 Specialized Agents...' : 'Trigger Underwriting Pipeline'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <KPICard title="Cases Today" value="12" icon={FileStack} iconBg="#EFF6FF" trend="+3" trendColor="green" subtitle="vs yesterday" />
        <KPICard title="Pending Approval" value="4" icon={AlertCircle} iconBg="#FFFBEB" trend="⚡ Urgent" trendColor="amber" subtitle="awaiting review" />
        <KPICard title="Approved This Week" value="28" icon={CheckCircle} iconBg="#ECFDF5" trend="+12%" trendColor="green" subtitle="vs last week" />
        <KPICard title="Avg Processing Time" value="3h 42m" icon={Clock} iconBg="#F5F3FF" trend="-18min" trendColor="green" subtitle="vs last week" />
      </div>

      {/* Visual n8n Multi-Agent Workflow DAG Canvas */}
      <WorkflowCanvas />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '20px', marginBottom: '24px' }}>
        {/* Left: Case Table */}
        <div>
          <CaseTable />
        </div>

        {/* Right: Pipeline + A2A */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AgentPipeline />
          <A2ALog />
        </div>
      </div>

      {/* Bottom: Credit Turnover Chart full width */}
      <CreditTurnoverChart />

      <style>{`
        @keyframes pulse2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
