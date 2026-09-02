import React, { useEffect, useRef } from 'react';
import { FileText, CheckCircle2, ShieldCheck, Activity, Zap, PlayCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Convert technical tags to human-readable text
const getHumanReadableLog = (tag) => {
  if (tag.includes('SYSTEM_DETECT')) return { text: 'Payment detected', icon: Activity, color: 'text-brand-textPrimary' };
  if (tag.includes('RCA_')) return { text: 'AI analysis completed', icon: Zap, color: 'text-brand-primary' };
  if (tag.includes('STOPPING_RULE')) return { text: 'Policy approved retry', icon: ShieldCheck, color: 'text-brand-primary' };
  if (tag.includes('AGENT')) return { text: 'Recovery executed', icon: PlayCircle, color: 'text-brand-primary' };
  if (tag.includes('RECOVERED') || tag.includes('RESOLVED')) return { text: 'Payment recovered', icon: CheckCircle2, color: 'text-status-successText' };
  if (tag.includes('ESCALATED') || tag.includes('HALT')) return { text: 'Workflow escalated', icon: ShieldCheck, color: 'text-status-dangerText' };
  
  return { text: tag, icon: FileText, color: 'text-brand-textSecondary' };
};

export default function AuditTrail({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fintech-card bg-white border border-brand-border flex flex-col overflow-hidden h-[400px]">
      <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-brand-appBg">
        <div>
          <h2 className="text-base font-extrabold text-brand-textPrimary tracking-tight">Audit Trail</h2>
          <p className="text-brand-textSecondary text-[11px] font-medium mt-0.5">Immutable system event timeline.</p>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
        {logs.length === 0 ? (
          <div className="text-brand-textSecondary font-medium italic text-center py-10 flex flex-col items-center">
            <FileText className="w-8 h-8 text-brand-border mb-3" />
            Waiting for recovery events...
          </div>
        ) : (
          logs.map((log) => {
            const uiConf = getHumanReadableLog(log.actor || log.tag || 'UNKNOWN');
            const Icon = uiConf.icon;
            return (
              <div key={log.id || Math.random()} className="flex items-start gap-4 animate-fade-in group">
                
                <div className="flex flex-col items-center">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center bg-brand-appBg border border-brand-border", uiConf.color)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-px h-full bg-brand-border mt-2 group-last:hidden" />
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <span className={cn("font-bold text-[13px]", uiConf.color)}>
                      ✓ {uiConf.text}
                    </span>
                    <span className="text-brand-textSecondary font-medium text-[11px] tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="mt-2 p-3 bg-brand-appBg border border-brand-border rounded-lg text-[11px] font-mono text-brand-textSecondary">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-brand-textPrimary font-bold">Actor:</span> 
                      <span className="font-bold text-brand-primary">{log.actor || log.tag}</span>
                    </div>
                    <div className="flex justify-between text-brand-textSecondary">
                      <span className="text-brand-textPrimary font-bold">Message:</span> 
                      <span className="truncate max-w-[200px] ml-2 font-medium" title={log.logMessage || log.message}>{log.logMessage || log.message}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
