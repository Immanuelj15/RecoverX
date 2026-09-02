import React, { useState } from 'react';
import RevenueAtRiskTable from '../components/RevenueAtRiskTable';
import CaseDetailWorkspace from '../components/CaseDetailWorkspace';

export default function RecoveryCasesView({
  events,
  isLoading,
  triggerDiagnosis,
  executeStep,
  fetchAuditLogs,
  fetchDashboardData,
  auditLogs // Assuming we need to pass this down
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(1);
  const [isHalted, setIsHalted] = useState(false);
  const [strategy, setStrategy] = useState('');

  const handleSelect = (item) => {
    setActiveItem(item);
    setWorkflowStep(1);
    setIsHalted(false);
    setStrategy('');
    fetchAuditLogs(item.id);
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

  if (activeItem) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto h-full">
        <CaseDetailWorkspace 
          activeItem={activeItem}
          onBack={() => setActiveItem(null)}
          currentStep={workflowStep}
          onDiagnose={handleTriggerDiagnosis}
          onExecute={handleExecuteStep}
          strategy={strategy}
          isLoading={isLoading}
          isHalted={isHalted}
          auditLogs={auditLogs}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-textPrimary tracking-tight">Recovery Queue</h1>
          <p className="text-sm text-brand-textSecondary mt-1">Prioritize the highest-value recoveries and take compliant next actions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-brand-border rounded-lg text-sm font-semibold text-brand-textPrimary bg-white hover:bg-brand-surface transition-colors shadow-sm">
            Export List
          </button>
          <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
            Start selected workflows
          </button>
        </div>
      </div>
      <section className="h-full">
        <RevenueAtRiskTable 
          items={events} 
          activeItem={activeItem} 
          onSelect={handleSelect}
          isSimulating={isLoading}
        />
      </section>
    </div>
  );
}
