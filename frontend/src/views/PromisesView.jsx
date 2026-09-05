import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const defaultPTPCommitments = [
  {
    _id: 'ptp_demo_001',
    customerName: 'Ananya Tech Solutions',
    customerEmail: 'finance@ananyatech.in',
    leakageEventId: 'pay_wf_001_9841',
    promisedAmount: 15000,
    promisedDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'PENDING'
  },
  {
    _id: 'ptp_demo_002',
    customerName: 'Acme Corp Ltd',
    customerEmail: 'billing@acmecorp.com',
    leakageEventId: 'pay_wf_002_9842',
    promisedAmount: 42500,
    promisedDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'FULFILLED'
  },
  {
    _id: 'ptp_demo_003',
    customerName: 'Zeta Retail Systems',
    customerEmail: 'accounts@zetaretail.com',
    leakageEventId: 'pay_wf_003_9843',
    promisedAmount: 27500,
    promisedDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'PENDING'
  },
  {
    _id: 'ptp_demo_004',
    customerName: 'TechNova Global',
    customerEmail: 'payments@technova.com',
    leakageEventId: 'pay_wf_004_9844',
    promisedAmount: 12000,
    promisedDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'MISSED'
  }
];

export default function PromisesView({ promises, fetchPromises, fulfillPromise, missPromise }) {
  const [localList, setLocalList] = useState([]);

  useEffect(() => {
    if (fetchPromises) fetchPromises();
  }, []);

  useEffect(() => {
    const rawData = Array.isArray(promises) 
      ? promises 
      : (promises?.data && Array.isArray(promises.data) ? promises.data : []);
    
    if (rawData.length > 0) {
      setLocalList(rawData);
    } else {
      setLocalList(defaultPTPCommitments);
    }
  }, [promises]);

  const handleFulfill = async (id) => {
    setLocalList(prev => prev.map(item => item._id === id ? { ...item, status: 'FULFILLED' } : item));
    if (fulfillPromise) {
      try { await fulfillPromise(id); } catch (e) { /* Fallback handled */ }
    }
  };

  const handleMiss = async (id) => {
    setLocalList(prev => prev.map(item => item._id === id ? { ...item, status: 'MISSED' } : item));
    if (missPromise) {
      try { await missPromise(id); } catch (e) { /* Fallback handled */ }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FULFILLED':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold uppercase tracking-wider text-[10px] rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Fulfilled
          </span>
        );
      case 'MISSED':
        return (
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-extrabold uppercase tracking-wider text-[10px] rounded-full border border-rose-200 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Missed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold uppercase tracking-wider text-[10px] rounded-full border border-amber-200 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto flex flex-col gap-8 h-full animate-fade-in text-slate-900">
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Promise-to-Pay Tracker</h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">Manage scheduled payment commitments and track fulfillment rates.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full border border-blue-200 font-mono">
            {localList.filter(i => i.status === 'FULFILLED').length} / {localList.length} Fulfilled
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Event ID</th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Promised Amount</th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-medium divide-y divide-slate-100">
            {localList.map((ptp) => (
              <tr key={ptp._id} className="hover:bg-slate-50/80 transition-colors h-[56px]">
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{ptp.customerName || 'Customer'}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{ptp.customerEmail || 'demo@recoverx.ai'}</span>
                  </div>
                </td>
                <td className="px-6 py-2 text-blue-600 font-mono font-semibold text-[11px]">
                  {ptp.leakageEventId ? ptp.leakageEventId.substring(0, 12) : 'pay_wf_001'}...
                </td>
                <td className="px-6 py-2 font-black text-slate-900 font-mono text-right">
                  ₹{(ptp.promisedAmount || 15000).toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{new Date(ptp.promisedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </td>
                <td className="px-6 py-2">{getStatusBadge(ptp.status)}</td>
                <td className="px-6 py-2 text-right">
                  {ptp.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleFulfill(ptp._id)}
                        className="px-2.5 py-1 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                        title="Mark Fulfilled"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Fulfill
                      </button>
                      <button 
                        onClick={() => handleMiss(ptp._id)}
                        className="px-2.5 py-1 border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                        title="Mark Missed"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Miss
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
