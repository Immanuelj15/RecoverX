import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, AlertOctagon, ChevronRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function RevenueAtRiskTable({ items, activeItem, onSelect, isSimulating }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 bg-status-successBg text-status-successText rounded border border-status-successBorder uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Recovered
          </span>
        );
      case 'ESCALATED':
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 bg-status-dangerBg text-status-dangerText rounded border border-status-dangerBorder uppercase tracking-wider">
            <AlertOctagon className="w-3 h-3" /> Blocked
          </span>
        );
      case 'DETECTED':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 bg-status-warningBg text-status-warningText rounded border border-status-warningBorder uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" /> Approval Reqd
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 bg-brand-softBlue text-brand-primary rounded border border-brand-strongBorder uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Eligible
          </span>
        );
    }
  };

  const formatChannel = (ch) => ch.replace(/_/g, ' ').toLowerCase();

  return (
    <div className="fintech-card overflow-hidden h-full flex flex-col group">
      <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-white">
        <div>
          <h2 className="font-bold text-brand-textPrimary text-lg">Priority recovery opportunities</h2>
          <p className="text-xs text-brand-textSecondary mt-1">Live monitoring of failed payments & leaks.</p>
        </div>
        <div className="flex items-center gap-2">
          {isSimulating && (
            <span className="text-brand-primary text-xs flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Scanning...
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-0">
        <table className="w-full text-left text-[13px] whitespace-nowrap bg-white">
          <thead className="text-[11px] text-brand-textSecondary border-b border-brand-border sticky top-0 bg-white z-10">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Customer / Merchant</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Problem</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right">Amount at Risk</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={cn(
                  "cursor-pointer transition-colors border-b border-brand-border last:border-0 h-[56px]",
                  activeItem?.id === item.id 
                    ? "bg-brand-softBlue" 
                    : "hover:bg-brand-appBg"
                )}
              >
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-textPrimary">{item.customerName}</span>
                    <span className="text-xs text-brand-textSecondary capitalize mt-0.5">
                      {formatChannel(item.channel)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-brand-textPrimary">Payment failed</span>
                    <span className="text-brand-textSecondary text-xs mt-0.5 max-w-[150px] truncate" title={item.declineReasonCode}>
                      {item.declineReasonCode}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-2 text-right font-bold text-brand-textPrimary tabular-nums">
                  ₹{item.riskAmount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-2">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-2 text-right">
                  <div className="flex items-center justify-end text-brand-primary font-bold text-xs gap-1 group-hover:text-brand-primaryHover transition-colors">
                    View Case
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-16 px-4 bg-white">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <ShieldCheck className="w-12 h-12 text-brand-border mb-4" />
                    <p className="text-brand-textPrimary font-bold mb-1">RecoverX is monitoring your payment flow.</p>
                    <p className="text-brand-textSecondary text-sm">New revenue risks will appear here automatically.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {items.length > 0 && (
        <div className="px-6 py-4 border-t border-brand-border bg-brand-appBg/50 flex items-center justify-between">
          <div className="text-xs text-brand-textSecondary">
            Showing <span className="font-bold text-brand-textPrimary">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-brand-textPrimary">{Math.min(currentPage * itemsPerPage, items.length)}</span> of <span className="font-bold text-brand-textPrimary">{items.length}</span> cases
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-brand-border bg-white text-brand-textSecondary hover:text-brand-primary hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-brand-textPrimary px-2 tabular-nums">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-brand-border bg-white text-brand-textSecondary hover:text-brand-primary hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
