import React, { useState } from 'react';
import Layout from '../layout/Layout';
import useStore from '../../store/useStore';
import { CheckCircle, XCircle, AlertCircle, Shield, FileText, User, Clock } from 'lucide-react';

const C = { navy: '#0F2044', blue: '#1A56DB', green: '#059669', amber: '#D97706', red: '#DC2626', bg: '#F8FAFC', surface: '#FFFFFF', text: '#111827', muted: '#6B7280', border: '#E2E8F0' };
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', ...style }}>{children}</div>
);

const checklist = [
  { id: 1, label: 'CAM reviewed and AI findings verified', required: true },
  { id: 2, label: 'Original documents sighted and certified', required: true },
  { id: 3, label: 'Property valuation report reviewed', required: true },
  { id: 4, label: 'Conditions precedent confirmed achievable', required: true },
  { id: 5, label: 'Applicant informed of terms and accepted', required: false },
  { id: 6, label: 'Dual-control approval obtained (if > ₹50L)', required: false },
];

export default function HumanApproval() {
  const { approvalStatus, approveCase, rejectCase, a2aMessages } = useStore();
  const [checked, setChecked] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [officerNote, setOfficerNote] = useState('');

  const requiredChecked = checklist.filter(c => c.required).every(c => checked[c.id]);

  const handleApprove = () => {
    if (!requiredChecked) return;
    approveCase();
  };

  const handleReject = () => {
    rejectCase();
    setShowRejectModal(false);
  };

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  if (approvalStatus === 'approved') {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px' }}>
          <div style={{ background: '#f0fdf4', borderRadius: '50%', padding: '24px' }}>
            <CheckCircle size={56} color={C.green} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.green, margin: 0 }}>Loan Sanctioned</h2>
          <p style={{ color: C.muted, fontSize: '15px', textAlign: 'center', maxWidth: '500px' }}>
            CASE-2024-00847 has been approved by the credit officer. Ledger entry LDG-2024-00847 has been finalized.<br />
            Rajesh Textiles Pvt. Ltd. — ₹45,00,000 @ 11.25% / 60 months.
          </p>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: C.muted, marginBottom: '6px' }}>Ledger Reference</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: C.navy }}>LDG-2024-00847</div>
            <div style={{ fontSize: '12px', color: C.green, fontWeight: 700, marginTop: '4px' }}>STATUS: SANCTIONED ✓</div>
          </div>
          <div style={{ fontSize: '12px', color: C.amber, background: '#fff7ed', padding: '10px 16px', borderRadius: '8px', maxWidth: '460px', textAlign: 'center' }}>
            ⚠ Disbursal requires Conditions Precedent fulfillment. Separate operations workflow to be initiated.
          </div>
        </div>
      </Layout>
    );
  }

  if (approvalStatus === 'rejected') {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px' }}>
          <div style={{ background: '#fef2f2', borderRadius: '50%', padding: '24px' }}>
            <XCircle size={56} color={C.red} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.red, margin: 0 }}>Application Rejected</h2>
          <p style={{ color: C.muted, fontSize: '15px', textAlign: 'center' }}>
            CASE-2024-00847 has been declined by the credit officer. Applicant communication to follow.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Human Approval Gate</h1>
          <div style={{ color: C.muted, fontSize: '13px', marginTop: '4px' }}>CASE-2024-00847 · Mandatory Officer Review · Awaiting Action</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Clock size={14} color={C.amber} />
          <span style={{ background: '#fff7ed', color: C.amber, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>⏳ PENDING_HUMAN_APPROVAL</span>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{ background: '#fff7ed', border: `1px solid ${C.amber}50`, borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <AlertCircle size={20} color={C.amber} style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <div style={{ fontWeight: 700, color: C.amber, fontSize: '14px' }}>Human Approval Required</div>
          <div style={{ color: '#92400e', fontSize: '13px', marginTop: '2px' }}>
            This system does not permit autonomous disbursal. A qualified credit officer must review the AI-generated CAM, complete the checklist, and explicitly approve or reject this application. Your decision will be logged with timestamp and user ID.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Case Summary */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '14px' }}>
            <FileText size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Case Summary
          </div>
          {[
            { label: 'Applicant', value: 'Rajesh Textiles Pvt. Ltd.' },
            { label: 'Loan Amount', value: '₹45,00,000', bold: true },
            { label: 'Tenor', value: '60 months @ 11.25% p.a.' },
            { label: 'EMI', value: '₹97,456 / month' },
            { label: 'AI Risk Rating', value: 'A- (Score: 85/100)', color: C.green },
            { label: 'Fraud Score', value: '14/100 — LOW', color: C.green },
            { label: 'DSCR', value: '1.87x (Min 1.25x)', color: C.green },
            { label: 'Policy Rules', value: '8/8 PASSED', color: C.green },
            { label: 'AI Recommendation', value: 'RECOMMEND APPROVE', color: C.green },
            { label: 'Ledger Entry', value: 'LDG-2024-00847 — PENDING' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 9 ? `1px solid ${C.border}` : 'none', fontSize: '12px' }}>
              <span style={{ color: C.muted, fontWeight: 600 }}>{r.label}</span>
              <span style={{ color: r.color || C.text, fontWeight: r.bold ? 800 : r.color ? 700 : 500 }}>{r.value}</span>
            </div>
          ))}
        </Card>

        {/* Officer Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '14px' }}>
              <Shield size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Officer Checklist
            </div>
            {checklist.map((item) => (
              <div
                key={item.id}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: item.id < checklist.length ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}
                onClick={() => toggleCheck(item.id)}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${checked[item.id] ? C.green : C.border}`,
                  background: checked[item.id] ? C.green : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                }}>
                  {checked[item.id] && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>}
                </div>
                <div>
                  <span style={{ fontSize: '13px', color: checked[item.id] ? C.green : C.text, textDecoration: checked[item.id] ? 'line-through' : 'none' }}>{item.label}</span>
                  {item.required && <span style={{ fontSize: '10px', color: C.red, fontWeight: 700, marginLeft: '6px' }}>Required</span>}
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '10px' }}>
              <User size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Officer Notes
            </div>
            <textarea
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="Add review notes, conditions, or remarks..."
              style={{ width: '100%', height: '80px', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', color: C.text, outline: 'none' }}
            />
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <Card style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
        {!requiredChecked && (
          <span style={{ fontSize: '12px', color: C.amber, flex: 1 }}>⚠ Complete all required checklist items to enable approval</span>
        )}
        <button
          onClick={() => setShowRejectModal(true)}
          style={{ padding: '10px 24px', border: `1px solid ${C.red}`, color: C.red, background: 'white', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
        >
          ✗ Reject Application
        </button>
        <button
          onClick={handleApprove}
          disabled={!requiredChecked}
          style={{
            padding: '10px 28px', background: requiredChecked ? C.green : '#d1fae5', color: 'white', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '14px', cursor: requiredChecked ? 'pointer' : 'not-allowed', opacity: requiredChecked ? 1 : 0.6,
          }}
        >
          ✓ Approve & Finalize Sanction
        </button>
      </Card>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 16px', color: C.red }}>Reject Application</h3>
            <p style={{ fontSize: '13px', color: C.muted, marginBottom: '12px' }}>Please provide a reason for rejection. This will be logged and communicated to the applicant.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{ width: '100%', height: '100px', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowRejectModal(false)} style={{ padding: '8px 18px', border: `1px solid ${C.border}`, background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Cancel</button>
              <button onClick={handleReject} style={{ padding: '8px 18px', background: C.red, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

