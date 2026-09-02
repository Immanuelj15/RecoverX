import React from 'react';
import AuditTrail from '../components/AuditTrail';

export default function AuditTrailView({ auditLogs }) {
  return (
    <div className="p-8 max-w-[1200px] mx-auto flex flex-col gap-8 h-full animate-fade-in">
      <div className="border-b border-brand-border pb-6">
        <h1 className="text-2xl font-extrabold text-brand-textPrimary tracking-tight">Audit Trail</h1>
        <p className="text-sm font-medium text-brand-textSecondary mt-1">Immutable history of AI reasoning, policy checks, and recovery executions.</p>
      </div>

      <section className="flex-1 bg-white fintech-card overflow-hidden p-6">
        <AuditTrail logs={auditLogs} />
      </section>
    </div>
  );
}
