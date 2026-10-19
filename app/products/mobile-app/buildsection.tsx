'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outfit } from 'next/font/google';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bell,
  BatteryFull,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Eye,
  GripVertical,
  Home,
  LayoutGrid,
  Lock,
  LogIn,
  Monitor,
  Moon,
  Palette,
  Pencil,
  Plus,
  PlusCircle,
  Receipt,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Signal,
  Snowflake,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  User,
  Wallet,
  Wifi,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Fonts & design tokens                                                     */
/* -------------------------------------------------------------------------- */

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

const INK = '#1B1B1F';
const YELLOW = '#F5B921';
const GREEN = '#16A36B';
const PINK = '#EF4F6B';

type Category = 'balances' | 'actions' | 'fx' | 'ledger' | 'security' | 'onboarding';
type ModuleId =
  | 'accounts'
  | 'cashflow'
  | 'transfers'
  | 'vaults'
  | 'cards'
  | 'fx'
  | 'analytics'
  | 'security'
  | 'notifications'
  | 'signin'
  | 'accountsPage'
  | 'transfersPage'
  | 'sendPage'
  | 'requestPage'
  | 'historyPage'
  | 'splash'
  | 'profile'
  | 'freezeCard';
type RadiusMode = 'rounded' | 'sharp' | 'pill';
type TabId = 'home' | 'cards' | 'activity' | 'settings' | 'send' | 'fx';
type AppKind = 'banking' | 'fintech' | 'psp' | 'wallet' | 'crypto';
type PageId =
  | 'signin'
  | 'home'
  | 'accounts'
  | 'transfers'
  | 'send'
  | 'request'
  | 'cards'
  | 'history'
  | 'notifications'
  | 'profile'
  | 'splash';

interface ModuleAsset {
  id: ModuleId;
  title: string;
  subtitle: string;
  category: Category;
  badge: string;
  badgeColor: string;
}

interface Transaction {
  id: string;
  name: string;
  sub: string;
  amount: number;
  method: string;
  kind: 'in' | 'out';
}

interface SavingsGoal {
  id: string;
  name: string;
  amount: number;
}

const RADII: Record<RadiusMode, { card: string; tile: string; icon: string }> = {
  rounded: { card: 'rounded-[20px]', tile: 'rounded-2xl', icon: 'rounded-xl' },
  sharp: { card: 'rounded-none', tile: 'rounded-none', icon: 'rounded-none' },
  pill: { card: 'rounded-[28px]', tile: 'rounded-[24px]', icon: 'rounded-full' },
};
type Radius = (typeof RADII)[RadiusMode];

