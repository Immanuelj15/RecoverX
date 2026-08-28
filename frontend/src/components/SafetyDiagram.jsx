import React from 'react';
import { Cpu, Bot, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Tooltip from './Tooltip';

export default function SafetyDiagram() {
  const steps = [
    {
      title: 'XGBoost',
      role: 'PREDICTS',
      description: 'Calculates P(recovery) score & SHAP feature contributions.',
      icon: Cpu,
      color: 'text-[#2D6CDF]',
      bg: 'bg-[#EEF4FF]',
      border: 'border-[#C7D7FE]',
      tooltipTerm: 'XGBoost',
      tooltipText: 'Gradient boosted machine learning model trained to predict recovery likelihood based on historical payment features.'
    },
    {
      title: 'Groq LLM',
      role: 'RECOMMENDS',
      description: 'Generates qualitative strategy rationale & customer nudge.',
      icon: Bot,
      color: 'text-[#635BFF]',
      bg: 'bg-[#EEF2FF]',
      border: 'border-[#C7D2FE]',
      tooltipTerm: 'Groq LLM',
      tooltipText: 'Ultra-low latency LLM provider running openai/gpt-oss-20b with JSON schema validation for reasoning.'
    },
    {
      title: 'Policy Engine',
      role: 'CONTROLS',
      description: 'Enforces non-bypassable merchant guardrails & rate limits.',
      icon: ShieldCheck,
      color: 'text-[#16A34A]',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#BBF7D0]',
      tooltipTerm: 'Policy Engine',
      tooltipText: 'Deterministic compliance gatekeeper that validates whether proposed AI actions comply with financial safety rules.'
    },
    {
      title: 'Executor',
      role: 'EXECUTES',
      description: 'Triggers Razorpay retry, payment nudge, or human escalation.',
      icon: Zap,
      color: 'text-[#F59E0B]',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      tooltipTerm: 'Recovery Executor',
      tooltipText: 'Service that dispatches approved recovery interventions via gateway APIs or merchant queues.'
    }
  ];

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <span>Autonomous Safety & Control Architecture</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
              Non-Bypassable Safety
            </span>
          </h3>
          <p className="text-xs text-[#667085]">
            AI recommends, but Policy Engine strictly enforces financial permissions before execution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex items-center">
              <div className={`w-full p-4 rounded-xl border ${step.border} ${step.bg} transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                    <Tooltip term={step.tooltipTerm} text={step.tooltipText}>
                      {step.title}
                    </Tooltip>
                  </span>
                  <Icon className={`w-4 h-4 ${step.color}`} />
                </div>
                <div className={`text-xs font-extrabold ${step.color} tracking-wide uppercase mb-1`}>
                  {step.role}
                </div>
                <p className="text-[11px] text-[#667085] leading-relaxed">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-4 h-4 text-[#98A2B3] absolute -right-3 z-10 bg-white rounded-full p-0.5 border border-[#E4E7EC]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
