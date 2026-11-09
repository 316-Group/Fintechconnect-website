// /client/app/userdashboard/studio/phone-cards.tsx
'use client';

import React, { useState } from 'react';
import {
  AlertCircle, ArrowDown, ArrowDownLeft, ArrowRight, ArrowUp, BarChart3,
  BatteryFull, Bell, Check, ChevronDown, ChevronRight, ChevronUp,
  ChevronsUpDown, Clock, Contrast, Copy, Download, Eye, FileText,
  Fingerprint, Globe, GripVertical, Home, Landmark, Lock, LogIn, Mail,
  Monitor, Moon, Palette, Pencil, Phone, Plus, PlusCircle, QrCode,
  Receipt, RefreshCw, Search, Send, Share2, ShieldCheck, ShoppingCart,
  Signal, Smartphone, Snowflake, Sparkles, Sun, SunMoon, Trash2, Undo2,
  User, Wallet, Wifi, X,
} from 'lucide-react';

/* NOTE: adjust these two paths to wherever your buildsection's sibling modules live. */
import {
  BANKING_WALLET_MODULES,
  BANKING_WALLET_PAGE_PREPEND,
  BANKING_WALLET_MODULE_IDS,
  BankingWalletModuleView,
  type BankingWalletModuleId,
} from '@/app/products/mobile-app/banking-wallet-modules';
import {
  CRYPTO_MODULES,
  CRYPTO_PAGE_PREPEND,
  CRYPTO_MODULE_IDS,
  CryptoModuleView,
  type CryptoModuleId,
} from '@/app/products/mobile-app/crypto-modules';

import {
  EditableText, useModuleColor, useModuleText,
} from './edit-context';

import { ModuleScope } from './edit-context';
/* ─────────────────────────── constants ─────────────────────────── */

export const INK = '#1B1B1F';
export const YELLOW = '#F5B921';
export const GREEN = '#16A36B';
export const PINK = '#EF4F6B';
export const NAVY = '#0B1A56';

export type Category = 'balances' | 'actions' | 'fx' | 'ledger' | 'security' | 'onboarding';
export type ModuleId =
  | 'headerGreeting' | 'accounts' | 'cashflow' | 'transfers' | 'vaults' | 'cards' | 'fx' | 'analytics'
  | 'security' | 'notifications' | 'signin' | 'accountsPage'
  | 'directTransferEngine' | 'multiMarketFX' | 'recurringStanding' | 'authorizationModal'
  | 'recentRecipients' | 'beneficiaryValidation' | 'sendMoneyAmount' | 'transferSuccess'
  | 'peerInvoicing' | 'paymentQR' | 'splitPayment' | 'outstandingReceivables'
  | 'historyPage' | 'splash' | 'profile' | 'freezeCard'
  | 'accountPortfolio' | 'routingWireData' | 'statementsExport'
  | 'cardPreview' | 'cardControls' | 'pinVault'
  | 'alertCenter' | 'deliveryChannels'
  | 'identityCard' | 'securityBaseline' | 'connectedDevices'
  | BankingWalletModuleId | CryptoModuleId;

export type RadiusMode = 'rounded' | 'sharp' | 'pill';
export type TabId = 'home' | 'cards' | 'activity' | 'settings' | 'send' | 'fx';
export type AppKind = 'banking' | 'fintech' | 'psp' | 'wallet' | 'crypto';
export type PageId =
  | 'signin' | 'home' | 'accounts' | 'transfers' | 'send' | 'payments'
  | 'cards' | 'history' | 'notifications' | 'profile' | 'splash';
export type CodeLang = 'swiftui' | 'typescript' | 'reactnative' | 'kotlin';

export interface ModuleAsset {
  id: ModuleId;
  title: string;
  subtitle: string;
  category: Category;
  badge: string;
  badgeColor: string;
  code: { swiftui: string; typescript: string; reactnative: string; kotlin: string };
}

export interface Transaction { id: string; name: string; sub: string; amount: number; method: string; kind: 'in' | 'out' }
export interface SavingsGoal { id: string; name: string; amount: number }

export const RADII: Record<RadiusMode, { card: string; tile: string; icon: string }> = {
  rounded: { card: 'rounded-[20px]', tile: 'rounded-2xl', icon: 'rounded-xl' },
  sharp: { card: 'rounded-none', tile: 'rounded-none', icon: 'rounded-none' },
  pill: { card: 'rounded-[28px]', tile: 'rounded-[24px]', icon: 'rounded-full' },
};
export type Radius = (typeof RADII)[RadiusMode];

/* ─────────────────────────── library ─────────────────────────── */

