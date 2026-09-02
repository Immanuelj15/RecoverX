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
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center text-[13px] text-brand-textSecondary font-semibold">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Recovery Queue
          </button>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-brand-textMuted" />
          <span className="text-brand-textPrimary">{activeItem.id.split('-')[0]}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-softBlue flex items-center justify-center text-brand-primary font-extrabold text-xl border border-brand-strongBorder">
              {activeItem.customerName.charAt(0)}
            </div>
            <div>
              <h2 className="text-[26px] font-extrabold text-brand-textPrimary tracking-tight">{activeItem.customerName}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-sm">
                <span className="text-brand-textSecondary font-mono font-medium">{activeItem.id.split('-')[0]}</span>
                <span className="px-2 py-0.5 rounded-md bg-brand-appBg border border-brand-border text-brand-textSecondary text-[11px] font-bold uppercase tracking-wider">
                  {activeItem.channel.replace(/_/g, ' ').toLowerCase()}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-status-warningBg border border-status-warningBorder text-status-warningText text-[11px] font-bold uppercase tracking-wider">
                  High Priority
                </span>
                <span className="px-2 py-0.5 rounded-md bg-brand-softBlue border border-brand-strongBorder text-brand-primary text-[11px] font-bold uppercase tracking-wider">
                  Eligible
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-10 text-right">
            <div>
              <div className="text-[13px] text-brand-textSecondary font-semibold mb-1">Amount at Risk</div>
              <div className="text-[26px] leading-tight font-extrabold text-brand-textPrimary tabular-nums">₹{activeItem.riskAmount.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-[13px] text-brand-textSecondary font-semibold mb-1">Recovery Likelihood</div>
              <div className="text-[26px] leading-tight font-extrabold text-brand-primary tabular-nums">74%</div>
            </div>
            <div className="flex flex-col items-end justify-center">
              <span className="text-[13px] text-brand-textSecondary font-semibold mb-1">Owner</span>
              <span className="text-sm font-bold text-brand-textPrimary">Priya N.</span>
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
