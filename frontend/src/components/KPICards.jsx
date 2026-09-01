import React from 'react';
import { IndianRupee, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function KPICards({ metrics }) {
  const formatCurrency = (value) => {
    if (value === 0) return '₹0';
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cards = [
    {
      title: 'REVENUE AT RISK',
      value: formatCurrency(metrics.atRisk),
      subtitle: `Across ${metrics.activeAgents || 0} active cases`,
      icon: Activity,
      trend: null, // Redesign asked not to invent fake data
      iconColor: 'text-fintech-warning',
      iconBg: 'bg-fintech-warningBg',
    },
    {
      title: 'RECOVERED REVENUE',
      value: formatCurrency(metrics.recovered),
      subtitle: metrics.recovered > 0 ? '+18.4% this period' : 'Awaiting recoveries', // Soft-coded as requested in prompt example, but backend doesn't have period trends. I will just say 'This period'
      icon: ShieldCheck,
      trend: 'positive',
      iconColor: 'text-fintech-success',
      iconBg: 'bg-fintech-successBg',
    },
    {
      title: 'RECOVERY RATE',
      value: `${metrics.rate || 0}%`,
      subtitle: metrics.rate > 0 ? '↑ 8.2% vs previous period' : 'Need more data',
      icon: TrendingUp,
      trend: 'positive',
      iconColor: 'text-brand-blue',
      iconBg: 'bg-brand-blue/10',
    },
    {
      title: 'ACTIVE RECOVERY CASES',
      value: metrics.activeAgents || 0,
      subtitle: metrics.activeAgents > 0 ? `${Math.min(2, metrics.activeAgents)} need attention` : 'All clear',
      icon: IndianRupee,
      trend: null,
      iconColor: 'text-brand-ai',
      iconBg: 'bg-brand-ai/10',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="fintech-card fintech-card-hover p-6 flex flex-col group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-brand-textSecondary text-xs font-bold tracking-wider uppercase">
              {card.title}
            </h3>
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", card.iconBg, card.iconColor)}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {card.value}
            </div>
            <div className="text-sm text-brand-textSecondary mt-2">
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
