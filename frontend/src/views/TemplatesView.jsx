import React, { useState } from 'react';
import { BookTemplate, MessageSquare, Mail, PhoneCall, Sparkles, Check, Copy, Edit2, Plus, ArrowRight } from 'lucide-react';

export default function TemplatesView() {
  const [activeChannel, setActiveChannel] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [previewModes, setPreviewModes] = useState({});
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const sampleValues = {
    customer_name: 'Ananya Sharma',
    amount: '15,000',
    payment_link: 'https://rzp.io/l/rec_9921',
    grace_expiry: '10 Sep 2026',
    invoice_num: 'INV-2026-884'
  };

  const [templates, setTemplates] = useState([
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
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Template content copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePreviewMode = (id) => {
    setPreviewModes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenEdit = (tpl) => {
    setEditingTemplate({ ...tpl });
  };

  const handleCreateNew = () => {
    setEditingTemplate({
      id: `tpl_${Date.now()}`,
      title: 'New Recovery Template',
      channel: 'WHATSAPP',
      flow: 'Custom Flow',
      content: 'Hi {{customer_name}}, your order for ₹{{amount}} is pending: {{payment_link}}',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      vars: ['customer_name', 'amount', 'payment_link']
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTemplate) return;

    // Detect variables inside content
    const matches = editingTemplate.content.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
    const vars = Array.from(new Set(matches.map(m => m.slice(2, -2))));

    setTemplates(prev => {
      const exists = prev.some(t => t.id === editingTemplate.id);
      if (exists) {
        return prev.map(t => t.id === editingTemplate.id ? { ...editingTemplate, vars } : t);
      }
      return [...prev, { ...editingTemplate, vars }];
    });

    setEditingTemplate(null);
    showToast('Template updated successfully');
  };

  const renderContent = (content, isPreview) => {
    const parts = content.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2);
        if (isPreview) {
          return (
            <span key={idx} className="px-2 py-0.5 mx-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300">
              {sampleValues[varName] || varName}
            </span>
          );
        }
        return (
          <span key={idx} className="px-2 py-0.5 mx-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold text-xs border border-blue-200 shadow-2xs inline-flex items-center gap-0.5">
            <span className="text-blue-500 font-mono">{`{`}</span>{varName}<span className="text-blue-500 font-mono">{`}`}</span>
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const filteredTemplates = activeChannel === 'ALL'
    ? templates
    : templates.filter(t => t.channel === activeChannel);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      
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

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
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
        {filteredTemplates.map(tpl => {
          const isPreview = previewModes[tpl.id];
          return (
            <div key={tpl.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase border ${tpl.badgeColor}`}>
                    {tpl.channel} • {tpl.flow}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePreviewMode(tpl.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                        isPreview
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPreview ? 'Sample Preview' : 'Template Tag View'}
                    </button>
                    <button
                      onClick={() => handleCopy(tpl.id, tpl.content)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copy template content"
                    >
                      {copiedId === tpl.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-2">{tpl.title}</h3>

                {/* Styled Template Content Box */}
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-sm font-sans text-slate-800 leading-relaxed">
                  "{renderContent(tpl.content, isPreview)}"
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 font-bold">Variables:</span>
                  {tpl.vars.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[11px]">
                      {`{${v}}`}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleOpenEdit(tpl)}
                  className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  Edit <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Edit Recovery Template
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Template Title</label>
                <input
                  type="text"
                  value={editingTemplate.title}
                  onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">Channel</label>
                  <select
                    value={editingTemplate.channel}
                    onChange={e => setEditingTemplate({ ...editingTemplate, channel: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="SMS">SMS</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="VOICE">VOICE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Pipeline Flow</label>
                  <input
                    type="text"
                    value={editingTemplate.flow}
                    onChange={e => setEditingTemplate({ ...editingTemplate, flow: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-600">Template Content (Use `{{variable}}` for dynamic tags)</label>
                </div>
                <textarea
                  value={editingTemplate.content}
                  onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  rows={4}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 font-sans leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800">
                <strong>Supported Variables:</strong> <code className="bg-white px-1.5 py-0.5 rounded border">{"{{customer_name}}"}</code>, <code className="bg-white px-1.5 py-0.5 rounded border">{"{{amount}}"}</code>, <code className="bg-white px-1.5 py-0.5 rounded border">{"{{payment_link}}"}</code>, <code className="bg-white px-1.5 py-0.5 rounded border">{"{{invoice_num}}"}</code>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingTemplate(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}

