import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Bell, ChevronDown, LogOut, User, Check, X, AlertTriangle, CheckCircle2, Clock, Bot, RefreshCw } from 'lucide-react';
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

  // Sample real-time notifications
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
      desc: 'Delayed retry scheduled for Acme Corp (₹12,500).',
      time: '14 mins ago',
      type: 'ai',
      unread: true
    },
    {
      id: 3,
      title: 'Human Escalation Guardrail',
      desc: 'High-value transaction ₹75,000 requires manual approval.',
      time: '1 hour ago',
      type: 'escalation',
      unread: true
    },
    {
      id: 4,
      title: 'Revenue Recovered',
      desc: '₹8,499 successfully recovered via Smart Retry.',
      time: '3 hours ago',
      type: 'success',
      unread: false
    }
  ]);

  const dateMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Listen for global Ctrl+K / Cmd+K
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

  // Close menus on outside click
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
      batch: 'Run Recovery Batch',
      promises: 'Promises to Pay',
      analytics: 'Recovery Analytics',
      audit: 'Audit Trail',
      settings: 'Recovery Policies',
      integrations: 'Integrations'
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
    { label: 'Today', sub: 'Sep 03, 2026' },
    { label: 'Last 7 Days', sub: 'Aug 27 - Sep 03' },
    { label: 'Last 30 Days', sub: 'Aug 04 - Sep 03' },
    { label: 'Last 90 Days', sub: 'Jun 05 - Sep 03' },
    { label: 'Year to Date (YTD)', sub: 'Jan 01 - Sep 03' }
  ];

  return (
    <>
      <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-2xs">
        
        {/* Left: Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-blue-600"></div>
          <h2 className="text-base lg:text-lg font-extrabold text-slate-900 tracking-tight">{getBreadcrumb()}</h2>
        </div>

        {/* Middle: Global Search */}
        <div className="flex-1 max-w-md mx-6 relative hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-10 px-3.5 border border-slate-200 rounded-xl bg-slate-50/80 text-slate-400 text-xs lg:text-sm font-medium transition-all flex items-center justify-between hover:bg-white hover:border-blue-400 focus:outline-none shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
              <span className="truncate whitespace-nowrap text-slate-400 group-hover:text-slate-600">Search cases, customers, payment IDs...</span>
            </div>
            <kbd className="shrink-0 text-slate-400 text-[11px] font-bold px-1.5 py-0.5 border border-slate-200 rounded-md bg-white shadow-2xs font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-5">
          
          {/* Interactive Date Range Picker */}
          <div className="relative" ref={dateMenuRef}>
            <button
              onClick={() => setShowDateMenu(!showDateMenu)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer bg-white shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{selectedDateRange}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDateMenu ? 'rotate-180' : ''}`} />
            </button>

            {showDateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div>{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.sub}</div>
                    </div>
                    {selectedDateRange === opt.label && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Interactive Notification Bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fade-in">
                <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-extrabold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications available right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                          n.unread ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />}
                        {n.type === 'ai' && <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
                        {n.type === 'escalation' && <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />}
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
                    <button
                      onClick={clearNotifications}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Clear Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile & Logout Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 pl-4 border-l border-slate-200 cursor-pointer group"
              title={user?.name || 'Demo Merchant'}
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20 transition-all">
                {getInitials(user?.name)}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Demo Merchant'}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">{user?.email || 'demo@recoverx.ai'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (setActiveTab) setActiveTab('settings');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Policy & Settings
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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

