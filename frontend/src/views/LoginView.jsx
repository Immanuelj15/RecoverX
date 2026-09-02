import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sparkles, CheckCircle2, Repeat, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both work email and password.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@recoverx.ai');
    setPassword('demo-password');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200/80 z-10"
      >
        {/* Left Column - Branding & Value Proposition */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 lg:p-12 flex flex-col justify-between text-white relative">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">RECOVERX</span>
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">AI Revenue Ops</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Recover revenue. <br />
              <span className="text-blue-400">Automatically. Safely.</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium">
              AI-powered revenue recovery operations platform for modern fintechs and B2B SaaS merchants.
            </p>

            {/* Feature Highlights */}
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Custom XGBoost ML Failure Prediction</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Bounded AI Policy Engine & Guardrails</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>SHAP Explainability & Groq LLM Reasoning</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-Time Audit Trail & Money Recovered</span>
              </li>
            </ul>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 pt-8 mt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Enterprise Compliance Ready
            </span>
            <span className="font-bold tracking-widest uppercase text-[10px] text-blue-400">v2.4.0</span>
          </div>
        </div>

        {/* Right Column - Merchant Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Merchant Control Plane
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Sign in to your merchant dashboard to manage revenue recovery.
              </p>
            </div>

            {/* Quick Demo Fill Button */}
            <div className="mb-6 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 live-dot" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Demo Merchant Account</span>
                  <span className="text-[11px] font-medium text-slate-500">demo@recoverx.ai</span>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                Auto Fill
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Work Email */}
              <div>
                <label className="block text-xs uppercase font-bold text-slate-600 tracking-wider mb-2">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchant@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase font-bold text-slate-600 tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">Keep me signed in for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 text-white font-extrabold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authenticating Merchant...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Control Plane</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-slate-400 font-medium">
              Protected by 256-bit TLS Encryption & Enterprise OAuth 2.0 Policy
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
