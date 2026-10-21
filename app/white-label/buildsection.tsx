'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outfit } from 'next/font/google';
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, Calendar, Check, ChevronsUpDown, Clock, Code2,
  Copy, CreditCard, Eye, EyeOff, FileText, Fingerprint, GripVertical, Landmark, Lock, Mail,
  Monitor, Moon, Palette, Pencil, Phone, Plus, QrCode, Receipt, RefreshCw, Send, ShieldCheck,
  Sliders, Smartphone, Sparkles, Sun, SunMoon, Trash2, Undo2, User, Users, Wifi, X, Zap,
  PenTool, Coffee, ArrowLeftRight,
} from 'lucide-react';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });
const INK = '#0F1729';
const NAVY = '#0B2E8F';

type Category =
  | 'signin' | 'dashboard' | 'accounts' | 'transfers' | 'send'
  | 'request' | 'cards' | 'ledger' | 'alerts' | 'profile' | 'onboarding';
type ModuleId =
  | 'loginScreen' | 'signInWithGoogle' | 'otpVerification' | 'biometricUnlock'
  | 'heroBalance' | 'activeCard' | 'quickTransfer' | 'savingsTargets' | 'earningsChannels' | 'activityFeed'
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
type CodeLang = 'swiftui' | 'typescript' | 'reactnative' | 'kotlin';
type Density = 'compact' | 'spacious';
type AppKind = 'banking' | 'fintech' | 'psp' | 'wallet' | 'crypto';

interface PageDef { id: string; label: string; blurb: string; kit: ModuleId[] }
interface ModuleAsset {
  id: ModuleId; title: string; subtitle: string; category: Category;
  badge: string; badgeColor: string; wide?: boolean;
  code: { swiftui: string; typescript: string; reactnative: string; kotlin: string };
}
interface SizeSpec { span: number; h: number | null }

const RADII: Record<RadiusMode, { card: string; tile: string; icon: string }> = {
  rounded: { card: 'rounded-[18px]', tile: 'rounded-xl', icon: 'rounded-lg' },
  sharp: { card: 'rounded-none', tile: 'rounded-none', icon: 'rounded-none' },
  pill: { card: 'rounded-[24px]', tile: 'rounded-[20px]', icon: 'rounded-full' },
};
type Radius = (typeof RADII)[RadiusMode];

const C = (swiftui: string, typescript: string, reactnative: string, kotlin: string) => ({ swiftui, typescript, reactnative, kotlin });

