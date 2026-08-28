import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LiveActivityWidget({ transactions = [] }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (transactions.length > 0) {
      const live = transactions.slice(0, 4).map((t, idx) => {
        const isSuccess = t.recovery_state === 'RECOVERY_SUCCESS' || t.recovered === 1;
        const isEscalated = t.recovery_state === 'ESCALATED' || t.outcome === 'escalated';
        const isStopped = t.recovery_state === 'STOPPED' || t.outcome === 'stopped';

        let label = isSuccess ? 'Recovered' : isEscalated ? 'Escalated to Support' : isStopped ? 'Guardrail Stopped' : 'Action Approved';
        let type = isSuccess ? 'success' : isEscalated ? 'escalated' : isStopped ? 'stopped' : 'info';

        return {
          id: t.payment_id,
          amount: t.amount_inr || (t.amount_paise ? t.amount_paise / 100 : 0),
          type,
          label,
          time: `${(idx + 1) * 3} min ago`
        };
      });
      setEvents(live);
    }
  }, [transactions]);

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2D6CDF] animate-pulse" />
          <h3 className="text-sm font-bold text-[#111827]">Live Recovery Activity Stream</h3>
        </div>
        <span className="text-[11px] text-[#667085] font-mono">Real-time Stream</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {events.map((ev, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border flex items-center justify-between ${
              ev.type === 'success'
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]'
                : ev.type === 'escalated'
                ? 'bg-[#EEF4FF] border-[#C7D7FE] text-[#2D6CDF]'
                : 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
            }`}
          >
            <div>
              <div className="font-bold font-mono">{ev.id}</div>
              <div className="font-semibold text-[11px] mt-0.5">
                ₹{ev.amount.toLocaleString('en-IN')} • {ev.label}
              </div>
            </div>
            <span className="text-[10px] text-[#667085] font-medium shrink-0 ml-2">{ev.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
