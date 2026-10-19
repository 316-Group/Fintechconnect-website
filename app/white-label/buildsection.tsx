'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outfit } from 'next/font/google';
import {
  ArrowDown, ArrowDownLeft, ArrowRight, ArrowUp, ArrowUpRight, ArrowLeftRight,
  Bell, Calendar, Check, ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown,
  Clock, Contrast, Copy, CreditCard, Eye, EyeOff, FileText, Fingerprint, GripVertical,
  Home, Landmark, LayoutGrid, Lock, LogIn, Mail, Monitor, Moon, MoreHorizontal,
  Palette, Pencil, Phone, PieChart, PiggyBank, Plus, PlusCircle, QrCode, RefreshCw,
  Search, Send, Settings, ShieldCheck, Sliders, Smartphone, Snowflake, Sparkles,
  Sun, SunMoon, Trash2, TrendingUp, Undo2, User, Users, Wallet, X, Zap,
} from 'lucide-react';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

const INK = '#0F1729';
const NAVY = '#0B2E8F';
const YELLOW = '#F5B921';
const GREEN = '#16A36B';
const PINK = '#EF4F6B';

type Category =
  | 'signin' | 'dashboard' | 'accounts' | 'transfers' | 'send'
  | 'request' | 'cards' | 'ledger' | 'alerts' | 'profile' | 'onboarding';

type ModuleId =
  | 'loginScreen' | 'otpVerification' | 'biometricUnlock'
  | 'netBalance' | 'quickActionRadial' | 'recentActivity'
  | 'accountsPortfolio' | 'routingWire' | 'monthlyAuditFile'
  | 'directTransferEngine' | 'multiMarketFX' | 'recurringStanding' | 'authorizationModal'
  | 'recentRecipients' | 'beneficiaryValidation' | 'sendMoneyInvoice' | 'transferDispatched'
  | 'peerInvoicing' | 'qrPaymentRequest' | 'splitPayment' | 'outstandingReceivables'
  | 'virtualDebitCard' | 'securityDashboard' | 'pinVault'
  | 'auditLedgerActivity'
  | 'alertCenter' | 'preferencesDeliveryChannels'
  | 'identityCard' | 'securityBaseline' | 'activeSessions'
  | 'brandOnboarding' | 'welcomeHero' | 'stepCarousel';

type RadiusMode = 'rounded' | 'sharp' | 'pill';
type PageId =
  | 'signin' | 'home' | 'accounts' | 'transfers' | 'send' | 'request'
  | 'cards' | 'history' | 'notifications' | 'profile' | 'splash';
type CodeLang = 'swiftui' | 'typescript' | 'reactnative' | 'kotlin';
type Density = 'compact' | 'spacious';
type AppKind = 'banking' | 'fintech' | 'psp' | 'wallet' | 'crypto';

interface ModuleAsset {
  id: ModuleId;
  title: string;
  subtitle: string;
  category: Category;
  badge: string;
  badgeColor: string;
  wide?: boolean;
  code: { swiftui: string; typescript: string; reactnative: string; kotlin: string };
}

const RADII: Record<RadiusMode, { card: string; tile: string; icon: string }> = {
  rounded: { card: 'rounded-[18px]', tile: 'rounded-xl', icon: 'rounded-lg' },
  sharp: { card: 'rounded-none', tile: 'rounded-none', icon: 'rounded-none' },
  pill: { card: 'rounded-[24px]', tile: 'rounded-[20px]', icon: 'rounded-full' },
};
type Radius = (typeof RADII)[RadiusMode];

/* -------------------------------------------------------------------------- */
/*  Desktop component catalog                                                  */
/* -------------------------------------------------------------------------- */

