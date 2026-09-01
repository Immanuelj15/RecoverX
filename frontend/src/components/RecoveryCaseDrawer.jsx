import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, ShieldCheck, Zap, Info, PlayCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function RecoveryCaseDrawer({ isOpen, onClose, activeItem, strategy, isHalted, currentStep }) {
  if (!activeItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-navy-800 border-l border-brand-border z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-navy-900">
              <div>
                <h2 className="text-lg font-bold text-white">Recovery Case Details</h2>
                <p className="text-brand-textSecondary text-xs mt-1">{activeItem.customerName}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-brand-textSecondary hover:text-white hover:bg-navy-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Summary */}
              <div>
                <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
                  ₹{activeItem.riskAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-brand-textSecondary mt-1">Amount at Risk</div>
              </div>

              <hr className="border-brand-border/50" />

              {/* WHY DID THIS PAYMENT FAIL? */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase text-brand-textSecondary mb-3">
                  Why did this payment fail?
                </h3>
                <div className="p-4 rounded-xl bg-navy-900 border border-brand-border">
                  <div className="font-semibold text-white mb-1 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-fintech-danger" />
                    Gateway Timeout
                  </div>
                  <p className="text-sm text-brand-textSecondary leading-relaxed">
                    Temporary gateway degradation detected. The downstream processor (Razorpay) did not respond in time.
                  </p>
                  <div className="mt-3 text-xs font-mono text-brand-textSecondary/70 bg-navy-800 px-2 py-1 rounded inline-block">
                    Code: {activeItem.declineReasonCode}
                  </div>
                </div>
              </section>

              {/* AI RECOVERY PROBABILITY & WHY */}
              {currentStep >= 3 && strategy && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-brand-textSecondary mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-ai" />
                    AI Recovery Probability
                  </h3>
                  
                  <div className="p-4 rounded-xl bg-brand-ai/10 border border-brand-ai/20">
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-3xl font-bold text-white">87%</span>
                      <span className="text-brand-cyan text-sm mb-1 font-medium">High likelihood of recovery</span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2">Why?</h4>
                      <ul className="space-y-2 text-sm text-brand-textSecondary">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-fintech-success flex-shrink-0 mt-0.5" />
                          <span>Customer has 8 successful previous payments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-fintech-success flex-shrink-0 mt-0.5" />
                          <span>Failure appears temporary (Network timeout)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-fintech-success flex-shrink-0 mt-0.5" />
                          <span>Retry count (0) is still within safe limit</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {/* AI RECOMMENDATION */}
              {currentStep >= 3 && strategy && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-brand-textSecondary mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-cyan" />
                    AI Recommendation
                  </h3>
                  <div className="p-4 rounded-xl bg-navy-900 border border-brand-border">
                    <div className="font-semibold text-white mb-2">{strategy.replace(/_/g, ' ')}</div>
                    <p className="text-sm text-brand-textSecondary italic">
                      "Retry after a short cooldown to avoid repeated gateway failures."
                    </p>
                  </div>
                </section>
              )}

              {/* POLICY DECISION */}
              {currentStep >= 4 && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-brand-textSecondary mb-3">
                    Policy Decision
                  </h3>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-fintech-successBg border border-fintech-successBorder text-fintech-success font-medium">
                    <ShieldCheck className="w-5 h-5" />
                    Approved: Retry 1 of 3
                  </div>
                </section>
              )}

              {/* NEXT ACTION */}
              {currentStep >= 5 && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-brand-textSecondary mb-3">
                    Next Action
                  </h3>
                  <div className="text-sm text-brand-textPrimary bg-navy-900 p-4 rounded-xl border border-brand-border">
                    {activeItem.status === 'RECOVERED' 
                      ? 'Payment successfully recovered.' 
                      : (isHalted || activeItem.status === 'ESCALATED') 
                        ? 'Recovery escalated to human agents.' 
                        : 'Retry scheduled.'}
                  </div>
                </section>
              )}

            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-brand-border bg-navy-900">
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-lg border border-brand-border text-brand-textPrimary hover:bg-navy-700 transition-colors text-sm font-semibold"
              >
                Close Insights
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
