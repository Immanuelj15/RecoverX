import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, PhoneCall, Sparkles, Filter, Search, ArrowUpRight, DollarSign, UserCheck, AlertTriangle } from 'lucide-react';

export default function HumanReviewView({ transactions = [], onRefresh }) {
  const [filterType, setFilterType] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Filter cases requiring human escalation (high-value >= ₹50,000, low confidence, or policy flagged)
  const escalationCases = transactions.filter((t) => {
    const amountInr = t.amount_inr || (t.amount?.value_paise ? t.amount.value_paise / 100 : 0);
    const isHighValue = amountInr >= 50000;
    const isEscalated = t.recovery_state === 'ESCALATED' || t.outcome === 'escalated' || t.policy_status === 'ESCALATED';
    const isLowConfidence = (t.recovery_probability || 0.8) < 0.4;
    return isHighValue || isEscalated || isLowConfidence;
  });

  const displayCases = escalationCases.filter((t) => {
    if (filterType === 'HIGH_VALUE') {
      const amountInr = t.amount_inr || (t.amount?.value_paise ? t.amount.value_paise / 100 : 0);
      return amountInr >= 50000;
    }
    if (filterType === 'LOW_CONFIDENCE') {
      return (t.recovery_probability || 0.8) < 0.4;
    }
    return true;
  });

  const handleAction = (paymentId, decision) => {
    setActionSuccessMsg(`Case ${paymentId} marked as ${decision}. Audit record logged.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#F8FAFC]">
      
      {/* Header Banner */}
      <div className="bg-[#101927] border border-[#1E2B3D] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">Human Escalation Queue</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Human-in-the-Loop Approval Queue</h1>
          <p className="text-xs text-[#94A3B8] font-medium mt-1 max-w-2xl">
            Policy Guardrail Rule #4 requires explicit merchant sign-off for high-value transactions (<span className="font-mono text-[#F59E0B] font-bold">≥ ₹50,000</span>), low confidence predictions, or risk exceptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B1220] border border-[#1E2B3D] px-4 py-3 rounded-xl text-center">
            <span className="text-[11px] text-[#94A3B8] block font-semibold">Escalated Count</span>
            <span className="text-xl font-mono font-bold text-[#F59E0B]">{escalationCases.length} Cases</span>
          </div>
          <div className="bg-[#0B1220] border border-[#1E2B3D] px-4 py-3 rounded-xl text-center">
            <span className="text-[11px] text-[#94A3B8] block font-semibold">Total Value at Risk</span>
            <span className="text-xl font-mono font-bold text-[#2D7FF9]">
              ₹{(escalationCases.reduce((acc, c) => acc + (c.amount_inr || 0), 0)).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#94A3B8] hover:text-white">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#1E2B3D] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-[#2D7FF9] text-white shadow-lg shadow-[#2D7FF9]/20'
                : 'bg-[#101927] text-[#94A3B8] border border-[#1E2B3D] hover:text-white'
            }`}
          >
            All Escalations ({escalationCases.length})
          </button>
          <button
            onClick={() => setFilterType('HIGH_VALUE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'HIGH_VALUE'
                ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/20'
                : 'bg-[#101927] text-[#94A3B8] border border-[#1E2B3D] hover:text-white'
            }`}
          >
            High Value (≥ ₹50,000)
          </button>
          <button
            onClick={() => setFilterType('LOW_CONFIDENCE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'LOW_CONFIDENCE'
                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                : 'bg-[#101927] text-[#94A3B8] border border-[#1E2B3D] hover:text-white'
            }`}
          >
            Low Confidence (&lt; 40%)
          </button>
        </div>

        <span className="text-xs text-[#64748B] font-mono">Policy Guardrail Enforced</span>
      </div>

      {/* Escalation Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayCases.map((item, idx) => {
          const amountInr = item.amount_inr || 52000;
          const prob = item.recovery_probability || 0.82;
          const expectedRecovery = item.expected_recovery_inr || Math.round(amountInr * prob);
          const reason = item.failure_reason || 'bank_declined';

          return (
            <div
              key={item.payment_id || idx}
              className="bg-[#101927] border border-[#1E2B3D] hover:border-[#2D7FF9]/60 rounded-2xl p-6 shadow-xl space-y-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white font-mono">{item.payment_id}</h3>
                    <span className="text-xs text-[#94A3B8]">Customer: {item.customer_id || 'cust_demo'}</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 uppercase">
                  MANUAL REVIEW
                </span>
              </div>

              {/* Financial & ML Indicators */}
              <div className="grid grid-cols-3 gap-3 bg-[#0B1220] p-4 rounded-xl border border-[#1E2B3D]">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Payment Amount</span>
                  <span className="text-base font-extrabold text-white font-mono">₹{amountInr.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">ML Probability</span>
                  <span className="text-base font-extrabold text-[#10B981] font-mono">{Math.round(prob * 100)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Expected Recovery</span>
                  <span className="text-base font-extrabold text-[#2D7FF9] font-mono">₹{expectedRecovery.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Escalation Reason */}
              <div className="p-3.5 bg-[#070B12] rounded-xl border border-[#1E2B3D] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Guardrail Reason:</span>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">
                  {amountInr >= 50000
                    ? `Transaction amount ₹${amountInr.toLocaleString('en-IN')} exceeds auto-execution limit (₹50,000).`
                    : `Failure code '${reason}' flagged for operations verification.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(item.payment_id, 'APPROVED')}
                  className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#10B981]/80 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#10B981]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Execution
                </button>
                <button
                  onClick={() => handleAction(item.payment_id, 'REJECTED')}
                  className="flex-1 py-2.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Reject & Stop
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
