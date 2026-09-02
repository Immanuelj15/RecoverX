import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, CheckCircle2, ShieldAlert, AlertCircle, PlayCircle, Loader2, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function AIRecoverySidebar({ activeItem, currentStep, onDiagnose, onExecute, strategy, isLoading, isHalted }) {
  
  if (currentStep < 2) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fintech-card p-6 h-[400px] flex flex-col justify-between border-blue-200 bg-blue-50/40 shadow-xs"
      >
        <div>
          <div className="flex items-center gap-2.5 text-blue-600 mb-4">
            <Sparkles className="w-5 h-5 ai-pulse" />
            <h3 className="text-base font-extrabold text-slate-900">AI Recovery Recommendation</h3>
          </div>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Awaiting AI diagnosis. Trigger the agent to analyze the root cause and determine the optimal recovery strategy.
          </p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDiagnose}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
          Analyze with AI Engine
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fintech-card flex flex-col h-[calc(100vh-200px)] border-blue-200 bg-blue-50/30 overflow-hidden shadow-sm"
    >
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5 ai-pulse" />
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">AI Recommendation</h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-600 live-dot"></span>
            High Confidence • 87%
          </div>
        </div>

        {/* Detected Issue */}
        <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Detected Root Cause</div>
          <p className="text-sm text-slate-900 font-bold leading-snug">Subscription renewal failed due to an expired card signal.</p>
        </div>

        {/* Evidence */}
        <div className="space-y-2.5">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Diagnostic Evidence</div>
          <ul className="space-y-2 text-sm font-medium text-slate-700">
            <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Subscription active 14 months (11 successful payments)</span></li>
            <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Expiry signal confirmed by issuer gateway</span></li>
            <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> <span>Email communication consent active</span></li>
            <li className="flex items-start gap-2.5"><AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" /> <span>SMS communication consent unavailable</span></li>
          </ul>
        </div>

        <hr className="border-blue-200/60" />

        {/* Recommendation */}
        <div className="space-y-1.5 bg-blue-600/10 -mx-6 px-6 py-4 border-y border-blue-200">
          <div className="text-xs uppercase font-bold text-blue-700 tracking-wider">Recommended Action</div>
          <p className="text-sm text-slate-900 font-extrabold">{strategy ? strategy.replace(/_/g, ' ') : 'Send a secure payment-method update nudge.'}</p>
        </div>

        {/* Why this is preferred */}
        <div className="space-y-1">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Why this is preferred</div>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Card retries are unlikely to succeed until details are updated. Email is eligible; SMS is not.
          </p>
        </div>

        {/* Expected Outcome */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Expected Financial Outcome</div>
          <div className="grid grid-cols-2 gap-3 text-sm font-medium">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-xs block mb-1 font-semibold">Recovery Prob.</span>
              <span className="text-slate-900 text-base font-extrabold tabular-nums">74%</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-xs block mb-1 font-semibold">Expected Value</span>
              <span className="text-emerald-700 text-base font-extrabold tabular-nums">₹{(activeItem.riskAmount * 0.74).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

        {/* Guardrails */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Policy Guardrails</div>
          <ul className="space-y-2.5 text-sm font-medium text-slate-700">
            <li className="flex justify-between items-center border-b border-slate-200 pb-2"><span>Email Channel</span> <span className="text-emerald-600 font-bold text-xs uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">Eligible</span></li>
            <li className="flex justify-between items-center border-b border-slate-200 pb-2"><span>SMS Channel</span> <span className="text-rose-600 font-bold text-xs uppercase px-2 py-0.5 rounded bg-rose-50 border border-rose-200">Blocked</span></li>
            <li className="flex justify-between items-center pb-1"><span>Max touches</span> <span className="text-slate-900 font-bold">1 / 3 remaining</span></li>
          </ul>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-5 border-t border-blue-200 bg-white mt-auto">
        {(currentStep >= 2 && currentStep <= 5) && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExecute}
            disabled={isLoading || isHalted || activeItem.status === 'RECOVERED'}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
            {currentStep === 2 ? 'Generate Recommendation' : currentStep === 3 ? 'Run Policy Check' : currentStep === 4 ? 'Execute Recovery' : 'Confirm Outcome'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        )}

        {(currentStep === 6 || isHalted || activeItem.status === 'RECOVERED') && (
          <div className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold border",
            activeItem.status === 'RECOVERED' 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-rose-50 text-rose-700 border-rose-200"
          )}>
            {activeItem.status === 'RECOVERED' ? 'Workflow Completed' : 'Workflow Halted'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
