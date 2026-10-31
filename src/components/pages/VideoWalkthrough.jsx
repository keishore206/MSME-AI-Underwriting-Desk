import React, { useState, useEffect, useRef } from 'react';
import Layout from '../layout/Layout';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2,
  ChevronRight, ChevronLeft, Sparkles, CheckCircle, Shield,
  FileText, Activity, AlertCircle, Award, Compass, MonitorPlay
} from 'lucide-react';

const SCENES = [
  {
    id: 0,
    timestamp: '0:00',
    duration: 14,
    title: '1. Executive Overview & Problem Statement',
    agent: 'Platform Architecture',
    badge: 'TAT: 7 Days ➔ < 30 Mins',
    image: '/screens/01_cockpit.png',
    narration:
      'Welcome to the MSME Loan Underwriting Desk. Traditionally, evaluating small and medium enterprise loans is slow, inconsistent, and manually intensive. Credit officers spend 5 to 10 days reconciling bank statements, GST filings, and bureau data, often missing complex circular transactions. Our Agentic AI platform coordinates six specialized autonomous agents to deliver a fully auditable, evidence-backed credit decision in under 30 minutes.',
    highlights: [
      'Problem: Manual review of 6+ documents creates high turnaround time and variance in risk assessments',
      'Solution: Specialized autonomous AI agents collaborating over a standardized A2A message bus',
      'Key Metric: Underwriting turnaround time reduced from 7 days to under 30 minutes',
    ],
  },
  {
    id: 1,
    timestamp: '0:22',
    duration: 12,
    title: '2. Credit Desk Cockpit & n8n Workflow Canvas',
    agent: 'Orchestrator DAG Engine',
    badge: 'Real-Time DAG Execution',
    image: '/screens/01_cockpit.png',
    narration:
      'At the center of the desk is the Cockpit Dashboard, featuring our visual n8n-style workflow canvas. Here, credit officers can monitor the live execution of each agent, observe real-time Agent-to-Agent message bus traffic, and track operational KPIs across the entire loan portfolio.',
    highlights: [
      'Live operational KPIs: Cases processed today, pending approval, and portfolio TAT',
      'Interactive n8n DAG canvas showing active node execution states',
      'Terminal multi-agent event bus streaming A2A coordination messages',
    ],
  },
  {
    id: 2,
    timestamp: '0:42',
    duration: 14,
    title: '3. Case Ingestion & 6-Document Intake',
    agent: 'Document Intake Agent',
    badge: '2,847 Txns Parsed · 98% Match',
    image: '/screens/02_case_details.png',
    narration:
      'In our sample case, Rajesh Textiles Private Limited applied for a ₹45 lakh term loan to upgrade weaving machinery. The Document Intake Agent automatically parses and cross-verifies 24 months of bank statements, 12 months of GST returns, 3 years of tax returns, and authenticates promoter PAN and Aadhaar against government databases.',
    highlights: [
      'Applicant: Rajesh Textiles Pvt. Ltd. (Surat & Bhiwandi, 8-year vintage)',
      'Loan Request: ₹45,00,000 for high-efficiency weaving machinery expansion',
      'Automated extraction of 2,847 bank transactions and GST turnover reconciliation',
    ],
  },
  {
    id: 3,
    timestamp: '1:04',
    duration: 14,
    title: '4. Deterministic Cash-Flow & Stress Testing',
    agent: 'Cash-Flow Analysis Agent',
    badge: 'DSCR 1.87x · ABB ₹12.15L',
    image: '/screens/03_cash_flow.png',
    narration:
      'Next, the Cash-Flow Analysis Agent executes deterministic financial math in pure Python code—never relying on probabilistic LLM estimates. It calculates an Average Bank Balance of ₹12.15 lakhs, a healthy Debt Service Coverage Ratio of 1.87, and verifies financial resilience under a 20 percent revenue shock.',
    highlights: [
      'Zero LLM math: Deterministic Python financial calculators prevent calculation drift',
      'Average Bank Balance (ABB) of ₹12.15L & Debt Service Coverage (DSCR) of 1.87x (Min: 1.25x)',
      'Stress testing confirms debt service remains viable under -20% revenue shock',
    ],
  },
  {
    id: 4,
    timestamp: '1:26',
    duration: 14,
    title: '5. Fraud Investigation & Network Graph',
    agent: 'Fraud Investigation Agent',
    badge: 'Fraud Score 14/100 · AML Clear',
    image: '/screens/04_fraud_investigation.png',
    narration:
      'The Fraud Investigation Agent analyzes transaction velocity, round-tripping patterns, and counterparty relationships through a visual network graph. It screens the entity against RBI defaulter watchlists and evaluates flagged anomalies, confirming a low fraud score of 14 out of 100.',
    highlights: [
      'Interactive transaction graph mapping 34 counterparties to detect shell patterns',
      'Round-trip anomaly TXN-8847-01 investigated and cleared as seasonal trade return',
      'Dynamic re-routing: Orchestrator loops back to Agent 1 if fraud is suspected (max 5 cycles)',
    ],
  },
  {
    id: 5,
    timestamp: '1:48',
    duration: 13,
    title: '6. Credit Risk Assessment & Scorecard',
    agent: 'Credit Risk Agent',
    badge: 'CIBIL 748/762 · Rating Band A-',
    image: '/screens/05_credit_risk.png',
    narration:
      'The Credit Risk Agent ingests CIBIL bureau reports, scoring the entity at 748 and the promoter at 762. Using a six-factor weighted matrix, it assigns an internal credit rating of A minus, with a low one-year default probability of 0.5 percent.',
    highlights: [
      'Dual bureau scoring: Entity CIBIL 748 and Promoter CIBIL 762 with zero 24-month delinquency',
      'Weighted credit scorecard (85/100) assigning A- rating band',
      'Probability of Default (PD 2.8%) and Loss Given Default (LGD 35%)',
    ],
  },
  {
    id: 6,
    timestamp: '2:08',
    duration: 12,
    title: '7. Policy & Compliance Rule Engine',
    agent: 'Policy & Compliance Agent',
    badge: '8/8 Hard Limits Passed',
    image: '/screens/06_policy_compliance.png',
    narration:
      'The Policy and Compliance Agent enforces hard boundary limits in code. All eight internal and RBI MSME policy rules are satisfied, with ₹86.5 lakhs of headroom available beneath the sector exposure ceiling.',
    highlights: [
      'Hard limits enforced in code, not prompts: LTV cap, min DSCR, maximum DBSR',
      'RBI MSME priority sector classification validated as fully compliant',
      'Exposure headroom of ₹86.5L beneath the ₹1.50 Crore internal ceiling',
    ],
  },
  {
    id: 7,
    timestamp: '2:27',
    duration: 16,
    title: '8. Credit Appraisal Memo & Mandatory Human Gate',
    agent: 'CAM Generator & Human Gate',
    badge: 'No Autonomous Disbursal',
    image: '/screens/08_human_approval.png',
    narration:
      'Finally, the CAM Generator synthesizes an evidence-linked Credit Appraisal Memo with 47 cited transaction references. Crucially, autonomous disbursal is strictly prevented. The loan sanction remains locked in the core-banking ledger until a human underwriter reviews the memo, completes the mandatory checklist, and signs off. Thank you for touring the MSME AI Underwriting Desk.',
    highlights: [
      'Standardized institutional Credit Appraisal Memo with 7 expandable evidence sections',
      'Mandatory Human-in-the-Loop Gate: AI recommends, but humans approve',
      'Core-banking ledger entry LDG-2024-00847 finalized with digital audit trail',
    ],
  },
];