const availableModules: ModuleAsset[] = [
  { id: 'loginScreen', title: 'Login Screen', subtitle: 'Email, password & sign-in CTA', category: 'signin', badge: 'Auth', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', code: C(`LoginScreen(email: $email, password: $pw, onSignIn: auth.signIn)`, `<LoginScreen onSubmit={signIn} />`, `<LoginScreen onSignIn={auth.signIn} />`, `LoginScreen(onSubmit = auth::signIn)`) },
  { id: 'signInWithGoogle', title: 'Sign In with Google', subtitle: 'One-tap OAuth Google sign-in', category: 'signin', badge: 'Auth', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', code: C(`SignInWithGoogle(onSuccess: auth.googleSignIn)`, `<SignInWithGoogle onSuccess={handleGoogle} />`, `<SignInWithGoogle onSuccess={handleGoogle} />`, `SignInWithGoogle(onSuccess = auth::googleSignIn)`) },
  { id: 'otpVerification', title: 'OTP Verification', subtitle: '6-digit code entry & verify', category: 'signin', badge: 'Auth', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', code: C(`OTPVerification(length: 6, onVerify: auth.verifyOTP)`, `<OtpVerification onVerify={verify} />`, `<OtpVerification onVerify={verify} />`, `OtpVerification(onVerify = auth::verifyOTP)`) },
  { id: 'biometricUnlock', title: 'Biometric Unlock', subtitle: 'Face ID / fingerprint prompt', category: 'signin', badge: 'Auth', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', code: C(`BiometricUnlock(reason: "Unlock to proceed")`, `<BiometricUnlock onSuccess={unlock} />`, `<BiometricUnlock onSuccess={unlock} />`, `BiometricUnlock(onSuccess = ::unlock)`) },
  { id: 'heroBalance', title: 'Total Net Balance Hero', subtitle: 'Vault balance with inflow / outflow totals', category: 'dashboard', badge: 'Core', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', wide: true, code: C(`NetBalanceHero(total: 25000.40, inflow: 20000, outflow: 17000)`, `<NetBalanceHero total={25000.40} />`, `<NetBalanceHero total={25000.40} />`, `NetBalanceHero(total = 25000.4)`) },
  { id: 'activeCard', title: 'My Active Card', subtitle: 'Platinum card with freeze & details', category: 'cards', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`ActiveCardWidget(last4: "8824", tier: .platinum)`, `<ActiveCard last4="8824" />`, `<ActiveCard last4="8824" />`, `ActiveCard(last4 = "8824")`) },
  { id: 'quickTransfer', title: 'Quick Transfer', subtitle: 'Recipient shortcuts & send-now amount', category: 'send', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`QuickTransfer(contacts: contacts.recent, amount: 350)`, `<QuickTransfer amount={350} />`, `<QuickTransfer amount={350} />`, `QuickTransfer(amount = 350.0)`) },
  { id: 'savingsTargets', title: 'Savings Targets', subtitle: 'Goal progress with cleared state', category: 'dashboard', badge: 'Savings', badgeColor: 'bg-purple-50 text-purple-600 border border-purple-100', code: C(`SavingsTargets(goals: store.goals)`, `<SavingsTargets goals={goals} />`, `<SavingsTargets goals={goals} />`, `SavingsTargets(goals = store.goals)`) },
  { id: 'earningsChannels', title: 'Earnings Channels', subtitle: 'Income streams with live balances', category: 'dashboard', badge: 'Income', badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100', wide: true, code: C(`EarningsChannels(streams: store.streams)`, `<EarningsChannels streams={streams} />`, `<EarningsChannels streams={streams} />`, `EarningsChannels(streams = store.streams)`) },
  { id: 'activityFeed', title: 'Activity & Transactions', subtitle: 'Clearing records with income / expense filters', category: 'ledger', badge: 'Live', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', wide: true, code: C(`ActivityFeed(transactions: store.latest(3))`, `<ActivityFeed transactions={latest} />`, `<ActivityFeed transactions={latest} />`, `ActivityFeed(transactions = store.latest(3))`) },
  { id: 'accountsPortfolio', title: 'Accounts Portfolio', subtitle: 'Balance per account with actions', category: 'accounts', badge: 'Core', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: C(`AccountsPortfolio(accounts: store.accounts)`, `<AccountsPortfolio accounts={accounts} />`, `<AccountsPortfolio accounts={accounts} />`, `AccountsPortfolio(accounts = store.accounts)`) },
  { id: 'routingWire', title: 'Routing & Wire Data', subtitle: 'SWIFT, IBAN & routing numbers', category: 'accounts', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: C(`RoutingWireCard(account: primary)`, `<RoutingWireCard account={primary} />`, `<RoutingWireCard account={primary} />`, `RoutingWireCard(account = primary)`) },
  { id: 'monthlyAuditFile', title: 'Monthly Audit File', subtitle: 'Downloadable statements', category: 'accounts', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: C(`MonthlyAuditFile(month: .oct2024, format: .csv)`, `<MonthlyAuditFile month="2024-10" />`, `<MonthlyAuditFile month="2024-10" />`, `MonthlyAuditFile(month = Month.OCT_2024)`) },
  { id: 'directTransferEngine', title: 'Direct Transfer Engine', subtitle: 'From/To, amount, continue', category: 'transfers', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`DirectTransfer(from: .checking, to: .savings, amount: 500)`, `<DirectTransfer from="checking" to="savings" amount={500} />`, `<DirectTransfer from="checking" to="savings" amount={500} />`, `DirectTransfer(from = CHECKING, to = SAVINGS, amount = 500.0)`) },
  { id: 'multiMarketFX', title: 'Multi-Market FX Swap', subtitle: 'Live rate & conversion', category: 'transfers', badge: 'FX', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: C(`MultiMarketFX(from: .usd, to: .eur, amount: 1000)`, `<MultiMarketFX from="USD" to="EUR" amount={1000} />`, `<MultiMarketFX from="USD" to="EUR" amount={1000} />`, `MultiMarketFX(from = USD, to = EUR, amount = 1000.0)`) },
  { id: 'recurringStanding', title: 'Recurring Standing Order', subtitle: 'Monthly schedule & next run', category: 'transfers', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`RecurringStanding(nextRun: "Nov 1 2024", amount: 220)`, `<RecurringStanding nextRun="2024-11-01" amount={220} />`, `<RecurringStanding nextRun="2024-11-01" amount={220} />`, `RecurringStanding(nextRun = date(2024,11,1), amount = 220.0)`) },
  { id: 'authorizationModal', title: 'Authorization Modal', subtitle: 'Payment review & authorize', category: 'transfers', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`AuthorizationModal(amount: 500, fee: 0)`, `<AuthorizationModal amount={500} fee={0} />`, `<AuthorizationModal amount={500} fee={0} />`, `AuthorizationModal(amount = 500.0, fee = 0.0)`) },
  { id: 'recentRecipients', title: 'Recent Recipients', subtitle: 'Quick-pick saved contacts', category: 'send', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`RecentRecipients(contacts: contacts.recent)`, `<RecentRecipients contacts={recent} />`, `<RecentRecipients contacts={recent} />`, `RecentRecipients(contacts = contacts.recent)`) },
  { id: 'beneficiaryValidation', title: 'Beneficiary Validation', subtitle: 'Auto-detected bank & branch', category: 'send', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`BeneficiaryValidation(onDetect: bank::resolve)`, `<BeneficiaryValidation onDetect={resolveBank} />`, `<BeneficiaryValidation onDetect={resolveBank} />`, `BeneficiaryValidation(onDetect = bank::resolve)`) },
  { id: 'sendMoneyInvoice', title: 'Send Money Invoice', subtitle: 'Amount, note, request button', category: 'send', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`SendMoneyInvoice(amount: 20, note: "Dinner & drinks")`, `<SendMoneyInvoice amount={20} note="Dinner" />`, `<SendMoneyInvoice amount={20} note="Dinner" />`, `SendMoneyInvoice(amount = 20.0, note = "Dinner")`) },
  { id: 'transferDispatched', title: 'Transfer Dispatched', subtitle: 'Confirmation with receipt ID', category: 'send', badge: 'Live', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: C(`TransferDispatched(receiptId: "TXN-8192", amount: 20)`, `<TransferDispatched receiptId="TXN-8192" amount={20} />`, `<TransferDispatched receiptId="TXN-8192" amount={20} />`, `TransferDispatched(receiptId = "TXN-8192", amount = 20.0)`) },
  { id: 'peerInvoicing', title: 'Peer Invoicing', subtitle: 'Create invoice with due date', category: 'request', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`PeerInvoicing(amount: 75, due: "Nov 7")`, `<PeerInvoicing amount={75} due="2024-11-07" />`, `<PeerInvoicing amount={75} due="2024-11-07" />`, `PeerInvoicing(amount = 75.0, due = date(2024,11,7))`) },
  { id: 'qrPaymentRequest', title: 'QR Payment Request', subtitle: 'Scan-to-pay QR code', category: 'request', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`QRPaymentRequest(handle: "@alexrivers")`, `<QRPaymentRequest handle="@alexrivers" />`, `<QRPaymentRequest handle="@alexrivers" />`, `QRPaymentRequest(handle = "@alexrivers")`) },
  { id: 'splitPayment', title: 'Split Payment', subtitle: 'Divide across recipients', category: 'request', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`SplitPayment(total: 120, shares: [60, 40, 20])`, `<SplitPayment total={120} shares={[60,40,20]} />`, `<SplitPayment total={120} shares={[60,40,20]} />`, `SplitPayment(total = 120.0, shares = listOf(60.0,40.0,20.0))`) },
  { id: 'outstandingReceivables', title: 'Outstanding Receivables', subtitle: 'Pending invoice tracker', category: 'request', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: C(`OutstandingReceivables(items: store.pending)`, `<OutstandingReceivables items={pending} />`, `<OutstandingReceivables items={pending} />`, `OutstandingReceivables(items = store.pending)`) },
  { id: 'virtualDebitCard', title: 'Virtual Debit Card', subtitle: 'Frozen/active debit card', category: 'cards', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', wide: true, code: C(`VirtualDebitCard(last4: "7104", frozen: state.frozen)`, `<VirtualDebitCard last4="7104" frozen={frozen} />`, `<VirtualDebitCard last4="7104" frozen={frozen} />`, `VirtualDebitCard(last4 = "7104", frozen = state.frozen)`) },
  { id: 'securityDashboard', title: 'Card Security Dashboard', subtitle: 'Freeze, disable, swipe', category: 'cards', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`CardSecurity(frozen: $state.frozen, blocked: $state.blocked)`, `<CardSecurity state={state} onChange={setState} />`, `<CardSecurity state={state} onChange={setState} />`, `CardSecurity(state = state, onChange = ::updateState)`) },
  { id: 'pinVault', title: 'PIN Vault', subtitle: 'View or change PIN', category: 'cards', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`PinVault(onView: pin::reveal, onChange: pin::change)`, `<PinVault onView={revealPin} onChange={changePin} />`, `<PinVault onView={revealPin} onChange={changePin} />`, `PinVault(onView = pin::reveal, onChange = pin::change)`) },
  { id: 'auditLedgerActivity', title: 'Audit Ledger Activity', subtitle: 'Full transaction history', category: 'ledger', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', wide: true, code: C(`AuditLedger(transactions: store.all, filters: filters)`, `<AuditLedger transactions={all} filters={filters} />`, `<AuditLedger transactions={all} filters={filters} />`, `AuditLedger(transactions = store.all, filters = filters)`) },
  { id: 'alertCenter', title: 'Alert Center', subtitle: 'Inbox of alerts', category: 'alerts', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: C(`AlertCenter(items: store.alerts)`, `<AlertCenter items={alerts} />`, `<AlertCenter items={alerts} />`, `AlertCenter(items = store.alerts)`) },
  { id: 'preferencesDeliveryChannels', title: 'Delivery Channels', subtitle: 'Notification preferences', category: 'alerts', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: C(`DeliveryChannels(push: $prefs.push, email: $prefs.email)`, `<DeliveryChannels prefs={prefs} onChange={setPrefs} />`, `<DeliveryChannels prefs={prefs} onChange={setPrefs} />`, `DeliveryChannels(prefs = prefs, onChange = ::updatePrefs)`) },
  { id: 'identityCard', title: 'Identity Card', subtitle: 'Avatar, KYC level & tier', category: 'profile', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: C(`IdentityCard(user: auth.current)`, `<IdentityCard user={user} />`, `<IdentityCard user={user} />`, `IdentityCard(user = auth.current)`) },
  { id: 'securityBaseline', title: 'Security Baseline', subtitle: 'Password, biometric, authenticity', category: 'profile', badge: 'Shield', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`SecurityBaseline(password: $state.pw, faceId: $state.faceId)`, `<SecurityBaseline state={state} onChange={setState} />`, `<SecurityBaseline state={state} onChange={setState} />`, `SecurityBaseline(state = state, onChange = ::updateState)`) },
  { id: 'activeSessions', title: 'Active Sessions', subtitle: 'Devices signed in', category: 'profile', badge: 'Shield', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: C(`ActiveSessions(sessions: store.sessions)`, `<ActiveSessions sessions={sessions} />`, `<ActiveSessions sessions={sessions} />`, `ActiveSessions(sessions = store.sessions)`) },
  { id: 'brandOnboarding', title: 'Brand Onboarding', subtitle: 'Dark launch screen', category: 'onboarding', badge: 'Brand', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', wide: true, code: C(`BrandOnboarding(brand: "Apex Bank")`, `<BrandOnboarding brand="Apex Bank" />`, `<BrandOnboarding brand="Apex Bank" />`, `BrandOnboarding(brand = "Apex Bank")`) },
  { id: 'welcomeHero', title: 'Welcome Hero', subtitle: 'Zero-fee banking CTA', category: 'onboarding', badge: 'Brand', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', code: C(`WelcomeHero(onGetStarted: goNext)`, `<WelcomeHero onNext={goNext} />`, `<WelcomeHero onNext={goNext} />`, `WelcomeHero(onNext = ::goNext)`) },
  { id: 'stepCarousel', title: 'Step Carousel', subtitle: 'Onboarding progress', category: 'onboarding', badge: 'Brand', badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200', code: C(`StepCarousel(current: 1, total: 3)`, `<StepCarousel current={1} total={3} />`, `<StepCarousel current={1} total={3} />`, `StepCarousel(current = 1, total = 3)`) },
];

const APP_KINDS: { id: AppKind; label: string }[] = [
  { id: 'banking', label: 'Banking app' },
  { id: 'fintech', label: 'Fintech app' },
  { id: 'psp', label: 'Payment service provider' },
  { id: 'wallet', label: 'Digital wallet' },
  { id: 'crypto', label: 'Crypto exchange' },
];

const INITIAL_PAGES: PageDef[] = [
  { id: 'signin', label: 'Sign In', blurb: 'Auth, OTP verification and biometric unlock', kit: ['loginScreen', 'signInWithGoogle', 'otpVerification', 'biometricUnlock'] },
  { id: 'home', label: 'Home', blurb: 'Quick access to all the functionality and an overview of your account', kit: ['heroBalance', 'activeCard', 'earningsChannels', 'quickTransfer', 'activityFeed', 'savingsTargets'] },
  { id: 'accounts', label: 'Accounts', blurb: 'Accounts, routing and statement files', kit: ['accountsPortfolio', 'routingWire', 'monthlyAuditFile'] },
  { id: 'transfers', label: 'Transfers', blurb: 'Direct transfers, FX swaps, standing orders', kit: ['directTransferEngine', 'multiMarketFX', 'recurringStanding', 'authorizationModal'] },
  { id: 'send', label: 'Send', blurb: 'Recipients, validation, invoice and receipt', kit: ['recentRecipients', 'beneficiaryValidation', 'sendMoneyInvoice', 'transferDispatched'] },
  { id: 'request', label: 'Request', blurb: 'Invoicing, QR, splitting and receivables', kit: ['peerInvoicing', 'qrPaymentRequest', 'splitPayment', 'outstandingReceivables'] },
  { id: 'cards', label: 'Cards', blurb: 'Virtual debit, security controls and PIN vault', kit: ['virtualDebitCard', 'securityDashboard', 'pinVault'] },
  { id: 'history', label: 'Transaction history', blurb: 'Full-filterable ledger of all activity', kit: ['auditLedgerActivity', 'monthlyAuditFile'] },
  { id: 'notifications', label: 'Notifications', blurb: 'Alert center and channel preferences', kit: ['alertCenter', 'preferencesDeliveryChannels'] },
  { id: 'profile', label: 'Profile and security', blurb: 'Identity, security baseline and sessions', kit: ['identityCard', 'securityBaseline', 'activeSessions'] },
  { id: 'splash', label: 'Splash Screens', blurb: 'Launch, hero and progress carousel', kit: ['brandOnboarding', 'welcomeHero', 'stepCarousel'] },
];

const HISTORY_LIMIT = 20;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const moduleFor = (id: ModuleId) => availableModules.find((m) => m.id === id);
const surface = (dark: boolean) =>
  dark ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5' : 'bg-white text-slate-900 shadow-[0_4px_18px_rgba(37,52,120,0.06)]';
const ringVar = (color: string) => ({ ['--tw-ring-color' as string]: color } as React.CSSProperties);

/* ------------------------ accent color math helpers ----------------------- */
function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
// t = 0 → a, t = 1 → b
function mixColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a); const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}
const darken = (hex: string, t: number) => mixColor(hex, '#000000', t);

