import React from 'react';
import { Activity, Bell, Settings, User, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function TopNav() {
  const navLinks = [
    { name: 'Overview', active: true },
    { name: 'Recovery Cases', active: false },
    { name: 'Analytics', active: false },
    { name: 'Audit Trail', active: false },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-navy-900 border-b border-brand-border/50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Branding */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-brand-blue flex items-center justify-center shadow-glow">
              <span className="text-white font-bold font-mono text-sm tracking-tighter">RX</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-tight tracking-wide">RecoverX</span>
              <span className="text-brand-textSecondary text-[10px] uppercase font-semibold tracking-wider">AI Revenue Recovery</span>
            </div>
          </div>

          {/* CENTER/LEFT: Links */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href="#"
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  link.active 
                    ? "bg-navy-800 text-white" 
                    : "text-brand-textSecondary hover:text-white hover:bg-navy-800/50"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT: Status & Controls */}
        <div className="flex items-center gap-5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-fintech-successBg border border-fintech-successBorder">
            <div className="w-2 h-2 rounded-full bg-fintech-success animate-pulse" />
            <span className="text-fintech-success text-xs font-semibold tracking-wide">All Systems Operational</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-navy-800 border border-brand-border text-xs font-medium text-brand-textSecondary">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
            Test Mode
          </div>

          <div className="h-6 w-px bg-brand-border/50 mx-1" />

          <div className="flex items-center gap-3 text-brand-textSecondary">
            <button className="p-1.5 hover:text-white hover:bg-navy-800 rounded-md transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:text-white hover:bg-navy-800 rounded-md transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-navy-800 border border-brand-border flex items-center justify-center ml-2 cursor-pointer hover:border-brand-textSecondary transition-colors">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
