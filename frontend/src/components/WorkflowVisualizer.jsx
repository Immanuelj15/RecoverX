import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Flag, AlertOctagon, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, title: 'Detect & Diagnose', desc: 'AI RCA Engine', icon: Activity },
  { id: 2, title: 'Policy & Safety Check', desc: 'Rate Limits, Caps', icon: ShieldCheck },
  { id: 3, title: 'Dynamic Action', desc: 'Smart Retry / Nudge', icon: Zap },
  { id: 4, title: 'Outcome & Resolution', desc: 'Recovered / Halt', icon: Flag }
];

export default function WorkflowVisualizer({ activeItem, currentStep, onDiagnose, onExecute, isLoading, isHalted, strategy }) {
  if (!activeItem) {
    return (
      <div className="fintech-card h-full flex flex-col items-center justify-center p-8 text-center bg-navy-900 border-dashed border-2 border-brand-border">
        <Activity className="w-12 h-12 text-brand-border mb-4" />
        <h3 className="text-lg font-semibold text-brand-textSecondary mb-2">Awaiting Agent Intervention</h3>
        <p className="text-sm text-brand-textSecondary max-w-[200px]">Select a leakage event from the batch feed to monitor the AI recovery workflow.</p>
      </div>
    );
  }

  return (
    <div className="fintech-card h-full flex flex-col relative overflow-hidden bg-navy-800">
      {isHalted && (
        <div className="absolute inset-0 bg-fintech-dangerBg/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm p-6 text-center animate-in fade-in">
          <AlertOctagon className="w-16 h-16 text-fintech-danger mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-fintech-danger mb-2 tracking-wide uppercase">Halted / Escalated</h2>
          <p className="text-white">Stopping rule triggered (e.g. Max retries exceeded). Workflow has been escalated to human compliance teams.</p>
        </div>
      )}

      <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-navy-900">
        <div>
          <h2 className="font-semibold text-brand-textPrimary flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fintech-success animate-pulse"></div>
            Bounded Agent Workflow
          </h2>
          <span className="text-xs text-brand-textSecondary mt-0.5 block">
            Event ID: <span className="font-mono text-brand-cyan">{activeItem.id.split('-')[0]}</span>
          </span>
        </div>
        
        {/* Status Indicator */}
        <div className={cn(
          "px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5",
          currentStep === 4 && activeItem.status === 'RECOVERED' ? "bg-fintech-successBg text-fintech-success border border-fintech-successBorder" :
          isHalted || (currentStep === 4 && activeItem.status === 'ESCALATED') ? "bg-fintech-dangerBg text-fintech-danger border border-fintech-dangerBorder" :
          "bg-brand-aiLight text-brand-ai border border-brand-ai/30 ai-pulse"
        )}>
          {currentStep === 4 && activeItem.status === 'RECOVERED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
          {(isHalted || activeItem.status === 'ESCALATED') ? <AlertOctagon className="w-3.5 h-3.5" /> : null}
          {currentStep === 4 && activeItem.status === 'RECOVERED' ? "RESOLVED" : (isHalted || activeItem.status === 'ESCALATED') ? "ESCALATED" : "AGENT ACTIVE"}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-brand-border z-0"></div>
          
          <AnimatePresence>
            {steps.map((step, idx) => {
              const isPast = currentStep > step.id;
              const isActive = currentStep === step.id;
              const Icon = step.icon;

              if (currentStep < step.id) return null;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative z-10 flex gap-4 mb-8 last:mb-0"
                >
                  <div className={cn(
                    "flex-shrink-0 w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300",
                    isPast ? "bg-navy-700 border-fintech-success text-fintech-success" :
                    isActive ? "bg-brand-blue border-brand-cyan text-white shadow-glow" :
                    "bg-navy-900 border-brand-border text-brand-textSecondary"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 pt-1.5">
                    <h4 className={cn(
                      "text-sm font-bold tracking-wide uppercase",
                      isPast || isActive ? "text-brand-textPrimary" : "text-brand-textSecondary"
                    )}>
                      {step.title}
                    </h4>
                    <p className={cn(
                      "text-sm mt-1",
                      isPast || isActive ? "text-brand-cyan font-mono" : "text-brand-textSecondary"
                    )}>
                      {step.desc}
                    </p>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-3 rounded-lg bg-navy-900 border border-brand-border/50 text-xs text-brand-textSecondary"
                        >
                          {step.id === 1 && "Waiting for AI Diagnosis Trigger..."}
                          {step.id === 2 && `Strategy Assigned: [${strategy}]. Running safety checks...`}
                          {step.id === 3 && `Executing: ${strategy}. Nudging user...`}
                          {step.id === 4 && `Final outcome registered: ${activeItem.status}.`}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 border-t border-brand-border bg-navy-900 flex gap-3">
        {currentStep === 1 && (
          <button 
            onClick={onDiagnose}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-blueHover transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            Run AI Diagnosis
          </button>
        )}
        
        {(currentStep === 2 || currentStep === 3) && (
          <button 
            onClick={onExecute}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-ai text-white rounded-lg text-sm font-semibold hover:bg-brand-ai/80 transition-colors shadow-glow disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Execute Recovery Action
          </button>
        )}

        {currentStep === 4 && (
          <button 
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-navy-700 text-brand-textSecondary rounded-lg text-sm font-semibold border border-brand-border"
          >
            <CheckCircle2 className="w-4 h-4" />
            Workflow Completed
          </button>
        )}
      </div>
    </div>
  );
}
