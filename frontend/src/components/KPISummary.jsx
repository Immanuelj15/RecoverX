import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function KPISummary({ summary, isLoading }) {
  const formatINR = (amountInr) => {
    if (amountInr === undefined || amountInr === null) return '₹0';
    const num = Number(amountInr);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 10000).toFixed(2)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const metrics = [
    {
      title: 'Revenue at Risk',
      value: formatINR(summary?.revenue_at_risk || 0),
      subtext: `${summary?.total_transactions_analyzed || 0} failed payments detected`,
      change: 'Needs Attention',
      changeType: 'warning',
      icon: ShieldAlert,
      accentColor: 'text-[#F59E0B]',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-[#FDE68A]'
    },
    {
      title: 'Revenue Recovered',
      value: formatINR(summary?.revenue_recovered || 0),
      subtext: `${summary?.total_recovered_count || 0} successful AI recoveries`,
      change: '↑ 12.4% vs prev period',
      changeType: 'positive',
      icon: CheckCircle2,
      accentColor: 'text-[#16A34A]',
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-[#BBF7D0]'
    },
    {
      title: 'Recovery Success Rate',
      value: `${(summary?.recovery_rate || 0).toFixed(1)}%`,
      subtext: `Avg ₹${summary?.revenue_recovered && summary?.total_recovered_count ? Math.round(summary.revenue_recovered / summary.total_recovered_count) : 0} per recovery`,
      change: 'Target > 50%',
      changeType: 'neutral',
      icon: TrendingUp,
      accentColor: 'text-[#2D6CDF]',
      bgColor: 'bg-[#EEF4FF]',
      borderColor: 'border-[#C7D7FE]'
    },
    {
      title: 'Payments Recovered',
      value: (summary?.total_recovered_count || 0).toLocaleString('en-IN'),
      subtext: `${summary?.total_escalated_count || 0} Escalated • ${summary?.total_stopped_count || 0} Guardrail Blocked`,
      change: 'Automated',
      changeType: 'neutral',
      icon: AlertCircle,
      accentColor: 'text-[#635BFF]',
      bgColor: 'bg-[#EEF2FF]',
      borderColor: 'border-[#C7D2FE]'
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
            className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm hover:shadow-md transition-all fintech-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                {m.title}
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
