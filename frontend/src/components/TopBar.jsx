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
    <header className="h-[68px] bg-brand-surface border-b border-brand-border flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-brand-textPrimary">{getBreadcrumb()}</h2>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-brand-textMuted" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-16 py-2 border border-brand-border rounded-lg leading-5 bg-brand-appBg placeholder-brand-textMuted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors text-brand-textPrimary"
          placeholder="Search customer, invoice, payment or case ID..."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-brand-textMuted text-xs font-semibold px-2 py-0.5 border border-brand-border rounded bg-brand-surface">⌘ K</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-sm text-brand-textSecondary">
          <Calendar className="w-4 h-4" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-softBlue border border-brand-strongBorder">
          <Activity className="w-3.5 h-3.5 text-brand-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Simulation Mode</span>
        </div>

        <button className="relative p-1 text-brand-textSecondary hover:text-brand-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-status-dangerText ring-2 ring-brand-surface" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-brand-border cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-brand-textPrimary group-hover:text-brand-primary transition-colors">Ananya Rao</span>
            <span className="text-[10px] text-brand-textSecondary font-semibold uppercase tracking-wider">Revenue Ops</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-softBlue border border-brand-strongBorder flex items-center justify-center text-brand-primary font-bold text-xs">
            AR
          </div>
          <ChevronDown className="w-4 h-4 text-brand-textSecondary" />
        </div>
      </div>
    </header>
  );
}
