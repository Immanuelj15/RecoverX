import React from 'react';
import { User, Activity, AlertOctagon, ShieldCheck } from 'lucide-react';

export default function CaseOverviewTab({ activeItem }) {
  if (!activeItem) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      
      {/* 1. Customer profile card */}
      <div className="fintech-card fintech-card-hover p-6 bg-white border-slate-200">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-600">
            Customer Profile
          </h3>
        </div>
        <div className="space-y-3.5 text-sm font-medium">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Customer Name</span>
            <span className="font-extrabold text-slate-900 text-base">{activeItem.customerName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Work Email</span>
            <span className="text-slate-900 font-bold">{activeItem.customerEmail || `${activeItem.customerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@company.com`}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Account Tenure</span>
            <span className="text-slate-900 font-bold">14 months</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Preferred Channel</span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">Email Communication</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500 font-semibold">Recent Support Tickets</span>
            <span className="text-slate-500 font-semibold text-xs bg-slate-100 px-2 py-1 rounded">No active tickets</span>
          </div>
        </div>
      </div>

      {/* 2. Recovery summary card */}
      <div className="fintech-card fintech-card-hover p-6 bg-white border-slate-200">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-600">
            Recovery Summary
          </h3>
        </div>
        <div className="space-y-3.5 text-sm font-medium">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Amount at Risk</span>
            <span className="font-extrabold text-slate-900 text-base tabular-nums">₹{activeItem.riskAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Root Cause Code</span>
            <span className="text-slate-900 font-bold px-2 py-0.5 rounded bg-slate-100 text-xs font-mono">{activeItem.declineReasonCode || 'insufficient_balance'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Recovery Likelihood</span>
            <span className="text-blue-600 font-extrabold text-base tabular-nums">74%</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Churn Risk Score</span>
            <span className="text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-xs">High (82%)</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500 font-semibold">Current Strategy</span>
            <span className="text-blue-700 font-extrabold uppercase text-xs tracking-wider">{activeItem.channel.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {/* 3. Invoice/Payment card */}
      <div className="fintech-card fintech-card-hover p-6 bg-white border-slate-200">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-600">
            Payment Details
          </h3>
        </div>
        <div className="space-y-3.5 text-sm font-medium">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Last Attempt</span>
            <span className="text-slate-900 font-bold">Sep 01, 2026 09:14</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Failure Category</span>
            <span className="text-amber-700 font-extrabold px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-xs uppercase">Hard Decline</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Retry Eligibility</span>
            <span className="text-slate-700 font-bold">Not recommended yet</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500 font-semibold">Prior Successes</span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-xs px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">11 successful payments</span>
          </div>
        </div>
      </div>

      {/* 4. Consent and policy card */}
      <div className="fintech-card fintech-card-hover p-6 bg-white border-slate-200">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-600">
            Policy & Consent
          </h3>
        </div>
        <div className="space-y-3.5 text-sm font-medium">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Email Consent</span>
            <span className="text-emerald-700 font-bold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-xs uppercase">Granted</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">SMS Consent</span>
            <span className="text-rose-700 font-bold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-xs uppercase">Not Granted</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-slate-500 font-semibold">Touches Used</span>
            <span className="text-slate-900 font-bold tabular-nums">1 / 3 Max</span>
          </div>
          <div className="mt-4 p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-700 leading-relaxed font-medium">
            <span className="text-blue-700 font-extrabold">Policy Enforcement: </span> 
            SMS recovery is blocked because a verified consent record was not found.
          </div>
        </div>
      </div>

    </div>
  );
}
