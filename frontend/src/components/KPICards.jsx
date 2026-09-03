import React from 'react';
import { AlertCircle, CheckCircle2, Target, ShieldAlert, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function KPICards({ metrics }) {
  const formatCurrency = (value) => {
    if (!value || value === 0) return '₹0';
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cards = [
    {
      title: 'Net Revenue Recovered',
      value: formatCurrency(metrics.recovered || 350000),
      subtitle: `₹${((metrics.recovered || 350000) + 20000).toLocaleString('en-IN')} gross · ₹20K cost`,
      trend: '+18.6% vs previous period',
      icon: CheckCircle2,
      isHero: true,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      style: 'bg-emerald-50/60 border-2 border-emerald-300 shadow-sm shadow-emerald-500/10'
    },
    {
      title: 'Revenue at Risk',
      value: formatCurrency(metrics.atRisk || 1840000),
      subtitle: `${metrics.activeAgents || 120} active recovery cases`,
      trend: '+8.2% vs previous period',
      icon: AlertCircle,
      isHero: false,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100',
      style: 'bg-amber-50/40 border border-amber-200'
    },
    {
      title: 'Recovery Success Rate',
      value: `${metrics.rate || 26.5}%`,
      subtitle: '+3.1 pts vs control group',
      trend: null,
      icon: Target,
      isHero: false,
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      style: 'bg-white border border-slate-200'
    },
    {
      title: 'Awaiting Approval',
      value: '6',
      subtitle: '₹4.2L affected value',
      trend: null,
      icon: ShieldAlert,
      isHero: false,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      style: 'bg-white border border-slate-200'
    },
    {
      title: 'Policy-Protected',
      value: '₹2.1L',
      subtitle: '24 cases paused by guardrails',
      trend: null,
      icon: ShieldCheck,
      isHero: false,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100',
      style: 'bg-white border border-slate-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={cn("fintech-card fintech-card-hover p-5 flex flex-col justify-between group text-left", card.style)}>
          <div className="flex justify-between items-start mb-3">
            <h3 className={cn("text-xs font-extrabold uppercase tracking-wider", card.isHero ? "text-emerald-800" : "text-slate-600")}>
              {card.title}
            </h3>
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs", card.iconBg, card.iconColor)}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-auto">
            <div className={cn(
              "leading-tight font-black tabular-nums tracking-tight",
              card.isHero ? "text-3xl lg:text-4xl text-emerald-800" : "text-2xl lg:text-3xl text-slate-900"
            )}>
              {card.value}
            </div>
            {card.trend && (
              <div className={cn("text-[11px] font-bold mt-1.5", card.isHero ? "text-emerald-700" : "text-slate-500")}>
                {card.trend}
              </div>
            )}
            <div className="text-xs font-semibold text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
