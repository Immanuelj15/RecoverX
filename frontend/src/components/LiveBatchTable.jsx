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
      case 'FAILED_SUBSCRIPTION': return <CreditCard className="w-4 h-4 text-brand-ai" />;
      case 'OVERDUE_INVOICE': return <FileText className="w-4 h-4 text-fintech-success" />;
      case 'CHECKOUT_ABANDONED': return <UserX className="w-4 h-4 text-fintech-warning" />;
      case 'PAYMENT_DEGRADATION': return <ServerCrash className="w-4 h-4 text-fintech-danger" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSourceStyle = (channel) => {
    if (channel === 'FAILED_SUBSCRIPTION') return 'bg-[#635BFF]/10 text-[#635BFF] border-[#635BFF]/20';
    if (channel === 'CHECKOUT_ABANDONED') return 'bg-brand-blue/10 text-brand-cyan border-brand-blue/20';
    if (channel === 'OVERDUE_INVOICE') return 'bg-[#2CA01C]/10 text-[#2CA01C] border-[#2CA01C]/20';
    return 'bg-fintech-dangerBg text-fintech-danger border-fintech-dangerBorder';
  };

  const formatChannel = (ch) => ch.replace('_', ' ');

  return (
    <div className="fintech-card overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-navy-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-textSecondary" />
          <h2 className="font-semibold text-brand-textPrimary">Live Leakage Detector</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-blue/20 text-brand-cyan hover:bg-brand-blue/30 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 border border-brand-blue/40"
          >
            <DownloadCloud className={cn("w-3.5 h-3.5", isSimulating && "animate-bounce")} />
            Simulate Batch Ingestion
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase text-brand-textSecondary border-b border-brand-border/50 sticky top-0 bg-brand-surface z-10">
            <tr>
              <th className="px-4 py-3 font-semibold">Customer / Channel</th>
              <th className="px-4 py-3 font-semibold">Decline Reason</th>
              <th className="px-4 py-3 font-semibold text-right">Risk Amount</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={cn(
                  "cursor-pointer transition-all border-b border-brand-border/30 last:border-0 hover:bg-navy-700/50",
                  activeItem?.id === item.id ? "bg-navy-700/80 border-l-4 border-l-brand-cyan shadow-[inset_4px_0_0_0_#00F2FE]" : "border-l-4 border-l-transparent"
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-brand-textPrimary">{item.customerName}</span>
                    <span className="text-xs flex items-center gap-1 mt-0.5 text-brand-textSecondary">
                      {getIcon(item.channel)} {formatChannel(item.channel)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.status === 'RECOVERED' ? 'bg-fintech-success' : 'bg-fintech-danger')}></div>
                    <span className="text-brand-textSecondary truncate max-w-[150px] font-mono text-xs">
                      {item.declineReasonCode}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-brand-textPrimary tabular-nums">
                  ${item.riskAmount.toLocaleString('en-US')}
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
                      (item.status === 'RECOVERED' || item.status === 'ESCALATED') ? "opacity-50 cursor-not-allowed bg-navy-600 text-brand-textSecondary" :
                      activeItem?.id === item.id 
                        ? "bg-brand-blue text-white shadow-glow hover:bg-brand-blueHover" 
                        : "bg-navy-600 text-brand-textSecondary hover:text-brand-cyan hover:bg-navy-700"
                    )}
                  >
                    <PlayCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-brand-textSecondary italic">
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
