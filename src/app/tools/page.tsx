'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import RecordActivityModal from '@/components/RecordActivityModal';
import LiveActivityTracker from '@/components/LiveActivityTracker';
import { 
  Shield, 
  PlusCircle, 
  Layers, 
  BarChart3, 
  Sprout, 
  TreePine, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Check, 
  Copy, 
  Sparkles, 
  Sliders, 
  Activity,
  UserCheck,
  Send,
  Lock
} from 'lucide-react';
import { 
  INITIAL_CFA, 
  INITIAL_SEEDBEDS, 
  INITIAL_SPECIES, 
  INITIAL_TRANSACTIONS, 
  calculateNurseryMetrics 
} from '@/services/kaiLedger';
import { ConservationActivity, InventoryTransaction, Species, Seedbed } from '@/types/kai';

export default function ToolsHubPage() {
  const [activeTool, setActiveTool] = useState<'guardian' | 'record'>('guardian');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(INITIAL_TRANSACTIONS);
  const [copiedLink, setCopiedLink] = useState(false);

  // In-line Quick Record Activity Form State
  const [recordForm, setRecordForm] = useState({
    eventType: 'PROPAGATION',
    speciesId: INITIAL_SPECIES[0]?.id || 'SP-01',
    seedbedId: INITIAL_SEEDBEDS[0]?.id || 'SB-01',
    quantity: 100,
    recordedBy: 'Austin Namuye (Guardian)',
    notes: 'Logged via Quick Tools Hub',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync DB on Mount
  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dbTxns: InventoryTransaction[] = json.data.map((act: any) => ({
            id: act.id,
            transactionType: act.event_type,
            nurseryId: act.nursery_id,
            seedbedId: act.seedbed_id,
            speciesId: act.species_id,
            quantity: Number(act.quantity),
            direction: (act.event_type === 'SALE' || act.event_type === 'DONATION' || act.event_type === 'PLANTING' || act.event_type === 'MORTALITY') ? 'OUT' : 'IN',
            date: act.activity_date ? act.activity_date.split('T')[0] : act.created_at.split('T')[0],
            source: `NEON_DB_${act.event_type}`,
            recordedBy: act.recorded_by,
            notes: act.notes,
            verificationStatus: act.verification_status || 'SUBMITTED',
            createdAt: act.created_at
          }));
          setTransactions(dbTxns);
        }
      })
      .catch(err => console.log('Sync note:', err));
  }, []);

  const metrics = calculateNurseryMetrics(transactions);

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: recordForm.eventType,
          speciesId: recordForm.speciesId,
          seedbedId: recordForm.seedbedId,
          quantity: Number(recordForm.quantity),
          nurseryId: 'NUR-OLO-01',
          activityDate: new Date().toISOString().split('T')[0],
          recordedBy: recordForm.recordedBy,
          notes: recordForm.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        const newTx: InventoryTransaction = {
          id: data.data?.id || `TXN-${Date.now().toString().slice(-5)}`,
          transactionType: recordForm.eventType as any,
          nurseryId: 'NUR-OLO-01',
          seedbedId: recordForm.seedbedId,
          speciesId: recordForm.speciesId,
          quantity: Number(recordForm.quantity),
          direction: (recordForm.eventType === 'SALE' || recordForm.eventType === 'DONATION' || recordForm.eventType === 'PLANTING' || recordForm.eventType === 'MORTALITY') ? 'OUT' : 'IN',
          date: new Date().toISOString().split('T')[0],
          source: 'TOOLS_HUB_INLINE',
          recordedBy: recordForm.recordedBy,
          notes: recordForm.notes,
          verificationStatus: 'SUBMITTED',
          createdAt: new Date().toISOString(),
        };
        setTransactions(prev => [newTx, ...prev]);
        setTimeout(() => setSubmitSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error logging activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1c14] text-[#f6f2e7] flex flex-col">
      <Navigation onOpenRecordActivity={() => setIsActivityModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#122b1f] via-[#0e2219] to-[#0b1c14] border-b border-[#e4c878]/20 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-[#e4c878] mb-3">
              <Sliders className="w-3.5 h-3.5 text-[#e4c878]" />
              <span>Unified Conservation Toolset</span>
              <span className="opacity-40">·</span>
              <span className="text-emerald-300 font-mono">Guardian & Logger Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Guardian Conservation <span className="text-[#e4c878]">Tools Suite</span>
            </h1>
            <p className="mt-2 text-sm text-gray-300 max-w-2xl leading-relaxed">
              Your consolidated conservation console uniting the <strong>Guardian Hub</strong> and <strong>Record Activity</strong> engine in one streamlined workspace.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#e4c878]" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Tools URL'}</span>
            </button>

            <Link
              href="/portal"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e4c878] text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-md"
            >
              <Shield className="w-4 h-4" />
              <span>Open Full Portal</span>
            </Link>
          </div>
        </div>

        {/* 2 Core Tools Master Selector */}
        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tool Card 1: Guardian Hub */}
          <button
            onClick={() => setActiveTool('guardian')}
            className={`p-5 rounded-2xl text-left transition-all border ${
              activeTool === 'guardian'
                ? 'bg-emerald-900/50 border-[#e4c878] shadow-lg shadow-emerald-950/50 ring-1 ring-[#e4c878]/50'
                : 'bg-[#122b1f]/60 hover:bg-[#122b1f] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeTool === 'guardian' ? 'bg-emerald-500 text-neutral-950' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                <Shield className="w-5 h-5 font-bold" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTool === 'guardian' ? 'bg-[#e4c878] text-neutral-950' : 'bg-white/10 text-gray-400'
              }`}>
                Active Console
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
              <span>1. Guardian Hub</span>
              {activeTool === 'guardian' && <Sparkles className="w-4 h-4 text-[#e4c878]" />}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              CFA operations, live stock metrics ({metrics.currentStock.toLocaleString()} seedlings), seedbed inventory, and ledger history.
            </p>
          </button>

          {/* Tool Card 2: Record Activity */}
          <button
            onClick={() => setActiveTool('record')}
            className={`p-5 rounded-2xl text-left transition-all border ${
              activeTool === 'record'
                ? 'bg-amber-950/40 border-[#e4c878] shadow-lg shadow-amber-950/50 ring-1 ring-[#e4c878]/50'
                : 'bg-[#122b1f]/60 hover:bg-[#122b1f] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeTool === 'record' ? 'bg-[#e4c878] text-neutral-950' : 'bg-amber-950 text-[#e4c878] border border-amber-800'
              }`}>
                <PlusCircle className="w-5 h-5 font-bold" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTool === 'record' ? 'bg-[#e4c878] text-neutral-950' : 'bg-white/10 text-gray-400'
              }`}>
                Logger Tool
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
              <span>2. Record Activity</span>
              {activeTool === 'record' && <Sparkles className="w-4 h-4 text-[#e4c878]" />}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Log tree planting, seeding, nursery maintenance, patrols, and seedling sales with instant DB sync and Hedera verification.
            </p>
          </button>

        </div>
      </section>

      {/* Main Tool Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* ========================================================================= */}
        {/* TOOL 1: GUARDIAN HUB */}
        {/* ========================================================================= */}
        {activeTool === 'guardian' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header / Sub-banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#122b1f] p-6 rounded-2xl border border-[#e4c878]/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#e4c878]" />
                  <h2 className="text-lg font-bold text-white">Guardian Hub Operations Console</h2>
                </div>
                <p className="text-xs text-gray-300">
                  Real-time nursery inventory, CFA capacity, active seedbeds, and verifiable transactions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsActivityModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-[#e4c878]" />
                  <span>+ Quick Record</span>
                </button>
                <Link
                  href="/portal?tab=ledger"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200"
                >
                  <span>View Raw Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#e4c878]" />
                </Link>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Current Seedling Stock</div>
                <div className="text-3xl font-black text-white">{metrics.currentStock.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400">Dynamic Inventory Balance</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Species Tracked</div>
                <div className="text-3xl font-black text-[#e4c878]">{INITIAL_SPECIES.length}</div>
                <div className="text-[11px] text-gray-400">Indigenous & Agroforestry</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Active Seedbeds</div>
                <div className="text-3xl font-black text-emerald-400">{INITIAL_SEEDBEDS.length}</div>
                <div className="text-[11px] text-gray-400">Nursery Station Alpha</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Ledger Events</div>
                <div className="text-3xl font-black text-teal-300">{transactions.length}</div>
                <div className="text-[11px] text-gray-400">Neon DB Synced</div>
              </div>
            </div>

            {/* Live Database Activity Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Live Activity Stream (Guardian Ledger)</span>
                </h3>
                <span className="text-[11px] text-gray-400 font-mono">Realtime Postgres Stream</span>
              </div>
              <LiveActivityTracker />
            </div>

            {/* Seedbeds Quick Overview */}
            <div className="bg-[#122b1f] rounded-2xl border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#e4c878]" />
                  <span>Seedbed Capacity & Distribution</span>
                </h3>
                <Link href="/seedlings" className="text-xs text-[#e4c878] hover:underline flex items-center gap-1">
                  <span>Explore Nursery</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_SEEDBEDS.map(sb => {
                  return (
                    <div key={sb.id} className="p-4 rounded-xl bg-[#0b1c14] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{sb.nameNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                          {sb.id}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300">
                        Method: <strong className="text-[#e4c878]">{sb.propagationMethod}</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 text-gray-400">
                        <span>Capacity: {sb.capacity.toLocaleString()}</span>
                        <span className="text-emerald-400 font-bold">{sb.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 2: RECORD ACTIVITY ENGINE */}
        {/* ========================================================================= */}
        {activeTool === 'record' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="bg-[#122b1f] p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PlusCircle className="w-5 h-5 text-[#e4c878]" />
                  <h2 className="text-lg font-bold text-white">Record Conservation Activity</h2>
                </div>
                <p className="text-xs text-gray-300">
                  Log nursery events, planting drives, patrols, and transactions directly into the verified conservation ledger.
                </p>
              </div>

              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#e4c878] text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-2 shadow-md shrink-0"
              >
                <Sliders className="w-4 h-4" />
                <span>Open Advanced Modal Logger</span>
              </button>
            </div>

            {/* Quick In-line Activity Recording Form */}
            <div className="bg-[#122b1f] rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e4c878]" />
                  <span>Quick-Log Event Console</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Immediate entry tool. Submissions are instantly written to PostgreSQL and queued for Hedera Hashgraph anchoring.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong>Activity Logged Successfully!</strong> The event has been appended to the live ledger and inventory metrics updated.
                  </div>
                </div>
              )}

              <form onSubmit={handleInlineSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  {/* Field 1: Event Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Activity / Event Type</label>
                    <select
                      value={recordForm.eventType}
                      onChange={e => setRecordForm({ ...recordForm, eventType: e.target.value })}
                      className="w-full bg-[#0b1c14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e4c878] focus:outline-none"
                    >
                      <option value="PROPAGATION">🌱 PROPAGATION (New Batch Sown)</option>
                      <option value="SOWING">🌾 SOWING (Seedbed Sowing)</option>
                      <option value="POTTING">🪴 POTTING (Transplanted to Tube)</option>
                      <option value="WEEDING">🌿 WEEDING (Nursery Maintenance)</option>
                      <option value="WATERING">💧 WATERING (Irrigation Session)</option>
                      <option value="PLANTING">🌳 PLANTING (Outplanted in Forest)</option>
                      <option value="SALE">💰 SALE (Seedlings Distributed)</option>
                      <option value="DONATION">🎁 DONATION (Community Grant)</option>
                      <option value="MORTALITY">⚠️ MORTALITY (Loss Recorded)</option>
                    </select>
                  </div>

                  {/* Field 2: Species */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Target Species</label>
                    <select
                      value={recordForm.speciesId}
                      onChange={e => setRecordForm({ ...recordForm, speciesId: e.target.value })}
                      className="w-full bg-[#0b1c14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e4c878] focus:outline-none"
                    >
                      {INITIAL_SPECIES.map(sp => (
                        <option key={sp.id} value={sp.id}>
                          {sp.commonName} ({sp.scientificName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 3: Seedbed */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Nursery Seedbed</label>
                    <select
                      value={recordForm.seedbedId}
                      onChange={e => setRecordForm({ ...recordForm, seedbedId: e.target.value })}
                      className="w-full bg-[#0b1c14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e4c878] focus:outline-none"
                    >
                      {INITIAL_SEEDBEDS.map(sb => (
                        <option key={sb.id} value={sb.id}>
                          {sb.nameNumber} ({sb.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 4: Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Quantity / Seedlings</label>
                    <input
                      type="number"
                      min={1}
                      value={recordForm.quantity}
                      onChange={e => setRecordForm({ ...recordForm, quantity: Number(e.target.value) })}
                      className="w-full bg-[#0b1c14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e4c878] focus:outline-none"
                      required
                    />
                  </div>

                  {/* Field 5: Recorded By */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Recorded By (Officer/Guardian)</label>
                    <input
                      type="text"
                      value={recordForm.recordedBy}
                      onChange={e => setRecordForm({ ...recordForm, recordedBy: e.target.value })}
                      className="w-full bg-[#0b1c14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e4c878] focus:outline-none"
                      required
                    />
                  </div>

                  {/* Field 6: Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Verification Notes / Metadata</label>
                    <input
                      type="text"
                      value={recordForm.notes}
                      onChange={e => setRecordForm({ ...recordForm, notes: e.target.value })}
                      className="w-full bg-[#0b1c14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e4c878] focus:outline-none"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#e4c878]" />
                    <span>{isSubmitting ? 'Logging to Ledger...' : 'Submit & Append to Ledger'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Record Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="font-bold text-[#e4c878] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Automated Stock Balancing</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Inflows (Seeding, Potting) automatically increase bed counts, while sales, donations, and mortality deduct accurately.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Guardian Attestation</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Every entry records timestamp, author credentials, and notes to support KFS / CFA audit compliance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#122b1f] border border-white/10 space-y-1">
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>Hedera Ready</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Entries are compatible with Hedera Consensus Service (HCS) topic submission for tamper-proof Web3 transparency.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Reusable Record Activity Modal */}
      <RecordActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        speciesList={INITIAL_SPECIES}
        seedbedList={INITIAL_SEEDBEDS}
        onAddActivity={(act) => {
          const newTxn: InventoryTransaction = {
            id: `TXN-${Date.now().toString().slice(-5)}`,
            transactionType: act.eventType as any,
            nurseryId: act.nurseryId,
            seedbedId: act.seedbedId,
            speciesId: act.speciesId,
            quantity: act.quantity,
            direction: (act.eventType === 'SALE' || act.eventType === 'DONATION' || act.eventType === 'PLANTING' || act.eventType === 'MORTALITY') ? 'OUT' : 'IN',
            date: act.date,
            source: 'TOOLS_HUB_MODAL',
            recordedBy: act.recordedBy,
            notes: act.notes,
            verificationStatus: act.verificationStatus,
            createdAt: new Date().toISOString()
          };
          setTransactions(prev => [newTxn, ...prev]);
        }}
      />
    </div>
  );
}