export const availableModules: ModuleAsset[] = [
  {
    id: 'headerGreeting', title: 'Header Greeting Bar', subtitle: 'Greeting, profile name and notifications', category: 'actions', badge: 'Home',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `HeaderGreetingBar(name: user.name, greeting: greeting)`,
      typescript: `<HeaderGreetingBar name={user.name} greeting={greeting} />`,
      reactnative: `<HeaderGreetingBar name={user.name} greeting={greeting} />`,
      kotlin: `HeaderGreetingBar(name = user.name, greeting = greeting)`,
    },
  },
  {
    id: 'accounts', title: 'Multi-Layer Balance Card', subtitle: 'Total balance with wallet shortcut', category: 'balances', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `BalanceCardComponent(\n  balance: availableBalance,\n  theme: .whitelabelDefault\n)`,
      typescript: `export const BalanceCard = ({ balance, accent }) => (\n  <Card theme="ink" accent={accent}>{formatUSD(balance)}</Card>\n);`,
      reactnative: `<BalanceCard balance={25000.40} accent={accent} />`,
      kotlin: `BalanceCard(balance = 25000.40, accent = BrandColors.Blue)`,
    },
  },
  {
    id: 'cashflow', title: 'Income & Outcome Strip', subtitle: 'Money in and out at a glance', category: 'ledger', badge: 'New',
    badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100',
    code: {
      swiftui: `CashflowSummaryComponent()`,
      typescript: `export const CashflowStrip = ({ income, outcome }) => (<HStack>{money(income)}{money(-outcome)}</HStack>);`,
      reactnative: `<CashflowStrip income={20000} outcome={17000} />`,
      kotlin: `CashflowStrip(income = 20000, outcome = 17000)`,
    },
  },
  {
    id: 'transfers', title: 'Quick Actions Matrix', subtitle: 'Send, Payments, Pay Bill & Top Up', category: 'actions', badge: 'Action',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `QuickActionsComponent()`,
      typescript: `export const QuickActions = () => (<Grid columns={4}><Action id="send" /><Action id="payments" /></Grid>);`,
      reactnative: `<QuickActions actions={['send','payments','payBill','topUp']} />`,
      kotlin: `QuickActions(actions = listOf(SEND, PAYMENTS, PAY_BILL, TOP_UP))`,
    },
  },
  {
    id: 'vaults', title: 'Savings Goals', subtitle: 'Pockets for what you are saving toward', category: 'balances', badge: 'Savings',
    badgeColor: 'bg-purple-50 text-purple-600 border border-purple-100',
    code: {
      swiftui: `SavingsSummaryComponent()`,
      typescript: `export const SavingsGoals = ({ goals }) => (<Grid columns={2}>{goals.map(renderGoal)}</Grid>);`,
      reactnative: `<SavingsGoals goals={goals} />`,
      kotlin: `SavingsGoals(goals = listOf(iphoneGoal, macbookGoal))`,
    },
  },
  {
    id: 'cards', title: 'Recent Activity Card', subtitle: 'Latest transactions with merchant icons', category: 'ledger', badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `RecentActivityComponent()`,
      typescript: `export const RecentActivity = ({ transactions }) => (<List rows={transactions.slice(0, 3)} />);`,
      reactnative: `<RecentActivity transactions={transactions} />`,
      kotlin: `RecentActivity(transactions = store.latest(3))`,
    },
  },
  {
    id: 'fx', title: 'FX Ticker & Wallets', subtitle: 'Multi-currency wallets with live rate', category: 'fx', badge: 'Global',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `FXWallets(rates: FX.live, base: .usd)`,
      typescript: `export const FXWallets = ({ wallets }) => (<Row>{wallets.map(renderWallet)}</Row>);`,
      reactnative: `<FXWallets base="USD" wallets={wallets} />`,
      kotlin: `FXWallets(base = Currency.USD, rates = Fx.live())`,
    },
  },
  {
    id: 'analytics', title: 'Spending Intelligence', subtitle: 'Monthly spend trend and budgets', category: 'ledger', badge: 'AI',
    badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    code: {
      swiftui: `SpendingChart(monthlySpend: 4820, trend: .down)`,
      typescript: `export const SpendingChart = ({ monthly }) => (<Bars data={monthly} accent={accent} />);`,
      reactnative: `<SpendingChart monthly={monthlySpend} />`,
      kotlin: `SpendingChart(monthly = 4820, trend = Trend.DOWN)`,
    },
  },
  {
    id: 'security', title: 'Biometric Shield & 2FA', subtitle: 'Face ID required for transfers', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `BiometricGate(faceID: true) { transferAmount }`,
      typescript: `export const SecurityRow = ({ faceId, onChange }) => (<Switch checked={faceId} onChange={onChange} />);`,
      reactnative: `<SecurityRow faceId={faceId} onChange={setFaceId} />`,
      kotlin: `BiometricGate(requireFaceId = true) { transfer() }`,
    },
  },
  {
    id: 'notifications', title: 'Real-Time Alerts', subtitle: 'Push alerts and header bell badge', category: 'security', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `RealtimeAlerts(subscribe: .transactions)`,
      typescript: `export const AlertsRow = ({ count }) => (<Row badge={count}>Alerts</Row>);`,
      reactnative: `<AlertsRow count={3} />`,
      kotlin: `RealtimeAlerts(topic = TOPIC_TRANSACTIONS)`,
    },
  },
  {
    id: 'signin', title: 'Sign-In Screen', subtitle: 'Email, password, captcha & quick login', category: 'onboarding', badge: 'Auth',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: {
      swiftui: `SignInScreen(email: $email, password: $pw, onSignIn: auth.signIn)`,
      typescript: `export const SignInScreen = () => (<SignInForm onSignIn={signIn} />);`,
      reactnative: `<SignInScreen onSignIn={signIn} />`,
      kotlin: `SignInScreen(onSignIn = auth::signIn)`,
    },
  },
  {
    id: 'accountsPage', title: 'Accounts Overview', subtitle: 'Sub-accounts list with available funds', category: 'balances', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `AccountsOverview(accounts: store.accounts)`,
      typescript: `export const AccountsOverview = ({ accounts }) => (<List rows={accounts} />);`,
      reactnative: `<AccountsOverview accounts={accounts} />`,
      kotlin: `AccountsOverview(accounts = store.accounts)`,
    },
  },
  {
    id: 'directTransferEngine', title: '4.1 Direct Transfer Engine', subtitle: 'From / To / Amount with rail picker', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `DirectTransferEngine(from: .checking(4912), to: .chaseSarah, amount: 500.00)`,
      typescript: `export const DirectTransferEngine = () => (<Form from={checking} to={sarah} amount={500} />);`,
      reactnative: `<DirectTransferEngine from="checking" to="sarah" amount={500} />`,
      kotlin: `DirectTransferEngine(from = CHECKING, to = SARAH, amount = 500.0)`,
    },
  },
  {
    id: 'multiMarketFX', title: '4.2 Mid-Market FX Swap', subtitle: 'Lock rate, guaranteed rate window', category: 'fx', badge: 'FX',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `MidMarketFXSwap(send: 1000, from: .usd, to: .eur, rate: 0.9214)`,
      typescript: `export const MidMarketFXSwap = () => (<Swap send={1000} from="USD" to="EUR" rate={0.9214} />);`,
      reactnative: `<MidMarketFXSwap send={1000} from="USD" to="EUR" />`,
      kotlin: `MidMarketFXSwap(send = 1000, from = USD, to = EUR, rate = 0.9214)`,
    },
  },
  {
    id: 'recurringStanding', title: '4.3 Recurring Standing Order', subtitle: 'Monthly schedule, next run date', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `RecurringStandingOrder(payee: realty, amount: 2100, nextRun: "Nov 1, 2024")`,
      typescript: `export const RecurringStandingOrder = () => (<Standing payee={realty} amount={2100} nextRun="2024-11-01" />);`,
      reactnative: `<RecurringStandingOrder payee={realty} amount={2100} />`,
      kotlin: `RecurringStandingOrder(payee = realty, amount = 2100.0, nextRun = Nov1)`,
    },
  },
  {
    id: 'authorizationModal', title: '4.4 Authorization Modal', subtitle: 'Payment review & authorize', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PaymentReviewAuthorization(amount: 500, fee: 0, delivery: .instant)`,
      typescript: `export const PaymentReview = () => (<Review amount={500} fee={0} delivery="instant" />);`,
      reactnative: `<PaymentReview amount={500} fee={0} delivery="instant" />`,
      kotlin: `PaymentReview(amount = 500.0, fee = 0.0, delivery = INSTANT)`,
    },
  },
  {
    id: 'recentRecipients', title: '5.1 Recent Recipients', subtitle: 'One-tap contacts dock', category: 'actions', badge: 'Action',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `RecentRecipients(contacts: contacts.recent)`,
      typescript: `export const RecentRecipients = () => (<ContactsDock contacts={recent} onManage={openContacts} />);`,
      reactnative: `<RecentRecipients contacts={recent} onManage={openContacts} />`,
      kotlin: `RecentRecipients(contacts = contacts.recent, onManage = ::openContacts)`,
    },
  },
  {
    id: 'beneficiaryValidation', title: '5.2 Add Recipient', subtitle: 'Beneficiary validation & save', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `BeneficiaryValidation(onSave: { save() })`,
      typescript: `export const BeneficiaryValidation = () => (<ValidationForm onSave={save} />);`,
      reactnative: `<BeneficiaryValidation onSave={save} />`,
      kotlin: `BeneficiaryValidation(onSave = ::save)`,
    },
  },
  {
    id: 'sendMoneyAmount', title: '5.3 Send Money Focus', subtitle: 'Amount pad with note & review', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SendMoneyAmount(amount: 120, note: "Dinner & drinks")`,
      typescript: `export const SendMoneyAmount = () => (<AmountPad amount={120} note="Dinner" />);`,
      reactnative: `<SendMoneyAmount amount={120} note="Dinner" />`,
      kotlin: `SendMoneyAmount(amount = 120.0, note = "Dinner")`,
    },
  },
  {
    id: 'transferSuccess', title: '5.4 Transfer Success', subtitle: 'Confirmation with receipt ID', category: 'ledger', badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `TransferSuccess(receipt: "US-99214-88A", amount: 120, to: "Sarah Jenkins")`,
      typescript: `export const TransferSuccess = () => (<Success receipt="US-99214-88A" amount={120} to="Sarah" />);`,
      reactnative: `<TransferSuccess receipt="US-99214-88A" amount={120} />`,
      kotlin: `TransferSuccess(receipt = "US-99214-88A", amount = 120.0)`,
    },
  },
  {
    id: 'peerInvoicing', title: '6.1 Peer Invoicing', subtitle: 'Request money with a note', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PeerInvoicing(amount: 75, note: "Concert tickets")`,
      typescript: `export const PeerInvoicing = () => (<Invoice amount={75} note="Concert tickets" />);`,
      reactnative: `<PeerInvoicing amount={75} note="Concert tickets" />`,
      kotlin: `PeerInvoicing(amount = 75.0, note = "Concert tickets")`,
    },
  },
  {
    id: 'paymentQR', title: '6.2 Payment QR', subtitle: 'Scan-to-pay QR request', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PaymentQRRequest(handle: "alexrivera", amount: 75)`,
      typescript: `export const PaymentQRRequest = () => (<QR handle="alexrivera" amount={75} />);`,
      reactnative: `<PaymentQRRequest handle="alexrivera" amount={75} />`,
      kotlin: `PaymentQRRequest(handle = "alexrivera", amount = 75.0)`,
    },
  },
  {
    id: 'splitPayment', title: '6.3 Split Payment', subtitle: 'Divide bill across people', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SplitPayment(total: 180, shares: [60, 60, 60])`,
      typescript: `export const SplitPayment = () => (<Splitter total={180} shares={[60,60,60]} />);`,
      reactnative: `<SplitPayment total={180} shares={[60,60,60]} />`,
      kotlin: `SplitPayment(total = 180.0, shares = listOf(60.0, 60.0, 60.0))`,
    },
  },
  {
    id: 'outstandingReceivables', title: '6.4 Outstanding Receivables', subtitle: 'Pending invoice tracker', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `OutstandingReceivables(items: store.pending)`,
      typescript: `export const OutstandingReceivables = () => (<Tracker items={pending} onRemind={remind} />);`,
      reactnative: `<OutstandingReceivables items={pending} onRemind={remind} />`,
      kotlin: `OutstandingReceivables(items = store.pending, onRemind = ::remind)`,
    },
  },
  {
    id: 'cardPreview', title: '7.1 Card Preview', subtitle: 'Metal card with active NFC badge', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardPreview(holder: "C MUTHU KRISHNAN", last4: "8824", tier: .platinum)`,
      typescript: `export const CardPreview = () => (<MetalCard tier="platinum" last4="8824" />);`,
      reactnative: `<CardPreview last4="8824" />`,
      kotlin: `CardPreview(last4 = "8824", tier = Tier.PLATINUM)`,
    },
  },
  {
    id: 'cardControls', title: '7.2 Card Controls', subtitle: 'Freeze / online / NFC + spend limit', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardControls(frozen: $frozen, online: $online, nfc: $nfc, limit: 5000)`,
      typescript: `export const CardControls = () => (<SecuritySwitches limit={5000} />);`,
      reactnative: `<CardControls limit={5000} />`,
      kotlin: `CardControls(limit = 5000.0)`,
    },
  },
  {
    id: 'pinVault', title: '7.3 PIN Vault', subtitle: 'Hold to view, change PIN, report lost', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PinVault(onView: pin::reveal, onChange: pin::change, onReport: report)`,
      typescript: `export const PinVault = () => (<PinVaultActions />);`,
      reactnative: `<PinVault />`,
      kotlin: `PinVault(onChange = pin::change, onReport = ::report)`,
    },
  },
  {
    id: 'alertCenter', title: '9.1 Alert Center', subtitle: 'Recent alerts feed with mark all as read', category: 'security', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `AlertCenter(items: store.alerts)`,
      typescript: `export const AlertCenter = () => (<AlertFeed items={alerts} onMarkAllRead={markAll} />);`,
      reactnative: `<AlertCenter items={alerts} />`,
      kotlin: `AlertCenter(items = store.alerts)`,
    },
  },
  {
    id: 'deliveryChannels', title: '9.2 Delivery Channels', subtitle: 'Push / weekly / security preferences', category: 'security', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `DeliveryChannels(prefs: $prefs)`,
      typescript: `export const DeliveryChannels = () => (<DeliveryChannelsForm prefs={prefs} />);`,
      reactnative: `<DeliveryChannels prefs={prefs} />`,
      kotlin: `DeliveryChannels(prefs = prefs)`,
    },
  },
  {
    id: 'identityCard', title: '10.1 Identity Card', subtitle: 'Avatar, tier, tax ID and residence', category: 'security', badge: 'KYC',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `IdentityCard(user: auth.current)`,
      typescript: `export const IdentityCard = () => (<IdentityCardView user={user} tier="BLACK" />);`,
      reactnative: `<IdentityCard user={user} />`,
      kotlin: `IdentityCard(user = auth.current)`,
    },
  },
  {
    id: 'securityBaseline', title: '10.2 Security Baseline', subtitle: 'Password, biometrics, hardware key', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SecurityBaseline(passwordAge: 3, faceID: true, hardwareKey: true)`,
      typescript: `export const SecurityBaseline = () => (<SecurityBaselineList />);`,
      reactnative: `<SecurityBaseline />`,
      kotlin: `SecurityBaseline(faceID = true, hardwareKey = true)`,
    },
  },
  {
    id: 'connectedDevices', title: '10.3 Connected Devices', subtitle: 'Active sessions and log-out-all', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `ConnectedDevices(sessions: store.sessions)`,
      typescript: `export const ConnectedDevices = () => (<ActiveSessions sessions={sessions} />);`,
      reactnative: `<ConnectedDevices sessions={sessions} />`,
      kotlin: `ConnectedDevices(sessions = store.sessions)`,
    },
  },
  {
    id: 'accountPortfolio', title: '3.1 Account Portfolio', subtitle: 'Everyday, savings and travel wallet', category: 'balances', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `AccountPortfolio(accounts: store.accounts)`,
      typescript: `export const AccountPortfolio = () => (<AccountsGrid accounts={accounts} />);`,
      reactnative: `<AccountPortfolio accounts={accounts} />`,
      kotlin: `AccountPortfolio(accounts = store.accounts)`,
    },
  },
  {
    id: 'routingWireData', title: '3.2 Routing & Wire Data', subtitle: 'Holder, ACH routing and account number', category: 'balances', badge: 'Data',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `RoutingWireData(holder: "Alex Rivera", routing: "021000021")`,
      typescript: `export const RoutingWireData = () => (<WireDetails onShare={share} />);`,
      reactnative: `<RoutingWireData onShare={share} />`,
      kotlin: `RoutingWireData(onShare = ::share)`,
    },
  },
  {
    id: 'statementsExport', title: '3.3 Statements Export', subtitle: 'Cycle, format and SHA-256 seal', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `StatementsExport(cycle: .oct2024, format: .pdf)`,
      typescript: `export const StatementsExport = () => (<AuditedStatements cycle={cycle} />);`,
      reactnative: `<StatementsExport cycle={cycle} />`,
      kotlin: `StatementsExport(cycle = Cycle.OCT_2024)`,
    },
  },
  {
    id: 'historyPage', title: 'Ledger Filter Bar', subtitle: 'Date range, status and type chips', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `LedgerFilters(range: .month, status: .all)`,
      typescript: `export const LedgerFilters = () => (<Chips options={['All','Income','Spending','Pending']} />);`,
      reactnative: `<LedgerFilters status="all" />`,
      kotlin: `LedgerFilters(range = Range.MONTH, status = Status.ALL)`,
    },
  },
  {
    id: 'splash', title: 'Splash Screen', subtitle: 'Animated brand mark and loader', category: 'onboarding', badge: 'Brand',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: {
      swiftui: `SplashScreen(brand: "APEX BANK").loading(2.0)`,
      typescript: `export const SplashScreen = () => <BrandLoader />;`,
      reactnative: `<SplashScreen brand="APEX BANK" />`,
      kotlin: `SplashScreen(brand = "APEX BANK", delayMs = 2000)`,
    },
  },
  {
    id: 'profile', title: 'Profile Identity Card', subtitle: 'Avatar, KYC level and account tier', category: 'security', badge: 'KYC',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `ProfileCard(kyc: .verified, tier: 2)`,
      typescript: `export const ProfileCard = ({ user }) => (<Card><Avatar /><KycBadge level={2} /></Card>);`,
      reactnative: `<ProfileCard user={user} tier={2} />`,
      kotlin: `ProfileCard(kyc = KYC.VERIFIED, tier = 2)`,
    },
  },
  {
    id: 'freezeCard', title: 'Freeze Card Toggle', subtitle: 'Instantly block card transactions', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `FreezeCard(isFrozen: state.frozen, onChange: card.freeze)`,
      typescript: `export const FreezeCard = ({ frozen, onChange }) => (<Switch checked={frozen} onChange={onChange} />);`,
      reactnative: `<FreezeCard frozen={frozen} onChange={setFrozen} />`,
      kotlin: `FreezeCard(isFrozen = state.frozen, onChange = card::freeze)`,
    },
  },
];

export const APP_KINDS: { id: AppKind; label: string; blurb: string }[] = [
  { id: 'banking', label: 'Banking app', blurb: 'Retail bank with accounts, cards and transfers' },
  { id: 'wallet', label: 'Digital wallet', blurb: 'P2P wallet with virtual cards and top-ups' },
  { id: 'crypto', label: 'Crypto exchange', blurb: 'Spot swaps, multi-chain balances and custody' },
];

export const PAGES: { id: PageId; label: string; modules: ModuleId[] }[] = [
  { id: 'signin', label: 'Sign In', modules: ['signin'] },
  { id: 'home', label: 'Home', modules: ['headerGreeting', 'accounts', 'cashflow', 'transfers', 'vaults', 'cards'] },
  { id: 'accounts', label: 'Accounts', modules: ['accountPortfolio', 'routingWireData', 'statementsExport'] },
  { id: 'transfers', label: 'Transfers', modules: ['directTransferEngine', 'multiMarketFX', 'recurringStanding', 'authorizationModal'] },
  { id: 'send', label: 'Send', modules: ['recentRecipients', 'beneficiaryValidation', 'sendMoneyAmount', 'transferSuccess'] },
  { id: 'payments', label: 'Payments', modules: ['peerInvoicing', 'paymentQR', 'splitPayment', 'outstandingReceivables'] },
  { id: 'cards', label: 'Cards', modules: ['cardPreview', 'cardControls', 'pinVault'] },
  { id: 'history', label: 'Transaction history', modules: ['historyPage', 'cards', 'analytics'] },
  { id: 'notifications', label: 'Notifications', modules: ['alertCenter', 'deliveryChannels'] },
  { id: 'profile', label: 'Profile and security', modules: ['identityCard', 'securityBaseline', 'connectedDevices'] },
  { id: 'splash', label: 'Splash Screens', modules: ['splash'] },
];

export const PAGE_TO_TAB: Record<PageId, TabId> = {
  signin: 'home', home: 'home', accounts: 'home', transfers: 'home', send: 'send', payments: 'home',
  cards: 'cards', history: 'activity', notifications: 'home', profile: 'settings', splash: 'home',
};
export const TAB_TO_PAGE: Record<TabId, PageId> = {
  home: 'home', cards: 'cards', activity: 'history', settings: 'profile', send: 'send', fx: 'home',
};
export const SINGLE_SLOT: Partial<Record<PageId, boolean>> = { transfers: true };

export const INITIAL_BALANCE = 25000.4;
export const INITIAL_INCOME = 20000;
export const INITIAL_OUTCOME = 17000;
export const FX_RATE = 0.9245;
export const HISTORY_LIMIT = 20;

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', name: 'Apple Flagship Store', sub: 'Gadgets · Today, 10:24 AM', amount: 149, method: 'Visa - #022', kind: 'out' },
  { id: 't2', name: 'Stripe Payout', sub: 'Income · Today, 08:30 AM', amount: 4200, method: 'Bank - #118', kind: 'in' },
  { id: 't3', name: 'AWS Hosting', sub: 'Cloud · Yesterday, 6:12 PM', amount: 240.5, method: 'Visa - #022', kind: 'out' },
];
export const INITIAL_SAVINGS: SavingsGoal[] = [
  { id: 'iphone', name: 'iPhone 13 Mini', amount: 699 },
  { id: 'macbook', name: 'Macbook Pro M1', amount: 1499 },
];

/* ─────────────────────────── helpers ─────────────────────────── */

export const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
export const whole = (n: number) => `$ ${Math.round(n).toLocaleString('en-US')}`;
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const parseAmount = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
export const formatAmount = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const surface = (dark: boolean) =>
  dark ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5' : 'bg-white text-slate-900 shadow-[0_6px_24px_rgba(37,52,120,0.08)]';
export const ringVar = (color: string) => ({ ['--tw-ring-color' as string]: color } as React.CSSProperties);

export const buildInitialPages = (): Record<PageId, ModuleId[]> => {
  const out = {} as Record<PageId, ModuleId[]>;
  for (const p of PAGES) out[p.id] = [];
  return out;
};

export const allModulesFor = (): ModuleAsset[] => [
  ...(CRYPTO_MODULES as unknown as ModuleAsset[]),
  ...(BANKING_WALLET_MODULES as unknown as ModuleAsset[]),
  ...availableModules,
];

export const pageModulesFor = (page: PageId, appKind: AppKind): ModuleId[] => {
  const base = PAGES.find((p) => p.id === page)?.modules ?? [];
  if (appKind === 'crypto') {
    const prepend = (CRYPTO_PAGE_PREPEND[page] ?? []) as ModuleId[];
    return [...prepend, ...base];
  }
  const prepend = (BANKING_WALLET_PAGE_PREPEND[page] ?? []) as ModuleId[];
  return [...prepend, ...base];
};

export const moduleFor = (id: ModuleId) => allModulesFor().find((m) => m.id === id);

/* ─────────────────────────── view context ─────────────────────────── */

export interface ViewActions {
  send: () => void; payments: () => void; payBill: () => void; topUp: () => void;
  openWallet: () => void; openFx: () => void; openHistory: () => void;
  seeAllSavings: () => void; deposit: (goalId: string) => void;
  toggleFaceId: () => void; openAlerts: () => void;
  signIn: () => void; skipSignIn: () => void;
  quickSignIn: (p: 'google' | 'facebook' | 'apple' | 'phone') => void;
  toggleFreeze: () => void;
}

export interface ViewCtx {
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

export function HeaderGreetingBar({ ctx }: { ctx: ViewCtx }) {
  const avatarBg = useModuleColor('avatarBg', ctx.accent);
  const greeting = useModuleText('greeting', 'Good morning');
  const name     = useModuleText('name', 'Krishnan');
  const avatar   = useModuleText('avatar', 'K');

  return (
    <div className="flex items-center justify-between px-1 pb-2 pt-1.5">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white"
             style={{ background: avatarBg }}>
          {avatar}
        </div>
        <div className="leading-tight">
          <EditableText slot="greeting" fallback={greeting}
            className="block text-[8px] text-slate-400" />
          <EditableText slot="name" fallback={name}
            className={`block text-[11px] font-semibold ${ctx.isDark ? 'text-slate-100' : 'text-slate-900'}`} />
        </div>
      </div>
      <button className={`relative grid h-6 w-6 place-items-center rounded-full ${ctx.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        <Bell className="h-[14px] w-[14px]" />
        <span className={`absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ${ctx.isDark ? 'ring-slate-950' : 'ring-[#F7F8FF]'}`} />
      </button>
    </div>
  );
}

