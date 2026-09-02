import React, { useState } from 'react';
import { Save, ShieldAlert, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PoliciesView() {
  const [isSaving, setIsSaving] = useState(false);
  const [policies, setPolicies] = useState({
    maxTouches: 3,
    maxSmsTouches: 1,
    maxEmailTouches: 2,
    quietHoursStart: '20:00',
    quietHoursEnd: '09:00',
    approvalThreshold: 100000,
    pauseOnDispute: true,
    stopAfterPayment: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicies(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-[900px] mx-auto flex flex-col gap-8 h-full animate-fade-in">
      <div className="border-b border-brand-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-textPrimary tracking-tight">Policy Engine & Guardrails</h1>
          <p className="text-sm font-medium text-brand-textSecondary mt-1">Configure automated compliance rules, quiet hours, and escalation thresholds.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primaryHover transition-colors disabled:opacity-50 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Policies'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Frequency Caps */}
        <div className="fintech-card p-6 bg-white">
          <div className="flex items-center gap-3 mb-4 border-b border-brand-border pb-3">
            <ShieldAlert className="w-5 h-5 text-brand-primary" />
            <h3 className="font-extrabold text-brand-textPrimary tracking-tight">Contact Frequency Caps</h3>
          </div>
          
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[13px] font-bold text-brand-textPrimary block mb-1">Max Automated Touches (Per Case)</label>
              <input type="number" name="maxTouches" value={policies.maxTouches} onChange={handleChange} className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md px-3 py-2 text-brand-textPrimary text-sm font-medium shadow-sm transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-brand-textPrimary block mb-1">Max SMS/WhatsApp</label>
                <input type="number" name="maxSmsTouches" value={policies.maxSmsTouches} onChange={handleChange} className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md px-3 py-2 text-brand-textPrimary text-sm font-medium shadow-sm transition-all" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-brand-textPrimary block mb-1">Max Emails</label>
                <input type="number" name="maxEmailTouches" value={policies.maxEmailTouches} onChange={handleChange} className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md px-3 py-2 text-brand-textPrimary text-sm font-medium shadow-sm transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="fintech-card p-6 bg-white">
          <div className="flex items-center gap-3 mb-4 border-b border-brand-border pb-3">
            <ShieldCheck className="w-5 h-5 text-status-successText" />
            <h3 className="font-extrabold text-brand-textPrimary tracking-tight">Timezone Quiet Hours</h3>
          </div>
          <p className="text-[13px] font-medium text-brand-textSecondary mb-4 leading-relaxed">Suspend automated outreach during customer local nighttime.</p>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[13px] font-bold text-brand-textPrimary block mb-1">Quiet Hours Start</label>
              <input type="time" name="quietHoursStart" value={policies.quietHoursStart} onChange={handleChange} className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md px-3 py-2 text-brand-textPrimary text-sm font-medium shadow-sm transition-all" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-brand-textPrimary block mb-1">Quiet Hours End</label>
              <input type="time" name="quietHoursEnd" value={policies.quietHoursEnd} onChange={handleChange} className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md px-3 py-2 text-brand-textPrimary text-sm font-medium shadow-sm transition-all" />
            </div>
          </div>
        </div>

        {/* Escalation & Stopping Rules */}
        <div className="fintech-card p-6 bg-white md:col-span-2">
          <div className="flex items-center gap-3 mb-4 border-b border-brand-border pb-3">
            <ShieldAlert className="w-5 h-5 text-status-warningText" />
            <h3 className="font-extrabold text-brand-textPrimary tracking-tight">Stopping Rules & Escalation</h3>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <div className="text-brand-textPrimary text-[13px] font-bold">Require Human Approval (Amount)</div>
                <div className="text-brand-textSecondary text-[11px] font-medium mt-0.5">Require manual sign-off before automating collections over this threshold.</div>
              </div>
              <div className="w-40 relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-textSecondary font-bold">₹</span>
                 <input type="number" name="approvalThreshold" value={policies.approvalThreshold} onChange={handleChange} className="w-full bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-md pl-7 pr-3 py-2 text-brand-textPrimary text-sm font-bold shadow-sm transition-all text-right" />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <div className="text-brand-textPrimary text-[13px] font-bold">Stop on Dispute</div>
                <div className="text-brand-textSecondary text-[11px] font-medium mt-0.5">Instantly pause all automated workflows if a chargeback or dispute is raised.</div>
              </div>
              <div>
                <input type="checkbox" name="pauseOnDispute" checked={policies.pauseOnDispute} onChange={handleChange} className="w-5 h-5 rounded bg-white border border-brand-border accent-brand-primary cursor-pointer shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-brand-textPrimary text-[13px] font-bold">Stop on Payment Success</div>
                <div className="text-brand-textSecondary text-[11px] font-medium mt-0.5">Instantly cancel scheduled retries and emails when payment is recovered.</div>
              </div>
              <div>
                <input type="checkbox" name="stopAfterPayment" checked={policies.stopAfterPayment} onChange={handleChange} className="w-5 h-5 rounded bg-white border border-brand-border accent-brand-primary cursor-pointer shadow-sm" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
