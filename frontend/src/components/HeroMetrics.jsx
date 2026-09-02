import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ShieldAlert, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => {
    let formatted = Math.floor(current).toLocaleString('en-IN');
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function HeroMetrics({ metrics }) {
  const { atRisk, recovered, rate, activeAgents } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Revenue at Risk */}
      <div className="fintech-card p-6 bg-white border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-textSecondary">
            Revenue at Risk
          </span>
          <div className="p-2 rounded-lg bg-status-warningBg border border-status-warningBorder">
            <ShieldAlert className="w-5 h-5 text-status-warningText" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl lg:text-4xl font-extrabold text-brand-textPrimary tabular-nums tracking-tight">
            <AnimatedCounter value={atRisk} prefix="₹" />
          </span>
        </div>
      </div>

      {/* Revenue Successfully Recovered */}
      <div className="fintech-card p-6 bg-white border-status-successBorder border-opacity-60 relative overflow-hidden group">
        <div className="absolute inset-0 bg-status-successBg opacity-30 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative z-10 flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-status-successText">
            Revenue Recovered
          </span>
          <div className="p-2 rounded-lg bg-status-successBg border border-status-successBorder shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-status-successText" />
          </div>
        </div>
        <div className="relative z-10 flex items-baseline">
          <span className="text-3xl lg:text-4xl font-extrabold text-status-successText tabular-nums tracking-tight">
            <AnimatedCounter value={recovered} prefix="₹" />
          </span>
        </div>
      </div>

      {/* Net Recovery Rate % */}
      <div className="fintech-card p-6 bg-white border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-textSecondary">
            Net Recovery Rate
          </span>
          <div className="p-2 rounded-lg bg-brand-softBlue border border-brand-primary/20">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl lg:text-4xl font-extrabold text-brand-primary tabular-nums tracking-tight">
            <AnimatedCounter value={rate} suffix="%" />
          </span>
        </div>
      </div>

      {/* Active Bounded Workflows */}
      <div className="fintech-card p-6 bg-white border-brand-border relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-textSecondary">
            Active Workflows
          </span>
          <div className="p-2 rounded-lg bg-brand-appBg border border-brand-border relative">
            <Activity className="w-5 h-5 text-brand-primary relative z-10" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl lg:text-4xl font-extrabold text-brand-textPrimary tabular-nums tracking-tight">
            <AnimatedCounter value={activeAgents} />
          </span>
          <span className="text-xs font-bold text-brand-textSecondary">agents</span>
        </div>
      </div>
    </div>
  );
}
