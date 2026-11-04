// /client/app/userdashboard/studio/components/PhoneScreen.tsx
'use client';

import React from 'react';
import {
  Bell,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  Send,
  ArrowDownLeft,
  Receipt,
  PlusCircle,
  Home,
  CreditCard,
  BarChart3,
  User,
  ShoppingBag,
  Coffee,
  Copy,
  Trash2,
  Diamond,
} from 'lucide-react';
import type { Variant } from './types';
import { SEED_BALANCE, SEED_CASHFLOW } from './seed';

interface ScreenProps {
  selectedLayerId: string;
  onSelectLayer: (id: string) => void;
  variant: Variant;
  padding: { top: number; right: number; bottom: number; left: number };
  gap: number;
}

/* ------------------------------ sub components ------------------------------ */

function HeaderGreetingBar() {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-1.5">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-[10px] font-bold text-white">
          K
        </div>
        <div className="leading-tight">
          <p className="text-[8px] text-slate-400">Good morning</p>
          <p className="text-[11px] font-semibold text-slate-900">Krishnan</p>
        </div>
      </div>
      <button className="relative grid h-6 w-6 place-items-center rounded-full text-slate-700">
        <Bell className="h-[14px] w-[14px]" />
        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-[#F7F8FF]" />
      </button>
    </div>
  );
}

