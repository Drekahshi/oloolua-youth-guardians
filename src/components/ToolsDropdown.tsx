'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Shield, 
  PlusCircle, 
  Globe, 
  ChevronDown, 
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react';

interface ToolsDropdownProps {
  onOpenRecordActivity?: () => void;
}

export default function ToolsDropdown({ onOpenRecordActivity }: ToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#e4c878] text-neutral-950 hover:bg-amber-300 transition-all shadow-sm group"
        aria-expanded={isOpen}
      >
        <Wrench className="w-3.5 h-3.5 text-neutral-950 group-hover:rotate-12 transition-transform" />
        <span>Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu Options */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0b1c14] border border-[#e4c878]/30 shadow-2xl shadow-black/80 py-2 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Guardian Toolset</span>
            <Link
              href="/tools"
              onClick={() => setIsOpen(false)}
              className="text-[10px] text-[#e4c878] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <Sliders className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Option 1: Guardian Hub */}
          <Link
            href="/tools"
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-emerald-950/50 transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-[#e4c878]">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-[#e4c878] transition-colors flex items-center gap-1">
                <span>Guardian Hub</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                CFA ledger, nursery stock & seedbed ops
              </p>
            </div>
          </Link>

          {/* Option 2: Record Activity */}
          <button
            onClick={() => {
              setIsOpen(false);
              if (onOpenRecordActivity) {
                onOpenRecordActivity();
              }
            }}
            className="w-full text-left flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-amber-950/40 transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 text-[#e4c878]">
              <PlusCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-[#e4c878] transition-colors flex items-center gap-1">
                <span>Record Activity</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-[#e4c878] border border-amber-800">Logger</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                Log planting, seedling potting, maintenance
              </p>
            </div>
          </button>

          {/* Footer of Dropdown */}
          <div className="mt-1 pt-1.5 border-t border-white/10 px-3 py-1">
            <Link
              href="/tools"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 text-[11px] font-bold text-[#e4c878] transition-colors"
            >
              Open Unified Tools Console →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
