import React from 'react';
import { motion } from 'framer-motion';
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
    <aside className="fixed left-0 top-0 bottom-0 w-[256px] bg-white border-r border-slate-200 flex flex-col z-50 shadow-2xs">
      {/* Branding */}
      <div className="h-[72px] flex items-center px-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Repeat className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-extrabold text-lg leading-tight tracking-tight">RECOVERFLOW</span>
            <span className="text-blue-600 text-xs font-bold tracking-wider uppercase">AI Recovery Ops</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
        
        {/* Main Menu */}
        <div>
          <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Main Navigation</div>
          <div className="space-y-1.5">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden cursor-pointer",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-600 rounded-r-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600")} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className={cn(
                      "text-xs font-extrabold px-2 py-0.5 rounded-full tabular-nums relative z-10",
                      isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Control Section */}
        <div>
          <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Governance & Audits</div>
          <div className="space-y-1.5">
            {controlLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden cursor-pointer",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-600 rounded-r-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className={cn(
                      "text-xs font-extrabold px-2 py-0.5 rounded-full tabular-nums relative z-10",
                      isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Workspace Selector */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex flex-col gap-1 px-2 cursor-pointer group">
          <span className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">Acme Payments India</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">B2B SaaS Workspace</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </aside>
  );
}
