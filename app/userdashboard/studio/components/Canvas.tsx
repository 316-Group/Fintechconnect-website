// /client/app/userdashboard/studio/components/Canvas.tsx
'use client';

import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronRight,
  CreditCard,
  Info,
  Plus,
  Receipt,
  Send,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';
import type { DeviceType, Variant } from './types';

function HomeDashboardScreen({
  selectedLayerId,
  onSelectLayer,
  variant,
  padding,
  gap,
}: {
  selectedLayerId: string;
  onSelectLayer: (id: string) => void;
  variant: Variant;
  padding: { top: number; right: number; bottom: number; left: number };
  gap: number;
}) {
  return (
    <div
      className="flex h-full flex-col overflow-auto bg-[#F7F8FF] text-[#1d2b52]"
      data-variant={variant}
      style={{ gap, paddingTop: padding.top, paddingRight: padding.right, paddingBottom: padding.bottom, paddingLeft: padding.left }}
    >
      <button
        type="button"
        onClick={() => onSelectLayer('header')}
        className={`flex items-center gap-2 rounded-xl p-2 text-left ${selectedLayerId === 'header' ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-slate-500">
          <UserRound className="h-4 w-4" />
        </div>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] text-slate-500">Good morning,</span>
          <span className="block truncate text-xs font-bold">Krishnan</span>
        </span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-500 shadow-sm">
          <Bell className="h-3.5 w-3.5" />
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectLayer('balance')}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071A5C] via-[#0737B8] to-[#071A5C] p-4 text-left text-white shadow-lg ${selectedLayerId === 'balance' ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}
        style={{ background: 'linear-gradient(135deg, #071A5C 0%, #0737B8 55%, #071A5C 100%)' }}
      >
        <span className="absolute -right-7 -top-8 h-28 w-28 rounded-full bg-amber-400/40 blur-xl" />
        <span className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-emerald-400/30 blur-xl" />
        <span className="relative flex items-center justify-between text-[9px] text-white/75">
          Total Balance <span className="rounded-full bg-white/15 px-2 py-1">Tier 1 Baas</span>
        </span>
        <span className="relative mt-2 block text-[22px] font-bold tracking-tight">
          $25,000<span className="ml-1 text-[11px] font-medium text-white/70">.40</span>
        </span>
        <span className="relative mt-4 flex items-center justify-between text-[8px]">
          <span className="text-emerald-300">+$20,000.00</span>
          <span className="text-rose-300">−$17,000.00</span>
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 font-semibold">
            My Wallet <Wallet className="h-2.5 w-2.5" />
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectLayer('quick')}
        className={`grid grid-cols-4 gap-1 rounded-xl ${selectedLayerId === 'quick' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        {[
          { label: 'Send', Icon: Send, color: 'text-blue-600 bg-blue-50' },
          { label: 'Request', Icon: ArrowDownLeft, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Pay Bill', Icon: Receipt, color: 'text-amber-600 bg-amber-50' },
          { label: 'Top Up', Icon: Plus, color: 'text-violet-600 bg-violet-50' },
        ].map(({ label, Icon, color }) => (
          <span key={label} className="flex flex-col items-center gap-1 rounded-xl bg-white py-2 shadow-sm">
            <span className={`grid h-8 w-8 place-items-center rounded-full ${color}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[8px] font-semibold">{label}</span>
          </span>
        ))}
      </button>

      <button
        type="button"
        onClick={() => onSelectLayer('savings')}
        className={`rounded-xl text-left ${selectedLayerId === 'savings' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <span className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold">Savings Vaults</span>
          <span className="flex items-center text-[8px] font-semibold text-blue-600">
            See All <ChevronRight className="h-3 w-3" />
          </span>
        </span>
        <span className="grid grid-cols-2 gap-2">
          {[
            { name: 'iPhone 15 Pro', amount: '$699', progress: 'w-3/4', color: 'bg-blue-600' },
            { name: 'MacBook M3 Max', amount: '$1,499', progress: 'w-1/2', color: 'bg-emerald-500' },
          ].map((item) => (
            <span key={item.name} className="rounded-xl bg-white p-2 shadow-sm">
              <span className="block truncate text-[8px] font-medium text-slate-500">{item.name}</span>
              <span className="mt-1 block text-xs font-bold">{item.amount}</span>
              <span className="mt-2 block h-1 rounded-full bg-slate-100">
                <span className={`block h-full rounded-full ${item.progress} ${item.color}`} />
              </span>
            </span>
          ))}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectLayer('recent')}
        className={`rounded-xl text-left ${selectedLayerId === 'recent' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <span className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold">Recent Activity</span>
          <span className="text-[8px] font-semibold text-blue-600">View History</span>
        </span>
        <span className="block space-y-1.5">
          {[
            { name: 'Apple Flagship Store', detail: 'Gadgets · Today, 02:24 AM', amount: '-$149.00', Icon: ArrowUpRight, color: 'text-rose-500 bg-rose-50' },
            { name: 'Stumptown Coffee', detail: 'Dining · Yesterday', amount: '-$8.40', Icon: ArrowDownLeft, color: 'text-amber-600 bg-amber-50' },
          ].map(({ name, detail, amount, Icon, color }) => (
            <span key={name} className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${color}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[8px] font-bold">{name}</span>
                <span className="block truncate text-[7px] text-slate-400">{detail}</span>
              </span>
              <span className="text-[8px] font-bold">{amount}</span>
            </span>
          ))}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectLayer('dock')}
        className={`mt-auto grid grid-cols-4 border-t border-slate-100 bg-white pt-2 ${selectedLayerId === 'dock' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        {[Wallet, CreditCard, BarChart3, UserRound].map((Icon, index) => (
          <span key={index} className={`flex justify-center py-1 ${index === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
            <Icon className="h-4 w-4" />
          </span>
        ))}
      </button>
    </div>
  );
}

interface Props {
  device: DeviceType;
  zoom: number;
  selectedLayerId: string;
  onSelectLayer: (id: string) => void;
  variant: Variant;
  padding: { top: number; right: number; bottom: number; left: number };
  gap: number;
}

const HINT_STORAGE = 'fintec.studio.hint.dismissed';

export default function Canvas({
  device,
  zoom,
  selectedLayerId,
  onSelectLayer,
  variant,
  padding,
  gap,
}: Props) {
  const [hintOpen, setHintOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(HINT_STORAGE) !== '1';
  });

  const dims =
    device === 'iphone'
      ? { w: 320, h: 620 }
      : device === 'pixel'
      ? { w: 320, h: 610 }
      : { w: 380, h: 600 };

  const frameRadius = device === 'iphone' ? 'rounded-[42px]' : device === 'pixel' ? 'rounded-[32px]' : 'rounded-[24px]';
  const screenRadius = device === 'iphone' ? 'rounded-[32px]' : device === 'pixel' ? 'rounded-[24px]' : 'rounded-[18px]';

  const dismissHint = () => {
    setHintOpen(false);
    if (typeof window !== 'undefined') window.localStorage.setItem(HINT_STORAGE, '1');
  };

  return (
    <main
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
      style={{
        background: '#F3F4F8',
        backgroundImage:
          'radial-gradient(circle, #D6DAE8 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Hint chip */}
      {hintOpen && (
        <div className="absolute left-4 top-3 z-20 flex max-w-[340px] items-start gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-[10px] text-slate-600 shadow-sm backdrop-blur">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
          <span className="leading-snug">
            Hold <kbd className="rounded bg-slate-100 px-1 font-semibold">⌥ Opt</kbd> to inspect spacing &amp; padding.
            Double-click component to isolate.
          </span>
          <button
            onClick={dismissHint}
            aria-label="Dismiss hint"
            className="ml-1 grid h-4 w-4 place-items-center rounded text-slate-400 hover:bg-slate-100"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      )}

      {/* Zoom badge */}
      <div className="absolute right-4 top-3 z-20 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-500 shadow-sm">
        {zoom}%
      </div>

      {/* Device frame */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-8">
        <div
          className={`relative shrink-0 border-[3px] border-[#1d2b52] bg-[#101c3a] p-[9px] shadow-2xl ring-1 ring-white/10 ${frameRadius}`}
          style={{ width: dims.w + 20 }}
        >
          {device === 'iphone' ? (
            <div className="absolute left-1/2 top-[16px] z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
          ) : device === 'pixel' ? (
            <div className="absolute left-1/2 top-[16px] z-30 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black" />
          ) : null}

          <div
            className={`relative flex w-full flex-col overflow-hidden bg-[#F7F8FF] ${screenRadius}`}
            style={{ height: dims.h }}
          >
            <HomeDashboardScreen
              selectedLayerId={selectedLayerId}
              onSelectLayer={onSelectLayer}
              variant={variant}
              padding={padding}
              gap={gap}
            />
          </div>
        </div>
      </div>

      {/* Selection metadata helpers stay within the phone screen, so nothing needed here */}
    </main>
  );
}