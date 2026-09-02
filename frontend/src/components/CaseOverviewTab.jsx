import React from 'react';
import { User, Activity, AlertOctagon, ShieldCheck } from 'lucide-react';

export default function CaseOverviewTab({ activeItem }) {
  if (!activeItem) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      
      {/* 1. Customer profile card */}
      <div className="fintech-card p-5">
        <h3 className="text-sm font-bold tracking-widest uppercase text-brand-textSecondary mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-primary" /> Customer Profile
        </h3>
        <div className="space-y-3 text-[13px] font-medium">
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Name</span>
            <span className="font-bold text-brand-textPrimary">{activeItem.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Email</span>
            <span className="text-brand-textPrimary">contact@example.com</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Account Age</span>
            <span className="text-brand-textPrimary">14 months</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Preferred Channel</span>
            <span className="text-brand-textPrimary">Email</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-brand-textSecondary">Recent Support</span>
            <span className="text-brand-textSecondary italic">No active tickets</span>
          </div>
        </div>
      </div>

      {/* 2. Recovery summary card */}
      <div className="fintech-card p-5">
        <h3 className="text-sm font-bold tracking-widest uppercase text-brand-textSecondary mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-primary" /> Recovery Summary
        </h3>
        <div className="space-y-3 text-[13px] font-medium">
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Amount at Risk</span>
            <span className="font-bold text-brand-textPrimary tabular-nums">₹{activeItem.riskAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Root Cause</span>
            <span className="text-brand-textPrimary">{activeItem.declineReasonCode || 'Unknown'}</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Recovery Likelihood</span>
            <span className="text-brand-primary font-bold tabular-nums">74%</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Churn Risk</span>
            <span className="text-status-dangerText font-bold">High (82%)</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-brand-textSecondary">Current Strategy</span>
            <span className="text-brand-primary font-bold capitalize">{activeItem.channel.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {/* 3. Invoice/Payment card */}
      <div className="fintech-card p-5">
        <h3 className="text-sm font-bold tracking-widest uppercase text-brand-textSecondary mb-4 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-brand-primary" /> Payment Details
        </h3>
        <div className="space-y-3 text-[13px] font-medium">
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Last Attempt</span>
            <span className="text-brand-textPrimary">Sep 01, 2026 09:14</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Failure Category</span>
            <span className="text-status-warningText font-bold">Hard Decline</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Retry Eligibility</span>
            <span className="text-brand-textPrimary">Not recommended yet</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-brand-textSecondary">Prior Successes</span>
            <span className="text-status-successText font-bold">11 successful payments</span>
          </div>
        </div>
      </div>

      {/* 4. Consent and policy card */}
      <div className="fintech-card p-5">
        <h3 className="text-sm font-bold tracking-widest uppercase text-brand-textSecondary mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-primary" /> Policy & Consent
        </h3>
        <div className="space-y-3 text-[13px] font-medium">
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Email Consent</span>
            <span className="text-brand-primary flex items-center gap-1 font-bold">Granted</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">SMS Consent</span>
            <span className="text-status-dangerText flex items-center gap-1 font-bold">Not granted</span>
          </div>
          <div className="flex justify-between border-b border-brand-border pb-2">
            <span className="text-brand-textSecondary">Touches Used</span>
            <span className="text-brand-textPrimary tabular-nums">1 / 3 Max</span>
          </div>
          <div className="mt-4 p-3 bg-brand-appBg rounded border border-brand-border text-[13px] text-brand-textSecondary leading-relaxed">
            <span className="text-brand-textPrimary font-bold">Policy Enforcement: </span> 
            SMS recovery is unavailable because a verified consent record was not found.
          </div>
        </div>
      </div>

    </div>
  );
}
