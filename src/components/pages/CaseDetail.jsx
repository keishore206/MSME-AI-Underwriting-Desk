import React, { useState } from 'react';
import Layout from '../layout/Layout';
import useStore from '../../store/useStore';
import { applicantData, bankStatementSummary, financialRatios, bureauData, agentSteps } from '../../data/syntheticCase';
import { Building2, FileText, BarChart2, BookOpen, CheckCircle } from 'lucide-react';

const tabs = ['Overview', 'Documents', 'Analysis', 'CAM Report'];

const Field = ({ label, value, bold }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '12px' }}>
    <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    <span style={{ fontSize: '13px', color: '#111827', fontWeight: bold ? 700 : 400 }}>{value}</span>
  </div>
);

const CaseDetail = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const d = applicantData;

  return (
    <Layout>
      {/* Case Header */}
      <div style={{
        backgroundColor: '#0F2044', borderRadius: '12px', padding: '24px 28px',
        marginBottom: '24px', color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Building2 size={22} color="#93C5FD" />
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{d.applicantName}</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['MSME', 'GST Verified', 'ITR Filed', 'Udyam Registered', 'Priority Sector'].map(tag => (
                <span key={tag} style={{
                  fontSize: '11px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.12)',
                  padding: '3px 10px', borderRadius: '9999px', color: '#CBD5E1'
                }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>₹45,00,000</div>
            <span style={{
              fontSize: '12px', fontWeight: 700, backgroundColor: '#D97706', color: '#fff',
              padding: '4px 12px', borderRadius: '9999px', display: 'inline-block', marginTop: '6px'
            }}>PENDING APPROVAL</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
          Case ID: {d.id} &nbsp;|&nbsp; {d.businessType} &nbsp;|&nbsp; {d.location} &nbsp;|&nbsp; Vintage: {d.vintage}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #E2E8F0', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 20px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
            fontSize: '13px', fontWeight: 600,
            color: activeTab === tab ? '#1A56DB' : '#6B7280',
            borderBottom: activeTab === tab ? '2px solid #1A56DB' : '2px solid transparent',
            marginBottom: '-2px'
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Col 1: Applicant Profile */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', margin: '0 0 16px 0' }}>Applicant Profile</h3>
            <Field label="Entity Name" value={d.applicantName} bold />
            <Field label="Promoter" value={d.promoter} />
            <Field label="PAN" value={d.pan} />
            <Field label="GSTIN" value={d.gstin} />
            <Field label="Udyam No." value={d.udyam} />
            <Field label="Business Type" value={d.businessType} />
            <Field label="Location" value={d.location} />
            <Field label="Vintage" value={d.vintage} />
            <Field label="Loan Purpose" value={d.loanRequest.purpose} />
            <Field label="Loan Type" value={d.loanRequest.type} />
          </div>

          {/* Col 2: Financial Snapshot */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', margin: '0 0 16px 0' }}>Financial Snapshot</h3>
            <Field label="DSCR" value={financialRatios.dscr} bold />
            <Field label="DBSR" value={financialRatios.dbsr} bold />
            <Field label="Avg Monthly Credit" value="₹12,50,000" />
            <Field label="Avg Monthly Debit" value="₹10,80,000" />
            <Field label="GST Turnover FY24" value="₹1,72,00,000" />
            <Field label="Net Profit FY24" value="₹13,80,000" />
            <Field label="Gross Profit Margin" value={`${financialRatios.grossProfitMargin}%`} />
            <Field label="Net Profit Margin" value={`${financialRatios.netProfitMargin}%`} />
            <Field label="Current Ratio" value={financialRatios.currentRatio} />
            <Field label="Debt-Equity Ratio" value={financialRatios.debtEquityRatio} />
            <Field label="Interest Coverage" value={financialRatios.interestCoverageRatio} />
            <Field label="YoY Credit Growth" value="+16.2%" bold />
          </div>

          {/* Col 3: Risk Summary */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', margin: '0 0 16px 0' }}>Risk Summary</h3>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Overall Risk</span>
              <span style={{
                fontSize: '15px', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#065F46',
                border: '1px solid #A7F3D0', padding: '4px 16px', borderRadius: '9999px'
              }}>LOW</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Fraud Score</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '14%', height: '100%', backgroundColor: '#059669', borderRadius: '9999px' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>14/100</span>
              </div>
            </div>

            <Field label="Credit Rating" value={bureauData.rating} bold />
            <Field label="Entity Bureau Score" value={bureauData.entityScore} bold />
            <Field label="Promoter Bureau Score" value={bureauData.promoterScore} />
            <Field label="PD (1-year)" value="1.8%" />
            <Field label="LGD Estimate" value="28%" />
            <Field label="Expected Loss" value="0.50%" />
            <Field label="DPD Status" value={bureauData.dpd} />
            <Field label="Write-offs" value={bureauData.writtenOff} />
          </div>
        </div>
      )}

      {/* Agent Findings Timeline */}
      {activeTab === 'Overview' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', margin: '0 0 16px 0' }}>Agent Findings Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {agentSteps.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', gap: '14px', paddingBottom: '16px', position: 'relative' }}>
                {i < agentSteps.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '10px', top: '24px',
                    width: '2px', height: 'calc(100% - 8px)', backgroundColor: '#E2E8F0'
                  }} />
                )}
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1
                }}>
                  <CheckCircle size={13} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{step.agentName}</span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>• {step.duration}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, backgroundColor: '#ECFDF5',
                      color: '#059669', padding: '1px 8px', borderRadius: '9999px'
                    }}>{step.message}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {step.findings.slice(0, 2).map((f, j) => (
                      <li key={j} style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Documents' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Extracted & Verified Application Documents</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { name: 'Bank Statement (HDFC Bank - 24 Months)', type: 'PDF / e-Statement', status: 'Verified', count: '2,847 Txns', size: '4.8 MB', date: '28-Oct-2024' },
              { name: 'GST Returns (GSTR-3B & GSTR-1 - 12 Months)', type: 'JSON / GSTN Sync', status: 'Verified', count: '₹1.72 Cr Turnover', size: '1.2 MB', date: '28-Oct-2024' },
              { name: 'Income Tax Returns (ITR-6 - 3 Years)', type: 'XML / e-Filing Portal', status: 'Verified', count: 'AY22-23 to AY24-25', size: '890 KB', date: '27-Oct-2024' },
              { name: 'KYC: PAN & Aadhaar (Promoter & Entity)', type: 'NSDL & UIDAI Verification', status: 'Verified', count: '98% Name Match', size: '450 KB', date: '28-Oct-2024' },
              { name: 'Udyam MSME Registration Certificate', type: 'MSME Portal Sync', status: 'Verified', count: 'UDYAM-MH-15-0034521', size: '320 KB', date: '28-Oct-2024' },
              { name: 'Audited Financial Statements (P&L, Balance Sheet)', type: 'CA Certified PDF', status: 'Verified', count: 'FY22, FY23, FY24', size: '3.1 MB', date: '28-Oct-2024' },
            ].map((doc, idx) => (
              <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#F8FAFC' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} color="#1A56DB" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{doc.name}</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '9999px' }}>✓ {doc.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{doc.type} • {doc.count}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Received: {doc.date} • {doc.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Analysis' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { title: 'Cash Flow Analysis', desc: 'ABB ₹12.5L, DSCR 1.87x, 24-month statement analysis & stress scenarios.', link: 'cash-flow', color: '#1A56DB' },
            { title: 'Fraud Investigation', desc: 'Fraud score 14/100, transaction graph analysis, round-tripping & AML screening.', link: 'fraud-investigation', color: '#059669' },
            { title: 'Credit Risk & Bureau', desc: 'Entity 748, Promoter 762, rating band A-, expected loss 0.50%.', link: 'credit-risk', color: '#7C3AED' },
            { title: 'Policy & Compliance', desc: '8/8 rules passed, exposure ceiling headroom ₹86.5L, RBI MSME norms compliant.', link: 'policy-compliance', color: '#D97706' },
            { title: 'CAM Generation', desc: 'Credit Appraisal Memo synthesized with evidence citations & conditions precedent.', link: 'cam-viewer', color: '#0F2044' },
            { title: 'Human Approval Gate', desc: 'Mandatory human sign-off gate before core-banking ledger finalization.', link: 'human-approval', color: '#DC2626' },
          ].map((card, i) => (
            <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: card.color, margin: '0 0 8px 0' }}>{card.title}</h4>
                <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: '18px', margin: 0 }}>{card.desc}</p>
              </div>
              <button
                onClick={() => { const { setPage } = useStore.getState(); setPage(card.link); }}
                style={{
                  marginTop: '16px', padding: '8px 14px', borderRadius: '6px', border: 'none',
                  backgroundColor: card.color, color: '#fff', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', textAlign: 'center'
                }}
              >
                View Deep Dive →
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'CAM Report' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Credit Appraisal Memo Summary</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>CAM-2024-00847 • Generated by Multi-Agent AI Underwriting Desk</p>
            </div>
            <button
              onClick={() => { const { setPage } = useStore.getState(); setPage('cam-viewer'); }}
              style={{
                padding: '8px 16px', backgroundColor: '#1A56DB', color: '#fff', border: 'none',
                borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Open Interactive CAM Viewer →
            </button>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '16px', border: '1px solid #E2E8F0', fontSize: '13px', lineHeight: '20px' }}>
            <p><strong>Proposed Facility:</strong> Term Loan of ₹45,00,000 for 60 months @ 11.25% p.a. (Monthly EMI: ₹97,456)</p>
            <p><strong>Primary Collateral:</strong> Hypothecation of new textile machinery (Estimated value ₹58L)</p>
            <p><strong>Collateral Security:</strong> Equitable mortgage of commercial factory property at Bhiwandi, Maharashtra (Estimated value ₹77L, LTV 58.4%)</p>
            <p><strong>Key Metrics:</strong> DSCR 1.87x | DBSR 38.2% | CIBIL 748/762 | Fraud Score 14/100 | All 8/8 Hard Policy Limits Passed</p>
            <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#ECFDF5', borderRadius: '6px', color: '#065F46', fontWeight: 600 }}>
              ✓ Recommendation: APPROVED FOR SANCTION subject to standard pre-disbursement conditions and credit officer sign-off.
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CaseDetail;
