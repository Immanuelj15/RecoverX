import React, { useState } from 'react';
import { Play, Users, Settings2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function BatchSimulatorView({ simulateBatch }) {
  const [cohort, setCohort] = useState('ALL');
  const [count, setCount] = useState(120);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleLaunch = async () => {
    setIsSimulating(true);
    setShowResults(false);
    
    await simulateBatch(cohort, count);
    
    // Artificial delay to simulate processing
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-[900px] mx-auto flex flex-col gap-8 h-full animate-fade-in">
      <div className="border-b border-brand-border pb-6">
        <h1 className="text-2xl font-extrabold text-brand-textPrimary tracking-tight">Batch Recovery Simulator</h1>
        <p className="text-sm font-medium text-brand-textSecondary mt-1">Generate and run massive simulation batches to test policy guardrails and recovery yields.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Configuration Panel */}
        <div className="flex flex-col gap-6">
          <div className="fintech-card p-6 bg-white">
            <h3 className="font-extrabold text-brand-textPrimary tracking-tight mb-4 flex items-center gap-2 border-b border-brand-border pb-3">
              <Users className="w-5 h-5 text-brand-primary" />
              1. Select Cohort
            </h3>
            <select 
              value={cohort} 
              onChange={(e) => setCohort(e.target.value)}
              className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md px-3 py-2 text-brand-textPrimary text-sm font-bold shadow-sm transition-all"
            >
              <option value="ALL">Mixed Batch (All Scenarios)</option>
              <option value="FAILED_SUBSCRIPTION">Failed Subscriptions</option>
              <option value="CHECKOUT_DROPOFF">Checkout Abandonment</option>
              <option value="B2B_RECEIVABLES">B2B Overdue Invoices</option>
              <option value="PAYMENT_DEGRADATION">Payment Degradation</option>
            </select>
          </div>

          <div className="fintech-card p-6 bg-white">
            <h3 className="font-extrabold text-brand-textPrimary tracking-tight mb-4 flex items-center gap-2 border-b border-brand-border pb-3">
              <Settings2 className="w-5 h-5 text-brand-primary" />
              2. Simulation Size
            </h3>
            <div className="flex items-center gap-4 pt-2">
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="10"
                value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1 accent-brand-primary cursor-pointer"
              />
              <span className="text-brand-textPrimary font-mono font-bold bg-brand-appBg px-3 py-1.5 rounded border border-brand-border text-sm">
                {count} cases
              </span>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            disabled={isSimulating}
            className="w-full py-4 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
          >
            {isSimulating ? (
              <span className="animate-pulse flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Processing Batch...
              </span>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Launch Simulation Batch
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="fintech-card p-6 bg-brand-appBg border border-brand-primary/10 flex flex-col justify-center min-h-[400px] shadow-inner">
          {!isSimulating && !showResults && (
            <div className="text-center text-brand-textSecondary">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-30 text-brand-primary" />
              <p className="font-medium text-[13px]">Configure and launch a batch to see simulated results.</p>
            </div>
          )}

          {isSimulating && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-brand-textPrimary font-bold mb-2">Executing Policy Engine...</h3>
              <p className="text-xs font-medium text-brand-textSecondary animate-pulse">Running rules against {count} cases</p>
            </div>
          )}

          {showResults && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <CheckCircle2 className="w-12 h-12 text-status-successText mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-brand-textPrimary">Batch Complete</h3>
                <p className="text-brand-textSecondary font-medium text-[13px] mt-1">Successfully processed {count} cases.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-brand-border shadow-sm">
                  <span className="text-brand-textSecondary text-[13px] font-bold uppercase tracking-wider">Total Identified Risk</span>
                  <span className="text-brand-textPrimary font-mono font-bold text-lg">₹{(count * 3500).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-status-successBg rounded-lg border border-status-successBorder shadow-sm">
                  <span className="text-status-successText text-[13px] font-bold uppercase tracking-wider">Eligible for Recovery</span>
                  <span className="text-status-successText font-mono font-bold text-lg">{(count * 0.78).toFixed(0)} cases</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-status-warningBg rounded-lg border border-status-warningBorder shadow-sm">
                  <span className="text-status-warningText text-[13px] font-bold uppercase tracking-wider">Suppressed by Policy</span>
                  <span className="text-status-warningText font-mono font-bold text-lg">{(count * 0.22).toFixed(0)} cases</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