function BalanceCard({
  variant,
  padding,
  gap,
  selected,
  onSelect,
}: {
  variant: Variant;
  padding: { top: number; right: number; bottom: number; left: number };
  gap: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const pad = {
    paddingTop: padding.top * 10,
    paddingRight: padding.right * 10,
    paddingBottom: padding.bottom * 10,
    paddingLeft: padding.left * 10,
  };

  const masked = variant === 'masked';
  const negative = variant === 'negative';

  return (
    <div className="relative">
      {selected && <SelectionLabel />}
      <div
        onClick={onSelect}
        className="relative cursor-pointer"
        style={{ outline: selected ? '1.5px solid #6366F1' : 'none', outlineOffset: 2, borderRadius: 20 }}
      >
        <div
          className="relative overflow-hidden rounded-[20px] text-white"
          style={{ background: negative ? '#7A1431' : '#0B1A56', ...pad }}
        >
          {/* mesh gradient blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/40 blur-2xl" />
            <div className="absolute -right-6 top-2 h-36 w-36 rounded-full bg-amber-500/35 blur-2xl" />
            <div className="absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-blue-500/30 blur-2xl" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-white/70">Total Balance</p>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[7px] font-semibold tracking-wide">
                Tier 1 BaaS
              </span>
            </div>

            <p className="mt-1 text-[26px] font-bold leading-none tracking-tight">
              {masked ? '••••••' : `$${SEED_BALANCE.dollars}`}
              <span className="text-[14px] text-white/60">{masked ? '' : `.${SEED_BALANCE.cents}`}</span>
            </p>

            <div className="mt-3 flex items-center justify-between" style={{ gap }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/25">
                    <ArrowDown className="h-2.5 w-2.5 text-emerald-300" />
                  </span>
                  <span className="text-[9px] font-semibold">
                    ${(SEED_CASHFLOW.in / 1000).toFixed(0)},000
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-500/25">
                    <ArrowUp className="h-2.5 w-2.5 text-rose-300" />
                  </span>
                  <span className="text-[9px] font-semibold">
                    ${(SEED_CASHFLOW.out / 1000).toFixed(0)},000
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[8px] font-semibold">
                My Wallet <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-indigo-600 px-2 py-0.5 text-[8px] font-semibold text-white shadow-md">
          361 × 168 · Pad {padding.top * 10}px · Gap {gap}px
        </div>
      )}
    </div>
  );
}

function SelectionLabel() {
  return (
    <div className="absolute -top-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-indigo-600 px-2 py-0.5 text-[8px] font-semibold text-white shadow-md">
      <Diamond className="h-2 w-2" />
      BalanceCardComponent
      <span className="text-white/60">|</span>
      On Tap: /wallet/details
      <span className="text-white/60">|</span>
      <span className="flex items-center gap-0.5">
        <span className="h-1 w-1 rounded-full bg-emerald-400" /> ws:live
      </span>
      <button className="ml-0.5 grid h-3 w-3 place-items-center rounded hover:bg-white/20">
        <Copy className="h-2 w-2" />
      </button>
      <button className="grid h-3 w-3 place-items-center rounded hover:bg-white/20">
        <Trash2 className="h-2 w-2" />
      </button>
    </div>
  );
}

function QuickActionsGrid() {
  const items = [
    { label: 'Send', Icon: Send, color: '#0040DF', bg: 'bg-blue-50' },
    { label: 'Request', Icon: ArrowDownLeft, color: '#16A36B', bg: 'bg-emerald-50' },
    { label: 'Pay Bill', Icon: Receipt, color: '#D97706', bg: 'bg-amber-50' },
    { label: 'Top Up', Icon: PlusCircle, color: '#EF4F6B', bg: 'bg-rose-50' },
  ];
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {items.map(({ label, Icon, color, bg }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 rounded-xl bg-white py-2.5 shadow-sm ring-1 ring-slate-100"
        >
          <span className={`grid h-6 w-6 place-items-center rounded-full ${bg}`}>
            <Icon className="h-3 w-3" style={{ color }} />
          </span>
          <span className="text-[8px] font-semibold text-slate-700">{label}</span>
        </div>
      ))}
    </div>
  );
}

function SavingsVaultsRow() {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-900">Savings Vaults</p>
        <button className="text-[8px] font-semibold text-[#0040DF]">See All (4)</button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { name: 'iPhone 15 Pro', amount: '$699', progress: 65, tone: '#0040DF' },
          { name: 'MacBook M3 Max', amount: '$1,499', progress: 45, tone: '#16A36B' },
        ].map((v) => (
          <div key={v.name} className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
            <p className="truncate text-[8px] text-slate-500">{v.name}</p>
            <p className="mt-0.5 text-[12px] font-bold text-slate-900">{v.amount}</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${v.progress}%`, background: v.tone }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivityFeed() {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-900">Recent Activity</p>
        <button className="text-[8px] font-semibold text-slate-500">View History</button>
      </div>
      <div className="space-y-1.5">
        {[
          {
            name: 'Apple Flagship Store',
            sub: 'Gadgets · Today, 10:24 AM',
            amount: '-$149.00',
            method: 'Visa 4022',
            Icon: ShoppingBag,
            tone: 'text-rose-500 bg-rose-50',
          },
          {
            name: 'Stumptown Coffee',
            sub: 'Dining · Yesterday, 8:40 AM',
            amount: '-$8.40',
            method: 'Debit 8019',
            Icon: Coffee,
            tone: 'text-amber-600 bg-amber-50',
          },
        ].map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${t.tone}`}>
                <t.Icon className="h-3 w-3" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[9px] font-semibold text-slate-900">{t.name}</p>
                <p className="truncate text-[7px] text-slate-400">{t.sub}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9px] font-bold text-slate-900">{t.amount}</p>
              <p className="text-[7px] text-slate-400">{t.method}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomDockTabBar() {
  const tabs = [
    { id: 'home', label: 'Home', Icon: Home, active: true },
    { id: 'cards', label: 'Cards', Icon: CreditCard, active: false },
    { id: 'insights', label: 'Insights', Icon: BarChart3, active: false },
    { id: 'profile', label: 'Profile', Icon: User, active: false },
  ];
  return (
    <div className="absolute inset-x-3 bottom-2.5 z-10 flex items-center justify-around rounded-[18px] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(20,20,40,0.12)] ring-1 ring-slate-100">
      {tabs.map(({ id, label, Icon, active }) => (
        <button
          key={id}
          aria-label={label}
          className={`relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-0.5 ${
            active ? 'text-[#0040DF]' : 'text-slate-400'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="text-[7px] font-semibold">{label}</span>
          {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#0040DF]" />}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ the screen ------------------------------ */

export function HomeDashboardScreen({
  selectedLayerId,
  onSelectLayer,
  variant,
  padding,
  gap,
}: ScreenProps) {
  return (
    <>
      {/* status bar */}
      <div className="flex h-8 shrink-0 items-end justify-between px-6 pb-1 text-[8px] font-semibold text-slate-800">
        <span>09:41</span>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-sm border border-slate-700" />
          <span className="h-2 w-2 rounded-sm border border-slate-700" />
          <span className="h-2 w-3 rounded-sm border border-slate-700" />
        </span>
      </div>

      <HeaderGreetingBar />

      <div className="flex-1 overflow-y-auto px-3 pb-20 pt-1">
        <div className="space-y-3">
          <BalanceCard
            variant={variant}
            padding={padding}
            gap={gap}
            selected={selectedLayerId === 'balance'}
            onSelect={() => onSelectLayer('balance')}
          />
          <QuickActionsGrid />
          <SavingsVaultsRow />
          <RecentActivityFeed />
        </div>
      </div>

      <BottomDockTabBar />
    </>
  );
}