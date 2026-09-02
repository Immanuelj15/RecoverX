import React from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function CaseOutreachTab({ activeItem, currentStep }) {
  if (!activeItem) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fintech-card p-4 flex flex-col justify-between">
          <span className="text-[11px] text-brand-textSecondary uppercase tracking-widest font-bold">Touches Used</span>
          <span className="text-2xl font-extrabold text-brand-textPrimary mt-2 tabular-nums">1 / 3</span>
        </div>
        <div className="fintech-card p-4 flex flex-col justify-between">
          <span className="text-[11px] text-brand-textSecondary uppercase tracking-widest font-bold">Current Channel</span>
          <span className="text-xl font-bold text-brand-primary mt-2 flex items-center gap-2">
            <Mail className="w-5 h-5" /> Email
          </span>
        </div>
        <div className="fintech-card p-4 flex flex-col justify-between">
          <span className="text-[11px] text-brand-textSecondary uppercase tracking-widest font-bold">Next Eligible Action</span>
          <span className="text-[13px] font-bold text-brand-textPrimary mt-2">WhatsApp in 23h</span>
        </div>
      </div>

      <h3 className="text-sm font-bold tracking-widest uppercase text-brand-textSecondary mt-8 mb-4">Message History</h3>
      
      <div className="fintech-card p-5 border-l-4 border-l-brand-primary shadow-sm bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-appBg border border-brand-border rounded-lg text-brand-primary">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-brand-textPrimary text-[13px]">Payment Method Update Required</div>
              <div className="text-[11px] font-medium text-brand-textSecondary mt-1">Template: Standard_Soft_Decline_v2</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-status-successText font-bold px-2 py-0.5 bg-status-successBg border border-status-successBorder rounded uppercase tracking-wider inline-block">
              Opened
            </div>
            <div className="text-[11px] font-medium text-brand-textSecondary mt-1">Today, 09:17 AM</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-brand-appBg rounded-lg text-[13px] text-brand-textPrimary leading-relaxed border border-brand-border italic font-medium">
          "Hi {activeItem.customerName.split(' ')[0]}, we couldn't process your recent payment for ₹{activeItem.riskAmount.toLocaleString('en-IN')}. Please update your payment method to avoid any service interruption."
        </div>
      </div>

      <div className="fintech-card p-5 opacity-70 border-dashed border-brand-strongBorder bg-brand-appBg/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-brand-border rounded-lg text-brand-textSecondary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-brand-textPrimary text-[13px]">WhatsApp Follow-up</div>
              <div className="text-[11px] font-medium text-brand-textSecondary mt-1">Template: WA_Reminder_1</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-brand-textSecondary font-bold px-2 py-0.5 bg-white border border-brand-border rounded uppercase tracking-wider inline-block">
              Scheduled
            </div>
            <div className="text-[11px] font-medium text-brand-textSecondary mt-1">Tomorrow, 09:00 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
