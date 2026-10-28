'use client';

import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bolt,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  Download,
  Droplet,
  EllipsisVertical,
  Eye,
  FileText,
  Fingerprint,
  Info,
  KeyRound,
  Landmark,
  Lock,
  MoreHorizontal,
  PiggyBank,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  User,
  Wallet,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Shared types — mirrors banking-wallet-modules for plug-and-play    */
/* ------------------------------------------------------------------ */

export type CryptoModuleId =
  // Home (8)
  | 'cryptoMetalCard'
  | 'cryptoCardQuickActions'
  | 'cryptoMonthlySpend'
  | 'cryptoMatteCardPromo'
  | 'cryptoRecentCardActivity'
  | 'cryptoHomeBalance'
  | 'cryptoFusePlusBanner'
  | 'cryptoLendingYieldRow'
  // Accounts (4)
  | 'cryptoSavingsHero'
  | 'cryptoLockBoostVaults'
  | 'cryptoActiveSavingsGoals'
  | 'cryptoInstitutionalSecurity'
  // Transfers (5)
  | 'cryptoBillsUpcoming'
  | 'cryptoAutoPayYield'
  | 'cryptoDueSoonBills'
  | 'cryptoPopularBillers'
  | 'cryptoRecentPaidBills'
  // Send (2)
  | 'cryptoSendAmountInput'
  | 'cryptoSendConfirmStep'
  // Notifications (2)
  | 'cryptoActivityHero'
  | 'cryptoActivityFeed'
  // History (4)
  | 'cryptoHistoryHero'
  | 'cryptoHistorySearchFilters'
  | 'cryptoHistoryAutoCompounding'
  | 'cryptoHistoryFeed';

export type CryptoCategory =
  | 'balances'
  | 'actions'
  | 'fx'
  | 'ledger'
  | 'security'
  | 'onboarding';

export interface CryptoModuleAsset {
  id: CryptoModuleId;
  title: string;
  subtitle: string;
  category: CryptoCategory;
  badge: string;
  badgeColor: string;
  code: {
    swiftui: string;
    typescript: string;
    reactnative: string;
    kotlin: string;
  };
}

export interface CryptoCtx {
  radius: { card: string; tile: string; icon: string };
  accent: string;
  isDark: boolean;
  interactive: boolean;
  balance: number;
  income: number;
  outcome: number;
  savings: { id: string; name: string; amount: number }[];
  transactions: { id: string; name: string; sub: string; amount: number; method: string; kind: 'in' | 'out' }[];
  faceId: boolean;
  isCardFrozen: boolean;
  actions: {
    send: () => void;
    payments: () => void;
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
    skipSignIn: () => void;
    quickSignIn: (provider: 'google' | 'facebook' | 'apple' | 'phone') => void;
    toggleFreeze: () => void;
  };
}

/* ------------------------------------------------------------------ */
/*  Module catalogue                                                   */
/* ------------------------------------------------------------------ */

