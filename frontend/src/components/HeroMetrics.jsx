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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {/* Total Revenue at Risk */}
      <motion.div variants={item} className="fintech-card fintech-card-hover p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Revenue at Risk
          </span>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            <AnimatedCounter value={atRisk} prefix="₹" />
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 live-dot"></span>
          Monitored across 5 payment gateways
        </div>
      </motion.div>

      {/* Revenue Successfully Recovered */}
      <motion.div variants={item} className="fintech-card fintech-card-hover p-6 bg-emerald-50/30 border-emerald-200 relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
        <div className="relative z-10 flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Revenue Recovered
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300/80 text-emerald-700 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="relative z-10 flex items-baseline">
          <span className="text-4xl lg:text-5xl font-extrabold text-emerald-700 tabular-nums tracking-tight">
            <AnimatedCounter value={recovered} prefix="₹" />
          </span>
        </div>
        <div className="relative z-10 mt-2 flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 live-dot"></span>
          Verified money back in account
        </div>
      </motion.div>

      {/* Net Recovery Rate % */}
      <motion.div variants={item} className="fintech-card fintech-card-hover p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Net Recovery Rate
          </span>
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-4xl lg:text-5xl font-extrabold text-blue-600 tabular-nums tracking-tight">
            <AnimatedCounter value={rate} suffix="%" />
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="text-emerald-600 font-bold">+4.2%</span> vs industry benchmark
        </div>
      </motion.div>

      {/* Active Bounded Workflows */}
      <motion.div variants={item} className="fintech-card fintech-card-hover p-6 bg-white border-slate-200 relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Workflows
          </span>
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-blue-600 relative">
            <Activity className="w-5 h-5 relative z-10" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            <AnimatedCounter value={activeAgents} />
          </span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">agents</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600 live-dot"></span>
          Bounded AI Policy Execution
        </div>
      </motion.div>
    </motion.div>
  );
}
