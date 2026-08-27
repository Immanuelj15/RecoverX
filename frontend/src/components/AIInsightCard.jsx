import React from 'react';
import { Sparkles, Bot, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AIInsightCard({ onOpenPolicy }) {
  return (
    <div className="bg-gradient-to-r from-[#0C2651] via-[#14366F] to-[#0C2651] rounded-xl p-6 text-white shadow-lg mb-8 relative overflow-hidden border border-[#1C4991]">
      <div className="flex items-start justify-between relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#635BFF] text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Groq AI Intelligence Insight
            </span>
            <span className="text-xs text-[#94A3B8] font-mono">openai/gpt-oss-20b</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Bank Timeout & Network Glitches Show 84% Historical Recovery Potential
          </h3>
          <p className="text-sm text-[#E2E8F0] leading-relaxed">
            Layer 1 XGBoost model identified temporary gateway timeouts as the primary failure pattern.
            Layer 2 Groq Agent recommends executing <span className="font-semibold text-[#60A5FA]">DELAYED_RETRY</span> with a 90-second exponential backoff window, staying safely within the 3-attempt merchant guardrail.
          </p>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-3">
          <button
            onClick={onOpenPolicy}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#0C2651] hover:bg-[#EEF4FF] font-semibold text-xs rounded-lg transition-all shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-[#2D6CDF]" />
            <span>Configure Guardrails</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-[#94A3B8]">Policy Status: Strict Financial Limits Active</span>
        </div>
      </div>
    </div>
  );
}
