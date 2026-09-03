import React, { useState, useEffect } from 'react';
import { PhoneCall, Play, Pause, CheckCircle2, XCircle, Clock, Volume2, Sparkles, AlertCircle, Phone, RefreshCw } from 'lucide-react';

export default function VoiceLogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: 'Ananya Sharma',
    customer_phone: '+919876543210',
    risk_amount: 15000,
    decline_reason: 'insufficient_balance'
  });

  const [generatedScript, setGeneratedScript] = useState('');

  const fetchVoiceLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/voice/logs');
      const json = await res.json();
      if (json.status === 'success') {
        setLogs(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch voice logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoiceLogs();
  }, []);

  const handlePlayAudio = (log) => {
    if (playingId === log.id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(log.script_text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      
      setPlayingId(log.id);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser environment.');
    }
  };

  const handleGenerateScript = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/voice/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.status === 'success') {
        setGeneratedScript(json.data.script_text);
      }
    } catch (err) {
      console.error('Error generating script:', err);
    }
  };

  const handleTriggerCall = async (e) => {
    e.preventDefault();
    try {
      setTriggering(true);
      const res = await fetch('http://localhost:5000/api/v1/voice/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          script_text: generatedScript || undefined
        })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setShowModal(false);
        fetchVoiceLogs();
      }
    } catch (err) {
      console.error('Error triggering voice call:', err);
    } finally {
      setTriggering(false);
    }
  };

  const updateOutcome = async (logId, outcome) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/voice/logs/${logId}/outcome`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ call_outcome: outcome })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setLogs(prev => prev.map(l => (l.id === logId || l._id === logId) ? { ...l, call_outcome: outcome } : l));
      }
    } catch (err) {
      console.error('Error updating outcome:', err);
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'PROMISE_TO_PAY':
        return <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Promise to Pay</span>;
      case 'ANSWERED':
        return <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> Call Answered</span>;
      case 'NO_ANSWER':
        return <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> No Answer</span>;
      case 'DECLINED':
        return <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Declined</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold">Pending</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <PhoneCall className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hinglish Voice Recovery Agent</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            AI Programmable Voice Channel (Twilio Sandboxed) generating code-mixed Hinglish voice call scripts for high-risk accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchVoiceLogs}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              handleGenerateScript();
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Trigger Voice Call
          </button>
        </div>
      </div>

      {/* Voice Logs List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-600" /> Executed Voice Call Interventions ({logs.length})
          </h3>
          <span className="text-xs text-slate-400 font-semibold">TTS Accent: Hindi/English (hi-IN / en-IN)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id || log._id} className="p-6 hover:bg-slate-50/60 transition-colors space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePlayAudio(log)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white transition-all shadow-md cursor-pointer ${
                      playingId === log.id ? 'bg-rose-500 shadow-rose-500/30 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    }`}
                    title={playingId === log.id ? 'Pause Hinglish Audio' : 'Play Synthesized Hinglish Audio'}
                  >
                    {playingId === log.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-extrabold text-slate-900">{log.customer_name}</h4>
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{log.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                      <span>Call SID: <strong className="font-mono text-slate-700">{log.call_provider_sid}</strong></span>
                      <span>•</span>
                      <span>Duration: <strong className="text-slate-700">{log.duration_seconds}s</strong></span>
                      <span>•</span>
                      <span>Provider: <strong className="text-slate-700">{log.call_provider}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Risk Amount</div>
                    <div className="text-lg font-extrabold text-slate-900 tabular-nums">₹{Number(log.risk_amount).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    {getOutcomeBadge(log.call_outcome)}
                  </div>
                </div>
              </div>

              {/* Script Text Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>AI Generated Hinglish Script</span>
                  <span className="text-blue-600 flex items-center gap-1 font-semibold"><Sparkles className="w-3 h-3" /> Code-mixed hi-IN / en-IN</span>
                </div>
                <p className="italic leading-relaxed text-slate-900 font-semibold">"{log.script_text}"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-extrabold text-slate-400 mr-2">Update Call Outcome:</span>
                <button
                  onClick={() => updateOutcome(log.id || log._id, 'PROMISE_TO_PAY')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Mark Promise to Pay (PTP)
                </button>
                <button
                  onClick={() => updateOutcome(log.id || log._id, 'ANSWERED')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Mark Answered
                </button>
                <button
                  onClick={() => updateOutcome(log.id || log._id, 'NO_ANSWER')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Mark No Answer
                </button>
                <button
                  onClick={() => updateOutcome(log.id || log._id, 'DECLINED')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Mark Declined
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> Trigger Hinglish Voice Call
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleTriggerCall} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Customer / Enterprise Name</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.customer_phone}
                  onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Risk Amount (INR)</label>
                <input
                  type="number"
                  value={formData.risk_amount}
                  onChange={e => setFormData({ ...formData, risk_amount: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-600">Generated Hinglish Script</label>
                  <button type="button" onClick={handleGenerateScript} className="text-blue-600 font-bold hover:underline">Regenerate Script</button>
                </div>
                <textarea
                  value={generatedScript}
                  onChange={e => setGeneratedScript(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 font-sans italic"
                  placeholder="Click Regenerate Script..."
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={triggering} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer">
                  {triggering ? 'Initiating Call...' : 'Place Call Leg'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
