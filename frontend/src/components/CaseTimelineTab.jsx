import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Activity, Zap, AlertOctagon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, title: 'DETECTED', actor: 'System' },
  { id: 2, title: 'DIAGNOSED', actor: 'AI Agent' },
  { id: 3, title: 'AI RECOMMENDATION', actor: 'AI Agent' },
  { id: 4, title: 'POLICY CHECK', actor: 'System' },
  { id: 5, title: 'RECOVERY', actor: 'System' },
  { id: 6, title: 'OUTCOME', actor: 'System' }
];

export default function CaseTimelineTab({ activeItem, currentStep, isHalted }) {
  if (!activeItem) return null;

  return (
    <div className="fintech-card p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-brand-textPrimary mb-6">Workflow Timeline</h3>
      
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
                  isPast ? "bg-brand-primary border-brand-primary" :
                  isActive ? "bg-brand-primary border-brand-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]" :
                  "bg-white border-brand-border"
                )} />

                <div className="pl-4">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={cn(
                      "text-[13px] font-bold tracking-widest uppercase",
                      isActive ? "text-brand-primary" : isPast ? "text-brand-textPrimary" : "text-brand-textSecondary"
                    )}>
                      {step.title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-brand-textSecondary bg-brand-appBg px-2 py-0.5 rounded border border-brand-border">
                      {step.actor}
                    </span>
                  </div>

                  {/* Step specific content */}
                  <div className="text-[13px] font-medium mt-2">
                    {step.id === 1 && (
                      <div className="text-brand-textSecondary bg-brand-appBg p-3 rounded-lg border border-brand-border">
                        Payment failed for <span className="text-brand-textPrimary font-bold">₹{activeItem.riskAmount.toLocaleString('en-IN')}</span> due to {activeItem.declineReasonCode}
                      </div>
                    )}

                    {step.id === 2 && (
                      <div className="text-brand-textSecondary bg-brand-appBg p-3 rounded-lg border border-brand-border">
                        {isActive ? "Root cause analyzed. Ready for AI Strategy." : "Root cause identified as temporary gateway timeout."}
                      </div>
                    )}

                    {step.id === 3 && (
                      <div className="text-brand-textSecondary bg-brand-appBg p-3 rounded-lg border border-brand-border flex items-center gap-2">
                         <Activity className="w-4 h-4 text-brand-primary" />
                         <span>AI Strategy generated with 87% confidence.</span>
                      </div>
                    )}

                    {step.id === 4 && (
                      <div className="text-brand-textSecondary bg-brand-appBg p-3 rounded-lg border border-brand-border flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-status-successText" /> 
                        <span>Safety check passed. Touches within limit.</span>
                      </div>
                    )}

                    {step.id === 5 && (
                      <div className="text-brand-textSecondary bg-brand-appBg p-3 rounded-lg border border-brand-border">
                        Recovery action scheduled and executing...
                      </div>
                    )}

                    {step.id === 6 && (
                      <div className={cn("p-3 rounded-lg border font-bold", 
                        isFinalSuccess ? "bg-status-successBg text-status-successText border-status-successBorder" : "bg-status-dangerBg text-status-dangerText border-status-dangerBorder"
                      )}>
                        {isFinalSuccess ? `Successfully recovered ₹${activeItem.riskAmount.toLocaleString('en-IN')}` : 'Action failed. Escalated to manual review.'}
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
  );
}
