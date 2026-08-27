import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Save, RefreshCw, AlertTriangle } from 'lucide-react';

export default function PolicyModal({ policy, onClose, onSave }) {
  const [formData, setFormData] = useState({
    max_retry_count: policy?.max_retry_count || 3,
    high_value_threshold_inr: policy?.high_value_threshold_inr || 50000,
    min_recovery_probability_threshold: policy?.min_recovery_probability_threshold || 0.30,
    cooldown_period_minutes: policy?.cooldown_period_minutes || 60,
    permitted_actions: policy?.permitted_actions || ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP']
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onSave) await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#0C2651] text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
            <div>
              <h2 className="text-lg font-bold text-white">Autonomous Policy Guardrail Settings</h2>
              <p className="text-xs text-[#94A3B8]">Enforce non-bypassable financial rules and retry safety limits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white text-xs">
          {/* Max Retry Limit */}
          <div>
            <label className="block font-semibold text-[#111827] mb-1">
              Maximum Automated Retries Allowed: <span className="text-[#2D6CDF] font-bold">{formData.max_retry_count}</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.max_retry_count}
              onChange={(e) => setFormData({ ...formData, max_retry_count: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-[#EAECF0] rounded-lg appearance-none cursor-pointer accent-[#2D6CDF]"
            />
            <p className="text-[11px] text-[#667085] mt-1">
              Prevents customer fatigue and gateway fees by capping total automated retry attempts per payment.
            </p>
          </div>

          {/* High Value Escalation Threshold */}
          <div>
            <label className="block font-semibold text-[#111827] mb-1">
              High-Value Escalation Threshold (₹ INR):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#667085] font-bold">₹</span>
              <input
                type="number"
                value={formData.high_value_threshold_inr}
                onChange={(e) => setFormData({ ...formData, high_value_threshold_inr: parseFloat(e.target.value) })}
                className="w-full pl-8 pr-4 py-2 bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF] font-bold text-[#111827]"
              />
            </div>
            <p className="text-[11px] text-[#667085] mt-1">
              Transactions exceeding this amount will automatically require human merchant operator review (`HUMAN_ESCALATION`).
            </p>
          </div>

          {/* Min Recovery Probability */}
          <div>
            <label className="block font-semibold text-[#111827] mb-1">
              Minimum Recovery Probability Threshold: <span className="text-[#16A34A] font-bold">{Math.round(formData.min_recovery_probability_threshold * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              value={formData.min_recovery_probability_threshold}
              onChange={(e) => setFormData({ ...formData, min_recovery_probability_threshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#EAECF0] rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
            />
            <p className="text-[11px] text-[#667085] mt-1">
              Transactions scoring below this ML probability score will be safely stopped (`STOP`) to avoid unnecessary retry costs.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
            <span className="text-[11px] text-[#16A34A] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Enforced by Policy Engine
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-[#344054] bg-[#F7F9FC] hover:bg-[#EAECF0] border border-[#E4E7EC] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#2D6CDF] hover:bg-[#1B54BD] rounded-lg shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Guardrails'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
