import React from 'react';
import { FileText, ShieldCheck, Zap, User, Clock, AlertOctagon } from 'lucide-react';

const getActorIcon = (actor) => {
  switch(actor) {
    case 'RCA_ENGINE':
    case 'AI_AGENT':
      return <Zap className="w-4 h-4 text-brand-primary" />;
    case 'STOPPING_RULE_CHECK':
      return <ShieldCheck className="w-4 h-4 text-status-successText" />;
    case 'HUMAN_OPERATOR':
      return <User className="w-4 h-4 text-brand-primary" />;
    case 'SYSTEM':
    default:
      return <FileText className="w-4 h-4 text-brand-textSecondary" />;
  }
};

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

export default function CaseAuditTab({ auditLogs = [] }) {
  
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="fintech-card p-12 flex flex-col items-center justify-center text-center animate-fade-in bg-white">
        <Clock className="w-12 h-12 text-brand-border mb-4" />
        <h3 className="text-lg font-bold text-brand-textPrimary mb-2">No audit events yet</h3>
        <p className="text-sm text-brand-textSecondary max-w-sm font-medium">
          Audit logs will appear here once the workflow starts.
        </p>
      </div>
    );
  }

  return (
    <div className="fintech-card overflow-hidden animate-fade-in bg-white">
      <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
        <h3 className="font-bold text-brand-textPrimary text-[13px]">Immutable Audit Trail</h3>
        <button className="text-[13px] font-bold text-brand-primary hover:text-brand-primaryHover transition-colors">
          Export Log
        </button>
      </div>
      
      <div className="divide-y divide-brand-border">
        {auditLogs.map((log) => (
          <div key={log._id} className="p-6 hover:bg-brand-appBg/50 transition-colors flex gap-6">
            <div className="w-32 flex-shrink-0 text-[11px] font-medium text-brand-textSecondary tabular-nums pt-1">
              {formatDate(log.createdAt)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getActorIcon(log.actor)}
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-textPrimary">
                  {log.actor.replace(/_/g, ' ')}
                </span>
                
                {log.reasonCode === 'MAX_RETRIES_EXCEEDED' && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-status-dangerBg border border-status-dangerBorder text-status-dangerText text-[10px] uppercase font-bold">
                    Blocked
                  </span>
                )}
                
                {log.actor === 'STOPPING_RULE_CHECK' && !log.reasonCode && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-status-successBg border border-status-successBorder text-status-successText text-[10px] uppercase font-bold">
                    Passed
                  </span>
                )}
              </div>
              
              <div className="text-[13px] font-medium text-brand-textSecondary mt-2">
                {log.logMessage}
              </div>
              
              {log.payload && Object.keys(log.payload).length > 0 && (
                <div className="mt-3 bg-brand-appBg border border-brand-border rounded p-3 overflow-x-auto">
                  <pre className="text-[11px] text-brand-textSecondary font-mono leading-relaxed">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="text-[11px] text-brand-textSecondary font-mono opacity-50 flex-shrink-0 pt-1">
              {log._id.slice(-6)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
