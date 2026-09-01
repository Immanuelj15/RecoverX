import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ShieldAlert, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => {
    let formatted = Math.floor(current).toLocaleString('en-US');
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
      <div className="fintech-card p-6 border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-textSecondary">
            Revenue at Risk
          </span>
          <div className="p-2 rounded-lg bg-fintech-warningBg border border-fintech-warningBorder">
            <ShieldAlert className="w-5 h-5 text-fintech-warning" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl lg:text-4xl font-extrabold text-brand-textPrimary tabular-nums tracking-tight">
            <AnimatedCounter value={atRisk} prefix="$" />
          </span>
        </div>
      </div>

      {/* Revenue Successfully Recovered */}
      <div className="fintech-card p-6 border-fintech-success border-opacity-30 relative overflow-hidden group">
        <div className="absolute inset-0 bg-fintech-successBg opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="relative z-10 flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-fintech-success">
            Revenue Recovered
          </span>
          <div className="p-2 rounded-lg bg-fintech-successBg border border-fintech-successBorder shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-5 h-5 text-fintech-success" />
          </div>
        </div>
        <div className="relative z-10 flex items-baseline">
          <span className="text-3xl lg:text-4xl font-extrabold text-fintech-success tabular-nums tracking-tight drop-shadow-md">
            <AnimatedCounter value={recovered} prefix="$" />
          </span>
        </div>
      </div>

      {/* Net Recovery Rate % */}
      <div className="fintech-card p-6 border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-textSecondary">
            Net Recovery Rate
          </span>
          <div className="p-2 rounded-lg bg-brand-aiLight border border-brand-ai opacity-80">
            <TrendingUp className="w-5 h-5 text-brand-ai" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl lg:text-4xl font-extrabold text-brand-cyan tabular-nums tracking-tight">
            <AnimatedCounter value={rate} suffix="%" />
          </span>
        </div>
      </div>

      {/* Active Bounded Workflows */}
      <div className="fintech-card p-6 border-brand-border relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-textSecondary">
            Active Workflows
          </span>
          <div className="p-2 rounded-lg bg-navy-800 border border-brand-border relative">
             <div className="absolute inset-0 rounded-lg ai-pulse pointer-events-none"></div>
            <Activity className="w-5 h-5 text-brand-blueHover relative z-10" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl lg:text-4xl font-extrabold text-brand-textPrimary tabular-nums tracking-tight">
            <AnimatedCounter value={activeAgents} />
          </span>
          <span className="text-sm text-brand-textSecondary">agents</span>
        </div>
      </div>
    </div>
  );
}
