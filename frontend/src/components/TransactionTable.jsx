import React from 'react';
import { Eye, Play, CheckCircle, ShieldAlert, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function TransactionTable({
  transactions = [],
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSelectTransaction,
  onTriggerRecovery,
  filterState,
  setFilterState,
  filterRisk,
  setFilterRisk,
  isLoading
}) {
  const formatINR = (amountInr) => {
    if (amountInr === undefined || amountInr === null) return '₹0';
    return `₹${Number(amountInr).toLocaleString('en-IN')}`;
  };

  const getRiskBadge = (riskBand, probability) => {
    const probPct = probability !== undefined && probability !== null ? Math.round(probability * 100) : null;
    const label = probPct !== null ? `${probPct}%` : (riskBand || 'UNKNOWN');

    if (riskBand === 'HIGH' || (probPct !== null && probPct >= 70)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
          {label} HIGH
        </span>
      );
    }
    if (riskBand === 'MEDIUM' || (probPct !== null && probPct >= 40)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A]">
          {label} MED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
        {label} LOW
      </span>
    );
  };

  const getStateBadge = (state) => {
    switch (state) {
      case 'RECOVERY_SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
            <CheckCircle className="w-3 h-3" /> Recovered
          </span>
        );
      case 'STOPPED':
      case 'RECOVERY_FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <ShieldAlert className="w-3 h-3" /> Stopped
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#2D6CDF] border border-[#C7D7FE]">
            Escalated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F2F4F7] text-[#344054] border border-[#E4E7EC]">
            <Clock className="w-3 h-3" /> {state || 'DETECTED'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">Revenue Recovery Control Table</h3>
          <p className="text-xs text-[#667085]">
            Monitor failed transactions, ML recovery scores, AI recommendations, and policy controls
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#667085]" />
            <select
              value={filterState || ''}
              onChange={(e) => setFilterState && setFilterState(e.target.value)}
              className="text-xs font-medium bg-[#F7F9FC] border border-[#E4E7EC] text-[#344054] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option value="">All States</option>
              <option value="DETECTED">Detected</option>
              <option value="ANALYZING">Analyzing</option>
              <option value="ACTION_APPROVED">Approved</option>
              <option value="RECOVERY_SUCCESS">Recovered</option>
              <option value="STOPPED">Stopped</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          <select
            value={filterRisk || ''}
            onChange={(e) => setFilterRisk && setFilterRisk(e.target.value)}
            className="text-xs font-medium bg-[#F7F9FC] border border-[#E4E7EC] text-[#344054] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
          >
            <option value="">All Risk Bands</option>
            <option value="HIGH">High Prob (&gt;70%)</option>
            <option value="MEDIUM">Med Prob (40-70%)</option>
            <option value="LOW">Low Prob (&lt;40%)</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F9FC] border-b border-[#E4E7EC] text-[#667085] uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Payment ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Failure Reason</th>
              <th className="py-3.5 px-4">ML Recovery Prob</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">State</th>
              <th className="py-3.5 text-right px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC] text-[#111827]">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="8" className="py-4 px-4 bg-[#FFFFFF]">
                    <div className="h-4 bg-[#F2F4F7] rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-[#667085]">
                  <p className="text-sm font-medium">No failed payment records found.</p>
                  <p className="text-xs text-[#98A2B3] mt-1">
                    Once payment failures occur or webhooks ingest data, recovery opportunities will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.payment_id} className="hover:bg-[#F8FAFC] transition-colors">
                  {/* Payment ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-[#2D6CDF]">
                    {t.payment_id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 font-medium text-[#344054]">
                    {t.customer_id}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-bold text-[#111827] tabular-nums">
                    {formatINR(t.amount_inr || (t.amount_paise ? t.amount_paise / 100 : 0))}
                  </td>

                  {/* Failure Reason */}
                  <td className="py-3.5 px-4 text-[#475467]">
                    <span className="font-mono text-[11px] bg-[#F2F4F7] text-[#344054] px-2 py-0.5 rounded border border-[#E4E7EC]">
                      {t.failure_reason || t.failure?.reason || 'unknown'}
                    </span>
                  </td>

                  {/* ML Recovery Prob */}
                  <td className="py-3.5 px-4">
                    {getRiskBadge(t.risk_band, t.recovery_probability)}
                  </td>

                  {/* Recommended Action */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-xs font-semibold text-[#635BFF] bg-[#EEF2FF] px-2.5 py-0.5 rounded-md border border-[#C7D2FE]">
                      {t.recommended_action || t.executed_action || 'SMART_RETRY'}
                    </span>
                  </td>

                  {/* Recovery State */}
                  <td className="py-3.5 px-4">
                    {getStateBadge(t.recovery_state || 'DETECTED')}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectTransaction && onSelectTransaction(t)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#344054] hover:text-[#111827] bg-[#F7F9FC] hover:bg-[#EAECF0] border border-[#E4E7EC] rounded-lg transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>

                      {t.recovery_state !== 'RECOVERY_SUCCESS' && (
                        <button
                          onClick={() => onTriggerRecovery && onTriggerRecovery(t.payment_id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#2D6CDF] hover:bg-[#1B54BD] rounded-lg shadow-sm transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Trigger</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#E4E7EC] flex items-center justify-between bg-[#F7F9FC]">
        <div className="text-xs text-[#667085]">
          Showing <span className="font-semibold text-[#111827]">{(page - 1) * 20 + (transactions.length ? 1 : 0)}</span> to{' '}
          <span className="font-semibold text-[#111827]">{(page - 1) * 20 + transactions.length}</span> of{' '}
          <span className="font-semibold text-[#111827]">{total}</span> records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#E4E7EC] rounded-lg hover:bg-[#F7F9FC] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-semibold text-[#111827] px-2">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#E4E7EC] rounded-lg hover:bg-[#F7F9FC] disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
