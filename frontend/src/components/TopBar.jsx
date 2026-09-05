import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Bell, ChevronDown, LogOut, User, Check, AlertTriangle, CheckCircle2, Bot, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CommandPalette from './CommandPalette';

export default function TopBar({ activeItem, activeTab, setActiveTab, recoveryState }) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [toastMessage, setToastMessage] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Payment Failure Ingested',
      desc: 'Ananya Tech (₹15,000) failed due to insufficient balance.',
      time: '2 mins ago',
      type: 'warning',
      unread: true
    },
    {
      id: 2,
      title: 'AI Recovery Strategy Executed',
      desc: 'Smart retry scheduled for Acme Corp (₹12,500).',
      time: '14 mins ago',
      type: 'ai',
      unread: true
    },
    {
      id: 3,
      title: 'Human Escalation Guardrail',
      desc: 'High-value transaction ₹52,000 requires manual sign-off.',
      time: '1 hour ago',
      type: 'escalation',
      unread: true
    },
    {
      id: 4,
      title: 'Revenue Recovered',
      desc: '₹42,500 successfully recovered via Smart Retry.',
      time: '3 hours ago',
      type: 'success',
      unread: false
    }
  ]);

  const dateMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target)) setShowDateMenu(false);
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) setShowNotifications(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const getBreadcrumb = () => {
    if (activeItem) {
      return `Recovery Queue / ${activeItem.id.split('-')[0]}`;
    }
    const titles = {
      overview: 'Revenue Recovery Overview',
      cases: 'Recovery Queue',
      'human-review': 'Human Escalation Center',
      'ai-decisions': 'AI Decision Center',
      analytics: 'Recovery Analytics',
      audit: 'Compliance Audit Trail',
      settings: 'Recovery Policy Guardrails',
      'model-insights': 'XGBoost Model Insights',
      batch: 'Batch Recovery Simulation',
      voice: 'Hinglish AI Voice Calls',
      promises: 'Promises to Pay',
      integrations: 'Settings & API Keys'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getInitials = (name) => {
    if (!name) return 'DM';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const dateOptions = [
    { label: 'Today', sub: 'Sep 05, 2026' },
    { label: 'Last 7 Days', sub: 'Aug 29 - Sep 05' },
    { label: 'Last 30 Days', sub: 'Aug 06 - Sep 05' },
    { label: 'Last 90 Days', sub: 'Jun 07 - Sep 05' },
    { label: 'Year to Date (YTD)', sub: 'Jan 01 - Sep 05' }
  ];

  return (
    <>
      <header className="h-[72px] bg-[#070B12] border-b border-[#1E2B3D] flex items-center justify-between px-8 sticky top-0 z-40 shadow-xl">
        
        {/* Left: Breadcrumb / Title & TEST MODE Badge */}
        <div className="flex items-center gap-4">
          <div className="h-6 w-1 rounded-full bg-[#2D7FF9]"></div>
          <h2 className="text-base lg:text-lg font-black text-white tracking-tight">{getBreadcrumb()}</h2>
          
          {/* Prominent TEST MODE Badge */}
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping"></span>
            TEST MODE
          </span>
        </div>

        {/* Middle: Global Search */}
        <div className="flex-1 max-w-md mx-6 relative hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-10 px-3.5 border border-[#1E2B3D] rounded-xl bg-[#101927] text-[#94A3B8] text-xs lg:text-sm font-medium transition-all flex items-center justify-between hover:border-[#2D7FF9] hover:text-white focus:outline-none shadow-inner cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Search className="h-4 w-4 text-[#64748B] group-hover:text-[#2D7FF9] shrink-0" />
              <span className="truncate whitespace-nowrap text-[#64748B] group-hover:text-[#94A3B8]">Search payment IDs, customers, SHAP drivers...</span>
            </div>
            <kbd className="shrink-0 text-[#94A3B8] text-[10px] font-bold px-1.5 py-0.5 border border-[#1E2B3D] rounded-md bg-[#070B12] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-5">
          
          {/* Merchant Context */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-black text-white">RecoverX Demo Store</span>
            <span className="text-[10px] text-[#10B981] font-mono">Razorpay Gateway Sandboxed</span>
          </div>

          {/* Interactive Date Range Picker */}
          <div className="relative" ref={dateMenuRef}>
            <button
              onClick={() => setShowDateMenu(!showDateMenu)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#1E2B3D] bg-[#101927] text-xs text-[#F8FAFC] font-semibold hover:border-[#2D7FF9] transition-all cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4 text-[#2D7FF9]" />
              <span>{selectedDateRange}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${showDateMenu ? 'rotate-180' : ''}`} />
            </button>

            {showDateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#101927] rounded-2xl shadow-2xl border border-[#1E2B3D] py-2 z-50 animate-fade-in text-[#F8FAFC]">
                <div className="px-4 py-2 border-b border-[#1E2B3D] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Select Filter Window
                </div>
                {dateOptions.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedDateRange(opt.label);
                      setShowDateMenu(false);
                      showToast(`Filter set to ${opt.label}`);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedDateRange === opt.label
                        ? 'bg-[#141F2E] text-[#2D7FF9]'
                        : 'text-[#94A3B8] hover:bg-[#0B1220] hover:text-white'
                    }`}
                  >
                    <div>
                      <div>{opt.label}</div>
                      <div className="text-[10px] text-[#64748B] font-normal">{opt.sub}</div>
                    </div>
                    {selectedDateRange === opt.label && <Check className="w-4 h-4 text-[#2D7FF9]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Notification Bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#94A3B8] hover:text-white transition-colors rounded-xl hover:bg-[#101927] border border-transparent hover:border-[#1E2B3D] cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]"></span>
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#101927] rounded-2xl shadow-2xl border border-[#1E2B3D] py-3 z-50 animate-fade-in text-[#F8FAFC]">
                <div className="px-4 pb-3 border-b border-[#1E2B3D] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-extrabold border border-[#EF4444]/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-bold text-[#2D7FF9] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#1E2B3D]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#64748B]">
                      No notifications available right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 flex items-start gap-3 hover:bg-[#0B1220] transition-colors ${
                          n.unread ? 'bg-[#141F2E]' : ''
                        }`}
                      >
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />}
                        {n.type === 'ai' && <Bot className="w-4 h-4 text-[#2D7FF9] mt-0.5 flex-shrink-0" />}
                        {n.type === 'escalation' && <ShieldAlert className="w-4 h-4 text-[#EF4444] mt-0.5 flex-shrink-0" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />}
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{n.title}</span>
                            <span className="text-[10px] text-[#64748B]">{n.time}</span>
                          </div>
                          <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{n.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 pt-2.5 border-t border-[#1E2B3D] text-center">
                    <button
                      onClick={clearNotifications}
                      className="text-xs font-semibold text-[#64748B] hover:text-[#94A3B8] cursor-pointer"
                    >
                      Clear Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 pl-4 border-l border-[#1E2B3D] cursor-pointer group"
              title={user?.name || 'Demo Merchant'}
            >
              <div className="w-9 h-9 rounded-full bg-[#2D7FF9] hover:bg-[#2D7FF9]/80 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-[#2D7FF9]/20 transition-all">
                {getInitials(user?.name)}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] group-hover:text-[#2D7FF9] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#101927] rounded-2xl shadow-2xl border border-[#1E2B3D] py-2 z-50 animate-fade-in text-[#F8FAFC]">
                <div className="px-4 py-2.5 border-b border-[#1E2B3D]">
                  <p className="text-xs font-black text-white">{user?.name || 'Demo Merchant'}</p>
                  <p className="text-xs text-[#94A3B8] font-mono truncate">{user?.email || 'demo@recoverx.ai'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (setActiveTab) setActiveTab('settings');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-[#94A3B8] hover:bg-[#0B1220] hover:text-white flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#64748B]" /> Policy Guardrails
                  </button>
                </div>

                <div className="pt-1 border-t border-[#1E2B3D]">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#EF4444] hover:bg-[#EF4444]/10 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101927] border border-[#2D7FF9] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tabId, item) => {
          if (setActiveTab) setActiveTab(tabId);
          setIsSearchOpen(false);
        }}
        transactions={recoveryState?.transactions || []}
      />
    </>
  );
}