const availableModules: ModuleAsset[] = [
  // Sign In Journeys
  { id: 'loginScreen', title: 'Login Screen', subtitle: 'Email, password & sign-in CTA', category: 'signin', badge: 'Auth',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: { swiftui: `LoginScreen(email: $email, password: $pw, onSignIn: auth.signIn)`, typescript: `<LoginScreen onSubmit={signIn} />`, reactnative: `<LoginScreen onSignIn={auth.signIn} />`, kotlin: `LoginScreen(onSubmit = auth::signIn)` } },
  { id: 'otpVerification', title: 'OTP Verification', subtitle: '6-digit code entry & verify', category: 'signin', badge: 'Auth',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: { swiftui: `OTPVerification(length: 6, onVerify: auth.verifyOTP)`, typescript: `<OtpVerification onVerify={verify} />`, reactnative: `<OtpVerification onVerify={verify} />`, kotlin: `OtpVerification(onVerify = auth::verifyOTP)` } },
  { id: 'biometricUnlock', title: 'Biometric Unlock', subtitle: 'Face ID / fingerprint prompt', category: 'signin', badge: 'Auth',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: { swiftui: `BiometricUnlock(reason: "Unlock to proceed")`, typescript: `<BiometricUnlock onSuccess={unlock} />`, reactnative: `<BiometricUnlock onSuccess={unlock} />`, kotlin: `BiometricUnlock(onSuccess = ::unlock)` } },

  // Home Dashboard
  { id: 'netBalance', title: 'Total Net Balance', subtitle: 'Consolidated liquidity across accounts', category: 'dashboard', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', wide: true,
    code: { swiftui: `NetBalanceCard(total: 28650.00, reserved: 4850.00)`, typescript: `<NetBalanceCard total={28650} reserved={4850} />`, reactnative: `<NetBalanceCard total={28650} reserved={4850} />`, kotlin: `NetBalanceCard(total = 28650.0, reserved = 4850.0)` } },
  { id: 'quickActionRadial', title: 'Quick Action Menu', subtitle: 'Send, Receive, Pay, Manage, Move', category: 'dashboard', badge: 'Action',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', wide: true,
    code: { swiftui: `QuickActions(actions: [.send, .receive, .pay, .manage, .move])`, typescript: `<QuickActions actions={['send','receive','pay','manage','move']} />`, reactnative: `<QuickActions actions={actions} />`, kotlin: `QuickActions(actions = DEFAULT_ACTIONS)` } },
  { id: 'recentActivity', title: 'Recent Activity', subtitle: 'Live feed of the last transactions', category: 'dashboard', badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', wide: true,
    code: { swiftui: `RecentActivity(transactions: store.latest(3))`, typescript: `<RecentActivity transactions={latest} />`, reactnative: `<RecentActivity transactions={latest} />`, kotlin: `RecentActivity(transactions = store.latest(3))` } },

  // Accounts & Ledger
  { id: 'accountsPortfolio', title: 'Accounts Portfolio', subtitle: 'Balance per account with actions', category: 'accounts', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: { swiftui: `AccountsPortfolio(accounts: store.accounts)`, typescript: `<AccountsPortfolio accounts={accounts} />`, reactnative: `<AccountsPortfolio accounts={accounts} />`, kotlin: `AccountsPortfolio(accounts = store.accounts)` } },
  { id: 'routingWire', title: 'Routing & Wire Data', subtitle: 'SWIFT, IBAN & routing numbers', category: 'accounts', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: { swiftui: `RoutingWireCard(account: primary)`, typescript: `<RoutingWireCard account={primary} />`, reactnative: `<RoutingWireCard account={primary} />`, kotlin: `RoutingWireCard(account = primary)` } },
  { id: 'monthlyAuditFile', title: 'Monthly Audit File', subtitle: 'Downloadable statements', category: 'accounts', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: { swiftui: `MonthlyAuditFile(month: .oct2024, format: .csv)`, typescript: `<MonthlyAuditFile month="2024-10" />`, reactnative: `<MonthlyAuditFile month="2024-10" />`, kotlin: `MonthlyAuditFile(month = Month.OCT_2024)` } },

  // Transfers & FX
  { id: 'directTransferEngine', title: 'Direct Transfer Engine', subtitle: 'From/To, amount, continue', category: 'transfers', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `DirectTransfer(from: .checking, to: .savings, amount: 500)`, typescript: `<DirectTransfer from="checking" to="savings" amount={500} />`, reactnative: `<DirectTransfer from="checking" to="savings" amount={500} />`, kotlin: `DirectTransfer(from = CHECKING, to = SAVINGS, amount = 500.0)` } },
  { id: 'multiMarketFX', title: 'Multi-Market FX Swap', subtitle: 'Live rate & conversion', category: 'transfers', badge: 'FX',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: { swiftui: `MultiMarketFX(from: .usd, to: .eur, amount: 1000)`, typescript: `<MultiMarketFX from="USD" to="EUR" amount={1000} />`, reactnative: `<MultiMarketFX from="USD" to="EUR" amount={1000} />`, kotlin: `MultiMarketFX(from = USD, to = EUR, amount = 1000.0)` } },
  { id: 'recurringStanding', title: 'Recurring Standing Order', subtitle: 'Monthly schedule & next run', category: 'transfers', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `RecurringStanding(nextRun: "Nov 1 2024", amount: 220)`, typescript: `<RecurringStanding nextRun="2024-11-01" amount={220} />`, reactnative: `<RecurringStanding nextRun="2024-11-01" amount={220} />`, kotlin: `RecurringStanding(nextRun = date(2024,11,1), amount = 220.0)` } },
  { id: 'authorizationModal', title: 'Authorization Modal', subtitle: 'Payment review & authorize', category: 'transfers', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `AuthorizationModal(amount: 500, fee: 0)`, typescript: `<AuthorizationModal amount={500} fee={0} />`, reactnative: `<AuthorizationModal amount={500} fee={0} />`, kotlin: `AuthorizationModal(amount = 500.0, fee = 0.0)` } },

  // Send Money
  { id: 'recentRecipients', title: 'Recent Recipients', subtitle: 'Quick-pick saved contacts', category: 'send', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `RecentRecipients(contacts: contacts.recent)`, typescript: `<RecentRecipients contacts={recent} />`, reactnative: `<RecentRecipients contacts={recent} />`, kotlin: `RecentRecipients(contacts = contacts.recent)` } },
  { id: 'beneficiaryValidation', title: 'Beneficiary Validation', subtitle: 'Auto-detected bank & branch', category: 'send', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `BeneficiaryValidation(onDetect: bank::resolve)`, typescript: `<BeneficiaryValidation onDetect={resolveBank} />`, reactnative: `<BeneficiaryValidation onDetect={resolveBank} />`, kotlin: `BeneficiaryValidation(onDetect = bank::resolve)` } },
  { id: 'sendMoneyInvoice', title: 'Send Money Invoice', subtitle: 'Amount, note, request button', category: 'send', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `SendMoneyInvoice(amount: 20, note: "Dinner & drinks")`, typescript: `<SendMoneyInvoice amount={20} note="Dinner" />`, reactnative: `<SendMoneyInvoice amount={20} note="Dinner" />`, kotlin: `SendMoneyInvoice(amount = 20.0, note = "Dinner")` } },
  { id: 'transferDispatched', title: 'Transfer Dispatched', subtitle: 'Confirmation with receipt ID', category: 'send', badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: { swiftui: `TransferDispatched(receiptId: "TXN-8192", amount: 20)`, typescript: `<TransferDispatched receiptId="TXN-8192" amount={20} />`, reactnative: `<TransferDispatched receiptId="TXN-8192" amount={20} />`, kotlin: `TransferDispatched(receiptId = "TXN-8192", amount = 20.0)` } },

  // Payment Requests
  { id: 'peerInvoicing', title: 'Peer Invoicing', subtitle: 'Create invoice with due date', category: 'request', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `PeerInvoicing(amount: 75, due: "Nov 7")`, typescript: `<PeerInvoicing amount={75} due="2024-11-07" />`, reactnative: `<PeerInvoicing amount={75} due="2024-11-07" />`, kotlin: `PeerInvoicing(amount = 75.0, due = date(2024,11,7))` } },
  { id: 'qrPaymentRequest', title: 'QR Payment Request', subtitle: 'Scan-to-pay QR code', category: 'request', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `QRPaymentRequest(handle: "@alexrivers")`, typescript: `<QRPaymentRequest handle="@alexrivers" />`, reactnative: `<QRPaymentRequest handle="@alexrivers" />`, kotlin: `QRPaymentRequest(handle = "@alexrivers")` } },
  { id: 'splitPayment', title: 'Split Payment', subtitle: 'Divide across recipients', category: 'request', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `SplitPayment(total: 120, shares: [60, 40, 20])`, typescript: `<SplitPayment total={120} shares={[60,40,20]} />`, reactnative: `<SplitPayment total={120} shares={[60,40,20]} />`, kotlin: `SplitPayment(total = 120.0, shares = listOf(60.0,40.0,20.0))` } },
  { id: 'outstandingReceivables', title: 'Outstanding Receivables', subtitle: 'Pending invoice tracker', category: 'request', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: { swiftui: `OutstandingReceivables(items: store.pending)`, typescript: `<OutstandingReceivables items={pending} />`, reactnative: `<OutstandingReceivables items={pending} />`, kotlin: `OutstandingReceivables(items = store.pending)` } },

  // Card Management
  { id: 'virtualDebitCard', title: 'Virtual Debit Card', subtitle: 'Frozen/active debit card', category: 'cards', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', wide: true,
    code: { swiftui: `VirtualDebitCard(last4: "7104", frozen: state.frozen)`, typescript: `<VirtualDebitCard last4="7104" frozen={frozen} />`, reactnative: `<VirtualDebitCard last4="7104" frozen={frozen} />`, kotlin: `VirtualDebitCard(last4 = "7104", frozen = state.frozen)` } },
  { id: 'securityDashboard', title: 'Card Security Dashboard', subtitle: 'Freeze, disable, swipe', category: 'cards', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `CardSecurity(frozen: $state.frozen, blocked: $state.blocked)`, typescript: `<CardSecurity state={state} onChange={setState} />`, reactnative: `<CardSecurity state={state} onChange={setState} />`, kotlin: `CardSecurity(state = state, onChange = ::updateState)` } },
  { id: 'pinVault', title: 'PIN Vault', subtitle: 'View or change PIN', category: 'cards', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `PinVault(onView: pin::reveal, onChange: pin::change)`, typescript: `<PinVault onView={revealPin} onChange={changePin} />`, reactnative: `<PinVault onView={revealPin} onChange={changePin} />`, kotlin: `PinVault(onView = pin::reveal, onChange = pin::change)` } },

  // Transaction Ledger
  { id: 'auditLedgerActivity', title: 'Audit Ledger Activity', subtitle: 'Full transaction history', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', wide: true,
    code: { swiftui: `AuditLedger(transactions: store.all, filters: filters)`, typescript: `<AuditLedger transactions={all} filters={filters} />`, reactnative: `<AuditLedger transactions={all} filters={filters} />`, kotlin: `AuditLedger(transactions = store.all, filters = filters)` } },

  // Notifications
  { id: 'alertCenter', title: 'Alert Center', subtitle: 'Inbox of alerts', category: 'alerts', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: { swiftui: `AlertCenter(items: store.alerts)`, typescript: `<AlertCenter items={alerts} />`, reactnative: `<AlertCenter items={alerts} />`, kotlin: `AlertCenter(items = store.alerts)` } },
  { id: 'preferencesDeliveryChannels', title: 'Delivery Channels', subtitle: 'Notification preferences', category: 'alerts', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: { swiftui: `DeliveryChannels(push: $prefs.push, email: $prefs.email)`, typescript: `<DeliveryChannels prefs={prefs} onChange={setPrefs} />`, reactnative: `<DeliveryChannels prefs={prefs} onChange={setPrefs} />`, kotlin: `DeliveryChannels(prefs = prefs, onChange = ::updatePrefs)` } },

  // Profile & Security
  { id: 'identityCard', title: 'Identity Card', subtitle: 'Avatar, KYC level & tier', category: 'profile', badge: 'KYC',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: { swiftui: `IdentityCard(user: auth.current)`, typescript: `<IdentityCard user={user} />`, reactnative: `<IdentityCard user={user} />`, kotlin: `IdentityCard(user = auth.current)` } },
  { id: 'securityBaseline', title: 'Security Baseline', subtitle: 'Password, biometric, authenticity', category: 'profile', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `SecurityBaseline(password: $state.pw, faceId: $state.faceId)`, typescript: `<SecurityBaseline state={state} onChange={setState} />`, reactnative: `<SecurityBaseline state={state} onChange={setState} />`, kotlin: `SecurityBaseline(state = state, onChange = ::updateState)` } },
  { id: 'activeSessions', title: 'Active Sessions', subtitle: 'Devices signed in', category: 'profile', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: { swiftui: `ActiveSessions(sessions: store.sessions)`, typescript: `<ActiveSessions sessions={sessions} />`, reactnative: `<ActiveSessions sessions={sessions} />`, kotlin: `ActiveSessions(sessions = store.sessions)` } },

  // Splash & Onboarding
  { id: 'brandOnboarding', title: 'Brand Onboarding', subtitle: 'Dark launch screen', category: 'onboarding', badge: 'Brand',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', wide: true,
    code: { swiftui: `BrandOnboarding(brand: "FintecConnect")`, typescript: `<BrandOnboarding brand="FintecConnect" />`, reactnative: `<BrandOnboarding brand="FintecConnect" />`, kotlin: `BrandOnboarding(brand = "FintecConnect")` } },
  { id: 'welcomeHero', title: 'Welcome Hero', subtitle: 'Zero-fee banking CTA', category: 'onboarding', badge: 'Brand',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: { swiftui: `WelcomeHero(onGetStarted: goNext)`, typescript: `<WelcomeHero onNext={goNext} />`, reactnative: `<WelcomeHero onNext={goNext} />`, kotlin: `WelcomeHero(onNext = ::goNext)` } },
  { id: 'stepCarousel', title: 'Step Carousel', subtitle: 'Onboarding progress', category: 'onboarding', badge: 'Brand',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: { swiftui: `StepCarousel(current: 1, total: 3)`, typescript: `<StepCarousel current={1} total={3} />`, reactnative: `<StepCarousel current={1} total={3} />`, kotlin: `StepCarousel(current = 1, total = 3)` } },
];

const APP_KINDS: { id: AppKind; label: string; blurb: string }[] = [
  { id: 'banking', label: 'Banking app', blurb: 'Retail bank with accounts, cards and transfers' },
  { id: 'fintech', label: 'Fintech app', blurb: 'Investing, budgeting and analytics-first' },
  { id: 'psp', label: 'Payment service provider', blurb: 'Merchant payments, payouts and invoicing' },
  { id: 'wallet', label: 'Digital wallet', blurb: 'P2P wallet with virtual cards and top-ups' },
  { id: 'crypto', label: 'Crypto exchange', blurb: 'Spot swaps, multi-chain balances and custody' },
];

