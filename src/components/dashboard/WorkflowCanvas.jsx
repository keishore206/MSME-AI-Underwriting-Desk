import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, TrendingUp, Search, BarChart2, Shield, Settings,
  FileCheck, Database, Play, RotateCcw, CheckCircle, Clock,
  ArrowRight, AlertTriangle, Eye, ChevronRight, Zap, Cpu, Code2, Sparkles
} from 'lucide-react';
import useStore from '../../store/useStore';

const WORKFLOW_NODES = [
  {
    id: 0,
    title: 'Trigger: Loan Intake',
    type: 'trigger',
    agentName: 'Webhook / Ingestion API',
    icon: Zap,
    color: '#3B82F6',
    bgColor: '#1E293B',
    desc: 'Receives CASE-2024-00847 payload (₹45L request)',
    tools: ['POST /cases', 'schema_validator', 'payload_sanitizer'],
    inputData: { case_id: 'CASE-2024-00847', applicant: 'Rajesh Textiles Pvt. Ltd.', amount: '₹45,00,000' },
    outputData: { status: 'QUEUED', assigned_priority: 'HIGH', token: 'TKN-8847-INIT' },
    a2aMessage: 'CASE_RECEIVED',
    executionTime: '45ms',
    liveAction: 'Validating JSON payload and queuing case blackboard...',
  },
  {
    id: 1,
    title: 'Agent 1: Document Intake',
    type: 'agent',
    agentName: 'DocumentIntakeAgent',
    icon: FileText,
    color: '#2563EB',
    bgColor: '#1E293B',
    desc: 'OCR extraction & 6-doc normalization',
    tools: ['ocr_table_extractor', 'verify_gstin', 'verify_pan', 'verify_udyam'],
    inputData: { raw_files: ['Bank_24M.pdf', 'GSTR3B_12M.json', 'ITR_3Y.xml', 'KYC.zip'] },
    outputData: { bank_txns_extracted: 2847, gst_turnover: '₹1.72 Cr', kyc_verified: true, match_rate: '98%' },
    a2aMessage: 'DOCS_READY',
    executionTime: '820ms',
    liveAction: 'Parsing 2,847 bank txns and cross-checking NSDL PAN...',
  },
  {
    id: 2,
    title: 'Agent 2: Cash-Flow Analysis',
    type: 'agent',
    agentName: 'CashFlowAgent',
    icon: TrendingUp,
    color: '#059669',
    bgColor: '#1E293B',
    desc: 'Deterministic DSCR, ABB & stress models',
    tools: ['calculate_abb()', 'calculate_dscr()', 'calculate_dbsr()', 'stress_test_engine()'],
    inputData: { monthly_credits: '24 months array', requested_emi_estimate: '₹97,456' },
    outputData: { abb: '₹12.15L', dscr: '1.87x (Min 1.25x)', dbsr: '38.2%', gst_bank_match: '96.3%' },
    a2aMessage: 'CASHFLOW_STRONG',
    executionTime: '640ms',
    liveAction: 'Computing debt-service coverage & running -20% revenue shock...',
  },
  {
    id: 3,
    title: 'Agent 3: Fraud Investigation',
    type: 'agent',
    agentName: 'FraudInvestigationAgent',
    icon: Search,
    color: '#D97706',
    bgColor: '#1E293B',
    desc: 'Graph round-trips & velocity spikes',
    tools: ['graph_traversal()', 'detect_round_trip()', 'aml_watchlist_check()', 'gst_delta_eval()'],
    inputData: { counterparty_nodes: 34, flagged_txns: ['TXN-8847-01 (₹2.4L)'] },
    outputData: { fraud_score: '14/100 (LOW)', aml_status: 'CLEAR', round_trip_risk: 'RESOLVED (Seasonal)' },
    a2aMessage: 'FRAUD_CLEAR',
    executionTime: '980ms',
    liveAction: 'Traversing 34 counterparty graph nodes for synthetic shell entities...',
  },
  {
    id: 4,
    title: 'Agent 4: Credit Risk Agent',
    type: 'agent',
    agentName: 'CreditRiskAgent',
    icon: BarChart2,
    color: '#7C3AED',
    bgColor: '#1E293B',
    desc: 'Bureau scorecard, PD & rating band',
    tools: ['cibil_bureau_parser()', 'calculate_pd()', 'calculate_lgd()', 'scorecard_matrix()'],
    inputData: { entity_cibil: 748, promoter_cibil: 762, vintage_years: 8 },
    outputData: { composite_score: '85/100', rating_band: 'A-', pd_1y: '2.8%', lgd: '35%', el: '₹1.26L' },
    a2aMessage: 'RISK_LOW',
    executionTime: '510ms',
    liveAction: 'Evaluating promoter CIBIL 762 against MSME rating band A-...',
  },
  {
    id: 5,
    title: 'Agent 5: Policy & Compliance',
    type: 'agent',
    agentName: 'PolicyComplianceAgent',
    icon: Shield,
    color: '#0891B2',
    bgColor: '#1E293B',
    desc: 'Hard limits in code & RBI MSME rules',
    tools: ['policy_rule_engine()', 'ltv_cap_checker()', 'group_exposure_calculator()'],
    inputData: { proposed_exposure: '₹45L', existing_cc: '₹18.5L', ceiling: '₹150L' },
    outputData: { rules_passed: '8/8', hard_breaches: 0, headroom_available: '₹86.5L', rbi_msme_eligible: true },
    a2aMessage: 'POLICY_PASS',
    executionTime: '320ms',
    liveAction: 'Validating 8/8 hard coded boundary conditions against RBI norms...',
  },
  {
    id: 6,
    title: 'Agent 6: Loan Structuring',
    type: 'agent',
    agentName: 'LoanStructuringAgent',
    icon: Settings,
    color: '#2563EB',
    bgColor: '#1E293B',
    desc: 'Pricing model, amortization & covenants',
    tools: ['pricing_model(MCLR+spread)', 'amortization_schedule()', 'covenant_generator()'],
    inputData: { rating: 'A-', amount: '₹45,00,000', requested_tenor: 60 },
    outputData: { final_rate: '11.25%', emi: '₹97,456/m', fee: '₹45,000 (1%)', moratorium: '3 months' },
    a2aMessage: 'TERMS_PROPOSED',
    executionTime: '430ms',
    liveAction: 'Generating 60-month reducing balance schedule and security covenants...',
  },
  {
    id: 7,
    title: 'Agent 7: CAM Generator',
    type: 'agent',
    agentName: 'CAMGenerator',
    icon: FileCheck,
    color: '#9333EA',
    bgColor: '#1E293B',
    desc: 'Evidence-linked Credit Memo generation',
    tools: ['evidence_linker()', 'cam_markdown_synthesizer()', 'audit_token_signer()'],
    inputData: { all_agent_outputs: 'CaseFile blackboard' },
    outputData: { cam_id: 'CAM-2024-00847', recommendation: 'RECOMMEND APPROVE', evidence_refs: 47 },
    a2aMessage: 'CAM_READY',
    executionTime: '1120ms',
    liveAction: 'Compiling 7-section Credit Appraisal Memo with verified doc citations...',
  },
  {
    id: 8,
    title: 'Core-Banking Ledger Gate',
    type: 'gate',
    agentName: 'MockLedger & Human Gate',
    icon: Database,
    color: '#EA580C',
    bgColor: '#1E293B',
    desc: 'Mandatory human approval lock',
    tools: ['post_pending_sanction()', 'jwt_officer_lock()', 'audit_trail_logger()'],
    inputData: { cam_approved: true, sanction_amount: '₹45L' },
    outputData: { ledger_ref: 'LDG-2024-00847', status: 'PENDING_HUMAN_APPROVAL', autonomous_disbursal: 'BLOCKED' },
    a2aMessage: 'LEDGER_POSTED',
    executionTime: '190ms',
    liveAction: 'Committing sanction entry to core-banking ledger locked for human sign-off...',
  },
];