const noop = () => {};
export const noopActions: ViewActions = {
  send: noop, payments: noop, payBill: noop, topUp: noop, openWallet: noop, openFx: noop,
  openHistory: noop, seeAllSavings: noop, deposit: noop, toggleFaceId: noop, openAlerts: noop,
  signIn: noop, skipSignIn: noop, quickSignIn: noop, toggleFreeze: noop,
};

/* ─────────────────────────── shared UI ─────────────────────────── */

export function Tap({ ctx, onClick, label, className = '', children }: { ctx: ViewCtx; onClick: () => void; label: string; className?: string; children: React.ReactNode }) {
  if (!ctx.interactive) return <div className={className}>{children}</div>;
  return (
    <button type="button" onClick={onClick} aria-label={label} style={ringVar(ctx.accent)}
      className={`cursor-pointer text-left outline-none transition motion-safe:active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-1 ${className}`}>
      {children}
    </button>
  );
}

export function Switch({ checked, onChange, label, accent, interactive = true }: { checked: boolean; onChange: () => void; label: string; accent: string; interactive?: boolean }) {
  const track = (
    <span className={`relative inline-block h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${checked ? '' : 'bg-slate-300'}`}
      style={checked ? { background: accent } : undefined}>
      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </span>
  );
  if (!interactive) return track;
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} style={ringVar(accent)}
      className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">{track}</button>
  );
}

