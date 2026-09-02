import React from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';

export default function AnalyticsView({ chartsData, isLoading }) {
  return (
    <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-8 h-full animate-fade-in">
      <div className="border-b border-brand-border pb-6">
        <h1 className="text-2xl font-extrabold text-brand-textPrimary tracking-tight">Recovery Analytics</h1>
        <p className="text-sm font-medium text-brand-textSecondary mt-1">Analyze performance, recovery rates, and leakage trends.</p>
      </div>

      <section className="flex-1 bg-white fintech-card p-6">
        <AnalyticsCharts chartsData={chartsData} isLoading={isLoading} />
      </section>
    </div>
  );
}
