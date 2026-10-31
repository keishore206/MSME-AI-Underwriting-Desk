import { create } from 'zustand';
import { applicantData, bankStatementSummary, agentSteps } from '../data/syntheticCase';

const initialA2AMessages = [
  { time: '09:00:01', agent: 'DocumentIntakeAgent', type: 'DOCS_READY', detail: 'All documents parsed successfully' },
  { time: '09:00:09', agent: 'CashFlowAgent', type: 'CASHFLOW_STRONG', detail: 'DSCR 1.87 – above threshold' },
  { time: '09:00:21', agent: 'FraudInvestigationAgent', type: 'FRAUD_CLEAR', detail: 'Fraud score 14/100 – Low Risk' },
  { time: '09:00:31', agent: 'CreditRiskAgent', type: 'RISK_LOW', detail: 'Entity 748 | Promoter 762 – A- band' },
  { time: '09:00:37', agent: 'PolicyComplianceAgent', type: 'POLICY_PASS', detail: '8/8 rules passed' },
  { time: '09:00:45', agent: 'LoanStructuringAgent', type: 'TERMS_PROPOSED', detail: '₹45L @ 11.25% – 60 months' },
  { time: '09:01:03', agent: 'CAMGenerator', type: 'CAM_READY', detail: 'Memo generated – RECOMMEND APPROVE' },
  { time: '09:01:06', agent: 'MockLedgerPost', type: 'LEDGER_POSTED', detail: 'LDG-2024-00847 – PENDING_HUMAN_APPROVAL' },
];

const useStore = create((set, get) => ({
  currentPage: 'dashboard',
  caseData: { applicantData, bankStatementSummary },
  agentPipeline: agentSteps.map((step) => ({ ...step })),
  a2aMessages: initialA2AMessages,
  approvalStatus: 'pending',
  isPipelineRunning: false,

  setPage: (page) => set({ currentPage: page }),

  runLivePipeline: async () => {
    set({ isPipelineRunning: true });
    // Reset steps to running visually
    set((state) => ({
      agentPipeline: state.agentPipeline.map((s, i) => ({
        ...s,
        status: i === 0 ? 'running' : 'pending',
      })),
    }));

    try {
      const res = await fetch('http://localhost:8000/cases/CASE-2024-00847/run-pipeline', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.a2a_messages) {
          set({
            a2aMessages: data.a2a_messages,
            approvalStatus: 'pending',
          });
        }
      }
    } catch (err) {
      console.info('Backend request handled with local simulation', err);
    }

    // Mark all steps complete
    set((state) => ({
      isPipelineRunning: false,
      agentPipeline: state.agentPipeline.map((s) => ({
        ...s,
        status: 'complete',
      })),
    }));
  },

  approveCase: async () => {
    set({
      approvalStatus: 'approved',
      a2aMessages: [
        ...get().a2aMessages,
        {
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          agent: 'HumanUnderwriter',
          type: 'APPROVED',
          detail: 'Manual approval granted by Arun Sharma (OFF-001)',
        },
      ],
    });

    try {
      await fetch('http://localhost:8000/cases/CASE-2024-00847/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          officer_id: 'OFF-001',
          officer_name: 'Arun Sharma',
          notes: 'Sanction approved after committee review.',
        }),
      });
    } catch (_) {}
  },

  rejectCase: async () => {
    set({
      approvalStatus: 'rejected',
      a2aMessages: [
        ...get().a2aMessages,
        {
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          agent: 'HumanUnderwriter',
          type: 'REJECTED',
          detail: 'Application declined by credit officer',
        },
      ],
    });

    try {
      await fetch('http://localhost:8000/cases/CASE-2024-00847/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          officer_id: 'OFF-001',
          officer_name: 'Arun Sharma',
          notes: 'Application declined.',
        }),
      });
    } catch (_) {}
  },
}));

export default useStore;
