import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Code, CheckCircle2, ChevronRight } from 'lucide-react';

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
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] rounded-md">ACTION_EXECUTED</span>;
      case 'POLICY_BLOCKED':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-md">POLICY_BLOCKED</span>;
      case 'ESCALATED_FOR_MANUAL_REVIEW':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#EEF4FF] text-[#2D6CDF] border border-[#C7D7FE] rounded-md">ESCALATED</span>;
      case 'RECOVERY_STOPPED':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#F2F4F7] text-[#475467] border border-[#E4E7EC] rounded-md">RECOVERY_STOPPED</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#EEF2FF] text-[#635BFF] border border-[#C7D2FE] rounded-md">{eventType}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-xl font-bold text-[#111827]">
              Compliance Audit Trail & Deep Inspection
            </h2>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Immutable, step-by-step event log for regulatory compliance and automated recovery decision tracing
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Payment ID..."
              value={filters.payment_id}
              onChange={(e) => handleFilterChange('payment_id', e.target.value)}
              className="bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg pl-9 pr-4 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D6CDF] w-56"
            />
          </div>

          <select
            value={filters.event_type}
            onChange={(e) => handleFilterChange('event_type', e.target.value)}
            className="bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
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
      <div className="bg-white border border-[#E4E7EC] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E4E7EC] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">State Transition</th>
                <th className="py-3.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[#667085]">
                    Loading audit trail records...
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[#667085]">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log, idx) => (
                  <React.Fragment key={log._id || idx}>
                    <tr className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#667085]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#2D6CDF]">
                        {log.payment_id}
                      </td>
                      <td className="py-3.5 px-4">
                        {getEventBadge(log.event_type)}
                      </td>
                      <td className="py-3.5 px-4 text-[#344054]">
                        <span className="px-2 py-0.5 bg-[#F2F4F7] rounded border border-[#E4E7EC] font-mono text-[11px]">
                          {log.performed_by || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#344054]">
                        <span className="text-[#667085]">{log.previous_state || 'START'}</span>
                        <span className="mx-1 text-[#2D6CDF]">→</span>
                        <span className="text-[#2D6CDF] font-bold">{log.new_state}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === log._id ? null : log._id)}
                          className="px-2.5 py-1 bg-[#F7F9FC] hover:bg-[#EAECF0] border border-[#E4E7EC] rounded-lg text-[#344054] text-[11px] font-semibold flex items-center space-x-1 ml-auto"
                        >
                          <Code className="w-3 h-3 mr-1" />
                          <span>{expandedLogId === log._id ? 'Hide Payload' : 'View Payload'}</span>
                        </button>
                      </td>
                    </tr>

                    {/* JSON Payload Inspection Drawer */}
                    {expandedLogId === log._id && (
                      <tr className="bg-[#F8FAFC] border-b border-[#E4E7EC]">
                        <td colSpan="6" className="p-4">
                          <div className="bg-[#0C2651] text-white rounded-xl p-4 font-mono text-xs space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pb-2 border-b border-[#1C4991]">
                              <span>Event ID: {log._id}</span>
                              <span>Correlation ID: {log.details?.correlation_id || 'N/A'}</span>
                            </div>
                            <pre className="text-[#A5B4FC] overflow-x-auto text-[11px]">
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
        <div className="p-4 border-t border-[#E4E7EC] flex items-center justify-between text-xs text-[#667085] bg-[#F7F9FC]">
          <div>
            Showing page <span className="font-bold text-[#111827]">{page}</span> of{' '}
            <span className="font-bold text-[#111827]">{totalPages || 1}</span> ({total || 0} total records)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-white border border-[#E4E7EC] rounded-lg text-[#344054] hover:bg-[#F7F9FC] disabled:opacity-40 font-semibold"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-white border border-[#E4E7EC] rounded-lg text-[#344054] hover:bg-[#F7F9FC] disabled:opacity-40 font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
