import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OverviewView from './views/OverviewView';
import RecoveryCasesView from './views/RecoveryCasesView';
import AnalyticsView from './views/AnalyticsView';
import AuditTrailView from './views/AuditTrailView';
import PromisesView from './views/PromisesView';
import PoliciesView from './views/PoliciesView';
import BatchSimulatorView from './views/BatchSimulatorView';
import useRevenueRecovery from './hooks/useRevenueRecovery';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const recoveryState = useRevenueRecovery();

  const renderView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView {...recoveryState} setActiveTab={setActiveTab} />;
      case 'cases':
        return <RecoveryCasesView {...recoveryState} />;
      case 'analytics':
        return <AnalyticsView {...recoveryState} />;
      case 'audit':
        return <AuditTrailView {...recoveryState} />;
      case 'promises':
        return <PromisesView {...recoveryState} />;
      case 'settings':
        return <PoliciesView />;
      case 'batch':
        return <BatchSimulatorView {...recoveryState} />;
      default:
        return <OverviewView {...recoveryState} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-appBg text-brand-textPrimary font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-[248px] flex flex-col min-h-screen relative overflow-hidden">
        <TopBar activeTab={activeTab} activeItem={null} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
