import React from 'react';
import { Sparkles, Activity, CheckCircle2, ShieldAlert, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function AIRecoverySidebar({ activeItem, currentStep, onDiagnose, onExecute, strategy, isLoading, isHalted }) {
  
  if (currentStep < 2) {
    return (
      <div className="fintech-card p-6 h-[400px] flex flex-col justify-between border-brand-primary/20 bg-brand-softBlue">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-4">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-brand-textPrimary">AI Recovery Recommendation</h3>
          </div>
          <p className="text-[13px] font-medium text-brand-textSecondary leading-relaxed">
            Awaiting AI diagnosis. Trigger the agent to analyze the root cause and determine the optimal recovery strategy.
          </p>
        </div>
        
        <button 
          onClick={onDiagnose}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-lg text-[13px] font-bold hover:bg-brand-primaryHover transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
          Analyze with AI
        </button>
      </div>
    );
  }

  return (
    <div className="fintech-card flex flex-col h-[calc(100vh-200px)] border-brand-primary/20 bg-brand-softBlue overflow-hidden animate-fade-in shadow-sm">
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-brand-primary">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-brand-textPrimary tracking-tight">AI Recommendation</h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[11px] font-bold uppercase tracking-wider">
            High Confidence • 87%
          </div>
        </div>

        {/* Detected Issue */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold text-brand-textSecondary tracking-widest">Detected Issue</div>
          <p className="text-[13px] text-brand-textPrimary font-bold">Subscription renewal failed due to an expired card.</p>
        </div>

        {/* Evidence */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-bold text-brand-textSecondary tracking-widest">Evidence</div>
          <ul className="space-y-2 text-[13px] font-medium text-brand-textSecondary">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-status-successText flex-shrink-0" /> Subscription active for 14 months (11 successful payments)</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-status-successText flex-shrink-0" /> Expiry signal confirmed by issuer response</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-status-successText flex-shrink-0" /> Email consent is active</li>
            <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-status-dangerText flex-shrink-0" /> SMS consent is unavailable</li>
          </ul>
        </div>

        <hr className="border-brand-primary/20" />

        {/* Recommendation */}
        <div className="space-y-1 bg-brand-primary/5 -mx-6 px-6 py-4 border-y border-brand-primary/10">
          <div className="text-[10px] uppercase font-bold text-brand-primary tracking-widest mb-1">Recommended Action</div>
          <p className="text-sm text-brand-textPrimary font-extrabold">{strategy ? strategy.replace(/_/g, ' ') : 'Send a secure payment-method update email now.'}</p>
        </div>

        {/* Why this is preferred */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold text-brand-textSecondary tracking-widest">Why this is preferred</div>
          <p className="text-[13px] font-medium text-brand-textSecondary leading-relaxed">
            Card retries are unlikely to succeed until payment details are updated. Email is eligible; SMS is not.
          </p>
        </div>

        {/* Expected Outcome */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-bold text-brand-textSecondary tracking-widest">Expected Outcome</div>
          <div className="grid grid-cols-2 gap-2 text-[13px] font-medium">
            <div className="bg-white p-3 rounded border border-brand-border">
              <span className="text-brand-textSecondary block mb-1">Recovery Prob.</span>
              <span className="text-brand-textPrimary font-bold">74%</span>
            </div>
            <div className="bg-white p-3 rounded border border-brand-border">
              <span className="text-brand-textSecondary block mb-1">Expected Value</span>
              <span className="text-brand-textPrimary font-bold">₹{(activeItem.riskAmount * 0.74).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

        {/* Guardrails */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-bold text-brand-textSecondary tracking-widest">Guardrails</div>
          <ul className="space-y-2 text-[13px] font-medium text-brand-textSecondary">
            <li className="flex justify-between items-center border-b border-brand-border pb-2"><span>Email</span> <span className="text-status-successText font-bold">Eligible</span></li>
            <li className="flex justify-between items-center border-b border-brand-border pb-2"><span>SMS</span> <span className="text-status-dangerText font-bold">Blocked</span></li>
            <li className="flex justify-between items-center pb-1"><span>Max touches</span> <span className="text-brand-textPrimary font-bold">1 / 3 remaining</span></li>
          </ul>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-5 border-t border-brand-primary/20 bg-white mt-auto">
        {(currentStep >= 2 && currentStep <= 5) && (
          <button 
            onClick={onExecute}
            disabled={isLoading || isHalted || activeItem.status === 'RECOVERED'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-lg text-[13px] font-bold hover:bg-brand-primaryHover transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
            {currentStep === 2 ? 'Generate Recommendation' : currentStep === 3 ? 'Run Policy Check' : currentStep === 4 ? 'Execute Recovery' : 'Confirm Outcome'}
          </button>
        )}

        {(currentStep === 6 || isHalted || activeItem.status === 'RECOVERED') && (
          <div className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[13px] font-bold border",
            activeItem.status === 'RECOVERED' 
              ? "bg-status-successBg text-status-successText border-status-successBorder" 
              : "bg-status-dangerBg text-status-dangerText border-status-dangerBorder"
          )}>
            {activeItem.status === 'RECOVERED' ? 'Workflow Completed' : 'Workflow Halted'}
          </div>
        )}
      </div>
    </div>
  );
}