export default function VideoWalkthrough() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const currentScene = SCENES[currentSceneIdx];

  // Voice narration using Web Speech Synthesis API
  const speakNarration = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Play / Pause handling
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          speakNarration(currentScene.narration);
        }
      }
    }
  };

  // Switch scene
  const goToScene = (idx) => {
    if (idx < 0 || idx >= SCENES.length) return;
    setCurrentSceneIdx(idx);
    setProgress(0);
    if (isPlaying) {
      speakNarration(SCENES[idx].narration);
    }
  };

  // Timeline ticker
  useEffect(() => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      const totalSec = currentScene.duration;
      const stepMs = 100;
      const stepIncrement = (stepMs / (totalSec * 1000)) * 100;

      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (currentSceneIdx < SCENES.length - 1) {
              setCurrentSceneIdx(i => i + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return p + stepIncrement;
        });
      }, stepMs);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentSceneIdx, currentScene.duration]);

  // Handle scene change during playback
  useEffect(() => {
    if (isPlaying) {
      speakNarration(currentScene.narration);
    }
  }, [currentSceneIdx]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: '#1A56DB', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MonitorPlay size={18} color="#fff" />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
              Interactive Video Walkthrough & Tour
            </h1>
            <span style={{
              background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE',
              fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px'
            }}>
              8 Chapters · Voiceover Enabled
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: '4px 0 0 40px' }}>
            Automated walkthrough presentation explaining the architecture, multi-agent pipeline, and credit decisions.
          </p>
        </div>

        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setCurrentSceneIdx(0);
              setProgress(0);
              setIsPlaying(true);
              speakNarration(SCENES[0].narration);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#1A56DB', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(26,86,219,0.25)'
            }}
          >
            <Play size={14} fill="#fff" /> Play from Beginning
          </button>
        </div>
      </div>

      {/* Main Video Viewport (16:9 Cinematic Container) */}
      <div
        ref={containerRef}
        style={{
          backgroundColor: '#090E1A',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '24px'
        }}
      >
        {/* Top Overlay Badge */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '999px',
            padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isPlaying ? '#EF4444' : '#10B981', animation: isPlaying ? 'pulseRec 1.5s infinite' : 'none' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
              {currentScene.title}
            </span>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '999px',
            padding: '6px 14px', fontSize: '11px', fontWeight: 700, color: '#60A5FA'
          }}>
            {currentScene.badge}
          </div>
        </div>

        {/* Video Stage / Slide Visual with Ken-Burns Motion */}
        <div style={{
          width: '100%', height: '520px', position: 'relative',
          backgroundColor: '#070C18', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img
            key={currentScene.id}
            src={currentScene.image}
            alt={currentScene.title}
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              animation: isPlaying ? 'kenBurns 14s infinite alternate ease-in-out' : 'none',
              transition: 'opacity 0.5s ease',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
            }}
          />

          {/* Subtitle Teleprompter Overlay */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '24px', right: '24px',
            background: 'linear-gradient(180deg, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.95) 100%)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px', padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={14} color="#60A5FA" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Voiceover Narration • {currentScene.agent}
              </span>
            </div>
            <p style={{
              fontSize: '14px', color: '#F8FAFC', lineHeight: '22px', margin: 0,
              fontWeight: 500
            }}>
              "{currentScene.narration}"
            </p>
          </div>
        </div>

        {/* Video Controls & Timeline Bar */}
        <div style={{
          backgroundColor: '#0F172A',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Progress Bar with Chapter Ticks */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPct = (e.clientX - rect.left) / rect.width;
              const targetScene = Math.floor(clickPct * SCENES.length);
              goToScene(targetScene);
            }}
            style={{
              height: '6px', backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '999px', position: 'relative', cursor: 'pointer', overflow: 'hidden'
            }}
          >
            <div style={{
              height: '100%',
              width: `${((currentSceneIdx + progress / 100) / SCENES.length) * 100}%`,
              background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
              borderRadius: '999px',
              transition: 'width 0.1s linear'
            }} />
          </div>

          {/* Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#1A56DB', border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                {isPlaying ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="#fff" />}
              </button>

              {/* Prev / Next Scene */}
              <button
                onClick={() => goToScene(currentSceneIdx - 1)}
                disabled={currentSceneIdx === 0}
                style={{ background: 'transparent', border: 'none', color: currentSceneIdx === 0 ? '#475569' : '#CBD5E1', cursor: currentSceneIdx === 0 ? 'default' : 'pointer' }}
                title="Previous Scene"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => goToScene(currentSceneIdx + 1)}
                disabled={currentSceneIdx === SCENES.length - 1}
                style={{ background: 'transparent', border: 'none', color: currentSceneIdx === SCENES.length - 1 ? '#475569' : '#CBD5E1', cursor: currentSceneIdx === SCENES.length - 1 ? 'default' : 'pointer' }}
                title="Next Scene"
              >
                <ChevronRight size={20} />
              </button>

              {/* Time display */}
              <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace' }}>
                Chapter {currentSceneIdx + 1} of {SCENES.length}
              </span>
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Mute Voiceover */}
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (newMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  } else if (isPlaying) {
                    speakNarration(currentScene.narration);
                  }
                }}
                style={{
                  background: 'transparent', border: 'none', color: isMuted ? '#EF4444' : '#CBD5E1',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px'
                }}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isMuted ? 'Voice Muted' : 'Voice Narration'}</span>
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  goToScene(0);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                title="Reset Tour"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid Selection */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0' }}>
          Presentation Chapters & Scene Index
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {SCENES.map((scene, idx) => {
            const isSelected = currentSceneIdx === idx;
            return (
              <div
                key={scene.id}
                onClick={() => goToScene(idx)}
                style={{
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #1A56DB' : '1px solid #E2E8F0',
                  padding: '12px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: isSelected ? '#1A56DB' : '#64748B' }}>
                    CHAPTER {idx + 1}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    {scene.timestamp}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#1E40AF' : '#111827', lineHeight: '16px', marginBottom: '6px' }}>
                  {scene.title.split('. ')[1]}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {scene.agent}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulseRec {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.04) translateY(-8px); }
        }
      `}</style>
    </Layout>
  );
}
