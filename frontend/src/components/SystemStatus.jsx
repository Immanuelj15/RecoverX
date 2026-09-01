import React from 'react';
import { Server, Database, BrainCircuit, Cpu, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function SystemStatus() {
  const services = [
    { name: 'Backend API', icon: Server, status: 'Operational' },
    { name: 'MongoDB Data Cluster', icon: Database, status: 'Connected' },
    { name: 'XGBoost ML Service', icon: BrainCircuit, status: 'Operational' },
    { name: 'Groq LLM Engine', icon: Cpu, status: 'Operational' },
    { name: 'Razorpay Test Gateway', icon: ShieldCheck, status: 'Connected' },
  ];

  return (
    <div className="fintech-card bg-navy-800 border border-brand-border flex flex-col h-[400px]">
      <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-navy-900">
        <div>
          <h2 className="text-lg font-bold text-white">System Status</h2>
          <p className="text-brand-textSecondary text-xs mt-1">Live service health monitoring.</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isOk = service.status === 'Operational' || service.status === 'Connected';
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-900 border border-brand-border flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-textSecondary" />
                  </div>
                  <span className="text-sm font-medium text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-brand-textSecondary">
                    {service.status}
                  </span>
                  {isOk ? (
                    <CheckCircle2 className="w-4 h-4 text-fintech-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-fintech-danger" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-brand-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-textSecondary">Last Checked</span>
            <span className="text-white font-mono">{new Date().toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
