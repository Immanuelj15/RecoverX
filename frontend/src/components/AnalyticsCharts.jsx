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

const COLORS = ['#2D6CDF', '#16A34A', '#F59E0B', '#635BFF', '#DC2626'];

export default function AnalyticsCharts({ chartsData, isLoading }) {
  const failureReasons = chartsData?.failure_reasons || [
    { failure_reason: 'insufficient_balance', count: 180, recovered: 95 },
    { failure_reason: 'bank_declined', count: 140, recovered: 60 },
    { failure_reason: 'network_timeout', count: 90, recovered: 78 },
    { failure_reason: 'card_expired', count: 50, recovered: 5 },
    { failure_reason: 'authentication_failure', count: 40, recovered: 25 }
  ];

  const paymentMethods = chartsData?.payment_methods || [
    { payment_method: 'upi', count: 250 },
    { payment_method: 'card', count: 150 },
    { payment_method: 'netbanking', count: 70 },
    { payment_method: 'wallet', count: 30 }
  ];

  const trendData = [
    { date: 'Mon', atRisk: 120000, recovered: 75000 },
    { date: 'Tue', atRisk: 180000, recovered: 110000 },
    { date: 'Wed', atRisk: 150000, recovered: 98000 },
    { date: 'Thu', atRisk: 220000, recovered: 145000 },
    { date: 'Fri', atRisk: 190000, recovered: 130000 },
    { date: 'Sat', atRisk: 130000, recovered: 89000 },
    { date: 'Sun', atRisk: 160000, recovered: 115000 }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 h-72 animate-pulse"></div>
        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 h-72 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Recovery Performance Trend */}
      <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#111827]">Revenue Recovery Performance</h3>
            <p className="text-xs text-[#667085]">Daily comparison of Revenue at Risk vs. Recovered Revenue</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[#2D6CDF]">
              <span className="w-3 h-3 rounded-sm bg-[#2D6CDF]"></span> Revenue at Risk
            </span>
            <span className="flex items-center gap-1.5 text-[#16A34A]">
              <span className="w-3 h-3 rounded-sm bg-[#16A34A]"></span> Revenue Recovered
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D6CDF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2D6CDF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
              <XAxis dataKey="date" stroke="#667085" fontSize={12} tickLine={false} />
              <YAxis stroke="#667085" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E7EC', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
              />
              <Area type="monotone" dataKey="atRisk" stroke="#2D6CDF" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="At Risk" />
              <Area type="monotone" dataKey="recovered" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" name="Recovered" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Reason Breakdown */}
        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[#111827] mb-1">Payment Failure Reasons</h3>
          <p className="text-xs text-[#667085] mb-4">Total failed vs. recovered by failure category</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureReasons} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
                <XAxis dataKey="failure_reason" stroke="#667085" fontSize={11} tickLine={false} />
                <YAxis stroke="#667085" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E7EC', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2D6CDF" radius={[4, 4, 0, 0]} name="Total Failed" />
                <Bar dataKey="recovered" fill="#16A34A" radius={[4, 4, 0, 0]} name="Recovered" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Method Volume Performance */}
        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[#111827] mb-1">Payment Method Distribution</h3>
          <p className="text-xs text-[#667085] mb-4">Volume breakdown across UPI, Card, Netbanking, Wallet</p>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  dataKey="count"
                  nameKey="payment_method"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E7EC', borderRadius: '8px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#667085' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
