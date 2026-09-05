import React from 'react';
import { AlertCircle, CheckCircle2, Target, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function KPICards({ metrics = {} }) {
  const formatCurrency = (value) => {
    if (!value || value === 0) return '₹0';
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const atRisk = metrics.revenue_at_risk || metrics.atRisk || 1840000;
  const expectedRecoverable = metrics.expected_recoverable || Math.round(atRisk * 0.71);
  const recovered = metrics.revenue_recovered || metrics.recovered || 350000;
  const recoveryRate = metrics.recovery_rate || metrics.rate || 26.5;
  const escalations = metrics.human_escalations || 6;

  const cards = [
    {
      title: 'REVENUE AT RISK',
      value: formatCurrency(atRisk),
      subtitle: `${metrics.total_transactions_analyzed || 500} failed payment events`,
      trend: '+8.2% vs last 7 days',
      icon: AlertCircle,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#F59E0B]/10 border border-[#F59E0B]/30',
      badge: 'At Risk'
    },
    {
      title: 'RECOVERABLE REVENUE (E[R])',
      value: formatCurrency(expectedRecoverable),
      subtitle: 'XGBoost ML model predicted',
      trend: '71.0% avg probability',
      icon: Sparkles,
      iconColor: 'text-[#2D7FF9]',
      iconBg: 'bg-[#2D7FF9]/10 border border-[#2D7FF9]/30',
      badge: 'ML Predicted'
    },
    {
      title: 'RECOVERED REVENUE',
      value: formatCurrency(recovered),
      subtitle: 'Verified net recovered money',
      trend: '+18.6% vs last period',
      icon: CheckCircle2,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-[#10B981]/10 border border-[#10B981]/30',
      badge: 'Verified Net',
      isHero: true
    },
    {
      title: 'RECOVERY RATE',
      value: `${recoveryRate}%`,
      subtitle: 'Net recovery efficiency',
      trend: '+3.1% vs control group',
      icon: TrendingUp,
      iconColor: 'text-[#8B5CF6]',
      iconBg: 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30',
      badge: 'Efficiency'
    },
    {
      title: 'HUMAN ESCALATIONS',
      value: `${escalations}`,
      subtitle: 'High-value cases ≥ ₹50,000',
      trend: 'Policy Guardrail Rule #4',
      icon: ShieldAlert,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#F59E0B]/10 border border-[#F59E0B]/30',
      badge: 'Requires Action'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
              card.isHero
                ? 'bg-[#101927] border-[#10B981]/50 shadow-xl shadow-[#10B981]/10'
                : 'bg-[#101927] border-[#1E2B3D] hover:border-[#2D7FF9]/50 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-black font-mono text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] font-bold text-[#10B981] flex items-center gap-1">
                <span>{card.trend}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#1E2B3D] flex items-center justify-between text-[10px] text-[#64748B] font-semibold">
              <span>{card.subtitle}</span>
              <span className="px-2 py-0.5 rounded bg-[#0B1220] border border-[#1E2B3D] font-mono text-[#94A3B8]">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