const PAGES: { id: PageId; label: string; blurb: string; modules: ModuleId[] }[] = [
  { id: 'signin', label: 'Sign In Journeys', blurb: 'Auth, OTP verification and biometric unlock', modules: ['loginScreen', 'otpVerification', 'biometricUnlock'] },
  { id: 'home', label: 'Home Dashboard Elements', blurb: 'High-visibility balance, actions and recent activity', modules: ['netBalance', 'quickActionRadial', 'recentActivity'] },
  { id: 'accounts', label: 'Accounts & Ledger Setup', blurb: 'Accounts, routing and statement files', modules: ['accountsPortfolio', 'routingWire', 'monthlyAuditFile'] },
  { id: 'transfers', label: 'Transfers & FX Routing', blurb: 'Direct transfers, FX swaps, standing orders', modules: ['directTransferEngine', 'multiMarketFX', 'recurringStanding', 'authorizationModal'] },
  { id: 'send', label: 'Send Money Workflows', blurb: 'Recipients, validation, invoice and receipt', modules: ['recentRecipients', 'beneficiaryValidation', 'sendMoneyInvoice', 'transferDispatched'] },
  { id: 'request', label: 'Payment Requests & Splitting', blurb: 'Invoicing, QR, splitting and receivables', modules: ['peerInvoicing', 'qrPaymentRequest', 'splitPayment', 'outstandingReceivables'] },
  { id: 'cards', label: 'Card Management Hub', blurb: 'Virtual debit, security controls and PIN vault', modules: ['virtualDebitCard', 'securityDashboard', 'pinVault'] },
  { id: 'history', label: 'Transaction Ledger & History', blurb: 'Full-filterable ledger of all activity', modules: ['auditLedgerActivity'] },
  { id: 'notifications', label: 'Notifications & Alerts', blurb: 'Alert center and channel preferences', modules: ['alertCenter', 'preferencesDeliveryChannels'] },
  { id: 'profile', label: 'Profile & Security Infrastructure', blurb: 'Identity, security baseline and sessions', modules: ['identityCard', 'securityBaseline', 'activeSessions'] },
  { id: 'splash', label: 'Splash & Onboarding Screens', blurb: 'Launch, hero and progress carousel', modules: ['brandOnboarding', 'welcomeHero', 'stepCarousel'] },
];

const HISTORY_LIMIT = 20;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const moduleFor = (id: ModuleId) => availableModules.find((m) => m.id === id);
const surface = (dark: boolean) =>
  dark ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5' : 'bg-white text-slate-900 shadow-[0_4px_18px_rgba(37,52,120,0.06)]';
const ringVar = (color: string) => ({ ['--tw-ring-color' as string]: color } as React.CSSProperties);

const buildInitialPages = (): Record<PageId, ModuleId[]> => {
  const out = {} as Record<PageId, ModuleId[]>;
  for (const p of PAGES) out[p.id] = p.id === 'home' ? [] : p.modules;
  return out;
};
const pageModulesFor = (page: PageId): ModuleId[] => PAGES.find((p) => p.id === page)?.modules ?? [];

/* -------------------------------------------------------------------------- */
/*  Shared components                                                         */
/* -------------------------------------------------------------------------- */

interface ViewCtx {
  radius: Radius;
  accent: string;
  isDark: boolean;
  brand: string;
  interactive: boolean;
}

function Switch({
  checked, onChange, label, accent, interactive = true,
}: { checked: boolean; onChange: () => void; label: string; accent: string; interactive?: boolean }) {
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
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} style={ringVar(accent)}
      className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">{track}</button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Individual desktop components                                             */
/* -------------------------------------------------------------------------- */

function LoginScreenCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-6`}>
      <div className="flex items-center gap-2.5">
        <span className={`grid h-10 w-10 place-items-center text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}><Landmark className="h-4 w-4" /></span>
        <div><p className="text-[13px] font-bold">Welcome back</p><p className="text-[10px] text-slate-400">Access your holdings, statements & cards</p></div>
      </div>
      <div className="mt-4 space-y-2.5">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Email</label>
        <div className={`flex items-center gap-2 border px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
          <Mail className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] text-slate-400">alex.morgan@fintech.co</span>
        </div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Password</label>
        <div className={`flex items-center justify-between gap-2 border px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] text-slate-400">••••••••</span></div>
          <Eye className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Sign in</button>
        <button type="button" className="w-full py-2 text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-1"><Fingerprint className="h-3 w-3" /> Quick sign-in with Face ID</button>
      </div>
    </div>
  );
}

function OtpVerificationCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-6`}>
      <div className="flex items-center gap-2.5">
        <span className={`grid h-10 w-10 place-items-center bg-emerald-50 text-emerald-600 ${ctx.radius.icon}`}><Phone className="h-4 w-4" /></span>
        <div><p className="text-[13px] font-bold">Check your phone</p><p className="text-[10px] text-slate-400">Enter the code we sent to your device</p></div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`grid h-10 w-9 place-items-center text-[15px] font-bold border ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'} ${i <= 3 ? '' : 'text-slate-300'}`} style={i <= 3 ? { borderColor: ctx.accent } : undefined}>
            {i <= 3 ? '•' : ''}
          </div>
        ))}
      </div>
      <button type="button" className={`mt-4 w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Verify &amp; continue</button>
      <p className="mt-2 text-center text-[10px] text-slate-400">Resend in 02:45</p>
    </div>
  );
}

function BiometricUnlockCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} flex flex-col items-center p-6 text-center`}>
      <div className={`grid h-16 w-16 place-items-center ${ctx.radius.icon} bg-slate-900 text-white`}><Fingerprint className="h-7 w-7" /></div>
      <p className="mt-3 text-[13px] font-bold">Unlock with Face ID</p>
      <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Hold up your device to securely access your savings and investments.</p>
      <div className="mt-4 flex flex-col gap-1.5">
        <button type="button" className={`w-full px-6 py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Use PIN / passcode instead</button>
        <button type="button" className="w-full py-1 text-[10px] font-semibold text-slate-500">Sign out of all accounts</button>
      </div>
    </div>
  );
}

function NetBalanceCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`relative overflow-hidden ${ctx.radius.card} p-5 text-white`} style={{ background: `linear-gradient(135deg, ${ctx.accent} 0%, #0B2E8F 55%, #0F1729 100%)` }}>
      <span aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full" style={{ background: `${ctx.accent}55` }} />
      <span aria-hidden className="absolute -right-4 top-16 h-24 w-24 rounded-full" style={{ background: `${YELLOW}66` }} />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-wider text-white/60">Total net balance</p>
        <p className="mt-1 text-[28px] font-bold leading-none tracking-tight">$28,650.40</p>
        <p className="mt-1 text-[10px] text-white/60">Reserved · $4,850.00</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[10px]">
          <span className="text-white/70">Consolidated liquidity</span>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-bold">USD · SWIFT</span>
        </div>
      </div>
    </div>
  );
}

