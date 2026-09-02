import React from 'react';
import KPICards from '../components/KPICards';
import SystemStatus from '../components/SystemStatus';
import { PlayCircle, Eye } from 'lucide-react';

export default function OverviewView({ metrics, isLoading, error, simulateBatch, setActiveTab }) {
  const handleSimulateBatch = async () => {
    await simulateBatch();
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto flex flex-col gap-8 animate-fade-in">
      {/* Hero / Command Center */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-textPrimary tracking-tight">Revenue Recovery Command Center</h1>
          <p className="text-brand-textSecondary mt-2">Recover revenue before it becomes lost revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('cases')}
            className="px-4 py-2 rounded-lg border border-brand-border text-brand-textPrimary hover:bg-brand-surface transition-colors text-sm font-medium flex items-center gap-2 bg-white"
          >
            <Eye className="w-4 h-4 text-brand-textSecondary" />
            View Live Events
          </button>
          <button 
            onClick={handleSimulateBatch} 
            disabled={isLoading}
            className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-primaryHover text-white transition-colors text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            Run Recovery Scan
          </button>
        </div>
      </section>

      {error && (
        <div className="p-4 bg-status-dangerBg border border-status-dangerBorder text-status-dangerText rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* KPIs */}
      <section>
        <KPICards metrics={metrics} />
      </section>

      {/* System Status Overview */}
      <section className="max-w-md">
        <SystemStatus />
      </section>
    </div>
  );
}
