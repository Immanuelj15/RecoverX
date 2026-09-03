import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, Cpu, Bell, Check, Save, Zap, RefreshCw } from 'lucide-react';

export default function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    merchant_name: 'RecoverX Demo Merchant',
    merchant_id: 'MERCHANT_DEMO_001',
    razorpay_key: 'rzp_test_992384102948123',
    backend_url: 'http://localhost:5000',
    ml_service_url: 'http://localhost:8000',
    execution_mode: 'AUTONOMOUS',
    webhook_secret: 'whsec_live_fresh_1003_secure_token_2026',
    email_notifications: true,
    slack_webhook: 'https://hooks.slack.com/services/T000/B000/XXXX'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Merchant Operational Settings</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            Manage Razorpay API gateway credentials, backend endpoints, and autonomous execution modes.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {saved ? 'Settings Saved!' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Merchant & API Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-blue-600" /> Razorpay Integration Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 mb-1">Merchant Organization Name</label>
              <input
                type="text"
                value={formData.merchant_name}
                onChange={e => setFormData({ ...formData, merchant_name: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Merchant Account ID</label>
              <input
                type="text"
                value={formData.merchant_id}
                readOnly
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Razorpay Key ID (Test / Live)</label>
              <input
                type="text"
                value={formData.razorpay_key}
                onChange={e => setFormData({ ...formData, razorpay_key: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Webhook Secret Token</label>
              <input
                type="password"
                value={formData.webhook_secret}
                onChange={e => setFormData({ ...formData, webhook_secret: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* AI Execution Mode */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-blue-600" /> AI Agent Autonomous Execution Mode
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, execution_mode: 'AUTONOMOUS' })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                formData.execution_mode === 'AUTONOMOUS'
                  ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" /> Fully Autonomous Mode
                </span>
                {formData.execution_mode === 'AUTONOMOUS' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AI Agent automatically triggers UPI smart retries, WhatsApp nudges, and Hinglish calls per policy rules.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, execution_mode: 'HUMAN_IN_THE_LOOP' })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                formData.execution_mode === 'HUMAN_IN_THE_LOOP'
                  ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Human-in-the-Loop Approval
                </span>
                {formData.execution_mode === 'HUMAN_IN_THE_LOOP' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Requires manual merchant operations sign-off for all interventions above ₹5,000.
              </p>
            </button>
          </div>
        </div>

        {/* Microservices Endpoint Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <RefreshCw className="w-4 h-4 text-blue-600" /> Microservices Endpoints
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 mb-1">Node.js Express Backend URL</label>
              <input
                type="text"
                value={formData.backend_url}
                onChange={e => setFormData({ ...formData, backend_url: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Python FastAPI ML Service URL</label>
              <input
                type="text"
                value={formData.ml_service_url}
                onChange={e => setFormData({ ...formData, ml_service_url: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
