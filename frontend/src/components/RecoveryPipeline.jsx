import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, ShieldCheck, Activity, CheckCircle2, AlertOctagon, Loader2, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, title: 'DETECTED', desc: 'Payment failure ingested' },
  { id: 2, title: 'ANALYZING', desc: 'XGBoost ML probability' },
  { id: 3, title: 'PREDICTED', desc: 'SHAP factor explainer' },
  { id: 4, title: 'POLICY CHECK', desc: 'Deterministic guardrails' },
  { id: 5, title: 'ACTION', desc: 'Channel execution' },
  { id: 6, title: 'RECOVERED', desc: 'Verified revenue outcome' }
];

export default function RecoveryPipeline({ activeItem, currentStep, onDiagnose, onExecute, onOpenDrawer, isLoading, isHalted, strategy }) {
  if (!activeItem) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center text-slate-900">
        <Activity className="w-10 h-10 text-blue-600 mb-4 animate-pulse" />
        <h3 className="text-slate-900 font-extrabold mb-1">Awaiting Recovery Case Selection</h3>
        <p className="text-xs font-medium text-slate-500 max-w-[220px]">
          Select any case from the Recovery Queue to view real-time pipeline execution.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col relative overflow-hidden sticky top-8 shadow-sm text-slate-900" style={{ height: 'max-content', minHeight: '400px' }}>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="font-extrabold text-slate-900 text-sm tracking-tight">Active Recovery Pipeline</h2>
          <span className="text-[11px] font-mono font-bold text-blue-600 mt-0.5 block">
            ID: {activeItem.id ? activeItem.id.split('-')[0] : activeItem.payment_id}
          </span>
        </div>
        <button 
          onClick={onOpenDrawer}
          className="text-[11px] font-extrabold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-4 h-4" />
          AI Drawer
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="relative pl-4 border-l-2 border-slate-200 ml-2 space-y-8">
          
          <AnimatePresence>
            {steps.map((step) => {
              if (currentStep < step.id) return null;

              const isPast = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isFinalSuccess = step.id === 6 && activeItem.status === 'RECOVERED';

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
                    isPast ? "bg-emerald-500 border-emerald-500" :
                    isActive ? "bg-blue-600 border-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" :
                    "bg-white border-slate-300"
                  )} />

                  <div className="pl-4">
                    <h4 className={cn(
                      "text-[10px] font-black tracking-widest uppercase mb-1",
                      isActive ? "text-blue-600" : isPast ? "text-slate-900" : "text-slate-400"
                    )}>
                      {step.title}
                    </h4>

                    <div className="text-[12px] font-medium">
                      {step.id === 1 && (
                        <div className="text-slate-600">
                          Payment failure ingested <br/>
                          <span className="text-slate-900 font-mono font-bold">
                            ₹{(activeItem.riskAmount || activeItem.amount_inr || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {step.id === 2 && (
                        <div className="text-slate-600">
                          {isActive ? "Analyzing root cause & features..." : "XGBoost ML probability calculated"}
                        </div>
                      )}

                      {step.id === 3 && (
                        <div className="text-slate-600 mt-1">
                           {strategy ? (
                             <div className="p-3 mt-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2 shadow-sm">
                               <div className="flex items-center gap-3">
                                 <span className="text-2xl font-black text-emerald-600 font-mono">87%</span>
                                 <span className="text-slate-900 text-[11px] font-bold leading-tight">High Recovery<br/>Potential</span>
                               </div>
                               <div className="mt-1">
                                 <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Recommended Action</div>
                                 <div className="text-blue-600 font-extrabold text-[13px]">{strategy.replace(/_/g, ' ')}</div>
                               </div>
                               <div className="text-[11px] font-medium mt-2 text-slate-600 border-t border-slate-200 pt-2">
                                 <ul className="space-y-1.5">
                                   <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Historical success rate: High</li>
                                   <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Network timeout (Temporary failure)</li>
                                 </ul>
                               </div>
                             </div>
                           ) : "Generating strategy..."}
                        </div>
                      )}

                      {step.id === 4 && (
                        <div className="text-emerald-600 flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Policy Guardrails Approved
                        </div>
                      )}

                      {step.id === 5 && (
                        <div className="text-slate-600">
                          Action execution scheduled
                        </div>
                      )}

                      {step.id === 6 && (
                        <div className={cn("font-extrabold font-mono mt-1", isFinalSuccess ? "text-emerald-600" : "text-rose-600")}>
                          {isFinalSuccess ? `₹${(activeItem.riskAmount || activeItem.amount_inr || 0).toLocaleString('en-IN')} recovered` : 'Escalated to human review'}
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

      {/* Action Footer */}
      <div className="p-5 border-t border-slate-200 bg-slate-50">
        {currentStep === 1 && (
          <button 
            onClick={onDiagnose}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-extrabold transition-all disabled:opacity-50 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            Analyze with AI Engine
          </button>
        )}
        
        {(currentStep >= 2 && currentStep <= 5) && (
          <button 
            onClick={onExecute}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-extrabold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {currentStep === 2 ? 'Generate AI Recommendation' : currentStep === 3 ? 'Run Policy Check' : currentStep === 4 ? 'Execute Recovery' : 'Confirm Outcome'}
          </button>
        )}

        {currentStep === 6 && (
          <div className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-extrabold border",
            activeItem.status === 'RECOVERED' 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-rose-50 text-rose-700 border-rose-200"
          )}>
            {activeItem.status === 'RECOVERED' ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            Workflow Execution Complete
          </div>
        )}
      </div>

    </div>
  );
}
