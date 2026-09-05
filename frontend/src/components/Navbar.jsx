import React from 'react';
import { Search, Bell, Shield, RefreshCw } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing, searchQuery, setSearchQuery, onOpenCommandPalette }) {
  return (
    <header className="h-16 bg-white border-b border-[#E4E7EC] px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input with Command Palette Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div
          onClick={onOpenCommandPalette}
          className="relative w-full cursor-pointer group"
        >
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085] group-hover:text-[#2D6CDF]" />
          <input
            type="text"
            readOnly
            placeholder="Search payment ID, customer ID... (Press Ctrl + K)"
            value={searchQuery || ''}
            className="w-full pl-10 pr-16 py-2 text-xs bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg cursor-pointer text-[#111827] placeholder-[#98A2B3] group-hover:border-[#C7D7FE]"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white border border-[#E4E7EC] text-[10px] font-mono font-semibold text-[#667085] shadow-2xl">
            ⌘K
          </div>
        </div>
      </div>

      {/* System Status & Actions */}
      <div className="flex items-center gap-5">
        {/* System Operational Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-medium text-[#16A34A]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>AI Engine Operational</span>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#344054] hover:text-[#111827] bg-[#F7F9FC] hover:bg-[#EAECF0] border border-[#E4E7EC] rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Data</span>
        </button>

        {/* Notifications & User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#E4E7EC]">
          <button className="p-2 text-[#667085] hover:text-[#111827] hover:bg-[#F7F9FC] rounded-lg relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-[#DC2626] rounded-full absolute top-1.5 right-1.5"></span>
          </button>
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-[#0C2651] text-white flex items-center justify-center font-bold text-xs">
              RZ
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-[#111827]">Demo Merchant</div>
              <div className="text-[10px] text-[#667085]">MERCHANT_DEMO_001</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