export function SectionHeader({ ctx, title, action, onAction }: { ctx: ViewCtx; title: string; action?: React.ReactNode; onAction?: () => void }) {
  return (
    <div className="mb-2.5 flex items-center justify-between px-0.5">
      <h3 className="text-[13px] font-semibold">{title}</h3>
      {action && (
        <Tap ctx={ctx} onClick={onAction ?? noop} label={title} className="flex items-center text-[11px] font-semibold">
          <span className="flex items-center" style={{ color: ctx.accent }}>{action}</span>
        </Tap>
      )}
    </div>
  );
}

export function ModuleHeader({ ctx, code, title }: { ctx: ViewCtx; code: string; title: string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ctx.accent }}>{code}</p>
        <GripVertical className="h-3.5 w-3.5 text-slate-300" aria-hidden />
      </div>
      <p className="text-[14px] font-bold">{title}</p>
    </>
  );
}

/* ─────────────────────────── modules ─────────────────────────── */

export function BalanceCard({ ctx }: { ctx: ViewCtx }) {
  const bg     = useModuleColor('bg', INK);
  const accent = useModuleColor('accent', ctx.accent);
  const ctaBg  = useModuleColor('ctaBg', '#FFFFFF');

  return (
    <div className={`relative h-[132px] overflow-hidden p-5 text-white ${ctx.radius.card} ${ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_10px_28px_rgba(20,20,40,0.22)]'}`}
         style={{ background: bg }}>
      <span aria-hidden className="absolute -right-7 -top-7 h-[84px] w-[84px] rounded-full" style={{ background: accent }} />
      <div className="relative">
        <EditableText slot="label" fallback="Total Balance" className="block text-[10px] text-white/60" />
        <EditableText slot="balance" fallback={usd(ctx.balance)}
          className="mt-1 block text-[26px] font-bold leading-none tracking-tight" />
      </div>
      <Tap ctx={ctx} onClick={ctx.actions.openWallet} label="Open wallet"
           className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-semibold">
        <EditableText slot="cta" fallback="My Wallet" />
        <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: ctaBg, color: INK }}>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Tap>
    </div>
  );
}

export function CashflowStrip({ ctx }: { ctx: ViewCtx }) {
  const bg          = useModuleColor('bg', INK);
  const incomeTint  = useModuleColor('incomeTint', '#10B981');
  const outcomeTint = useModuleColor('outcomeTint', '#F43F5E');
  return (
    <div className={`relative grid grid-cols-2 overflow-hidden text-white ${ctx.radius.card} ${ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_8px_22px_rgba(20,20,40,0.18)]'}`} style={{ background: bg }}>
      <span aria-hidden className="absolute -left-4 -top-4 h-10 w-10 rounded-full bg-violet-500/30" />
      <span aria-hidden className="absolute -bottom-4 -right-4 h-10 w-10 rounded-full bg-amber-700/40" />
      <div className="relative flex items-center gap-2.5 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: `${incomeTint}22`, color: incomeTint }}>
          <ArrowDown className="h-4 w-4" />
        </span>
        <div>
          <EditableText slot="incomeLabel" fallback="Income" className="block text-[9px] text-white/50" />
          <EditableText slot="incomeValue" fallback={whole(ctx.income)} className="text-[12px] font-semibold" />
        </div>
      </div>
      <div className="relative flex items-center gap-2.5 border-l border-white/10 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: `${outcomeTint}22`, color: outcomeTint }}>
          <ArrowUp className="h-4 w-4" />
        </span>
        <div>
          <EditableText slot="outcomeLabel" fallback="Outcome" className="block text-[9px] text-white/50" />
          <EditableText slot="outcomeValue" fallback={whole(ctx.outcome)} className="text-[12px] font-semibold" />
        </div>
      </div>
    </div>
  );
}

export function QuickActions({ ctx }: { ctx: ViewCtx }) {
  const items = [
    { label: 'Send', Icon: Send, color: ctx.accent, run: ctx.actions.send },
    { label: 'Payments', Icon: ArrowDownLeft, color: GREEN, run: ctx.actions.payments },
    { label: 'Pay Bill', Icon: Receipt, color: YELLOW, run: ctx.actions.payBill },
    { label: 'Top Up', Icon: PlusCircle, color: PINK, run: ctx.actions.topUp },
  ];
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {items.map(({ label, Icon, color, run }) => (
        <Tap key={label} ctx={ctx} onClick={run} label={label} className={`flex w-full flex-col items-center gap-2 py-3.5 ${ctx.radius.tile} ${surface(ctx.isDark)}`}>
          <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.75} />
          <span className="text-[10px] font-semibold">{label}</span>
        </Tap>
      ))}
    </div>
  );
}

