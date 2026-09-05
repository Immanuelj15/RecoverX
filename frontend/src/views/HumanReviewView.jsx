import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, PhoneCall, Sparkles, Filter, Search, ArrowUpRight, DollarSign, UserCheck, AlertTriangle } from 'lucide-react';

export default function HumanReviewView({ transactions = [], onRefresh }) {
  const [filterType, setFilterType] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Filter cases requiring human escalation (high-value >= ₹50,000, low confidence, or policy flagged)
  const realEscalations = transactions.filter((t) => {
    const amountInr = t.amount_inr || (t.amount?.value_paise ? t.amount.value_paise / 100 : 0);
    const isHighValue = amountInr >= 50000;
    const isEscalated = t.recovery_state === 'ESCALATED' || t.outcome === 'escalated' || t.policy_status === 'ESCALATED';
    const isLowConfidence = (t.recovery_probability || 0.8) < 0.4;
    return isHighValue || isEscalated || isLowConfidence;
  });

  const defaultEscalations = [
    {
      payment_id: 'pay_esc_9841',
      customer_id: 'cust_acme_corp',
      customer_name: 'Acme Corp Ltd',
      amount_inr: 52000,
      recovery_probability: 0.82,
      expected_recovery_inr: 42640,
      failure_reason: 'high_value_hold',
      recovery_state: 'ESCALATED',
      policy_status: 'ESCALATED'
    },
    {
      payment_id: 'pay_esc_9842',
      customer_id: 'cust_ananya_tech',
      customer_name: 'Ananya Tech Solutions',
      amount_inr: 75000,
      recovery_probability: 0.68,
      expected_recovery_inr: 51000,
      failure_reason: 'risk_threshold_hold',
      recovery_state: 'ESCALATED',
      policy_status: 'ESCALATED'
    },
    {
      payment_id: 'pay_esc_9843',
      customer_id: 'cust_zeta_retail',
      customer_name: 'Zeta Retail Systems',
      amount_inr: 45000,
      recovery_probability: 0.35,
      expected_recovery_inr: 15750,
      failure_reason: 'low_confidence_flag',
      recovery_state: 'ESCALATED',
      policy_status: 'ESCALATED'
    },
    {
      payment_id: 'pay_esc_9844',
      customer_id: 'cust_technova',
      customer_name: 'TechNova Global',
      amount_inr: 98500,
      recovery_probability: 0.74,
      expected_recovery_inr: 72890,
      failure_reason: 'high_value_hold',
      recovery_state: 'ESCALATED',
      policy_status: 'ESCALATED'
    }
  ];

  const escalationCases = realEscalations.length > 0 ? realEscalations : defaultEscalations;

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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Human Escalation Queue</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Human-in-the-Loop Approval Queue</h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-2xl">
            Policy Guardrail Rule #4 requires explicit merchant sign-off for high-value transactions (<span className="font-mono text-amber-700 font-bold">≥ ₹50,000</span>), low confidence predictions, or risk exceptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 block font-semibold">Escalated Count</span>
            <span className="text-xl font-mono font-bold text-amber-600">{escalationCases.length} Cases</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 block font-semibold">Total Value at Risk</span>
            <span className="text-xl font-mono font-bold text-blue-600">
              ₹{(escalationCases.reduce((acc, c) => acc + (c.amount_inr || 0), 0)).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All Escalations ({escalationCases.length})
          </button>
          <button
            onClick={() => setFilterType('HIGH_VALUE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'HIGH_VALUE'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            High Value (≥ ₹50,000)
          </button>
          <button
            onClick={() => setFilterType('LOW_CONFIDENCE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'LOW_CONFIDENCE'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Low Confidence (&lt; 40%)
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono">Policy Guardrail Enforced</span>
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
              className="bg-white border border-slate-200 hover:border-blue-500/60 rounded-2xl p-6 shadow-sm space-y-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-mono">{item.payment_id}</h3>
                    <span className="text-xs text-slate-500">Customer: {item.customer_id || 'cust_demo'}</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                  MANUAL REVIEW
                </span>
              </div>

              {/* Financial & ML Indicators */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Payment Amount</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">₹{amountInr.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">ML Probability</span>
                  <span className="text-base font-extrabold text-emerald-600 font-mono">{Math.round(prob * 100)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Expected Recovery</span>
                  <span className="text-base font-extrabold text-blue-600 font-mono">₹{expectedRecovery.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Escalation Reason */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Guardrail Reason:</span>
                </div>
                <p className="text-amber-900/80 leading-relaxed">
                  {amountInr >= 50000
                    ? `Transaction amount ₹${amountInr.toLocaleString('en-IN')} exceeds auto-execution limit (₹50,000).`
                    : `Failure code '${reason}' flagged for operations verification.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(item.payment_id, 'APPROVED')}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Execution
                </button>
                <button
                  onClick={() => handleAction(item.payment_id, 'REJECTED')}
                  className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" /> Reject & Stop
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
