import React from 'react';
import { PlayCircle, AlertCircle, Clock, ServerCrash, CreditCard, UserX, FileText, DownloadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function LiveBatchTable({ items, activeItem, onSelect, onTrigger, onSimulate, isSimulating }) {
  const getIcon = (channel) => {
    switch (channel) {
      case 'FAILED_SUBSCRIPTION': return <CreditCard className="w-4 h-4 text-brand-primary" />;
      case 'OVERDUE_INVOICE': return <FileText className="w-4 h-4 text-status-successText" />;
      case 'CHECKOUT_ABANDONED': return <UserX className="w-4 h-4 text-status-warningText" />;
      case 'PAYMENT_DEGRADATION': return <ServerCrash className="w-4 h-4 text-status-dangerText" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatChannel = (ch) => ch.replace(/_/g, ' ');

  return (
    <div className="fintech-card overflow-hidden h-full flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-appBg">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-textSecondary" />
          <h2 className="font-extrabold text-brand-textPrimary text-[13px]">Live Leakage Detector</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white hover:bg-brand-primaryHover rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
          >
            <DownloadCloud className={cn("w-3.5 h-3.5", isSimulating && "animate-bounce")} />
            Simulate Batch Ingestion
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="text-[11px] font-bold uppercase text-brand-textSecondary border-b border-brand-border sticky top-0 bg-brand-appBg z-10">
            <tr>
              <th className="px-4 py-3 font-bold">Customer / Channel</th>
              <th className="px-4 py-3 font-bold">Decline Reason</th>
              <th className="px-4 py-3 font-bold text-right">Risk Amount</th>
              <th className="px-4 py-3 text-center font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={cn(
                  "cursor-pointer transition-all border-b border-brand-border/60 last:border-0 hover:bg-brand-appBg/60",
                  activeItem?.id === item.id ? "bg-brand-softBlue border-l-4 border-l-brand-primary shadow-sm" : "border-l-4 border-l-transparent"
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-textPrimary">{item.customerName}</span>
                    <span className="text-[11px] font-medium flex items-center gap-1 mt-0.5 text-brand-textSecondary">
                      {getIcon(item.channel)} {formatChannel(item.channel)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.status === 'RECOVERED' ? 'bg-emerald-500' : 'bg-rose-500')}></div>
                    <span className="text-brand-textSecondary truncate max-w-[150px] font-mono text-[11px] font-bold">
                      {item.declineReasonCode}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-brand-textPrimary tabular-nums">
                  ₹{item.riskAmount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrigger(item);
                    }}
                    disabled={item.status === 'RECOVERED' || item.status === 'ESCALATED'}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      (item.status === 'RECOVERED' || item.status === 'ESCALATED') ? "opacity-40 cursor-not-allowed bg-brand-appBg text-brand-textSecondary" :
                      activeItem?.id === item.id 
                        ? "bg-brand-primary text-white hover:bg-brand-primaryHover shadow-sm" 
                        : "bg-brand-appBg text-brand-textSecondary hover:text-brand-primary hover:bg-brand-softBlue"
                    )}
                  >
                    <PlayCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-brand-textSecondary italic font-medium">
                  No leakage events detected. Click 'Simulate Batch Ingestion' to load data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
