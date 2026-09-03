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
  auditLogs,
  simulateBatch,
  setActiveTab
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(1);
  const [isHalted, setIsHalted] = useState(false);
  const [strategy, setStrategy] = useState('');

  const handleExportList = () => {
    const dataToExport = events && events.length > 0 ? events : [];
    const headers = ['Case ID', 'Customer Name', 'Payment Method', 'Failure Reason', 'Risk Amount (INR)', 'Risk Band', 'Recovery State', 'Created At'];
    const csvRows = [headers.join(',')];

    dataToExport.forEach(item => {
      const row = [
        item.id || item.payment_id || '',
        `"${(item.customer_name || item.merchant_name || 'Customer').replace(/"/g, '""')}"`,
        item.payment_method || 'UPI',
        item.failure_reason || 'insufficient_balance',
        item.amount_inr || item.risk_amount || 0,
        item.risk_band || 'MEDIUM',
        item.recovery_state || item.status || 'UNRECOVERED',
        `"${item.created_at || new Date().toISOString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `recoverx_recovery_queue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartWorkflows = async () => {
    if (simulateBatch) await simulateBatch();
    if (setActiveTab) setActiveTab('batch');
  };

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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recovery Queue</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">Prioritize the highest-value recoveries and take compliant next actions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportList}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Export List (CSV)
          </button>
          <button 
            onClick={handleStartWorkflows}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
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
