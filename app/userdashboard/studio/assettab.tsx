// /client/app/userdashboard/studio/AssetTab.tsx
'use client';

import React, { useMemo, useState } from 'react';
import {
  Search, Upload, RefreshCw, GripVertical,
  Send, Inbox, Lock, Shield, Fingerprint, Nfc, Landmark, ArrowLeftRight,
  Check, ExternalLink,
} from 'lucide-react';

export type AssetFilter = 'all' | 'logos' | 'icons' | 'media' | 'tokens';
export type AssetKind = 'logo' | 'icon' | 'media' | 'token';

export type AssetItem = {
  id: string;
  name: string;
  kind: AssetKind;
  filters: AssetFilter[];
  format: string;
  size?: string;
  inUse?: boolean;
  color?: string;
  dataUrl?: string;
  preview: React.ReactNode;
};

type AssetTabProps = {
  accent?: string;
  onAssetDragStart?: (asset: AssetItem) => void;
  onAssetClick?: (asset: AssetItem) => void;
};

const svgUrl = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ─────────────────────────── Previews ─────────────────────────── */

const ApexLogoPreview = (
  <div className="flex items-center gap-1.5">
    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0040DF] text-[13px] font-black text-white">
      A
    </div>
    <span className="text-[10px] font-extrabold tracking-wider text-slate-800">APEX</span>
  </div>
);

const VisaLogoPreview = (
  <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-amber-300 to-amber-500 px-3 py-1.5">
    <span className="text-[11px] font-extrabold italic tracking-widest text-white">VISA</span>
  </div>
);

const MastercardLogoPreview = (
  <div className="flex items-center">
    <div className="h-6 w-6 rounded-full bg-red-500 opacity-90" />
    <div className="-ml-2 h-6 w-6 rounded-full bg-amber-400 opacity-90" />
  </div>
);

const MeshGradientPreview = (
  <div className="relative h-10 w-full overflow-hidden rounded-md">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-emerald-400 to-amber-400" />
    <div className="absolute -left-1 top-0 h-full w-10 rounded-full bg-emerald-500/70 blur-md" />
    <div className="absolute left-1/4 top-0 h-full w-10 rounded-full bg-blue-500/70 blur-md" />
    <div className="absolute right-1/4 top-0 h-full w-10 rounded-full bg-amber-500/70 blur-md" />
  </div>
);

const WavePreview = (
  <div className="h-10 w-full overflow-hidden rounded-md bg-gradient-to-br from-violet-200 via-indigo-200 to-blue-200">
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full">
      <path d="M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" fill="rgba(139,92,246,0.45)" />
      <path d="M0 14 Q 25 4 50 14 T 100 14 V 20 H 0 Z" fill="rgba(99,102,241,0.4)" />
      <path d="M0 17 Q 25 10 50 17 T 100 17 V 20 H 0 Z" fill="rgba(59,130,246,0.35)" />
    </svg>
  </div>
);

const AvatarsPreview = (
  <div className="flex items-center">
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-white" />
    <div className="-ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-white" />
    <div className="-ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 ring-2 ring-white" />
  </div>
);

const iconTile = (Icon: React.ComponentType<{ className?: string }>, color: string) => (
  <span
    className="flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-white/60"
    style={{ background: `${color}1A`, color }}
  >
    <Icon className="h-4 w-4" />
  </span>
);

/* ─────────────────────────── Asset Data ─────────────────────────── */