export function SavingsCards({ ctx }: { ctx: ViewCtx }) {
  return (
    <section>
      <SectionHeader ctx={ctx} title="Savings" action="See All" onAction={ctx.actions.seeAllSavings} />
      <div className="grid grid-cols-2 gap-3">
        {ctx.savings.map((g) => (
          <Tap key={g.id} ctx={ctx} onClick={() => ctx.actions.deposit(g.id)} label={`Add $100 to ${g.name}`} className={`w-full p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate">{g.name}</span><ChevronRight className="h-3 w-3 shrink-0" />
            </div>
            <p className="mt-4 text-[15px] font-bold">${g.amount.toLocaleString('en-US')}</p>
          </Tap>
        ))}
      </div>
    </section>
  );
}

export function TxRow({ tx, ctx }: { tx: Transaction; ctx: ViewCtx }) {
  const isIn = tx.kind === 'in';
  return (
    <div className={`flex items-center justify-between gap-3 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center ${ctx.radius.icon} ${isIn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          {isIn ? <ArrowDownLeft className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold">{tx.name}</p>
          <p className="truncate text-[9px] text-slate-400">{tx.sub}</p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-[12px] font-bold ${isIn ? 'text-emerald-600' : ''}`}>{isIn ? '+' : '-'} {usd(tx.amount)}</p>
        <p className="text-[9px] text-slate-400">{tx.method}</p>
      </div>
    </div>
  );
}

export function RecentActivity({ ctx }: { ctx: ViewCtx }) {
  const rows = ctx.transactions.slice(0, ctx.interactive ? 3 : 1);
  return (
    <section>
      <SectionHeader ctx={ctx} title="Recent Activity" action={<><span>View History</span><ChevronRight className="h-3 w-3" /></>} onAction={ctx.actions.openHistory} />
      <div className="space-y-2.5">{rows.map((t) => <TxRow key={t.id} tx={t} ctx={ctx} />)}</div>
    </section>
  );
}

export function FxWallets({ ctx }: { ctx: ViewCtx }) {
  const wallets = [['USD', '$18.2k'], ['EUR', '€6.4k'], ['GBP', '£2.1k']];
  return (
    <section>
      <SectionHeader ctx={ctx} title="Wallets" action="Convert" onAction={ctx.actions.openFx} />
      <div className="grid grid-cols-3 gap-2.5">
        {wallets.map(([code, value]) => (
          <Tap key={code} ctx={ctx} onClick={ctx.actions.openFx} label={`Convert from ${code} wallet`} className={`w-full p-3 ${ctx.radius.tile} ${surface(ctx.isDark)}`}>
            <p className="text-[9px] font-medium text-slate-400">{code}</p>
            <p className="mt-1.5 text-[13px] font-bold">{value}</p>
          </Tap>
        ))}
      </div>
    </section>
  );
}

export function SpendingCard({ ctx }: { ctx: ViewCtx }) {
  const bars = [40, 65, 48, 80, 55, 35];
  return (
    <div className={`p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-start justify-between">
        <div><p className="text-[10px] text-slate-400">Monthly spending</p><p className="mt-1 text-[18px] font-bold">$4,820</p></div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">-12.4% vs last month</span>
      </div>
      <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden>
        {bars.map((h, i) => <span key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === bars.length - 1 ? ctx.accent : `${ctx.accent}33` }} />)}
      </div>
    </div>
  );
}

export function SecurityRow({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center bg-emerald-50 text-emerald-600 ${ctx.radius.icon}`}><ShieldCheck className="h-4 w-4" /></span>
        <div><p className="text-[12px] font-semibold">Face ID</p><p className="text-[9px] text-slate-400">{ctx.faceId ? 'Required for transfers' : 'Turned off'}</p></div>
      </div>
      <Switch checked={ctx.faceId} onChange={ctx.actions.toggleFaceId} label="Face ID" accent={ctx.accent} interactive={ctx.interactive} />
    </div>
  );
}

export function AlertsRow({ ctx }: { ctx: ViewCtx }) {
  return (
    <Tap ctx={ctx} onClick={ctx.actions.openAlerts} label="Open alerts" className={`flex w-full items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`relative grid h-9 w-9 place-items-center bg-amber-50 text-amber-600 ${ctx.radius.icon}`}>
          <Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-white" style={{ background: PINK }} />
        </span>
        <div><p className="text-[12px] font-semibold">3 new alerts</p><p className="text-[9px] text-slate-400">Stripe payout received</p></div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
    </Tap>
  );
}

/* Quick SVGs for sign-in */
function GoogleSvg({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.5 29.3 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11.3 0 20.5-9.2 20.5-20.5 0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M5.3 14.7l6.6 4.8C13.6 15.1 18.4 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 5.5 29.3 3.5 24 3.5c-7.4 0-13.8 4.1-17.1 10.2z" />
      <path fill="#4CAF50" d="M24 44.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.8 40.1 16.3 44.5 24 44.5z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.2C42.2 35.6 44.5 30.2 44.5 24c0-1.3-.1-2.6-.9-3.9z" />
    </svg>
  );
}
function FacebookSvg({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#1877F2" aria-hidden>
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.384C19.612 22.954 24 17.99 24 12z" />
    </svg>
  );
}
function AppleSvg({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function SignInCard({ ctx }: { ctx: ViewCtx }) {
  const fieldCls = `flex items-center gap-2 border px-3 py-2.5 ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`;
  return (
    <div className={`space-y-3 p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div>
        <label className="mb-1 block text-[10px] font-semibold">Email</label>
        <div className={fieldCls}><Mail className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] text-slate-400">Enter Your Email</span></div>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold">Password</label>
        <div className={fieldCls}><Lock className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] text-slate-400">Enter Your Password</span></div>
      </div>
      <p className="cursor-pointer text-[11px] font-bold underline">Forgot Password?</p>
      <div className={`flex items-center justify-between border px-3 py-2.5 ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex items-center gap-2 text-slate-500">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M4 2 19 12 12.5 13.5 9.5 20Z" /></svg>
          <span className="text-[10px] font-medium">Click to start verification</span>
        </div>
        <div className="grid h-5 w-5 place-items-center rounded bg-black text-white"><Check className="h-3 w-3" /></div>
      </div>
      <Tap ctx={ctx} onClick={ctx.actions.signIn} label="Sign in" className="block w-full">
        <span className={`block w-full py-2.5 text-center text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: 'linear-gradient(to bottom, #374151, #111827)' }}>Sign in</span>
      </Tap>
      <Tap ctx={ctx} onClick={ctx.actions.skipSignIn} label="Skip for now" className="block w-full">
        <span className={`block w-full border py-2.5 text-center text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>Skip for now</span>
      </Tap>
      <div className={`flex items-end justify-between gap-2 border-t pt-3 ${ctx.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div>
          <p className="text-[10px] text-slate-500">Don't have an account?</p>
          <p className="cursor-pointer text-[11px] font-bold underline">Sign up</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-400">Quick Login:</span>
          <Tap ctx={ctx} onClick={() => ctx.actions.quickSignIn('google')} label="Continue with Google" className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white"><GoogleSvg /></Tap>
          <Tap ctx={ctx} onClick={() => ctx.actions.quickSignIn('facebook')} label="Continue with Facebook" className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white"><FacebookSvg /></Tap>
          <Tap ctx={ctx} onClick={() => ctx.actions.quickSignIn('apple')} label="Continue with Apple" className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-900"><AppleSvg /></Tap>
          <Tap ctx={ctx} onClick={() => ctx.actions.quickSignIn('phone')} label="Continue with phone" className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-700"><Phone className="h-3.5 w-3.5" /></Tap>
        </div>
      </div>
    </div>
  );
}

export function AccountPortfolio({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    { name: 'Everyday Checking', right: '··· 4912', bal: '$12,450.20', badge: 'Active', badgeColor: 'text-emerald-600' },
    { name: 'High-Yield Savings', right: '4.85% APY', bal: '$11,200.00', badge: 'Tier 1 Pot', badgeColor: 'text-slate-500' },
    { name: 'Euro Travel Wallet', right: 'EUR', bal: '€1,200.00', badge: 'IBAN DE89…', badgeColor: 'text-slate-500' },
  ];
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="3.1 My Accounts" title="Account Portfolio" />
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold">{r.name}</p>
              <p className="text-[9px] text-slate-400">{r.right}</p>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-[16px] font-bold">{r.bal}</p>
              <p className={`text-[9px] font-semibold ${r.badgeColor}`}>{r.badge}</p>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={`w-full flex items-center justify-center gap-1 py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
        <Plus className="h-3 w-3" /> Open New Pocket
      </button>
    </div>
  );
}

export function RoutingWireData({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="3.2 Account Details" title="Routing & Wire Data" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <p className="text-[9px] text-slate-400">Account Holder</p>
        <p className="mt-0.5 text-[11px] font-semibold">Alex Rivera · Apex Holdings LLC</p>
      </div>
      {[{ label: 'ACH Routing Number', value: '021000021' }, { label: 'Account Number', value: '884920194821' }].map((row) => (
        <div key={row.label} className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div>
            <p className="text-[9px] text-slate-400">{row.label}</p>
            <p className="mt-0.5 font-mono text-[11px] font-bold">{row.value}</p>
          </div>
          <button type="button" aria-label={`Copy ${row.label}`} className={`grid h-7 w-7 place-items-center ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-600 shadow-sm'}`}>
            <Copy className="h-3 w-3" />
          </button>
        </div>
      ))}
      <button type="button" className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: '#C026D3' }}>
        <Share2 className="h-3 w-3" /> Share Bank Details
      </button>
    </div>
  );
}

export function StatementsExport({ ctx }: { ctx: ViewCtx }) {
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="3.3 Statements Export" title="Monthly Audited Files" />
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Select Statement Cycle</p>
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <span className="text-[11px]">October 2024 (Current)</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </div>
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Format</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setFormat('pdf')}
            className={`py-2 text-[11px] font-bold ${ctx.radius.icon} ${format === 'pdf' ? 'text-white' : ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
            style={format === 'pdf' ? { background: '#0284C7' } : undefined}>PDF Format</button>
          <button type="button" onClick={() => setFormat('csv')}
            className={`py-2 text-[11px] font-bold ${ctx.radius.icon} ${format === 'csv' ? 'text-white' : ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
            style={format === 'csv' ? { background: '#0284C7' } : undefined}>CSV Sheet</button>
        </div>
      </div>
      <div className={`flex items-start gap-2 p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-blue-50'}`}>
        <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-[9px] leading-relaxed text-slate-600 dark:text-slate-300">Cryptographically sealed with SHA-256 for tax filing</p>
      </div>
      <button type="button" className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <Download className="h-3 w-3" /> Download {format === 'pdf' ? 'PDF (1.2 MB)' : 'CSV'}
      </button>
    </div>
  );
}

export function CardPreview({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`relative h-[132px] overflow-hidden p-5 text-white ${ctx.radius.card} ${ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_10px_28px_rgba(20,20,40,0.22)]'}`}
      style={{ background: INK }}>
      <span aria-hidden className="absolute -right-7 -top-7 h-[84px] w-[84px] rounded-full" style={{ background: ctx.accent }} />
      <div className="relative">
        <p className="text-[10px] text-white/60">Total Balance</p>
        <p className="mt-1 text-[26px] font-bold leading-none tracking-tight">{usd(ctx.balance)}</p>
      </div>
      <Tap ctx={ctx} onClick={ctx.actions.openWallet} label="Open wallet" className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-semibold">
        My Wallet
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white" style={{ color: INK }}><ArrowRight className="h-3.5 w-3.5" /></span>
      </Tap>
    </div>
  );
}

export function CardControls({ ctx }: { ctx: ViewCtx }) {
  const [frozen, setFrozen] = useState(false);
  const [online, setOnline] = useState(true);
  const [nfc, setNfc] = useState(true);
  const items = [
    { key: 'freeze', label: 'Freeze Card', Icon: Snowflake, value: frozen, set: setFrozen },
    { key: 'online', label: 'Online Payments', Icon: Globe, value: online, set: setOnline },
    { key: 'nfc', label: 'Contactless (NFC)', Icon: Wifi, value: nfc, set: setNfc },
  ];
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="7.2 Card Controls" title="Security Switches" />
      <div className="space-y-2">
        {items.map(({ key, label, Icon, value, set }) => (
          <div key={key} className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2"><Icon className="h-4 w-4" /><span className="text-[11px] font-medium">{label}</span></div>
            <Switch checked={value} onChange={() => set(!value)} label={label} accent={ctx.accent} interactive={ctx.interactive} />
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between text-[10px] mb-1"><span className="text-slate-500">Monthly Spend Limit</span><span className="font-semibold">$2,500 / $5,000</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full" style={{ width: '50%', background: ctx.accent }} /></div>
      </div>
      <p className="text-center text-[9px] text-slate-400">Limits reset in 8 days</p>
    </div>
  );
}

export function PinVault({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="7.3 Card Security" title="PIN Vault & Replacement" />
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center">
        <Fingerprint className="h-8 w-8 text-slate-600" />
        <p className="text-[12px] font-semibold">Hold to View PIN</p>
        <p className="text-[9px] text-slate-500">Reveals physical terminal code</p>
      </div>
      <button type="button" className={`w-full flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-2"><Lock className="h-4 w-4" /><span className="text-[11px] font-semibold">Change PIN</span></div>
        <ChevronRight className="h-3 w-3 text-slate-400" />
      </button>
      <button type="button" className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-rose-500 ${ctx.radius.icon} ${ctx.isDark ? 'bg-rose-900/20' : 'bg-rose-50'}`}>
        <AlertCircle className="h-3.5 w-3.5" /> Report Lost or Stolen
      </button>
    </div>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />
    </svg>
  );
}

export function AlertCenter({ ctx }: { ctx: ViewCtx }) {
  const items = [
    { title: 'Payment Received: $4,250.00', sub: 'Your employer deposited funds via FedACH.', time: '10m ago', tone: 'blue', Icon: DollarIcon },
    { title: 'New Login from Chrome Mac', sub: 'New York, US · IP 192.88.21.0', time: '2h ago', tone: 'gray', Icon: ShieldCheck },
    { title: 'October Statement Ready', sub: 'Your monthly checking statement is ready.', time: '1d ago', tone: 'gray', Icon: FileText },
  ] as const;
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="9.1 Alert Feed" title="Alert Center" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.title} className={`flex items-start gap-2.5 p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center ${ctx.radius.icon} ${item.tone === 'blue' ? 'bg-blue-700 text-white' : ctx.isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'}`}>
              <item.Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold">{item.title}</p>
              <p className="text-[9px] leading-snug text-slate-500">{item.sub}</p>
              <p className="mt-0.5 text-[8px] text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] font-semibold" style={{ color: ctx.accent }}>Mark all as read</p>
    </div>
  );
}

export function DeliveryChannels({ ctx }: { ctx: ViewCtx }) {
  const [large, setLarge] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [security, setSecurity] = useState(true);
  const items = [
    { key: 'large', title: 'Push Alerts for Large Payments', sub: 'Notify when debit exceeds $10.00', value: large, set: setLarge },
    { key: 'weekly', title: 'Weekly Spending Digest', sub: 'Summary sent Sunday evening', value: weekly, set: setWeekly },
    { key: 'security', title: 'Security & Anomaly Warnings', sub: 'Critical unblockable security emails', value: security, set: setSecurity },
  ];
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="9.2 Preferences" title="Delivery Channels" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="min-w-0"><p className="text-[11px] font-semibold">{item.title}</p><p className="text-[9px] text-slate-500">{item.sub}</p></div>
            <Switch checked={item.value} onChange={() => item.set(!item.value)} label={item.title} accent={ctx.accent} interactive={ctx.interactive} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
        <span className="text-[9px] text-slate-500">Delivery via APNs & Webhook</span>
        <span className="text-[9px] font-semibold" style={{ color: ctx.accent }}>Save Rule Set</span>
      </div>
    </div>
  );
}

export function IdentityCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="10.1 Identity Card" title="" />
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-700 text-white text-lg font-bold">AR</div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5"><p className="text-[14px] font-bold">Alex Rivera</p><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /></div>
          <p className="text-[10px] text-slate-500">alex.rivera@fintech.io</p>
          <p className="mt-0.5 text-[9px] font-bold text-amber-700">BLACK MEMBER</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex justify-between text-[10px]"><span className="text-slate-500">Tax ID (SSN)</span><span className="font-mono">••••••8921</span></div>
        <div className="flex justify-between text-[10px]"><span className="text-slate-500">Residence</span><span>New York, United States</span></div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>Edit Account Identity</button>
    </div>
  );
}

export function SecurityBaseline({ ctx }: { ctx: ViewCtx }) {
  const [biometrics, setBiometrics] = useState(true);
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="10.2 Security Settings" title="Security Baseline" />
      <div className="space-y-2">
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div><p className="text-[11px] font-semibold">Password</p><p className="text-[9px] text-slate-500">Updated 3 mos ago</p></div>
          <button type="button" className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Update</button>
        </div>
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div><p className="text-[11px] font-semibold">Biometrics (Face ID)</p><p className="text-[9px] text-emerald-600">Active & Enrolled</p></div>
          <Switch checked={biometrics} onChange={() => setBiometrics(!biometrics)} label="Biometrics" accent={ctx.accent} interactive={ctx.interactive} />
        </div>
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div><p className="text-[11px] font-semibold">Hardware Authenticator</p><p className="text-[9px] text-slate-500">YubiKey 5C NFC</p></div>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>
      </div>
      <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
        <span className="text-[9px] text-slate-500">Security Score: 98%</span>
        <span className="text-[9px] font-semibold text-emerald-600">Optimal</span>
      </div>
    </div>
  );
}

export function ConnectedDevices({ ctx }: { ctx: ViewCtx }) {
  const devices = [
    { name: 'iPhone 15 Pro', sub: 'New York, US · This device', active: true, Icon: Smartphone },
    { name: 'MacBook Pro 16"', sub: 'Chrome 128 · Active 2h ago', active: false, Icon: Monitor },
  ];
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="10.3 Active Sessions" title="Connected Devices" />
      <div className="space-y-2">
        {devices.map((d) => (
          <div key={d.name} className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${d.active ? 'bg-indigo-50 dark:bg-indigo-900/20' : ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2">
              <d.Icon className="h-4 w-4" />
              <div><p className="text-[11px] font-semibold">{d.name}</p><p className="text-[9px] text-slate-500">{d.sub}</p></div>
            </div>
            {d.active ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> : <button type="button" className="text-[9px] font-semibold text-rose-500">Revoke</button>}
          </div>
        ))}
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-semibold text-rose-500 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>Log Out All Other Devices</button>
    </div>
  );
}

export function AccountsOverview({ ctx }: { ctx: ViewCtx }) {
  const rows = [['Everyday Checking', '$12,480.20', 'USD'], ['High-Yield Savings', '$8,920.00', 'USD'], ['Euro Travel Account', '€3,410.55', 'EUR']];
  return (
    <section>
      <SectionHeader ctx={ctx} title="Your accounts" action="Manage" />
      <div className="space-y-2">
        {rows.map(([name, amt, ccy]) => (
          <div key={name} className={`flex items-center justify-between p-3 ${ctx.radius.tile} ${surface(ctx.isDark)}`}>
            <div><p className="text-[11px] font-semibold">{name}</p><p className="text-[9px] text-slate-400">Available · {ccy}</p></div>
            <p className="text-[12px] font-bold">{amt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DirectTransferEngine({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.1 Transfer Form" title="Direct Transfer Engine" />
      <div>
        <p className="text-[9px] text-slate-400 mb-1">From Account</p>
        <div className={`flex items-center justify-between px-3 py-2.5 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <span className="text-[11px] font-medium">Checking (··· 4912)</span>
          <span className="text-[11px] font-bold">$12,450.20</span>
        </div>
      </div>
      <div>
        <p className="text-[9px] text-slate-400 mb-1">To Recipient</p>
        <div className={`flex items-center justify-between px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: '#3b82f6' }}>SJ</span>
            <span className="text-[11px] font-medium">Sarah Jenkins (Chase)</span>
          </div>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </div>
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Amount to Send</p>
        <p className="text-[22px] font-bold"><span className="text-slate-400 text-[14px]">$ </span>500.00</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2 ${ctx.radius.icon} border-2`} style={{ borderColor: ctx.accent, background: `${ctx.accent}10` }}>
          <p className="text-[10px] font-bold" style={{ color: ctx.accent }}>Instant FedNow</p>
          <p className="text-[8px] text-slate-500">Free · Arrives Now</p>
        </div>
        <div className={`p-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className="text-[10px] font-bold">Standard ACH</p>
          <p className="text-[8px] text-slate-500">1-2 Business Days</p>
        </div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: NAVY }}>Continue to Review</button>
    </div>
  );
}

export function MultiMarketFX({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.2 Currency Exchange" title="Mid-Market FX Swap" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between mb-1"><span className="text-[9px] text-slate-400">You send exactly</span><span className="text-[9px] text-slate-400">Fee: $0.00 USD</span></div>
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold">1,000.00</p>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md ring-1 ring-slate-200">
            <span className="text-[10px]">🇺🇸</span><span className="text-[10px] font-bold">USD</span><ChevronDown className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-slate-500 flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> 1 USD = 0.9214 EUR (1m)</span>
        <button aria-label="Swap currencies" className="grid h-6 w-6 place-items-center rounded-full" style={{ background: ctx.accent }}><RefreshCw className="h-3 w-3 text-white" /></button>
      </div>
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between mb-1"><span className="text-[9px] text-slate-400">Recipient gets</span><span className="text-[9px] text-slate-400">Live Rate</span></div>
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold text-emerald-600">921.40</p>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md ring-1 ring-slate-200">
            <span className="text-[10px]">🇪🇺</span><span className="text-[10px] font-bold">EUR</span><ChevronDown className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: '#F97316' }}>Lock Rate &amp; Exchange</button>
    </div>
  );
}

export function RecurringStanding({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.3 Scheduled Transfer" title="Recurring Standing Order" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md text-white" style={{ background: NAVY }}><Landmark className="h-4 w-4" /></span>
            <div><p className="text-[11px] font-bold">Prime Manhattan Realty</p><p className="text-[8px] text-slate-500">Monthly Rent · #402</p></div>
          </div>
          <span className="h-3 w-3 rounded-sm" style={{ background: NAVY }} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
          <div><p className="text-[8px] text-slate-400">Amount</p><p className="text-[11px] font-bold">$2,100.00 / mo</p></div>
          <div className="text-right"><p className="text-[8px] text-slate-400">Next Run</p><p className="text-[11px] font-bold">Nov 1, 2024</p></div>
        </div>
      </div>
      <p className="flex items-center gap-1 text-[9px] text-slate-500"><Clock className="h-3 w-3" /> Automatic notification 24h prior</p>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>Modify Schedule Rules</button>
    </div>
  );
}

export function AuthorizationModal({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.4 Authorization Modal" title="" />
      <p className="text-center text-[10px] uppercase tracking-wider text-slate-400">Payment Review</p>
      <p className="text-center text-[26px] font-bold">$500.00</p>
      <p className="text-center text-[10px] text-slate-400">to Sarah Jenkins · Chase Bank</p>
      <div className="space-y-1.5 border-t border-slate-200 pt-2 dark:border-slate-700">
        <div className="flex justify-between text-[10px]"><span className="text-slate-400">Network Fee</span><span className="text-emerald-600 font-semibold">Free (FedNow)</span></div>
        <div className="flex justify-between text-[10px]"><span className="text-slate-400">Estimated Delivery</span><span className="font-semibold">Within seconds</span></div>
        <div className="flex justify-between text-[10px]"><span className="text-slate-400">Origin Account</span><span className="font-semibold">··· 4912</span></div>
      </div>
      <button type="button" className={`w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: '#14B8A6' }}>
        <Lock className="h-3 w-3" /> Authorize Transfer ($500.00)
      </button>
      <p className="text-center text-[9px] text-slate-400">Cancel transaction</p>
    </div>
  );
}

export function RecentRecipients({ ctx }: { ctx: ViewCtx }) {
  const contacts = [
    { initials: 'SJ', name: 'Sarah J.', color: 'bg-blue-500', ring: true },
    { initials: 'MC', name: 'Marcus', color: 'bg-indigo-400', ring: false },
    { initials: 'ER', name: 'Elena', color: 'bg-emerald-400', ring: false },
  ];
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="5.1 Recent Recipients" title="One-Tap Contacts Dock" />
      <div className="grid grid-cols-4 items-start gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-dashed border-slate-300"><Plus className="h-4 w-4 text-slate-400" /></div>
          <span className="text-[9px] text-slate-500">Add New</span>
        </div>
        {contacts.map((c) => (
          <div key={c.name} className="flex flex-col items-center gap-1.5">
            <div className={`grid h-11 w-11 place-items-center rounded-full text-[11px] font-bold text-white ${c.color} ${c.ring ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}>{c.initials}</div>
            <span className="text-[9px] font-medium">{c.name}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
        <span className="text-[9px] text-slate-500">Synced with Device Contacts</span>
        <span className="text-[9px] font-semibold" style={{ color: ctx.accent }}>Manage (24)</span>
      </div>
    </div>
  );
}

export function BeneficiaryValidation({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="5.2 Add Recipient" title="Beneficiary Validation" />
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Legal Full Name</p>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}><span className="text-[11px] text-slate-400">e.g. Liam Gallagher</span></div>
      </div>
      <div>
        <div className="flex justify-between mb-1"><p className="text-[9px] text-slate-400">Routing Number or SWIFT</p><p className="text-[9px] font-semibold text-emerald-600">Auto-detected: Chase</p></div>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}><span className="text-[11px]">021000021</span></div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: NAVY }}>Save Beneficiary</button>
    </div>
  );
}

