import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, List, BarChart3, Search, Settings, ShieldCheck, Repeat, Layers, ShieldAlert, Cpu, PhoneCall, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Sidebar({ activeTab, setActiveTab }) {
  const mainLinks = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'cases', name: 'Recovery Queue', icon: List },
    { id: 'human-review', name: 'Human Review', icon: ShieldAlert, badge: 'Escalated' },
    { id: 'ai-decisions', name: 'AI Decision Center', icon: Bot },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const controlLinks = [
    { id: 'audit', name: 'Audit Trail', icon: Search },
    { id: 'settings', name: 'Recovery Guardrails', icon: ShieldCheck },
    { id: 'model-insights', name: 'Model Insights', icon: Cpu },
  ];

  const systemLinks = [
    { id: 'batch', name: 'Run Simulation', icon: Layers },
    { id: 'voice', name: 'Voice Calls', icon: PhoneCall },
    { id: 'promises', name: 'Promises to Pay', icon: Repeat },
    { id: 'integrations', name: 'Settings & Integrations', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[256px] bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm">
      {/* Branding Header */}
      <div className="h-[72px] flex items-center px-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Repeat className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-black text-lg leading-tight tracking-tight">RECOVERX</span>
            <span className="text-blue-600 text-[10px] font-extrabold tracking-widest uppercase">AI Revenue Ops</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
        
        {/* Main Section */}
        <div>
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Core Control Plane</div>
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
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all relative overflow-hidden cursor-pointer",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/60"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-r-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className={cn(
                      "text-[10px] font-extrabold px-2 py-0.5 rounded-full tabular-nums relative z-10",
                      isActive ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Governance & Audits Section */}
        <div>
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Governance & Audits</div>
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
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all relative overflow-hidden cursor-pointer",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/60"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-r-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{link.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* System Simulation Section */}
        <div>
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">System & Tools</div>
          <div className="space-y-1.5">
            {systemLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all relative overflow-hidden cursor-pointer",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/60"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-r-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{link.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Store Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex flex-col gap-1 px-2 cursor-pointer group">
          <span className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">RecoverX Demo Store</span>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">Razorpay Sandboxed Store</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
