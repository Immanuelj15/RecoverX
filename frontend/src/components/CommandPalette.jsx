import React, { useState, useEffect } from 'react';
import { Search, X, LayoutDashboard, CreditCard, Bot, BarChart3, FileText, Cpu, Settings, ArrowRight, PhoneCall } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate, transactions = [] }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open command palette
          onClose(true);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const routes = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { id: 'cases', label: 'Recovery Queue & Cases', icon: CreditCard, category: 'Navigation' },
    { id: 'batch', label: 'Workflows & Batch Simulator', icon: Bot, category: 'Navigation' },
    { id: 'voice', label: 'Hinglish Voice Recovery Calls', icon: PhoneCall, category: 'Navigation' },
    { id: 'promises', label: 'Promises to Pay (PTP)', icon: FileText, category: 'Navigation' },
    { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3, category: 'Navigation' },
    { id: 'audit', label: 'Compliance Audit Trail', icon: FileText, category: 'Navigation' },
    { id: 'settings', label: 'Guardrail Policy Settings', icon: Settings, category: 'Navigation' }
  ];

  const matchingTransactions = transactions.filter(
    (t) =>
      t.payment_id?.toLowerCase().includes(query.toLowerCase()) ||
      t.customer_id?.toLowerCase().includes(query.toLowerCase()) ||
      t.failure_reason?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const matchingRoutes = routes.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="p-4 border-b border-[#E4E7EC] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#667085]" />
          <input
            type="text"
            placeholder="Search payment ID, customer ID, or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm bg-transparent focus:outline-none text-[#111827] placeholder-[#98A2B3]"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#98A2B3] hover:text-[#111827] rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs space-y-3">
          {/* Navigation Category */}
          {matchingRoutes.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider">
                Views & Navigation
              </div>
              <div className="space-y-1 mt-1">
                {matchingRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.id}
                      onClick={() => {
                        onNavigate(route.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#EEF4FF] hover:text-[#0C2651] text-[#344054] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#2D6CDF]" />
                        <span className="font-semibold text-sm">{route.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#98A2B3]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Results */}
          {matchingTransactions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider">
                Matching Failed Payments
              </div>
              <div className="space-y-1 mt-1">
                {matchingTransactions.map((t) => (
                  <button
                    key={t.payment_id}
                    onClick={() => {
                      onNavigate('payments', t);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F8FAFC] text-[#344054] transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#2D6CDF] mr-2">{t.payment_id}</span>
                      <span className="text-[#667085]">Customer: {t.customer_id}</span>
                    </div>
                    <span className="font-bold text-[#111827]">₹{t.amount_inr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingRoutes.length === 0 && matchingTransactions.length === 0 && (
            <div className="py-8 text-center text-[#667085]">
              No matching commands or payment records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-[#F7F9FC] border-t border-[#E4E7EC] flex items-center justify-between text-[11px] text-[#667085]">
          <span>Navigate with <strong>↑ ↓</strong> and press <strong>Enter</strong></span>
          <span>Press <strong>ESC</strong> to exit</span>
        </div>
      </div>
    </div>
  );
}