export function SendMoneyAmount({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="5.3 Send Money Focus" title="" />
      <p className="text-center text-[9px] uppercase tracking-wider text-slate-400">Amount to Dispatch</p>
      <p className="text-center text-[36px] font-bold leading-none">$120.00</p>
      <div className={`flex items-center gap-2 px-3 py-2.5 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <Pencil className="h-3 w-3 text-slate-400" /><span className="text-[11px]">Dinner &amp; drinks 🍕</span>
      </div>
      <button type="button" className={`flex w-full items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: NAVY }}>
        <ArrowRight className="h-3 w-3" /> Review Payment
      </button>
    </div>
  );
}

export function TransferSuccess({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 text-center ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="5.4 Transfer Success" title="" />
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100">
        <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-emerald-600"><Check className="h-4 w-4 text-emerald-600" /></div>
      </div>
      <p className="text-[16px] font-bold">Transfer Dispatched!</p>
      <p className="text-[10px] text-slate-500">$120.00 sent to Sarah Jenkins</p>
      <p className="font-mono text-[9px] text-slate-400">TXID: #US-99214-88A</p>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button type="button" className={`flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-800'}`}><Send className="h-3 w-3" /> Share</button>
        <button type="button" className={`py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: '#3B82F6' }}>Done</button>
      </div>
    </div>
  );
}

export function PeerInvoicing({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="6.1 Request Money" title="Peer Invoicing" />
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Requested Amount</p>
        <div className={`flex items-baseline gap-2 px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <span className="text-[14px] text-slate-400">$</span><span className="text-[18px] font-bold">75.00</span>
        </div>
      </div>
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Purpose Note</p>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}><span className="text-[11px]">Concert tickets 🎫</span></div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: NAVY }}>Send Request</button>
    </div>
  );
}

