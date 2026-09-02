import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, ShieldCheck, Activity, CheckCircle2, AlertOctagon, Loader2, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, title: 'DETECTED', desc: 'Payment failed' },
  { id: 2, title: 'DIAGNOSED', desc: 'Analyzing root cause' },
  { id: 3, title: 'AI RECOMMENDATION', desc: 'Determining optimal strategy' },
  { id: 4, title: 'POLICY CHECK', desc: 'Validating safety rules' },
  { id: 5, title: 'RECOVERY', desc: 'Executing action' },
  { id: 6, title: 'OUTCOME', desc: 'Final status' }
];

export default function RecoveryPipeline({ activeItem, currentStep, onDiagnose, onExecute, onOpenDrawer, isLoading, isHalted, strategy }) {
  if (!activeItem) {
    return (
      <div className="fintech-card h-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-brand-border bg-white">
        <Activity className="w-10 h-10 text-brand-border mb-4" />
        <h3 className="text-brand-textPrimary font-bold mb-1">Awaiting Selection</h3>
        <p className="text-sm font-medium text-brand-textSecondary max-w-[200px]">Select a case from Revenue at Risk to begin recovery workflow.</p>
      </div>
    );
  }

  return (
    <div className="fintech-card flex flex-col relative overflow-hidden sticky top-8 bg-white" style={{ height: 'max-content', minHeight: '400px' }}>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-brand-appBg">
        <div>
          <h2 className="font-extrabold text-brand-textPrimary text-base tracking-tight">Active Recovery Workflow</h2>
          <span className="text-[11px] font-medium text-brand-textSecondary mt-1 flex items-center gap-2">
            ID: <span className="font-mono font-bold text-brand-primary">{activeItem.id.split('-')[0]}</span>
          </span>
        </div>
        <button 
          onClick={onOpenDrawer}
          className="text-[11px] font-bold text-brand-primary hover:text-brand-primaryHover flex items-center gap-1 transition-colors"
        >
          <Info className="w-4 h-4" />
          AI Insights
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="relative pl-4 border-l-2 border-brand-border ml-2 space-y-8">
          
          <AnimatePresence>
            {steps.map((step, idx) => {
              if (currentStep < step.id) return null;

              const isPast = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isFinalSuccess = step.id === 6 && activeItem.status === 'RECOVERED';
              const isFinalFailed = step.id === 6 && (isHalted || activeItem.status === 'ESCALATED');

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2",
                    isPast ? "bg-status-successText border-status-successText" :
                    isActive ? "bg-brand-primary border-brand-primary shadow-[0_0_8px_rgba(37,99,235,0.6)]" :
                    "bg-white border-brand-border"
                  )} />

                  <div className="pl-4">
                    <h4 className={cn(
                      "text-[10px] font-extrabold tracking-widest uppercase mb-1",
                      isActive ? "text-brand-primary" : isPast ? "text-brand-textPrimary" : "text-brand-textSecondary"
                    )}>
                      {step.title}
                    </h4>

                    {/* Step specific content */}
                    <div className="text-[13px] font-medium">
                      {step.id === 1 && (
                        <div className="text-brand-textSecondary">
                          Payment failed <br/>
                          <span className="text-brand-textPrimary font-bold tabular-nums">₹{activeItem.riskAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {step.id === 2 && (
                        <div className="text-brand-textSecondary font-medium">
                          {isActive ? "Root cause analyzed. Ready for AI Strategy." : "Root cause identified"}
                        </div>
                      )}

                      {step.id === 3 && (
                        <div className="text-brand-textSecondary mt-1">
                           {strategy ? (
                             <div className="p-3 mt-2 rounded-lg bg-brand-softBlue border border-brand-primary/20 flex flex-col gap-2 shadow-sm">
                               <div className="flex items-center gap-3">
                                 <span className="text-2xl font-extrabold text-brand-primary">87%</span>
                                 <span className="text-brand-textPrimary text-[11px] font-bold leading-tight">High likelihood<br/>of recovery</span>
                               </div>
                               <div className="mt-1">
                                 <div className="text-[10px] uppercase font-bold text-brand-textSecondary tracking-wider mb-1">Recommended Action</div>
                                 <div className="text-brand-primary font-extrabold text-[13px]">{strategy.replace(/_/g, ' ')}</div>
                               </div>
                               <div className="text-[11px] font-medium mt-2 text-brand-textSecondary border-t border-brand-primary/10 pt-2">
                                 <ul className="space-y-1.5">
                                   <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-status-successText flex-shrink-0" /> Customer has 8 successful previous payments</li>
                                   <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-status-successText flex-shrink-0" /> Failure appears temporary (Network timeout)</li>
                                 </ul>
                               </div>
                             </div>
                           ) : "Generating strategy..."}
                        </div>
                      )}

                      {step.id === 4 && (
                        <div className="text-brand-textSecondary flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-4 h-4 text-status-successText" /> Approved
                        </div>
                      )}

                      {step.id === 5 && (
                        <div className="text-brand-textSecondary font-medium">
                          Recovery action scheduled
                        </div>
                      )}

                      {step.id === 6 && (
                        <div className={cn("font-bold mt-1", isFinalSuccess ? "text-status-successText" : "text-status-dangerText")}>
                          {isFinalSuccess ? `₹${activeItem.riskAmount.toLocaleString('en-IN')} recovered` : 'Escalated to manual review'}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
        </div>
      </div>

      {/* Action Area */}
      <div className="p-5 border-t border-brand-border bg-white">
        {currentStep === 1 && (
          <button 
            onClick={onDiagnose}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-lg text-[13px] font-bold hover:bg-brand-primaryHover transition-all disabled:opacity-50 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            Analyze with AI
          </button>
        )}
        
        {(currentStep >= 2 && currentStep <= 5) && (
          <button 
            onClick={onExecute}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-lg text-[13px] font-bold hover:bg-brand-primaryHover transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {currentStep === 2 ? 'Generate AI Recommendation' : currentStep === 3 ? 'Run Policy Check' : currentStep === 4 ? 'Execute Recovery' : 'Confirm Outcome'}
          </button>
        )}

        {currentStep === 6 && (
          <div className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[13px] font-bold border",
            activeItem.status === 'RECOVERED' 
              ? "bg-status-successBg text-status-successText border-status-successBorder" 
              : "bg-status-dangerBg text-status-dangerText border-status-dangerBorder"
          )}>
            {activeItem.status === 'RECOVERED' ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            Workflow Completed
          </div>
        )}
      </div>

    </div>
  );
}
