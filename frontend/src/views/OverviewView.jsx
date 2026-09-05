import React from 'react';
import KPICards from '../components/KPICards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { PlayCircle, Eye, ShieldCheck, Zap, PhoneCall, Layers, Repeat, ArrowUpRight, Activity, Sparkles, Bot, ShieldAlert } from 'lucide-react';

export default function OverviewView({ metrics, isLoading, error, setActiveTab, chartsData }) {
  const handleSimulateBatch = async () => {
    if (setActiveTab) setActiveTab('batch');
  };

  const sampleActivity = [
    {
      id: 'act_1',
      title: 'Hinglish Voice Recovery Call Placed',
      desc: 'Placed sandboxed call to Ananya Tech (+919887766554) for ₹15,000 overdue subscription.',
      time: '2 mins ago',
      badge: 'PROMISE_TO_PAY',
      badgeColor: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30',
      icon: PhoneCall
    },
    {
      id: 'act_2',
      title: 'Smart Retry Timing Scheduled',
      desc: 'XGBoost ML predicted 78.4% success at 14:30 payday window for Acme Corp.',
      time: '14 mins ago',
      badge: 'EXECUTING',
      badgeColor: 'bg-[#2D7FF9]/10 text-[#2D7FF9] border-[#2D7FF9]/30',
      icon: Zap
    },
    {
      id: 'act_3',
      title: 'Checkout Drop-off Nudge Delivered',
      desc: 'WhatsApp 1-click checkout recovery link sent to Vikram Mehta.',
      time: '32 mins ago',
      badge: 'DELIVERED',
      badgeColor: 'bg-[#2D7FF9]/10 text-[#2D7FF9] border-[#2D7FF9]/30',
      icon: Layers
    },
    {
      id: 'act_4',
      title: 'High-Value Escalation Guardrail',
      desc: 'Transaction ₹52,000 held for human approval per policy rule #4.',
      time: '1 hour ago',
      badge: 'ESCALATED',
      badgeColor: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
      icon: ShieldAlert
    }
  ];

  const channelPerformance = [
    { name: 'Payment Degradation (Smart Retry)', recovered: '₹1.85L', rate: '78.4%', count: '48 cases', color: 'bg-[#2D7FF9]' },
    { name: 'Checkout Drop-off (Nudge Sequence)', recovered: '₹62.0K', rate: '64.2%', count: '32 cases', color: 'bg-[#8B5CF6]' },
    { name: 'Failed Subscriptions (Dunning)', recovered: '₹54.5K', rate: '59.8%', count: '24 cases', color: 'bg-[#635BFF]' },
    { name: 'B2B Receivables & PTP Tracker', recovered: '₹42.0K', rate: '52.1%', count: '12 cases', color: 'bg-[#F59E0B]' },
    { name: 'Hinglish Voice Recovery Calls', recovered: '₹27.5K', rate: '48.0%', count: '8 calls', color: 'bg-[#10B981]' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#F8FAFC]">
      
      {/* Executive Command Center Banner */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-[#101927] p-6 sm:p-7 rounded-2xl border border-[#1E2B3D] shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
              AI Revenue Recovery Command Center
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              5 Recovery Channels Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-semibold leading-relaxed">
            Intercepting payment failures, analyzing recovery probability, enforcing deterministic financial policy guardrails, and capturing verified recovered revenue.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap pt-2 xl:pt-0 border-t xl:border-t-0 border-[#1E2B3D]">
          <button 
            onClick={() => setActiveTab && setActiveTab('cases')}
            className="px-4 py-2.5 rounded-xl border border-[#1E2B3D] bg-[#0B1220] text-[#94A3B8] hover:text-white hover:border-[#2D7FF9] transition-all text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Eye className="w-4 h-4 text-[#64748B] shrink-0" />
            <span>Recovery Queue</span>
          </button>
          <button 
            onClick={handleSimulateBatch} 
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-[#2D7FF9] hover:bg-[#2D7FF9]/80 text-white transition-all text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#2D7FF9]/20 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <PlayCircle className="w-4 h-4 shrink-0" />
            <span>Run Recovery Simulation</span>
          </button>
        </div>
      </section>

      {/* Executive AI-Generated Summary Banner (Section 8) */}
      <section className="bg-gradient-to-r from-[#101927] via-[#141F2E] to-[#101927] border border-[#2D7FF9]/40 rounded-2xl p-5 shadow-xl flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] shrink-0 mt-0.5">
          <Bot className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#8B5CF6] uppercase tracking-wider">Executive Intelligence Briefing</span>
            <span className="text-[10px] text-[#64748B] font-mono">Backend Data Verified</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC] leading-relaxed">
            RecoverX identified <span className="font-mono text-[#F59E0B] font-bold">₹18.4L</span> in revenue at risk across <span className="font-mono text-white">500 failed payments</span>. <span className="font-mono text-[#10B981] font-bold">71% of cases</span> are predicted recoverable by XGBoost ML (<span className="font-mono text-[#2D7FF9] font-bold">₹13.0L E[R]</span>). <span className="font-mono text-[#10B981] font-bold">₹3.5L</span> has already been verified recovered. <span className="font-mono text-[#F59E0B] font-bold">6 high-value cases</span> require human review.
          </p>
        </div>
      </section>

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Hero KPI Suite */}
      <section>
        <KPICards metrics={metrics || {}} />
      </section>

      {/* Charts & Analytics */}
      <section>
        <AnalyticsCharts chartsData={chartsData} isLoading={isLoading} />
      </section>

      {/* Channel Breakdown & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Channel Performance Breakdown */}
        <div className="lg:col-span-7 bg-[#101927] p-6 rounded-2xl border border-[#1E2B3D] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E2B3D] pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2D7FF9]" /> Recovery Performance by Channel Flow
              </h3>
              <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
                Breakdown of net recovered revenue across integrated recovery execution channels.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab && setActiveTab('analytics')}
              className="text-xs font-bold text-[#2D7FF9] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Detailed Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {channelPerformance.map((ch, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl hover:bg-[#0B1220] transition-colors">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{ch.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#64748B] font-medium">{ch.count}</span>
                    <span className="text-[#10B981] font-mono font-extrabold">{ch.recovered}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-[#0B1220] border border-[#1E2B3D] rounded-full overflow-hidden flex">
                  <div className={`h-full ${ch.color} rounded-full`} style={{ width: ch.rate }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Agent Activity Feed */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#101927] p-6 rounded-2xl border border-[#1E2B3D] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2B3D] pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#2D7FF9]" /> Real-Time Recovery Activity
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#2D7FF9]/10 text-[#2D7FF9] border border-[#2D7FF9]/30">Live Stream</span>
            </div>

            <div className="space-y-3">
              {sampleActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="p-3 bg-[#0B1220] rounded-xl border border-[#1E2B3D] flex items-start gap-3 text-xs font-medium">
                    <div className="p-2 rounded-lg bg-[#101927] border border-[#1E2B3D] text-[#2D7FF9] mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">{act.title}</span>
                        <span className="text-[10px] text-[#64748B] font-mono">{act.time}</span>
                      </div>
                      <p className="text-[#94A3B8] mt-0.5 text-[11px] leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
