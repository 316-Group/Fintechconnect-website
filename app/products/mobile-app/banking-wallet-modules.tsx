'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CreditCard,
  Download,
  Droplet,
  Eye,
  FileText,
  Globe,
  Headphones,
  Info,
  Landmark,
  Lock,
  LogOut,
  Pencil,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  ShoppingBag,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Truck,
  User,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Shared types                                                       */
/* ------------------------------------------------------------------ */

export type BankingWalletModuleId =
  | 'homeHeroBalance'
  | 'quickSendRow'
  | 'spendingChart'
  | 'creditCardCarousel'
  | 'cardSecurityLock'
  | 'detailedHistory'
  | 'notificationCenter'
  | 'profileMenu'
  | 'sendMoneySheet'
  // ── New in this batch ──────────────────────────────────────────────
  | 'transferMoneyHeader'
  | 'transferAmountMethods'
  | 'transferReviewFooter'
  | 'homeBlueHero'
  | 'billNegotiatorCard'
  | 'billsPaymentsList'
  | 'myCardsHero'
  | 'cardSpendingLimit'
  | 'cardSecurityPermissions'
  | 'cardCashPerks'
  | 'cardRecentActivity';

export type BWCategory =
  | 'balances'
  | 'actions'
  | 'fx'
  | 'ledger'
  | 'security'
  | 'onboarding';

export interface BWModuleAsset {
  id: BankingWalletModuleId;
  title: string;
  subtitle: string;
  category: BWCategory;
  badge: string;
  badgeColor: string;
  code: {
    swiftui: string;
    typescript: string;
    reactnative: string;
    kotlin: string;
  };
}

