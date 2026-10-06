'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ToolsDropdown from '@/components/ToolsDropdown';
import { Menu, X, Shield, ChevronDown, Wrench, PlusCircle } from 'lucide-react';

/*
 * The one menu for the whole site (rendered in the root layout).
 * Seven main links fit on one line; the rest sit under More.
 * "Record Activity" opens the form on pages that have it, else on /tools.
 */

const MAIN = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Activities', href: '/activities' },
  { name: 'Arts in Nature', href: '/arts' },
  { name: 'Nursery', href: '/seedlings' },
  { name: 'Projects', href: '/projects' },
  { name: 'Gallery', href: '/photogallery' },
];
const MORE = [
  { name: 'Mission', href: '/mission' },
  { name: 'Vision', href: '/vision' },
  { name: 'Beekeeping', href: '/beekeeping' },
  { name: 'Community', href: '/workshops' },
];

/** Ask the current page to open its Record Activity form; go to /tools if none does. */
export function openRecordActivity(router: ReturnType<typeof useRouter>) {
  const ev = new CustomEvent('oyg:record-activity', { cancelable: true });
  const handled = !window.dispatchEvent(ev);
  if (!handled) router.push('/tools?record=1');
}

/** For pages with a Record Activity form: open it when the menu asks. */
export function useRecordActivityRequest(open: () => void) {
  const ref = useRef(open);
  useEffect(() => { ref.current = open; });
  useEffect(() => {
    const onReq = (e: Event) => { e.preventDefault(); ref.current(); };
    window.addEventListener('oyg:record-activity', onReq);
    return () => window.removeEventListener('oyg:record-activity', onReq);
  }, []);
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const moreRef = useRef<HTMLDivElement>(null);
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const moreActive = MORE.some((l) => active(l.href));

  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: MouseEvent) => { if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [moreOpen]);

  // Close menus when the page changes.
  useEffect(() => { setIsOpen(false); setMoreOpen(false); }, [pathname]);

  const record = () => openRecordActivity(router);

  return (
    <nav className="sticky top-0 z-40 bg-[#0e2418]/95 backdrop-blur-md border-b border-[#e4c878]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px] gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo.jpeg" alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[#e4c878]/60" />
            <span className="flex flex-col leading-tight">
              <span className="text-white font-bold text-[15px] group-hover:text-[#e4c878] transition-colors">Oloolua Youth Guardians</span>
              <span className="text-[11px] text-emerald-300/80">Oloolua Forest CFA</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-0.5">
            {MAIN.map((l) => (
              <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined}
                className={`relative px-3 py-2 rounded-lg text-[13.5px] font-medium whitespace-nowrap transition-colors ${active(l.href) ? 'text-[#e4c878]' : 'text-gray-200 hover:text-white hover:bg-white/5'}`}>
                {l.name}
                {active(l.href) && <span className="absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-full bg-[#e4c878]" />}
              </Link>
            ))}
            <div className="relative" ref={moreRef}>
              <button onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${moreActive ? 'text-[#e4c878]' : 'text-gray-200 hover:text-white hover:bg-white/5'}`}>
                More <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0e2418] border border-[#e4c878]/20 shadow-2xl py-1.5">
                  {MORE.map((l) => (
                    <Link key={l.href} href={l.href} className={`block px-4 py-2.5 text-sm ${active(l.href) ? 'text-[#e4c878] font-semibold' : 'text-gray-200 hover:bg-white/5 hover:text-white'}`}>{l.name}</Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <ToolsDropdown onOpenRecordActivity={record} />
            <Link href="/portal" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
              <Shield className="w-4 h-4 text-[#e4c878]" /> Guardian Hub
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2.5 rounded-lg text-gray-200 hover:text-white hover:bg-white/10" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-[#0b1c14] border-t border-[#e4c878]/15 px-4 pt-3 pb-5 max-h-[calc(100vh-68px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-1">
            {[...MAIN, ...MORE].map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-3 rounded-lg text-[15px] font-medium ${active(l.href) ? 'bg-emerald-600/25 text-[#e4c878] font-semibold' : 'text-gray-200 hover:bg-white/5'}`}>
                {l.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 grid gap-2">
            <button onClick={() => { setIsOpen(false); record(); }} className="w-full px-4 py-3 rounded-lg font-bold text-[15px] bg-[#e4c878] text-neutral-950 flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5" /> Record activity
            </button>
            <Link href="/tools" className="w-full px-4 py-3 rounded-lg font-bold text-[15px] bg-white/10 text-white flex items-center justify-center gap-2">
              <Wrench className="w-5 h-5" /> Tools
            </Link>
            <Link href="/portal" className="w-full px-4 py-3 rounded-lg font-bold text-[15px] bg-emerald-600 text-white flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-[#e4c878]" /> Guardian Hub
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
