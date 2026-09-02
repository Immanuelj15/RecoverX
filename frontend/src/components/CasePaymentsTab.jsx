import React from 'react';
import { CreditCard, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function CasePaymentsTab({ activeItem }) {
  if (!activeItem) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Ledger Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="fintech-card p-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-brand-textSecondary mb-1">At Risk</div>
          <div className="text-lg font-bold text-brand-textPrimary tabular-nums">₹{activeItem.riskAmount.toLocaleString('en-IN')}</div>
        </div>
        <div className="fintech-card p-4 bg-status-successBg border-status-successBorder">
          <div className="text-[11px] font-bold uppercase tracking-widest text-status-successText mb-1">Recovered</div>
          <div className="text-lg font-extrabold text-status-successText tabular-nums">
            {activeItem.status === 'RECOVERED' ? `₹${activeItem.riskAmount.toLocaleString('en-IN')}` : '₹0'}
          </div>
        </div>
        <div className="fintech-card p-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-brand-textSecondary mb-1">Remaining</div>
          <div className="text-lg font-bold text-brand-textPrimary tabular-nums">
            {activeItem.status === 'RECOVERED' ? '₹0' : `₹${activeItem.riskAmount.toLocaleString('en-IN')}`}
          </div>
        </div>
        <div className="fintech-card p-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-brand-textSecondary mb-1">Recovery Cost</div>
          <div className="text-lg font-bold text-status-warningText tabular-nums">₹2.50</div>
        </div>
        <div className="fintech-card p-4 border-b-[3px] border-b-brand-primary">
          <div className="text-[11px] font-bold uppercase tracking-widest text-brand-textSecondary mb-1">Net Recovered</div>
          <div className="text-lg font-extrabold text-brand-textPrimary tabular-nums">
            {activeItem.status === 'RECOVERED' ? `₹${(activeItem.riskAmount - 2.50).toLocaleString('en-IN')}` : '₹0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 fintech-card overflow-hidden">
          <div className="p-4 border-b border-brand-border bg-white">
            <h3 className="font-bold text-brand-textPrimary text-[13px]">Payment Ledger</h3>
          </div>
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-white border-b border-brand-border text-[11px] text-brand-textSecondary uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-bold">Timestamp</th>
                <th className="px-4 py-3 font-bold">Method</th>
                <th className="px-4 py-3 font-bold text-right">Amount</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border bg-white font-medium">
              <tr>
                <td className="px-4 py-3 text-brand-textPrimary tabular-nums">Sep 01, 09:14 AM</td>
                <td className="px-4 py-3 text-brand-textPrimary flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-textSecondary" /> Card ending in 4242
                </td>
                <td className="px-4 py-3 text-brand-textPrimary font-bold tabular-nums text-right">₹{activeItem.riskAmount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className="text-status-dangerText font-bold">Failed</span>
                </td>
              </tr>
              {activeItem.status === 'RECOVERED' && (
                <tr>
                  <td className="px-4 py-3 text-brand-textPrimary tabular-nums">Sep 01, 12:47 PM</td>
                  <td className="px-4 py-3 text-brand-textPrimary flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-brand-primary" /> Secure Payment Link
                  </td>
                  <td className="px-4 py-3 text-brand-textPrimary font-bold tabular-nums text-right">₹{activeItem.riskAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="text-status-successText font-bold flex items-center gap-1 bg-status-successBg px-2 py-0.5 rounded border border-status-successBorder w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="fintech-card p-5 h-fit">
          <h3 className="font-bold text-brand-textPrimary text-[13px] mb-4">Active Payment Link</h3>
          <div className="p-4 bg-brand-appBg rounded-lg border border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-softBlue border border-brand-strongBorder rounded text-brand-primary">
                <LinkIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-brand-textPrimary">pay.recoverx.in/u4...</div>
                <div className="text-[11px] font-medium text-brand-textSecondary mt-0.5">Expires in 23h 45m</div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-brand-border rounded-lg text-sm font-bold text-brand-textPrimary bg-white hover:bg-brand-appBg hover:border-brand-strongBorder transition-colors shadow-sm">
            Copy Link
          </button>
        </div>
      </div>

    </div>
  );
}
