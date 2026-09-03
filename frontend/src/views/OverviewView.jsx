import React from 'react';
import KPICards from '../components/KPICards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { PlayCircle, Eye, ShieldCheck, Zap, PhoneCall, Layers, Repeat, ArrowUpRight, Activity } from 'lucide-react';

export default function OverviewView({ metrics, isLoading, error, simulateBatch, setActiveTab, chartsData }) {
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
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: PhoneCall
    },
    {
      id: 'act_2',
      title: 'Smart Retry Timing Scheduled',
      desc: 'XGBoost ML predicted 78.4% success at 14:30 payday window for Acme Corp.',
      time: '14 mins ago',
      badge: 'EXECUTING',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Zap
    },
    {
      id: 'act_3',
      title: 'Checkout Drop-off Nudge Delivered',
      desc: 'WhatsApp 1-click checkout recovery link sent to Vikram Mehta.',
      time: '32 mins ago',
      badge: 'DELIVERED',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Layers
    },
    {
      id: 'act_4',
      title: 'High-Value Escalation Guardrail',
      desc: 'Transaction ₹75,000 held for human approval per policy rule #2.',
      time: '1 hour ago',
      badge: 'PAUSED',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: ShieldCheck
    }
  ];

  const channelPerformance = [
    { name: 'Payment Degradation (Smart Retry)', recovered: '₹1.85L', rate: '78.4%', count: '48 cases', color: 'bg-blue-600' },
    { name: 'Checkout Drop-off (Nudge Sequence)', recovered: '₹62.0K', rate: '64.2%', count: '32 cases', color: 'bg-indigo-600' },
    { name: 'Failed Subscriptions (Dunning)', recovered: '₹54.5K', rate: '59.8%', count: '24 cases', color: 'bg-purple-600' },
    { name: 'B2B Receivables & PTP Tracker', recovered: '₹42.0K', rate: '52.1%', count: '12 cases', color: 'bg-amber-600' },
    { name: 'Hinglish Voice Recovery Calls', recovered: '₹27.5K', rate: '48.0%', count: '8 calls', color: 'bg-emerald-600' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Hero / Command Center Banner */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">AI Revenue Recovery Command Center</h1>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 live-dot"></span> 5 Recovery Pipelines Active
            </span>
          </div>
          <p className="text-sm text-slate-500 font-semibold">
            Catching, diagnosing, and bringing back at-risk revenue through automated multi-channel interventions and auditable guardrails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab && setActiveTab('cases')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors text-xs font-extrabold flex items-center gap-2 bg-white cursor-pointer shadow-2xs"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            View Recovery Queue
          </button>
          <button 
            onClick={handleSimulateBatch} 
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-xs font-extrabold flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            Run Recovery Batch Workflows
          </button>
        </div>
      </section>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* KPI Cards Suite */}
      <section>
        <KPICards metrics={metrics || {}} />
      </section>

      {/* Charts & Analytics Overview */}
      <section>
        <AnalyticsCharts chartsData={chartsData} isLoading={isLoading} />
      </section>

      {/* Grid: Flow Channel Breakdown + Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Channel Performance Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Recovery Performance by Pipeline Flow
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Breakdown of net recovered money across all 5 integrated recovery channels.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab && setActiveTab('analytics')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Detailed Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {channelPerformance.map((ch, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{ch.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-medium">{ch.count}</span>
                    <span className="text-emerald-700 font-extrabold tabular-nums">{ch.recovered}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className={`h-full ${ch.color} rounded-full`} style={{ width: ch.rate }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Real-Time Agent Activity & System Status */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" /> Real-Time Agent Interventions
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">Live Stream</span>
            </div>

            <div className="space-y-3">
              {sampleActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs font-medium">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-blue-600 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{act.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{act.desc}</p>
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

