import React from 'react';
import { AlertCircle, CheckCircle2, Target, ShieldAlert, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function KPICards({ metrics }) {
  const formatCurrency = (value) => {
    if (value === 0) return '₹0';
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cards = [
    {
      title: 'Revenue at risk',
      value: formatCurrency(metrics.atRisk || 1840000),
      subtitle: `${metrics.activeAgents || 120} active recovery cases`,
      trend: '+8.2% vs previous period',
      icon: AlertCircle,
      iconColor: 'text-brand-primary',
      iconBg: 'bg-brand-softBlue',
      style: 'border-t-2 border-t-brand-primary'
    },
    {
      title: 'Net recovered',
      value: formatCurrency(metrics.recovered || 350000),
      subtitle: `₹${((metrics.recovered || 350000) + 20000).toLocaleString('en-IN')} gross · ₹20K cost`,
      trend: '+18.6% vs previous period',
      icon: CheckCircle2,
      iconColor: 'text-brand-primary',
      iconBg: 'bg-brand-softBlue',
      style: 'bg-brand-paleBlue/30'
    },
    {
      title: 'Recovery rate',
      value: `${metrics.rate || 26.5}%`,
      subtitle: '+3.1 pts vs control group',
      trend: null,
      icon: Target,
      iconColor: 'text-brand-primary',
      iconBg: 'bg-brand-softBlue',
      style: ''
    },
    {
      title: 'Awaiting approval',
      value: '6',
      subtitle: '₹4.2L affected value',
      trend: null,
      icon: ShieldAlert,
      iconColor: 'text-status-warningText',
      iconBg: 'bg-status-warningBg',
      style: ''
    },
    {
      title: 'Policy-protected',
      value: '₹2.1L',
      subtitle: '24 cases paused or suppressed',
      trend: null,
      icon: ShieldCheck,
      iconColor: 'text-brand-textSecondary',
      iconBg: 'bg-brand-disabledBg',
      style: ''
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <button key={index} className={cn("fintech-card fintech-card-hover p-4 flex flex-col group text-left", card.style)}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-brand-textSecondary text-[13px] font-semibold">
              {card.title}
            </h3>
            <div className={cn("w-9 h-9 rounded flex items-center justify-center transition-transform group-hover:scale-105", card.iconBg, card.iconColor)}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-[28px] leading-tight font-bold text-brand-textPrimary tabular-nums tracking-tight">
              {card.value}
            </div>
            {card.trend && (
              <div className="text-[11px] font-medium text-brand-textSecondary mt-1">
                {card.trend}
              </div>
            )}
            <div className="text-xs text-brand-textSecondary mt-1.5 pt-1.5 border-t border-brand-border/50">
              {card.subtitle}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
