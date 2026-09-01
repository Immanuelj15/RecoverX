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
      <div className="fintech-card h-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-brand-border">
        <Activity className="w-10 h-10 text-brand-border mb-4" />
        <h3 className="text-brand-textPrimary font-semibold mb-1">Awaiting Selection</h3>
        <p className="text-sm text-brand-textSecondary max-w-[200px]">Select a case from Revenue at Risk to begin recovery workflow.</p>
      </div>
    );
  }

  return (
    <div className="fintech-card h-full flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-lg">Active Recovery Workflow</h2>
          <span className="text-xs text-brand-textSecondary mt-1 flex items-center gap-2">
            ID: <span className="font-mono text-brand-blue">{activeItem.id.split('-')[0]}</span>
          </span>
        </div>
        <button 
          onClick={onOpenDrawer}
          className="text-xs font-semibold text-brand-blue hover:text-brand-cyan flex items-center gap-1 transition-colors"
        >
          <Info className="w-4 h-4" />
          AI Insights
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="relative pl-4 border-l-2 border-brand-border/50 ml-2 space-y-8">
          
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
                    isPast ? "bg-fintech-success border-fintech-success" :
                    isActive ? "bg-brand-blue border-brand-blue shadow-[0_0_8px_rgba(43,108,176,0.8)]" :
                    "bg-navy-800 border-brand-border"
                  )} />

                  <div className="pl-4">
                    <h4 className={cn(
                      "text-xs font-bold tracking-widest uppercase mb-1",
                      isActive ? "text-brand-blue" : isPast ? "text-brand-textPrimary" : "text-brand-textSecondary"
                    )}>
                      {step.title}
                    </h4>

                    {/* Step specific content */}
                    <div className="text-sm">
                      {step.id === 1 && (
                        <div className="text-brand-textSecondary">
                          Payment failed <br/>
                          <span className="text-white font-semibold">₹{activeItem.riskAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {step.id === 2 && (
                        <div className="text-brand-textSecondary">
                          {isActive ? "Waiting for AI Diagnosis..." : "Root cause identified"}
                        </div>
                      )}

                      {step.id === 3 && (
                        <div className="text-brand-textSecondary">
                           {strategy ? (
                             <span>87% recovery probability <br/> <span className="text-brand-ai font-medium">{strategy.replace(/_/g, ' ')}</span></span>
                           ) : "Generating strategy..."}
                        </div>
                      )}

                      {step.id === 4 && (
                        <div className="text-brand-textSecondary flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-fintech-success" /> Approved
                        </div>
                      )}

                      {step.id === 5 && (
                        <div className="text-brand-textSecondary">
                          Recovery action scheduled
                        </div>
                      )}

                      {step.id === 6 && (
                        <div className={cn("font-medium mt-1", isFinalSuccess ? "text-fintech-success" : "text-fintech-danger")}>
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
      <div className="p-5 border-t border-brand-border bg-navy-800/50">
        {currentStep === 1 && (
          <button 
            onClick={onDiagnose}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-ai text-white rounded-lg text-sm font-bold hover:bg-brand-ai/90 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            Analyze with AI
          </button>
        )}
        
        {(currentStep >= 2 && currentStep <= 5) && (
          <button 
            onClick={onExecute}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-blue text-white rounded-lg text-sm font-bold hover:bg-brand-blueHover transition-all shadow-[0_0_15px_rgba(43,108,176,0.3)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {currentStep === 2 ? 'Generate AI Recommendation' : currentStep === 3 ? 'Run Policy Check' : currentStep === 4 ? 'Execute Recovery' : 'Confirm Outcome'}
          </button>
        )}

        {currentStep === 6 && (
          <div className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border",
            activeItem.status === 'RECOVERED' 
              ? "bg-fintech-successBg text-fintech-success border-fintech-successBorder" 
              : "bg-fintech-dangerBg text-fintech-danger border-fintech-dangerBorder"
          )}>
            {activeItem.status === 'RECOVERED' ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            Workflow Completed
          </div>
        )}
      </div>

    </div>
  );
}