export function PaymentQR({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 text-center ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="6.2 Payment QR" title="" />
      <div className={`mx-auto grid h-32 w-32 place-items-center bg-white ring-2 ${ctx.radius.icon}`} style={{ '--tw-ring-color': ctx.accent } as React.CSSProperties}><QrCode className="h-24 w-24 text-slate-900" /></div>
      <p className="text-[11px] font-semibold">Scan to pay Alex Rivera</p>
      <p className="text-[9px] text-slate-400">Custom fixed amount: $75.00</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={`py-2 text-[10px] font-semibold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>Download QR</button>
        <button type="button" className={`py-2 text-[10px] font-bold text-white ${ctx.radius.icon}`} style={{ background: '#1E40AF' }}>Copy Link</button>
      </div>
    </div>
  );
}

export function SplitPayment({ ctx }: { ctx: ViewCtx }) {
  const rows = [
    { name: 'You (Alex)', label: 'Paid ($60)', paid: true },
    { name: 'Mike Henderson', label: 'Request $60', paid: false },
    { name: 'Jessica Taylor', label: 'Request $60', paid: false },
  ];
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="6.3 Split Payment" title="" />
      <div className="flex items-end justify-between">
        <div><p className="text-[9px] text-slate-400">Total Bill</p><p className="text-[20px] font-bold">$180.00</p></div>
        <div className="text-right"><p className="text-[9px] text-slate-400">Split 3 ways</p><p className="text-[16px] font-bold" style={{ color: ctx.accent }}>$60.00 each</p></div>
      </div>
      <div className="space-y-1.5">
        {rows.map((p) => (
          <div key={p.name} className={`flex items-center justify-between px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${p.paid ? 'bg-emerald-500' : ''}`} style={!p.paid ? { background: ctx.accent } : undefined} />
              <span className="text-[11px] font-medium">{p.name}</span>
            </div>
            <span className={`text-[9px] ${p.paid ? 'text-slate-500' : 'font-semibold'}`} style={!p.paid ? { color: ctx.accent } : undefined}>{p.label}</span>
          </div>
        ))}
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: NAVY }}>Send 2 Requests ($120.00)</button>
    </div>
  );
}

export function OutstandingReceivables({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="6.4 Pending Tracker" title="Outstanding Receivables" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div><p className="text-[11px] font-semibold">Mike Henderson</p><p className="text-[9px] text-slate-500">Pending 2 days · $45.00</p></div>
          <button className="rounded-md bg-white px-3 py-1 text-[9px] font-bold shadow-sm" style={{ color: ctx.accent }}>Remind</button>
        </div>
      </div>
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div><p className="text-[11px] font-semibold">Jessica Taylor</p><p className="text-[9px] text-emerald-600">Paid today · $120.00</p></div>
          <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-emerald-500"><Check className="h-3 w-3 text-emerald-500" /></div>
        </div>
      </div>
      <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
        <span className="text-[9px] text-slate-500">Total outstanding: $45.00</span>
        <span className="text-[9px] font-semibold" style={{ color: ctx.accent }}>Clear Settled</span>
      </div>
    </div>
  );
}

export function HistoryFilters({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-2 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-2"><Search className="h-3.5 w-3.5 text-slate-400" /><span className="text-[10px] text-slate-400">Search transactions…</span></div>
      <div className="flex gap-1.5 overflow-hidden">
        {['All', 'Income', 'Spending', 'Pending'].map((chip, i) => (
          <span key={chip} className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${i === 0 ? 'text-white' : 'text-slate-500'} ${i === 0 ? '' : ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`} style={i === 0 ? { background: ctx.accent } : undefined}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

export function SplashCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex h-[240px] flex-col items-center justify-center gap-3 ${ctx.radius.card} ${ctx.isDark ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-slate-900 text-white'}`}>
      <span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-white" style={{ background: ctx.accent }}>A</span>
      <p className="text-[13px] font-bold tracking-wide text-white">APEX BANK</p>
      <span className="h-1 w-16 overflow-hidden rounded-full bg-white/20"><span className="block h-full w-1/2 rounded-full" style={{ background: ctx.accent }} /></span>
    </div>
  );
}

export function ProfileCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white" style={{ background: ctx.accent }}>U</span>
        <div><p className="text-[12px] font-semibold">User Name</p><p className="text-[9px] text-slate-400">user@apex.bank</p></div>
      </div>
      <div className="flex gap-1.5">
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">KYC Verified</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-600">Tier 2</span>
      </div>
    </div>
  );
}

