import React, { useState } from 'react';
import { Search, Filter, Play, Clock, ArrowRight, CheckCircle, AlertOctagon, PauseCircle, ShieldAlert } from 'lucide-react';

export default function TransactionTable({
  transactions,
  total,
  page,
  totalPages,
  onPageChange,
  filters,
  onFilterChange,
  onTriggerRecovery,
  onViewTimeline,
  isLoading
}) {
  const [triggeringId, setTriggeringId] = useState(null);

  const handleTrigger = async (paymentId) => {
    setTriggeringId(paymentId);
    await onTriggerRecovery(paymentId);
    setTriggeringId(null);
  };

  const getRiskBadge = (band) => {
    switch (band) {
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">LOW</span>;
    }
  };

  const getStateBadge = (state) => {
    switch (state) {
      case 'RECOVERY_SUCCESS':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center space-x-1 w-fit"><CheckCircle className="w-3 h-3 mr-1" />RECOVERED</span>;
      case 'RECOVERY_FAILED':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg flex items-center space-x-1 w-fit"><AlertOctagon className="w-3 h-3 mr-1" />FAILED</span>;
      case 'STOPPED':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded-lg flex items-center space-x-1 w-fit"><PauseCircle className="w-3 h-3 mr-1" />STOPPED</span>;
      case 'ESCALATED':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-lg flex items-center space-x-1 w-fit"><ShieldAlert className="w-3 h-3 mr-1" />ESCALATED</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-lg flex items-center space-x-1 w-fit"><Clock className="w-3 h-3 mr-1 animate-pulse" />{state || 'DETECTED'}</span>;
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 mb-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-100 tracking-wide">
            Revenue Recovery Control Table
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor failed transactions, predictive probability, and manual intervention controls
          </p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Payment / Customer ID..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-56 placeholder-slate-500"
            />
          </div>

          {/* State Filter */}
          <select
            value={filters.state}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All States</option>
            <option value="DETECTED">DETECTED</option>
            <option value="ANALYZING">ANALYZING</option>
            <option value="ACTION_APPROVED">ACTION_APPROVED</option>
            <option value="RECOVERY_SUCCESS">RECOVERY_SUCCESS</option>
            <option value="RECOVERY_FAILED">RECOVERY_FAILED</option>
            <option value="STOPPED">STOPPED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>

          {/* Risk Band Filter */}
          <select
            value={filters.risk_band}
            onChange={(e) => onFilterChange('risk_band', e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Risk Bands</option>
            <option value="HIGH">HIGH Risk</option>
            <option value="MEDIUM">MEDIUM Risk</option>
            <option value="LOW">LOW Risk</option>
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Payment ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Failure Reason</th>
              <th className="py-3.5 px-4">ML Recovery %</th>
              <th className="py-3.5 px-4">Risk Band</th>
              <th className="py-3.5 px-4">Recovery State</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-slate-500">
                  Loading recovery data...
                </td>
              </tr>
            ) : transactions?.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-slate-500">
                  No failed payment records found.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.payment_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                    {txn.payment_id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {txn.customer_id}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                    ₹{txn.amount_inr?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 capitalize">
                    {txn.failure_reason?.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {txn.recovery_probability ? (
                      <span className="font-bold text-emerald-400">
                        {Math.round(txn.recovery_probability * 100)}%
                      </span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {getRiskBadge(txn.risk_band)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStateBadge(txn.recovery_state)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleTrigger(txn.payment_id)}
                      disabled={triggeringId === txn.payment_id}
                      className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg font-semibold text-[11px] transition-all disabled:opacity-50"
                    >
                      {triggeringId === txn.payment_id ? 'Running...' : 'Trigger AI'}
                    </button>
                    <button
                      onClick={() => onViewTimeline(txn.payment_id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-semibold text-[11px] transition-all"
                    >
                      Timeline
                    </button>
                  </td>
                </tr>
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
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
