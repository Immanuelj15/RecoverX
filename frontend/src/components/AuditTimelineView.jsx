import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Clock, ChevronRight, Code, CheckCircle2, AlertOctagon, ShieldAlert, FileText } from 'lucide-react';

export default function AuditTimelineView() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const [filters, setFilters] = useState({
    event_type: '',
    payment_id: ''
  });

  const fetchLogs = async (currentPage, currentFilters) => {
    setIsLoading(true);
    const query = new URLSearchParams({
      page: currentPage,
      limit: 20,
      ...(currentFilters.event_type && { event_type: currentFilters.event_type }),
      ...(currentFilters.payment_id && { payment_id: currentFilters.payment_id })
    });

    try {
      const res = await fetch(`/api/v1/audit-logs?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setAuditLogs(json.data || []);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, filters);
  }, [page]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    fetchLogs(1, newFilters);
  };

  const getEventBadge = (eventType) => {
    switch (eventType) {
      case 'ACTION_EXECUTED':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md">ACTION_EXECUTED</span>;
      case 'POLICY_BLOCKED':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-md">POLICY_BLOCKED</span>;
      case 'ESCALATED_FOR_MANUAL_REVIEW':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-md">ESCALATED</span>;
      case 'RECOVERY_STOPPED':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded-md">RECOVERY_STOPPED</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-md">{eventType}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Description */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-wide">
              Compliance Audit Trail & Deep Inspection
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable, step-by-step event log for regulatory compliance and automated recovery decision tracing
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Payment ID Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Payment ID..."
              value={filters.payment_id}
              onChange={(e) => handleFilterChange('payment_id', e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-56 placeholder-slate-500"
            />
          </div>

          {/* Event Type Filter */}
          <select
            value={filters.event_type}
            onChange={(e) => handleFilterChange('event_type', e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Event Types</option>
            <option value="ACTION_EXECUTED">ACTION_EXECUTED</option>
            <option value="POLICY_BLOCKED">POLICY_BLOCKED</option>
            <option value="ESCALATED_FOR_MANUAL_REVIEW">ESCALATED</option>
            <option value="RECOVERY_STOPPED">RECOVERY_STOPPED</option>
            <option value="DETECTED">DETECTED</option>
          </select>

        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">State Transition</th>
                <th className="py-3.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    Loading audit trail records...
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log, idx) => (
                  <React.Fragment key={log._id || idx}>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                        {log.payment_id}
                      </td>
                      <td className="py-3.5 px-4">
                        {getEventBadge(log.event_type)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px]">
                          {log.performed_by || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <span className="text-slate-500">{log.previous_state || 'START'}</span>
                        <span className="mx-1 text-blue-500">→</span>
                        <span className="text-blue-400 font-bold">{log.new_state}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === log._id ? null : log._id)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-[11px] font-semibold flex items-center space-x-1 ml-auto"
                        >
                          <Code className="w-3 h-3 mr-1" />
                          <span>{expandedLogId === log._id ? 'Hide Payload' : 'View Payload'}</span>
                        </button>
                      </td>
                    </tr>

                    {/* JSON Payload Inspection Drawer */}
                    {expandedLogId === log._id && (
                      <tr className="bg-slate-950/60 border-b border-slate-800">
                        <td colSpan="6" className="p-4">
                          <div className="bg-slate-950 rounded-xl border border-slate-900 p-4 font-mono text-xs text-slate-300 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-900">
                              <span>Event ID: {log._id}</span>
                              <span>Correlation ID: {log.details?.correlation_id || 'N/A'}</span>
                            </div>
                            <pre className="text-emerald-400 overflow-x-auto text-[11px]">
                              {JSON.stringify(log.details || log, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <div>
            Showing page <span className="font-bold text-slate-200">{page}</span> of{' '}
            <span className="font-bold text-slate-200">{totalPages || 1}</span> ({total || 0} total records)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
