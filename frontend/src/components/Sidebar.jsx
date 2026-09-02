import React from 'react';
import { LayoutDashboard, Briefcase, BarChart3, List, Settings, Plug, ShieldCheck, Play, Repeat, Search, Layers, ShieldAlert, BookTemplate, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Sidebar({ activeTab, setActiveTab }) {
  const mainLinks = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'cases', name: 'Recovery Queue', icon: List, badge: 42 },
    { id: 'batch', name: 'Workflows', icon: Layers },
    { id: 'promises', name: 'Promises to Pay', icon: Repeat },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const controlLinks = [
    { id: 'audit', name: 'Audit Trail', icon: Search, badge: 11 },
    { id: 'settings', name: 'Policies', icon: ShieldCheck, badge: 6 },
    { id: 'templates', name: 'Templates', icon: BookTemplate },
    { id: 'integrations', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[248px] bg-brand-surface border-r border-brand-border flex flex-col z-50">
      {/* Branding */}
      <div className="h-[68px] flex items-center px-6 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary flex items-center justify-center">
            <Repeat className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-brand-navy font-extrabold text-[15px] leading-tight tracking-tight">RecoverFlow</span>
            <span className="text-brand-textSecondary text-[10px] font-semibold tracking-wider uppercase">Revenue Recovery</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        
        {/* Main Menu */}
        <div>
          <div className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                    isActive 
                      ? "bg-brand-softBlue text-brand-primaryHover" 
                      : "text-brand-textSecondary hover:text-brand-primaryHover hover:bg-brand-appBg"
                  )}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-primary rounded-r" />}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : "text-brand-textMuted group-hover:text-brand-primary")} />
                    {link.name}
                  </div>
                  {link.badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums relative z-10",
                      isActive ? "bg-white text-brand-primary" : "bg-brand-appBg text-brand-textSecondary border border-brand-border"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Control Section */}
        <div>
          <h4 className="px-3 text-[11px] font-bold text-brand-textMuted uppercase tracking-wider mb-2">Controls</h4>
          <div className="space-y-1">
            {controlLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                    isActive 
                      ? "bg-brand-softBlue text-brand-primaryHover" 
                      : "text-brand-textSecondary hover:text-brand-primaryHover hover:bg-brand-appBg"
                  )}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-primary rounded-r" />}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : "text-brand-textMuted")} />
                    {link.name}
                  </div>
                  {link.badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums relative z-10",
                      isActive ? "bg-white text-brand-primary" : "bg-brand-appBg text-brand-textSecondary border border-brand-border"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Workspace Selector */}
      <div className="p-4 border-t border-brand-border bg-brand-appBg">
        <div className="flex flex-col gap-1 px-2 cursor-pointer group">
          <span className="text-xs font-semibold text-brand-textPrimary group-hover:text-brand-primary transition-colors">Acme Payments India</span>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brand-textSecondary">Workspace</span>
            <ChevronDown className="w-3 h-3 text-brand-textMuted group-hover:text-brand-primary transition-colors" />
          </div>
        </div>
      </div>
    </aside>
  );
}
