import React, { useState } from 'react';
import HeroMetrics from './HeroMetrics';
import LiveBatchTable from './LiveBatchTable';
import WorkflowVisualizer from './WorkflowVisualizer';
import AuditLogPanel from './AuditLogPanel';
import useRevenueRecovery from '../hooks/useRevenueRecovery';

export default function FintechDashboard() {
  const {
    metrics,
    events,
    auditLogs,
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

  const handleSelect = (item) => {
    setActiveItem(item);
    setWorkflowStep(1); // Reset local visualizer state
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
      const { data } = await triggerDiagnosis(activeItem.id);
      setStrategy(data.strategy);
      setWorkflowStep(2); // Move to Step 2: Policy & Safety Check
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
        setWorkflowStep(4);
        activeItem.status = 'ESCALATED'; // Optimistic local update
      } else {
        // Successfully moved a step
        if (workflowStep === 2) {
          setWorkflowStep(3); // Moved to execution
        } else if (workflowStep === 3) {
          setWorkflowStep(4); // Moved to resolution
          activeItem.status = response.data?.outcome || 'RECOVERED';
          fetchDashboardData(); // Refresh global metrics
        }
      }
      
      fetchAuditLogs(activeItem.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-textPrimary p-6 lg:p-8 flex flex-col font-sans">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-brand-blue flex items-center justify-center shadow-glow">
              <span className="text-white font-bold font-mono">RX</span>
            </div>
            RecoverX Dashboard
          </h1>
          <p className="text-brand-textSecondary mt-2">AI Revenue Recovery Agent • Razorpay Buildathon 2026</p>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-fintech-dangerBg border border-fintech-dangerBorder text-fintech-danger rounded-lg">
          {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
        
        {/* Section A: Hero Metrics */}
        <section>
          <HeroMetrics metrics={metrics} />
        </section>

        {/* Sections B & C: Middle Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          {/* Section B */}
          <LiveBatchTable 
            items={events} 
            activeItem={activeItem} 
            onSelect={handleSelect}
            onTrigger={() => {}} // Not used auto anymore, user clicks inside visualizer
            onSimulate={handleSimulateBatch}
            isSimulating={isLoading}
          />
          
          {/* Section C */}
          <WorkflowVisualizer 
            activeItem={activeItem}
            currentStep={workflowStep}
            onDiagnose={handleTriggerDiagnosis}
            onExecute={handleExecuteStep}
            isLoading={isLoading}
            isHalted={isHalted}
            strategy={strategy}
          />
        </section>

        {/* Section D: Bottom Row */}
        <section>
          <AuditLogPanel logs={auditLogs} />
        </section>
        
      </div>
    </div>
  );
}
