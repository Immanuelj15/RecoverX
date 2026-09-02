import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Activity, LayoutGrid } from 'lucide-react';

const COLORS = ['#2563EB', '#059669', '#D97706', '#4F46E5', '#DC2626'];

export default function AnalyticsCharts({ chartsData, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-appBg border border-brand-border rounded-xl p-6 h-[300px] animate-pulse"></div>
        <div className="bg-brand-appBg border border-brand-border rounded-xl p-6 h-[300px] animate-pulse"></div>
      </div>
    );
  }

  // Ensure data exists, otherwise show empty state
  const hasFailureData = chartsData?.failure_reasons?.length > 0;
  const hasMethodData = chartsData?.payment_methods?.length > 0;
  const hasTrendData = chartsData?.daily_revenue_trend?.length > 0;

  if (!hasFailureData && !hasMethodData && !hasTrendData) {
    return (
      <div className="bg-white border border-brand-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <LayoutGrid className="w-12 h-12 text-brand-border mb-4" />
        <h3 className="text-brand-textPrimary font-extrabold mb-2">No Recovery Outcomes Yet</h3>
        <p className="text-brand-textSecondary text-sm font-medium max-w-sm">
          Run a recovery scan to populate the analytics dashboard with AI pipeline results and recovery trends.
        </p>
      </div>
    );
  }

  const failureReasons = (chartsData?.failure_reasons || []).map((item) => ({
    failure_reason: item.failure_reason || 'unknown',
    total_cases: item.total_cases || item.count || 0,
    recovered_cases: item.recovered_cases || item.recovered || 0
  }));

  const paymentMethods = (chartsData?.payment_methods || []).map((item) => ({
    payment_method: item.payment_method || 'other',
    total_cases: item.total_cases || item.count || 0
  }));

  const trendData = chartsData?.daily_revenue_trend || [];

  return (
    <div className="space-y-6">
      
      {/* Recovery Performance Trend */}
      {hasTrendData && (
        <div className="fintech-card p-6 h-[320px] flex flex-col bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">Recovery Trend</h3>
              <p className="text-[11px] font-medium text-brand-textSecondary mt-0.5">Revenue at Risk vs Recovered</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-status-warningText">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> At Risk
              </span>
              <span className="flex items-center gap-1.5 text-status-successText">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Recovered
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="atRisk" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="At Risk" />
                <Area type="monotone" dataKey="recovered" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" name="Recovered" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Reason Breakdown */}
        {hasFailureData && (
          <div className="fintech-card p-6 h-[320px] flex flex-col bg-white">
            <h3 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-0.5">Recovery by Failure Type</h3>
            <p className="text-[11px] font-medium text-brand-textSecondary mb-4">Total failed vs. recovered</p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureReasons} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="failure_reason" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="total_cases" fill="#2563EB" radius={[4, 4, 0, 0]} name="Total Failed" />
                  <Bar dataKey="recovered_cases" fill="#059669" radius={[4, 4, 0, 0]} name="Recovered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Payment Method Volume Performance */}
        {hasMethodData && (
          <div className="fintech-card p-6 h-[320px] flex flex-col bg-white">
            <h3 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-0.5">Outcomes by Origin</h3>
            <p className="text-[11px] font-medium text-brand-textSecondary mb-4">Volume breakdown across methods</p>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    dataKey="total_cases"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={55}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
