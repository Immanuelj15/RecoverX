import React from 'react';
import { Search, Calendar, Bell, ChevronDown, Activity } from 'lucide-react';

export default function TopBar({ activeItem, activeTab }) {
  const getBreadcrumb = () => {
    if (activeItem) {
      return `Recovery Queue / ${activeItem.id.split('-')[0]}`;
    }
    const titles = {
      overview: 'Revenue Recovery Overview',
      cases: 'Recovery Queue',
      batch: 'Run Recovery Batch',
      promises: 'Promises to Pay',
      analytics: 'Recovery Analytics',
      audit: 'Audit Trail',
      settings: 'Recovery Policies',
      integrations: 'Integrations'
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-2xs">
      
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-blue-600"></div>
        <h2 className="text-base lg:text-lg font-extrabold text-slate-900 tracking-tight">{getBreadcrumb()}</h2>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-16 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50/70 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all text-slate-900 shadow-2xs focus:bg-white"
          placeholder="Search customer, invoice, payment or case ID..."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-slate-400 text-xs font-semibold px-2 py-0.5 border border-slate-200 rounded-md bg-white">⌘ K</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600 font-semibold cursor-pointer hover:text-blue-600 transition-colors">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
          <span className="w-2 h-2 rounded-full bg-blue-600 live-dot"></span>
          <span className="text-xs font-bold uppercase tracking-wider">Simulation Mode</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Ananya Rao</span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Revenue Ops</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shadow-2xs">
            AR
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}