export const CRYPTO_MODULES: CryptoModuleAsset[] = [
  /* ── Home — Image 5 (card view) ────────────────────────────────── */
  {
    id: 'cryptoMetalCard',
    title: 'Crypto Metal Card',
    subtitle: 'Black Visa card with SAM LEE, last 4 digits and ACTIVE badge',
    category: 'balances',
    badge: 'Card',
    badgeColor: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    code: {
      swiftui: `CryptoMetalCard(\n  holder: "SAM LEE",\n  last4: "8824",\n  exp: "08/29"\n)`,
      typescript: `export const CryptoMetalCard = ({ holder, last4 }) => (\n  <BlackCard><Number {...last4} /><Holder>{holder}</Holder><Visa /></BlackCard>\n);`,
      reactnative: `<CryptoMetalCard last4="8824" holder="SAM LEE" />`,
      kotlin: `CryptoMetalCard(holder = "SAM LEE", last4 = "8824", exp = "08/29")`,
    },
  },
  {
    id: 'cryptoCardQuickActions',
    title: 'Card Quick Actions',
    subtitle: 'Freeze / Details / Apple Pay tiles',
    category: 'actions',
    badge: 'Card',
    badgeColor: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    code: {
      swiftui: `CryptoCardQuickActions(onFreeze: card::freeze, onApplePay: applePay::launch)`,
      typescript: `export const CryptoCardQuickActions = () => (\n  <ActionRow items={['freeze', 'details', 'applePay']} />\n);`,
      reactnative: `<CryptoCardQuickActions />`,
      kotlin: `CryptoCardQuickActions(onFreeze = card::freeze, onApplePay = applePay::launch)`,
    },
  },
  {
    id: 'cryptoMonthlySpend',
    title: 'Monthly Spend Limit',
    subtitle: 'Usage progress with remaining percentage',
    category: 'ledger',
    badge: 'Card',
    badgeColor: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    code: {
      swiftui: `CryptoMonthlySpend(spent: 1240.50, limit: 5000)`,
      typescript: `export const CryptoMonthlySpend = () => (\n  <Progress value={1240.50} max={5000} />\n);`,
      reactnative: `<CryptoMonthlySpend />`,
      kotlin: `CryptoMonthlySpend(spent = 1240.50, limit = 5000.0)`,
    },
  },
  {
    id: 'cryptoMatteCardPromo',
    title: 'Matte Metal Card Promo',
    subtitle: 'Dark promo banner with FREE pill',
    category: 'actions',
    badge: 'Card',
    badgeColor: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    code: {
      swiftui: `CryptoMatteCardPromo(free: true)`,
      typescript: `export const CryptoMatteCardPromo = () => (\n  <PromoCard title="Get Matte Metal Card" badge="FREE" />\n);`,
      reactnative: `<CryptoMatteCardPromo />`,
      kotlin: `CryptoMatteCardPromo(free = true)`,
    },
  },
  {
    id: 'cryptoRecentCardActivity',
    title: 'Recent Card Activity',
    subtitle: 'Apple Store, Starbucks and Uber purchases',
    category: 'ledger',
    badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `CryptoRecentCardActivity(items: store.cardActivity)`,
      typescript: `export const CryptoRecentCardActivity = ({ items }) => (\n  <ActivityRows items={items.slice(0, 3)} />\n);`,
      reactnative: `<CryptoRecentCardActivity />`,
      kotlin: `CryptoRecentCardActivity(items = store.cardActivity)`,
    },
  },

  /* ── Home — Image 8 (balance view) ─────────────────────────────── */
  {
    id: 'cryptoHomeBalance',
    title: 'Yield Balance Hero',
    subtitle: 'Balance with 3.79% APY, lifetime earned and Deposit / Withdraw',
    category: 'balances',
    badge: 'Hero',
    badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100',
    code: {
      swiftui: `CryptoHomeBalance(\n  balance: 5420.84,\n  apy: 3.79,\n  lifetimeEarned: 142.50\n)`,
      typescript: `export const CryptoHomeBalance = () => (\n  <BalanceHero><ApyPill /><DepositWithdraw /></BalanceHero>\n);`,
      reactnative: `<CryptoHomeBalance />`,
      kotlin: `CryptoHomeBalance(balance = 5420.84, apy = 3.79, lifetimeEarned = 142.50)`,
    },
  },
  {
    id: 'cryptoFusePlusBanner',
    title: 'Fuse Plus Promo',
    subtitle: 'Dark banner to activate Fuse Plus at $100+',
    category: 'actions',
    badge: 'New',
    badgeColor: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    code: {
      swiftui: `CryptoFusePlusBanner(threshold: 100)`,
      typescript: `export const CryptoFusePlusBanner = () => (\n  <DarkBanner title="Get Fuse Plus" />\n);`,
      reactnative: `<CryptoFusePlusBanner />`,
      kotlin: `CryptoFusePlusBanner(threshold = 100.0)`,
    },
  },
  {
    id: 'cryptoLendingYieldRow',
    title: 'Lending Yield Rows',
    subtitle: 'Kamino and Drift lending positions with rebalancing note',
    category: 'ledger',
    badge: 'Yield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoLendingYieldRow(positions: [.kamino(3250.00, 3.79), .drift(2170.84, 6.58)])`,
      typescript: `export const CryptoLendingYieldRow = () => (\n  <YieldRow id="kamino" /><YieldRow id="drift" /><RebalancingFooter />\n);`,
      reactnative: `<CryptoLendingYieldRow />`,
      kotlin: `CryptoLendingYieldRow(positions = listOf(KAMINO, DRIFT))`,
    },
  },

  /* ── Accounts — Image 2 (Savings & Vaults) ──────────────────────── */
  {
    id: 'cryptoSavingsHero',
    title: 'Savings & Vaults Hero',
    subtitle: 'Total Vault Holdings with APY badge and auto-save rules',
    category: 'balances',
    badge: 'Hero',
    badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100',
    code: {
      swiftui: `CryptoSavingsHero(\n  total: 18450.00,\n  apy: 8.2,\n  vaults: 3\n)`,
      typescript: `export const CryptoSavingsHero = () => (\n  <SavingsHero><TotalVaults /><EarnedToDate /><CreateGoal /></SavingsHero>\n);`,
      reactnative: `<CryptoSavingsHero total={18450.00} />`,
      kotlin: `CryptoSavingsHero(total = 18450.00, apy = 8.2, vaults = 3)`,
    },
  },
  {
    id: 'cryptoLockBoostVaults',
    title: 'Lock & Boost Vaults',
    subtitle: '30/60/90 day commitments with 8.2% APY',
    category: 'balances',
    badge: 'New',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoLockBoostVaults(apy: 8.2, tiers: [30, 60, 90])`,
      typescript: `export const CryptoLockBoostVaults = () => (\n  <DarkCard title="Lock & Boost Vaults" /><ExploreTiers />\n);`,
      reactnative: `<CryptoLockBoostVaults />`,
      kotlin: `CryptoLockBoostVaults(apy = 8.2, tiers = listOf(30, 60, 90))`,
    },
  },
  {
    id: 'cryptoActiveSavingsGoals',
    title: 'Active Savings Goals',
    subtitle: 'Emergency Reserve, Tokyo Trip, New Workstation',
    category: 'ledger',
    badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `CryptoActiveSavingsGoals(goals: store.savingsGoals)`,
      typescript: `export const CryptoActiveSavingsGoals = () => (\n  <GoalCard id="emergency" /><GoalCard id="tokyo" /><GoalCard id="workstation" />\n);`,
      reactnative: `<CryptoActiveSavingsGoals />`,
      kotlin: `CryptoActiveSavingsGoals(goals = store.savingsGoals)`,
    },
  },
  {
    id: 'cryptoInstitutionalSecurity',
    title: 'Institutional Security',
    subtitle: 'FDIC Rails, Dual Audited, Instant Liquidity',
    category: 'security',
    badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoInstitutionalSecurity()`,
      typescript: `export const CryptoInstitutionalSecurity = () => (\n  <SecurityNote items={['FDIC', 'Dual Audited', 'Liquidity']} />\n);`,
      reactnative: `<CryptoInstitutionalSecurity />`,
      kotlin: `CryptoInstitutionalSecurity()`,
    },
  },

  /* ── Transfers — Image 1 (Bill Payments) ───────────────────────── */
  {
    id: 'cryptoBillsUpcoming',
    title: 'Upcoming Bills',
    subtitle: 'Search, upcoming bills total and Add Biller / AutoPay',
    category: 'actions',
    badge: 'Bills',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoBillsUpcoming(\n  total: 482.50,\n  dueInDays: 7,\n  dueAmount: 182.50\n)`,
      typescript: `export const CryptoBillsUpcoming = () => (\n  <SearchBar /><UpcomingBillsCard /><AddBillerAutoPay />\n);`,
      reactnative: `<CryptoBillsUpcoming />`,
      kotlin: `CryptoBillsUpcoming(total = 482.50, dueInDays = 7, dueAmount = 182.50)`,
    },
  },
  {
    id: 'cryptoAutoPayYield',
    title: 'AutoPay Yield Bonus',
    subtitle: '0.5% cashback paid in USDC',
    category: 'actions',
    badge: 'Yield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoAutoPayYield(\n  cashback: 0.5,\n  annualEarnings: 42.80\n)`,
      typescript: `export const CryptoAutoPayYield = () => (\n  <DarkCard title="AutoPay Yield Bonus" cashback="0.5%" />\n);`,
      reactnative: `<CryptoAutoPayYield />`,
      kotlin: `CryptoAutoPayYield(cashback = 0.5, annualEarnings = 42.80)`,
    },
  },
  {
    id: 'cryptoDueSoonBills',
    title: 'Due Soon Bills',
    subtitle: 'Pacific Gas & Electric and Sonic Fiber Internet',
    category: 'ledger',
    badge: 'Bills',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoDueSoonBills(bills: store.dueBills)`,
      typescript: `export const CryptoDueSoonBills = () => (\n  <BillsRow id="pge" /><BillsRow id="sonic" />\n);`,
      reactnative: `<CryptoDueSoonBills />`,
      kotlin: `CryptoDueSoonBills(bills = store.dueBills)`,
    },
  },
  {
    id: 'cryptoPopularBillers',
    title: 'Popular Billers',
    subtitle: 'Category grid for quick bill setup',
    category: 'actions',
    badge: 'Bills',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoPopularBillers()`,
      typescript: `export const CryptoPopularBillers = () => (\n  <Grid columns={3} items={['electric', 'water', 'telecom', 'card', 'insurance', 'rent']} />\n);`,
      reactnative: `<CryptoPopularBillers />`,
      kotlin: `CryptoPopularBillers()`,
    },
  },
  {
    id: 'cryptoRecentPaidBills',
    title: 'Recent Paid Bills',
    subtitle: 'Apple One Premier and State Farm history',
    category: 'ledger',
    badge: 'Bills',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoRecentPaidBills(items: store.paidBills)`,
      typescript: `export const CryptoRecentPaidBills = () => (\n  <PaidBillsList items={paidBills} />\n);`,
      reactnative: `<CryptoRecentPaidBills />`,
      kotlin: `CryptoRecentPaidBills(items = store.paidBills)`,
    },
  },

  /* ── Send — Image 7 (Step 1) ──────────────────────────────────── */
  {
    id: 'cryptoSendAmountInput',
    title: 'Deposit Amount Input',
    subtitle: 'USDC amount with 25/50/75/MAX, destination and recents',
    category: 'actions',
    badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoSendAmountInput(\n  amount: 250,\n  destination: "OxVault.sol"\n)`,
      typescript: `export const CryptoSendAmountInput = () => (\n  <AmountCard /><ZeroGasNote /><DestinationPicker /><ReviewCTA />\n);`,
      reactnative: `<CryptoSendAmountInput amount={250} />`,
      kotlin: `CryptoSendAmountInput(amount = 250.0, destination = "OxVault.sol")`,
    },
  },

  /* ── Send — Image 4 (Step 3) ──────────────────────────────────── */
  {
    id: 'cryptoSendConfirmStep',
    title: 'Deposit Confirmation',
    subtitle: 'Recipient, fees, MEV shield and slippage guarantee',
    category: 'actions',
    badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CryptoSendConfirmStep(\n  recipient: "OxVault.sol",\n  amount: 250,\n  gas: 0,\n  mevShield: true\n)`,
      typescript: `export const CryptoSendConfirmStep = () => (\n  <RecipientSummary /><SummaryRows /><SlippageCard /><ConfirmCTA />\n);`,
      reactnative: `<CryptoSendConfirmStep />`,
      kotlin: `CryptoSendConfirmStep(recipient = "OxVault.sol", amount = 250.0, mevShield = true)`,
    },
  },

  /* ── Notifications — Image 3 (Activity Center) ─────────────────── */
  {
    id: 'cryptoActivityHero',
    title: 'Activity Center Hero',
    subtitle: 'Push & In-App alerts with zero-latency WebSockets',
    category: 'security',
    badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `CryptoActivityHero(unread: 3)`,
      typescript: `export const CryptoActivityHero = () => (\n  <ActivityHeader /><PushAlertsCard />\n);`,
      reactnative: `<CryptoActivityHero unread={3} />`,
      kotlin: `CryptoActivityHero(unread = 3)`,
    },
  },
  {
    id: 'cryptoActivityFeed',
    title: 'Activity Feed',
    subtitle: 'Grouped yield, purchase, transfer and security alerts',
    category: 'security',
    badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `CryptoActivityFeed(items: store.activityFeed)`,
      typescript: `export const CryptoActivityFeed = ({ items }) => (\n  <GroupedFeed items={items} />\n);`,
      reactnative: `<CryptoActivityFeed items={items} />`,
      kotlin: `CryptoActivityFeed(items = store.activityFeed)`,
    },
  },

  /* ── History — Image 6 (Transaction History) ──────────────────── */
  {
    id: 'cryptoHistoryHero',
    title: 'History Net Volume Hero',
    subtitle: 'Past 30 days net flow and total yield harvested',
    category: 'ledger',
    badge: 'Hero',
    badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100',
    code: {
      swiftui: `CryptoHistoryHero(\n  netFlow: 3842.10,\n  yieldHarvested: 142.50,\n  transactions: 48\n)`,
      typescript: `export const CryptoHistoryHero = () => (\n  <NetFlowCard /><YieldCard /><VerifiedStrip />\n);`,
      reactnative: `<CryptoHistoryHero />`,
      kotlin: `CryptoHistoryHero(netFlow = 3842.10, yieldHarvested = 142.50, transactions = 48)`,
    },
  },
  {
    id: 'cryptoHistorySearchFilters',
    title: 'History Search & Filters',
    subtitle: 'Protocols search with All / Yields / Deposits / Transfers chips',
    category: 'ledger',
    badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `CryptoHistorySearchFilters(query: $query, tab: $tab)`,
      typescript: `export const CryptoHistorySearchFilters = () => (\n  <SearchBar /><Chips items={['all','yields','deposits','transfers']} />\n);`,
      reactnative: `<CryptoHistorySearchFilters />`,
      kotlin: `CryptoHistorySearchFilters(query = state.query, tab = state.tab)`,
    },
  },
  {
    id: 'cryptoHistoryAutoCompounding',
    title: 'Auto-Compounding History',
    subtitle: 'Dark card noting hourly auto-restake',
    category: 'ledger',
    badge: 'Info',
    badgeColor: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    code: {
      swiftui: `CryptoHistoryAutoCompounding()`,
      typescript: `export const CryptoHistoryAutoCompounding = () => (\n  <InfoDarkCard title="Auto-Compounding History" />\n);`,
      reactnative: `<CryptoHistoryAutoCompounding />`,
      kotlin: `CryptoHistoryAutoCompounding()`,
    },
  },
  {
    id: 'cryptoHistoryFeed',
    title: 'History Feed',
    subtitle: 'Grouped yield, deposit, transfer and merchant rows',
    category: 'ledger',
    badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `CryptoHistoryFeed(items: store.history)`,
      typescript: `export const CryptoHistoryFeed = ({ items }) => (\n  <GroupedHistory items={items} />\n);`,
      reactnative: `<CryptoHistoryFeed items={items} />`,
      kotlin: `CryptoHistoryFeed(items = store.history)`,
    },
  },
];

/** New crypto components keyed by page — newest first so they appear above base. */
export const CRYPTO_PAGE_PREPEND: Record<string, string[]> = {
  home: [
    'cryptoHomeBalance',
    'cryptoFusePlusBanner',
    'cryptoLendingYieldRow',
    'cryptoMetalCard',
    'cryptoCardQuickActions',
    'cryptoMonthlySpend',
    'cryptoMatteCardPromo',
    'cryptoRecentCardActivity',
  ],
  accounts: [
    'cryptoSavingsHero',
    'cryptoLockBoostVaults',
    'cryptoActiveSavingsGoals',
    'cryptoInstitutionalSecurity',
  ],
  transfers: [
    'cryptoBillsUpcoming',
    'cryptoAutoPayYield',
    'cryptoDueSoonBills',
    'cryptoPopularBillers',
    'cryptoRecentPaidBills',
  ],
  send: ['cryptoSendAmountInput', 'cryptoSendConfirmStep'],
  notifications: ['cryptoActivityHero', 'cryptoActivityFeed'],
  history: [
    'cryptoHistoryHero',
    'cryptoHistorySearchFilters',
    'cryptoHistoryAutoCompounding',
    'cryptoHistoryFeed',
  ],
};

export const CRYPTO_MODULE_IDS: Set<string> = new Set(
  CRYPTO_MODULES.map((m) => m.id),
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DARK = '#0B0B0F';
const DARK_2 = '#16161A';
const NEON = '#84F5B0';
const NEON_SOFT = '#D4F7A9';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usdc = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;

const surface = (dark: boolean) =>
  dark ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5' : 'bg-white text-slate-900 shadow-[0_6px_24px_rgba(0,0,0,0.06)]';

function Switch({ checked, onChange, label, accent, interactive = true }: { checked: boolean; onChange: () => void; label: string; accent: string; interactive?: boolean; }) {
  const track = (
    <span className={`relative inline-block h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${checked ? '' : 'bg-slate-300'}`} style={checked ? { background: accent } : undefined}>
      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </span>
  );
  if (!interactive) return track;
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
      {track}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME — Image 5 (card view)                                        */
/* ------------------------------------------------------------------ */

function CryptoMetalCard({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`relative overflow-hidden p-4 text-white ${ctx.radius.card}`} style={{ background: `linear-gradient(160deg, ${DARK} 0%, ${DARK_2} 100%)` }}>
      <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-5 w-7 rounded bg-gradient-to-br from-neutral-300 to-neutral-500" />
          <Wifi className="h-3 w-3 rotate-90 text-white/40" />
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[8px] font-bold text-emerald-400">
          ● ACTIVE
        </span>
      </div>
      <div className="relative mt-6 flex items-center gap-2">
        <p className="font-mono text-[16px] tracking-[0.25em]">•••• 8824</p>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/70"><Eye className="h-3 w-3" /></span>
      </div>
      <div className="relative mt-4 flex items-end justify-between">
        <div>
          <p className="text-[7px] uppercase tracking-wider text-white/40">Cardholder</p>
          <p className="text-[10px] font-bold tracking-wide">SAM LEE</p>
        </div>
        <div>
          <p className="text-[7px] uppercase tracking-wider text-white/40">Exp</p>
          <p className="text-[10px] font-bold tracking-wide">08/29</p>
        </div>
        <p className="text-[13px] font-bold italic">VISA</p>
      </div>
    </div>
  );
}

function CryptoCardQuickActions({ ctx }: { ctx: CryptoCtx }) {
  const items = [
    { label: 'Freeze', Icon: Snowflake, action: ctx.actions.toggleFreeze },
    { label: 'Details', Icon: KeyRound, action: ctx.actions.openWallet },
    { label: 'Apple Pay', Icon: Wallet, action: ctx.actions.openWallet },
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {items.map(({ label, Icon, action }) => (
        <button key={label} type="button" onClick={action} className={`flex flex-col items-center gap-1 py-2.5 ${ctx.radius.tile} ${surface(ctx.isDark)}`}>
          <Icon className="h-3.5 w-3.5" />
          <span className="text-[9px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

function CryptoMonthlySpend({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-500">Monthly Spend</p>
        <button type="button" className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Settings className="mr-0.5 inline h-2.5 w-2.5" /> Limit
        </button>
      </div>
      <p className="mt-1 text-[18px] font-bold">
        $1,240<span className="text-[11px]">.50</span> <span className="text-[10px] font-medium text-slate-400">/ $5,000</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full" style={{ width: '24.8%', background: DARK }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-[9px] font-semibold text-emerald-600">75.2% remaining</p>
        <p className="text-[9px] text-slate-400">Resets in 11 days</p>
      </div>
    </div>
  );
}

function CryptoMatteCardPromo({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`flex items-center gap-2.5 p-3 ${ctx.radius.card} text-white`} style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${DARK_2} 100%)` }}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
        <CreditCard className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-bold">Get Matte Metal Card</p>
          <span className="rounded-full bg-emerald-400 px-1.5 py-0.5 text-[7px] font-bold text-emerald-950">FREE</span>
        </div>
        <p className="text-[8px] text-white/60">Precision-milled brass core · Free delivery</p>
      </div>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
        <ChevronRight className="h-3 w-3" />
      </span>
    </div>
  );
}

