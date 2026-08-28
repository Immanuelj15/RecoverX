import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';
import Tooltip from './Tooltip';

export default function KPISummary({ summary, isLoading }) {
  const [animatedValues, setAnimatedValues] = useState({
    atRisk: 0,
    recovered: 0,
    rate: 0,
    count: 0
  });

  const targetAtRisk = summary?.revenue_at_risk || 0;
  const targetRecovered = summary?.revenue_recovered || 0;
  const targetRate = summary?.recovery_rate || 0;
  const targetCount = summary?.total_recovered_count || summary?.successful_recoveries || 0;

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setAnimatedValues({
        atRisk: targetAtRisk,
        recovered: targetRecovered,
        rate: targetRate,
        count: targetCount
      });
      return;
    }

    let start = null;
    const duration = 700; // 700ms smooth count-up

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedValues({
        atRisk: Math.floor(targetAtRisk * easeProgress),
        recovered: Math.floor(targetRecovered * easeProgress),
        rate: parseFloat((targetRate * easeProgress).toFixed(1)),
        count: Math.floor(targetCount * easeProgress)
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetAtRisk, targetRecovered, targetRate, targetCount]);

  const formatINR = (num) => {
    if (num === undefined || num === null) return '₹0';
    const n = Number(num);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 10000).toFixed(2)}L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const metrics = [
    {
      title: 'Revenue at Risk',
      value: formatINR(animatedValues.atRisk),
      subtext: `${summary?.total_transactions_analyzed || 0} failed payments detected`,
      change: 'Needs Attention',
      icon: ShieldAlert,
      accentColor: 'text-[#F59E0B]',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-[#FDE68A]',
      tooltipTerm: 'Revenue at Risk',
      tooltipText: 'Total gross value of all failed payment transactions currently flagged for recovery.'
    },
    {
      title: 'Revenue Recovered',
      value: formatINR(animatedValues.recovered),
      subtext: `${targetCount} successful AI recoveries`,
      change: '↑ 12.4% vs prev period',
      changeType: 'positive',
      icon: CheckCircle2,
      accentColor: 'text-[#16A34A]',
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-[#BBF7D0]',
      tooltipTerm: 'Revenue Recovered',
      tooltipText: 'Actual money collected via automated smart retries, payment nudges, and policy-approved interventions.'
    },
    {
      title: 'Recovery Success Rate',
      value: `${animatedValues.rate.toFixed(1)}%`,
      subtext: `Avg ₹${summary?.revenue_recovered && targetCount ? Math.round(summary.revenue_recovered / targetCount) : 0} per recovery`,
      change: 'Target > 50%',
      icon: TrendingUp,
      accentColor: 'text-[#2D6CDF]',
      bgColor: 'bg-[#EEF4FF]',
      borderColor: 'border-[#C7D7FE]',
      tooltipTerm: 'Recovery Success Rate',
      tooltipText: 'Percentage of total failed revenue successfully recovered back into merchant accounts.'
    },
    {
      title: 'Payments Recovered',
      value: animatedValues.count.toLocaleString('en-IN'),
      subtext: `${summary?.human_escalations || 0} Escalated • ${summary?.stopped_actions || 0} Guardrail Stopped`,
      change: 'Automated',
      icon: AlertCircle,
      accentColor: 'text-[#635BFF]',
      bgColor: 'bg-[#EEF2FF]',
      borderColor: 'border-[#C7D2FE]',
      tooltipTerm: 'Payments Recovered',
      tooltipText: 'Total count of individual transaction recovery cases completed successfully.'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-[#EAECF0] rounded w-24 mb-3"></div>
            <div className="h-8 bg-[#EAECF0] rounded w-32 mb-2"></div>
            <div className="h-3 bg-[#EAECF0] rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all fintech-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                <Tooltip term={m.tooltipTerm} text={m.tooltipText}>
                  {m.title}
                </Tooltip>
              </span>
              <div className={`p-2 rounded-lg ${m.bgColor} ${m.borderColor} border`}>
                <Icon className={`w-4 h-4 ${m.accentColor}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#111827] tabular-nums tracking-tight">
                {m.value}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F2F4F7] mt-3">
              <span className="text-[#667085] truncate max-w-[180px]">{m.subtext}</span>
              {m.changeType === 'positive' && (
                <span className="flex items-center text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded">
                  {m.change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