function QuickActionRadialCard({ ctx }: { ctx: ViewCtx }) {
  const items = [
    { label: 'Send', Icon: Send }, { label: 'Receive', Icon: ArrowDownLeft },
    { label: 'Pay', Icon: CreditCard }, { label: 'Manage', Icon: Sliders },
    { label: 'Move', Icon: ArrowLeftRight },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Quick actions</p><span className="text-[10px] text-slate-400">Everything you need</span></div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {items.map(({ label, Icon }) => (
          <button key={label} type="button" className={`flex flex-col items-center gap-1.5 py-3 text-[10px] font-semibold ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
            <Icon className="h-4 w-4" style={{ color: ctx.accent }} />{label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentActivityCard({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    { name: 'Apple Store · #2214', sub: 'Today, 12:45 PM', amount: -149.0 },
    { name: 'Salary Deposit', sub: 'Today, 09:15 AM', amount: 4200.0 },
    { name: 'Blue Bottle Coffee', sub: 'Yesterday, 08:32 AM', amount: -6.8 },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Recent activity</p><button className="text-[10px] font-semibold" style={{ color: ctx.accent }}>View all</button></div>
      <div className="mt-3 divide-y divide-slate-200/70 dark:divide-white/5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              <span className={`grid h-8 w-8 place-items-center ${ctx.radius.icon} ${r.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                {r.amount > 0 ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
              </span>
              <div><p className="text-[11px] font-semibold">{r.name}</p><p className="text-[9px] text-slate-400">{r.sub}</p></div>
            </div>
            <span className={`text-[11px] font-bold ${r.amount > 0 ? 'text-emerald-600' : ''}`}>{r.amount > 0 ? '+' : '-'}{usd(Math.abs(r.amount))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountsPortfolioCard({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    { name: 'Everyday Checking', code: 'USD', amt: 12480.20 },
    { name: 'High-Yield Savings', code: 'USD', amt: 8920.00 },
    { name: 'Euro Travel', code: 'EUR', amt: 3410.55 },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Accounts portfolio</p><button className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Open new</button></div>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.name} className={`flex items-center justify-between px-3 py-2 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div><p className="text-[11px] font-semibold">{r.name}</p><p className="text-[9px] text-slate-400">{r.code}</p></div>
            <p className="text-[11px] font-bold">{r.code === 'EUR' ? '€' : '$'}{r.amt.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutingWireCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Routing &amp; wire data</p>
      <div className="mt-3 space-y-2 text-[11px]">
        {[['Account holder', 'Alex Rivers Holdings LLC'], ['Account number', '••••••1027'], ['SWIFT / BIC', 'APX BUS 33 884'], ['IBAN', 'GB29 APX 8842 1027 3398 22']].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <span className="text-slate-400">{k}</span>
            <span className="truncate font-medium">{v}</span>
          </div>
        ))}
      </div>
      <button type="button" className={`mt-3 w-full py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Share bank details</button>
    </div>
  );
}

function MonthlyAuditFileCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Monthly audit file</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div><p className="text-[10px] text-slate-400">October 2024 · CSV</p><p className="mt-1 text-[10px] text-slate-400">Cryptographically sealed with SHA-256</p></div>
        <FileText className="h-6 w-6" style={{ color: ctx.accent }} />
      </div>
      <button type="button" className={`mt-3 w-full py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Download PDF &amp; CSV</button>
    </div>
  );
}

function DirectTransferEngineCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Direct transfer engine</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><p className="text-[9px] text-slate-400">From</p><p className="text-[11px] font-semibold">Checking · $12,480</p></div>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><p className="text-[9px] text-slate-400">To</p><p className="text-[11px] font-semibold">Savings · $8,920</p></div>
      </div>
      <p className="mt-3 text-[10px] text-slate-400">Amount</p>
      <div className={`mt-1 px-3 py-2 text-[14px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>$500.00</div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400"><Clock className="h-3 w-3" /> Settles within 2 business days</div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Continue to review</button>
    </div>
  );
}

function MultiMarketFXCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Multi-market FX swap</p><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">Rate 1 USD = 0.9214 EUR</span></div>
      <div className="mt-3 space-y-2">
        <div className={`flex items-center justify-between px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><span className="text-[11px] font-semibold">1,000.00</span><span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600">USD</span></div>
        <div className="flex justify-center"><div className={`grid h-6 w-6 place-items-center ${ctx.radius.icon} border border-blue-100 bg-blue-50 text-blue-600`}><RefreshCw className="h-3 w-3" /></div></div>
        <div className={`flex items-center justify-between px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><span className="text-[11px] font-semibold">921.40</span><span className="rounded-md bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-600">EUR</span></div>
      </div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Lock rate &amp; exchange</button>
    </div>
  );
}

function RecurringStandingCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Recurring standing order</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">Active</span></div>
      <div className="mt-3 flex items-center gap-2.5">
        <span className={`grid h-9 w-9 place-items-center ${ctx.radius.icon} bg-slate-900 text-white`}><Calendar className="h-4 w-4" /></span>
        <div><p className="text-[11px] font-semibold">Prime Manhattan Realty</p><p className="text-[9px] text-slate-400">Next run · Nov 1, 2024</p></div>
      </div>
      <div className={`mt-3 flex items-center justify-between px-3 py-2 text-[11px] ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><span className="text-slate-400">Monthly amount</span><span className="font-bold">$2,200.00</span></div>
      <button type="button" className={`mt-3 w-full py-2 text-[10px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Modify schedule rules</button>
    </div>
  );
}

function AuthorizationModalCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[10px] uppercase tracking-wider text-slate-400">Payment review</p>
      <p className="mt-1 text-[18px] font-bold">$500.00</p>
      <p className="text-[10px] text-slate-400">To Sarah Jenkins, Chase Bank</p>
      <div className="mt-3 space-y-1.5 text-[10px]">
        {[['Network fee', '$0.00'], ['Estimated delivery', 'Within seconds'], ['Corridor', 'USD → USD']].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between"><span className="text-slate-400">{k}</span><span className="font-medium">{v}</span></div>
        ))}
      </div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Authorize transfer</button>
    </div>
  );
}

function RecentRecipientsCard({ ctx }: { ctx: ViewCtx }) {
  const contacts = ['Sarah Jenkins', 'David Brown', 'Emma Wilson', 'Michael Chang', 'Priya Patel', 'Tom Lee'];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Recent recipients</p><button className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Manage (40)</button></div>
      <div className="mt-3 grid grid-cols-6 gap-2">
        {contacts.map((c) => (
          <div key={c} className="flex flex-col items-center gap-1.5">
            <div className={`grid h-9 w-9 place-items-center text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>{c.charAt(0)}</div>
            <p className="truncate text-[8px] font-medium text-slate-500">{c.split(' ')[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BeneficiaryValidationCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Beneficiary validation</p>
      <div className="mt-3 space-y-1.5 text-[11px]">
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><p className="text-[9px] text-slate-400">Bank account</p><p className="font-mono">4041 0055 6643</p></div>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><p className="text-[9px] text-slate-400">Account holder</p><p>David Brown</p></div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-emerald-600"><Check className="h-3 w-3" /> Auto-detected · Chase Bank</div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Save beneficiary</button>
    </div>
  );
}

function SendMoneyInvoiceCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[10px] uppercase tracking-wider text-slate-400">Send money</p>
      <div className="mt-2 flex items-baseline gap-1"><span className="text-[14px] font-semibold text-slate-400">$</span><span className="text-[28px] font-bold tracking-tight">20.00</span><span className="ml-auto text-[10px] text-slate-400">USD</span></div>
      <div className={`mt-3 px-3 py-2 text-[10px] ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>🍽️ Dinner &amp; drinks</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className={`py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Request $20.00</button>
        <button type="button" className={`py-2 text-[10px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Send now</button>
      </div>
    </div>
  );
}

function TransferDispatchedCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5 text-center`}>
      <div className={`mx-auto grid h-12 w-12 place-items-center ${ctx.radius.icon} bg-emerald-50 text-emerald-600`}><Check className="h-5 w-5" /></div>
      <p className="mt-3 text-[12px] font-bold">Transfer dispatched!</p>
      <p className="mt-1 text-[10px] text-slate-400">Transaction ID · TXN-81P2-9J6B</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className={`flex-1 py-2 text-[10px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Share</button>
        <button type="button" className={`flex-1 py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Done</button>
      </div>
    </div>
  );
}

function PeerInvoicingCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Peer invoicing</p>
      <p className="mt-1 text-[10px] text-slate-400">Request funds and send a professional invoice.</p>
      <div className={`mt-3 flex items-baseline gap-1 px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><span className="text-[14px] font-semibold text-slate-400">$</span><span className="text-[22px] font-bold">75.00</span></div>
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400"><Calendar className="h-3 w-3" /> Due Nov 7, 2024</div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Send request</button>
    </div>
  );
}

function QRPaymentRequestCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} flex flex-col items-center p-5`}>
      <p className="text-[12px] font-bold">QR payment request</p>
      <div className={`mt-3 grid h-28 w-28 place-items-center ${ctx.radius.icon} bg-white ring-2`} style={{ '--tw-ring-color': ctx.accent } as React.CSSProperties}>
        <QrCode className="h-20 w-20" style={{ color: ctx.accent }} />
      </div>
      <p className="mt-2 text-[10px] text-slate-400">Scan to pay @alexrivers</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className={`px-3 py-1.5 text-[10px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Download QR</button>
        <button type="button" className={`px-3 py-1.5 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Copy link</button>
      </div>
    </div>
  );
}

function SplitPaymentCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Split payment</p><span className="text-[10px] text-slate-400">Total $120.00</span></div>
      <div className="mt-3 space-y-1.5 text-[11px]">
        {[['You (paid)', 60.00], ['Michael Henderson', 40.00], ['Jessica Taylor', 20.00]].map(([n, v]) => (
          <div key={n as string} className={`flex items-center justify-between px-3 py-1.5 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <span className="font-medium">{n}</span>
            <span className={`font-bold ${(v as number) > 0 && n !== 'You (paid)' ? 'text-emerald-600' : ''}`}>{usd(v as number)}</span>
          </div>
        ))}
      </div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Send 2 requests</button>
    </div>
  );
}

function OutstandingReceivablesCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Outstanding receivables</p>
      <div className="mt-3 space-y-1.5 text-[11px]">
        {[['Mike Henderson', '$40.00', 'Overdue'], ['Jessica Taylor', '$20.00', 'Due in 2 days'], ['Priya Patel', '$25.00', 'Due in 5 days']].map(([n, a, s]) => (
          <div key={n} className={`flex items-center justify-between px-3 py-1.5 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div><p className="font-medium">{n}</p><p className="text-[9px] text-slate-400">{s}</p></div>
            <span className="font-bold">{a}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-slate-400">Total outstanding · $85.00</p>
    </div>
  );
}

function VirtualDebitCardCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} p-5 text-white`} style={{ background: `linear-gradient(135deg, ${ctx.accent} 0%, #0B2E8F 60%, #0F1729 100%)` }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold tracking-wider">VIRTUAL DEBIT</span>
        <CreditCard className="h-5 w-5 opacity-80" />
      </div>
      <p className="mt-6 text-[10px] text-white/60">Frozen Block</p>
      <p className="mt-1 font-mono text-[14px] tracking-widest">4892 •••• •••• 7104</p>
      <div className="mt-3 flex items-end justify-between text-[9px] opacity-90"><span>ALEX RIVERS</span><span>09/28</span></div>
      <div className="mt-4 flex gap-2">
        <button type="button" className="flex-1 rounded-lg bg-white/15 py-1.5 text-[10px] font-bold">Add to Apple Wallet</button>
      </div>
    </div>
  );
}

function SecurityDashboardCard({ ctx }: { ctx: ViewCtx }) {
  const [frozen, setFrozen] = useState(false);
  const [online, setOnline] = useState(true);
  const [nfc, setNfc] = useState(true);
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Card security</p>
      <div className="mt-3 space-y-2 text-[11px]">
        {([
          ['Freeze card', frozen, setFrozen],
          ['Online payments', online, setOnline],
          ['Contactless NFC', nfc, setNfc],
        ] as const).map(([label, on, set]) => (
          <div key={label} className="flex items-center justify-between">
            <span>{label}</span>
            <Switch checked={on as boolean} onChange={() => (set as (v: boolean) => void)(!(on as boolean))} label={label} accent={ctx.accent} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] text-slate-400 dark:border-white/10">
        <span>Monthly spend</span><span className="font-bold text-slate-700 dark:text-slate-200">$2,840 / $10,000</span>
      </div>
    </div>
  );
}

function PinVaultCard({ ctx }: { ctx: ViewCtx }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">PIN vault</p>
      <p className="mt-1 text-[10px] text-slate-400">Your PIN is encrypted with end-to-end protection.</p>
      <div className={`mt-3 flex items-center justify-between px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <span className="font-mono text-[14px] tracking-widest">{revealed ? '4921' : '••••'}</span>
        <button type="button" onClick={() => setRevealed((v) => !v)} aria-label={revealed ? 'Hide PIN' : 'Show PIN'} className="text-slate-400 hover:text-slate-700">
          {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-slate-400">Last changed · 3 months ago</span>
        <button type="button" className="font-semibold" style={{ color: ctx.accent }}>Change PIN</button>
      </div>
      <button type="button" className="mt-3 w-full rounded-lg border border-rose-200 py-1.5 text-[10px] font-semibold text-rose-500">Report lost or stolen</button>
    </div>
  );
}

function AuditLedgerActivityCard({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    { d: 'Oct 28', n: 'Apple Store #2214', t: 'Gadgets · Card', a: -149.0 },
    { d: 'Oct 28', n: 'Salary Deposit', t: 'Income · ACH', a: 4200.0 },
    { d: 'Oct 27', n: 'Uber Technologies', t: 'Transport · Card', a: -24.6 },
    { d: 'Oct 27', n: 'Blue Bottle Coffee', t: 'Food · Card', a: -6.8 },
    { d: 'Oct 26', n: 'Vanguard Transfer', t: 'Investment · Wire', a: -1200.0 },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Audit ledger activity</p><span className="text-[10px] text-slate-400">Last 90 days</span></div>
      <div className="mt-3 divide-y divide-slate-200/60 dark:divide-white/5">
        {rows.map((r) => (
          <div key={`${r.d}-${r.n}`} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-12 text-center text-[9px] font-semibold uppercase text-slate-400`}>{r.d}</span>
              <div><p className="text-[11px] font-semibold">{r.n}</p><p className="text-[9px] text-slate-400">{r.t}</p></div>
            </div>
            <span className={`text-[11px] font-bold ${r.a > 0 ? 'text-emerald-600' : ''}`}>{r.a > 0 ? '+' : '-'}{usd(Math.abs(r.a))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertCenterCard({ ctx }: { ctx: ViewCtx }) {
  const alerts = [
    { title: 'Payment Received', sub: '$4,200.00 · ACH · 10 mins ago', tone: 'emerald' },
    { title: 'New login from Chrome · Mac', sub: 'IP: 192.168.1.42 · 2 hrs ago', tone: 'blue' },
    { title: 'Statement Ready', sub: 'October statement available', tone: 'slate' },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Alert center</p><span className="text-[10px] text-slate-400">3 unread</span></div>
      <div className="mt-3 space-y-1.5">
        {alerts.map((a) => (
          <div key={a.title} className={`flex items-center gap-2.5 px-3 py-2 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <span className={`grid h-7 w-7 place-items-center ${ctx.radius.icon} ${a.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : a.tone === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}><Bell className="h-3.5 w-3.5" /></span>
            <div className="min-w-0"><p className="truncate text-[11px] font-semibold">{a.title}</p><p className="truncate text-[9px] text-slate-400">{a.sub}</p></div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px]" style={{ color: ctx.accent }}>Mark all as read</p>
    </div>
  );
}

function PreferencesDeliveryChannelsCard({ ctx }: { ctx: ViewCtx }) {
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(true);
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Delivery channels</p>
      <div className="mt-3 space-y-2 text-[11px]">
        {([['Push alerts', push, setPush], ['SMS alerts', sms, setSms], ['Email alerts', email, setEmail]] as const).map(([label, on, set]) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5 text-slate-400" /><span>{label}</span></div>
            <Switch checked={on as boolean} onChange={() => (set as (v: boolean) => void)(!(on as boolean))} label={label} accent={ctx.accent} />
          </div>
        ))}
      </div>
    </div>
  );
}

function IdentityCardCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-12 w-12 place-items-center text-[15px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>A</div>
        <div><p className="text-[12px] font-bold">Alex Rivers</p><p className="text-[10px] text-slate-400">Tier 1 · Business · USD base</p></div>
      </div>
      <div className="mt-3 flex gap-1.5"><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">KYC Verified</span><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-600">Tier 2</span></div>
    </div>
  );
}

function SecurityBaselineCard({ ctx }: { ctx: ViewCtx }) {
  const [faceId, setFaceId] = useState(true);
  const [hwKey, setHwKey] = useState(false);
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <p className="text-[12px] font-bold">Security baseline</p>
      <div className="mt-3 space-y-2 text-[11px]">
        <div className="flex items-center justify-between"><span>Password</span><span className="text-[10px] text-slate-400">Updated 45 days ago</span></div>
        <div className="flex items-center justify-between"><span>Face ID</span><Switch checked={faceId} onChange={() => setFaceId((v) => !v)} label="Face ID" accent={ctx.accent} /></div>
        <div className="flex items-center justify-between"><span>Hardware authenticator</span><Switch checked={hwKey} onChange={() => setHwKey((v) => !v)} label="Hardware key" accent={ctx.accent} /></div>
      </div>
    </div>
  );
}

function ActiveSessionsCard({ ctx }: { ctx: ViewCtx }) {
  const sessions = [
    { name: 'iPhone 14 Pro', sub: 'Mexico City, MX · Current', icon: Smartphone },
    { name: 'MacBook Pro 16"', sub: 'Mexico City, MX · 2 hrs ago', icon: Monitor },
    { name: 'iPad Air', sub: 'Cancún, MX · 3 days ago', icon: Smartphone },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Active sessions</p><button className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Sign out all</button></div>
      <div className="mt-3 space-y-1.5 text-[11px]">
        {sessions.map((s) => (
          <div key={s.name} className={`flex items-center justify-between px-3 py-2 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2"><s.icon className="h-3.5 w-3.5 text-slate-400" /><div><p className="font-semibold">{s.name}</p><p className="text-[9px] text-slate-400">{s.sub}</p></div></div>
            <button className="text-[10px] font-semibold text-rose-500">Revoke</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandOnboardingCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} relative flex h-[220px] flex-col items-center justify-center overflow-hidden p-6 text-center`}
      style={{ background: `linear-gradient(135deg, #0F1729 0%, #0B2E8F 100%)` }}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 opacity-40" style={{ background: `radial-gradient(circle at 50% 100%, ${ctx.accent} 0%, transparent 70%)` }} />
      <div className="relative">
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white`} style={{ background: ctx.accent }}><Landmark className="h-7 w-7" /></div>
        <p className="mt-4 text-[15px] font-black tracking-wide text-white">{ctx.brand || 'FintecConnect'}</p>
        <p className="mt-1 text-[10px] text-white/60">Elevate · Connect · Grow</p>
      </div>
    </div>
  );
}

function WelcomeHeroCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className={`grid h-10 w-10 place-items-center ${ctx.radius.icon} bg-emerald-50 text-emerald-600`}><Zap className="h-4 w-4" /></div>
      <p className="mt-3 text-[14px] font-bold">Zero margin, full control</p>
      <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Open multi-currency accounts and move capital at real rates — no surprises.</p>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Get started</button>
      <p className="mt-2 text-center text-[10px] font-semibold" style={{ color: ctx.accent }}>Already have an account?</p>
    </div>
  );
}

function StepCarouselCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} flex flex-col items-center p-5 text-center`}>
      <div className={`grid h-12 w-12 place-items-center ${ctx.radius.icon} bg-slate-900 text-white`}><Landmark className="h-5 w-5" /></div>
      <p className="mt-3 text-[13px] font-bold">Borderless global FX</p>
      <p className="mt-1 text-[10px] text-slate-400">A single wallet for every currency, with guaranteed mid-market rates.</p>
      <div className="mt-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => <span key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-5' : 'w-1.5'}`} style={{ background: i === 0 ? ctx.accent : '#cbd5e1' }} />)}
      </div>
      <div className="mt-3 flex w-full gap-2">
        <button type="button" className={`flex-1 py-1.5 text-[10px] font-semibold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Skip</button>
        <button type="button" className={`flex-1 py-1.5 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Next</button>
      </div>
    </div>
  );
}

function ModuleView({ id, ctx }: { id: ModuleId; ctx: ViewCtx }) {
  switch (id) {
    case 'loginScreen': return <LoginScreenCard ctx={ctx} />;
    case 'otpVerification': return <OtpVerificationCard ctx={ctx} />;
    case 'biometricUnlock': return <BiometricUnlockCard ctx={ctx} />;
    case 'netBalance': return <NetBalanceCard ctx={ctx} />;
    case 'quickActionRadial': return <QuickActionRadialCard ctx={ctx} />;
    case 'recentActivity': return <RecentActivityCard ctx={ctx} />;
    case 'accountsPortfolio': return <AccountsPortfolioCard ctx={ctx} />;
    case 'routingWire': return <RoutingWireCard ctx={ctx} />;
    case 'monthlyAuditFile': return <MonthlyAuditFileCard ctx={ctx} />;
    case 'directTransferEngine': return <DirectTransferEngineCard ctx={ctx} />;
    case 'multiMarketFX': return <MultiMarketFXCard ctx={ctx} />;
    case 'recurringStanding': return <RecurringStandingCard ctx={ctx} />;
    case 'authorizationModal': return <AuthorizationModalCard ctx={ctx} />;
    case 'recentRecipients': return <RecentRecipientsCard ctx={ctx} />;
    case 'beneficiaryValidation': return <BeneficiaryValidationCard ctx={ctx} />;
    case 'sendMoneyInvoice': return <SendMoneyInvoiceCard ctx={ctx} />;
    case 'transferDispatched': return <TransferDispatchedCard ctx={ctx} />;
    case 'peerInvoicing': return <PeerInvoicingCard ctx={ctx} />;
    case 'qrPaymentRequest': return <QRPaymentRequestCard ctx={ctx} />;
    case 'splitPayment': return <SplitPaymentCard ctx={ctx} />;
    case 'outstandingReceivables': return <OutstandingReceivablesCard ctx={ctx} />;
    case 'virtualDebitCard': return <VirtualDebitCardCard ctx={ctx} />;
    case 'securityDashboard': return <SecurityDashboardCard ctx={ctx} />;
    case 'pinVault': return <PinVaultCard ctx={ctx} />;
    case 'auditLedgerActivity': return <AuditLedgerActivityCard ctx={ctx} />;
    case 'alertCenter': return <AlertCenterCard ctx={ctx} />;
    case 'preferencesDeliveryChannels': return <PreferencesDeliveryChannelsCard ctx={ctx} />;
    case 'identityCard': return <IdentityCardCard ctx={ctx} />;
    case 'securityBaseline': return <SecurityBaselineCard ctx={ctx} />;
    case 'activeSessions': return <ActiveSessionsCard ctx={ctx} />;
    case 'brandOnboarding': return <BrandOnboardingCard ctx={ctx} />;
    case 'welcomeHero': return <WelcomeHeroCard ctx={ctx} />;
    case 'stepCarousel': return <StepCarouselCard ctx={ctx} />;
    default: return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Small UI                                                                  */
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

function ToolbarButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-6 w-6 cursor-pointer place-items-center rounded-full outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-30 ${danger ? 'text-rose-500' : 'text-slate-600'}`}>{children}</button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page menu row with inline expansion                                       */
/* -------------------------------------------------------------------------- */

interface PageMenuItemProps {
  page: PageId;
  label: string;
  count: number;
  active: boolean;
  expanded: boolean;
  accent: string;
  canvasModules: ModuleId[];
  thumbCtx: ViewCtx;
  onSelect: () => void;
  onToggleExpand: () => void;
  onAddModule: (id: ModuleId) => void;
  onRemoveModule: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId) => void;
  onEndDrag: () => void;
  drag: ModuleId | null;
}

function PageMenuItem(props: PageMenuItemProps) {
  const { page, label, count, active, expanded, accent, canvasModules, thumbCtx, onSelect, onToggleExpand, onAddModule, onRemoveModule, onStartDrag, onEndDrag, drag } = props;
  const components = availableModules.filter((m) => pageModulesFor(page).includes(m.id));
  return (
    <li className={`list-none rounded-lg ${active ? 'bg-blue-50/60 ring-1 ring-blue-100' : ''}`}>
      <div className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${active ? '' : 'hover:bg-slate-50'}`}>
        <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left">
          <GripVertical className="h-3 w-3 shrink-0 text-slate-300" aria-hidden />
          <span className={`truncate text-[11px] font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
        </button>
        <span className={`ml-1.5 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
        <button type="button" onClick={onToggleExpand} aria-label={expanded ? `Hide ${label}` : `Show ${label}`} aria-expanded={expanded}
          style={expanded ? { color: accent, background: `${accent}14` } : undefined}
          className="ml-1 grid h-4 w-4 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-blue-600">
          {expanded ? <X className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
        </button>
      </div>
      {expanded && (
        <div className="mx-1.5 mb-1.5 space-y-1.5 rounded-lg border border-slate-100 bg-white p-1.5 shadow-inner">
          {components.map((mod) => {
            const isAdded = canvasModules.includes(mod.id);
            const isDragging = drag === mod.id;
            return (
              <div key={mod.id} draggable onDragStart={(e) => onStartDrag(e, mod.id)} onDragEnd={onEndDrag}
                style={isAdded ? ringVar(accent) : undefined}
                className={`flex cursor-grab flex-col gap-1.5 rounded-lg bg-white p-2 ring-1 transition active:cursor-grabbing ${isAdded ? 'ring-2' : 'ring-slate-100 hover:ring-slate-200'} ${isDragging ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <div className="mb-0.5 flex flex-wrap items-center gap-1">
                      <h4 className="text-[10px] font-semibold text-slate-900">{mod.title}</h4>
                      <span className={`rounded-full px-1 py-0.5 text-[7px] font-bold ${mod.badgeColor}`}>{mod.badge}</span>
                    </div>
                    <p className="text-[8px] text-slate-500">{mod.subtitle}</p>
                  </div>
                  <GripVertical className="h-3 w-3 shrink-0 text-slate-300" aria-hidden />
                </div>
                <div aria-hidden className="pointer-events-none select-none overflow-hidden rounded-md bg-[#F4F5FD] p-1.5">
                  <div className={outfit.className}><ModuleView id={mod.id} ctx={thumbCtx} /></div>
                </div>
                <button type="button" onClick={() => (isAdded ? onRemoveModule(mod.id) : onAddModule(mod.id))}
                  aria-label={isAdded ? `Remove ${mod.title}` : `Add ${mod.title}`}
                  style={isAdded ? { color: accent, background: `${accent}14` } : undefined}
                  className={`flex w-full cursor-pointer items-center justify-center gap-1 rounded-md py-1 text-[9px] font-bold transition ${isAdded ? '' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {isAdded ? (<><Check className="h-2.5 w-2.5 stroke-[3]" /> Added</>) : (<><Plus className="h-2.5 w-2.5" /> Add</>)}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page canvas                                                               */
/* -------------------------------------------------------------------------- */

interface PageCanvasProps {
  page: PageId;
  modules: ModuleId[];
  ctx: ViewCtx;
  editMode: boolean;
  density: Density;
  drag: ModuleId | null;
  dropIndex: number | null;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  onStartDrag: (e: React.DragEvent, id: ModuleId) => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onMove: (id: ModuleId, dir: -1 | 1) => void;
  onRemove: (id: ModuleId) => void;
  onQuickAdd: (id: ModuleId) => void;
  isDark: boolean;
  accent: string;
  radius: Radius;
}

function PageCanvas({
  page, modules, ctx, editMode, density, drag, dropIndex, bodyRef,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove, onQuickAdd, isDark, accent, radius,
}: PageCanvasProps) {
  const suggestions = pageModulesFor(page).length ? pageModulesFor(page) : ['netBalance', 'quickActionRadial', 'recentActivity'] as ModuleId[];

  return (
    <>
      {modules.length === 0 ? (
        <div
          style={drag ? { borderColor: accent, background: `${accent}10` } : undefined}
          className={`flex flex-col items-center justify-center space-y-3 border-2 border-dashed py-10 text-center transition-colors ${radius.card} ${drag ? '' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-blue-300/60 bg-blue-50/20'}`}>
          <div className={`grid h-12 w-12 place-items-center text-white shadow-sm ${radius.icon}`} style={{ background: accent }}><Plus className="h-6 w-6" /></div>
          <div className="space-y-1"><h4 className="text-xs font-bold">{drag ? 'Drop to add it here' : 'Build this page'}</h4><p className="text-[11px] text-slate-500">Drag tiles from the page menu or tap a suggestion.</p></div>
          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
            {suggestions.slice(0, 3).map((id) => (
              <button key={id} type="button" onClick={() => onQuickAdd(id)} className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>+ {moduleFor(id)?.title ?? id}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${density === 'compact' ? 'gap-3' : 'gap-4'} xl:grid-cols-2`}>
          {modules.map((id, i) => {
            const mod = moduleFor(id);
            const isSource = drag === id;
            return (
              <div key={id} data-module-id={id} draggable={editMode}
                onMouseDown={(e) => {
                  const isField = (e.target as HTMLElement).closest('input,textarea,select,button');
                  e.currentTarget.draggable = editMode && !isField;
                }}
                onDragStart={(e) => onStartDrag(e, id)} onDragEnd={onEndDrag}
                onDragOver={(e) => onItemDragOver(e, i)} onDrop={onDrop}
                style={{ ['--tw-ring-color' as string]: accent } as React.CSSProperties}
                className={`group relative ${radius.card} ${mod?.wide ? 'xl:col-span-2' : ''} ${editMode ? 'cursor-grab ring-offset-2 focus-within:ring-2 hover:ring-2 active:cursor-grabbing' : ''} ${isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'} ${isSource ? 'opacity-40' : ''}`}>
                {drag && dropIndex === i && <DropLine side="top" accent={accent} />}
                {drag && dropIndex === modules.length && i === modules.length - 1 && <DropLine side="bottom" accent={accent} />}
                {editMode && (
                  <div className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 rounded-full bg-white p-0.5 opacity-0 shadow-md ring-1 ring-slate-200 transition group-focus-within:opacity-100 group-hover:opacity-100">
                    <GripVertical className="h-3 w-3 text-slate-400" aria-hidden />
                    <ToolbarButton label={`Move up`} disabled={i === 0} onClick={() => onMove(id, -1)}><ChevronUp className="h-3 w-3" /></ToolbarButton>
                    <ToolbarButton label={`Move down`} disabled={i === modules.length - 1} onClick={() => onMove(id, 1)}><ChevronDown className="h-3 w-3" /></ToolbarButton>
                    <ToolbarButton label={`Remove`} danger onClick={() => onRemove(id)}><Trash2 className="h-3 w-3" /></ToolbarButton>
                  </div>
                )}
                <div className={drag ? 'pointer-events-none' : ''}><ModuleView id={id} ctx={ctx} /></div>
              </div>
            );
          })}
        </div>
      )}
      <div ref={bodyRef} className="hidden" aria-hidden />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Code panel                                                                */
/* -------------------------------------------------------------------------- */

const CODE_TABS: { id: CodeLang; label: string }[] = [
  { id: 'swiftui', label: 'SwiftUI' },
  { id: 'typescript', label: 'Typescript' },
  { id: 'reactnative', label: 'React Native' },
  { id: 'kotlin', label: 'Kotlin' },
];

const indentLines = (s: string, n: number) => s.split('\n').map((l) => ' '.repeat(n) + l);

function buildCode(lang: CodeLang, pageLabel: string, modules: ModuleId[], brand: string, accent: string, density: Density): string[] {
  const ident = pageLabel.replace(/[^A-Za-z0-9]+/g, '') || 'Page';
  const sp = density === 'compact' ? 10 : 16;
  const theme = `// Theme: ${brand || 'Brand'} (${accent.toUpperCase()})`;
  const snippets = modules.map((id) => moduleFor(id)?.code[lang] ?? `// ${id}`);
  const place = (n: number, empty: string) => snippets.length ? snippets.flatMap((s) => indentLines(s, n)) : [' '.repeat(n) + empty];

  if (lang === 'swiftui') return [
    '// Standard SwiftUI Whitelabel Screen', theme, '', 'import SwiftUI', '',
    `struct ${ident}Screen: View {`, '  var body: some View {', `    ScrollView { VStack(spacing: ${sp}) {`,
    ...place(8, '// No components yet'), '    } .padding(.horizontal, 24) }', '    .background(Color("AppSurface"))', `    .navigationTitle("${pageLabel}")`, '  }', '}',
  ];
  if (lang === 'typescript') return [
    '// Standard Typescript Whitelabel Screen', theme, '',
    'import React from "react";', 'import { Grid, Stack } from "@studio/ui";', '',
    `export const ${ident}Screen = () => (`, `  <Grid title="${pageLabel}" spacing={${sp}} paddingX={24}>`,
    ...place(4, '{/* No components yet */}'), '  </Grid>', ');',
  ];
  if (lang === 'reactnative') return [
    '// Standard React Native Whitelabel Screen', theme, '',
    'import React from "react";', 'import { ScrollView, View } from "react-native";', '',
    `export const ${ident}Screen = () => (`, '  <ScrollView style={{ backgroundColor: "AppSurface" }}>',
    `    <View style={{ gap: ${sp}, paddingHorizontal: 24 }}>`, ...place(6, '{/* No components yet */}'), '    </View>', '  </ScrollView>', ');',
  ];
  return [
    '// Standard Jetpack Compose Whitelabel Screen', theme, '',
    'import androidx.compose.foundation.layout.*', 'import androidx.compose.runtime.*', '',
    '@Composable', `fun ${ident}Screen() {`, '  Column(',
    `    verticalArrangement = Arrangement.spacedBy(${sp}.dp),`, '    modifier = Modifier.padding(horizontal = 24.dp)', '  ) {',
    ...place(4, '// No components yet'), '  }', '}',
  ];
}

const TOKEN = /(\/\/.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(@\w+|\b(?:import|struct|var|let|some|private|func|fun|val|by|return|export|const|from|class|default)\b)|(\b[A-Z][A-Za-z0-9]*Component\b)|(\b[A-Z][A-Za-z0-9]*\b)/g;
function highlight(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = []; let last = 0; let m: RegExpExecArray | null; TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const color = m[1] ? '#94A3B8' : m[2] ? '#DC2626' : m[3] ? '#EA580C' : m[4] ? '#C026D3' : m[5] ? '#D97706' : '#2563EB';
    out.push(<span key={m.index} style={{ color }}>{m[0]}</span>); last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function CodePanel({ pageLabel, blurb, modules, lang, onLang, accent, brand, density }: {
  pageLabel: string; blurb: string; modules: ModuleId[]; lang: CodeLang; onLang: (l: CodeLang) => void;
  accent: string; brand: string; density: Density;
}) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => buildCode(lang, pageLabel, modules, brand, accent, density), [lang, pageLabel, modules, brand, accent, density]);
  const copy = async () => { try { await navigator.clipboard.writeText(lines.join('\n')); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="px-4 pb-3 pt-4">
        <h3 className="text-[13px] font-bold text-slate-900">{pageLabel}</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{blurb}</p>
      </div>
      <div className="flex items-stretch justify-between border-y border-slate-200 bg-[#F4F5FC]" role="tablist">
        <div className="flex overflow-x-auto scrollbar-none">
          {CODE_TABS.map((t) => {
            const active = lang === t.id;
            return (
              <button key={t.id} type="button" role="tab" aria-selected={active} onClick={() => onLang(t.id)}
                style={active ? { borderBottomColor: accent } : undefined}
                className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-2.5 py-2 text-[10px] font-semibold outline-none transition ${active ? 'bg-white text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{t.label}</button>
            );
          })}
        </div>
        <button type="button" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'} title="Copy code"
          className="mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center self-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900">
          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      <pre className="scrollbar-none min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-[10px] leading-[1.7] text-slate-700">
        <code>{lines.map((l, i) => (<div key={i} className="whitespace-pre">{l === '' ? ' ' : highlight(l)}</div>))}</code>
      </pre>
      <div className="bg-[#DDE2F6] px-4 py-2 text-center text-[9px] leading-snug text-slate-600">
        Illustrative output. Uses standard platform APIs. Component names are placeholders, not a published SDK.
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Style popout                                                              */
/* -------------------------------------------------------------------------- */

const ACCENTS = [
  { hex: '#0040DF', name: 'Indigo' }, { hex: '#7C3AED', name: 'Violet' },
  { hex: '#A21CAF', name: 'Fuchsia' }, { hex: '#0284C7', name: 'Sky' },
  { hex: '#0F172A', name: 'Midnight' },
];

function Segmented<T extends string>({ label, value, options, onChange, variant }: {
  label: string; value: T; options: { id: T; label: string; Icon?: React.ComponentType<{ className?: string }> }[];
  onChange: (v: T) => void; variant: 'track' | 'buttons';
}) {
  return (
    <div role="radiogroup" aria-label={label} className={variant === 'track' ? 'grid gap-1 rounded-xl bg-[#EEF0FB] p-1' : 'grid gap-2'} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map(({ id, label: l, Icon }) => {
        const on = value === id;
        return (
          <button key={id} type="button" role="radio" aria-checked={on} onClick={() => onChange(id)}
            className={`flex cursor-pointer items-center justify-center gap-1.5 text-[11px] font-medium outline-none transition ${variant === 'track' ? `rounded-lg py-1.5 ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}` : `rounded-md py-2 ${on ? 'bg-[#0040DF] text-white' : 'bg-[#EEF0FB] text-slate-700 hover:bg-[#E3E6F7]'}`}`}>
            {Icon && <Icon className="h-3 w-3" />}{l}
          </button>
        );
      })}
    </div>
  );
}

function StyleLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{children}</span>{right}</div>;
}

function StylePopout({
  brandName, onBrandName, accent, onAccent, mode, onMode, shape, onShape, density, onDensity, onClose,
}: {
  brandName: string; onBrandName: (v: string) => void;
  accent: string; onAccent: (v: string) => void;
  mode: 'light' | 'dark' | 'auto'; onMode: (v: 'light' | 'dark' | 'auto') => void;
  shape: RadiusMode; onShape: (v: RadiusMode) => void;
  density: Density; onDensity: (v: Density) => void;
  onClose: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { nameRef.current?.focus(); }, []);
  return (
    <div role="dialog" aria-label="Brand and style"
      className="absolute left-3 top-3 z-30 max-h-[calc(100%-24px)] w-[min(280px,calc(100%-24px))] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_24px_60px_rgba(30,41,90,0.28)] ring-1 ring-slate-200/80 scrollbar-none">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[14px] font-semibold text-slate-900"><Palette className="h-4 w-4 text-slate-600" /> Brand &amp; Style</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <StyleLabel>Institution / Brand name</StyleLabel>
          <label className="flex items-center gap-2 rounded-lg bg-[#EEF0FB] px-3 py-2 focus-within:ring-2 focus-within:ring-[#0040DF]">
            <Landmark className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <input ref={nameRef} type="text" value={brandName} onChange={(e) => onBrandName(e.target.value)}
              className="w-full min-w-0 bg-transparent text-[12px] font-medium text-slate-900 outline-none" />
          </label>
        </div>
        <div>
          <StyleLabel right={<span className="text-[11px] font-bold uppercase" style={{ color: accent }}>{accent}</span>}>Primary brand accent</StyleLabel>
          <div className="flex items-center gap-2 px-0.5 py-1" role="radiogroup" aria-label="Accent">
            {ACCENTS.map(({ hex, name }) => (
              <button key={hex} type="button" role="radio" aria-checked={accent === hex} aria-label={name} title={name} onClick={() => onAccent(hex)}
                style={{ backgroundColor: hex }} className={`h-6 w-6 cursor-pointer rounded-full outline-none transition ${accent === hex ? 'scale-110 ring-2 ring-offset-1 ring-slate-900' : 'hover:scale-105'}`} />
            ))}
          </div>
        </div>
        <div>
          <StyleLabel>App interface mode</StyleLabel>
          <Segmented variant="track" label="Mode" value={mode} onChange={onMode}
            options={[{ id: 'light', label: 'Light', Icon: Sun }, { id: 'dark', label: 'Dark', Icon: Moon }, { id: 'auto', label: 'Auto', Icon: SunMoon }]} />
        </div>
        <div>
          <StyleLabel>Button shape</StyleLabel>
          <Segmented variant="buttons" label="Shape" value={shape} onChange={onShape}
            options={[{ id: 'sharp', label: 'Sharp' }, { id: 'rounded', label: 'Rounded' }, { id: 'pill', label: 'Full Pill' }]} />
        </div>
        <div>
          <StyleLabel>Density</StyleLabel>
          <Segmented variant="buttons" label="Density" value={density} onChange={onDensity}
            options={[{ id: 'compact', label: 'Compact' }, { id: 'spacious', label: 'Spacious' }]} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

export default function DesktopBuildSection() {
  const [appKind, setAppKind] = useState<AppKind>('banking');
  const [styleOpen, setStyleOpen] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);

  const [brandName, setBrandName] = useState('FintecConnect');
  const [accentColor, setAccentColor] = useState('#0040DF');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<RadiusMode>('rounded');
  const [density, setDensity] = useState<Density>('spacious');
  const [prefersDark, setPrefersDark] = useState(false);
  const [codeLang, setCodeLang] = useState<CodeLang>('swiftui');

  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageModules, setPageModules] = useState<Record<PageId, ModuleId[]>>(buildInitialPages);
  const [histories, setHistories] = useState<Record<PageId, ModuleId[][]>>(() => {
    const out = {} as Record<PageId, ModuleId[][]>;
    for (const p of PAGES) out[p.id] = [];
    return out;
  });
  const [editMode, setEditMode] = useState(true);
  const [expandedPage, setExpandedPage] = useState<PageId | null>(null);

  const [drag, setDrag] = useState<ModuleId | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const radius = RADII[buttonRadius];
  const isDark = interfaceMode === 'dark' || (interfaceMode === 'auto' && prefersDark);
  const accentName = ACCENTS.find((a) => a.hex === accentColor)?.name ?? 'Custom';
  const currentPage = PAGES.find((p) => p.id === activePage);
  const canvasModules = pageModules[activePage] ?? [];
  const history = histories[activePage] ?? [];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setPrefersDark(mq.matches);
    update(); mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!styleOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setStyleOpen(false); styleBtnRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [styleOpen]);
  const closeStyle = () => { setStyleOpen(false); styleBtnRef.current?.focus(); };

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
    setTimeout(() => { bodyRef.current?.querySelector(`[data-module-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60);
  };

  const addModule = (id: ModuleId) => {
    if (canvasModules.includes(id)) return;
    commit([...canvasModules, id]);
    scrollModuleIntoView(id);
  };
  const removeModule = (id: ModuleId) => commit(canvasModules.filter((m) => m !== id));
  const moveModule = (id: ModuleId, dir: -1 | 1) => {
    const i = canvasModules.indexOf(id); const j = i + dir;
    if (i === -1 || j < 0 || j >= canvasModules.length) return;
    const next = [...canvasModules]; [next[i], next[j]] = [next[j], next[i]]; commit(next);
  };
  const loadStarter = () => commit(pageModulesFor(activePage));
  const selectPage = (id: PageId) => { setActivePage(id); setExpandedPage(id); };

  const startDrag = (e: React.DragEvent, id: ModuleId) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'copyMove';
    setDrag(id);
  };
  const endDrag = () => { setDrag(null); setDropIndex(null); };
  const autoScroll = (clientY: number) => {
    const el = bodyRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    if (clientY < r.top + 40) el.scrollBy({ top: -12 });
    else if (clientY > r.bottom - 40) el.scrollBy({ top: 12 });
  };
  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    if (!drag) return; e.preventDefault(); e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
    autoScroll(e.clientY);
  };
  const handleContainerDragOver = (e: React.DragEvent) => { if (!drag) return; e.preventDefault(); setDropIndex(canvasModules.length); autoScroll(e.clientY); };
  const handleContainerDragLeave = (e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropIndex(null); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!drag) return;
    placeModule(drag, dropIndex ?? canvasModules.length);
    scrollModuleIntoView(drag);
    endDrag();
  };

  const liveCtx: ViewCtx = { radius, accent: accentColor, isDark, brand: brandName, interactive: true };
  const thumbCtx: ViewCtx = { radius, accent: accentColor, isDark: false, brand: brandName, interactive: false };

  const canvasProps = {
    page: activePage, modules: canvasModules, ctx: liveCtx, editMode, density, drag, dropIndex, bodyRef,
    onStartDrag: startDrag, onEndDrag: endDrag, onItemDragOver: handleItemDragOver, onDrop: handleDrop,
    onMove: moveModule, onRemove: removeModule, onQuickAdd: addModule, isDark, accent: accentColor, radius,
  };

  const segBtn = (on: boolean) =>
    `flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`;
  const iconBtn = 'grid h-7 w-7 cursor-pointer place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <section className="w-full overflow-hidden bg-[#f4f6fc] px-4 py-12 font-sans text-slate-900 sm:px-6 md:py-16 lg:px-10">
      <div className="mx-auto max-w-full space-y-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#0040DF]">DESKTOP MODULES</span>
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.25rem]">
              Build a desktop banking console, one modular card at a time
            </h2>
          </div>
          <p className="max-w-md text-sm font-normal leading-relaxed text-slate-500">
            Choose a starting page, drag the desktop cards you need, and watch the console and generated code update as you go.
          </p>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-[#DDE2F6] bg-[#EEF0FB] shadow-[0_10px_40px_rgba(37,52,120,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E1E5F8] bg-[#F4F5FD] px-5 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                
                
              </div>
              <h3 className="text-[13px] font-semibold text-slate-800">FintecConnect Desktop Console Build</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5 rounded-lg bg-slate-200/70 p-0.5" role="group" aria-label="Canvas mode">
                <button type="button" onClick={() => setEditMode(true)} aria-pressed={editMode} className={segBtn(editMode)}><Pencil className="h-2.5 w-2.5" /> Edit</button>
                <button type="button" onClick={() => setEditMode(false)} aria-pressed={!editMode} className={segBtn(!editMode)}><Eye className="h-2.5 w-2.5" /> Preview</button>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={loadStarter} aria-label="Starter layout" className={iconBtn}><Sparkles className="h-3.5 w-3.5 text-[#0040DF]" /></button>
                <button type="button" onClick={undo} disabled={history.length === 0} aria-label="Undo" className={iconBtn}><Undo2 className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => commit([])} disabled={canvasModules.length === 0} aria-label="Clear" className={iconBtn}><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:h-[760px] lg:grid-cols-[minmax(240px,24%)_minmax(0,1fr)_minmax(280px,28%)]">
            {/* LEFT */}
            <aside className="flex min-h-0 flex-col border-r border-[#E1E5F8] bg-[#EDEFFC]">
              <div className="space-y-4 px-4 pb-2 pt-5">
                <div>
                  <label htmlFor="product-type" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">Product Type</label>
                  <div className="relative">
                    <select id="product-type" value={appKind} onChange={(e) => setAppKind(e.target.value as AppKind)}
                      className="w-full cursor-pointer appearance-none rounded-lg bg-white px-3.5 py-2.5 pr-9 text-[12px] font-semibold text-slate-900 shadow-sm outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#0040DF]">
                      {APP_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden />
                  </div>
                </div>

                <button ref={styleBtnRef} type="button" onClick={() => setStyleOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={styleOpen}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#E2E6FA] px-3 py-2.5 text-left outline-none transition hover:bg-[#DADFF8] focus-visible:ring-2 focus-visible:ring-[#0040DF]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: accentColor }}><Palette className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">Style Guide</span><span className="block truncate text-[10px] text-slate-500">{brandName || 'Your brand'} · {accentName}</span></span>
                  <ArrowRight className="h-4 w-4 shrink-0" style={{ color: accentColor }} aria-hidden />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Pages</span>
                  <span className="text-[10px] text-slate-500">Tap +</span>
                </div>
              </div>

              <ul className="scrollbar-none m-0 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3" aria-label="Pages">
                {PAGES.map((p) => (
                  <PageMenuItem key={p.id} page={p.id} label={p.label} count={(pageModules[p.id] ?? []).length}
                    active={activePage === p.id} expanded={expandedPage === p.id} accent={accentColor}
                    canvasModules={canvasModules} thumbCtx={thumbCtx}
                    onSelect={() => selectPage(p.id)}
                    onToggleExpand={() => { if (expandedPage === p.id) setExpandedPage(null); else selectPage(p.id); }}
                    onAddModule={addModule} onRemoveModule={removeModule}
                    onStartDrag={startDrag} onEndDrag={endDrag} drag={drag}
                  />
                ))}
              </ul>
            </aside>

            {/* MIDDLE: desktop console preview */}
            <div className="relative flex min-h-0 flex-col bg-gradient-to-b from-[#EEF0FB] via-[#F6F7FE] to-[#EEF0FB] p-4">
              {styleOpen && <div className="absolute inset-0 z-20" onClick={closeStyle} aria-hidden />}
              {styleOpen && (
                <StylePopout
                  brandName={brandName} onBrandName={setBrandName}
                  accent={accentColor} onAccent={setAccentColor}
                  mode={interfaceMode} onMode={setInterfaceMode}
                  shape={buttonRadius} onShape={setButtonRadius}
                  density={density} onDensity={setDensity} onClose={closeStyle}
                />
              )}

              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" aria-hidden /> Live desktop console
              </p>

              {/* Browser chrome */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/5">
                <div className="flex items-center gap-3 bg-slate-950 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex flex-1 items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400">
                    <Lock className="h-2.5 w-2.5" /><span className="truncate">{brandName.toLowerCase().replace(/\s+/g, '')}.app/console</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">v2.4.0</div>
                </div>

                {/* App body */}
                <div className={`flex flex-1 overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
                  {/* sidebar */}
                  <div className={`w-40 shrink-0 border-r p-3 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
                    <div className="mb-4 flex items-center gap-2">
                      <div className={`grid h-7 w-7 place-items-center text-[11px] font-black text-white ${radius.icon}`} style={{ background: accentColor }}>{brandName.charAt(0) || 'F'}</div>
                      <span className="truncate text-[11px] font-extrabold tracking-tight">{brandName || 'Bank'}</span>
                    </div>
                    <nav className="space-y-0.5">
                      {PAGES.map((p) => {
                        const active = activePage === p.id;
                        return (
                          <button key={p.id} type="button" onClick={() => selectPage(p.id)}
                            className={`flex w-full items-center justify-between gap-1 px-2 py-1.5 text-left text-[10px] font-semibold transition ${radius.icon} ${active ? 'text-white' : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
                            style={active ? { background: accentColor } : undefined}>
                            <span className="truncate">{p.label.split(' ')[0]}</span>
                            {active && <ChevronRight className="h-3 w-3 shrink-0" />}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* main content */}
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <div className={`flex items-center justify-between gap-2 border-b px-4 py-2.5 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                      <div>
                        <p className="text-[11px] font-extrabold">{currentPage?.label}</p>
                        <p className="text-[9px] text-slate-400">{canvasModules.length} modules</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[9px] font-semibold ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                          <Search className="h-2.5 w-2.5" /> Search
                        </div>
                        <button className={`grid h-6 w-6 place-items-center rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}><Bell className="h-3 w-3" /></button>
                        <span className={`px-2 py-1 text-[9px] font-bold text-white ${radius.icon}`} style={{ background: accentColor }}>Admin</span>
                      </div>
                    </div>
                    <div ref={bodyRef} onDragOver={handleContainerDragOver} onDragLeave={handleContainerDragLeave} onDrop={handleDrop}
                      className={`flex-1 overflow-y-auto scrollbar-none ${density === 'compact' ? 'p-3' : 'p-4'}`}>
                      <PageCanvas {...canvasProps} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="min-h-[420px] min-w-0 border-l border-[#E1E5F8] lg:min-h-0">
              <CodePanel
                pageLabel={currentPage?.label ?? 'Page'}
                blurb={currentPage?.blurb ?? ''}
                modules={canvasModules}
                lang={codeLang} onLang={setCodeLang}
                accent={accentColor} brand={brandName} density={density}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button type="button" className="cursor-pointer rounded-md bg-[#0040DF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0040DF]/25 transition hover:bg-[#0036BD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0040DF] focus-visible:ring-offset-2">
            Continue Building Your App
          </button>
        </div>
      </div>
    </section>
  );
}