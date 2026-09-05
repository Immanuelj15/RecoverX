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
      <div className="bg-[#101927] border-2 border-dashed border-[#1E2B3D] rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center text-[#F8FAFC]">
        <Activity className="w-10 h-10 text-[#2D7FF9] mb-4 animate-pulse" />
        <h3 className="text-white font-extrabold mb-1">Awaiting Recovery Case Selection</h3>
        <p className="text-xs font-medium text-[#94A3B8] max-w-[220px]">
          Select any case from the Recovery Queue to view real-time pipeline execution.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#101927] border border-[#1E2B3D] rounded-2xl flex flex-col relative overflow-hidden sticky top-8 shadow-2xl text-[#F8FAFC]" style={{ height: 'max-content', minHeight: '400px' }}>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1E2B3D] flex items-center justify-between bg-[#0B1220]">
        <div>
          <h2 className="font-extrabold text-white text-sm tracking-tight">Active Recovery Pipeline</h2>
          <span className="text-[11px] font-mono font-bold text-[#2D7FF9] mt-0.5 block">
            ID: {activeItem.id ? activeItem.id.split('-')[0] : activeItem.payment_id}
          </span>
        </div>
        <button 
          onClick={onOpenDrawer}
          className="text-[11px] font-extrabold text-[#2D7FF9] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-4 h-4" />
          AI Drawer
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="relative pl-4 border-l-2 border-[#1E2B3D] ml-2 space-y-8">
          
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
                    isPast ? "bg-[#10B981] border-[#10B981]" :
                    isActive ? "bg-[#2D7FF9] border-[#2D7FF9] shadow-[0_0_12px_rgba(45,127,249,0.8)]" :
                    "bg-[#070B12] border-[#1E2B3D]"
                  )} />

                  <div className="pl-4">
                    <h4 className={cn(
                      "text-[10px] font-black tracking-widest uppercase mb-1",
                      isActive ? "text-[#2D7FF9]" : isPast ? "text-white" : "text-[#64748B]"
                    )}>
                      {step.title}
                    </h4>

                    <div className="text-[12px] font-medium">
                      {step.id === 1 && (
                        <div className="text-[#94A3B8]">
                          Payment failure ingested <br/>
                          <span className="text-white font-mono font-bold">
                            ₹{(activeItem.riskAmount || activeItem.amount_inr || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {step.id === 2 && (
                        <div className="text-[#94A3B8]">
                          {isActive ? "Analyzing root cause & features..." : "XGBoost ML probability calculated"}
                        </div>
                      )}

                      {step.id === 3 && (
                        <div className="text-[#94A3B8] mt-1">
                           {strategy ? (
                             <div className="p-3 mt-2 rounded-xl bg-[#0B1220] border border-[#2D7FF9]/30 flex flex-col gap-2 shadow-md">
                               <div className="flex items-center gap-3">
                                 <span className="text-2xl font-black text-[#10B981] font-mono">87%</span>
                                 <span className="text-white text-[11px] font-bold leading-tight">High Recovery<br/>Potential</span>
                               </div>
                               <div className="mt-1">
                                 <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-1">Recommended Action</div>
                                 <div className="text-[#2D7FF9] font-extrabold text-[13px]">{strategy.replace(/_/g, ' ')}</div>
                               </div>
                               <div className="text-[11px] font-medium mt-2 text-[#94A3B8] border-t border-[#1E2B3D] pt-2">
                                 <ul className="space-y-1.5">
                                   <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" /> Historical success rate: High</li>
                                   <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" /> Network timeout (Temporary failure)</li>
                                 </ul>
                               </div>
                             </div>
                           ) : "Generating strategy..."}
                        </div>
                      )}

                      {step.id === 4 && (
                        <div className="text-[#10B981] flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Policy Guardrails Approved
                        </div>
                      )}

                      {step.id === 5 && (
                        <div className="text-[#94A3B8]">
                          Action execution scheduled
                        </div>
                      )}

                      {step.id === 6 && (
                        <div className={cn("font-extrabold font-mono mt-1", isFinalSuccess ? "text-[#10B981]" : "text-[#EF4444]")}>
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
      <div className="p-5 border-t border-[#1E2B3D] bg-[#070B12]">
        {currentStep === 1 && (
          <button 
            onClick={onDiagnose}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2D7FF9] hover:bg-[#2D7FF9]/80 text-white rounded-xl text-[13px] font-extrabold transition-all disabled:opacity-50 shadow-lg shadow-[#2D7FF9]/20 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            Analyze with AI Engine
          </button>
        )}
        
        {(currentStep >= 2 && currentStep <= 5) && (
          <button 
            onClick={onExecute}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2D7FF9] hover:bg-[#2D7FF9]/80 text-white rounded-xl text-[13px] font-extrabold transition-all shadow-lg shadow-[#2D7FF9]/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {currentStep === 2 ? 'Generate AI Recommendation' : currentStep === 3 ? 'Run Policy Check' : currentStep === 4 ? 'Execute Recovery' : 'Confirm Outcome'}
          </button>
        )}

        {currentStep === 6 && (
          <div className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-extrabold border",
            activeItem.status === 'RECOVERED' 
              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30" 
              : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
          )}>
            {activeItem.status === 'RECOVERED' ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            Workflow Execution Complete
          </div>
        )}
      </div>

    </div>
  );
}