interface ViewCtx { radius: Radius; accent: string; isDark: boolean; brand: string; interactive: boolean }

function Switch({ checked, onChange, label, accent, interactive = true }: { checked: boolean; onChange: () => void; label: string; accent: string; interactive?: boolean }) {
  const track = (
    <span className={`relative inline-block h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${checked ? '' : 'bg-slate-300'}`} style={checked ? { background: accent } : undefined}>
      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </span>
  );
  if (!interactive) return track;
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} style={ringVar(accent)} className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">{track}</button>
  );
}

/* ------------------------------ catalog cards ------------------------------ */
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
        <button type="button" className="flex w-full items-center justify-center gap-1 py-2 text-[10px] font-semibold text-slate-500"><Fingerprint className="h-3 w-3" /> Quick sign-in with Face ID</button>
      </div>
    </div>
  );
}

function SignInWithGoogleCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-6`}>
      <div className="flex items-center gap-2.5">
        <span className={`grid h-10 w-10 place-items-center bg-white ring-1 ring-slate-200 ${ctx.radius.icon}`}>
          <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.5 29.3 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11.3 0 20.5-9.2 20.5-20.5 0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M5.3 14.7l6.6 4.8C13.6 15.1 18.4 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.5 29.3 3.5 24 3.5c-7.4 0-13.8 4.1-17.1 10.2z" />
            <path fill="#4CAF50" d="M24 44.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.8 40.1 16.3 44.5 24 44.5z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.2C42.2 35.6 44.5 30.2 44.5 24c0-1.3-.1-2.6-.9-3.9z" />
          </svg>
        </span>
        <div><p className="text-[13px] font-bold">Sign in with Google</p><p className="text-[10px] text-slate-400">Use your Google account to continue</p></div>
      </div>
      <button
        type="button"
        className={`mt-4 flex w-full items-center justify-center gap-2 border py-2.5 text-[11px] font-semibold transition ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
      >
        <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.5 29.3 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11.3 0 20.5-9.2 20.5-20.5 0-1.3-.1-2.6-.4-3.9z" />
          <path fill="#FF3D00" d="M5.3 14.7l6.6 4.8C13.6 15.1 18.4 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.5 29.3 3.5 24 3.5c-7.4 0-13.8 4.1-17.1 10.2z" />
          <path fill="#4CAF50" d="M24 44.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.8 40.1 16.3 44.5 24 44.5z" />
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.2C42.2 35.6 44.5 30.2 44.5 24c0-1.3-.1-2.6-.9-3.9z" />
        </svg>
        Continue with Google
      </button>
      <p className="mt-3 text-center text-[9px] leading-snug text-slate-400">Google will share your name and email address. By continuing you agree to the terms of service.</p>
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
          <div key={i} className={`grid h-10 w-9 place-items-center border text-[15px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'} ${i <= 3 ? '' : 'text-slate-300'}`} style={i <= 3 ? { borderColor: ctx.accent } : undefined}>
            {i <= 3 ? '•' : ''}
          </div>
        ))}
      </div>
      <button type="button" className={`mt-4 w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Verify & continue</button>
      <p className="mt-2 text-center text-[10px] text-slate-400">Resend in 02:45</p>
    </div>
  );
}
function BiometricUnlockCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} flex flex-col items-center p-6 text-center`}>
      <div className={`grid h-16 w-16 place-items-center text-white ${ctx.radius.icon}`} style={{ background: darken(ctx.accent, 0.55) }}><Fingerprint className="h-7 w-7" /></div>
      <p className="mt-3 text-[13px] font-bold">Unlock with Face ID</p>
      <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Hold up your device to securely access your savings and investments.</p>
      <div className="mt-4 flex w-full flex-col gap-1.5">
        <button type="button" className={`w-full px-6 py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Use PIN / passcode instead</button>
        <button type="button" className="w-full py-1 text-[10px] font-semibold text-slate-500">Sign out of all accounts</button>
      </div>
    </div>
  );
}

/* Total Net Balance Hero — accent-driven gradient */
function HeroBalanceCard({ ctx }: { ctx: ViewCtx }) {
  const gradient = `linear-gradient(120deg, ${darken(ctx.accent, 0.72)} 0%, ${darken(ctx.accent, 0.12)} 55%, ${ctx.accent} 100%)`;
  return (
    <div className={`relative flex h-full min-h-[240px] flex-col overflow-hidden p-6 text-white ${ctx.radius.card}`} style={{ background: gradient }}>
      <svg aria-hidden viewBox="0 0 600 240" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0,168 C130,110 250,208 380,148 C470,106 540,150 600,118" fill="none" stroke="#F5B921" strokeOpacity="0.75" strokeWidth="26" strokeLinecap="round" />
        <path d="M0,196 C150,140 260,232 400,170 C490,130 550,176 600,150" fill="none" stroke="#3B82F6" strokeOpacity="0.9" strokeWidth="34" strokeLinecap="round" />
        <path d="M0,150 C120,96 260,190 390,132 C480,92 545,136 600,104" fill="none" stroke="#93C5FD" strokeOpacity="0.5" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60"><span className="h-1.5 w-1.5 rounded-full bg-white/60" /> Total Net Balance</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">+4.4% vs last month</span>
      </div>
      <div className="relative mt-3">
        <p className="text-[34px] font-bold leading-none tracking-tight">$25,000<span className="text-[18px] text-white/70">.40</span></p>
        <p className="mt-1.5 text-[10px] text-white/50">Active Vault • Obsidian Tier Account</p>
      </div>
      <div className="relative mt-auto flex items-end justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10"><ArrowDownLeft className="h-3.5 w-3.5 text-emerald-300" /></span>
            <div><p className="text-[8px] uppercase tracking-wider text-white/50">Inflow Total</p><p className="text-[12px] font-bold">+$20,000.00</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10"><ArrowUpRight className="h-3.5 w-3.5 text-rose-300" /></span>
            <div><p className="text-[8px] uppercase tracking-wider text-white/50">Outflow Total</p><p className="text-[12px] font-bold">-$17,000.00</p></div>
          </div>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-bold text-slate-900 shadow-lg">
          My Wallet <span className="grid h-4 w-4 place-items-center rounded-full text-white" style={{ background: darken(ctx.accent, 0.4) }}><ArrowRight className="h-2.5 w-2.5" /></span>
        </button>
      </div>
    </div>
  );
}

/* My Active Card — "OK PRIVATE" card follows the accent */
function ActiveCardWidget({ ctx }: { ctx: ViewCtx }) {
  const cardGradient = `linear-gradient(135deg, ${darken(ctx.accent, 0.55)} 0%, ${darken(ctx.accent, 0.78)} 55%, ${darken(ctx.accent, 0.45)} 100%)`;
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold">My Active Card</p>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">Platinum</span>
      </div>
      <div className={`mt-3 relative overflow-hidden p-4 text-white ${ctx.radius.tile}`} style={{ background: cardGradient }}>
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-extrabold tracking-wider">OK PRIVATE</span>
          <Wifi className="h-4 w-4 rotate-90 opacity-70" />
        </div>
        <div className="mt-4 h-6 w-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500" />
        <p className="mt-3 font-mono text-[13px] tracking-[0.2em]">•••• 8824</p>
        <div className="mt-3 flex items-end justify-between text-[8px] opacity-80">
          <span>KRISHNAN A.</span><span>EXP 08/29</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-500">
        <button type="button" className="flex cursor-pointer items-center gap-1 hover:text-slate-800"><Lock className="h-3 w-3" /> Freeze Card</button>
        <button type="button" className="flex cursor-pointer items-center gap-1 hover:text-slate-800"><Eye className="h-3 w-3" /> View Details</button>
      </div>
    </div>
  );
}

function QuickTransferCard({ ctx }: { ctx: ViewCtx }) {
  const people = [
    { init: 'SJ', name: 'Sarah J.', active: true },
    { init: 'AR', name: 'Alex R.', active: false },
    { init: 'DC', name: 'David C.', active: false },
    { init: 'MP', name: 'Maya P.', active: false },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold">Quick Transfer</p>
        <Users className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button type="button" className={`flex flex-col items-center gap-1 ${ctx.radius.icon}`}>
          <span className={`grid h-9 w-9 place-items-center border border-dashed border-slate-300 text-slate-400 ${ctx.radius.icon}`}><Plus className="h-3.5 w-3.5" /></span>
          <span className="text-[8px] font-medium text-slate-400">Add</span>
        </button>
        {people.map((p) => (
          <div key={p.init} className="flex flex-col items-center gap-1">
            <span className={`grid h-9 w-9 place-items-center text-[10px] font-bold ${ctx.radius.icon}`} style={{ background: p.active ? ctx.accent : `${ctx.accent}22`, color: p.active ? '#fff' : ctx.accent }}>{p.init}</span>
            <span className="text-[8px] font-medium text-slate-500">{p.name.split(' ')[0]} {p.name.charAt(p.name.length - 1)}.</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className={`flex-1 px-3 py-2 text-[12px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>$ 350.00</div>
        <button type="button" className={`flex items-center gap-1 px-3 py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>
          Send Now <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function SavingsTargetsCard({ ctx }: { ctx: ViewCtx }) {
  const goals = [
    { name: 'iPhone 13 Mini', pct: 100, amt: '$699', left: 'Saved $699 of $699', right: 'Target Cleared', Icon: Smartphone },
    { name: 'MacBook Pro M1', pct: 75, amt: '$1,499', left: 'Saved $1,499 of $2,000', right: '$501 remaining', Icon: Monitor },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold">Savings Targets</p>
        <button type="button" className="grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-500"><Plus className="h-3 w-3" /></button>
      </div>
      <div className="mt-3 space-y-2.5">
        {goals.map((g) => (
          <div key={g.name} className={`p-3 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`grid h-7 w-7 place-items-center bg-white text-slate-500 ${ctx.radius.icon}`}><g.Icon className="h-3.5 w-3.5" /></span>
                <div><p className="text-[10px] font-bold">{g.name}</p><p className="text-[8px] text-slate-400">{g.pct}% {g.pct === 100 ? 'Reached' : 'of Target'}</p></div>
              </div>
              <span className="text-[11px] font-bold">{g.amt}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: ctx.accent }} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[8px] font-semibold">
              <span className="text-slate-400">{g.left}</span>
              <span style={{ color: ctx.accent }}>{g.right}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Earnings Channels — three income streams derived from the accent */