export interface BankingWalletCtx {
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

export const BANKING_WALLET_MODULES: BWModuleAsset[] = [
  /* ── Existing (previous batch) ─────────────────────────────────── */
  {
    id: 'homeHeroBalance',
    title: 'Total Balance Hero',
    subtitle: 'Purple gradient balance with transfer, receive and card actions',
    category: 'balances',
    badge: 'Hero',
    badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100',
    code: {
      swiftui: `BalanceHeroCard(\n  balance: 24787.00,\n  actions: [.transfer, .receive, .card]\n)`,
      typescript: `export const BalanceHeroCard = ({ balance }) => (\n  <GradientCard><Balance value={balance} /><ActionRow /></GradientCard>\n);`,
      reactnative: `<BalanceHeroCard balance={24787.00} />`,
      kotlin: `BalanceHeroCard(balance = 24787.00, actions = listOf(TRANSFER, RECEIVE, CARD))`,
    },
  },
  {
    id: 'quickSendRow',
    title: 'Quick Send Row',
    subtitle: 'Avatar carousel of recent recipients',
    category: 'actions',
    badge: 'Quick',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `QuickSendRow(contacts: store.recent)`,
      typescript: `export const QuickSendRow = ({ contacts }) => (\n  <AvatarScroll items={contacts} onSelect={openSend} />\n);`,
      reactnative: `<QuickSendRow contacts={recent} />`,
      kotlin: `QuickSendRow(contacts = store.recent, onSelect = ::openSend)`,
    },
  },
  {
    id: 'spendingChart',
    title: 'Spending Statistics',
    subtitle: 'Daily / Weekly / Monthly chart with highlighted day',
    category: 'ledger',
    badge: 'Chart',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `SpendingStatistics(range: .daily, highlight: .wed)`,
      typescript: `export const SpendingStatistics = () => (\n  <Tabs items={['Daily','Weekly','Monthly']} /><Bars data={daily} />\n);`,
      reactnative: `<SpendingStatistics range="daily" />`,
      kotlin: `SpendingStatistics(range = Range.DAILY, highlight = Day.WED)`,
    },
  },
  {
    id: 'creditCardCarousel',
    title: 'Credit Card Carousel',
    subtitle: 'Horizontal card deck with add-new slot',
    category: 'security',
    badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CreditCardCarousel(cards: store.cards, onAdd: addCard)`,
      typescript: `export const CreditCardCarousel = ({ cards }) => (\n  <HScroll>{cards.map(CreditCard)}</HScroll>\n);`,
      reactnative: `<CreditCardCarousel cards={cards} />`,
      kotlin: `CreditCardCarousel(cards = store.cards, onAdd = ::addCard)`,
    },
  },
  {
    id: 'cardSecurityLock',
    title: 'Card Security Lock',
    subtitle: 'Temporarily freeze instant tap',
    category: 'security',
    badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardSecurityLock(frozen: $frozen, onChange: card::lock)`,
      typescript: `export const CardSecurityLock = ({ frozen, onChange }) => (\n  <Row icon={<Lock />} trailing={<Switch checked={frozen} />} />\n);`,
      reactnative: `<CardSecurityLock frozen={frozen} onChange={setFrozen} />`,
      kotlin: `CardSecurityLock(frozen = state.frozen, onChange = card::lock)`,
    },
  },
  {
    id: 'detailedHistory',
    title: 'Detailed Transaction History',
    subtitle: 'Search, filters, budget card and grouped rows',
    category: 'ledger',
    badge: 'Ledger',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `DetailedHistory(search: $query, filter: $filter)`,
      typescript: `export const DetailedHistory = () => (\n  <SearchBar /><Chips /><BudgetCard /><GroupedRows />\n);`,
      reactnative: `<DetailedHistory />`,
      kotlin: `DetailedHistory(query = state.query, filter = state.filter)`,
    },
  },
  {
    id: 'notificationCenter',
    title: 'Neo Guard Alert Center',
    subtitle: 'Smart protect banner and rich alert feed',
    category: 'security',
    badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `NeoGuardAlertCenter(alerts: store.alerts)`,
      typescript: `export const NeoGuardAlertCenter = ({ alerts }) => (\n  <SmartProtectBanner /><AlertFeed items={alerts} />\n);`,
      reactnative: `<NeoGuardAlertCenter alerts={alerts} />`,
      kotlin: `NeoGuardAlertCenter(alerts = store.alerts)`,
    },
  },
  {
    id: 'profileMenu',
    title: 'Kinetic Profile Menu',
    subtitle: 'Identity, points banner, settings groups',
    category: 'security',
    badge: 'KYC',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `KineticProfileMenu(user: auth.current)`,
      typescript: `export const KineticProfileMenu = ({ user }) => (\n  <Identity /><PointsBanner /><SettingsGroups />\n);`,
      reactnative: `<KineticProfileMenu user={user} />`,
      kotlin: `KineticProfileMenu(user = auth.current)`,
    },
  },
  {
    id: 'sendMoneySheet',
    title: 'Send Money Sheet',
    subtitle: 'Recipient, amount, source, note and slide-to-send',
    category: 'actions',
    badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SendMoneySheet(\n  to: .daniel,\n  amount: 850,\n  source: .primary\n)`,
      typescript: `export const SendMoneySheet = () => (\n  <RecipientPicker /><AmountCard /><SourceCard /><SlideToSend />\n);`,
      reactnative: `<SendMoneySheet amount={850} />`,
      kotlin: `SendMoneySheet(to = DANIEL, amount = 850.0, source = PRIMARY)`,
    },
  },

  /* ── NEW: Transfer Money (Send page) ───────────────────────────── */
  {
    id: 'transferMoneyHeader',
    title: 'Transfer Money Header',
    subtitle: 'Blue hero with Send Again favourites and search',
    category: 'actions',
    badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `TransferMoneyHeader(\n  balance: 124892.65,\n  favorites: store.recent\n)`,
      typescript: `export const TransferMoneyHeader = ({ balance, favorites }) => (\n  <BlueHero /><SendAgain items={favorites} /><SearchBar />\n);`,
      reactnative: `<TransferMoneyHeader balance={124892.65} />`,
      kotlin: `TransferMoneyHeader(balance = 124892.65, favorites = store.recent)`,
    },
  },
  {
    id: 'transferAmountMethods',
    title: 'Transfer Amount & Methods',
    subtitle: 'Amount chips with rail picker',
    category: 'actions',
    badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `TransferAmountMethods(\n  amount: 250,\n  method: .instant\n)`,
      typescript: `export const TransferAmountMethods = () => (\n  <AmountChips /><MethodList />\n);`,
      reactnative: `<TransferAmountMethods amount={250} />`,
      kotlin: `TransferAmountMethods(amount = 250.0, method = Method.INSTANT)`,
    },
  },
  {
    id: 'transferReviewFooter',
    title: 'Transfer Review CTA',
    subtitle: 'Continue to review with encryption note',
    category: 'actions',
    badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `TransferReviewFooter(onReview: review)`,
      typescript: `export const TransferReviewFooter = ({ onReview }) => (\n  <PrimaryCTA onClick={onReview} /><EncryptionNote />\n);`,
      reactnative: `<TransferReviewFooter onReview={review} />`,
      kotlin: `TransferReviewFooter(onReview = ::review)`,
    },
  },

  /* ── NEW: Home ─────────────────────────────────────────────────── */
  {
    id: 'homeBlueHero',
    title: 'Home Blue Hero',
    subtitle: 'Ethan-style greeting, total balance and quick actions',
    category: 'balances',
    badge: 'Hero',
    badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100',
    code: {
      swiftui: `HomeBlueHero(\n  user: auth.current,\n  balance: 124892.65,\n  delta: "+8.42%"\n)`,
      typescript: `export const HomeBlueHero = ({ user, balance }) => (\n  <BlueGradient><Greeting /><Balance /><ActionRow /></BlueGradient>\n);`,
      reactnative: `<HomeBlueHero balance={124892.65} />`,
      kotlin: `HomeBlueHero(user = auth.current, balance = 124892.65)`,
    },
  },
  {
    id: 'billNegotiatorCard',
    title: 'Bill Negotiator',
    subtitle: 'Savings recommendation with start-negotiation CTA',
    category: 'actions',
    badge: 'New',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `BillNegotiatorCard(\n  provider: "AT&T Fiber",\n  savings: 12.00\n)`,
      typescript: `export const BillNegotiatorCard = ({ provider, savings }) => (\n  <OfferCard title="Bill negotiator" cta="Start negotiation" />\n);`,
      reactnative: `<BillNegotiatorCard savings={12.00} />`,
      kotlin: `BillNegotiatorCard(provider = "AT&T Fiber", savings = 12.0)`,
    },
  },
  {
    id: 'billsPaymentsList',
    title: 'Bills & Payments',
    subtitle: 'All Bills / Need Actions tabs with due timeline',
    category: 'ledger',
    badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `BillsPaymentsList(\n  tab: $tab,\n  bills: store.bills\n)`,
      typescript: `export const BillsPaymentsList = ({ bills }) => (\n  <Segmented items={['All Bills','Need Actions']} /><Rows items={bills} />\n);`,
      reactnative: `<BillsPaymentsList bills={bills} />`,
      kotlin: `BillsPaymentsList(tab = state.tab, bills = store.bills)`,
    },
  },

  /* ── NEW: Cards ────────────────────────────────────────────────── */
  {
    id: 'myCardsHero',
    title: 'My Cards Hero',
    subtitle: 'Blue hero with Visa card visual and quick actions',
    category: 'security',
    badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `MyCardsHero(\n  card: store.cards.primary,\n  active: 2\n)`,
      typescript: `export const MyCardsHero = ({ card }) => (\n  <BlueGradient><CardVisual card={card} /><QuickActions /></BlueGradient>\n);`,
      reactnative: `<MyCardsHero card={card} />`,
      kotlin: `MyCardsHero(card = store.cards.primary)`,
    },
  },
  {
    id: 'cardSpendingLimit',
    title: 'Card Monthly Spending Limit',
    subtitle: 'Usage progress with safe-to-spend hint',
    category: 'security',
    badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardSpendingLimit(\n  spent: 2450,\n  limit: 8000,\n  safeUntil: .oct1\n)`,
      typescript: `export const CardSpendingLimit = ({ spent, limit }) => (\n  <Progress value={spent} max={limit} />\n);`,
      reactnative: `<CardSpendingLimit spent={2450} limit={8000} />`,
      kotlin: `CardSpendingLimit(spent = 2450.0, limit = 8000.0)`,
    },
  },
  {
    id: 'cardSecurityPermissions',
    title: 'Card Security Permissions',
    subtitle: 'Online / International / ATM real-time toggles',
    category: 'security',
    badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardSecurityPermissions(\n  online: $online,\n  international: $intl,\n  atm: $atm\n)`,
      typescript: `export const CardSecurityPermissions = () => (\n  <PermissionRow id="online" /><PermissionRow id="intl" /><PermissionRow id="atm" />\n);`,
      reactnative: `<CardSecurityPermissions />`,
      kotlin: `CardSecurityPermissions(online = state.online, intl = state.intl, atm = state.atm)`,
    },
  },
  {
    id: 'cardCashPerks',
    title: 'Card Cash Perks',
    subtitle: 'Highlighted cashback detected this cycle',
    category: 'security',
    badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardCashPerks(rate: 3.0, categories: [.dining, .transport])`,
      typescript: `export const CardCashPerks = ({ rate }) => (\n  <PerksBanner rate={rate} cta="Explore Cashback Perks" />\n);`,
      reactnative: `<CardCashPerks rate={3.0} />`,
      kotlin: `CardCashPerks(rate = 3.0, categories = listOf(DINING, TRANSPORT))`,
    },
  },
  {
    id: 'cardRecentActivity',
    title: 'Card Recent Activity',
    subtitle: 'Apple Store, Starbucks and Uber purchases',
    category: 'ledger',
    badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `CardRecentActivity(items: store.cardActivity)`,
      typescript: `export const CardRecentActivity = ({ items }) => (\n  <ActivityRows items={items.slice(0, 3)} />\n);`,
      reactnative: `<CardRecentActivity items={items} />`,
      kotlin: `CardRecentActivity(items = store.cardActivity)`,
    },
  },
];

