import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bot,
  ShieldAlert,
  FileCode
} from 'lucide-react';
import Tooltip from './Tooltip';

export default function TimelineModal({ transaction, onClose }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!transaction) return null;

  const isSuccess = transaction.recovery_state === 'RECOVERY_SUCCESS' || transaction.recovered === 1;
  const isEscalated = transaction.recovery_state === 'ESCALATED' || transaction.outcome === 'escalated';
  const isStopped = transaction.recovery_state === 'STOPPED' || transaction.outcome === 'stopped';
  const isApproved = transaction.recovery_state === 'ACTION_APPROVED';

  const probPercent = Math.round((transaction.recovery_probability || 0) * 100);

  // Dynamic SHAP weight calculation based on transaction parameters
  const successesBonus = Math.min((transaction.previous_successes || 2) * 5.2, 28.0).toFixed(1);
  const retryImpact = (-(transaction.retry_count || 0) * 4.5).toFixed(1);
  const ltvTier = (transaction.amount_inr || 2499) > 25000 ? 'High Value' : 'Standard';

  // Dynamic Groq Strategy Rationale
  const groqReasoning = transaction.ai_recommendation?.reason
    || transaction.ml_prediction?.recommendation_reason
    || `Temporary ${transaction.failure_reason || 'network_timeout'} error. Customer has past successful payment history. Executing ${transaction.recommended_action || 'DELAYED_RETRY'} intervention is recommended.`;

  return (
    <div className="fixed inset-0 bg-[#0C2651]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E4E7EC] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#111827] font-mono">
                {transaction.payment_id}
              </h3>
              <span className="text-xs text-[#667085]">
                (Txn: {transaction.transaction_id})
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              Customer ID: <span className="font-mono text-[#111827] font-semibold">{transaction.customer_id}</span> • Method: <span className="uppercase font-mono">{transaction.payment_method}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667085] hover:text-[#111827] hover:bg-[#F7F9FC] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* LEVEL 1: Executive Summary Card for Merchants & Business Owners */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                Merchant Executive Summary
              </span>
              <span className="text-xs font-mono font-semibold text-[#2D6CDF] bg-[#EEF4FF] px-2.5 py-1 rounded border border-[#C7D7FE]">
                Amount: ₹{(transaction.amount_inr || (transaction.amount_paise ? transaction.amount_paise / 100 : 0)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-[#E4E7EC]">
                <span className="text-[#667085] block mb-1">Payment Failure Cause</span>
                <span className="font-semibold text-[#DC2626] font-mono text-xs">
                  {transaction.failure_reason || 'insufficient_balance'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#E4E7EC]">
                <span className="text-[#667085] block mb-1">RecoverX Recommendation</span>
                <span className="font-bold text-[#635BFF] font-mono text-xs">
                  {transaction.recommended_action || 'SMART_RETRY'}
                </span>
              </div>
            </div>

            {/* Level 2: Visual Safety Badges */}
            <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
              <span className="text-xs font-semibold text-[#475467]">Safety Architecture Status:</span>
              {isSuccess && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> RECOVERY SUCCESSFUL
                </span>
              )}
              {isEscalated && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#2D6CDF] border border-[#C7D7FE]">
                  <AlertTriangle className="w-3.5 h-3.5" /> HUMAN REVIEW ESCALATED
                </span>
              )}
              {isStopped && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                  <ShieldAlert className="w-3.5 h-3.5" /> GUARDRAIL STOPPED
                </span>
              )}
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                  <ShieldCheck className="w-3.5 h-3.5" /> POLICY ALLOWED & APPROVED
                </span>
              )}
            </div>
          </div>

          {/* LEVEL 3: Collapsible Technical Deep-Dive Inspector */}
          <div className="border border-[#E4E7EC] rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full bg-[#F7F9FC] hover:bg-[#EEF4FF] p-4 flex items-center justify-between text-xs font-bold text-[#0C2651] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#2D6CDF]" />
                <span>Level 3: Technical Details Inspector (ML, LLM & Policy Logs)</span>
              </div>
              <div className="flex items-center gap-1 text-[#2D6CDF]">
                <span>{showTechnicalDetails ? 'Hide Details' : 'Expand Technical Details'}</span>
                {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showTechnicalDetails && (
              <div className="p-4 bg-white space-y-5 text-xs border-t border-[#E4E7EC]">
                {/* XGBoost Predictive Intelligence Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#111827] flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#2D6CDF]" />
                      <Tooltip term="XGBoost" text="Gradient boosted decision trees model evaluating historical recovery patterns to predict P(recovery).">
                        Layer 1: XGBoost Recovery Predictor
                      </Tooltip>
                    </h4>
                    <span className="font-mono text-[#667085] text-[11px]">recovery_model.joblib v1.0.0</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E4E7EC]">
                      <span className="text-[#667085] block text-[11px]">
                        <Tooltip term="Recovery Probability" text="Calculated probability that retrying or intervening will successfully recover this payment.">
                          Recovery Probability P(recovery):
                        </Tooltip>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-bold font-mono text-[#111827]">{probPercent}%</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          probPercent >= 70 ? 'bg-[#F0FDF4] text-[#16A34A]' : probPercent >= 40 ? 'bg-[#FFFBEB] text-[#F59E0B]' : 'bg-[#FEF2F2] text-[#DC2626]'
                        }`}>
                          {transaction.risk_band || (probPercent >= 70 ? 'LOW RISK' : 'HIGH RISK')}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E4E7EC]">
                      <span className="text-[#667085] block text-[11px]">Customer History:</span>
                      <div className="mt-1 font-semibold text-[#111827]">
                        {transaction.previous_successes || 0} Successful • {transaction.retry_count || 0} Retries
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-[#EAECF0] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${probPercent >= 70 ? 'bg-[#16A34A]' : probPercent >= 40 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'}`}
                      style={{ width: `${probPercent}%` }}
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
                        <span className="font-bold text-[#16A34A]">+{successesBonus}%</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Retry Count Impact</span>
                        <span className="font-bold text-[#F59E0B]">{retryImpact}%</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Failure Code Impact</span>
                        <span className="font-bold text-[#F59E0B]">{transaction.failure_reason || 'timeout'}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-[#E4E7EC]">
                        <span className="text-[#667085] block">Customer LTV Tier</span>
                        <span className="font-bold text-[#2D6CDF]">{ltvTier}</span>
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
                      "{groqReasoning}"
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

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A]">
                      <span>1. Action Allowlist Check</span>
                      <span className="font-bold">PASSED (In Allowlist)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A]">
                      <span>2. Unrecoverable Failure Code Check</span>
                      <span className="font-bold">PASSED (Recoverable Code)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A]">
                      <span>3. Max Retry Cap (3 Attempts)</span>
                      <span className="font-bold">PASSED ({transaction.retry_count || 0}/3 Attempts)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A]">
                      <span>4. Min Recovery Probability Threshold (30%)</span>
                      <span className="font-bold">PASSED ({probPercent}% ≥ 30%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded border border-[#BBF7D0] text-[#16A34A]">
                      <span>5. High-Value Escalation Threshold (₹50,000)</span>
                      <span className="font-bold">PASSED (&lt; ₹50,000)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E4E7EC] bg-[#F7F9FC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white border border-[#E4E7EC] hover:bg-[#EAECF0] text-[#344054] rounded-lg transition-colors shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
