import React, { useEffect } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PromisesView({ promises, fetchPromises, fulfillPromise, missPromise }) {
  useEffect(() => {
    fetchPromises();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FULFILLED':
        return <span className="px-2 py-1 bg-status-successBg text-status-successText font-bold uppercase tracking-wider text-[10px] rounded border border-status-successBorder">Fulfilled</span>;
      case 'MISSED':
        return <span className="px-2 py-1 bg-status-dangerBg text-status-dangerText font-bold uppercase tracking-wider text-[10px] rounded border border-status-dangerBorder">Missed</span>;
      default:
        return <span className="px-2 py-1 bg-status-warningBg text-status-warningText font-bold uppercase tracking-wider text-[10px] rounded border border-status-warningBorder">Pending</span>;
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto flex flex-col gap-8 h-full animate-fade-in">
      <div className="border-b border-brand-border pb-6">
        <h1 className="text-2xl font-extrabold text-brand-textPrimary tracking-tight">Promise-to-Pay Tracker</h1>
        <p className="text-sm font-medium text-brand-textSecondary mt-1">Manage scheduled payment commitments and track fulfillment rates.</p>
      </div>

      <div className="fintech-card overflow-hidden flex-1 flex flex-col bg-white">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="text-[11px] font-bold text-brand-textSecondary uppercase tracking-wider border-b border-brand-border bg-brand-appBg">
            <tr>
              <th className="px-6 py-3 font-bold uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider">Event ID</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-right">Promised Amount</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {promises?.data?.map((ptp) => (
              <tr key={ptp._id} className="border-b border-brand-border hover:bg-brand-appBg/50 transition-colors h-[56px]">
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-textPrimary">{ptp.customerName}</span>
                    <span className="text-[11px] text-brand-textSecondary font-medium">{ptp.customerEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-2 text-brand-textSecondary font-mono text-[11px]">{ptp.leakageEventId.substring(0, 8)}...</td>
                <td className="px-6 py-2 font-bold text-brand-textPrimary tabular-nums text-right">₹{ptp.promisedAmount.toLocaleString('en-IN')}</td>
                <td className="px-6 py-2 text-brand-textPrimary">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-textSecondary" />
                    {new Date(ptp.promisedDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-2">{getStatusBadge(ptp.status)}</td>
                <td className="px-6 py-2 text-right">
                  {ptp.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => fulfillPromise(ptp._id)}
                        className="p-1.5 border border-status-successBorder bg-status-successBg text-status-successText rounded hover:bg-status-successBg/80 transition-colors shadow-sm"
                        title="Mark Fulfilled"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => missPromise(ptp._id)}
                        className="p-1.5 border border-status-dangerBorder bg-status-dangerBg text-status-dangerText rounded hover:bg-status-dangerBg/80 transition-colors shadow-sm"
                        title="Mark Missed"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(!promises?.data || promises.data.length === 0) && (
              <tr>
                <td colSpan="6" className="text-center py-16 text-[13px] font-bold text-brand-textSecondary bg-white">
                  No Promise-to-Pay commitments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
