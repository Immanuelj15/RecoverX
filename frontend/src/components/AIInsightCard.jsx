import React from 'react';
import { Sparkles, Bot, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AIInsightCard({ onOpenPolicy }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-sm mb-8 relative overflow-hidden border border-slate-200">
      <div className="flex items-start justify-between relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Groq AI Intelligence Insight
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">openai/gpt-oss-20b</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">
            Bank Timeout & Network Glitches Show 84% Historical Recovery Potential
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Layer 1 XGBoost model identified temporary gateway timeouts as the primary failure pattern.
            Layer 2 Groq Agent recommends executing <span className="font-extrabold text-blue-600">DELAYED_RETRY</span> with a 90-second exponential backoff window, staying safely within the 3-attempt merchant guardrail.
          </p>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-3">
          <button
            onClick={onOpenPolicy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Configure Guardrails</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>
          <span className="text-[11px] text-slate-500 font-mono">Policy Status: Strict Financial Limits Active</span>
        </div>
      </div>
    </div>
  );
}