function CryptoRecentCardActivity({ ctx }: { ctx: CryptoCtx }) {
  const rows = [
    { name: 'Apple Store', sub: 'Today · 10:42 AM', amount: '-$129.00', note: '1.5% cashback', Icon: Sparkles },
    { name: 'Starbucks Coffee', sub: 'Yesterday · 8:15 AM', amount: '-$6.40', note: 'Contactless', Icon: CreditCard },
    { name: 'Uber Rides', sub: 'Oct 24 · 11:20 PM', amount: '-$24.85', note: 'Online', Icon: Zap },
  ];
  return (
    <div className={`p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold">Recent Card Activity</p>
        <button type="button" onClick={ctx.actions.openHistory} className="text-[9px] font-semibold text-slate-500">See all</button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((r) => {
          const Icon = r.Icon;
          return (
            <div key={r.name} className="flex items-center justify-between gap-2 py-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold">{r.name}</p>
                  <p className="text-[8px] text-slate-400">{r.sub}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold">{r.amount}</p>
                <p className="text-[8px] text-emerald-600">{r.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME — Image 8 (balance view)                                     */
/* ------------------------------------------------------------------ */

function CryptoHomeBalance({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-slate-500">Balance</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">
          APY 3.79%
        </span>
      </div>
      <p className="mt-1 text-[26px] font-bold tracking-tight">{usd(ctx.balance)}</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
        <div>
          <p className="text-[8px] text-slate-400">Lifetime Earned</p>
          <p className="text-[12px] font-bold">$142.50</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-slate-400">Last 7D</p>
          <p className="text-[12px] font-bold text-emerald-600">+$18.40</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={ctx.actions.topUp} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-neutral-900 py-2 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
          <Plus className="h-3 w-3" /> Deposit
        </button>
        <button type="button" onClick={ctx.actions.send} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-neutral-900 py-2 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
          <ArrowUpRight className="h-3 w-3" /> Withdraw
        </button>
      </div>
    </div>
  );
}

function CryptoFusePlusBanner({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`relative overflow-hidden p-3 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
      <span aria-hidden className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/20" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" style={{ color: NEON }} />
          <p className="text-[11px] font-bold">Get Fuse Plus</p>
        </div>
        <X className="h-3.5 w-3.5 text-white/50" />
      </div>
      <p className="relative mt-2 text-[9px] leading-snug text-white/60">
        Deposit $100+ in Earn to activate Fuse Plus.
      </p>
    </div>
  );
}

function CryptoLendingYieldRow({ ctx }: { ctx: CryptoCtx }) {
  const rows = [
    { id: 'kamino', name: 'Kamino', apy: '3.79%', sub: 'Lending Yield', amount: '$3,250.00', badgeCls: 'bg-neutral-900 text-white', initial: 'K' },
    { id: 'drift', name: 'Drift', apy: '6.58%', sub: 'Lending Yield', amount: '$2,170.84', badgeCls: 'bg-gradient-to-br from-purple-500 to-blue-500 text-white', initial: 'D' },
  ];
  return (
    <div className={`space-y-2 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      {rows.map((r) => (
        <button key={r.id} type="button" onClick={ctx.actions.deposit.bind(null, r.id)} className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold ${r.badgeCls}`}>
              {r.initial}
            </span>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-semibold">{r.name}</p>
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-bold text-emerald-600">{r.apy} APY</span>
              </div>
              <p className="text-[11px] font-bold">{r.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[11px] font-bold">{r.amount}</p>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </div>
        </button>
      ))}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
        <p className="text-[9px] text-slate-500">Deposit your stablecoins with Drift to earn yield from lending markets.</p>
        <div className="flex items-center gap-1">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[8px] font-bold text-white">S</span>
          <span className="-ml-2 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">D</span>
          <span className="-ml-2 grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-[8px] font-bold text-white">F</span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800">
        <p className="flex items-center gap-1 text-[9px] text-slate-600 dark:text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Automated daily rebalancing active
        </p>
        <button type="button" className="text-[9px] font-bold">Manage</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ACCOUNTS — Image 2 (Savings & Vaults)                             */
/* ------------------------------------------------------------------ */

function CryptoSavingsHero({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Wealth & Protocols</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">↗ Up to 8.2% APY</span>
      </div>
      <p className="mt-1 text-[16px] font-bold">Savings &amp; Vaults</p>
      <div className="mt-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-[9px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Total Vault Holdings
          </p>
          <span className="text-[8px] font-semibold text-slate-400">APY up to 8.2%</span>
        </div>
        <p className="mt-1 text-[24px] font-bold">
          $18,450<span className="text-[13px]">.00</span>{' '}
          <span className="text-[10px] font-medium text-slate-400">USD</span>
        </p>
        <p className="text-[9px] text-slate-400">≈ 18,450.00 USDC across 3 automated vaults</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white p-2 dark:bg-slate-900">
            <p className="text-[8px] text-slate-400">Earned to Date</p>
            <p className="text-[11px] font-bold text-emerald-600">+$428.12</p>
          </div>
          <div className="rounded-xl bg-white p-2 dark:bg-slate-900">
            <p className="text-[8px] text-slate-400">Active Portfolios</p>
            <p className="text-[11px] font-bold">3 Vaults</p>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => ctx.actions.seeAllSavings()} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-neutral-900 py-2 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
            <Plus className="h-3 w-3" /> Create Goal
          </button>
          <button type="button" onClick={() => ctx.actions.deposit('emergency')} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-slate-200 py-2 text-[10px] font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
            <Zap className="h-3 w-3" /> Auto-Save Rules
          </button>
        </div>
      </div>
    </div>
  );
}

