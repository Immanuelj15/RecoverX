import React from 'react';
import { AlertCircle, Clock, CheckCircle2, AlertOctagon, ChevronRight, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function RevenueAtRiskTable({ items, activeItem, onSelect, isSimulating }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-fintech-successBg text-fintech-success rounded-md border border-fintech-successBorder">
            <CheckCircle2 className="w-3 h-3" /> Recovered
          </span>
        );
      case 'ESCALATED':
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-fintech-dangerBg text-fintech-danger rounded-md border border-fintech-dangerBorder">
            <AlertOctagon className="w-3 h-3" /> Escalated
          </span>
        );
      case 'DETECTED':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-fintech-warningBg text-fintech-warning rounded-md border border-fintech-warningBorder">
            <AlertCircle className="w-3 h-3" /> Attention
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-navy-600 text-brand-textSecondary rounded-md border border-brand-border">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
    }
  };

  const formatChannel = (ch) => ch.replace(/_/g, ' ').toLowerCase();

  return (
    <div className="fintech-card overflow-hidden h-full flex flex-col group">
      <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-lg">Revenue at Risk</h2>
          <p className="text-xs text-brand-textSecondary mt-1">Live monitoring of failed payments & leaks.</p>
        </div>
        <div className="flex items-center gap-2">
          {isSimulating && (
            <span className="text-brand-textSecondary text-xs flex items-center gap-2 mr-2">
              <span className="w-2 h-2 rounded-full bg-fintech-warning animate-pulse" />
              Scanning...
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-0">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-brand-textSecondary border-b border-brand-border sticky top-0 bg-navy-800 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer / Merchant</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Problem</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Amount at Risk</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={cn(
                  "cursor-pointer transition-all border-b border-brand-border/30 last:border-0 hover:bg-navy-700/60",
                  activeItem?.id === item.id ? "bg-navy-700 border-l-4 border-l-brand-blue" : "border-l-4 border-l-transparent"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{item.customerName}</span>
                    <span className="text-xs mt-0.5 text-brand-textSecondary capitalize">
                      {formatChannel(item.channel)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-brand-textPrimary">Payment failed</span>
                    <span className="text-brand-textSecondary text-xs mt-0.5 max-w-[150px] truncate" title={item.declineReasonCode}>
                      {item.declineReasonCode}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-white tabular-nums">
                  ₹{item.riskAmount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end text-brand-blue font-medium text-xs gap-1 group-hover:text-brand-cyan transition-colors">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-16 px-4">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <ShieldCheck className="w-12 h-12 text-brand-border mb-4" />
                    <p className="text-white font-medium mb-1">RecoverX is monitoring your payment flow.</p>
                    <p className="text-brand-textSecondary text-sm">New revenue risks will appear here automatically.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
