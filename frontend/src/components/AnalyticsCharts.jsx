import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Cpu } from 'lucide-react';

export default function AnalyticsCharts({ chartData, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-80 glass-card rounded-2xl animate-pulse p-6" />
        <div className="h-80 glass-card rounded-2xl animate-pulse p-6" />
      </div>
    );
  }

  const failureData = chartData?.failure_reasons || [];
  const methodData = chartData?.payment_methods || [];
  const interventionData = chartData?.intervention_types || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-200 mb-1">{label || payload[0].name}</p>
          <p className="text-blue-400 font-mono">
            Value: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Chart 1: Failure Reasons Distribution */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold tracking-wide text-slate-200">
              Payment Failure Reasons
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Real-Time Distribution</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={failureData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="failure_reason"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_cases" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Payment Method Performance */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-wide text-slate-200">
              Payment Method Performance
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Volume Breakdown</span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={methodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="total_cases"
                nameKey="payment_method"
              >
                {methodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