export default function WorkflowCanvas() {
  const { isPipelineRunning, runLivePipeline, setPage } = useStore();
  const [activeStep, setActiveStep] = useState(8); // 8 = all finished by default
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNode, setSelectedNode] = useState(WORKFLOW_NODES[2]); // Default inspected node: Cash-Flow Agent
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  // Run interactive node-by-node visual workflow simulation
  const startSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
    let step = 0;

    clearInterval(timerRef.current);
    const intervalMs = speed === 2 ? 650 : 1200;

    timerRef.current = setInterval(() => {
      step++;
      if (step < WORKFLOW_NODES.length) {
        setActiveStep(step);
        setSelectedNode(WORKFLOW_NODES[step]);
      } else {
        clearInterval(timerRef.current);
        setIsSimulating(false);
      }
    }, intervalMs);
  };

  const resetWorkflow = () => {
    clearInterval(timerRef.current);
    setIsSimulating(false);
    setActiveStep(0);
    setSelectedNode(WORKFLOW_NODES[0]);
  };

  const completeAll = () => {
    clearInterval(timerRef.current);
    setIsSimulating(false);
    setActiveStep(8);
    setSelectedNode(WORKFLOW_NODES[8]);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0B132B 0%, #0F172A 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      marginBottom: '24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Canvas Top Bar */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: Branding & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
          }}>
            <Cpu size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
                Multi-Agent Workflow Engine
              </h2>
              <span style={{
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#F472B6',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}>
                n8n DAG Mode
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Autonomous Directed Acyclic Graph with Dynamic Fraud Feedback Loop
            </div>
          </div>
        </div>

        {/* Center: Live execution indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(30, 41, 59, 0.8)', padding: '6px 14px', borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: isSimulating ? '#38BDF8' : '#10B981',
            boxShadow: isSimulating ? '0 0 10px #38BDF8' : '0 0 10px #10B981',
            animation: 'pulseGlow 1.5s infinite'
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: isSimulating ? '#38BDF8' : '#10B981' }}>
            {isSimulating ? `Executing Node ${activeStep + 1} of ${WORKFLOW_NODES.length}` : 'All 8 Nodes Synchronized'}
          </span>
          <span style={{ color: '#475569', fontSize: '12px' }}>|</span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Case: CASE-2024-00847</span>
        </div>

        {/* Right: Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setSpeed(s => (s === 1 ? 2 : 1))}
            style={{
              background: 'rgba(51, 65, 85, 0.6)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer'
            }}
            title="Toggle playback speed"
          >
            {speed}x Speed
          </button>

          <button
            onClick={resetWorkflow}
            style={{
              background: 'rgba(51, 65, 85, 0.6)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>

          <button
            onClick={startSimulation}
            disabled={isSimulating}
            style={{
              background: isSimulating ? 'rgba(59, 130, 246, 0.4)' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px',
              fontSize: '12px', fontWeight: 700, cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Play size={14} fill="#fff" />
            {isSimulating ? 'Simulating...' : 'Run Workflow'}
          </button>

          <button
            onClick={() => {
              runLivePipeline();
              completeAll();
            }}
            disabled={isPipelineRunning}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px',
              fontSize: '12px', fontWeight: 700, cursor: isPipelineRunning ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
            title="Trigger Python FastAPI Backend Orchestrator"
          >
            <Zap size={14} />
            {isPipelineRunning ? 'Agents Calling...' : 'Sync via Backend API'}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Grid Pattern */}
      <div style={{
        position: 'relative',
        minHeight: '440px',
        padding: '30px 24px',
        background: `
          radial-gradient(circle, rgba(51, 65, 85, 0.45) 1px, transparent 1px) 0 0 / 24px 24px,
          linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 19, 43, 0.98) 100%)
        `,
        overflowX: 'auto',
      }}>
        {/* Dynamic Re-routing Annotation Header */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(217, 119, 6, 0.15)', border: '1px dashed rgba(217, 119, 6, 0.5)',
          borderRadius: '8px', padding: '6px 14px', marginBottom: '24px', fontSize: '11px', color: '#FCD34D'
        }}>
          <AlertTriangle size={14} color="#F59E0B" />
          <span>
            <strong>Dynamic Orchestration Rule:</strong> If Agent 3 flags <code>FRAUD_SUSPECTED</code>, orchestrator dynamically re-routes back to Agent 1 for deeper KYC (bounded to max 5 iterations).
          </span>
        </div>

        {/* The Node Sequence Pipeline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'stretch',
          position: 'relative',
          paddingBottom: '20px'
        }}>
          {WORKFLOW_NODES.map((node, index) => {
            const isCompleted = activeStep >= index;
            const isCurrent = activeStep === index && isSimulating;
            const isSelected = selectedNode?.id === node.id;
            const Icon = node.icon;

            return (
              <div key={node.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Connecting Arrow between nodes */}
                {index < WORKFLOW_NODES.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: '-16px',
                    top: '48px',
                    width: '16px',
                    height: '2px',
                    background: isCompleted ? '#10B981' : 'rgba(255,255,255,0.1)',
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      right: '-3px',
                      top: '-4px',
                      width: '0',
                      height: '0',
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: `6px solid ${isCompleted ? '#10B981' : 'rgba(255,255,255,0.2)'}`
                    }} />
                    {isCurrent && (
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '-3px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#38BDF8',
                        animation: 'flowRight 1s infinite linear'
                      }} />
                    )}
                  </div>
                )}

                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  style={{
                    flex: 1,
                    background: isSelected
                      ? 'rgba(30, 41, 59, 0.95)'
                      : isCurrent
                      ? 'rgba(30, 58, 138, 0.7)'
                      : 'rgba(15, 23, 42, 0.75)',
                    borderRadius: '12px',
                    border: isSelected
                      ? `2px solid ${node.color}`
                      : isCurrent
                      ? '2px solid #38BDF8'
                      : isCompleted
                      ? '1px solid rgba(16, 185, 129, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected
                      ? `0 0 20px ${node.color}40, 0 8px 24px rgba(0,0,0,0.5)`
                      : isCurrent
                      ? '0 0 15px rgba(56, 189, 248, 0.4)'
                      : '0 4px 12px rgba(0,0,0,0.2)',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    backdropFilter: 'blur(8px)',
                    transform: isSelected ? 'translateY(-2px)' : 'none'
                  }}
                >
                  {/* Port Handles (n8n signature style) */}
                  {index > 0 && (
                    <div style={{
                      position: 'absolute', left: '-6px', top: '48px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10B981' : '#475569',
                      border: '2px solid #0F172A'
                    }} title="Input Port" />
                  )}
                  {index < WORKFLOW_NODES.length - 1 && (
                    <div style={{
                      position: 'absolute', right: '-6px', top: '48px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10B981' : '#475569',
                      border: '2px solid #0F172A'
                    }} title="Output Port" />
                  )}

                  {/* Node Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      backgroundColor: node.color + '25',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${node.color}50`
                    }}>
                      <Icon size={15} color={node.color} />
                    </div>

                    {/* Status Pill */}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      backgroundColor: isCurrent
                        ? 'rgba(56, 189, 248, 0.2)'
                        : isCompleted
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isCurrent ? '#38BDF8' : isCompleted ? '#34D399' : '#64748B',
                      border: `1px solid ${isCurrent ? '#38BDF8' : isCompleted ? '#10B98150' : 'transparent'}`,
                      display: 'flex', alignItems: 'center', gap: '3px'
                    }}>
                      {isCurrent ? (
                        <>⚡ RUNNING</>
                      ) : isCompleted ? (
                        <>✓ DONE</>
                      ) : (
                        <>WAITING</>
                      )}
                    </span>
                  </div>

                  {/* Title & Agent Name */}
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.3, marginBottom: '2px' }}>
                    {node.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace', marginBottom: '8px' }}>
                    {node.agentName}
                  </div>

                  {/* Description / Output summary */}
                  <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '15px', marginBottom: '10px' }}>
                    {isCurrent ? (
                      <span style={{ color: '#38BDF8', fontWeight: 600 }}>{node.liveAction}</span>
                    ) : (
                      node.desc
                    )}
                  </div>

                  {/* A2A Token Badge */}
                  <div style={{
                    marginTop: 'auto',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '10px'
                  }}>
                    <span style={{ color: '#64748B' }}>A2A:</span>
                    <span style={{ fontWeight: 700, color: node.color, fontFamily: 'monospace' }}>
                      {node.a2aMessage}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Inspector Drawer (Below Canvas) */}
        {selectedNode && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '18px 22px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: selectedNode.color + '25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${selectedNode.color}60`
                }}>
                  <selectedNode.icon size={18} color={selectedNode.color} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
                      {selectedNode.title} — Execution Inspector
                    </h3>
                    <span style={{ fontSize: '11px', color: '#94A3B8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                      ⏱ Execution: {selectedNode.executionTime}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    Agent Class: <code>{selectedNode.agentName}</code> | Emitted A2A Signal: <strong style={{ color: selectedNode.color }}>{selectedNode.a2aMessage}</strong>
                  </div>
                </div>
              </div>

              {/* Jump to Agent Page button */}
              {selectedNode.id >= 1 && selectedNode.id <= 8 && (
                <button
                  onClick={() => {
                    const pageMap = {
                      1: 'case-detail',
                      2: 'cash-flow',
                      3: 'fraud-investigation',
                      4: 'credit-risk',
                      5: 'policy-compliance',
                      6: 'cam-viewer',
                      7: 'cam-viewer',
                      8: 'human-approval',
                    };
                    setPage(pageMap[selectedNode.id]);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60A5FA',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={13} /> Open Detailed View
                </button>
              )}
            </div>

            {/* Inspector 3 Columns: Tools, Input Payload, Output Payload */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', gap: '16px' }}>
              {/* Col 1: Tools Executed */}
              <div style={{ background: '#090E1A', borderRadius: '8px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '10px' }}>
                  <Code2 size={14} color="#38BDF8" />
                  <span>Deterministic Tools & APIs</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedNode.tools.map((t, idx) => (
                    <div key={idx} style={{
                      fontSize: '11px', fontFamily: 'monospace', color: '#93C5FD',
                      background: 'rgba(30, 58, 138, 0.25)', padding: '5px 8px', borderRadius: '4px',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      ⚡ {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Input Payload */}
              <div style={{ background: '#090E1A', borderRadius: '8px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                  📥 Input Stream (from Blackboard)
                </div>
                <pre style={{
                  margin: 0, fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace',
                  background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px',
                  overflowX: 'auto', maxHeight: '110px'
                }}>
                  {JSON.stringify(selectedNode.inputData, null, 2)}
                </pre>
              </div>

              {/* Col 3: Output Payload */}
              <div style={{ background: '#090E1A', borderRadius: '8px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#34D399', marginBottom: '8px' }}>
                  📤 Verified Output & Evidence
                </div>
                <pre style={{
                  margin: 0, fontSize: '11px', color: '#A7F3D0', fontFamily: 'monospace',
                  background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px',
                  overflowX: 'auto', maxHeight: '110px'
                }}>
                  {JSON.stringify(selectedNode.outputData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
        @keyframes flowRight {
          0% { left: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

