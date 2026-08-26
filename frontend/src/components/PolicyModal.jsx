import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function PolicyModal({ policy, onUpdatePolicy, onClose }) {
  const [formData, setFormData] = useState({
    max_retry_count: 3,
    high_value_threshold_inr: 50000,
    min_recovery_probability_threshold: 0.3
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (policy) {
      setFormData({
        max_retry_count: policy.max_retry_count || 3,
        high_value_threshold_inr: policy.high_value_threshold_inr || 50000,
        min_recovery_probability_threshold: policy.min_recovery_probability_threshold || 0.3
      });
    }
  }, [policy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdatePolicy({
      max_retry_count: Number(formData.max_retry_count),
      high_value_threshold_inr: Number(formData.high_value_threshold_inr),
      min_recovery_probability_threshold: Number(formData.min_recovery_probability_threshold)
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 mb-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Deterministic Policy Guardrails
            </h2>
            <p className="text-xs text-slate-400">
              Set business safety limits that override AI recommendations before action execution
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Guardrail 1: Max Retry Limit */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Maximum Automated Retry Limit
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            Transactions exceeding this attempt count will be automatically STOPPED to prevent customer retry fatigue.
          </p>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.max_retry_count}
            onChange={(e) => setFormData({ ...formData, max_retry_count: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Guardrail 2: High Value Threshold */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            High-Value Escalation Threshold (₹ INR)
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            Transactions equal to or exceeding this amount will automatically trigger HUMAN_ESCALATION for manual review.
          </p>
          <input
            type="number"
            step="1000"
            value={formData.high_value_threshold_inr}
            onChange={(e) => setFormData({ ...formData, high_value_threshold_inr: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Guardrail 3: Min Probability Threshold */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Minimum Recovery Probability Threshold (0.0 to 1.0)
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            AI recommendations with predicted ML score below this threshold will be blocked from automated retries.
          </p>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={formData.min_recovery_probability_threshold}
            onChange={(e) => setFormData({ ...formData, min_recovery_probability_threshold: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Policy Guardrails updated successfully!</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Policy Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
