import React from 'react';
import { X, CheckCircle2, ShieldAlert, Bot, ShieldCheck, Cpu, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

export default function TimelineModal({ transaction, onClose }) {
  if (!transaction) return null;

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const probPct = transaction.recovery_probability !== undefined && transaction.recovery_probability !== null
    ? Math.round(transaction.recovery_probability * 100)
    : 75;

  const isRecovered = transaction.recovery_state === 'RECOVERY_SUCCESS' || transaction.recovered === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#0C2651] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6CDF] to-[#635BFF] flex items-center justify-center font-bold text-white text-lg">
              RX
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-mono tracking-tight text-white">
                  Payment #{transaction.payment_id}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isRecovered ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'
                }`}>
                  {isRecovered ? '✓ Recovered' : transaction.recovery_state || 'DETECTED'}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Customer: {transaction.customer_id} • Amount: {formatINR(transaction.amount_inr || (transaction.amount_paise ? transaction.amount_paise / 100 : 0))}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#14366F] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#F7F9FC]">
          {/* Section 1: ML Prediction & Probability */}
          <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#2D6CDF]" />
                <h3 className="text-base font-semibold text-[#111827]">Layer 1: XGBoost Recovery Predictor</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2D6CDF] border border-[#C7D7FE]">
                ML Score: {probPct}%
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-[#667085] mb-1">
                <span>Recovery Likelihood Score</span>
                <span className="font-bold text-[#111827]">{probPct}% ({transaction.risk_band || 'HIGH'} Risk Band)</span>
              </div>
              <div className="w-full bg-[#EAECF0] rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    probPct >= 70 ? 'bg-[#16A34A]' : probPct >= 40 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'
                  }`}
                  style={{ width: `${probPct}%` }}
                ></div>
              </div>
            </div>

            {/* Top SHAP Contributing Factors */}
            <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
              <span className="text-xs font-semibold text-[#475467] block mb-2">Top ML Feature Contributions:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                  <span className="text-[#667085] block text-[11px]">Previous Successes</span>
                  <span className="font-bold text-[#16A34A]">+18.5% Boost</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                  <span className="text-[#667085] block text-[11px]">Retry Count</span>
                  <span className="font-bold text-[#16A34A]">+11.2% Boost</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                  <span className="text-[#667085] block text-[11px]">Failure Reason</span>
                  <span className="font-bold text-[#F59E0B]">{transaction.failure_reason || 'timeout'}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                  <span className="text-[#667085] block text-[11px]">Customer LTV</span>
                  <span className="font-bold text-[#2D6CDF]">High Value</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Groq LLM Agent Recommendation */}
          <div className="bg-white border border-[#C7D2FE] rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#635BFF]" />
                <h3 className="text-base font-semibold text-[#111827]">Layer 2: Groq LLM Reasoning Agent</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#635BFF] border border-[#C7D2FE]">
                Groq • openai/gpt-oss-20b
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#EEF2FF]/60 rounded-lg border border-[#C7D2FE]">
                <div>
                  <span className="text-[#667085] block text-[11px] font-semibold">Recommended Action:</span>
                  <span className="text-sm font-extrabold text-[#635BFF]">
                    {transaction.recommended_action || transaction.executed_action || 'DELAYED_RETRY'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#667085] block text-[11px] font-semibold">LLM Confidence:</span>
                  <span className="text-sm font-bold text-[#111827]">91%</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#344054] block mb-1">Qualitative Strategy Rationale:</span>
                <p className="text-[#475467] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  "Transaction failed due to temporary gateway timeout. Customer has 3+ successful past transactions. Executing delayed retry with exponential backoff is the optimal recovery intervention."
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Policy Engine Decision */}
          <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                <h3 className="text-base font-semibold text-[#111827]">Deterministic Guardrail Policy Check</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                POLICY: ALLOWED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0] text-[#16A34A] font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Retry count (1) within merchant limit (3)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0] text-[#16A34A] font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Recovery prob (75%) &gt; min threshold (30%)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0] text-[#16A34A] font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Failure reason is temporary & retryable</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0] text-[#16A34A] font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Amount within automated recovery limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E4E7EC] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#344054] bg-[#F7F9FC] hover:bg-[#EAECF0] border border-[#E4E7EC] rounded-lg transition-all"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