/**
 * New components keyed by the page they prepend to (banking + wallet only).
 * Newest items come first so they render ABOVE the previous components.
 */
export const BANKING_WALLET_PAGE_PREPEND: Record<string, string[]> = {
  home: [
    'homeBlueHero',
    'billNegotiatorCard',
    'billsPaymentsList',
    'homeHeroBalance',
    'quickSendRow',
  ],
  history: ['spendingChart', 'detailedHistory'],
  cards: [
    'myCardsHero',
    'cardSpendingLimit',
    'cardSecurityPermissions',
    'cardCashPerks',
    'cardRecentActivity',
    'creditCardCarousel',
    'cardSecurityLock',
  ],
  notifications: ['notificationCenter'],
  profile: ['profileMenu'],
  send: [
    'transferMoneyHeader',
    'transferAmountMethods',
    'transferReviewFooter',
    'sendMoneySheet',
  ],
};

export const BANKING_WALLET_MODULE_IDS: Set<string> = new Set(
  BANKING_WALLET_MODULES.map((m) => m.id),
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LIME = '#C7F03F';
const PURPLE = '#6D4AFF';
const BLUE_BRAND = '#1D4ED8';
const BLUE_GRADIENT = 'linear-gradient(170deg, #4A7CFF 0%, #2563EB 45%, #1D4ED8 100%)';

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const surface = (dark: boolean) =>
  dark
    ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5'
    : 'bg-white text-slate-900 shadow-[0_6px_24px_rgba(37,52,120,0.08)]';

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
      className={`relative inline-block h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
        checked ? '' : 'bg-slate-300'
      }`}
      style={checked ? { background: accent } : undefined}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
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
      className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {track}
    </button>
  );
}

