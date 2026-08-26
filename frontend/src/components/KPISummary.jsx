import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, Cpu } from 'lucide-react';

export default function KPISummary({ summary, isLoading }) {
  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const cards = [
    {
      title: 'Revenue At Risk',
      value: formatINR(summary?.revenue_at_risk),
      subtitle: `${summary?.total_transactions_analyzed || 0} failed payments detected`,
      icon: ShieldAlert,
      color: 'from-amber-500/20 to-orange-500/5',
      borderColor: 'border-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      title: 'Revenue Recovered',
      value: formatINR(summary?.revenue_recovered),
      subtitle: `${summary?.successful_recoveries || 0} successful recoveries`,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Recovery Success Rate',
      value: `${summary?.recovery_rate || 0}%`,
      subtitle: `Avg ₹${summary?.average_recovery_amount || 0} per recovery`,
      icon: TrendingUp,
      color: 'from-blue-500/20 to-cyan-500/5',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Escalations & Stopped',
      value: `${(summary?.human_escalations || 0) + (summary?.stopped_actions || 0)}`,
      subtitle: `${summary?.human_escalations || 0} Escalated • ${summary?.stopped_actions || 0} Stopped`,
      icon: AlertTriangle,
      color: 'from-rose-500/20 to-red-500/5',
      borderColor: 'border-rose-500/20',
      iconColor: 'text-rose-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 glass-card rounded-2xl animate-pulse p-5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-2xl p-5 border ${card.borderColor} bg-gradient-to-br ${card.color} relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-white mb-1 font-mono">
              {card.value}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