const BRAND_LOGOS: AssetItem[] = [
  {
    id: 'logo-apex',
    name: 'Apex Logomark',
    kind: 'logo',
    filters: ['logos'],
    format: 'SVG',
    size: '2.1 KB',
    preview: ApexLogoPreview,
    dataUrl: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><rect width="80" height="40" rx="8" fill="#0040DF"/><text x="40" y="27" font-family="system-ui,sans-serif" font-size="18" font-weight="800" text-anchor="middle" fill="#fff">APEX</text></svg>`
    ),
  },
  {
    id: 'logo-visa',
    name: 'Visa Chip Vector',
    kind: 'logo',
    filters: ['logos'],
    format: 'SVG',
    size: '4 KB',
    preview: VisaLogoPreview,
    dataUrl: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><rect width="80" height="40" rx="8" fill="#F59E0B"/><text x="40" y="27" font-family="system-ui,sans-serif" font-size="14" font-style="italic" font-weight="800" text-anchor="middle" fill="#fff">VISA</text></svg>`
    ),
  },
  {
    id: 'logo-mastercard',
    name: 'Mastercard SVG',
    kind: 'logo',
    filters: ['logos'],
    format: 'SVG',
    size: '8 KB',
    preview: MastercardLogoPreview,
    dataUrl: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><rect width="80" height="40" rx="8" fill="#0F172A"/><circle cx="34" cy="20" r="10" fill="#EF4444" fill-opacity="0.9"/><circle cx="46" cy="20" r="10" fill="#F59E0B" fill-opacity="0.9"/></svg>`
    ),
  },
];

const FINTECH_ICONS: AssetItem[] = [
  { id: 'icon-send', name: 'Send', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#0040DF', preview: iconTile(Send, '#0040DF'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0040DF" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`) },
  { id: 'icon-receive', name: 'Receive', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#10B981', preview: iconTile(Inbox, '#10B981'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`) },
  { id: 'icon-vault', name: 'Vault', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#F59E0B', preview: iconTile(Lock, '#F59E0B'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`) },
  { id: 'icon-shield', name: 'Shield', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#10B981', preview: iconTile(Shield, '#10B981'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`) },
  { id: 'icon-biometric', name: 'Biometric', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#3B82F6', preview: iconTile(Fingerprint, '#3B82F6'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/></svg>`) },
  { id: 'icon-nfc', name: 'Top NFC', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#6366F1', preview: iconTile(Nfc, '#6366F1'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8"/></svg>`) },
  { id: 'icon-bank', name: 'Bank', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#0EA5E9', preview: iconTile(Landmark, '#0EA5E9'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`) },
  { id: 'icon-swap', name: 'Swap', kind: 'icon', filters: ['icons'], format: 'SVG', color: '#8B5CF6', preview: iconTile(ArrowLeftRight, '#8B5CF6'), dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`) },
];

const MEDIA: AssetItem[] = [
  {
    id: 'media-mesh',
    name: 'Mesh Gradient 01',
    kind: 'media',
    filters: ['media'],
    format: '361×168 · High-DPI Canvas',
    inUse: true,
    preview: MeshGradientPreview,
    dataUrl: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 361 168"><defs><radialGradient id="a" cx="20%" cy="30%" r="60%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#34D399" stop-opacity="0"/></radialGradient><radialGradient id="b" cx="60%" cy="20%" r="55%"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/></radialGradient><radialGradient id="c" cx="85%" cy="80%" r="60%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/></radialGradient></defs><rect width="361" height="168" fill="#0F172A"/><rect width="361" height="168" fill="url(#a)"/><rect width="361" height="168" fill="url(#b)"/><rect width="361" height="168" fill="url(#c)"/></svg>`
    ),
  },
  {
    id: 'media-wave',
    name: 'Abstract Wave Pattern',
    kind: 'media',
    filters: ['media'],
    format: 'SVG Vector · 24.6 KB',
    preview: WavePreview,
    dataUrl: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A78BFA"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient></defs><rect width="200" height="100" fill="url(#g)"/><path d="M0 50 Q 50 10 100 50 T 200 50 V 100 H 0 Z" fill="#fff" fill-opacity="0.15"/><path d="M0 70 Q 50 30 100 70 T 200 70 V 100 H 0 Z" fill="#fff" fill-opacity="0.2"/></svg>`
    ),
  },
  {
    id: 'media-avatars',
    name: 'User Avatars (Set of 3)',
    kind: 'media',
    filters: ['media'],
    format: 'PNG / JPG',
    preview: AvatarsPreview,
    dataUrl: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 40"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#2563EB"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#059669"/></linearGradient><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A78BFA"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><circle cx="15" cy="20" r="15" fill="url(#a)"/><circle cx="45" cy="20" r="15" fill="url(#b)"/><circle cx="75" cy="20" r="15" fill="url(#c)"/></svg>`
    ),
  },
];

const TOKENS: AssetItem[] = [
  { id: 'token-primary', name: 'Primary', kind: 'token', filters: ['tokens'], format: '#0040DF', color: '#0040DF', preview: <div className="h-9 w-full rounded-md" style={{ background: '#0040DF' }} />, dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0040DF"/></svg>`) },
  { id: 'token-violet', name: 'Violet', kind: 'token', filters: ['tokens'], format: '#6941C6', color: '#6941C6', preview: <div className="h-9 w-full rounded-md" style={{ background: '#6941C6' }} />, dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#6941C6"/></svg>`) },
  { id: 'token-emerald', name: 'Emerald', kind: 'token', filters: ['tokens'], format: '#10B981', color: '#10B981', preview: <div className="h-9 w-full rounded-md" style={{ background: '#10B981' }} />, dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#10B981"/></svg>`) },
  { id: 'token-rose', name: 'Rose', kind: 'token', filters: ['tokens'], format: '#F43F5E', color: '#F43F5E', preview: <div className="h-9 w-full rounded-md" style={{ background: '#F43F5E' }} />, dataUrl: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#F43F5E"/></svg>`) },
];

const ALL_ASSETS: AssetItem[] = [
  ...BRAND_LOGOS,
  ...FINTECH_ICONS,
  ...MEDIA,
  ...TOKENS,
];

const FILTERS: { id: AssetFilter; label: string }[] = [
  { id: 'all', label: 'All Assets' },
  { id: 'logos', label: 'Logos' },
  { id: 'icons', label: 'Icons' },
  { id: 'media', label: 'Media' },
  { id: 'tokens', label: 'Tokens' },
];

/* ─────────────────────────── Drag helper ─────────────────────────── */

const attachAssetDrag = (
  e: React.DragEvent,
  asset: AssetItem,
  onAssetDragStart?: (a: AssetItem) => void
) => {
  e.stopPropagation();
  e.dataTransfer.setData('application/x-pf-asset-id', asset.id);
  e.dataTransfer.setData('text/plain', `asset:${asset.id}`);
  e.dataTransfer.effectAllowed = 'copy';
  onAssetDragStart?.(asset);
};

/* ─────────────────────────── Component ─────────────────────────── */

export default function AssetTab({ accent = '#0040DF', onAssetDragStart, onAssetClick }: AssetTabProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AssetFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>('media-mesh');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_ASSETS.filter((a) => {
      const matchesFilter = filter === 'all' || a.filters.includes(filter);
      const matchesQuery = q === '' || a.name.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  const logos = filtered.filter((a) => a.kind === 'logo');
  const icons = filtered.filter((a) => a.kind === 'icon');
  const media = filtered.filter((a) => a.kind === 'media');
  const tokens = filtered.filter((a) => a.kind === 'token');

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Search */}
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5">
          <Search className="h-3 w-3 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, vectors, tokens… (⌘A)"
            className="w-full bg-transparent text-[10px] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                active
                  ? 'text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
              style={active ? { background: accent } : undefined}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-3 pt-1 scrollbar-thin-blue [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0040DF] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002db3]">
        {/* Logos */}
        {logos.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                🏷 Brand Logos &amp; Wordmarks
              </span>
              <span className="text-[9px] text-slate-400">{logos.length} items</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {logos.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => attachAssetDrag(e, a, onAssetDragStart)}
                  onClick={() => {
                    setSelectedId(a.id);
                    onAssetClick?.(a);
                  }}
                  className={`group cursor-grab rounded-lg border bg-white p-2 transition active:cursor-grabbing ${
                    selectedId === a.id
                      ? 'border-[#0040DF] shadow-sm ring-1 ring-[#0040DF]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">
                      {a.format}
                    </span>
                    <GripVertical className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                  </div>
                  <div className="flex h-14 items-center justify-center">{a.preview}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="truncate text-[9px] font-semibold text-slate-700">{a.name}</span>
                    <span className="shrink-0 text-[8px] text-slate-400">{a.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Icons */}
        {icons.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                🔓 Fintech Icon System (Vector)
              </span>
              <span className="text-[9px] text-slate-400">{icons.length} items</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => attachAssetDrag(e, a, onAssetDragStart)}
                  onClick={() => {
                    setSelectedId(a.id);
                    onAssetClick?.(a);
                  }}
                  className={`group cursor-grab rounded-lg border bg-white p-2 text-center transition active:cursor-grabbing ${
                    selectedId === a.id
                      ? 'border-[#0040DF] shadow-sm ring-1 ring-[#0040DF]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-center">{a.preview}</div>
                  <div className="mt-1.5 truncate text-[9px] font-semibold text-slate-700">
                    {a.name}
                  </div>
                  <div className="text-[8px] text-slate-400">{a.format.toLowerCase()}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media */}
        {media.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                📁 Media &amp; Backgrounds
              </span>
              <span className="text-[9px] text-[#0040DF]">
                In use ({media.filter((m) => m.inUse).length || 0})
              </span>
            </div>
            <div className="space-y-2">
              {media.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => attachAssetDrag(e, a, onAssetDragStart)}
                  onClick={() => {
                    setSelectedId(a.id);
                    onAssetClick?.(a);
                  }}
                  className={`group flex cursor-grab items-center gap-2 rounded-lg border bg-white p-2 transition active:cursor-grabbing ${
                    selectedId === a.id
                      ? 'border-[#0040DF] shadow-sm ring-1 ring-[#0040DF]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-16 shrink-0">{a.preview}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[10px] font-bold text-slate-800">{a.name}</span>
                      {a.inUse && (
                        <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 text-[7px] font-bold text-[#0040DF]">
                          IN USE
                        </span>
                      )}
                    </div>
                    <span className="truncate text-[8px] text-slate-400">{a.format}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedId === a.id && (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0040DF] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <GripVertical className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tokens */}
        {tokens.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                🎨 Color &amp; Design Tokens
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tokens.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => attachAssetDrag(e, a, onAssetDragStart)}
                  onClick={() => {
                    setSelectedId(a.id);
                    onAssetClick?.(a);
                  }}
                  className={`group cursor-grab rounded-lg border bg-white p-1.5 text-center transition active:cursor-grabbing ${
                    selectedId === a.id
                      ? 'border-[#0040DF] shadow-sm ring-1 ring-[#0040DF]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {a.preview}
                  <div className="mt-1 truncate font-mono text-[8px] uppercase text-slate-500">
                    {a.format}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <p className="py-6 text-center text-[10px] text-slate-400">No assets found.</p>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-slate-200 p-2">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#0040DF]/30 bg-white py-1.5 text-[10px] font-semibold text-[#0040DF] hover:bg-[#E8EEFF]"
          >
            <Upload className="h-3 w-3" /> Upload Asset
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-3 w-3" /> Sync Brand Kit
          </button>
        </div>
        <button
          type="button"
          className="mt-1.5 flex w-full items-center justify-center gap-1 py-1 text-[9px] font-semibold text-slate-400 hover:text-slate-600"
        >
          <ExternalLink className="h-2.5 w-2.5" /> Export Asset Manifest (JSON)
        </button>
      </div>
    </div>
  );
}