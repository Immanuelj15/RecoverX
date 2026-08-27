import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Bot, 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Settings, 
  FileText
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'payments', label: 'Payments & Cases', icon: CreditCard },
    { id: 'ai-decisions', label: 'AI Decisions', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit-trail', label: 'Audit Trail', icon: FileText },
    { id: 'model-insights', label: 'Model Insights', icon: Cpu },
    { id: 'settings', label: 'Policy Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0C2651] text-white flex flex-col shrink-0 min-h-screen border-r border-[#1C4991]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1C4991]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6CDF] to-[#635BFF] flex items-center justify-center shadow-lg shadow-[#2D6CDF]/30 font-extrabold text-white text-xl">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">RecoverX</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#635BFF]/30 text-[#A5B4FC] border border-[#635BFF]/40">
                AI
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">AI Revenue Recovery</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#EEF4FF] text-[#0C2651] font-semibold shadow-sm'
                  : 'text-[#CBD5E1] hover:bg-[#14366F] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D6CDF]' : 'text-[#94A3B8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Environment Footer */}
      <div className="p-4 m-3 rounded-xl bg-[#061329]/60 border border-[#1C4991] text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2 mb-1 text-white font-medium">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Razorpay Test Mode</span>
        </div>
        <p className="text-[11px] text-[#94A3B8] leading-relaxed">
          HMAC-SHA256 Signed & Autonomous Recovery Guardrails Active
        </p>
      </div>
    </aside>
  );
}