const availableModules: ModuleAsset[] = [
  { id: 'accounts', title: 'Multi-Layer Balance Card', subtitle: 'Total balance with wallet shortcut', category: 'balances', badge: 'Core', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100' },
  { id: 'cashflow', title: 'Income & Outcome Strip', subtitle: 'Money in and out at a glance', category: 'ledger', badge: 'New', badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100' },
  { id: 'transfers', title: 'Quick Actions Matrix', subtitle: 'Send, Request, Pay Bill & Top Up', category: 'actions', badge: 'Action', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  { id: 'vaults', title: 'Savings Goals', subtitle: 'Pockets for what you are saving toward', category: 'balances', badge: 'Savings', badgeColor: 'bg-purple-50 text-purple-600 border border-purple-100' },
  { id: 'cards', title: 'Recent Activity Card', subtitle: 'Latest transactions with merchant icons', category: 'ledger', badge: 'Live', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100' },
  { id: 'fx', title: 'FX Ticker & Wallets', subtitle: 'Multi-currency wallets with live rate', category: 'fx', badge: 'Global', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100' },
  { id: 'analytics', title: 'Spending Intelligence', subtitle: 'Monthly spend trend and budgets', category: 'ledger', badge: 'AI', badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
  { id: 'security', title: 'Biometric Shield & 2FA', subtitle: 'Face ID required for transfers', category: 'security', badge: 'Shield', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  { id: 'notifications', title: 'Real-Time Alerts', subtitle: 'Push alerts and header bell badge', category: 'security', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100' },
  { id: 'signin', title: 'Sign-In Gate', subtitle: 'Brand lockup, email & Face ID entry', category: 'onboarding', badge: 'Auth', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200' },
  { id: 'accountsPage', title: 'Accounts Overview', subtitle: 'Sub-accounts list with available funds', category: 'balances', badge: 'Core', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100' },
  { id: 'transfersPage', title: 'Transfer Builder', subtitle: 'Recipient, rail selector and fee preview', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  { id: 'sendPage', title: 'Send Money Form', subtitle: 'Amount pad with memo and category', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  { id: 'requestPage', title: 'Request Money Sheet', subtitle: 'Invoice-style ask with share link', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  { id: 'historyPage', title: 'Ledger Filter Bar', subtitle: 'Date range, status and type chips', category: 'ledger', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100' },
  { id: 'splash', title: 'Splash Screen', subtitle: 'Animated brand mark and loader', category: 'onboarding', badge: 'Brand', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200' },
  { id: 'profile', title: 'Profile Identity Card', subtitle: 'Avatar, KYC level and account tier', category: 'security', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100' },
  { id: 'freezeCard', title: 'Freeze Card Toggle', subtitle: 'Instantly block card transactions', category: 'security', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
];

const STARTER_LAYOUT: ModuleId[] = ['accounts', 'cashflow', 'transfers', 'vaults', 'cards'];

const APP_KINDS: { id: AppKind; label: string; blurb: string }[] = [
  { id: 'banking', label: 'Banking app', blurb: 'Retail bank with accounts, cards and transfers' },
  { id: 'fintech', label: 'Fintech app', blurb: 'Investing, budgeting and analytics-first' },
  { id: 'psp', label: 'Payment service provider', blurb: 'Merchant payments, payouts and invoicing' },
  { id: 'wallet', label: 'Digital wallet', blurb: 'P2P wallet with virtual cards and top-ups' },
  { id: 'crypto', label: 'Crypto exchange', blurb: 'Spot swaps, multi-chain balances and custody' },
];

/* Pages and their default component set. This drives BOTH the Pages menu
   and which components are shown when a page is selected. */
const PAGES: { id: PageId; label: string; modules: ModuleId[] }[] = [
  { id: 'signin', label: 'Sign In', modules: ['signin'] },
  { id: 'home', label: 'Home', modules: ['accounts', 'cashflow', 'transfers', 'vaults', 'cards'] },
  { id: 'accounts', label: 'Accounts', modules: ['accountsPage', 'accounts'] },
  { id: 'transfers', label: 'Transfers', modules: ['transfersPage', 'transfers', 'cashflow'] },
  { id: 'send', label: 'Send', modules: ['sendPage', 'cashflow', 'transfers'] },
  { id: 'request', label: 'Request', modules: ['requestPage', 'notifications'] },
  { id: 'cards', label: 'Cards', modules: ['cards', 'freezeCard', 'vaults'] },
  { id: 'history', label: 'Transaction history', modules: ['historyPage', 'cards', 'analytics'] },
  { id: 'notifications', label: 'Notifications', modules: ['notifications', 'profile'] },
  { id: 'profile', label: 'Profile and security', modules: ['profile', 'security'] },
  { id: 'splash', label: 'Splash Screens', modules: ['splash'] },
];

/* Which phone tab the preview should show when a page is selected. */
const PAGE_TO_TAB: Record<PageId, TabId> = {
  signin: 'home',
  home: 'home',
  accounts: 'home',
  transfers: 'home',
  send: 'send',
  request: 'home',
  cards: 'cards',
  history: 'activity',
  notifications: 'home',
  profile: 'settings',
  splash: 'home',
};

/* Reverse mapping: when a bottom-nav tab is clicked, which page to edit. */
const TAB_TO_PAGE: Record<TabId, PageId> = {
  home: 'home',
  cards: 'cards',
  activity: 'history',
  settings: 'profile',
  send: 'send',
  fx: 'home',
};

const INITIAL_BALANCE = 25000.4;
const INITIAL_INCOME = 20000;
const INITIAL_OUTCOME = 17000;
const FX_RATE = 0.9245;
const HISTORY_LIMIT = 20;

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', name: 'Apple Flagship Store', sub: 'Gadgets · Today, 10:24 AM', amount: 149, method: 'Visa - #022', kind: 'out' },
  { id: 't2', name: 'Stripe Payout', sub: 'Income · Today, 08:30 AM', amount: 4200, method: 'Bank - #118', kind: 'in' },
  { id: 't3', name: 'AWS Hosting', sub: 'Cloud · Yesterday, 6:12 PM', amount: 240.5, method: 'Visa - #022', kind: 'out' },
];

const INITIAL_SAVINGS: SavingsGoal[] = [
  { id: 'iphone', name: 'iPhone 13 Mini', amount: 699 },
  { id: 'macbook', name: 'Macbook Pro M1', amount: 1499 },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const whole = (n: number) => `$ ${Math.round(n).toLocaleString('en-US')}`;
const round2 = (n: number) => Math.round(n * 100) / 100;
const parseAmount = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const formatAmount = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const surface = (dark: boolean) =>
  dark ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5' : 'bg-white text-slate-900 shadow-[0_6px_24px_rgba(37,52,120,0.08)]';

const ringVar = (color: string) => ({ ['--tw-ring-color' as string]: color } as React.CSSProperties);

const buildInitialPages = (): Record<PageId, ModuleId[]> => {
  const out = {} as Record<PageId, ModuleId[]>;
  for (const p of PAGES) out[p.id] = p.id === 'home' ? [] : p.modules;
  return out;
};

const pageModulesFor = (page: PageId): ModuleId[] =>
  PAGES.find((p) => p.id === page)?.modules ?? [];

/* -------------------------------------------------------------------------- */
/*  Shared module renderer                                                    */
/* -------------------------------------------------------------------------- */

interface ViewActions {
  send: () => void;
  request: () => void;
  payBill: () => void;
  topUp: () => void;
  openWallet: () => void;
  openFx: () => void;
  openHistory: () => void;
  seeAllSavings: () => void;
  deposit: (goalId: string) => void;
  toggleFaceId: () => void;
  openAlerts: () => void;
  signIn: () => void;
  toggleFreeze: () => void;
}

interface ViewCtx {
  radius: Radius;
  accent: string;
  isDark: boolean;
  interactive: boolean;
  balance: number;
  income: number;
  outcome: number;
  savings: SavingsGoal[];
  transactions: Transaction[];
  faceId: boolean;
  isCardFrozen: boolean;
  actions: ViewActions;
}

const noop = () => {};
const noopActions: ViewActions = {
  send: noop,
  request: noop,
  payBill: noop,
  topUp: noop,
  openWallet: noop,
  openFx: noop,
  openHistory: noop,
  seeAllSavings: noop,
  deposit: noop,
  toggleFaceId: noop,
  openAlerts: noop,
  signIn: noop,
  toggleFreeze: noop,
};

function Tap({
  ctx,
  onClick,
  label,
  className = '',
  children,
}: {
  ctx: ViewCtx;
  onClick: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (!ctx.interactive) return <div className={className}>{children}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={ringVar(ctx.accent)}
      className={`cursor-pointer text-left outline-none transition motion-safe:active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-1 ${className}`}
    >
      {children}
    </button>
  );
}

function Switch({
  checked,
  onChange,
  label,
  accent,
  interactive = true,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  accent: string;
  interactive?: boolean;
}) {
  const track = (
    <span
      className={`relative inline-block h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${checked ? '' : 'bg-slate-300'}`}
      style={checked ? { background: accent } : undefined}
    >
      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </span>
  );
  if (!interactive) return track;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      style={ringVar(accent)}
      className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {track}
    </button>
  );
}

function SectionHeader({
  ctx,
  title,
  action,
  onAction,
}: {
  ctx: ViewCtx;
  title: string;
  action?: React.ReactNode;
  onAction?: () => void;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between px-0.5">
      <h3 className="text-[13px] font-semibold">{title}</h3>
      {action && (
        <Tap ctx={ctx} onClick={onAction ?? noop} label={title} className="flex items-center text-[11px] font-semibold">
          <span className="flex items-center" style={{ color: ctx.accent }}>
            {action}
          </span>
        </Tap>
      )}
    </div>
  );
}

function BalanceCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div
      className={`relative h-[132px] overflow-hidden p-5 text-white ${ctx.radius.card} ${
        ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_10px_28px_rgba(20,20,40,0.22)]'
      }`}
      style={{ background: INK }}
    >
      <span aria-hidden className="absolute -right-7 -top-7 h-[84px] w-[84px] rounded-full" style={{ background: ctx.accent }} />
      <span aria-hidden className="absolute -right-6 top-[34%] h-16 w-16 rounded-full" style={{ background: YELLOW }} />
      <span aria-hidden className="absolute -bottom-7 -left-7 h-[76px] w-[76px] rounded-full" style={{ background: GREEN }} />
      <div className="relative">
        <p className="text-[10px] text-white/60">Total Balance</p>
        <p className="mt-1 text-[26px] font-bold leading-none tracking-tight">{usd(ctx.balance)}</p>
      </div>
      <Tap
        ctx={ctx}
        onClick={ctx.actions.openWallet}
        label="Open wallet"
        className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-semibold"
      >
        My Wallet
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white" style={{ color: INK }}>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Tap>
    </div>
  );
}

function CashflowStrip({ ctx }: { ctx: ViewCtx }) {
  return (
    <div
      className={`relative grid grid-cols-2 overflow-hidden text-white ${ctx.radius.card} ${
        ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_8px_22px_rgba(20,20,40,0.18)]'
      }`}
      style={{ background: INK }}
    >
      <span aria-hidden className="absolute -left-4 -top-4 h-10 w-10 rounded-full bg-violet-500/30" />
      <span aria-hidden className="absolute -bottom-4 -right-4 h-10 w-10 rounded-full bg-amber-700/40" />
      <div className="relative flex items-center gap-2.5 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <ArrowDown className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[9px] text-white/50">Income</p>
          <p className="text-[12px] font-semibold">{whole(ctx.income)}</p>
        </div>
      </div>
      <div className="relative flex items-center gap-2.5 border-l border-white/10 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-500/15 text-rose-400">
          <ArrowUp className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[9px] text-white/50">Outcome</p>
          <p className="text-[12px] font-semibold">{whole(ctx.outcome)}</p>
        </div>
      </div>
    </div>
  );
}

function QuickActions({ ctx }: { ctx: ViewCtx }) {
  const items = [
    { label: 'Send', Icon: Send, color: ctx.accent, run: ctx.actions.send },
    { label: 'Request', Icon: ArrowDownLeft, color: GREEN, run: ctx.actions.request },
    { label: 'Pay Bill', Icon: Receipt, color: YELLOW, run: ctx.actions.payBill },
    { label: 'Top Up', Icon: PlusCircle, color: PINK, run: ctx.actions.topUp },
  ];
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {items.map(({ label, Icon, color, run }) => (
        <Tap
          key={label}
          ctx={ctx}
          onClick={run}
          label={label}
          className={`flex w-full flex-col items-center gap-2 py-3.5 ${ctx.radius.tile} ${surface(ctx.isDark)}`}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.75} />
          <span className="text-[10px] font-semibold">{label}</span>
        </Tap>
      ))}
    </div>
  );
}

function SavingsCards({ ctx }: { ctx: ViewCtx }) {
  return (
    <section>
      <SectionHeader ctx={ctx} title="Savings" action="See All" onAction={ctx.actions.seeAllSavings} />
      <div className="grid grid-cols-2 gap-3">
        {ctx.savings.map((g) => (
          <Tap
            key={g.id}
            ctx={ctx}
            onClick={() => ctx.actions.deposit(g.id)}
            label={`Add $100 to ${g.name}`}
            className={`w-full p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate">{g.name}</span>
              <ChevronRight className="h-3 w-3 shrink-0" />
            </div>
            <p className="mt-4 text-[15px] font-bold">${g.amount.toLocaleString('en-US')}</p>
          </Tap>
        ))}
      </div>
    </section>
  );
}

function TxRow({ tx, ctx }: { tx: Transaction; ctx: ViewCtx }) {
  const isIn = tx.kind === 'in';
  return (
    <div className={`flex items-center justify-between gap-3 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center ${ctx.radius.icon} ${
            isIn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
          }`}
        >
          {isIn ? <ArrowDownLeft className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold">{tx.name}</p>
          <p className="truncate text-[9px] text-slate-400">{tx.sub}</p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-[12px] font-bold ${isIn ? 'text-emerald-600' : ''}`}>
          {isIn ? '+' : '-'} {usd(tx.amount)}
        </p>
        <p className="text-[9px] text-slate-400">{tx.method}</p>
      </div>
    </div>
  );
}

function RecentActivity({ ctx }: { ctx: ViewCtx }) {
  const rows = ctx.transactions.slice(0, ctx.interactive ? 3 : 1);
  return (
    <section>
      <SectionHeader
        ctx={ctx}
        title="Recent Activity"
        action={
          <>
            View History <ChevronRight className="h-3 w-3" />
          </>
        }
        onAction={ctx.actions.openHistory}
      />
      <div className="space-y-2.5">
        {rows.map((t) => (
          <TxRow key={t.id} tx={t} ctx={ctx} />
        ))}
      </div>
    </section>
  );
}

function FxWallets({ ctx }: { ctx: ViewCtx }) {
  const wallets = [
    ['USD', '$18.2k'],
    ['EUR', '€6.4k'],
    ['GBP', '£2.1k'],
  ];
  return (
    <section>
      <SectionHeader ctx={ctx} title="Wallets" action="Convert" onAction={ctx.actions.openFx} />
      <div className="grid grid-cols-3 gap-2.5">
        {wallets.map(([code, value]) => (
          <Tap
            key={code}
            ctx={ctx}
            onClick={ctx.actions.openFx}
            label={`Convert from ${code} wallet`}
            className={`w-full p-3 ${ctx.radius.tile} ${surface(ctx.isDark)}`}
          >
            <p className="text-[9px] font-medium text-slate-400">{code}</p>
            <p className="mt-1.5 text-[13px] font-bold">{value}</p>
          </Tap>
        ))}
      </div>
    </section>
  );
}

function SpendingCard({ ctx }: { ctx: ViewCtx }) {
  const bars = [40, 65, 48, 80, 55, 35];
  return (
    <div className={`p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-slate-400">Monthly spending</p>
          <p className="mt-1 text-[18px] font-bold">$4,820</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">-12.4% vs last month</span>
      </div>
      <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden>
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${h}%`, background: i === bars.length - 1 ? ctx.accent : `${ctx.accent}33` }}
          />
        ))}
      </div>
    </div>
  );
}

function SecurityRow({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center bg-emerald-50 text-emerald-600 ${ctx.radius.icon}`}>
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[12px] font-semibold">Face ID</p>
          <p className="text-[9px] text-slate-400">{ctx.faceId ? 'Required for transfers' : 'Turned off'}</p>
        </div>
      </div>
      <Switch checked={ctx.faceId} onChange={ctx.actions.toggleFaceId} label="Face ID" accent={ctx.accent} interactive={ctx.interactive} />
    </div>
  );
}

function AlertsRow({ ctx }: { ctx: ViewCtx }) {
  return (
    <Tap
      ctx={ctx}
      onClick={ctx.actions.openAlerts}
      label="Open alerts"
      className={`flex w-full items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}
    >
      <div className="flex items-center gap-3">
        <span className={`relative grid h-9 w-9 place-items-center bg-amber-50 text-amber-600 ${ctx.radius.icon}`}>
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-white" style={{ background: PINK }} />
        </span>
        <div>
          <p className="text-[12px] font-semibold">3 new alerts</p>
          <p className="text-[9px] text-slate-400">Stripe payout received</p>
        </div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
    </Tap>
  );
}

/* ------------------------- page-specific modules -------------------------- */

function SignInCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: ctx.accent }}>
          <Lock className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[13px] font-bold">Welcome back</p>
          <p className="text-[9px] text-slate-400">Sign in to continue</p>
        </div>
      </div>
      <div className={`px-3 py-2 text-[10px] text-slate-400 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        you@example.com
      </div>
      <Tap
        ctx={ctx}
        onClick={ctx.actions.signIn}
        label="Sign in with Face ID"
        className={`flex w-full items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`}
      >
        <span className={`flex w-full items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>
          <LogIn className="h-3.5 w-3.5" /> Sign in with Face ID
        </span>
      </Tap>
    </div>
  );
}

function AccountsOverview({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    ['Everyday Checking', '$12,480.20', 'USD'],
    ['High-Yield Savings', '$8,920.00', 'USD'],
    ['Euro Travel Account', '€3,410.55', 'EUR'],
  ];
  return (
    <section>
      <SectionHeader ctx={ctx} title="Your accounts" action="Manage" />
      <div className="space-y-2">
        {rows.map(([name, amt, ccy]) => (
          <div key={name} className={`flex items-center justify-between p-3 ${ctx.radius.tile} ${surface(ctx.isDark)}`}>
            <div>
              <p className="text-[11px] font-semibold">{name}</p>
              <p className="text-[9px] text-slate-400">Available · {ccy}</p>
            </div>
            <p className="text-[12px] font-bold">{amt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TransferBuilder({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-2.5 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <p className="text-[11px] font-semibold">New transfer</p>
      <div className={`flex items-center justify-between px-3 py-2 text-[10px] ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <span className="text-slate-400">Recipient</span>
        <span className="font-mono">US89 APX ···· 7364</span>
      </div>
      <div className="flex gap-1.5">
        {['ACH', 'Wire', 'Instant'].map((rail, i) => (
          <span
            key={rail}
            className={`flex-1 rounded-full py-1 text-center text-[9px] font-semibold ${i === 2 ? 'text-white' : 'text-slate-500'} ${
              i === 2 ? '' : ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
            style={i === 2 ? { background: ctx.accent } : undefined}
          >
            {rail}
          </span>
        ))}
      </div>
      <p className="text-[9px] text-slate-400">Fee $0.00 · Arrives in seconds</p>
    </div>
  );
}

function SendForm({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-2.5 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold">Send money</p>
        <span className="text-[9px] text-slate-400">Balance {usd(ctx.balance)}</span>
      </div>
      <p className="text-center text-[26px] font-bold tracking-tight">$ 250.00</p>
      <div className={`px-3 py-2 text-[10px] text-slate-400 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        Add a note…
      </div>
      <div className="flex gap-1.5">
        {['Rent', 'Food', 'Gift'].map((tag, i) => (
          <span
            key={tag}
            className={`flex-1 rounded-full py-1 text-center text-[9px] font-semibold ${i === 0 ? 'text-white' : 'text-slate-500'} ${
              i === 0 ? '' : ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
            style={i === 0 ? { background: ctx.accent } : undefined}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function RequestSheet({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-2.5 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <p className="text-[11px] font-semibold">Request payment</p>
      <div className={`flex items-center justify-between px-3 py-2 text-[10px] ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <span className="text-slate-400">From</span>
        <span>@alex.morgan</span>
      </div>
      <p className="text-center text-[22px] font-bold tracking-tight">$ 1,200.00</p>
      <div className="flex gap-2">
        <span className={`flex-1 rounded-full py-1.5 text-center text-[9px] font-semibold text-white`} style={{ background: ctx.accent }}>
          Copy link        </span>
        <span className={`flex-1 rounded-full py-1.5 text-center text-[9px] font-semibold text-slate-500 ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          Share
        </span>
      </div>
    </div>
  );
}

function HistoryFilters({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-2 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-2">
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[10px] text-slate-400">Search transactions…</span>
      </div>
      <div className="flex gap-1.5 overflow-hidden">
        {['All', 'Income', 'Spending', 'Pending'].map((chip, i) => (
          <span
            key={chip}
            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${i === 0 ? 'text-white' : 'text-slate-500'} ${
              i === 0 ? '' : ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
            style={i === 0 ? { background: ctx.accent } : undefined}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function SplashCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div
      className={`flex h-[240px] flex-col items-center justify-center gap-3 ${ctx.radius.card} ${
        ctx.isDark ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-slate-900 text-white'
      }`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-white" style={{ background: ctx.accent }}>
        A
      </span>
      <p className="text-[13px] font-bold tracking-wide text-white">APEX BANK</p>
      <span className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
        <span className="block h-full w-1/2 rounded-full" style={{ background: ctx.accent }} />
      </span>
    </div>
  );
}

function ProfileCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white" style={{ background: ctx.accent }}>
          U
        </span>
        <div>
          <p className="text-[12px] font-semibold">User Name</p>
          <p className="text-[9px] text-slate-400">user@apex.bank</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">KYC Verified</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-600">Tier 2</span>
      </div>
    </div>
  );
}

function FreezeCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center bg-sky-50 text-sky-600 ${ctx.radius.icon}`}>
          <Snowflake className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[12px] font-semibold">Freeze Card</p>
          <p className="text-[9px] text-slate-400">{ctx.isCardFrozen ? 'Card is frozen' : 'Block instant transactions'}</p>
        </div>
      </div>
      <Switch checked={ctx.isCardFrozen} onChange={ctx.actions.toggleFreeze} label="Freeze card" accent={ctx.accent} interactive={ctx.interactive} />
    </div>
  );
}

function ModuleView({ id, ctx }: { id: ModuleId; ctx: ViewCtx }) {
  switch (id) {
    case 'accounts': return <BalanceCard ctx={ctx} />;
    case 'cashflow': return <CashflowStrip ctx={ctx} />;
    case 'transfers': return <QuickActions ctx={ctx} />;
    case 'vaults': return <SavingsCards ctx={ctx} />;
    case 'cards': return <RecentActivity ctx={ctx} />;
    case 'fx': return <FxWallets ctx={ctx} />;
    case 'analytics': return <SpendingCard ctx={ctx} />;
    case 'security': return <SecurityRow ctx={ctx} />;
    case 'notifications': return <AlertsRow ctx={ctx} />;
    case 'signin': return <SignInCard ctx={ctx} />;
    case 'accountsPage': return <AccountsOverview ctx={ctx} />;
    case 'transfersPage': return <TransferBuilder ctx={ctx} />;
    case 'sendPage': return <SendForm ctx={ctx} />;
    case 'requestPage': return <RequestSheet ctx={ctx} />;
    case 'historyPage': return <HistoryFilters ctx={ctx} />;
    case 'splash': return <SplashCard ctx={ctx} />;
    case 'profile': return <ProfileCard ctx={ctx} />;
    case 'freezeCard': return <FreezeCard ctx={ctx} />;
    default: return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                           */
/* -------------------------------------------------------------------------- */

function DropLine({ side, accent }: { side: 'top' | 'bottom'; accent: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-x-0 z-30 flex items-center ${side === 'top' ? '-top-3' : '-bottom-3'}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
      <span className="h-0.5 flex-1 rounded-full" style={{ background: accent }} />
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
    </span>
  );
}

function ToolbarButton({
  label, onClick, disabled, danger, children,
}: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-6 w-6 cursor-pointer place-items-center rounded-full outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'text-rose-500' : 'text-slate-600'
      }`}
    >
      {children}
    </button>
  );
}

function PageMenuItem({
  label, count, active, onClick,
}: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left transition ${
        active ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-slate-50'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
        <span className={`truncate text-[11px] font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
      </span>
      <span
        className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
          active ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {count} comps
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Editable page canvas (used for EVERY page, including Cards/Activity/     */
/*  Profile so those tabs support drag, add and delete).                      */
/* -------------------------------------------------------------------------- */

interface PageCanvasProps {
  page: PageId;
  pageLabel: string;
  modules: ModuleId[];
  ctx: ViewCtx;
  editMode: boolean;
  drag: { id: ModuleId; from: 'library' | 'canvas' } | null;
  dropIndex: number | null;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onMove: (id: ModuleId, dir: -1 | 1) => void;
  onRemove: (id: ModuleId) => void;
  onQuickAdd: (id: ModuleId) => void;
  onBackHome?: () => void;
  isDark: boolean;
  accent: string;
  radius: Radius;
}

function PageCanvas({
  page, pageLabel, modules, ctx, editMode, drag, dropIndex, bodyRef,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove, onQuickAdd,
  onBackHome, isDark, accent, radius,
}: PageCanvasProps) {
  return (
    <>
      {onBackHome && (
        <button
          type="button"
          onClick={onBackHome}
          className="mb-3 flex cursor-pointer items-center gap-1 self-start text-[11px] font-semibold hover:underline"
          style={{ color: accent }}
        >
          &larr; Back to Home
        </button>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-500">{pageLabel}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
          {modules.length} comps
        </span>
      </div>

      {modules.length === 0 ? (
        <div
          style={drag ? { borderColor: accent, background: `${accent}14` } : undefined}
          className={`my-auto flex flex-col items-center justify-center space-y-3 border-2 border-dashed p-6 text-center transition-colors ${radius.card} ${
            drag ? '' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-blue-300/60 bg-blue-50/20'
          }`}
        >
          <div className={`grid h-12 w-12 place-items-center text-white shadow-sm ${radius.icon}`} style={{ background: accent }}>
            <Plus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold">{drag ? 'Drop to add it here' : `Build the ${pageLabel} page`}</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">Drag tiles from the library, or tap a suggestion below.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
            {pageModulesFor(page).slice(0, 3).map((id) => {
              const label = availableModules.find((m) => m.id === id)?.title ?? id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onQuickAdd(id)}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${
                    isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`}
                >
                  + {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {modules.map((id, i) => {
            const mod = availableModules.find((m) => m.id === id);
            const title = mod?.title ?? id;
            const isSource = drag?.from === 'canvas' && drag.id === id;
            return (
              <div
                key={id}
                data-module-id={id}
                draggable={editMode}
                onDragStart={(e) => onStartDrag(e, id, 'canvas')}
                onDragEnd={onEndDrag}
                onDragOver={(e) => onItemDragOver(e, i)}
                onDrop={onDrop}
                style={{ ['--tw-ring-color' as string]: accent } as React.CSSProperties}
                className={`group relative ${radius.card} ${
                  editMode ? 'cursor-grab ring-offset-2 focus-within:ring-2 hover:ring-2 active:cursor-grabbing' : ''
                } ${isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'} ${isSource ? 'opacity-40' : ''}`}
              >
                {drag && dropIndex === i && <DropLine side="top" accent={accent} />}
                {drag && dropIndex === modules.length && i === modules.length - 1 && (
                  <DropLine side="bottom" accent={accent} />
                )}

                {editMode && (
                  <div className="absolute -top-3.5 right-2 z-20 flex items-center gap-0.5 rounded-full bg-white p-0.5 opacity-0 shadow-md ring-1 ring-slate-200 transition group-focus-within:opacity-100 group-hover:opacity-100">
                    <GripVertical className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                    <ToolbarButton label={`Move ${title} up`} disabled={i === 0} onClick={() => onMove(id, -1)}>
                      <ChevronUp className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    <ToolbarButton label={`Move ${title} down`} disabled={i === modules.length - 1} onClick={() => onMove(id, 1)}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    <ToolbarButton label={`Remove ${title}`} danger onClick={() => onRemove(id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </ToolbarButton>
                  </div>
                )}

                <div className={drag ? 'pointer-events-none' : ''}>
                  <ModuleView id={id} ctx={ctx} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* keep ref used for auto-scroll regardless of branch */}
      <div ref={bodyRef} className="hidden" aria-hidden />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main section                                                              */
/* -------------------------------------------------------------------------- */

export default function BuildSection() {
  const [studioTab, setStudioTab] = useState<'brand' | 'components'>('components');
  const [componentFilter, setComponentFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [appKind, setAppKind] = useState<AppKind>('banking');
  const activeKind = APP_KINDS.find((k) => k.id === appKind)!;

  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [template, setTemplate] = useState<'neobank' | 'corporate' | 'marketplace'>('neobank');
  const [brandName, setBrandName] = useState('Apex Bank');
  const [userName, setUserName] = useState('User');
  const [accentColor, setAccentColor] = useState('#0A63F8');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<RadiusMode>('rounded');
  const [prefersDark, setPrefersDark] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning!');

  /* Active page + per-page canvas. */
  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageModules, setPageModules] = useState<Record<PageId, ModuleId[]>>(buildInitialPages);
  const [histories, setHistories] = useState<Record<PageId, ModuleId[][]>>(() => {
    const out = {} as Record<PageId, ModuleId[][]>;
    for (const p of PAGES) out[p.id] = [];
    return out;
  });
  const [editMode, setEditMode] = useState(true);

  /* Custom pages */
  const [customPages, setCustomPages] = useState<{ id: string; label: string }[]>([]);

  const canvasModules = pageModules[activePage] ?? [];
  const history = histories[activePage] ?? [];
  const currentPageLabel =
    customPages.find((p) => p.id === activePage)?.label ??
    PAGES.find((p) => p.id === activePage)?.label ??
    'Page';

  const pageComponents = useMemo(() => {
    const ids = pageModulesFor(activePage);
    return availableModules.filter((m) => ids.includes(m.id));
  }, [activePage]);

  /* Drag & drop */
  const [drag, setDrag] = useState<{ id: ModuleId; from: 'library' | 'canvas' } | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  /* Phone app state */
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [faceId, setFaceId] = useState(true);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [income] = useState(INITIAL_INCOME);
  const [outcome, setOutcome] = useState(INITIAL_OUTCOME);
  const [savings, setSavings] = useState<SavingsGoal[]>(INITIAL_SAVINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [recipient, setRecipient] = useState('US89 APX 0000 9182 7364');
  const [sendAmount, setSendAmount] = useState('2,500.00');
  const [sendError, setSendError] = useState<string | null>(null);
  const [fxAmount, setFxAmount] = useState('1,000.00');
  const [fxFrom, setFxFrom] = useState<'USD' | 'EUR'>('USD');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ----------------------------- derived values ---------------------------- */

  const radius = RADII[buttonRadius];
  const isDark = interfaceMode === 'dark' || (interfaceMode === 'auto' && prefersDark);
  const isAndroid = platform === 'android';

  const getGradientStyle = () => {
    if (accentColor === '#0A63F8') return 'from-blue-600 via-indigo-600 to-blue-700';
    if (accentColor === '#6366F1') return 'from-indigo-600 via-purple-600 to-indigo-800';
    if (accentColor === '#EC4899') return 'from-pink-600 via-rose-600 to-pink-700';
    if (accentColor === '#10B981') return 'from-emerald-600 via-teal-600 to-emerald-800';
    return 'from-slate-800 via-slate-900 to-black';
  };

  const q = search.trim().toLowerCase();
  const filteredModules = pageComponents.filter(
    (m) =>
      (componentFilter === 'all' || m.category === componentFilter) &&
      (!q || `${m.title} ${m.subtitle} ${m.badge}`.toLowerCase().includes(q))
  );
  const countFor = (id: string) =>
    id === 'all' ? pageComponents.length : pageComponents.filter((m) => m.category === id).length;

  /* --------------------------------- effects -------------------------------- */

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setPrefersDark(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good Morning!' : h < 18 ? 'Good Afternoon!' : 'Good Evening!');
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /* ------------------------------ canvas actions ---------------------------- */

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  const commit = (next: ModuleId[]) => {
    if (next.length === canvasModules.length && next.every((m, i) => m === canvasModules[i])) return;
    setHistories((h) => ({ ...h, [activePage]: [...(h[activePage] ?? []).slice(-(HISTORY_LIMIT - 1)), canvasModules] }));
    setPageModules((p) => ({ ...p, [activePage]: next }));
  };

  const undo = () => {
    const h = histories[activePage] ?? [];
    if (h.length === 0) return;
    setPageModules((p) => ({ ...p, [activePage]: h[h.length - 1] }));
    setHistories((prev) => ({ ...prev, [activePage]: h.slice(0, -1) }));
  };

  const placeModule = (id: ModuleId, index: number) => {
    const from = canvasModules.indexOf(id);
    const next = canvasModules.filter((m) => m !== id);
    let at = index;
    if (from !== -1 && from < index) at -= 1;
    next.splice(Math.max(0, Math.min(at, next.length)), 0, id);
    commit(next);
  };

  const scrollModuleIntoView = (id: ModuleId) => {
    setTimeout(() => {
      bodyRef.current?.querySelector(`[data-module-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 60);
  };

  const addModule = (id: ModuleId) => {
    if (canvasModules.includes(id)) return;
    commit([...canvasModules, id]);
    setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
    scrollModuleIntoView(id);
  };

  const removeModule = (id: ModuleId) => commit(canvasModules.filter((m) => m !== id));
  const toggleModule = (id: ModuleId) => (canvasModules.includes(id) ? removeModule(id) : addModule(id));

  const moveModule = (id: ModuleId, dir: -1 | 1) => {
    const i = canvasModules.indexOf(id);
    const j = i + dir;
    if (i === -1 || j < 0 || j >= canvasModules.length) return;
    const next = [...canvasModules];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };

  const loadStarter = () => {
    commit(pageModulesFor(activePage));
    setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
  };

  /* Selecting a page also switches the phone preview to the matching tab. */
  const selectPage = (id: PageId) => {
    setActivePage(id);
    setActiveTab(PAGE_TO_TAB[id] ?? 'home');
    setComponentFilter('all');
    setSearch('');
  };

  /* Navigate both the editor and the preview to a page/tab at once. */
  const goToPage = (id: PageId) => {
    setActivePage(id);
    setActiveTab(PAGE_TO_TAB[id] ?? 'home');
  };

  const addCustomPage = () => {
    const id = `custom-${Date.now()}`;
    const label = `Custom page ${customPages.length + 1}`;
    setCustomPages((p) => [...p, { id, label }]);
    setPageModules((p) => ({ ...p, [id]: [] } as Record<PageId, ModuleId[]>));
    setHistories((p) => ({ ...p, [id]: [] } as Record<PageId, ModuleId[][]>));
    setActivePage(id as PageId);
    setActiveTab('home');
  };

  /* ------------------------------ drag handlers ----------------------------- */

  const startDrag = (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = from === 'library' ? 'copyMove' : 'move';
    setDrag({ id, from });
    if (activeTab !== PAGE_TO_TAB[activePage]) setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
  };

  const endDrag = () => {
    setDrag(null);
    setDropIndex(null);
  };

  const autoScroll = (clientY: number) => {
    const el = bodyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (clientY < r.top + 48) el.scrollBy({ top: -14 });
    else if (clientY > r.bottom - 48) el.scrollBy({ top: 14 });
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    if (!drag) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
    autoScroll(e.clientY);
  };

  const handleContainerDragOver = (e: React.DragEvent) => {
    if (!drag) return;
    e.preventDefault();
    setDropIndex(canvasModules.length);
    autoScroll(e.clientY);
  };

  const handleContainerDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = (drag?.id ?? e.dataTransfer.getData('text/plain')) as ModuleId;
    if (availableModules.some((m) => m.id === id)) {
      placeModule(id, dropIndex ?? canvasModules.length);
      scrollModuleIntoView(id);
    }
    endDrag();
  };

  /* ------------------------------ phone actions ----------------------------- */

  const handleSend = () => {
    const amt = parseAmount(sendAmount);
    if (amt <= 0) return setSendError('Enter an amount greater than $0.00.');
    if (amt > balance) return setSendError(`That is more than your available balance of ${usd(balance)}.`);
    if (!recipient.trim()) return setSendError('Enter a recipient account or IBAN.');
    setSendError(null);
    setBalance((b) => round2(b - amt));
    setOutcome((o) => o + amt);
    setTransactions((t) => [
      { id: `t${Date.now()}`, name: 'Wire Transfer', sub: 'Transfer · Just now', amount: amt, method: 'Wire', kind: 'out' },
      ...t,
    ]);
    showToast(`${usd(amt)} sent`);
    goToPage('home');
  };

  const fxValue = parseAmount(fxAmount);
  const fxOutput = fxFrom === 'USD' ? fxValue * FX_RATE : fxValue / FX_RATE;
  const fxTo = fxFrom === 'USD' ? 'EUR' : 'USD';

  const handleDeposit = (goalId: string) => {
    const goal = savings.find((g) => g.id === goalId);
    if (!goal) return;
    if (balance < 100) return showToast('Not enough balance to add $100');
    setSavings((s) => s.map((g) => (g.id === goalId ? { ...g, amount: g.amount + 100 } : g)));
    setBalance((b) => round2(b - 100));
    showToast(`$100 added to ${goal.name}`);
  };

  const actions: ViewActions = {
    send: () => goToPage('send'),
    request: () => goToPage('request'),      // Request tile → Request form page
    payBill: () => showToast('Choose a biller to pay'),
    topUp: () => showToast('Top up from linked card'),
    openWallet: () => goToPage('cards'),
    openFx: () => setActiveTab('fx'),
    openHistory: () => goToPage('history'),
    seeAllSavings: () => showToast(`${savings.length} savings goals active`),
    deposit: handleDeposit,
    toggleFaceId: () => setFaceId((v) => !v),
    openAlerts: () => goToPage('notifications'),
    signIn: () => goToPage('home'),          // Sign in button → Home page
    toggleFreeze: () => setIsCardFrozen((v) => !v),
  };

  const liveCtx: ViewCtx = {
    radius, accent: accentColor, isDark, interactive: true,
    balance, income, outcome, savings, transactions, faceId, isCardFrozen, actions,
  };

  const thumbCtx: ViewCtx = {
    radius, accent: accentColor, isDark: false, interactive: false,
    balance: INITIAL_BALANCE, income: INITIAL_INCOME, outcome: INITIAL_OUTCOME,
    savings: INITIAL_SAVINGS, transactions: INITIAL_TRANSACTIONS, faceId: true, isCardFrozen: false, actions: noopActions,
  };

  const pageSurface = surface(isDark);
  const inputCls = `w-full border p-3 text-xs outline-none focus:ring-2 ${radius.icon} ${
    isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'
  }`;

  const navItems: { id: TabId; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'cards', label: 'Wallet', Icon: Wallet },
    { id: 'activity', label: 'Activity', Icon: BarChart3 },
    { id: 'settings', label: 'Profile', Icon: User },
  ];

  const hasAlerts = canvasModules.includes('notifications');

  const pageCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const p of PAGES) out[p.id] = (pageModules[p.id] ?? []).length;
    for (const p of customPages) out[p.id] = (pageModules[p.id as PageId] ?? []).length;
    return out;
  }, [pageModules, customPages]);

  /* Shared props for the editable canvas used on every tab. */
  const canvasProps = {
    page: activePage,
    pageLabel: currentPageLabel,
    modules: canvasModules,
    ctx: liveCtx,
    editMode,
    drag,
    dropIndex,
    bodyRef,
    onStartDrag: startDrag,
    onEndDrag: endDrag,
    onItemDragOver: handleItemDragOver,
    onDrop: handleDrop,
    onMove: moveModule,
    onRemove: removeModule,
    onQuickAdd: addModule,
    isDark,
    accent: accentColor,
    radius,
  };

  /* Pages that map to Home but aren't Home itself get a Back to Home button. */
  const needsBackHome = activePage !== 'home' && PAGE_TO_TAB[activePage] === 'home';

  /* --------------------------------- render --------------------------------- */

  return (
    <section className="w-full overflow-hidden bg-[#f4f6fc] px-4 py-16 font-sans text-slate-900 sm:px-6 md:py-24 lg:px-20">
      <div className="mx-auto max-w-full space-y-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-blue-600">CORE MODULES</span>
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]">
              Build and customize every part of your banking app, all in one place.
            </h2>
          </div>
          <p className="max-w-md text-sm font-normal leading-relaxed text-slate-500 sm:text-base">
            Take complete control of your mobile banking experience with a flexible workflow studio built for your brand. Choose from ready-made
            templates, customize colors and design systems, and preview changes in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT: STUDIO PANEL */}
          <div className="space-y-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-8 border-b border-slate-100 pb-4" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={studioTab === 'brand'}
                onClick={() => setStudioTab('brand')}
                className={`relative flex cursor-pointer items-center gap-2.5 pb-2 text-sm font-bold transition-all ${
                  studioTab === 'brand' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Palette className="h-4 w-4" />
                Brand &amp; Identity
                {studioTab === 'brand' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 rounded-full bg-blue-600" />}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={studioTab === 'components'}
                onClick={() => setStudioTab('components')}
                className={`relative flex cursor-pointer items-center gap-2.5 pb-2 text-sm font-bold transition-all ${
                  studioTab === 'components' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Components &amp; Modules
                {studioTab === 'components' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 rounded-full bg-blue-600" />}
              </button>
            </div>

            {studioTab === 'brand' && (
              <div className="space-y-8">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Brand Logo Asset</span>
                    <span className="text-[11px] font-medium text-slate-400">SVG, PNG (max 2MB)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-xs" style={{ background: accentColor }}>
                        {brandName ? brandName.charAt(0) : 'A'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{brandName ? brandName.replace(/\s+/g, '_') : 'Custom'}_Emblem.svg</h4>
                        <p className="text-[11px] text-slate-400">Vector • 48 × 48 dp • Scalable</p>
                      </div>
                    </div>
                    <button type="button" className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-100">
                      Change
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Template Presets</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'neobank', label: 'Neobank', name: 'Apex Bank' },
                      { id: 'corporate', label: 'Corporate', name: 'Vanguard Pay' },
                      { id: 'marketplace', label: 'Marketplace', name: 'Nova Capital' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { setTemplate(t.id as typeof template); setBrandName(t.name); }}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                          template === t.id ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{t.label}</span>
                        {template === t.id && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Brand &amp; Palette</h3>
                    <span className="text-[11px] font-medium text-slate-400">Live white-label styles</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="brand-name" className="block text-[11px] font-semibold text-slate-500">Custom Brand Name</label>
                      <input id="brand-name" type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Enter your brand name..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="user-name" className="block text-[11px] font-semibold text-slate-500">Preview User Name</label>
                      <input id="user-name" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Name shown in the greeting" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-500">Primary Brand Accent</label>
                      <span className="text-[11px] font-bold text-slate-700">Selected: {accentColor}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        {['#0A63F8', '#6366F1', '#EC4899', '#10B981', '#1E293B'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Use accent ${color}`}
                            onClick={() => setAccentColor(color)}
                            className={`h-7 w-7 cursor-pointer rounded-full transition-transform ${
                              accentColor === color ? 'scale-110 ring-2 ring-blue-600 ring-offset-2' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-700 shadow-xs">
                        <span>{accentColor}</span>
                        <span className="font-sans text-[10px] text-slate-400">HEX</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-500">App Interface Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        [
                          { id: 'light', label: 'Light', Icon: Sun },
                          { id: 'dark', label: 'Dark', Icon: Moon },
                          { id: 'auto', label: 'OS Auto', Icon: Monitor },
                        ] as const
                      ).map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setInterfaceMode(id)}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border py-2.5 text-xs font-bold transition-all ${
                            interfaceMode === id
                              ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Visual System Tokens</h3>
                    <span className="text-[11px] font-medium text-slate-400">Atomic UI primitives</span>
                  </div>
                  <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 shadow-xs">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-500">Button &amp; Card Geometry Radius</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['rounded', 'sharp', 'pill'] as const).map((rad) => (
                          <button
                            key={rad}
                            type="button"
                            onClick={() => setButtonRadius(rad)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold capitalize transition-all ${
                              buttonRadius === rad
                                ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span>{rad}</span>
                            {buttonRadius === rad && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {studioTab === 'components' && (
              <div className="space-y-5">
                {/* PRODUCT TYPE DROPDOWN */}
                <div className="space-y-1.5">
                  <label htmlFor="product-type" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Product Type</label>
                  <div className="relative">
                    <select
                      id="product-type"
                      value={appKind}
                      onChange={(e) => setAppKind(e.target.value as AppKind)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {APP_KINDS.map((k) => (
                        <option key={k.id} value={k.id}>{k.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="px-0.5 text-[10px] text-slate-400">{activeKind.blurb}</p>
                </div>

                {/* STYLE GUIDE ROW */}
                <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm" style={{ background: accentColor }}>
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">Style Guide</p>
                      <p className="text-[10px] text-slate-500">{brandName} · Indigo</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStudioTab('brand')}
                    aria-label="Open style guide"
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white text-slate-500 shadow-xs ring-1 ring-slate-200 transition hover:text-blue-600"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* PAGES MENU — clicking a page swaps grid AND phone tab */}
                <div className="rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Pages</span>
                    <span className="text-[10px] font-semibold text-slate-400">Reorderable</span>
                  </div>

                  <div className="max-h-[300px] space-y-1 overflow-y-auto p-2 scrollbar-none">
                    {PAGES.map((p) => (
                      <PageMenuItem
                        key={p.id}
                        label={p.label}
                        count={pageCounts[p.id] ?? 0}
                        active={activePage === p.id}
                        onClick={() => selectPage(p.id)}
                      />
                    ))}
                    {customPages.map((p) => (
                      <PageMenuItem
                        key={p.id}
                        label={p.label}
                        count={pageCounts[p.id] ?? 0}
                        active={activePage === p.id}
                        onClick={() => selectPage(p.id as PageId)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addCustomPage}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-b-2xl border-t border-slate-100 bg-blue-50/50 py-2.5 text-[11px] font-bold text-blue-600 transition hover:bg-blue-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add your own page
                  </button>
                </div>

                {/* SEARCH — scoped to the active page */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${currentPageLabel} components...`}
                    aria-label="Search modules"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* FILTER PILLS — counts reflect the active page only */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'balances', label: 'Balances & Cards' },
                    { id: 'actions', label: 'Actions' },
                    { id: 'fx', label: 'FX & Wallets' },
                    { id: 'ledger', label: 'Ledger & Analytics' },
                    { id: 'security', label: 'Security & Alerts' },
                    { id: 'onboarding', label: 'Onboarding' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setComponentFilter(f.id)}
                      className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                        componentFilter === f.id ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label} ({countFor(f.id)})
                    </button>
                  ))}
                </div>

                {/* HELPER BAR */}
                <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 p-3.5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing components for <span className="font-semibold text-slate-700">{currentPageLabel}</span>. Drag tiles onto the phone, or tap Add.
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={loadStarter}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-bold text-slate-700 shadow-xs ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Starter layout
                    </button>
                    <button
                      type="button"
                      onClick={undo}
                      disabled={history.length === 0}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-bold text-slate-700 shadow-xs ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Undo2 className="h-3.5 w-3.5" /> Undo
                    </button>
                    <button
                      type="button"
                      onClick={() => commit([])}
                      disabled={canvasModules.length === 0}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-bold text-rose-600 shadow-xs ring-1 ring-slate-200 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear
                    </button>
                  </div>
                </div>

                {/* COMPONENT GRID — filtered to the active page */}
                <div className="grid max-h-[520px] grid-cols-1 gap-4 overflow-y-auto p-1 pr-2 sm:grid-cols-2">
                  {filteredModules.length === 0 && (
                    <p className="col-span-full py-10 text-center text-xs text-slate-400">
                      No components match this filter on <span className="font-semibold">{currentPageLabel}</span>.
                    </p>
                  )}
                  {filteredModules.map((mod) => {
                    const isAdded = canvasModules.includes(mod.id);
                    const isDragging = drag?.id === mod.id && drag.from === 'library';
                    return (
                      <div
                        key={mod.id}
                        draggable
                        onDragStart={(e) => startDrag(e, mod.id, 'library')}
                        onDragEnd={endDrag}
                        style={isAdded ? ringVar(accentColor) : undefined}
                        className={`flex cursor-grab flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_6px_24px_rgba(37,52,120,0.08)] ring-1 transition active:cursor-grabbing motion-safe:duration-200 ${
                          isAdded ? 'ring-2' : 'ring-slate-100 hover:-translate-y-0.5 hover:ring-slate-200'
                        } ${isDragging ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="mb-0.5 flex flex-wrap items-center gap-2">
                              <h4 className="text-[13px] font-semibold text-slate-900">{mod.title}</h4>
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${mod.badgeColor}`}>{mod.badge}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">{mod.subtitle}</p>
                          </div>
                          <GripVertical className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                        </div>

                        <div aria-hidden className="pointer-events-none select-none overflow-hidden rounded-2xl bg-[#F4F5FD] p-3">
                          <div className={outfit.className}>
                            <ModuleView id={mod.id} ctx={thumbCtx} />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleModule(mod.id)}
                          aria-label={isAdded ? `Remove ${mod.title} from ${currentPageLabel}` : `Add ${mod.title} to ${currentPageLabel}`}
                          title={isAdded ? 'Click to remove from canvas' : 'Add to canvas'}
                          style={isAdded ? { color: accentColor, background: `${accentColor}14` } : undefined}
                          className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold transition ${
                            isAdded ? '' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5 stroke-[3]" /> Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" /> Add to {currentPageLabel}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex w-full justify-center border-t border-slate-100 pt-6">
              <button type="button" className="w-full cursor-pointer rounded-xl bg-blue-600 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 sm:w-auto sm:text-base">
                Continue Building Your App
              </button>
            </div>
          </div>

          {/* RIGHT: STICKY PHONE PREVIEW */}
          <div className="sticky top-8 flex flex-col items-center lg:col-span-5">
            <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2 px-2">
              <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
                {(['ios', 'android'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      platform === p ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {p === 'ios' ? 'Apple iOS' : 'Android'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    editMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    !editMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Eye className="h-3 w-3" /> Preview
                </button>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
                Live Studio
              </div>
            </div>

            <div className="mb-3 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-[11px] font-semibold shadow-xs ring-1 ring-slate-200">
              <span className="text-slate-500">Editing page</span>
              <span className="flex items-center gap-1.5 text-slate-900">
                {currentPageLabel}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">{canvasModules.length} comps</span>
              </span>
            </div>

            <div
              className={`relative w-full max-w-[380px] border-[3px] border-[#1d2b52] bg-[#101c3a] p-[10px] shadow-2xl ring-1 ring-white/10 ${
                isAndroid ? 'rounded-[36px]' : 'rounded-[48px]'
              }`}
            >
              {isAndroid ? (
                <div className="absolute left-1/2 top-[18px] z-30 h-3 w-3 -translate-x-1/2 rounded-full bg-black" />
              ) : (
                <div className="absolute left-1/2 top-[18px] z-30 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
              )}

              <div
                className={`${outfit.className} relative flex h-[680px] w-full flex-col overflow-hidden transition-colors duration-300 ${
                  isAndroid ? 'rounded-[28px]' : 'rounded-[38px]'
                } ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F7F8FF] text-slate-900'}`}
              >
                <div className="flex h-12 shrink-0 items-end justify-between px-7 pb-1.5 text-[11px] font-semibold">
                  <span>09:41</span>
                  <span className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <BatteryFull className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center text-sm font-bold text-white ${radius.icon === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`}
                      style={{ background: accentColor }}
                    >
                      {(userName || brandName || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] text-slate-400">{greeting}</p>
                      <p className="text-[13px] font-semibold">{userName || brandName || 'Welcome'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Notifications"
                    onClick={() => showToast(hasAlerts ? '3 new alerts' : 'No new notifications')}
                    className={`relative grid h-9 w-9 cursor-pointer place-items-center ${radius.icon === 'rounded-full' ? 'rounded-full' : radius.icon}`}
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    {hasAlerts && <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ background: PINK }} />}
                  </button>
                </div>

                <div
                  ref={bodyRef}
                  onDragOver={handleContainerDragOver}
                  onDragLeave={handleContainerDragLeave}
                  onDrop={handleDrop}
                  className="flex flex-1 flex-col overflow-y-auto px-5 pb-28 pt-4 scrollbar-none"
                >
                  {/* Home / Accounts / Transfers / Request / Notifications / Sign In / Splash
                      all render the editable canvas for the active page. */}
                  {activeTab === 'home' && (
                    <PageCanvas {...canvasProps} onBackHome={needsBackHome ? () => goToPage('home') : undefined} />
                  )}

                  {/* Cards tab — fully editable canvas */}
                  {activeTab === 'cards' && activePage === 'cards' && (
                    <PageCanvas {...canvasProps} />
                  )}

                  {/* Activity tab — fully editable canvas */}
                  {activeTab === 'activity' && activePage === 'history' && (
                    <PageCanvas {...canvasProps} />
                  )}

                  {/* Profile tab — fully editable canvas */}
                  {activeTab === 'settings' && activePage === 'profile' && (
                    <PageCanvas {...canvasProps} />
                  )}

                  {/* Send sub-page (wire form) — still its own interactive form */}
                  {activeTab === 'send' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => goToPage('home')}
                          className="flex cursor-pointer items-center gap-1 text-xs font-semibold hover:underline"
                          style={{ color: accentColor }}
                        >
                          &larr; Back to Home
                        </button>
                        <span className="text-[11px] font-semibold text-slate-400">Wire Transfer</span>
                      </div>

                      {/* Show the Send page canvas so Send components stay editable */}
                      <PageCanvas {...canvasProps} />

                      <div className={`space-y-3 p-4 ${radius.card} ${pageSurface}`}>
                        <div>
                          <label htmlFor="wire-recipient" className="mb-1 block text-[10px] font-semibold text-slate-400">Recipient IBAN / Account</label>
                          <input id="wire-recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className={`${inputCls} font-mono`} style={ringVar(accentColor)} />
                        </div>
                        <div>
                          <label htmlFor="wire-amount" className="mb-1 block text-[10px] font-semibold text-slate-400">Transfer Amount (USD)</label>
                          <input
                            id="wire-amount"
                            type="text"
                            inputMode="decimal"
                            value={sendAmount}
                            onChange={(e) => { setSendAmount(e.target.value); setSendError(null); }}
                            onBlur={() => setSendAmount(formatAmount(parseAmount(sendAmount)))}
                            aria-invalid={!!sendError}
                            className={`${inputCls} font-bold`}
                            style={ringVar(accentColor)}
                          />
                          <p className="mt-1 text-[9px] text-slate-400">Available: {usd(balance)}</p>
                        </div>
                        {sendError && <p role="alert" className="text-[10px] font-semibold text-rose-500">{sendError}</p>}
                        <button
                          type="button"
                          onClick={handleSend}
                          className={`w-full cursor-pointer py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90 ${radius.icon}`}
                          style={{ background: accentColor }}
                        >
                          Confirm &amp; Send Wire
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'fx' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => goToPage('home')}
                          className="flex cursor-pointer items-center gap-1 text-xs font-semibold hover:underline"
                          style={{ color: accentColor }}
                        >
                          &larr; Back to Home
                        </button>
                        <span className="text-[11px] font-semibold text-slate-400">FX Spot Swap</span>
                      </div>
                      <div className={`space-y-3 p-4 ${radius.card} ${pageSurface}`}>
                        <div className={`flex items-center justify-between border p-3 text-xs ${radius.icon} ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="min-w-0 flex-1">
                            <label htmlFor="fx-amount" className="block text-[9px] font-semibold text-slate-400">You Pay</label>
                            <input id="fx-amount" type="text" inputMode="decimal" value={fxAmount} onChange={(e) => setFxAmount(e.target.value)} onBlur={() => setFxAmount(formatAmount(parseAmount(fxAmount)))} className="w-full bg-transparent text-sm font-bold outline-none" />
                          </div>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">{fxFrom}</span>
                        </div>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            aria-label="Swap currencies"
                            onClick={() => setFxFrom((c) => (c === 'USD' ? 'EUR' : 'USD'))}
                            className={`grid h-8 w-8 cursor-pointer place-items-center border border-blue-100 bg-blue-50 text-blue-600 shadow-xs transition hover:bg-blue-100 ${radius.icon}`}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className={`flex items-center justify-between border p-3 text-xs ${radius.icon} ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                          <div>
                            <span className="block text-[9px] font-semibold text-slate-400">You Receive</span>
                            <span className="text-sm font-bold">{formatAmount(fxOutput)} {fxTo}</span>
                          </div>
                          <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">{fxTo}</span>
                        </div>
                        <p className="text-center text-[9px] text-slate-400">
                          {fxFrom === 'USD' ? `1 USD = ${FX_RATE} EUR` : `1 EUR = ${(1 / FX_RATE).toFixed(4)} USD`}
                        </p>
                        <button
                          type="button"
                          onClick={() => { showToast(`Swapped ${fxAmount} ${fxFrom} to ${formatAmount(fxOutput)} ${fxTo}`); goToPage('home'); }}
                          disabled={fxValue <= 0}
                          className={`w-full cursor-pointer py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${radius.icon}`}
                          style={{ background: accentColor }}
                        >
                          Execute Spot Swap
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div aria-live="polite" role="status" className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center px-6">
                  {toast && (
                    <span className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-lg ring-1 ring-white/10">{toast}</span>
                  )}
                </div>

                <nav
                  aria-label="App navigation"
                  className={`absolute inset-x-3 bottom-3 z-20 flex items-center justify-around px-4 py-3.5 ${
                    isDark ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-white shadow-[0_8px_30px_rgba(37,52,120,0.14)]'
                  } ${isAndroid ? 'rounded-[20px]' : 'rounded-[24px]'}`}
                >
                  {navItems.map(({ id, label, Icon }) => {
                    const active = activeTab === id || (id === 'home' && (activeTab === 'send' || activeTab === 'fx'));
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-label={label}
                        aria-current={active ? 'page' : undefined}
                        // Clicking a tab navigates BOTH the editor and preview to the matching page.
                        onClick={() => goToPage(TAB_TO_PAGE[id])}
                        style={{ ...ringVar(accentColor), color: active ? accentColor : undefined }}
                        className={`cursor-pointer rounded-full p-1.5 outline-none transition focus-visible:ring-2 ${active ? '' : 'text-slate-400'}`}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}