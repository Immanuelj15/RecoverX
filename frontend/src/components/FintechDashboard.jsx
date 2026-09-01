import React, { useState } from 'react';
import TopNav from './TopNav';
import KPICards from './KPICards';
import RevenueAtRiskTable from './RevenueAtRiskTable';
import RecoveryPipeline from './RecoveryPipeline';
import AuditTrail from './AuditTrail';
import RecoveryCaseDrawer from './RecoveryCaseDrawer';
import SystemStatus from './SystemStatus';
import AnalyticsCharts from './AnalyticsCharts';
import useRevenueRecovery from '../hooks/useRevenueRecovery';
import { PlayCircle, Eye } from 'lucide-react';

export default function FintechDashboard() {
  const {
    metrics,
    events,
    auditLogs,
    chartsData,
    isLoading,
    error,
    fetchDashboardData,
    simulateBatch,
    triggerDiagnosis,
    executeStep,
    fetchAuditLogs
  } = useRevenueRecovery();

  const [activeItem, setActiveItem] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(1);
  const [isHalted, setIsHalted] = useState(false);
  const [strategy, setStrategy] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (item) => {
    setActiveItem(item);
    setWorkflowStep(1);
    setIsHalted(false);
    setStrategy('');
    fetchAuditLogs(item.id);
  };

  const handleSimulateBatch = async () => {
    await simulateBatch();
  };

  const handleTriggerDiagnosis = async () => {
    if (!activeItem) return;
    try {
      const data = await triggerDiagnosis(activeItem.id);
      setStrategy(data.strategy);
      setWorkflowStep(2); // DIAGNOSED
      fetchAuditLogs(activeItem.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteStep = async () => {
    if (!activeItem) return;
    try {
      const response = await executeStep(activeItem.id);
      
      if (response && response.outcome === 'ESCALATED') {
        setIsHalted(true);
        setWorkflowStep(6); // OUTCOME (Failed)
        activeItem.status = 'ESCALATED';
      } else {
        if (workflowStep === 2) setWorkflowStep(3); // AI RECOMMENDATION
        else if (workflowStep === 3) setWorkflowStep(4); // POLICY CHECK
        else if (workflowStep === 4) setWorkflowStep(5); // RECOVERY
        else if (workflowStep === 5) {
          setWorkflowStep(6); // OUTCOME
          activeItem.status = response.data?.outcome || 'RECOVERED';
          fetchDashboardData(); 
        }
      }
      fetchAuditLogs(activeItem.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-brand-textPrimary font-sans pb-12 relative overflow-x-hidden">
      <TopNav />
      
      <main className="max-w-[1600px] w-full mx-auto px-6 mt-8 flex flex-col gap-8">
        
        {/* Hero / Command Center */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Revenue Recovery Command Center</h1>
            <p className="text-brand-textSecondary mt-2">Recover revenue before it becomes lost revenue.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {}} 
              className="px-4 py-2 rounded-lg border border-brand-border text-brand-textPrimary hover:bg-navy-800 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Live Events
            </button>
            <button 
              onClick={handleSimulateBatch} 
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-brand-blue hover:bg-brand-blueHover text-white transition-colors text-sm font-bold flex items-center gap-2 shadow-glow disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              Run Recovery Scan
            </button>
          </div>
        </section>

        {error && (
          <div className="p-4 bg-fintech-dangerBg border border-fintech-dangerBorder text-fintech-danger rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* KPIs */}
        <section>
          <KPICards metrics={metrics} />
        </section>

        {/* Pipeline & Leaks */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[500px]">
          <div className="xl:col-span-7 flex flex-col">
            <RevenueAtRiskTable 
              items={events} 
              activeItem={activeItem} 
              onSelect={handleSelect}
              isSimulating={isLoading}
            />
          </div>
          
          <div className="xl:col-span-5 flex flex-col">
            <RecoveryPipeline 
              activeItem={activeItem}
              currentStep={workflowStep}
              onDiagnose={handleTriggerDiagnosis}
              onExecute={handleExecuteStep}
              onOpenDrawer={() => setDrawerOpen(true)}
              isLoading={isLoading}
              isHalted={isHalted}
              strategy={strategy}
            />
          </div>
        </section>

        {/* Recovery Analytics */}
        <section>
          <AnalyticsCharts chartsData={chartsData} isLoading={isLoading} />
        </section>

        {/* Audit & System Status */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AuditTrail logs={auditLogs} />
          </div>
          <div className="lg:col-span-1">
            <SystemStatus />
          </div>
        </section>
        
      </main>

      {/* Side Drawer */}
      <RecoveryCaseDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        activeItem={activeItem}
        strategy={strategy}
        isHalted={isHalted}
        currentStep={workflowStep}
      />
    </div>
  );
}
