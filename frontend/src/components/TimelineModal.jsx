import React from 'react';
import { X, Clock, CheckCircle2, AlertOctagon, ShieldAlert, Cpu } from 'lucide-react';

export default function TimelineModal({ paymentId, timeline, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Audit Log Timeline for <span className="font-mono text-blue-400">{paymentId}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {timeline?.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-xs">No audit events recorded for this payment.</p>
          ) : (
            timeline.map((event, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-slate-800 space-y-1">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 tracking-wide">{event.event_type}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  State: <span className="text-slate-300">{event.previous_state || 'START'}</span> → <span className="text-blue-400 font-bold">{event.new_state}</span>
                </p>
                {event.details && (
                  <pre className="mt-1 p-2 bg-slate-950/80 rounded-lg text-[10px] text-slate-400 font-mono border border-slate-900 overflow-x-auto">
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
