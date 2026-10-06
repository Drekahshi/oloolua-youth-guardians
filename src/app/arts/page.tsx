'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Palette, BookOpen, Sprout, ShieldCheck, CalendarDays, X, CheckCircle2, AlertTriangle } from 'lucide-react';

/*
 * Arts in Nature: conservation-inspired murals, portraits and other art.
 * Each piece is added by the CFA on the KAI platform and linked to the
 * verified conservation records behind it; this page shows them.
 */

const KAI = 'https://avax-frontend-seven.vercel.app';
const FALLBACK = '/assets/images/act28.jpeg';
const RECORD: Record<string, string> = { NURSERY_INVENTORY: 'Seedlings received', PLANTING: 'Trees planted', SURVIVAL: 'Survival check', NURSERY_ACTIVITY: 'Nursery work' };

interface Art { slug: string; title: string; artist: string; status: string; hasImage: boolean; recordCount: number; createdAt: string }
interface ArtDetail extends Art {
  description: string | null; sizeLabel: string | null; cfa: { name: string }; planters: string[];
  records: { id: string; recordType: string; description: string; submittedBy: string | null; recordedAt: string; verifiedBy: string | null; avalancheTxHash: string | null }[];
  provenance: { hash: string | null; matches: boolean };
}

const day = (iso: string) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
const pic = (a: { slug: string; hasImage: boolean }) => (a.hasImage ? `${KAI}/api/murals/${encodeURIComponent(a.slug)}/image` : FALLBACK);

const card = { background: '#122b1f', border: '1px solid rgba(228,200,120,0.18)', borderRadius: 16 } as const;

