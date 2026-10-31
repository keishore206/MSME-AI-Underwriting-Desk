import React from 'react';
import useStore from './store/useStore';
import Dashboard from './components/pages/Dashboard';
import CaseDetail from './components/pages/CaseDetail';
import CashFlow from './components/pages/CashFlow';
import FraudInvestigation from './components/pages/FraudInvestigation';
import CreditRisk from './components/pages/CreditRisk';
import PolicyCompliance from './components/pages/PolicyCompliance';
import CAMViewer from './components/pages/CAMViewer';
import HumanApproval from './components/pages/HumanApproval';
import VideoWalkthrough from './components/pages/VideoWalkthrough';

export default function App() {
  const currentPage = useStore((s) => s.currentPage);

  const pages = {
    dashboard: <Dashboard />,
    'video-walkthrough': <VideoWalkthrough />,
    'case-detail': <CaseDetail />,
    'cash-flow': <CashFlow />,
    'fraud-investigation': <FraudInvestigation />,
    'credit-risk': <CreditRisk />,
    'policy-compliance': <PolicyCompliance />,
    'cam-viewer': <CAMViewer />,
    'human-approval': <HumanApproval />,
  };

  return pages[currentPage] || <Dashboard />;
}
