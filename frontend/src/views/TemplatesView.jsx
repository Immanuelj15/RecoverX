import React, { useState } from 'react';
import { BookTemplate, MessageSquare, Mail, PhoneCall, Sparkles, Check, Copy, Edit2, Plus, ArrowRight } from 'lucide-react';

export default function TemplatesView() {
  const [activeChannel, setActiveChannel] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const initialTemplates = [
    {
      id: 'tpl_1',
      title: 'Smart UPI Retry Nudge',
      channel: 'SMS',
      flow: 'Payment Degradation',
      content: 'Hi {{customer_name}}, your payment of ₹{{amount}} experienced a bank timeout. Tap to retry instantly via Razorpay UPI: {{payment_link}}',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      vars: ['customer_name', 'amount', 'payment_link']
    },
    {
      id: 'tpl_2',
      title: '1-Click Cart Recovery WhatsApp',
      channel: 'WHATSAPP',
      flow: 'Checkout Drop-off',
      content: 'Namaste {{customer_name}}! We noticed your checkout cart for ₹{{amount}} was interrupted. Your items are reserved for 24h: {{payment_link}}',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      vars: ['customer_name', 'amount', 'payment_link']
    },
    {
      id: 'tpl_3',
      title: 'Subscription Grace Period Dunning',
      channel: 'EMAIL',
      flow: 'Failed Subscriptions',
      content: 'Dear {{customer_name}}, your monthly subscription renewal of ₹{{amount}} failed. Update your payment details before {{grace_expiry}} to prevent service pause: {{payment_link}}',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      vars: ['customer_name', 'amount', 'grace_expiry', 'payment_link']
    },
    {
      id: 'tpl_4',
      title: 'B2B Overdue Invoice & PTP Call Request',
      channel: 'EMAIL',
      flow: 'B2B Receivables',
      content: 'Hello {{customer_name}} Team, Invoice #{{invoice_num}} (₹{{amount}}) is now 15 days overdue. Click to record a Promise to Pay (PTP) date or settle online: {{payment_link}}',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      vars: ['customer_name', 'invoice_num', 'amount', 'payment_link']
    },
    {
      id: 'tpl_5',
      title: 'Hinglish AI Voice Recovery Call Script',
      channel: 'VOICE',
      flow: 'Hinglish Voice Agent',
      content: 'Namaste {{customer_name}} ji, RecoverX AI Agent se baat kar rahe hain. Aapka ₹{{amount}} ka payment pending hai. Kya hum instant UPI link WhatsApp par bhejein?',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      vars: ['customer_name', 'amount']
    }
  ];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = activeChannel === 'ALL'
    ? initialTemplates
    : initialTemplates.filter(t => t.channel === activeChannel);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BookTemplate className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Intervention Message Templates</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            Manage multi-channel recovery templates for WhatsApp, SMS, Email, and Hinglish AI Voice calls.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Create Custom Template
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['ALL', 'WHATSAPP', 'SMS', 'EMAIL', 'VOICE'].map(ch => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeChannel === ch
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {ch === 'ALL' ? 'All Channels' : ch}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map(tpl => (
          <div key={tpl.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase border ${tpl.badgeColor}`}>
                  {tpl.channel} • {tpl.flow}
                </span>
                <button
                  onClick={() => handleCopy(tpl.id, tpl.content)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Copy template content"
                >
                  {copiedId === tpl.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-2">{tpl.title}</h3>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                "{tpl.content}"
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Variables:</span>
                {tpl.vars.map(v => (
                  <span key={v} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
              <button className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer">
                Edit <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