export default function ArtsPage() {
  const [arts, setArts] = useState<Art[] | null>(null);
  const [open, setOpen] = useState<ArtDetail | null | 'loading'>(null);

  useEffect(() => {
    fetch(`${KAI}/api/murals`).then((r) => r.json()).then((d) => setArts(d.murals ?? [])).catch(() => setArts([]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const show = (slug: string) => {
    setOpen('loading');
    fetch(`${KAI}/api/murals/${encodeURIComponent(slug)}`).then((r) => r.json()).then((d) => setOpen(d.mural ?? null)).catch(() => setOpen(null));
  };

  return (
    <PageLayout title="Arts in Nature" subtitle="Murals, portraits and other art inspired by Oloolua Forest, each linked to the real conservation work behind it" bgImage="/assets/images/act28.jpeg">
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { Icon: Palette, t: 'Conservation-inspired art', d: 'Murals, portraits and other works by local artists, made from life in the forest.' },
              { Icon: BookOpen, t: 'A story behind each piece', d: 'Who made it, where and when, and the conservation story it tells.' },
              { Icon: Sprout, t: 'Linked to real work', d: 'Each artwork is tied to verified tree planting and nursery records from our CFA.' },
              { Icon: ShieldCheck, t: 'Proof you can check', d: 'A digital fingerprint shows the records were never changed after the art was made.' },
            ].map(({ Icon, t, d }) => (
              <div key={t} style={{ ...card, padding: '1.2rem 1.3rem' }}>
                <Icon size={22} color="#e4c878" />
                <h3 style={{ margin: '0.6rem 0 0.3rem', fontSize: '1.05rem', color: '#f6f2e7' }}>{t}</h3>
                <p style={{ margin: 0, color: '#a0c4b4', fontSize: '0.92rem', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '2rem', margin: '3rem 0 1.5rem', color: '#f6f2e7' }}>Artworks</h2>

          {arts === null ? (
            <p style={{ color: '#a0c4b4' }}>Loading the artworks...</p>
          ) : arts.length === 0 ? (
            <div style={{ ...card, borderStyle: 'dashed', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 0.5rem', color: '#f6f2e7' }}>The first artworks are on their way</h3>
              <p style={{ color: '#a0c4b4', maxWidth: 520, margin: '0 auto' }}>Our artists are preparing conservation murals and portraits. Each one will appear here with its story, its artist and the verified conservation work behind it.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {arts.map((a) => (
                <button key={a.slug} onClick={() => show(a.slug)} style={{ ...card, padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', color: 'inherit', font: 'inherit' }}>
                  <div style={{ aspectRatio: '4 / 3', background: `#0b1c14 url('${pic(a)}') center / cover no-repeat`, position: 'relative' }}>
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(246,242,231,0.95)', color: '#1b4332', fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: 999 }}>
                      {a.status === 'sold' ? 'In a collection' : a.status === 'reserved' ? 'Reserved' : 'Available'}
                    </span>
                  </div>
                  <div style={{ padding: '1.1rem 1.2rem 1.3rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f6f2e7' }}>{a.title}</h3>
                    <p style={{ margin: '0.3rem 0 0', color: '#d0dccf' }}>by {a.artist}</p>
                    <p style={{ margin: '0.8rem 0 0', color: '#a0c4b4', fontSize: '0.85rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CalendarDays size={14} /> {day(a.createdAt)}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Sprout size={14} /> {a.recordCount} verified {a.recordCount === 1 ? 'record' : 'records'}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {open && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }} role="dialog" aria-modal="true"
          style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(3,12,7,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}>
          <div style={{ background: '#0f2419', border: '1px solid rgba(228,200,120,0.2)', borderRadius: 20, maxWidth: 880, width: '100%', overflow: 'hidden', position: 'relative' }}>
            <button onClick={() => setOpen(null)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, width: 42, height: 42, borderRadius: '50%', border: 0, background: 'rgba(246,242,231,0.92)', color: '#1b4332', cursor: 'pointer', display: 'grid', placeItems: 'center', zIndex: 2 }}><X size={20} /></button>
            {open === 'loading' ? <p style={{ padding: '2rem', color: '#a0c4b4' }}>Loading...</p> : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pic(open)} alt={open.title} style={{ width: '100%', maxHeight: 520, objectFit: 'contain', background: '#0b1c14', display: 'block' }} />
                <div style={{ padding: '1.6rem 1.8rem 2rem' }}>
                  <h2 style={{ margin: 0, fontSize: '2rem', color: '#f6f2e7' }}>{open.title}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.8rem', margin: '1.2rem 0' }}>
                    {[['Artist', open.artist], ['Community', open.cfa?.name ?? 'Oloolua CFA'], ['Date', day(open.createdAt)], ['Location', 'Oloolua Forest, Nairobi'], ...(open.sizeLabel ? [['Size', open.sizeLabel]] : [])].map(([k, v]) => (
                      <div key={k} style={{ ...card, padding: '0.8rem 1rem' }}>
                        <small style={{ display: 'block', color: '#a0c4b4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</small>
                        <b style={{ color: '#f6f2e7' }}>{v}</b>
                      </div>
                    ))}
                  </div>
                  <h3 style={{ color: '#e4c878', margin: '1.4rem 0 0.5rem' }}>The story behind the piece</h3>
                  <p style={{ color: '#d0dccf', lineHeight: 1.75, whiteSpace: 'pre-line', margin: 0 }}>{open.description || 'The story for this piece will be added soon.'}</p>
                  {open.planters?.length > 0 && <>
                    <h3 style={{ color: '#e4c878', margin: '1.4rem 0 0.5rem' }}>The people behind the work</h3>
                    <p style={{ color: '#d0dccf', margin: 0 }}>{open.planters.join(', ')}</p>
                  </>}
                  <h3 style={{ color: '#e4c878', margin: '1.4rem 0 0.5rem' }}>Conservation work linked to this art</h3>
                  {open.records?.length ? open.records.map((r) => (
                    <div key={r.id} style={{ ...card, padding: '0.9rem 1rem', marginBottom: '0.6rem' }}>
                      <b style={{ color: '#f6f2e7' }}>{RECORD[r.recordType] ?? r.recordType}</b><span style={{ color: '#d0dccf' }}>: {r.description}</span>
                      <small style={{ display: 'block', color: '#a0c4b4', marginTop: 4 }}>
                        {r.submittedBy ? `Recorded by ${r.submittedBy} · ` : ''}{day(r.recordedAt)}{r.verifiedBy ? ` · Verified by ${r.verifiedBy}` : ''}
                        {r.avalancheTxHash && <> · <a href={`https://testnet.snowtrace.io/tx/${r.avalancheTxHash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#e4c878' }}>Timestamp on Avalanche</a></>}
                      </small>
                    </div>
                  )) : <p style={{ color: '#a0c4b4' }}>No records linked yet.</p>}
                  <h3 style={{ color: '#e4c878', margin: '1.4rem 0 0.5rem' }}>Proof</h3>
                  <p style={{ margin: 0, fontWeight: 700, color: open.provenance?.matches ? '#7dc383' : '#e4b04a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {open.provenance?.matches ? <><CheckCircle2 size={18} /> The linked records are unchanged since the artwork was made.</> : <><AlertTriangle size={18} /> A linked record changed after the artwork was made.</>}
                  </p>
                  {open.provenance?.hash && <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem', color: '#a0c4b4', wordBreak: 'break-all' }}>Fingerprint: {open.provenance.hash}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', marginTop: '1.4rem' }}>
                    <a href={`${KAI}/murals/${encodeURIComponent(open.slug)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#e4c878', color: '#0b1c14', padding: '0.8rem 1.4rem', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>See full proof and buy</a>
                    <a href="/#contact" style={{ border: '1px solid rgba(228,200,120,0.4)', color: '#f6f2e7', padding: '0.8rem 1.4rem', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>Ask about this piece</a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
