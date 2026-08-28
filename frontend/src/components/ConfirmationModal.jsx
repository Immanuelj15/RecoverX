import React from 'react';
import { AlertTriangle, ShieldCheck, X, Play } from 'lucide-react';

export default function ConfirmationModal({ paymentId, amountInr, action, isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#0C2651] text-white">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="font-bold text-base text-white">Confirm Financial Action</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#94A3B8] hover:text-white rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-[#344054] leading-relaxed">
            You are about to trigger an automated recovery operation for transaction{' '}
            <span className="font-mono font-bold text-[#2D6CDF]">{paymentId}</span>.
          </p>

          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-2 font-medium">
            <div className="flex justify-between">
              <span className="text-[#667085]">Payment ID:</span>
              <span className="font-mono text-[#111827]">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Transaction Amount:</span>
              <span className="font-bold text-[#111827]">₹{amountInr || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Intervention Action:</span>
              <span className="font-semibold text-[#635BFF] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#C7D2FE]">
                {action || 'SMART_RETRY'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#EAECF0]">
              <span className="text-[#667085]">Guardrail Policy Check:</span>
              <span className="font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ALLOWED
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#667085]">
            This action will execute strictly within merchant rate limits and policy safety guardrails.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E7EC] bg-[#F7F9FC] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-[#344054] bg-white hover:bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#2D6CDF] hover:bg-[#1B54BD] rounded-lg shadow-sm text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Confirm & Trigger</span>
          </button>
        </div>
      </div>
    </div>
  );
}