export function FreezeCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center bg-sky-50 text-sky-600 ${ctx.radius.icon}`}><Snowflake className="h-4 w-4" /></span>
        <div><p className="text-[12px] font-semibold">Freeze Card</p><p className="text-[9px] text-slate-400">{ctx.isCardFrozen ? 'Card is frozen' : 'Block instant transactions'}</p></div>
      </div>
      <Switch checked={ctx.isCardFrozen} onChange={ctx.actions.toggleFreeze} label="Freeze card" accent={ctx.accent} interactive={ctx.interactive} />
    </div>
  );
}

/* ─────────────────────────── dispatcher ─────────────────────────── */

export function ModuleView({ id, ctx, passive }: { id: ModuleId; ctx: ViewCtx; passive?: boolean }) {
  return (
    <ModuleScope moduleId={id} passive={passive}>
      <ModuleViewInner id={id} ctx={ctx} />
    </ModuleScope>
  );
}

function ModuleViewInner({ id, ctx }: { id: ModuleId; ctx: ViewCtx }) {
  if (CRYPTO_MODULE_IDS.has(id)) return <CryptoModuleView id={id} ctx={ctx} />;
  if (BANKING_WALLET_MODULE_IDS.has(id)) return <BankingWalletModuleView id={id} ctx={ctx} />;

  switch (id) {
    case 'headerGreeting': return <HeaderGreetingBar ctx={ctx} />;
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
    case 'directTransferEngine': return <DirectTransferEngine ctx={ctx} />;
    case 'multiMarketFX': return <MultiMarketFX ctx={ctx} />;
    case 'recurringStanding': return <RecurringStanding ctx={ctx} />;
    case 'authorizationModal': return <AuthorizationModal ctx={ctx} />;
    case 'recentRecipients': return <RecentRecipients ctx={ctx} />;
    case 'beneficiaryValidation': return <BeneficiaryValidation ctx={ctx} />;
    case 'sendMoneyAmount': return <SendMoneyAmount ctx={ctx} />;
    case 'transferSuccess': return <TransferSuccess ctx={ctx} />;
    case 'peerInvoicing': return <PeerInvoicing ctx={ctx} />;
    case 'paymentQR': return <PaymentQR ctx={ctx} />;
    case 'splitPayment': return <SplitPayment ctx={ctx} />;
    case 'outstandingReceivables': return <OutstandingReceivables ctx={ctx} />;
    case 'historyPage': return <HistoryFilters ctx={ctx} />;
    case 'splash': return <SplashCard ctx={ctx} />;
    case 'profile': return <ProfileCard ctx={ctx} />;
    case 'freezeCard': return <FreezeCard ctx={ctx} />;
    case 'accountPortfolio': return <AccountPortfolio ctx={ctx} />;
    case 'routingWireData': return <RoutingWireData ctx={ctx} />;
    case 'statementsExport': return <StatementsExport ctx={ctx} />;
    case 'cardPreview': return <CardPreview ctx={ctx} />;
    case 'cardControls': return <CardControls ctx={ctx} />;
    case 'pinVault': return <PinVault ctx={ctx} />;
    case 'alertCenter': return <AlertCenter ctx={ctx} />;
    case 'deliveryChannels': return <DeliveryChannels ctx={ctx} />;
    case 'identityCard': return <IdentityCard ctx={ctx} />;
    case 'securityBaseline': return <SecurityBaseline ctx={ctx} />;
    case 'connectedDevices': return <ConnectedDevices ctx={ctx} />;
    default: return null;
  }
}