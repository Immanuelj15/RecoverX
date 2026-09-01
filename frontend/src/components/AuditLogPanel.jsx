import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, CheckCircle2, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getTagStyle = (tag) => {
  if (tag.includes('SYSTEM_DETECT')) return 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20';
  if (tag.includes('RCA_')) return 'text-brand-ai bg-brand-ai/10 border-brand-ai/20';
  if (tag.includes('STOPPING_RULE')) return 'text-fintech-warning bg-fintech-warningBg border-fintech-warningBorder';
  if (tag.includes('AGENT') || tag.includes('RECOVERED')) return 'text-fintech-success bg-fintech-successBg border-fintech-successBorder';
  if (tag.includes('ESCALATED') || tag.includes('HALT')) return 'text-fintech-danger bg-fintech-dangerBg border-fintech-dangerBorder';
  return 'text-brand-textSecondary border-brand-border bg-navy-700';
};

const getIcon = (tag) => {
  if (tag.includes('SYSTEM_DETECT')) return <Terminal className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />;
  if (tag.includes('RCA_')) return <Zap className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />;
  if (tag.includes('STOPPING_RULE')) return <Shield className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />;
  if (tag.includes('AGENT') || tag.includes('RECOVERED')) return <CheckCircle2 className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />;
  return null;
};

export default function AuditLogPanel({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fintech-card bg-[#060D1A] border-navy-600 flex flex-col overflow-hidden h-[300px]">
      <div className="px-4 py-3 border-b border-navy-700 flex justify-between items-center bg-[#091224]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-textSecondary" />
          <h2 className="text-sm font-semibold text-brand-textPrimary font-mono">Immutable Audit Log</h2>
        </div>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-fintech-danger"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-fintech-warning"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-fintech-success"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 terminal-text text-sm">
        {logs.length === 0 ? (
          <div className="text-brand-textSecondary italic text-center mt-10">Awaiting system events...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id || Math.random()} className="flex items-start gap-3 animate-fade-in">
              <span className="text-brand-textSecondary flex-shrink-0 text-xs mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div className="flex-1">
                <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase rounded border mr-2 whitespace-nowrap", getTagStyle(log.actor || log.tag || 'UNKNOWN'))}>
                  {getIcon(log.actor || log.tag || 'UNKNOWN')}
                  {log.actor || log.tag || 'UNKNOWN'}
                </span>
                <span className="text-brand-textPrimary break-words">
                  {log.logMessage || log.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