function CryptoLockBoostVaults({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`relative overflow-hidden p-3.5 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
      <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10" />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-bold">Lock &amp; Boost Vaults</p>
            <p className="text-[8px] text-white/50">Institutional yield tiers</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[7px] font-bold text-emerald-950">NEW 8.2% APY</span>
          <X className="h-3 w-3 text-white/40" />
        </div>
      </div>
      <p className="relative mt-2 text-[9px] leading-snug text-white/70">
        Commit USDC for 30, 60, or 90 days to earn institutional tier enhanced protocol yield powered by Kamino &amp; Drift Prime.
      </p>
      <div className="relative mt-3 flex items-center justify-between">
        <p className="flex items-center gap-1 text-[8px] text-white/40"><Shield className="h-2.5 w-2.5" /> Audited by OtterSec &amp; Neodyme</p>
        <button type="button" className="flex items-center gap-1 text-[9px] font-bold" style={{ color: NEON }}>
          Explore Tiers <ArrowUpRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}

function CryptoActiveSavingsGoals({ ctx }: { ctx: CryptoCtx }) {
  const goals = [
    {
      id: 'emergency', title: 'Emergency Reserve', provider: 'Kamino Auto-Yield', apy: '3.79%', Icon: Shield,
      current: 8450, target: 10000, pct: 84.5, note: 'Auto-Pilot Active', schedule: '$150 / week on Mon', action: 'Auto-Pilot Active',
    },
    {
      id: 'tokyo', title: 'Tokyo 2025 Trip', provider: 'Drift Lending', apy: '6.58%', Icon: ArrowUpRight,
      current: 3200, target: 5000, pct: 64.0, note: 'Next: Oct 25', schedule: '$200 / week on Fri', action: 'Next: Oct 25',
    },
    {
      id: 'workstation', title: 'New Workstation', provider: 'MarginFi Liquidity', apy: '4.20%', Icon: Database,
      current: 3800, target: 4000, pct: 95, note: 'Boost Finish ›', schedule: '$50 / week on Wed', action: 'Boost Finish ›',
    },
  ];
  return (
    <div className="space-y-2 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-bold">Active Savings Goals</p>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">3</span>
        </div>
        <button type="button" className="text-[9px] font-semibold text-emerald-600">+ New Goal</button>
      </div>
      {goals.map((g) => {
        const Icon = g.Icon;
        return (
          <div key={g.id} className={`p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            <div className="flex items-start gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold truncate">{g.title}</p>
                  <p className="text-[11px] font-bold">
                    ${g.current.toLocaleString()}<span className="text-[8px] font-normal text-slate-400"> of ${g.target.toLocaleString()}</span>
                  </p>
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <p className="text-[8px] text-slate-500">{g.provider}</p>
                  <span className="rounded-full bg-emerald-50 px-1 py-0.5 text-[7px] font-bold text-emerald-600">{g.apy} APY</span>
                </div>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.id === 'workstation' ? '#22C55E' : DARK }} />
            </div>
            <div className="mt-1 flex items-center justify-between text-[8px]">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{g.pct}% completed</span>
              <span className="text-slate-400">${(g.target - g.current).toLocaleString()} remaining</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800">
              <p className="text-[8px] text-slate-500">{g.schedule}</p>
              <p className="text-[8px] font-bold text-emerald-600">{g.action}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CryptoInstitutionalSecurity({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`mx-3 rounded-2xl p-3 ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <p className="text-[10px] font-bold">Institutional Security &amp; Backing</p>
      </div>
      <p className="mt-1 text-[9px] leading-snug text-slate-500">
        Deposits are routed through smart-contract insured multi-sig vaults. Fiat on/off ramps operate on FDIC-insured banking rails via licensed institutional partners.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {['FDIC Rails', 'Dual Audited', 'Instant Liquidity'].map((label) => (
          <span key={label} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-600">
            <Check className="h-2.5 w-2.5" /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TRANSFERS — Image 1 (Bill Payments)                               */
/* ------------------------------------------------------------------ */

function CryptoBillsUpcoming({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className="space-y-2.5 px-3">
      <div className="flex items-center gap-2">
        <div className={`flex flex-1 items-center gap-1.5 px-3 py-2 ${ctx.radius.icon} ${surface(ctx.isDark)}`}>
          <Search className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] text-slate-400">Search biller, utility, or subscription…</span>
        </div>
        <span className={`grid h-8 w-8 place-items-center ${ctx.radius.icon} ${surface(ctx.isDark)}`}>
          <RefreshCw className="h-3 w-3" />
        </span>
      </div>
      <div className={`p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-[9px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> UPCOMING BILLS · 3 DUE
          </p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">October 2024</span>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-[24px] font-bold tracking-tight">
            $482<span className="text-[14px]">.50</span>
          </p>
          <div className="text-right">
            <p className="text-[8px] text-slate-400">Due in 7 days</p>
            <p className="text-[12px] font-bold">$182.50</p>
          </div>
        </div>
        <p className="text-[8px] text-slate-400">Total committed this cycle</p>
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={ctx.actions.payBill} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-neutral-900 py-2 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
            <Plus className="h-3 w-3" /> Add Biller
          </button>
          <button type="button" onClick={ctx.actions.payBill} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-slate-100 py-2 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <RefreshCw className="h-3 w-3" /> AutoPay
          </button>
        </div>
      </div>
    </div>
  );
}

function CryptoAutoPayYield({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`relative mx-3 overflow-hidden p-3.5 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
      <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3" style={{ color: NEON }} />
          <p className="text-[11px] font-bold">AutoPay Yield Bonus</p>
        </div>
        <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[7px] font-bold text-emerald-950">0.5% CASHBACK</span>
      </div>
      <p className="relative mt-2 text-[9px] leading-snug text-white/60">
        Pay bills automatically straight from your high-yield treasury balance and receive 0.5% back directly in USDC.
      </p>
      <div className="relative mt-3 flex items-center justify-between">
        <p className="text-[9px] text-white/50">Est. annual earnings: <span className="font-bold text-white">+$42.80</span></p>
        <button type="button" className="flex items-center gap-1 text-[9px] font-bold" style={{ color: NEON }}>
          Setup now <ArrowUpRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}

function CryptoDueSoonBills({ ctx }: { ctx: CryptoCtx }) {
  const bills = [
    { name: 'Pacific Gas & Electric', sub: 'Due Oct 28 · in 4 days', amount: '$124.80', badge: 'AutoPay', badgeCls: 'bg-emerald-50 text-emerald-600', Icon: Zap, action: null as string | null },
    { name: 'Sonic Fiber Internet', sub: 'Due Nov 01 · in 7 days', amount: '$57.70', badge: null, Icon: Wifi, action: 'Pay Now' },
  ];
  return (
    <div className="space-y-2 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-bold">Due Soon</p>
          <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[8px] font-bold text-rose-600">2</span>
        </div>
        <button type="button" onClick={ctx.actions.payBill} className="text-[9px] font-semibold text-emerald-600">Pay All (3)</button>
      </div>
      {bills.map((b) => {
        const Icon = b.Icon;
        return (
          <div key={b.name} className={`flex items-center justify-between gap-2 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold">{b.name}</p>
                <p className="text-[8px] text-slate-400">{b.sub}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold">{b.amount}</p>
              {b.badge ? (
                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${b.badgeCls}`}>✓ {b.badge}</span>
              ) : (
                <button type="button" className="rounded-full bg-neutral-900 px-2 py-0.5 text-[7px] font-bold text-white dark:bg-white dark:text-neutral-900">{b.action}</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CryptoPopularBillers({ ctx }: { ctx: CryptoCtx }) {
  const items = [
    { label: 'Electric & Gas', Icon: Zap },
    { label: 'Water Utility', Icon: Droplet },
    { label: 'Telecom', Icon: Wifi },
    { label: 'Credit Card', Icon: CreditCard },
    { label: 'Insurance', Icon: Shield },
    { label: 'Rent & Lease', Icon: Landmark },
  ];
  return (
    <div className="space-y-2 px-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold">Popular Billers &amp; Services</p>
        <button type="button" className="text-[9px] text-slate-500">View all</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ label, Icon }) => (
          <button key={label} type="button" onClick={ctx.actions.payBill} className={`flex flex-col items-center gap-1.5 py-3 ${ctx.radius.tile} ${surface(ctx.isDark)}`}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[8px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CryptoRecentPaidBills({ ctx }: { ctx: CryptoCtx }) {
  const rows = [
    { name: 'Apple One Premier', sub: 'Paid Oct 15 · USDC Yield', amount: '$37.95', cashback: '+$0.19', Icon: Sparkles },
    { name: 'State Farm Insurance', sub: 'Paid Oct 12 · Checking', amount: '$145.00', cashback: '+$0.72', Icon: Shield },
  ];
  return (
    <div className={`mx-3 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold">Recent Paid Bills</p>
        <span className="text-[8px] text-slate-400">October</span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((r) => {
          const Icon = r.Icon;
          return (
            <div key={r.name} className="flex items-center justify-between gap-2 py-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold">{r.name}</p>
                  <p className="text-[8px] text-slate-400">{r.sub}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold">{r.amount}</p>
                <p className="text-[8px] font-semibold text-emerald-600">{r.cashback}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SEND — Image 7 (Step 1: amount input)                             */
/* ------------------------------------------------------------------ */

function CryptoSendAmountInput({ ctx }: { ctx: CryptoCtx }) {
  const [amount, setAmount] = useState(250);
  const recents = ['Alex R.', 'Elena M.', 'OxVault', 'Sam L.'];
  return (
    <div className="space-y-2.5 px-3">
      <div className={`p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Bolt className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-bold">Sam Lee&apos;s Wallet</p>
            <p className="text-[8px] text-slate-400">2BRs…qTGE</p>
          </div>
          <RefreshCw className="h-3 w-3 text-slate-400" />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[8px] font-bold text-white">$</span>
            <div>
              <p className="text-[10px] font-bold">USDC · USD Coin</p>
              <p className="text-[8px] text-emerald-600">● Active on Solana</p>
            </div>
          </div>
          <button type="button" className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold shadow-sm dark:bg-slate-700">
            Change <ChevronDown className="inline h-2 w-2" />
          </button>
        </div>

        <p className="mt-3 text-center text-[26px] font-bold">
          ${amount}<span className="text-[13px]">.00</span>
        </p>
        <p className="text-center text-[9px] text-slate-400">Available: $5,420.84 USDC</p>

        <div className="mt-3 flex gap-1.5">
          {['25%', '50%', '75%'].map((p) => (
            <button key={p} type="button" className="flex-1 rounded-full bg-slate-100 py-1.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{p}</button>
          ))}
          <button type="button" className="flex-1 rounded-full bg-neutral-900 py-1.5 text-[9px] font-bold text-white dark:bg-white dark:text-neutral-900">MAX</button>
        </div>
      </div>

      <div className={`p-3 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" style={{ color: NEON }} />
            <p className="text-[11px] font-bold">Zero Gas Guarantee</p>
          </div>
          <X className="h-3 w-3 text-white/40" />
        </div>
        <p className="mt-1.5 text-[9px] leading-snug text-white/60">
          Solana network base fees are sponsored by Fuse Plus protocol nodes.
        </p>
      </div>

      <div className={`p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex items-center justify-between">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">Destination</p>
          <p className="flex items-center gap-1 text-[8px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Address Validated
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <User className="h-3 w-3 text-slate-400" />
          <p className="flex-1 text-[10px] font-semibold">OxVault.sol</p>
          <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-semibold shadow-sm dark:bg-slate-700">Paste</span>
          <QrCode className="h-3 w-3 text-slate-500" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[9px] text-slate-500">Recents</p>
          <p className="text-[9px] text-slate-400">View All</p>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          {recents.map((r, i) => (
            <div key={r} className="flex flex-col items-center gap-1">
              <span className={`grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-white ${
                i === 0 ? 'bg-orange-400' : i === 1 ? 'bg-emerald-400' : i === 2 ? 'bg-neutral-900' : 'bg-slate-300 dark:bg-slate-700'
              }`}>
                {i === 2 ? <Lock className="h-3 w-3" /> : r.split(' ').map((w) => w[0]).join('')}
              </span>
              <span className="text-[8px]">{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`space-y-1 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex items-center justify-between text-[9px]">
          <p className="flex items-center gap-1 text-slate-500"><ArrowRight className="h-2.5 w-2.5" /> Estimated Arrival</p>
          <p className="font-semibold">~2 seconds</p>
        </div>
        <div className="flex items-center justify-between text-[9px]">
          <p className="flex items-center gap-1 text-slate-500"><FileText className="h-2.5 w-2.5" /> Network Fee</p>
          <p className="font-semibold">$0.001 <span className="text-emerald-600">Free</span></p>
        </div>
      </div>

      <button type="button" onClick={ctx.actions.send} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-neutral-900 py-3 text-[12px] font-bold text-white dark:bg-white dark:text-neutral-900">
        Review Transfer <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SEND — Image 4 (Step 3: confirm)                                  */
/* ------------------------------------------------------------------ */

function CryptoSendConfirmStep({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className="space-y-2.5 px-3">
      <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 text-[16px] font-bold text-white shadow-lg">Ox</span>
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
              <Check className="h-2.5 w-2.5" />
            </span>
          </div>
          <p className="mt-2 text-[12px] font-bold">OxVault.sol</p>
          <p className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500 dark:bg-slate-800">
            OxVault…8291 <FileText className="h-2.5 w-2.5" />
          </p>
        </div>
        <div className="text-center">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">Transfer Amount</p>
          <p className="text-[24px] font-bold">
            250<span className="text-[12px]">.00</span>{' '}
            <span className="text-[11px] font-medium text-slate-400">USDC</span>
          </p>
          <p className="text-[9px] text-slate-400">≈ $250.00 USD</p>
        </div>
      </div>

      <div className={`space-y-2 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">From Wallet</p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-semibold">Sam Lee&apos;s Wallet</p>
            <p className="text-[8px] text-slate-400">(2BRs…qTGE)</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">Asset/Network</p>
          <div className="flex items-center gap-1">
            <p className="text-[10px] font-semibold">USDC</p>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] dark:bg-slate-800">
              <Zap className="inline h-2 w-2" /> Solana
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">Destination</p>
          <p className="text-[10px] font-semibold">OxVault.sol</p>
        </div>
        <div className="mt-1 border-t border-slate-100 pt-2 dark:border-slate-800" />
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">Network Gas Fee ⓘ</p>
          <p className="flex items-center gap-1">
            <span className="text-[8px] text-slate-400 line-through">$0.008</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">⚡ Zero Gas</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">Execution Time</p>
          <p className="flex items-center gap-1 text-[9px] font-semibold"><Clock className="h-2.5 w-2.5" /> ~1.2 seconds</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">Security Protocol</p>
          <p className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600"><ShieldCheck className="h-2.5 w-2.5" /> MEV Shield Active</p>
        </div>
      </div>

      <div className={`p-3.5 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" style={{ color: NEON }} />
            <p className="text-[11px] font-bold">Zero-Slippage Guaranteed</p>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] text-white/70">Direct Route</span>
        </div>
        <p className="mt-2 text-[9px] leading-snug text-white/60">
          Protected against front-running and MEV sandwich reorders. Destination will receive exactly 250.00 USDC immediately upon block finality.
        </p>
      </div>

      <div className="flex items-center justify-between px-2 text-[8px] text-slate-500">
        <p className="flex items-center gap-1"><Check className="h-2.5 w-2.5 text-emerald-500" /> Decentralized</p>
        <p className="flex items-center gap-1"><Check className="h-2.5 w-2.5 text-emerald-500" /> Audited Contract</p>
        <p className="flex items-center gap-1"><Check className="h-2.5 w-2.5 text-emerald-500" /> Sub-second</p>
      </div>

      <button type="button" onClick={ctx.actions.send} className="flex w-full items-center justify-between rounded-full bg-neutral-900 py-3 pl-4 pr-2 text-white dark:bg-white dark:text-neutral-900">
        <span className="flex-1 text-center text-[12px] font-bold">Confirm &amp; Send 250 USDC</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 dark:bg-neutral-900/10">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
      <button type="button" className="w-full py-1 text-center text-[9px] font-medium text-slate-500">Cancel Transfer</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NOTIFICATIONS — Image 3 (Activity Center)                         */
/* ------------------------------------------------------------------ */

function CryptoActivityHero({ ctx }: { ctx: CryptoCtx }) {
  const chips = [
    { label: 'All', count: 12, active: true },
    { label: 'Yields', count: 5 },
    { label: 'Transfers', count: 4 },
    { label: 'Security', count: 3 },
  ];
  return (
    <div className="space-y-2 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="h-3.5 w-3.5" />
          <p className="text-[13px] font-bold">Deposit Flow</p>
        </div>
        <User className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activity Center
        </p>
        <button type="button" className="text-[9px] font-semibold text-slate-500">✓ Mark all read</button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {chips.map((c) => (
          <button key={c.label} type="button" className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[9px] font-semibold ${
            c.active ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
          }`}>
            {c.label} {c.count != null && <span className={c.active ? 'text-white/70' : 'text-slate-400'}>({c.count})</span>}
          </button>
        ))}
      </div>
      <div className={`relative overflow-hidden p-3 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
        <span aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/15" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5" />
            <p className="text-[11px] font-bold">Push &amp; In-App Alerts</p>
          </div>
          <X className="h-3.5 w-3.5 text-white/50" />
        </div>
        <p className="relative mt-2 text-[9px] leading-snug text-white/60">
          Instant alerts on yield auto-compounding and card transactions are active.
        </p>
        <div className="relative mt-2 flex items-center justify-between">
          <p className="flex items-center gap-1 text-[8px] text-white/50">
            <ShieldCheck className="h-2.5 w-2.5" /> Zero-latency WebSockets enabled
          </p>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10">
            <Info className="h-2.5 w-2.5 text-white/70" />
          </span>
        </div>
      </div>
    </div>
  );
}

function CryptoActivityFeed({ ctx }: { ctx: CryptoCtx }) {
  const groups = [
    {
      label: 'TODAY', count: '2 new',
      items: [
        { title: 'Kamino Yield Harvested', sub: '+$12.45 USDC auto-compounded into your Core Liquidity pool.', time: '11:42 AM', badge: '↻ Auto-compound', badgeTone: 'bg-emerald-50 text-emerald-600', unread: true, Icon: Sparkles, iconBg: 'bg-emerald-50 text-emerald-600' },
        { title: 'Card Purchase Approved', sub: 'Apple Store · $129.00 paid with Fuse Virtual Card. Earned $1.94 cashback.', time: '10:42 AM', badge: '✓ Settled', badgeTone: 'bg-slate-100 text-slate-600', unread: true, Icon: CreditCard, iconBg: 'bg-slate-100 text-slate-700' },
      ],
    },
    {
      label: 'YESTERDAY',
      items: [
        { title: 'Transfer Delivered Instantly', sub: '250.00 USDC delivered to 0xVault.sol with zero gas fee.', time: '4:15 PM', badge: '✓ Confirmed', badgeTone: 'bg-emerald-50 text-emerald-600', unread: false, Icon: ArrowUpRight, iconBg: 'bg-slate-100 text-slate-700' },
        { title: 'New Login Detected', sub: 'iPhone 16 Pro in San Francisco, CA · Biometrics Verified.', time: '08:12 AM', badge: '✓ Verified', badgeTone: 'bg-emerald-50 text-emerald-600', unread: false, Icon: ShieldCheck, iconBg: 'bg-neutral-900 text-white' },
      ],
    },
    {
      label: 'EARLIER THIS WEEK',
      items: [
        { title: 'Drift Yield Rate Increased', sub: 'Dynamic pool rate climbed to 6.58% APY due to increased borrowing volume.', time: 'Monday · Oct 21', badge: 'Yield Update', badgeTone: 'bg-slate-100 text-slate-600', unread: false, Icon: TrendingUp, iconBg: 'bg-emerald-50 text-emerald-600' },
        { title: 'Monthly Yield Report Ready', sub: 'Your portfolio earned +$284.10 USDC in compound yield this cycle.', time: 'Sunday · Oct 20', badge: 'Review Report →', badgeTone: 'bg-neutral-900 text-white', unread: false, Icon: FileText, iconBg: 'bg-slate-100 text-slate-700' },
      ],
    },
  ];
  return (
    <div className="space-y-3 px-3 pb-2">
      {groups.map((g) => (
        <section key={g.label}>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{g.label}</h4>
            {g.count && <span className="text-[9px] text-slate-400">{g.count}</span>}
          </div>
          <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            {g.items.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.title} className="flex items-start gap-2 p-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.iconBg}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[10px] font-semibold truncate">{item.title}</p>
                      {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </div>
                    <p className="mt-0.5 text-[8px] leading-snug text-slate-500">{item.sub}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`inline-block rounded-full px-1.5 py-0.5 text-[7px] font-bold ${item.badgeTone}`}>{item.badge}</span>
                      <span className="text-[7px] text-slate-400">{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <div className="pt-3 text-center">
        <div className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Check className="h-3 w-3 text-slate-500" />
        </div>
        <p className="mt-1 text-[9px] font-semibold">You&apos;re all caught up</p>
        <p className="text-[8px] text-slate-400">Real-time alerts resume with incoming activity</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HISTORY — Image 6                                                 */
/* ------------------------------------------------------------------ */

function CryptoHistoryHero({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className="space-y-2 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="h-3.5 w-3.5" />
          <p className="text-[13px] font-bold">Transaction History</p>
        </div>
        <User className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Bolt className="h-3 w-3" />
          </span>
          <div>
            <p className="text-[10px] font-bold">Sam Lee&apos;s Wallet</p>
            <p className="text-[8px] text-slate-400">2BRs…qTGE</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button type="button" className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 dark:bg-slate-800"><Download className="h-3 w-3" /></button>
          <button type="button" className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 dark:bg-slate-800"><RefreshCw className="h-3 w-3" /></button>
        </div>
      </div>
      <div className={`p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-slate-500">
            Past 30 Days · <span className="font-semibold text-emerald-600">Active Yielding</span>
          </p>
          <TrendingUp className="h-3 w-3 text-emerald-600" />
        </div>
        <div className="mt-1.5 flex items-end justify-between">
          <div>
            <p className="text-[8px] text-slate-400">Net Volume Flow</p>
            <p className="text-[20px] font-bold">+$3,842<span className="text-[10px]">.10</span></p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-400">Total Yield Harvested</p>
            <p className="text-[12px] font-bold text-emerald-600">+$142.50</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
          <p className="text-[8px] text-slate-400">48 transactions verified on Solana</p>
          <p className="text-[8px] font-semibold">All Cleared ✓</p>
        </div>
      </div>
    </div>
  );
}

function CryptoHistorySearchFilters({ ctx }: { ctx: CryptoCtx }) {
  const chips = [
    { label: 'All', count: 48, active: true },
    { label: 'Yield Payouts' },
    { label: 'Deposits' },
    { label: 'Transfers' },
  ];
  return (
    <div className="space-y-2 px-3">
      <div className={`flex items-center gap-1.5 px-3 py-2 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <Search className="h-3 w-3 text-slate-400" />
        <span className="flex-1 text-[10px] text-slate-400">Search protocols, wallets, or amounts…</span>
        <X className="h-3 w-3 text-slate-400" />
      </div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {chips.map((c) => (
          <button key={c.label} type="button" className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
            c.active ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
          }`}>
            {c.label} {c.count != null && <span className={c.active ? 'text-white/70' : 'text-slate-400'}>({c.count})</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function CryptoHistoryAutoCompounding({ ctx }: { ctx: CryptoCtx }) {
  return (
    <div className={`mx-3 p-3 text-white ${ctx.radius.card}`} style={{ background: DARK_2 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3" style={{ color: NEON }} />
          <p className="text-[11px] font-bold">Auto-Compounding History</p>
        </div>
        <X className="h-3 w-3 text-white/50" />
      </div>
      <p className="mt-1.5 text-[9px] leading-snug text-white/60">
        Lending earnings from Kamino &amp; Drift auto-restake hourly without manual claims.
      </p>
    </div>
  );
}

function CryptoHistoryFeed({ ctx }: { ctx: CryptoCtx }) {
  const groups = [
    {
      label: 'TODAY', net: '+$512.45 net',
      items: [
        { title: 'Kamino Yield Payout', sub: '3.79% APY · Today, 11:42 AM', amount: '+$12.45', unit: 'USDC', tone: 'in', tag: 'Auto', tagCls: 'bg-emerald-50 text-emerald-600', Icon: Sparkles, iconBg: 'bg-emerald-50 text-emerald-600' },
        { title: 'Deposit USDC', sub: 'Solana Network · Today, 09:15 A', amount: '+$500.00', unit: '500.00 USDC', tone: 'in', tag: 'Done', tagCls: 'bg-emerald-50 text-emerald-600', Icon: Check, iconBg: 'bg-emerald-50 text-emerald-600' },
      ],
    },
    {
      label: 'YESTERDAY', net: '-$117.80 net',
      items: [
        { title: 'Sent to Elena', sub: 'elena.sol · Yesterday, 4:15 PM', amount: '-$150.00', unit: 'Fee <$0.001', tone: 'out', tag: 'Direct', tagCls: 'bg-slate-100 text-slate-500', Icon: ArrowUpRight, iconBg: 'bg-slate-100 text-slate-700' },
        { title: 'Drift Yield Payout', sub: '6.58% APY · Yesterday, 12:00 PM', amount: '+$32.20', unit: 'USDC', tone: 'in', tag: 'Auto', tagCls: 'bg-emerald-50 text-emerald-600', Icon: Sparkles, iconBg: 'bg-emerald-50 text-emerald-600' },
      ],
    },
    {
      label: 'EARLIER THIS WEEK', net: 'Oct 14 – Oct 17',
      items: [
        { title: 'Blue Bottle Coffee', sub: 'Fuse Virtual Card · Oct 16, 8:40 AM', amount: '-$7.40', unit: '+0.15% back', tone: 'out', tag: 'Debit', tagCls: 'bg-slate-100 text-slate-500', Icon: Receipt, iconBg: 'bg-slate-100 text-slate-700' },
        { title: 'Solana Staking Rew', sub: 'JitoSOL Pool · Oct 15, 6:00 PM', amount: '+$28.85', unit: '0.184 SOL', tone: 'in', tag: 'Epoch 682', tagCls: 'bg-slate-100 text-slate-500', Icon: TrendingUp, iconBg: 'bg-emerald-50 text-emerald-600' },
        { title: 'Apple Store SF', sub: 'Fuse Virtual Card · Oct 14, 2:18 PM', amount: '-$129.00', unit: '+1.5% back', tone: 'out', tag: 'Debit', tagCls: 'bg-slate-100 text-slate-500', Icon: ShoppingBag, iconBg: 'bg-slate-100 text-slate-700' },
      ],
    },
  ];
  return (
    <div className="space-y-3 px-3 pb-2">
      {groups.map((g) => (
        <section key={g.label}>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{g.label}</h4>
            <span className="text-[9px] text-slate-400">{g.net}</span>
          </div>
          <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            {g.items.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.title} className="flex items-center justify-between gap-2 p-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`grid h-8 w-8 place-items-center rounded-full ${item.iconBg}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] font-semibold">{item.title}</p>
                        <span className={`rounded-full px-1 py-0.5 text-[7px] font-bold ${item.tagCls}`}>{item.tag}</span>
                      </div>
                      <p className="text-[8px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold ${item.tone === 'in' ? 'text-emerald-600' : ''}`}>{item.amount}</p>
                    <p className="text-[8px] text-slate-400">{item.unit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <p className="pt-2 text-center text-[8px] text-slate-400">Displaying history for the last 60 days</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public renderer                                                    */
/* ------------------------------------------------------------------ */

export function CryptoModuleView({ id, ctx }: { id: string; ctx: CryptoCtx }) {
  switch (id) {
    /* Home */
    case 'cryptoMetalCard': return <CryptoMetalCard ctx={ctx} />;
    case 'cryptoCardQuickActions': return <CryptoCardQuickActions ctx={ctx} />;
    case 'cryptoMonthlySpend': return <CryptoMonthlySpend ctx={ctx} />;
    case 'cryptoMatteCardPromo': return <CryptoMatteCardPromo ctx={ctx} />;
    case 'cryptoRecentCardActivity': return <CryptoRecentCardActivity ctx={ctx} />;
    case 'cryptoHomeBalance': return <CryptoHomeBalance ctx={ctx} />;
    case 'cryptoFusePlusBanner': return <CryptoFusePlusBanner ctx={ctx} />;
    case 'cryptoLendingYieldRow': return <CryptoLendingYieldRow ctx={ctx} />;

    /* Accounts */
    case 'cryptoSavingsHero': return <CryptoSavingsHero ctx={ctx} />;
    case 'cryptoLockBoostVaults': return <CryptoLockBoostVaults ctx={ctx} />;
    case 'cryptoActiveSavingsGoals': return <CryptoActiveSavingsGoals ctx={ctx} />;
    case 'cryptoInstitutionalSecurity': return <CryptoInstitutionalSecurity ctx={ctx} />;

    /* Transfers */
    case 'cryptoBillsUpcoming': return <CryptoBillsUpcoming ctx={ctx} />;
    case 'cryptoAutoPayYield': return <CryptoAutoPayYield ctx={ctx} />;
    case 'cryptoDueSoonBills': return <CryptoDueSoonBills ctx={ctx} />;
    case 'cryptoPopularBillers': return <CryptoPopularBillers ctx={ctx} />;
    case 'cryptoRecentPaidBills': return <CryptoRecentPaidBills ctx={ctx} />;

    /* Send */
    case 'cryptoSendAmountInput': return <CryptoSendAmountInput ctx={ctx} />;
    case 'cryptoSendConfirmStep': return <CryptoSendConfirmStep ctx={ctx} />;

    /* Notifications */
    case 'cryptoActivityHero': return <CryptoActivityHero ctx={ctx} />;
    case 'cryptoActivityFeed': return <CryptoActivityFeed ctx={ctx} />;

    /* History */
    case 'cryptoHistoryHero': return <CryptoHistoryHero ctx={ctx} />;
    case 'cryptoHistorySearchFilters': return <CryptoHistorySearchFilters ctx={ctx} />;
    case 'cryptoHistoryAutoCompounding': return <CryptoHistoryAutoCompounding ctx={ctx} />;
    case 'cryptoHistoryFeed': return <CryptoHistoryFeed ctx={ctx} />;

    default:
      return null;
  }
}