/** Reusable blue hero shell used by the page-level hero components. */
function BlueHeroShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden px-4 pb-3 pt-2 text-white ${className}`}
      style={{ background: BLUE_GRADIENT }}
    >
      <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <span aria-hidden className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/5" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXISTING components (unchanged)                                    */
/* ------------------------------------------------------------------ */

function HomeHeroBalance({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div
      className={`relative overflow-hidden p-4 text-white ${ctx.radius.card}`}
      style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}
    >
      <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-1.5 text-[10px] text-white/80">
        <span>Total Balance</span>
        <Info className="h-2.5 w-2.5" />
      </div>
      <p className="relative mt-1 text-[24px] font-bold leading-none tracking-tight">
        {usd(ctx.balance)}
      </p>
      <div className="relative mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={ctx.actions.send}
          className="flex items-center gap-1 rounded-full bg-[#C7F03F] px-3 py-1.5 text-[10px] font-bold text-[#0B1A56]"
        >
          <ArrowUpRight className="h-3 w-3" /> Transfer
        </button>
        <button
          type="button"
          onClick={() => ctx.actions.payBill()}
          className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#0B1A56]"
        >
          <ArrowDownLeft className="h-3 w-3" /> Receive
        </button>
        <button
          type="button"
          aria-label="Cards"
          onClick={ctx.actions.openWallet}
          className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-[#C7F03F]"
        >
          <CreditCard className="h-4 w-4 text-[#0B1A56]" />
        </button>
      </div>
    </div>
  );
}

function QuickSendRow({ ctx }: { ctx: BankingWalletCtx }) {
  const people = [
    { name: 'Daniel', from: '#FBBF24', to: '#F59E0B' },
    { name: 'Ethan', from: '#60A5FA', to: '#3B82F6' },
    { name: 'Gabriel', from: '#34D399', to: '#10B981' },
    { name: 'Henry', from: '#818CF8', to: '#6366F1' },
    { name: 'James', from: '#FB7185', to: '#F43F5E' },
  ];
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-bold">Quick Send</h3>
        <button
          type="button"
          onClick={ctx.actions.send}
          className="text-[10px] font-semibold"
          style={{ color: ctx.accent }}
        >
          See All
        </button>
      </div>
      <div className="flex items-start gap-3 overflow-x-auto pb-1 scrollbar-none">
        {people.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={ctx.actions.send}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <span
              className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white"
              style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
            />
            <span className="text-[9px] text-slate-500">{p.name}</span>
          </button>
        ))}
        <button type="button" onClick={ctx.actions.send} className="flex shrink-0 flex-col items-center gap-1">
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-slate-300">
            <Plus className="h-3.5 w-3.5 text-slate-400" />
          </span>
          <span className="text-[9px] text-slate-500">Add</span>
        </button>
      </div>
    </section>
  );
}

function SpendingChart({ ctx }: { ctx: BankingWalletCtx }) {
  const [range, setRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const bars = [55, 40, 78, 30, 62];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return (
    <div className={`p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="mb-3 flex items-center gap-1 rounded-full bg-slate-100 p-0.5 dark:bg-slate-800">
        {(['Daily', 'Weekly', 'Monthly'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`flex-1 cursor-pointer rounded-full py-1.5 text-[10px] font-semibold transition ${
              range === r ? 'bg-[#6D4AFF] text-white' : 'text-slate-500'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="relative flex h-32 items-end justify-between gap-3 pt-6" aria-hidden>
        {bars.map((h, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center">
            {i === 2 && (
              <span className="absolute -top-6 whitespace-nowrap rounded-full bg-[#6D4AFF] px-2 py-0.5 text-[8px] font-bold text-white shadow">
                $3.24.00
              </span>
            )}
            <span
              className="w-full rounded-full"
              style={{ height: `${h}%`, background: i === 2 ? '#6D4AFF' : '#E5E7EB' }}
            />
            <span
              className={`mt-2 text-[9px] font-semibold ${
                i === 2 ? 'text-[#6D4AFF]' : 'text-slate-400'
              }`}
            >
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreditCardCarousel({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-slate-400">Your card information</p>
          <h3 className="text-[13px] font-bold">All Credit Cards (2)</h3>
        </div>
        <button
          type="button"
          onClick={ctx.actions.openWallet}
          className="text-[10px] font-semibold"
          style={{ color: ctx.accent }}
        >
          Manage
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
            <Plus className="h-3.5 w-3.5" />
          </span>
          <span className="text-[9px] text-slate-500">Add</span>
        </div>
        <div
          className="relative h-[120px] w-[200px] shrink-0 overflow-hidden rounded-2xl p-3 text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}
        >
          <span aria-hidden className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/70">Current Balance</span>
            <Wifi className="h-3.5 w-3.5 rotate-90 text-white/80" />
          </div>
          <p className="mt-0.5 text-[18px] font-bold">{usd(ctx.balance)}</p>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-wide text-white/70">Sajibur Rahman 08/24</p>
              <p className="font-mono text-[9px] tracking-widest text-white/90">•••• •••• •••• 1234</p>
            </div>
            <span className="flex">
              <span className="h-4 w-4 rounded-full bg-rose-500" />
              <span className="-ml-2 h-4 w-4 rounded-full bg-amber-400" />
            </span>
          </div>
        </div>
        <div
          className="relative h-[120px] w-[160px] shrink-0 overflow-hidden rounded-2xl p-3 text-[#0B1A56] shadow-md"
          style={{ background: 'linear-gradient(135deg, #E8FFB0 0%, #C7F03F 100%)' }}
        >
          <p className="text-[8px] font-bold uppercase tracking-wide opacity-70">Kinetic</p>
          <p className="mt-1 text-[14px] font-bold">$0.00</p>
          <p className="mt-8 font-mono text-[9px] tracking-widest opacity-70">•••• 8821</p>
        </div>
      </div>
    </section>
  );
}

function CardSecurityLock({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className={`flex items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center bg-[#C7F03F] text-[#0B1A56] ${ctx.radius.icon}`}>
          <Lock className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[12px] font-semibold">Card Security Lock</p>
          <p className="text-[9px] text-slate-400">Temporarily freeze instant tap</p>
        </div>
      </div>
      <Switch
        checked={ctx.isCardFrozen}
        onChange={ctx.actions.toggleFreeze}
        label="Card Security Lock"
        accent={ctx.accent}
        interactive={ctx.interactive}
      />
    </div>
  );
}

function DetailedHistory({ ctx }: { ctx: BankingWalletCtx }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Income', 'Expenses', 'Transfers'];

  const groups = [
    {
      label: 'TODAY',
      date: 'Nov 24',
      items: [
        { name: 'Uber', sub: 'Transport • 8:00 AM', method: 'Debit Card', amount: -55, Icon: Truck, tone: 'slate' as const },
        { name: 'Starbucks', sub: 'Food & Drinks • 10:15 AM', method: 'Apple Pay', amount: -8.5, Icon: Coffee, tone: 'blue' as const },
        { name: 'Salary Deposit', sub: 'TechCorp Inc.', method: 'Direct Deposit', amount: 4200, Icon: ArrowUp, tone: 'green' as const },
      ],
    },
    {
      label: 'YESTERDAY',
      date: 'Nov 23',
      items: [
        { name: 'Amazon', sub: 'Shopping • 12:00 AM', method: 'Virtual Card', amount: -160, Icon: ShoppingBag, tone: 'slate' as const },
        { name: 'Netflix Subscription', sub: 'Entertainment • Monthly', method: 'Recurring', amount: -19.99, Icon: Play, tone: 'rose' as const },
        { name: 'Transfer from Ethan', sub: 'Dinner Split • 9:45 PM', method: 'Instant', amount: 120, Icon: ArrowDownLeft, tone: 'green' as const },
      ],
    },
  ];

  const toneCls = (tone: string) =>
    tone === 'green'
      ? 'bg-emerald-50 text-emerald-600'
      : tone === 'blue'
      ? 'bg-blue-50 text-blue-600'
      : tone === 'rose'
      ? 'bg-rose-50 text-rose-500'
      : 'bg-slate-100 text-slate-600';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`flex flex-1 items-center gap-2 px-3 py-2.5 ${ctx.radius.icon} ${surface(ctx.isDark)}`}>
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] text-slate-400">Search merchant or category…</span>
        </div>
        <span className={`grid h-9 w-9 place-items-center ${ctx.radius.icon} ${surface(ctx.isDark)}`}>
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
        </span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
              filter === f
                ? 'bg-[#6D4AFF] text-white'
                : ctx.isDark
                ? 'bg-slate-800 text-slate-300'
                : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className={`relative overflow-hidden p-4 text-white ${ctx.radius.card}`}
        style={{ background: 'linear-gradient(135deg, #1F2937 0%, #0F172A 100%)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 text-[9px] text-white/70">
            Total Spent • Nov <Info className="h-2.5 w-2.5" />
          </div>
          <span className="rounded-full bg-[#C7F03F] px-2 py-0.5 text-[8px] font-bold text-[#0B1A56]">
            ↑ +14.2%
          </span>
        </div>
        <p className="mt-1 text-[22px] font-bold">
          $2,840<span className="text-[12px]">.50</span>
        </p>
        <div className="mt-3 flex items-center justify-between text-[9px] text-white/70">
          <span>Budget Left</span>
          <span className="text-[#C7F03F]">$1,659.50</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[#C7F03F]" style={{ width: '63%' }} />
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.label}>
          <div className="mb-1.5 flex items-center justify-between">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{g.label}</h4>
            <span className="text-[9px] text-slate-400">{g.date}</span>
          </div>
          <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            {g.items.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.name} className="flex items-center justify-between gap-2 p-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`grid h-8 w-8 place-items-center ${ctx.radius.icon} ${toneCls(item.tone)}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold">{item.name}</p>
                      <p className="text-[8px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] font-bold ${item.amount > 0 ? 'text-emerald-600' : ''}`}>
                      {item.amount > 0 ? '+' : ''}
                      {usd(item.amount)}
                    </p>
                    <p className="text-[8px] text-slate-400">{item.method}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function NotificationCenter({ ctx }: { ctx: BankingWalletCtx }) {
  const [filter, setFilter] = useState('All');
  const filters = [
    { label: 'All', count: 16 },
    { label: 'Transactions' },
    { label: 'Security' },
    { label: 'Promos' },
  ];

  return (
    <div className="space-y-3">
      <div className={`flex items-center justify-between rounded-full px-3 py-2 ${surface(ctx.isDark)}`}>
        <span className="flex items-center gap-1.5 text-[10px] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C7F03F]" />3 Unread Alerts
        </span>
        <button type="button" className="text-[9px] font-bold" style={{ color: ctx.accent }}>
          MARK ALL READ
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(f.label)}
            className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
              filter === f.label
                ? 'bg-[#6D4AFF] text-white'
                : ctx.isDark
                ? 'bg-slate-800 text-slate-300'
                : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {f.label}
            {f.count != null && <span className="ml-1 rounded-full bg-white/30 px-1 text-[8px]">{f.count}</span>}
          </button>
        ))}
      </div>

      <div
        className="relative overflow-hidden rounded-2xl p-4 text-white"
        style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
              <ShieldCheck className="h-2.5 w-2.5" /> Smart Protect Active
            </span>
            <p className="mt-2 text-[14px] font-bold">Real-Time Neo Guard</p>
            <p className="mt-1 text-[9px] leading-snug text-white/80">
              Automated biometric verification and zero-latency transaction shields are enabled.
            </p>
          </div>
          <ShieldCheck className="h-10 w-10 shrink-0 text-white/20" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">TODAY</h4>
        <span className="text-[9px] text-slate-400">3 New</span>
      </div>

      <div className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center bg-[#C7F03F] text-[#0B1A56] ${ctx.radius.icon}`}>
          <ShieldCheck className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">High Priority</p>
            <span className="text-[8px] text-slate-400">10m ago</span>
          </div>
          <p className="mt-0.5 text-[11px] font-semibold">New sign-in detected</p>
          <p className="mt-0.5 text-[9px] leading-snug text-slate-500">
            Apple iPhone 15 Pro, San Francisco CA. Was this authentic access?
          </p>
          <div className="mt-2 flex gap-1.5">
            <button type="button" className="rounded-full bg-[#6D4AFF] px-2.5 py-1 text-[9px] font-bold text-white">Yes, it&apos;s me</button>
            <button type="button" className="rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-bold text-rose-600">Block Access</button>
          </div>
        </div>
      </div>

      <div className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center bg-[#C7F03F] text-[#0B1A56] ${ctx.radius.icon}`}>
          <ArrowDownLeft className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: ctx.accent }}>Instant Transfer</p>
            <span className="text-[8px] text-slate-400">1h ago</span>
          </div>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-semibold">Daniel Vance</p>
            <p className="text-[11px] font-bold text-emerald-600">+$850.00</p>
          </div>
          <p className="mt-0.5 text-[9px] text-slate-500">Funds settled instantly in your Primary Smart Stash.</p>
        </div>
      </div>

      <div className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center bg-slate-100 text-slate-600 ${ctx.radius.icon}`}>
          <FileText className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-bold uppercase tracking-wider text-rose-500">Due in 3 Days</p>
            <span className="text-[8px] text-slate-400">4h ago</span>
          </div>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-semibold">Google Fiber Internet</p>
            <p className="text-[11px] font-bold">$70.00</p>
          </div>
          <p className="mt-0.5 text-[9px] text-slate-500">Auto-pay is currently paused for this recurring provider.</p>
          <button type="button" className="mt-2 rounded-full bg-[#C7F03F] px-2.5 py-1 text-[9px] font-bold text-[#0B1A56]">Pay Now →</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">YESTERDAY</h4>
      </div>

      <div className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center bg-violet-50 text-violet-600 ${ctx.radius.icon}`}>
          <Star className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-bold uppercase tracking-wider text-violet-500">Rewards</p>
            <span className="text-[8px] text-slate-400">Yesterday, 4:15 PM</span>
          </div>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-semibold">Amazon Online Store</p>
            <p className="text-[11px] font-bold text-emerald-600">+$3.40</p>
          </div>
          <p className="mt-0.5 text-[9px] text-slate-500">3% Cashback credit applied from Black Neo perk tier.</p>
        </div>
      </div>

      <div className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center bg-slate-100 text-slate-600 ${ctx.radius.icon}`}>
          <Lock className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Card Controls</p>
            <span className="text-[8px] text-slate-400">Yesterday, 9:20 AM</span>
          </div>
          <p className="mt-0.5 text-[11px] font-semibold">Virtual Neo Card Frozen</p>
          <p className="mt-0.5 text-[9px] text-slate-500">Temporary freeze activated via user quick toggle. Recurring subscriptions remain safe.</p>
          <button type="button" className="mt-2 text-[9px] font-bold" style={{ color: ctx.accent }}>Manage Cards ›</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">EARLIER THIS WEEK</h4>
      </div>

      <div className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center bg-slate-100 text-slate-600 ${ctx.radius.icon}`}>
          <FileText className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Statements</p>
            <span className="text-[8px] text-slate-400">Nov 01</span>
          </div>
          <p className="mt-0.5 text-[11px] font-semibold">November 2024 Statement</p>
          <p className="mt-0.5 text-[9px] text-slate-500">Your monthly account analysis and tax documents are ready for export.</p>
          <button type="button" className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Download className="h-2.5 w-2.5" /> PDF (2.4 MB)
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ ctx }: { ctx: BankingWalletCtx }) {
  const accountRows = [
    { title: 'Personal Information', sub: 'Name, Email, Phone, Address', Icon: User },
    { title: 'Linked Accounts & Cards', sub: '3 checking accounts linked', Icon: CreditCard, badge: '3 Active' },
    { title: 'Security & Face ID', sub: 'Biometrics, App Lock & Keys', Icon: ShieldCheck, badge: '2FA ON' },
    { title: 'Statements & Tax Reports', sub: 'Monthly PDF, 1099-INT forms', Icon: FileText },
  ];

  const featureRows = [
    { title: 'Auto-Invest & Round-ups', sub: 'Save spare change automatically', Icon: TrendingUp, on: true },
    { title: 'Real-time Push Alerts', sub: 'Instant transaction warnings', Icon: Bell, on: true },
    { title: 'Theme & Appearance', sub: 'Neo Kinetic Light Mode', Icon: Sun, right: 'Light' },
  ];

  const supportRows = [
    { title: '24/7 Priority Concierge', sub: 'Live chat • Avg wait < 1m', Icon: Headphones },
    { title: 'Terms & Privacy Policy', sub: 'FDIC Insured through Partner Bank', Icon: FileText },
  ];

  return (
    <div className="space-y-3">
      <div className={`flex flex-col items-center gap-2 p-4 text-center ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-xl font-bold text-white shadow ring-4 ring-white dark:ring-slate-900">
          SR
        </span>
        <p className="text-[15px] font-bold">Sajibur Rahman</p>
        <p className="text-[9px] text-slate-500">@sajibur • Premium Member</p>
        <div className="mt-1 flex flex-wrap justify-center gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-600">
            ● Active Session
          </span>
          <span className="rounded-full bg-[#C7F03F]/40 px-2 py-0.5 text-[8px] font-semibold text-[#0B1A56]">
            KYC Tier 3 Verified
          </span>
        </div>
      </div>

      <div
        className="relative flex items-center justify-between overflow-hidden rounded-2xl p-3 text-white"
        style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#C7F03F]/30">
            <Star className="h-4 w-4 text-[#C7F03F]" />
          </span>
          <div>
            <p className="text-[11px] font-bold">12,450 Kinetic Points</p>
            <p className="text-[8px] text-white/70">Redeemable for $124.50 Cash</p>
          </div>
        </div>
        <button type="button" className="rounded-full bg-[#C7F03F] px-3 py-1 text-[9px] font-bold text-[#0B1A56]">
          Claim
        </button>
      </div>

      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <h4 className="text-[11px] font-bold">Account &amp; Banking</h4>
          <span className="text-[8px] text-slate-400">SETTINGS</span>
        </div>
        <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
          {accountRows.map(({ title, sub, Icon, badge }) => (
            <div key={title} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className={`grid h-8 w-8 place-items-center bg-violet-50 text-violet-600 ${ctx.radius.icon}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold">{title}</p>
                  <p className="text-[8px] text-slate-400">{sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {badge && (
                  <span className="rounded-full bg-[#C7F03F]/40 px-1.5 py-0.5 text-[8px] font-bold text-[#0B1A56]">
                    {badge}
                  </span>
                )}
                <ChevronRight className="h-3 w-3 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <h4 className="text-[11px] font-bold">App Features</h4>
          <span className="text-[8px] text-slate-400">PREFERENCES</span>
        </div>
        <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
          {featureRows.map((item) => {
            const Icon = item.Icon;
            return (
              <div key={item.title} className="flex items-center justify-between gap-2 p-3">
                <div className="flex items-center gap-2.5">
                  <span className={`grid h-8 w-8 place-items-center bg-blue-50 text-blue-600 ${ctx.radius.icon}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold">{item.title}</p>
                    <p className="text-[8px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
                {item.on != null ? (
                  <Switch checked={item.on} onChange={() => {}} label={item.title} accent={ctx.accent} interactive={false} />
                ) : (
                  <span className="text-[9px] text-slate-500">{item.right}</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h4 className="mb-1.5 text-[11px] font-bold">Support &amp; Trust</h4>
        <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
          {supportRows.map(({ title, sub, Icon }) => (
            <div key={title} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className={`grid h-8 w-8 place-items-center bg-slate-100 text-slate-600 ${ctx.radius.icon}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold">{title}</p>
                  <p className="text-[8px] text-slate-400">{sub}</p>
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        className={`flex w-full items-center justify-center gap-1.5 bg-rose-50 py-2.5 text-[10px] font-semibold text-rose-600 dark:bg-rose-900/20 ${ctx.radius.icon}`}
      >
        <LogOut className="h-3 w-3" /> Log Out of Sajibur&apos;s Account
      </button>
      <p className="text-center text-[8px] text-slate-400">Version 3.14.0 (Kinetic Build #8821)</p>
    </div>
  );
}

function SendMoneySheet({ ctx }: { ctx: BankingWalletCtx }) {
  const [recipient, setRecipient] = useState('Daniel');
  const recipients = [
    { name: 'New', isNew: true },
    { name: 'Daniel' },
    { name: 'Ethan' },
    { name: 'Gabriel' },
    { name: 'Henry' },
    { name: 'James' },
  ];
  const chips = [50, 100, 250, 850];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-bold">Choose Recipient</h3>
        <span className="text-[10px] font-semibold" style={{ color: ctx.accent }}>
          Recent (8)
        </span>
      </div>

      <div className="flex items-start gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {recipients.map((r) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setRecipient(r.name)}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            {r.isNew ? (
              <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-dashed border-slate-300">
                <Plus className="h-4 w-4 text-slate-400" />
              </span>
            ) : (
              <span
                className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-bold text-white ${
                  recipient === r.name ? 'ring-2 ring-[#C7F03F] ring-offset-2' : ''
                }`}
              >
                {r.name.charAt(0)}
              </span>
            )}
            <span className={`text-[9px] ${recipient === r.name ? 'font-bold text-[#0B1A56] dark:text-white' : 'text-slate-500'}`}>
              {r.name}
            </span>
          </button>
        ))}
      </div>

      <div className={`space-y-3 p-4 text-center ${ctx.radius.card} ${surface(ctx.isDark)}`}>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 dark:bg-slate-800">
          ↔ TRANSFER AMOUNT
        </span>
        <p className="text-[26px] font-bold tracking-tight">
          $850<span className="text-[16px]">.00</span>
        </p>
        <p className="text-[9px] text-slate-400">
          Sending to <span className="font-bold text-slate-700 dark:text-slate-200">Daniel Vance</span> $Danielv
        </p>
        <div className="flex justify-center gap-1.5">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                c === 850 ? 'bg-[#C7F03F] text-[#0B1A56]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              }`}
            >
              ${c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <h4 className="text-[11px] font-bold">Payment Source</h4>
          <span className="text-[9px] font-semibold" style={{ color: ctx.accent }}>Change</span>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl p-3 text-white"
          style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-wider text-white/70">Current Balance</span>
            <Wifi className="h-3.5 w-3.5 rotate-90 text-white/70" />
          </div>
          <p className="mt-0.5 text-[18px] font-bold">{usd(ctx.balance)}</p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-wide text-white/70">Sajibur Rahman</p>
              <p className="font-mono text-[9px] tracking-widest text-white/90">•••• 1234</p>
            </div>
            <span className="flex items-center gap-1">
              <span className="h-4 w-4 rounded-full bg-rose-500" />
              <span className="-ml-2 h-4 w-4 rounded-full bg-amber-400" />
              <span className="text-[8px] font-semibold">08/26</span>
            </span>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1 text-[9px] text-slate-400">Note (Optional)</p>
        <div className={`flex items-center gap-2 px-3 py-2 ${ctx.radius.icon} ${surface(ctx.isDark)}`}>
          <Pencil className="h-3 w-3 text-slate-400" />
          <span className="flex-1 text-[10px] text-slate-600 dark:text-slate-300">
            Freelance design project milestone
          </span>
          <X className="h-3 w-3 text-slate-400" />
        </div>
      </div>

      <button
        type="button"
        onClick={ctx.actions.send}
        className="flex w-full items-center justify-between rounded-full bg-[#6D4AFF] py-2 pl-1 pr-3 text-white"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#C7F03F] text-[#0B1A56]">
          <ArrowRight className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-bold">Slide To Transfer &gt;&gt;&gt;&gt;</span>
        <Lock className="h-3.5 w-3.5" />
      </button>
      <p className="text-center text-[8px] text-slate-400">🛡 Instant 256-bit encrypted bank transfer</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NEW: Transfer Money components (Send page)                        */
/* ------------------------------------------------------------------ */

function TransferMoneyHeader({ ctx }: { ctx: BankingWalletCtx }) {
  const favorites = [
    { name: 'Sarah J.', initials: 'SJ', from: '#93C5FD', to: '#3B82F6' },
    { name: 'Marcus C.', initials: 'MC', from: '#60A5FA', to: '#2563EB' },
    { name: 'Alex R.', initials: 'AR', from: '#FCA5A5', to: '#F43F5E' },
  ];
  return (
    <div>
      <BlueHeroShell className="rounded-b-3xl pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 text-[10px] font-bold">
              EC
            </span>
            <div className="leading-tight">
              <p className="text-[8px] uppercase tracking-wide text-white/70">Good Morning 🌤</p>
              <p className="text-[12px] font-bold">Ethan Carter</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <Search className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <User className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          <p className="flex-1 text-[14px] font-bold">Transfer Money</p>
          <RefreshCw className="h-3.5 w-3.5" />
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[9px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Available Balance: {usd(ctx.balance)}
        </div>
      </BlueHeroShell>

      <div className="-mt-6 bg-[#F7F8FF] px-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold">Send Again</p>
            <p className="text-[8px] uppercase tracking-wider text-slate-400">Favorites</p>
          </div>
          <div className="mt-2 flex items-start gap-3">
            <button type="button" className="flex shrink-0 flex-col items-center gap-1">
              <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-blue-300 bg-blue-50">
                <Plus className="h-4 w-4 text-blue-500" />
              </span>
              <span className="text-[8px] text-blue-600">Add New</span>
            </button>
            {favorites.map((f) => (
              <button key={f.name} type="button" className="flex shrink-0 flex-col items-center gap-1">
                <span
                  className="relative grid h-10 w-10 place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${f.from}, ${f.to})` }}
                >
                  {f.initials}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
                </span>
                <span className="text-[8px] font-medium">{f.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
            <Search className="h-3 w-3 text-slate-400" />
            <span className="flex-1 text-[10px] text-slate-500">Sarah Jenkins</span>
            <QrCode className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransferAmountMethods({ ctx }: { ctx: BankingWalletCtx }) {
  const [amount, setAmount] = useState(250);
  const [method, setMethod] = useState('instant');
  const chips = [50, 100, 250, 500];
  const methods = [
    { id: 'instant', title: 'Instant to Bank', sub: 'Direct wire link • Free', badge: 'Fastest', Icon: Landmark },
    { id: 'debit', title: 'Debit Card Transfer', sub: 'Instant receipt • Visa ending 4821', Icon: CreditCard },
    { id: 'wire', title: 'Wire Transfer', sub: 'Standard domestic (1-2 days)', Icon: RefreshCw },
  ];
  return (
    <div className="space-y-3 bg-[#F7F8FF] px-3">
      <div className="rounded-2xl bg-[#EEF3FF] p-4 text-center">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Set Transfer Amount</p>
        <p className="mt-1 text-[26px] font-bold text-slate-900">
          ${amount}
          <span className="ml-1 text-[10px] font-medium text-slate-400">USD</span>
        </p>
        <p className="mt-1 text-[9px] text-slate-500">
          No transaction fee applies with instant priority
        </p>
        <div className="mt-3 flex justify-center gap-1.5">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAmount(c)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                amount === c ? 'bg-[#0B1A56] text-white' : 'bg-white text-slate-600'
              }`}
            >
              ${c}
            </button>
          ))}
          <button type="button" className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600">
            Custom
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-bold">Transfer Method</p>
        <p className="text-[9px] font-semibold text-emerald-600">⚡ Zero Fees</p>
      </div>

      <div className="space-y-1.5">
        {methods.map((m) => {
          const Icon = m.Icon;
          const active = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-2.5 rounded-xl bg-white p-2.5 text-left shadow-sm ${
                active ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold">{m.title}</span>
                  {m.badge && (
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-slate-500">{m.sub}</p>
              </div>
              <span
                className={`grid h-4 w-4 place-items-center rounded-full border-2 ${
                  active ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                }`}
              >
                {active && <Check className="h-2.5 w-2.5 text-white" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TransferReviewFooter({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="space-y-3 bg-[#F7F8FF] px-3 pb-4">
      <button
        type="button"
        onClick={ctx.actions.send}
        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] py-3 text-[12px] font-bold text-white shadow-lg shadow-blue-600/30"
      >
        Continue to Review <ArrowRight className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-2 rounded-xl bg-[#EEF3FF] p-3">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        <div>
          <p className="text-[10px] font-bold text-slate-800">Bank-grade 256-bit Encryption</p>
          <p className="mt-0.5 text-[9px] text-slate-500">
            Guaranteed instant settlement protected by Federal insurance.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NEW: Home components                                               */
/* ------------------------------------------------------------------ */

function HomeBlueHero({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <BlueHeroShell className="rounded-b-3xl pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 text-[10px] font-bold">
            EC
          </span>
          <div className="leading-tight">
            <p className="text-[8px] uppercase tracking-wide text-white/70">Good Morning 🌤</p>
            <p className="text-[12px] font-bold">Ethan Carter</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
            <Search className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
            <User className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[9px] text-white/80">
        <span>Total Balance</span>
        <Eye className="h-3 w-3" />
      </div>
      <p className="mt-0.5 text-[26px] font-bold leading-none tracking-tight">
        {usd(ctx.balance)}
      </p>
      <p className="mt-1 text-[10px] font-semibold text-emerald-300">
        +8.42% Today <span className="text-white/70">(+$9,684.20)</span>
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => ctx.actions.topUp()}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B1A56]"
        >
          <Plus className="h-3 w-3" /> Deposit
        </button>
        <button
          type="button"
          onClick={ctx.actions.send}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B1A56]"
        >
          <ArrowRight className="h-3 w-3" /> Transfer
        </button>
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-[#0B1A56]">
          <QrCode className="h-4 w-4" />
        </button>
      </div>
    </BlueHeroShell>
  );
}

function BillNegotiatorCard({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 -mt-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
        <p className="text-[11px] font-bold">Bill negotiator</p>
      </div>
      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-center">
        <p className="text-[10px] leading-snug text-slate-600">
          We found a way to cut your AT&amp;T Fiber bill by{' '}
          <span className="font-bold text-slate-900">$12/month</span> without changing your speed.
        </p>
        <button type="button" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-900">
          Start negotiation <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function BillsPaymentsList({ ctx }: { ctx: BankingWalletCtx }) {
  const [tab, setTab] = useState('All Bills');
  const bills = [
    { name: 'Internet — FiberLink', sub: 'Due Sep 18 • 2 days left', amount: '$10.99', Icon: Wifi },
    { name: 'Electricity — PowerGrid', sub: 'Due Sep 18 • 2 days left', amount: '$120.75', Icon: Zap },
    { name: 'Water — AquaPure', sub: 'Due Sep 22 • 6 days left', amount: '$45.00', Icon: Droplet },
  ];
  return (
    <div className="space-y-3 px-3 pb-2">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold">Bills &amp; Payments</p>
      </div>
      <div className="flex gap-1.5">
        {['All Bills', 'Need Actions'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
              tab === t ? 'bg-[#0B1A56] text-white' : 'bg-white text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
        {bills.map((b) => {
          const Icon = b.Icon;
          return (
            <div key={b.name} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold">{b.name}</p>
                  <p className="text-[8px] text-slate-400">{b.sub}</p>
                </div>
              </div>
              <p className="text-[11px] font-bold">{b.amount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NEW: Cards components                                              */
/* ------------------------------------------------------------------ */

function MyCardsHero({ ctx }: { ctx: BankingWalletCtx }) {
  const actions = [
    { label: 'Freeze', Icon: Snowflake },
    { label: 'Limits', Icon: SlidersHorizontal },
    { label: 'PIN', Icon: Lock },
    { label: 'Replace', Icon: CreditCard },
  ];
  return (
    <div>
      <BlueHeroShell className="rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 text-[10px] font-bold">
              EC
            </span>
            <div className="leading-tight">
              <p className="text-[8px] uppercase tracking-wide text-white/70">Good Morning 🌤</p>
              <p className="text-[12px] font-bold">Ethan Carter</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <Search className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
              <User className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-bold">My Cards</p>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px]">2 Active</span>
          </div>
          <button type="button" className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-semibold">
            + New Card
          </button>
        </div>

        {/* Primary Visa card visual */}
        <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] p-3 shadow-lg">
          <span aria-hidden className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between">
            <span className="grid h-7 w-9 place-items-center rounded bg-gradient-to-br from-amber-300 to-amber-500">
              <span className="h-3 w-5 rounded border border-amber-600/30" />
            </span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="relative mt-6 flex items-center gap-1.5">
            <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-300">
              ● Primary Debit
            </span>
          </div>
          <p className="relative mt-3 font-mono text-[14px] tracking-[0.3em]">•••• •••• •••• 4829</p>
          <div className="relative mt-3 flex items-end justify-between">
            <div>
              <p className="text-[7px] uppercase tracking-wider text-white/60">Card Holder</p>
              <p className="text-[10px] font-bold">ETHAN CARTER</p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-wider text-white/60">Expires</p>
              <p className="text-[10px] font-bold">08/28</p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-bold italic">VISA</p>
              <p className="text-[7px] uppercase tracking-wider text-white/60">Platinum</p>
            </div>
          </div>
        </div>

        <div className="relative mt-2 flex justify-center gap-1">
          <span className="h-1 w-4 rounded-full bg-white" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
        </div>
      </BlueHeroShell>

      <div className="bg-[#F7F8FF] px-3 pt-2 pb-1">
        <div className="grid grid-cols-4 gap-1">
          {actions.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              onClick={label === 'Freeze' ? ctx.actions.toggleFreeze : ctx.actions.openWallet}
              className="flex flex-col items-center gap-1 rounded-xl bg-white py-2.5 shadow-sm"
            >
              <Icon className="h-4 w-4 text-blue-600" />
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardSpendingLimit({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3 text-blue-600" />
          <p className="text-[10px] font-semibold">Monthly Spending Limit</p>
        </div>
        <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">
          30.6% Used
        </span>
      </div>
      <p className="mt-2 text-[16px] font-bold">
        $2,450.00 <span className="text-[9px] font-medium text-slate-500">spent</span>
      </p>
      <p className="text-[9px] text-slate-400">of $8,000.00</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: '30.6%' }} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="flex items-center gap-1 text-[9px] text-slate-500">
          <Check className="h-2.5 w-2.5 text-emerald-600" />
          $5,550.00 safe to spend until Oct 1
        </p>
        <button type="button" className="text-[9px] font-bold text-blue-600">
          Adjust
        </button>
      </div>
    </div>
  );
}

function CardSecurityPermissions({ ctx }: { ctx: BankingWalletCtx }) {
  const [online, setOnline] = useState(true);
  const [intl, setIntl] = useState(true);
  const [atm, setAtm] = useState(true);
  const items = [
    { key: 'online', title: 'Online Payments', sub: 'E-commerce and app subscriptions', Icon: ShoppingBag, value: online, set: setOnline },
    { key: 'intl', title: 'International Transactions', sub: 'Foreign currency and overseas usage', Icon: Globe, value: intl, set: setIntl },
    { key: 'atm', title: 'ATM Withdrawals', sub: 'Physical cash dispensing', Icon: CreditCard, value: atm, set: setAtm },
  ];
  return (
    <div className="mx-3 rounded-2xl bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold">Security &amp; Permissions</p>
        <span className="text-[8px] text-slate-400">Real-time control</span>
      </div>
      <div className="space-y-2">
        {items.map(({ key, title, sub, Icon, value, set }) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold">{title}</p>
                <p className="text-[8px] text-slate-400">{sub}</p>
              </div>
            </div>
            <Switch
              checked={value}
              onChange={() => set(!value)}
              label={title}
              accent={ctx.accent}
              interactive={ctx.interactive}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardCashPerks({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
        <p className="text-[11px] font-bold">Card Cash Perks Detected</p>
      </div>
      <div className="mt-2 rounded-xl bg-blue-50/60 p-3">
        <p className="text-[10px] leading-snug text-slate-600">
          You have <span className="font-bold text-slate-900">3.0% cashback</span> active on dining &amp;
          transport transactions with Visa Platinum this billing cycle.
        </p>
      </div>
      <button type="button" className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-slate-100 py-2 text-[10px] font-semibold text-slate-800">
        Explore Cashback Perks <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function CardRecentActivity({ ctx }: { ctx: BankingWalletCtx }) {
  const rows = [
    { name: 'Apple Store Fifth Ave', sub: 'Today • Electronics', amount: '-$149.00', Icon: ShoppingBag },
    { name: 'Starbucks Coffee', sub: 'Yesterday • Dining', amount: '-$6.45', Icon: Coffee },
    { name: 'Uber Technologies', sub: 'Sep 18 • Travel', amount: '-$24.80', Icon: Truck },
  ];
  return (
    <div className="mx-3 mb-2 rounded-2xl bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold">Recent Card Activity</p>
        <button type="button" onClick={ctx.actions.openHistory} className="text-[9px] font-semibold text-blue-600">
          View All
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((r) => {
          const Icon = r.Icon;
          return (
            <div key={r.name} className="flex items-center justify-between gap-2 py-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold">{r.name}</p>
                  <p className="text-[8px] text-slate-400">{r.sub}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold">{r.amount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public renderer                                                    */
/* ------------------------------------------------------------------ */

export function BankingWalletModuleView({
  id,
  ctx,
}: {
  id: string;
  ctx: BankingWalletCtx;
}) {
  switch (id) {
    /* Existing */
    case 'homeHeroBalance':
      return <HomeHeroBalance ctx={ctx} />;
    case 'quickSendRow':
      return <QuickSendRow ctx={ctx} />;
    case 'spendingChart':
      return <SpendingChart ctx={ctx} />;
    case 'creditCardCarousel':
      return <CreditCardCarousel ctx={ctx} />;
    case 'cardSecurityLock':
      return <CardSecurityLock ctx={ctx} />;
    case 'detailedHistory':
      return <DetailedHistory ctx={ctx} />;
    case 'notificationCenter':
      return <NotificationCenter ctx={ctx} />;
    case 'profileMenu':
      return <ProfileMenu ctx={ctx} />;
    case 'sendMoneySheet':
      return <SendMoneySheet ctx={ctx} />;

    /* NEW: Send page */
    case 'transferMoneyHeader':
      return <TransferMoneyHeader ctx={ctx} />;
    case 'transferAmountMethods':
      return <TransferAmountMethods ctx={ctx} />;
    case 'transferReviewFooter':
      return <TransferReviewFooter ctx={ctx} />;

    /* NEW: Home page */
    case 'homeBlueHero':
      return <HomeBlueHero ctx={ctx} />;
    case 'billNegotiatorCard':
      return <BillNegotiatorCard ctx={ctx} />;
    case 'billsPaymentsList':
      return <BillsPaymentsList ctx={ctx} />;

    /* NEW: Cards page */
    case 'myCardsHero':
      return <MyCardsHero ctx={ctx} />;
    case 'cardSpendingLimit':
      return <CardSpendingLimit ctx={ctx} />;
    case 'cardSecurityPermissions':
      return <CardSecurityPermissions ctx={ctx} />;
    case 'cardCashPerks':
      return <CardCashPerks ctx={ctx} />;
    case 'cardRecentActivity':
      return <CardRecentActivity ctx={ctx} />;

    default:
      return null;
  }
}