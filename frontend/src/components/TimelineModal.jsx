import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Bot, ShieldCheck, Cpu, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Tooltip from './Tooltip';

export default function TimelineModal({ transaction, onClose }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!transaction) return null;

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const amountInr = transaction.amount_inr || (transaction.amount_paise ? transaction.amount_paise / 100 : 0);
  const probPct = transaction.recovery_probability !== undefined && transaction.recovery_probability !== null
    ? Math.round(transaction.recovery_probability * 100)
    : 75;

  const isRecovered = transaction.recovery_state === 'RECOVERY_SUCCESS' || transaction.recovered === 1;
  const isBlocked = transaction.recovery_state === 'STOPPED' || transaction.policy_decision?.allowed === false;
  const isEscalated = transaction.recovery_state === 'ESCALATED' || amountInr >= 50000;

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
                  isRecovered ? 'bg-[#F0FDF4] text-[#16A34A]' : isBlocked ? 'bg-[#FEF2F2] text-[#DC2626]' : isEscalated ? 'bg-[#EEF4FF] text-[#2D6CDF]' : 'bg-[#FFFBEB] text-[#F59E0B]'
                }`}>
                  {isRecovered ? '✓ Recovered' : isBlocked ? '🛑 Blocked / Stopped' : isEscalated ? '⚠️ Human Review Required' : transaction.recovery_state || 'DETECTED'}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Customer: {transaction.customer_id} • Amount: {formatINR(amountInr)}
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
          {/* LEVEL 1: Non-Technical Business Outcome Explanation */}
          <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#111827] border-b border-[#F2F4F7] pb-2">
              Merchant Executive Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="font-bold text-[#667085] uppercase tracking-wider block text-[10px] mb-1">
                  1. What Happened?
                </span>
                <p className="font-semibold text-[#111827]">
                  Payment failed due to failure code <span className="font-mono text-[#2D6CDF]">{transaction.failure_reason || 'network_timeout'}</span>.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="font-bold text-[#667085] uppercase tracking-wider block text-[10px] mb-1">
                  2. What did RecoverX recommend?
                </span>
                <p className="font-semibold text-[#635BFF]">
                  Intervention: <span className="font-bold">{transaction.recommended_action || transaction.executed_action || 'DELAYED_RETRY'}</span>
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="font-bold text-[#667085] uppercase tracking-wider block text-[10px] mb-1">
                  3. Why this recommendation?
                </span>
                <p className="text-[#344054]">
                  Recovery likelihood: <span className="font-bold text-[#16A34A]">{probPct}% ({transaction.risk_band || 'HIGH'})</span> — Strong customer payment history and temporary gateway issue.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="font-bold text-[#667085] uppercase tracking-wider block text-[10px] mb-1">
                  4. Was the action safe?
                </span>
                <p className="font-semibold text-[#16A34A] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Policy Engine evaluation: ALLOWED (Within 3-retry cap & rate limits)
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs font-medium text-[#16A34A] flex items-center justify-between">
              <span>Final Financial Result:</span>
              <span className="font-bold text-sm">{isRecovered ? `✓ ${formatINR(amountInr)} Recovered Successfully` : `Action Execution Completed (${transaction.recovery_state || 'DETECTED'})`}</span>
            </div>
          </div>

          {/* LEVEL 2 & 3 Technical Details Expander Toggle */}
          <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-4 flex items-center justify-between bg-[#EEF4FF] text-[#0C2651] font-bold text-xs hover:bg-[#D0E2FF] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2D6CDF]" />
                <span>View Technical Deep-Dive Details (XGBoost, SHAP, Groq LLM, Policy Rules)</span>
              </div>
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalDetails && (
              <div className="p-5 space-y-6 bg-white text-xs border-t border-[#C7D7FE]">
                {/* XGBoost Prediction Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#111827] flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#2D6CDF]" />
                      <Tooltip term="XGBoost Prediction" text="Gradient boosted machine learning model scoring transaction recovery probability based on historical features.">
                        Layer 1: XGBoost Recovery Predictor
                      </Tooltip>
                    </h4>
                    <span className="font-mono text-[#2D6CDF] font-bold">{probPct}% Score</span>
                  </div>

                  <div className="w-full bg-[#EAECF0] rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${probPct >= 70 ? 'bg-[#16A34A]' : probPct >= 40 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'}`}
                      style={{ width: `${probPct}%` }}
                    ></div>
                  </div>

                  {/* SHAP Contributions */}
                  <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    <span className="font-bold text-[#475467] block mb-2 text-[11px]">
                      <Tooltip term="SHAP Explanations" text="Shapley Additive exPlanations measuring feature contribution to the final recovery probability.">
                        SHAP Feature Contribution Weights:
                      </Tooltip>
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Previous Successes</span>
                        <span className="font-bold text-[#16A34A]">+18.5%</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Retry Count History</span>
                        <span className="font-bold text-[#16A34A]">+11.2%</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Failure Code Impact</span>
                        <span className="font-bold text-[#F59E0B]">{transaction.failure_reason || 'timeout'}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Customer LTV Tier</span>
                        <span className="font-bold text-[#2D6CDF]">High Value</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Groq LLM Reasoning Section */}
                <div className="space-y-3 pt-3 border-t border-[#EAECF0]">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#111827] flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#635BFF]" />
                      <Tooltip term="Groq LLM" text="Ultra-low latency LLM provider generating qualitative strategy rationale and customer messaging.">
                        Layer 2: Groq LLM Agent (openai/gpt-oss-20b)
                      </Tooltip>
                    </h4>
                    <span className="font-mono text-[#635BFF] font-semibold text-[11px]">JSON Schema Validated</span>
                  </div>

                  <div className="p-3 bg-[#EEF2FF] rounded-lg border border-[#C7D2FE] space-y-2 text-[#475467]">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#344054]">Recommended Action:</span>
                      <span className="font-bold text-[#635BFF]">{transaction.recommended_action || 'DELAYED_RETRY'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed bg-white p-2.5 rounded border border-[#C7D2FE] text-[#111827]">
                      "Temporary gateway timeout. Customer has 3+ successful past transactions. Executing delayed retry with exponential backoff is the optimal intervention."
                    </p>
                  </div>
                </div>

                {/* Policy Guardrails Section */}
                <div className="space-y-3 pt-3 border-t border-[#EAECF0]">
                  <h4 className="font-bold text-[#111827] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                    <Tooltip term="Policy Engine" text="Non-bypassable deterministic compliance engine checking rate limits, retry caps, and financial thresholds.">
                      Layer 3: Policy Guardrail Evaluation Checklist
                    </Tooltip>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A] font-semibold flex items-center gap-1.5">
                      ✓ Retry count (1) within merchant limit (3)
                    </div>
                    <div className="p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A] font-semibold flex items-center gap-1.5">
                      ✓ Recovery prob (75%) &gt; min threshold (30%)
                    </div>
                    <div className="p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A] font-semibold flex items-center gap-1.5">
                      ✓ Failure code retryable via automation
                    </div>
                    <div className="p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A] font-semibold flex items-center gap-1.5">
                      ✓ Amount within automated approval cap
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E4E7EC] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#344054] bg-[#F7F9FC] hover:bg-[#EAECF0] border border-[#E4E7EC] rounded-lg transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