function EarningsChannelsCard({ ctx }: { ctx: ViewCtx }) {
  const streams = [
    { init: 'U', name: 'Upwork Escrow', amt: '$3,000.00', tag: '8 Contracts', from: darken(ctx.accent, 0.35), to: darken(ctx.accent, 0.05) },
    { init: 'F', name: 'Freepik Contributor', amt: '$3,000.00', tag: 'Monthly Fee', from: darken(ctx.accent, 0.18), to: ctx.accent },
    { init: 'E', name: 'Envato Market', amt: '$2,000.00', tag: 'Royalties', from: ctx.accent, to: darken(ctx.accent, 0.25) },
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2.5 flex items-center justify-between px-2.5">
        <p className="text-[12px] font-bold">Earnings Channels</p>
        <button type="button" className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Manage Streams</button>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-3">
        {streams.map((s) => (
          <div key={s.name} className={`relative flex flex-col justify-between overflow-hidden p-4 text-white ${ctx.radius.card}`} style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}>
            <div className="flex items-start justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-[11px] font-bold">{s.init}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-bold">{s.tag}</span>
            </div>
            <div className="mt-6">
              <p className="text-[9px] text-white/70">{s.name}</p>
              <p className="mt-0.5 text-[18px] font-bold tracking-tight">{s.amt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeedCard({ ctx }: { ctx: ViewCtx }) {
  const [tab, setTab] = useState<'all' | 'in' | 'out'>('all');
  const rows = [
    { name: 'Apple Flagship Store', sub: 'Card • 8824 • Today, 10:42 AM', tag: 'Electronics', amt: -149.0, Icon: CreditCard, tone: 'bg-slate-100 text-slate-600' },
    { name: 'Figma Design Payout', sub: 'Direct Deposit • Yesterday', tag: 'Settled', amt: 1250.0, Icon: PenTool, tone: 'bg-indigo-50 text-indigo-600' },
    { name: 'Blue Bottle Coffee', sub: 'Contactless Pay • Oct 22, 09:15 AM', tag: 'Dining', amt: -8.4, Icon: Coffee, tone: 'bg-amber-50 text-amber-600' },
  ];
  const shown = rows.filter((r) => tab === 'all' || (tab === 'in' ? r.amt > 0 : r.amt < 0));
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold">Activity & Transactions</p>
          <p className="mt-0.5 text-[9px] text-slate-400">Live clearing records for all connected cards and payouts</p>
        </div>
        <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {([['all', 'All'], ['in', 'Income'], ['out', 'Expenses']] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`cursor-pointer rounded-md px-2.5 py-1 text-[9px] font-bold transition ${tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {shown.map((r) => (
          <div key={r.name} className={`flex items-center justify-between gap-3 p-2.5 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50/60'}`}>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className={`grid h-9 w-9 shrink-0 place-items-center ${ctx.radius.icon} ${r.tone}`}><r.Icon className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold">{r.name}</p>
                <p className="truncate text-[9px] text-slate-400">{r.sub}{r.tag === 'Settled' && <span className="ml-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">Settled</span>}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-[11px] font-bold ${r.amt > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{r.amt > 0 ? '+' : '-'}{usd(Math.abs(r.amt))}</p>
              <p className="text-[8px] text-slate-400">{r.tag}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold" style={{ color: ctx.accent }}>View All 42 Transactions</p>
    </div>
  );
}

function AccountsPortfolioCard({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    { name: 'Everyday Checking', code: 'USD', amt: 12480.2 },
    { name: 'High-Yield Savings', code: 'USD', amt: 8920.0 },
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
      <p className="text-[12px] font-bold">Routing & wire data</p>
      <div className="mt-3 space-y-2 text-[11px]">
        {[['Account holder', 'Alex Rivers Holdings LLC'], ['Account number', '••••••1027'], ['SWIFT / BIC', 'APX BUS 33 884'], ['IBAN', 'GB29 APX 8842 1027 3398 22']].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3"><span className="text-slate-400">{k}</span><span className="truncate font-medium">{v}</span></div>
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
      <button type="button" className={`mt-3 w-full py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Download PDF & CSV</button>
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
        <div className="flex justify-center"><div className={`grid h-6 w-6 place-items-center border border-blue-100 bg-blue-50 text-blue-600 ${ctx.radius.icon}`}><RefreshCw className="h-3 w-3" /></div></div>
        <div className={`flex items-center justify-between px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><span className="text-[11px] font-semibold">921.40</span><span className="rounded-md bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-600">EUR</span></div>
      </div>
      <button type="button" className={`mt-3 w-full py-2 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: ctx.accent }}>Lock rate & exchange</button>
    </div>
  );
}
function RecurringStandingCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Recurring standing order</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">Active</span></div>
      <div className="mt-3 flex items-center gap-2.5">
        <span className={`grid h-9 w-9 place-items-center text-white ${ctx.radius.icon}`} style={{ background: darken(ctx.accent, 0.4) }}><Calendar className="h-4 w-4" /></span>
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
      <div className={`mt-3 px-3 py-2 text-[10px] ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>Dinner & drinks</div>
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
      <div className={`mx-auto grid h-12 w-12 place-items-center bg-emerald-50 text-emerald-600 ${ctx.radius.icon}`}><Check className="h-5 w-5" /></div>
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
      <div className={`mt-3 grid h-28 w-28 place-items-center bg-white ring-2 ${ctx.radius.icon}`} style={{ '--tw-ring-color': ctx.accent } as React.CSSProperties}>
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
        {([['You (paid)', 60.0], ['Michael Henderson', 40.0], ['Jessica Taylor', 20.0]] as const).map(([n, v]) => (
          <div key={n} className={`flex items-center justify-between px-3 py-1.5 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <span className="font-medium">{n}</span>
            <span className={`font-bold ${v > 0 && n !== 'You (paid)' ? 'text-emerald-600' : ''}`}>{usd(v)}</span>
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

/* Virtual Debit Card — already follows the accent */
function VirtualDebitCardCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} p-5 text-white`} style={{ background: `linear-gradient(135deg, ${ctx.accent} 0%, ${darken(ctx.accent, 0.45)} 60%, ${darken(ctx.accent, 0.7)} 100%)` }}>
      <div className="flex items-center justify-between"><span className="text-[10px] font-extrabold tracking-wider">VIRTUAL DEBIT</span><CreditCard className="h-5 w-5 opacity-80" /></div>
      <p className="mt-6 text-[10px] text-white/60">Frozen Block</p>
      <p className="mt-1 font-mono text-[14px] tracking-widest">4892 •••• •••• 7104</p>
      <div className="mt-3 flex items-end justify-between text-[9px] opacity-90"><span>ALEX RIVERS</span><span>09/28</span></div>
      <div className="mt-4 flex gap-2"><button type="button" className="flex-1 rounded-lg bg-white/15 py-1.5 text-[10px] font-bold">Add to Apple Wallet</button></div>
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
        {([['Freeze card', frozen, setFrozen], ['Online payments', online, setOnline], ['Contactless NFC', nfc, setNfc]] as const).map(([label, on, set]) => (
          <div key={label} className="flex items-center justify-between">
            <span>{label}</span>
            <Switch checked={on} onChange={() => set(!on)} label={label} accent={ctx.accent} />
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
              <span className="w-12 text-center text-[9px] font-semibold uppercase text-slate-400">{r.d}</span>
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
            <Switch checked={on} onChange={() => set(!on)} label={label} accent={ctx.accent} />
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
    { name: 'iPhone 14 Pro', sub: 'Mexico City, MX · Current', Icon: Smartphone },
    { name: 'MacBook Pro 16"', sub: 'Mexico City, MX · 2 hrs ago', Icon: Monitor },
    { name: 'iPad Air', sub: 'Cancún, MX · 3 days ago', Icon: Smartphone },
  ];
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className="flex items-center justify-between"><p className="text-[12px] font-bold">Active sessions</p><button className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Sign out all</button></div>
      <div className="mt-3 space-y-1.5 text-[11px]">
        {sessions.map((s) => (
          <div key={s.name} className={`flex items-center justify-between px-3 py-2 ${ctx.radius.tile} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2"><s.Icon className="h-3.5 w-3.5 text-slate-400" /><div><p className="font-semibold">{s.name}</p><p className="text-[9px] text-slate-400">{s.sub}</p></div></div>
            <button className="text-[10px] font-semibold text-rose-500">Revoke</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Brand Onboarding — accent-driven launch gradient */
function BrandOnboardingCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} relative flex h-[220px] flex-col items-center justify-center overflow-hidden p-6 text-center`} style={{ background: `linear-gradient(135deg, ${darken(ctx.accent, 0.85)} 0%, ${ctx.accent} 100%)` }}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 opacity-40" style={{ background: `radial-gradient(circle at 50% 100%, ${ctx.accent} 0%, transparent 70%)` }} />
      <div className="relative">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20"><Landmark className="h-7 w-7" /></div>
        <p className="mt-4 text-[15px] font-black tracking-wide text-white">{ctx.brand || 'Apex Bank'}</p>
        <p className="mt-1 text-[10px] text-white/60">Elevate · Connect · Grow</p>
      </div>
    </div>
  );
}

function WelcomeHeroCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`${ctx.radius.card} ${surface(ctx.isDark)} p-5`}>
      <div className={`grid h-10 w-10 place-items-center bg-emerald-50 text-emerald-600 ${ctx.radius.icon}`}><Zap className="h-4 w-4" /></div>
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
      <div className={`grid h-12 w-12 place-items-center text-white ${ctx.radius.icon}`} style={{ background: darken(ctx.accent, 0.45) }}><Landmark className="h-5 w-5" /></div>
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
    case 'signInWithGoogle': return <SignInWithGoogleCard ctx={ctx} />;
    case 'otpVerification': return <OtpVerificationCard ctx={ctx} />;
    case 'biometricUnlock': return <BiometricUnlockCard ctx={ctx} />;
    case 'heroBalance': return <HeroBalanceCard ctx={ctx} />;
    case 'activeCard': return <ActiveCardWidget ctx={ctx} />;
    case 'quickTransfer': return <QuickTransferCard ctx={ctx} />;
    case 'savingsTargets': return <SavingsTargetsCard ctx={ctx} />;
    case 'earningsChannels': return <EarningsChannelsCard ctx={ctx} />;
    case 'activityFeed': return <ActivityFeedCard ctx={ctx} />;
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

/* --------------------------------- small UI -------------------------------- */
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

/* ------------------------------- page menu row ------------------------------ */
function PageMenuItem(props: {
  page: PageDef; count: number; active: boolean; expanded: boolean; accent: string;
  canvasModules: ModuleId[]; thumbCtx: ViewCtx; drag: ModuleId | null;
  onSelect: () => void; onToggleExpand: () => void;
  onAddModule: (id: ModuleId) => void; onRemoveModule: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId) => void; onEndDrag: () => void;
  onRename?: (id: string, label: string) => void;
}) {
  const { page, count, active, expanded, accent, canvasModules, thumbCtx, drag, onSelect, onToggleExpand, onAddModule, onRemoveModule, onStartDrag, onEndDrag, onRename } = props;
  const isCustom = page.id.startsWith('custom-');
  // Custom pages expose every available module so anything from any other
  // screen can be dragged in. Kit-based pages only list their own kit.
  const components = isCustom ? availableModules : availableModules.filter(m => page.kit.includes(m.id));

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(page.label);

  const startRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameValue(page.label);
    setIsRenaming(true);
  };
  const finishRename = () => {
    const v = renameValue.trim();
    if (v && v !== page.label && onRename) onRename(page.id, v);
    setIsRenaming(false);
  };

  return (
    <li className={`list-none rounded-lg ${active ? 'bg-blue-100/70 ring-1 ring-blue-200' : ''}`}>
      <div className={`flex items-center justify-between rounded-lg px-2 py-2 ${active ? '' : 'hover:bg-white/70'}`}>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <GripVertical className="h-3 w-3 shrink-0 text-slate-300" aria-hidden />
          {isRenaming ? (
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={finishRename}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); finishRename(); } if (e.key === 'Escape') setIsRenaming(false); }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 rounded border border-blue-400 bg-white px-1 py-0.5 text-[11px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <button type="button" onClick={onSelect} className={`min-w-0 flex-1 cursor-pointer truncate text-left text-[11px] font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>
              {page.label}
            </button>
          )}
          {isCustom && !isRenaming && (
            <button type="button" onClick={startRename} aria-label="Rename page" title="Rename page"
              className="grid h-4 w-4 shrink-0 cursor-pointer place-items-center rounded text-slate-400 transition hover:bg-white hover:text-slate-700">
              <Pencil className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
        <span className={`ml-1.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${active ? 'bg-blue-600 text-white' : 'bg-slate-200/80 text-slate-500'}`}>{count} comps</span>
        <button type="button" onClick={onToggleExpand} aria-label={`Components for ${page.label}`} aria-expanded={expanded}
          style={expanded ? { color: accent, background: `${accent}14` } : undefined}
          className="ml-1 grid h-4 w-4 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-blue-600">
          {expanded ? <X className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
        </button>
      </div>
      {expanded && (
        <div className="mx-1.5 mb-1.5 max-h-[360px] space-y-1.5 overflow-y-auto rounded-lg border border-slate-100 bg-white p-1.5 shadow-inner scrollbar-none">
          {isCustom && (
            <p className="px-1 pb-1 text-[9px] italic leading-snug text-slate-400">
              Drag any component from the full library below into this custom page.
            </p>
          )}
          {components.length === 0 && <p className="px-1 py-2 text-center text-[9px] text-slate-400">No components yet.</p>}
          {components.map((mod) => {
            const mid = mod.id;
            const isAdded = canvasModules.includes(mid);
            const isDragging = drag === mid;
            return (
              <div key={mid} draggable onDragStart={(e) => onStartDrag(e, mid)} onDragEnd={onEndDrag}
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
                  <div className={outfit.className}><ModuleView id={mid} ctx={thumbCtx} /></div>
                </div>
                <button type="button" onClick={() => (isAdded ? onRemoveModule(mid) : onAddModule(mid))}
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

/* -------------------------------- code panel ------------------------------- */
const CODE_TABS: { id: CodeLang; label: string }[] = [
  { id: 'swiftui', label: 'SwiftUI' }, { id: 'typescript', label: 'Typescript' },
  { id: 'reactnative', label: 'React Native' }, { id: 'kotlin', label: 'Kotlin' },
];
const indentLines = (s: string, n: number) => s.split('\n').map((l) => ' '.repeat(n) + l);
function buildCode(lang: CodeLang, pageLabel: string, modules: ModuleId[], brand: string, accent: string, density: Density): string[] {
  const ident = pageLabel.replace(/[^A-Za-z0-9]+/g, '') || 'Page';
  const sp = density === 'compact' ? 10 : 16;
  const theme = `// Theme: ${brand || 'Brand'} (${accent.toUpperCase()})`;
  const snippets = modules.map((id) => moduleFor(id)?.code[lang] ?? `// ${id}`);
  const place = (n: number, empty: string) => (snippets.length ? snippets.flatMap((s) => indentLines(s, n)) : [' '.repeat(n) + empty]);
  if (lang === 'swiftui') return ['// Standard SwiftUI Whitelabel Screen', theme, '', 'import SwiftUI', '', `struct ${ident}Screen: View {`, '  var body: some View {', `    ScrollView { VStack(spacing: ${sp}) {`, ...place(8, '// No components yet'), '    } .padding(.horizontal, 24) }', '    .background(Color("AppSurface"))', `    .navigationTitle("${pageLabel}")`, '  }', '}'];
  if (lang === 'typescript') return ['// Standard Typescript Whitelabel Screen', theme, '', 'import React from "react";', 'import { Grid, Stack } from "@studio/ui";', '', `export const ${ident}Screen = () => (`, `  <Grid title="${pageLabel}" spacing={${sp}} paddingX={24}>`, ...place(4, '{/* No components yet */}'), '  </Grid>', ');'];
  if (lang === 'reactnative') return ['// Standard React Native Whitelabel Screen', theme, '', 'import React from "react";', 'import { ScrollView, View } from "react-native";', '', `export const ${ident}Screen = () => (`, '  <ScrollView style={{ backgroundColor: "AppSurface" }}>', `    <View style={{ gap: ${sp}, paddingHorizontal: 24 }}>`, ...place(6, '{/* No components yet */}'), '    </View>', '  </ScrollView>', ');'];
  return ['// Standard Jetpack Compose Whitelabel Screen', theme, '', 'import androidx.compose.foundation.layout.*', 'import androidx.compose.runtime.*', '', '@Composable', `fun ${ident}Screen() {`, '  Column(', `    verticalArrangement = Arrangement.spacedBy(${sp}.dp),`, '    modifier = Modifier.padding(horizontal = 24.dp)', '  ) {', ...place(4, '// No components yet'), '  }', '}'];
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
function CodePanel({ pageLabel, blurb, modules, lang, onLang, accent, brand, density, onClose }: {
  pageLabel: string; blurb: string; modules: ModuleId[]; lang: CodeLang; onLang: (l: CodeLang) => void;
  accent: string; brand: string; density: Density; onClose?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => buildCode(lang, pageLabel, modules, brand, accent, density), [lang, pageLabel, modules, brand, accent, density]);
  const copy = async () => { try { await navigator.clipboard.writeText(lines.join('\n')); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="relative px-4 pb-3 pt-3">
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close SDK preview" title="Close SDK preview" className="absolute right-2 top-2 grid h-6 w-6 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="h-3.5 w-3.5" /></button>
        )}
        <h3 className="pr-8 text-[13px] font-bold text-slate-900">{pageLabel}</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{blurb}</p>
      </div>
      <div className="flex items-stretch justify-between border-y border-slate-200 bg-[#F4F5FC]" role="tablist">
        <div className="flex items-center gap-1 overflow-x-auto p-1 scrollbar-none">
          {CODE_TABS.map((t) => {
            const active = lang === t.id;
            return (
              <button key={t.id} type="button" role="tab" aria-selected={active} onClick={() => onLang(t.id)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1.5 text-[10px] font-bold outline-none transition ${active ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                style={active ? { background: accent } : undefined}>{t.label}</button>
            );
          })}
        </div>
        <button type="button" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'} title="Copy code" className="mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center self-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900">
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

/* ------------------------------- style popout ------------------------------ */
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
function StylePopout({ brandName, onBrandName, accent, onAccent, mode, onMode, shape, onShape, density, onDensity, onClose, shown }: {
  brandName: string; onBrandName: (v: string) => void; accent: string; onAccent: (v: string) => void;
  mode: 'light' | 'dark' | 'auto'; onMode: (v: 'light' | 'dark' | 'auto') => void;
  shape: RadiusMode; onShape: (v: RadiusMode) => void; density: Density; onDensity: (v: Density) => void; onClose: () => void; shown: boolean;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { nameRef.current?.focus(); }, []);
  return (
    <div role="dialog" aria-label="Brand and style" className={`absolute left-3 top-3 z-30 max-h-[calc(100%-24px)] w-[min(280px,calc(100%-24px))] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_24px_60px_rgba(30,41,90,0.28)] ring-1 ring-slate-200/80 scrollbar-none transition-all duration-200 ease-out ${shown ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[14px] font-semibold text-slate-900"><Palette className="h-4 w-4 text-slate-600" /> Brand & Style</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <StyleLabel>Institution / Brand name</StyleLabel>
          <label className="flex items-center gap-2 rounded-lg bg-[#EEF0FB] px-3 py-2 focus-within:ring-2 focus-within:ring-[#0040DF]">
            <Landmark className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <input ref={nameRef} type="text" value={brandName} onChange={(e) => onBrandName(e.target.value)} className="w-full min-w-0 bg-transparent text-[12px] font-medium text-slate-900 outline-none" />
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
          <Segmented variant="track" label="Mode" value={mode} onChange={onMode} options={[{ id: 'light', label: 'Light', Icon: Sun }, { id: 'dark', label: 'Dark', Icon: Moon }, { id: 'auto', label: 'Auto', Icon: SunMoon }]} />
        </div>
        <div>
          <StyleLabel>Button shape</StyleLabel>
          <Segmented variant="buttons" label="Shape" value={shape} onChange={onShape} options={[{ id: 'sharp', label: 'Sharp' }, { id: 'rounded', label: 'Rounded' }, { id: 'pill', label: 'Full Pill' }]} />
        </div>
        <div>
          <StyleLabel>Density</StyleLabel>
          <Segmented variant="buttons" label="Density" value={density} onChange={onDensity} options={[{ id: 'compact', label: 'Compact' }, { id: 'spacious', label: 'Spacious' }]} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- main ----------------------------------- */
export default function DesktopBuildSection() {
  const [appKind, setAppKind] = useState<AppKind>('banking');
  const [styleOpen, setStyleOpen] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const [brandName, setBrandName] = useState('Apex Bank');
  const [accentColor, setAccentColor] = useState('#0040DF');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<RadiusMode>('rounded');
  const [density, setDensity] = useState<Density>('spacious');
  const [prefersDark, setPrefersDark] = useState(false);
  const [codeLang, setCodeLang] = useState<CodeLang>('swiftui');
  const [sdkOpen, setSdkOpen] = useState(false);
  const [sdkShown, setSdkShown] = useState(false);
  const [styleShown, setStyleShown] = useState(false);

  const [pages, setPages] = useState<PageDef[]>(INITIAL_PAGES);
  const [activePage, setActivePage] = useState<string>('home');
  // Every page starts BLANK — nothing is pre-filled anymore.
  const [pageModules, setPageModules] = useState<Record<string, ModuleId[]>>(() => {
    const out: Record<string, ModuleId[]> = {};
    for (const p of INITIAL_PAGES) out[p.id] = [];
    return out;
  });
  const [histories, setHistories] = useState<Record<string, ModuleId[][]>>(() => {
    const out: Record<string, ModuleId[][]> = {};
    for (const p of INITIAL_PAGES) out[p.id] = [];
    return out;
  });
  // Per-page, per-module size (grid span 3–12 of 12, optional fixed height px)
  const [sizes, setSizes] = useState<Record<string, Record<ModuleId, SizeSpec>>>({});
  const [resizingId, setResizingId] = useState<ModuleId | null>(null);
  const resizeRef = useRef<null | { id: ModuleId; mode: 'e' | 's' | 'se'; startX: number; startY: number; startSpan: number; startH: number; colW: number }>(null);

  const [editMode, setEditMode] = useState(true);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [drag, setDrag] = useState<ModuleId | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const radius = RADII[buttonRadius];
  const isDark = interfaceMode === 'dark' || (interfaceMode === 'auto' && prefersDark);
  const accentName = ACCENTS.find((a) => a.hex === accentColor)?.name ?? 'Custom';
  const currentPage = pages.find((p) => p.id === activePage);
  const canvasModules = pageModules[activePage] ?? [];
  const history = histories[activePage] ?? [];
  const isSignIn = activePage === 'signin';

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
  useEffect(() => {
    if (!sdkOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSdkOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sdkOpen]);
  useEffect(() => {
    if (sdkOpen) { const id = requestAnimationFrame(() => setSdkShown(true)); return () => cancelAnimationFrame(id); }
    setSdkShown(false);
  }, [sdkOpen]);
  useEffect(() => {
    if (styleOpen) { const id = requestAnimationFrame(() => setStyleShown(true)); return () => cancelAnimationFrame(id); }
    setStyleShown(false);
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
    next.splice(clamp(at, 0, next.length), 0, id);
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
  const loadStarter = () => commit(currentPage?.kit ?? []);
  const selectPage = (id: string) => { setActivePage(id); setExpandedPage(null); };
  const addOwnPage = () => {
    const id = `custom-${Date.now()}`;
    const label = `Custom Page ${pages.length - INITIAL_PAGES.length + 1}`;
    setPages((p) => [...p, { id, label, blurb: 'Custom page — drop any modules you need', kit: [] }]);
    setPageModules((p) => ({ ...p, [id]: [] }));
    setHistories((h) => ({ ...h, [id]: [] }));
    setActivePage(id);
  };
  const renamePage = (id: string, label: string) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, label } : p)));
  };

  /* --------------------------------- resize -------------------------------- */
  const getSize = (id: ModuleId): SizeSpec => sizes[activePage]?.[id] ?? { span: moduleFor(id)?.wide ? 8 : 4, h: null };
  const resizeRafRef = useRef<number | null>(null);
  const pendingSizeRef = useRef<{ id: ModuleId; span: number; h: number } | null>(null);
  const commitPendingSize = () => {
    const p = pendingSizeRef.current;
    if (!p) return;
    setSizes((prev) => ({ ...prev, [activePage]: { ...(prev[activePage] ?? {}), [p.id]: { span: p.span, h: p.h } } }));
  };
  const startResize = (e: React.MouseEvent, id: ModuleId, mode: 'e' | 's' | 'se') => {
    if (!editMode) return;
    e.preventDefault(); e.stopPropagation();
    const card = (e.currentTarget as HTMLElement).closest('[data-module-id]') as HTMLElement | null;
    const cont = bodyRef.current;
    const colW = ((cont?.clientWidth ?? 720) - (density === 'compact' ? 12 * 3 : 12 * 4)) / 12 || 48;
    const cur = getSize(id);
    resizeRef.current = { id, mode, startX: e.clientX, startY: e.clientY, startSpan: cur.span, startH: cur.h ?? card?.offsetHeight ?? 240, colW };
    setResizingId(id);
    const move = (ev: MouseEvent) => {
      const r = resizeRef.current; if (!r) return;
      const dx = ev.clientX - r.startX; const dy = ev.clientY - r.startY;
      let span = r.startSpan; let h = r.startH;
      if (r.mode !== 's') span = clamp(Math.round(r.startSpan + dx / r.colW), 3, 12);
      if (r.mode !== 'e') h = Math.max(180, Math.round(r.startH + dy));
      pendingSizeRef.current = { id: r.id, span, h };
      if (resizeRafRef.current == null) {
        resizeRafRef.current = requestAnimationFrame(() => {
          resizeRafRef.current = null;
          commitPendingSize();
        });
      }
    };
    const up = () => {
      resizeRef.current = null; setResizingId(null);
      if (resizeRafRef.current != null) { cancelAnimationFrame(resizeRafRef.current); resizeRafRef.current = null; }
      commitPendingSize();
      pendingSizeRef.current = null;
      window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

  /* ------------------------------- drag & drop ------------------------------ */
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
  const handleCanvasDragOver = (e: React.DragEvent) => {
    if (!drag) return;
    e.preventDefault(); e.stopPropagation();
    const container = e.currentTarget as HTMLElement;
    const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-module-id]')).filter((el) => el.dataset.moduleId !== drag);
    if (cards.length === 0) { setDropIndex(0); autoScroll(e.clientY); return; }
    const x = e.clientX; const y = e.clientY;
    let rowDist = Infinity; let rowId: ModuleId | null = null; let rowBefore = false;
    let anyDist = Infinity; let anyId: ModuleId | null = null; let anyBefore = false;
    for (const el of cards) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2; const cy = r.top + r.height / 2;
      const id = el.dataset.moduleId as ModuleId;
      if (y >= r.top && y <= r.bottom) {
        const d = Math.abs(x - cx);
        if (d < rowDist) { rowDist = d; rowId = id; rowBefore = x < cx; }
      }
      const d2 = Math.hypot(x - cx, y - cy);
      if (d2 < anyDist) { anyDist = d2; anyId = id; anyBefore = y < cy || (y === cy && x < cx); }
    }
    const targetId = rowId ?? anyId;
    const before = rowId ? rowBefore : anyBefore;
    const neighborIdx = targetId ? canvasModules.indexOf(targetId) : canvasModules.length;
    const idx = targetId ? (before ? neighborIdx : neighborIdx + 1) : canvasModules.length;
    setDropIndex(clamp(idx, 0, canvasModules.length));
    autoScroll(y);
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

  const segBtn = (on: boolean) =>
    `flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`;
  const iconBtn = 'grid h-7 w-7 cursor-pointer place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40';
  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '') || 'apexbank';

  const renderModuleCard = (id: ModuleId, i: number) => {
    const mod = moduleFor(id);
    const size = getSize(id);
    const isSource = drag === id;
    return (
      <div key={id} data-module-id={id}
        draggable={editMode && resizingId !== id}
        onMouseDown={(e) => {
          const isField = (e.target as HTMLElement).closest('input,textarea,select,button');
          e.currentTarget.draggable = editMode && resizingId !== id && !isField;
        }}
        onDragStart={(e) => startDrag(e, id)} onDragEnd={onEndDragSafe}
        style={{ ['--tw-ring-color' as string]: accentColor, gridColumn: isSignIn ? undefined : `span ${size.span} / span ${size.span}`, height: size.h ?? undefined } as React.CSSProperties}
        className={`group relative ${radius.card} transition-shadow duration-150 ${editMode ? 'cursor-grab ring-offset-2 focus-within:ring-2 hover:ring-2 active:cursor-grabbing' : ''} ${isDark ? 'ring-offset-slate-950' : 'ring-offset-white'} ${isSource ? 'opacity-40' : ''} ${size.h ? 'overflow-hidden' : ''} ${resizingId === id ? 'ring-2 shadow-lg' : ''}`}>
        {drag && dropIndex === i && <DropLine side="top" accent={accentColor} />}
        {drag && dropIndex === canvasModules.length && i === canvasModules.length - 1 && <DropLine side="bottom" accent={accentColor} />}
        {editMode && (
          <div className="absolute -top-9 right-2 z-20 flex items-center gap-0.5 rounded-full bg-white px-1 py-0.5 opacity-0 shadow-md ring-1 ring-slate-200 transition group-focus-within:opacity-100 group-hover:opacity-100">
            <GripVertical className="h-3 w-3 text-slate-400" aria-hidden />
            <ToolbarButton label="Move up" disabled={i === 0} onClick={() => moveModule(id, -1)}><ChevronUpSmall /></ToolbarButton>
            <ToolbarButton label="Move down" disabled={i === canvasModules.length - 1} onClick={() => moveModule(id, 1)}><ChevronDownSmall /></ToolbarButton>
            <ToolbarButton label="Remove" danger onClick={() => removeModule(id)}><Trash2 className="h-3 w-3" /></ToolbarButton>
          </div>
        )}
        {editMode && !isSignIn && (
          <>
            <div onMouseDown={(e) => startResize(e, id, 'e')} title="Drag to resize width" className="absolute inset-y-0 -right-1.5 z-20 w-3 cursor-ew-resize opacity-0 transition group-hover:opacity-100">
              <div className="mx-auto h-full w-1 rounded-full" style={{ background: `${accentColor}66` }} />
            </div>
            <div onMouseDown={(e) => startResize(e, id, 's')} title="Drag to resize height" className="absolute inset-x-0 -bottom-1.5 z-20 h-3 cursor-ns-resize opacity-0 transition group-hover:opacity-100">
              <div className="my-auto h-1 w-full rounded-full" style={{ background: `${accentColor}66` }} />
            </div>
            <div onMouseDown={(e) => startResize(e, id, 'se')} title="Drag to resize width & height" className="absolute -bottom-1.5 -right-1.5 z-20 h-3.5 w-3.5 cursor-nwse-resize rounded-sm opacity-0 transition group-hover:opacity-100" style={{ background: accentColor }} />
          </>
        )}
        <div className={`relative h-full ${drag ? 'pointer-events-none' : ''}`}><ModuleView id={id} ctx={liveCtx} /></div>
      </div>
    );
  };
  function onEndDragSafe() { endDrag(); }

  return (
    <section className="w-full overflow-hidden bg-[#eef1fb] px-4 py-10 font-sans text-slate-900 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto max-w-full">
        <div className="flex items-center gap-3 border border-[#E1E5F8] bg-white px-5 py-3 shadow-sm">
          <div>
            <p className="text-[13px] font-bold leading-tight">FintecConnect Whitelabel Playground</p>
            <p className="text-[10px] text-slate-400">Desktop console builder · {APP_KINDS.find((k) => k.id === appKind)?.label}</p>
          </div>
        </div>

        <div className="overflow-hidden border border-[#DDE2F6] bg-[#EEF0FB] shadow-[0_10px_40px_rgba(37,52,120,0.08)]">
          <div className="grid grid-cols-1 lg:h-[820px] lg:grid-cols-[minmax(230px,22%)_minmax(0,1fr)]">
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
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#DDE3FA] px-3 py-2.5 text-left outline-none transition hover:bg-[#D3DBF8] focus-visible:ring-2 focus-visible:ring-[#0040DF]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: accentColor }}><Palette className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">Style Guide</span><span className="block truncate text-[10px] text-slate-500">{brandName || 'Your brand'} · {accentName}</span></span>
                  <ArrowRight className="h-4 w-4 shrink-0" style={{ color: accentColor }} aria-hidden />
                </button>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Pages</span>
                  <span className="text-[10px] text-slate-500">Reorderable</span>
                </div>
              </div>
              <ul className="scrollbar-none m-0 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3" aria-label="Pages">
                {pages.map((p) => {
                  const isCustom = p.id.startsWith('custom-');
                  return (
                    <PageMenuItem key={p.id} page={p}
                      count={isCustom ? (pageModules[p.id] ?? []).length : p.kit.length}
                      active={activePage === p.id} expanded={expandedPage === p.id}
                      accent={accentColor} canvasModules={canvasModules} thumbCtx={thumbCtx} drag={drag}
                      onSelect={() => selectPage(p.id)}
                      onToggleExpand={() => setExpandedPage((cur) => (cur === p.id ? null : p.id))}
                      onAddModule={addModule} onRemoveModule={removeModule}
                      onStartDrag={startDrag} onEndDrag={endDrag}
                      onRename={renamePage} />
                  );
                })}
              </ul>
              <div className="border-t border-[#E1E5F8] p-3">
                <button type="button" onClick={addOwnPage}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#DDE3FA] py-2.5 text-[11px] font-bold text-[#0040DF] transition hover:bg-[#D3DBF8]">
                  <Plus className="h-3.5 w-3.5" /> Add your own page
                </button>
              </div>
            </aside>

            <div className="relative flex min-h-0 flex-col bg-gradient-to-b from-[#EEF0FB] via-[#F6F7FE] to-[#EEF0FB] p-4">
              {styleOpen && <div className="absolute inset-0 z-20" onClick={closeStyle} aria-hidden />}
              {styleOpen && (
                <StylePopout brandName={brandName} onBrandName={setBrandName} accent={accentColor} onAccent={setAccentColor}
                  mode={interfaceMode} onMode={setInterfaceMode} shape={buttonRadius} onShape={setButtonRadius}
                  density={density} onDensity={setDensity} onClose={closeStyle} shown={styleShown} />
              )}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" aria-hidden /> Live Sandbox
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5 rounded-lg bg-slate-200/70 p-0.5" role="group" aria-label="Canvas mode">
                    <button type="button" onClick={() => setEditMode(true)} aria-pressed={editMode} className={segBtn(editMode)}><Pencil className="h-2.5 w-2.5" /> Edit</button>
                    <button type="button" onClick={() => setEditMode(false)} aria-pressed={!editMode} className={segBtn(!editMode)}><Eye className="h-2.5 w-2.5" /> Preview</button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={loadStarter} aria-label="Starter layout" title="Load this page's reference layout" className={iconBtn}><Sparkles className="h-3.5 w-3.5 text-[#0040DF]" /></button>
                    <button type="button" onClick={undo} disabled={history.length === 0} aria-label="Undo" className={iconBtn}><Undo2 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => commit([])} disabled={canvasModules.length === 0} aria-label="Clear" className={iconBtn}><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-[#FBFCFF] px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex w-full max-w-md items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-500">
                      <Lock className="h-2.5 w-2.5 text-emerald-600" />
                      <span className="truncate font-mono">https://banking.{brandSlug}.internal/commercial/overview</span>
                    </div>
                  </div>
                  <RefreshCw className="h-3 w-3 text-slate-400" />
                </div>

                <div className={`flex flex-1 flex-col overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
                  <div ref={bodyRef} onDragOver={handleContainerDragOver} onDragLeave={handleContainerDragLeave} onDrop={handleDrop}
                    className={`flex-1 overflow-y-auto scrollbar-none ${density === 'compact' ? 'px-4 pb-4 pt-10' : 'px-6 pb-6 pt-12'} ${resizingId ? 'select-none' : ''}`}>
                    {activePage === 'home' ? (
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-[22px] font-extrabold tracking-tight">Good Morning, User</h2>
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[8px] font-bold text-indigo-600">PRO HUB</span>
                          </div>
                          <p className={`mt-1 max-w-sm text-[10px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Here is an integrated breakdown of your cash velocity and liquid capital for today.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[9px] font-bold text-white"><Send className="h-2.5 w-2.5" /> Send Money</button>
                          <button type="button" className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[9px] font-bold ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}><CreditCard className="h-2.5 w-2.5" /> Top Up Card</button>
                          <button type="button" className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[9px] font-bold ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}><ArrowDownLeft className="h-2.5 w-2.5" /> Request</button>
                          <button type="button" className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[9px] font-bold ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}><Receipt className="h-2.5 w-2.5" /> Pay Bills</button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-5">
                        <h2 className="text-[18px] font-extrabold tracking-tight">{currentPage?.label}</h2>
                        <p className={`mt-0.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentPage?.blurb}</p>
                      </div>
                    )}

                    {canvasModules.length === 0 ? (
                      <div style={drag ? { borderColor: accentColor, background: `${accentColor}10` } : undefined}
                        className={`flex flex-col items-center justify-center space-y-3 border-2 border-dashed py-16 text-center transition-colors ${radius.card} ${drag ? '' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-blue-200 bg-blue-50/20'}`}>
                        <div className={`grid h-12 w-12 place-items-center text-white shadow-sm ${radius.icon}`} style={{ background: accentColor }}><Plus className="h-6 w-6" /></div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold">{drag ? 'Drop to add it here' : `This ${currentPage?.label ?? 'page'} canvas is empty`}</h4>
                          <p className="text-[11px] text-slate-500">Drag tiles from the page menu, tap a suggestion, or load the reference layout.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                          {(currentPage?.kit ?? []).slice(0, 3).map((id) => (
                            <button key={id} type="button" onClick={() => addModule(id)} className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
                              + {moduleFor(id)?.title ?? id}
                            </button>
                          ))}
                          {(currentPage?.kit.length ?? 0) > 0 && (
                            <button type="button" onClick={loadStarter} className="cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm" style={{ background: accentColor }}>
                              Load reference layout
                            </button>
                          )}
                        </div>
                      </div>
                    ) : isSignIn ? (
                      <div className="flex min-h-[480px] flex-col items-center justify-center">
                        <div onDragOver={handleCanvasDragOver} onDrop={handleDrop} className={`w-full max-w-sm ${density === 'compact' ? 'space-y-3' : 'space-y-4'}`}>{canvasModules.map(renderModuleCard)}</div>
                      </div>
                    ) : (
                      <div onDragOver={handleCanvasDragOver} onDrop={handleDrop} className={`grid grid-cols-12 ${density === 'compact' ? 'gap-3' : 'gap-4'}`}>{canvasModules.map(renderModuleCard)}</div>
                    )}
                  </div>
                </div>
              </div>

              {!sdkOpen && (
                <button type="button" onClick={() => setSdkOpen(true)}
                  className="absolute bottom-3 right-3 z-30 flex cursor-pointer items-center gap-1.5 rounded-full bg-[#DDE3FB] px-3.5 py-2 text-[11px] font-bold text-[#0040DF] shadow-lg ring-1 ring-[#C4CFF7] transition hover:bg-[#CFD8FA]">
                  <Code2 className="h-3.5 w-3.5" /> Preview SDK
                </button>
              )}
              {sdkOpen && (
                <>
                  <div className="absolute inset-0 z-30" onClick={() => setSdkOpen(false)} aria-hidden />
                  <div
                    className={`absolute bottom-3 right-3 z-40 h-1/2 min-h-[300px] w-[min(440px,calc(100%-24px))] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(30,41,90,0.28)] ring-1 ring-slate-200 transition-all duration-200 ease-out ${sdkShown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                  >
                    <CodePanel pageLabel={currentPage?.label ?? 'Page'} blurb={currentPage?.blurb ?? ''} modules={canvasModules}
                      lang={codeLang} onLang={setCodeLang} accent={accentColor} brand={brandName} density={density}
                      onClose={() => setSdkOpen(false)} />
                  </div>
                </>
              )}
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

function ChevronUpSmall() { return <ChevronUpIcon />; }
function ChevronDownSmall() { return <ChevronDownIcon />; }
function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  );
}