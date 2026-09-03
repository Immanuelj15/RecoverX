import React, { useState } from 'react';
import { ArrowLeft, User, ShieldCheck, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import CaseOverviewTab from './CaseOverviewTab';
import CaseTimelineTab from './CaseTimelineTab';
import CaseOutreachTab from './CaseOutreachTab';
import CasePaymentsTab from './CasePaymentsTab';
import CaseAuditTab from './CaseAuditTab';
import AIRecoverySidebar from './AIRecoverySidebar';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'payments', label: 'Payments' },
  { id: 'audit', label: 'Audit Trail' }
];

export default function CaseDetailWorkspace({
  activeItem,
  onBack,
  currentStep,
  onDiagnose,
  onExecute,
  strategy,
  isLoading,
  isHalted,
  auditLogs
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!activeItem) return null;

  return (
    <div className="flex flex-col h-full animate-fade-in pb-12">
      {/* Breadcrumb & Header */}
      <div className="mb-8 flex flex-col gap-5">
        <div className="flex items-center text-sm text-slate-500 font-semibold">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Recovery Queue
          </button>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <span className="text-slate-900 font-bold">{activeItem.id.split('-')[0]}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 border border-blue-500 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-blue-500/20 flex-shrink-0">
              {activeItem.customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{activeItem.customerName}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 mt-2 text-sm">
                <span className="text-slate-500 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md text-xs">{activeItem.id.split('-')[0]}</span>
                <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                  {activeItem.channel.replace(/_/g, ' ').toLowerCase()}
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold uppercase tracking-wider">
                  High Priority
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Eligible for Recovery
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-slate-50 p-4 rounded-xl border border-slate-200/80 w-full lg:w-auto justify-around">
            <div className="text-left">
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-1">Amount at Risk</div>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">₹{activeItem.riskAmount.toLocaleString('en-IN')}</div>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="text-left">
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-1">Recovery Likelihood</div>
              <div className="text-2xl lg:text-3xl font-extrabold text-blue-600 tabular-nums tracking-tight">74%</div>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="text-left">
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-1">Assigned Owner</div>
              <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-black">PN</div>
                Priya N.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Content Area (Tabs) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border-b border-brand-border">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-bold border-b-2 transition-colors",
                  activeTab === tab.id 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-textSecondary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === 'overview' && <CaseOverviewTab activeItem={activeItem} />}
            {activeTab === 'timeline' && <CaseTimelineTab activeItem={activeItem} currentStep={currentStep} isHalted={isHalted} />}
            {activeTab === 'outreach' && <CaseOutreachTab activeItem={activeItem} currentStep={currentStep} />}
            {activeTab === 'payments' && <CasePaymentsTab activeItem={activeItem} />}
            {activeTab === 'audit' && <CaseAuditTab auditLogs={auditLogs} />}
          </div>
        </div>

        {/* Right Sidebar (AI Recommendation) */}
        <div className="xl:col-span-4 flex flex-col sticky top-24">
          <AIRecoverySidebar 
            activeItem={activeItem} 
            currentStep={currentStep}
            onDiagnose={onDiagnose}
            onExecute={onExecute}
            strategy={strategy}
            isLoading={isLoading}
            isHalted={isHalted}
          />
        </div>

      </div>
    </div>
  );
}
