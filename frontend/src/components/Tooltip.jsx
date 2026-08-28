import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ term, text, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center gap-1 group">
      {children || <span className="underline decoration-dotted underline-offset-2 cursor-help">{term}</span>}
      <HelpCircle
        className="w-3.5 h-3.5 text-[#98A2B3] group-hover:text-[#2D6CDF] cursor-help inline shrink-0"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#0C2651] text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none border border-[#1C4991] leading-relaxed">
          <div className="font-semibold text-[#60A5FA] mb-1">{term}</div>
          <p className="text-[#E2E8F0] font-normal text-[11px]">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0C2651]"></div>
        </div>
      )}
    </span>
  );
}
