'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outfit } from 'next/font/google';
import {
  AlertCircle,
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
  ChevronsUpDown,
  Clock,
  Contrast,
  Copy,
  Download,
  Eye,
  FileText,
  Fingerprint,
  Globe,
  GripVertical,
  Home,
  Landmark,
  Lock,
  LogIn,
  Mail,
  Monitor,
  Moon,
  Palette,
  Pencil,
  Phone,
  Plus,
  PlusCircle,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Signal,
  Smartphone,
  Snowflake,
  Sparkles,
  Sun,
  SunMoon,
  Trash2,
  Undo2,
  User,
  Wallet,
  Wifi,
  X,
} from 'lucide-react';
import {
  BANKING_WALLET_MODULES,
  BANKING_WALLET_PAGE_PREPEND,
  BANKING_WALLET_MODULE_IDS,
  BankingWalletModuleView,
  type BankingWalletModuleId,
} from './banking-wallet-modules';
import {
  CRYPTO_MODULES,
  CRYPTO_PAGE_PREPEND,
  CRYPTO_MODULE_IDS,
  CryptoModuleView,
  type CryptoModuleId,
} from './crypto-modules';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

const INK = '#1B1B1F';
const YELLOW = '#F5B921';
const GREEN = '#16A36B';
const PINK = '#EF4F6B';
const NAVY = '#0B1A56';

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
  | 'directTransferEngine'
  | 'multiMarketFX'
  | 'recurringStanding'
  | 'authorizationModal'
  | 'recentRecipients'
  | 'beneficiaryValidation'
  | 'sendMoneyAmount'
  | 'transferSuccess'
  | 'peerInvoicing'
  | 'paymentQR'
  | 'splitPayment'
  | 'outstandingReceivables'
  | 'historyPage'
  | 'splash'
  | 'profile'
  | 'freezeCard'
  | 'accountPortfolio'
  | 'routingWireData'
  | 'statementsExport'
  | 'cardPreview'
  | 'cardControls'
  | 'pinVault'
  | 'alertCenter'
  | 'deliveryChannels'
  | 'identityCard'
  | 'securityBaseline'
  | 'connectedDevices'
  | BankingWalletModuleId
  | CryptoModuleId ;
type RadiusMode = 'rounded' | 'sharp' | 'pill';
type TabId = 'home' | 'cards' | 'activity' | 'settings' | 'send' | 'fx';
type AppKind = 'banking' | 'fintech' | 'psp' | 'wallet' | 'crypto';
type PageId =
  | 'signin'
  | 'home'
  | 'accounts'
  | 'transfers'
  | 'send'
  | 'payments'
  | 'cards'
  | 'history'
  | 'notifications'
  | 'profile'
  | 'splash';
type CodeLang = 'swiftui' | 'typescript' | 'reactnative' | 'kotlin';

interface ModuleAsset {
  id: ModuleId;
  title: string;
  subtitle: string;
  category: Category;
  badge: string;
  badgeColor: string;
  code: { swiftui: string; typescript: string; reactnative: string; kotlin: string };
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
  {
    id: 'accounts', title: 'Multi-Layer Balance Card', subtitle: 'Total balance with wallet shortcut', category: 'balances', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `BalanceCardComponent(\n  balance: availableBalance,\n  theme: .whitelabelDefault\n)`,
      typescript: `export const BalanceCard = ({ balance, accent }) => (\n  <Card theme="ink" accent={accent}>{formatUSD(balance)}</Card>\n);`,
      reactnative: `<BalanceCard balance={25000.40} accent={accent} />`,
      kotlin: `BalanceCard(\n  balance = 25000.40,\n  accent = BrandColors.Blue,\n)`,
    },
  },
  {
    id: 'cashflow', title: 'Income & Outcome Strip', subtitle: 'Money in and out at a glance', category: 'ledger', badge: 'New',
    badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100',
    code: {
      swiftui: `CashflowSummaryComponent()`,
      typescript: `export const CashflowStrip = ({ income, outcome }) => (\n  <HStack>{money(income)}{money(-outcome)}</HStack>\n);`,
      reactnative: `<CashflowStrip income={20000} outcome={17000} />`,
      kotlin: `CashflowStrip(income = 20000, outcome = 17000)`,
    },
  },
  {
    id: 'transfers', title: 'Quick Actions Matrix', subtitle: 'Send, Payments, Pay Bill & Top Up', category: 'actions', badge: 'Action',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `QuickActionsComponent()`,
      typescript: `export const QuickActions = () => (\n  <Grid columns={4}><Action id="send" /><Action id="payments" /></Grid>\n);`,
      reactnative: `<QuickActions actions={[ 'send', 'payments', 'payBill', 'topUp' ]} />`,
      kotlin: `QuickActions(actions = listOf(SEND, PAYMENTS, PAY_BILL, TOP_UP))`,
    },
  },
  {
    id: 'vaults', title: 'Savings Goals', subtitle: 'Pockets for what you are saving toward', category: 'balances', badge: 'Savings',
    badgeColor: 'bg-purple-50 text-purple-600 border border-purple-100',
    code: {
      swiftui: `SavingsSummaryComponent()`,
      typescript: `export const SavingsGoals = ({ goals }) => (\n  <Grid columns={2}>{goals.map(renderGoal)}</Grid>\n);`,
      reactnative: `<SavingsGoals goals={goals} />`,
      kotlin: `SavingsGoals(goals = listOf(iphoneGoal, macbookGoal))`,
    },
  },
  {
    id: 'cards', title: 'Recent Activity Card', subtitle: 'Latest transactions with merchant icons', category: 'ledger', badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `RecentActivityComponent()`,
      typescript: `export const RecentActivity = ({ transactions }) => (\n  <List rows={transactions.slice(0, 3)} />\n);`,
      reactnative: `<RecentActivity transactions={transactions} />`,
      kotlin: `RecentActivity(transactions = store.latest(3))`,
    },
  },
  {
    id: 'fx', title: 'FX Ticker & Wallets', subtitle: 'Multi-currency wallets with live rate', category: 'fx', badge: 'Global',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `FXWallets(rates: FX.live, base: .usd)`,
      typescript: `export const FXWallets = ({ wallets }) => (\n  <Row>{wallets.map(renderWallet)}</Row>\n);`,
      reactnative: `<FXWallets base="USD" wallets={wallets} />`,
      kotlin: `FXWallets(base = Currency.USD, rates = Fx.live())`,
    },
  },
  {
    id: 'analytics', title: 'Spending Intelligence', subtitle: 'Monthly spend trend and budgets', category: 'ledger', badge: 'AI',
    badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    code: {
      swiftui: `SpendingChart(monthlySpend: 4820, trend: .down)`,
      typescript: `export const SpendingChart = ({ monthly }) => (\n  <Bars data={monthly} accent={accent} />\n);`,
      reactnative: `<SpendingChart monthly={monthlySpend} />`,
      kotlin: `SpendingChart(monthly = 4820, trend = Trend.DOWN)`,
    },
  },
  {
    id: 'security', title: 'Biometric Shield & 2FA', subtitle: 'Face ID required for transfers', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `BiometricGate(faceID: true) { transferAmount }`,
      typescript: `export const SecurityRow = ({ faceId, onChange }) => (\n  <Switch checked={faceId} onChange={onChange} />\n);`,
      reactnative: `<SecurityRow faceId={faceId} onChange={setFaceId} />`,
      kotlin: `BiometricGate(requireFaceId = true) { transfer() }`,
    },
  },
  {
    id: 'notifications', title: 'Real-Time Alerts', subtitle: 'Push alerts and header bell badge', category: 'security', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `RealtimeAlerts(subscribe: .transactions)`,
      typescript: `export const AlertsRow = ({ count }) => (\n  <Row badge={count}>Alerts</Row>\n);`,
      reactnative: `<AlertsRow count={3} />`,
      kotlin: `RealtimeAlerts(topic = TOPIC_TRANSACTIONS)`,
    },
  },
  {
    id: 'signin', title: 'Sign-In Screen', subtitle: 'Email, password, captcha & quick login', category: 'onboarding', badge: 'Auth',
    badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
    code: {
      swiftui: `SignInScreen(\n  email: $email,\n  password: $pw,\n  onSignIn: auth.signIn\n)`,
      typescript: `export const SignInScreen = () => (\n  <SignInForm onSignIn={signIn} />\n);`,
      reactnative: `<SignInScreen onSignIn={signIn} />`,
      kotlin: `SignInScreen(onSignIn = auth::signIn)`,
    },
  },
  {
    id: 'accountsPage', title: 'Accounts Overview', subtitle: 'Sub-accounts list with available funds', category: 'balances', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `AccountsOverview(accounts: store.accounts)`,
      typescript: `export const AccountsOverview = ({ accounts }) => (\n  <List rows={accounts} />\n);`,
      reactnative: `<AccountsOverview accounts={accounts} />`,
      kotlin: `AccountsOverview(accounts = store.accounts)`,
    },
  },
  /* ------------------- Transfers (4.1 – 4.4) ------------------- */
  {
    id: 'directTransferEngine', title: '4.1 Direct Transfer Engine', subtitle: 'From / To / Amount with rail picker', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `DirectTransferEngine(\n  from: .checking(4912),\n  to: .chaseSarah,\n  amount: 500.00\n)`,
      typescript: `export const DirectTransferEngine = () => (\n  <Form from={checking} to={sarah} amount={500} />\n);`,
      reactnative: `<DirectTransferEngine from="checking" to="sarah" amount={500} />`,
      kotlin: `DirectTransferEngine(from = CHECKING, to = SARAH, amount = 500.00)`,
    },
  },
  {
    id: 'multiMarketFX', title: '4.2 Mid-Market FX Swap', subtitle: 'Lock rate, guaranteed rate window', category: 'fx', badge: 'FX',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `MidMarketFXSwap(\n  send: 1000,\n  from: .usd,\n  to: .eur,\n  rate: 0.9214\n)`,
      typescript: `export const MidMarketFXSwap = () => (\n  <Swap send={1000} from="USD" to="EUR" rate={0.9214} />\n);`,
      reactnative: `<MidMarketFXSwap send={1000} from="USD" to="EUR" />`,
      kotlin: `MidMarketFXSwap(send = 1000, from = USD, to = EUR, rate = 0.9214)`,
    },
  },
  {
    id: 'recurringStanding', title: '4.3 Recurring Standing Order', subtitle: 'Monthly schedule, next run date', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `RecurringStandingOrder(\n  payee: realty,\n  amount: 2100,\n  nextRun: "Nov 1, 2024"\n)`,
      typescript: `export const RecurringStandingOrder = () => (\n  <Standing payee={realty} amount={2100} nextRun="2024-11-01" />\n);`,
      reactnative: `<RecurringStandingOrder payee={realty} amount={2100} />`,
      kotlin: `RecurringStandingOrder(payee = realty, amount = 2100.0, nextRun = Nov1)`,
    },
  },
  {
    id: 'authorizationModal', title: '4.4 Authorization Modal', subtitle: 'Payment review & authorize', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PaymentReviewAuthorization(\n  amount: 500,\n  fee: 0,\n  delivery: .instant\n)`,
      typescript: `export const PaymentReview = () => (\n  <Review amount={500} fee={0} delivery="instant" />\n);`,
      reactnative: `<PaymentReview amount={500} fee={0} delivery="instant" />`,
      kotlin: `PaymentReview(amount = 500.0, fee = 0.0, delivery = INSTANT)`,
    },
  },
  /* ------------------- Send (5.1 – 5.4) ------------------- */
  {
    id: 'recentRecipients', title: '5.1 Recent Recipients', subtitle: 'One-tap contacts dock', category: 'actions', badge: 'Action',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `RecentRecipients(contacts: contacts.recent)`,
      typescript: `export const RecentRecipients = () => (\n  <ContactsDock contacts={recent} onManage={openContacts} />\n);`,
      reactnative: `<RecentRecipients contacts={recent} onManage={openContacts} />`,
      kotlin: `RecentRecipients(contacts = contacts.recent, onManage = ::openContacts)`,
    },
  },
  {
    id: 'beneficiaryValidation', title: '5.2 Add Recipient', subtitle: 'Beneficiary validation & save', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `BeneficiaryValidation(onSave: { save() })`,
      typescript: `export const BeneficiaryValidation = () => (\n  <ValidationForm onSave={save} />\n);`,
      reactnative: `<BeneficiaryValidation onSave={save} />`,
      kotlin: `BeneficiaryValidation(onSave = ::save)`,
    },
  },
  {
    id: 'sendMoneyAmount', title: '5.3 Send Money Focus', subtitle: 'Amount pad with note & review', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SendMoneyAmount(\n  amount: 120,\n  note: "Dinner & drinks"\n)`,
      typescript: `export const SendMoneyAmount = () => (\n  <AmountPad amount={120} note="Dinner" />\n);`,
      reactnative: `<SendMoneyAmount amount={120} note="Dinner" />`,
      kotlin: `SendMoneyAmount(amount = 120.0, note = "Dinner")`,
    },
  },
  {
    id: 'transferSuccess', title: '5.4 Transfer Success', subtitle: 'Confirmation with receipt ID', category: 'ledger', badge: 'Live',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `TransferSuccess(\n  receipt: "US-99214-88A",\n  amount: 120,\n  to: "Sarah Jenkins"\n)`,
      typescript: `export const TransferSuccess = () => (\n  <Success receipt="US-99214-88A" amount={120} to="Sarah" />\n);`,
      reactnative: `<TransferSuccess receipt="US-99214-88A" amount={120} />`,
      kotlin: `TransferSuccess(receipt = "US-99214-88A", amount = 120.0)`,
    },
  },
  /* ------------------- Payment Requests (6.1 – 6.4) ------------------- */
  {
    id: 'peerInvoicing', title: '6.1 Peer Invoicing', subtitle: 'Request money with a note', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PeerInvoicing(amount: 75, note: "Concert tickets")`,
      typescript: `export const PeerInvoicing = () => (\n  <Invoice amount={75} note="Concert tickets" />\n);`,
      reactnative: `<PeerInvoicing amount={75} note="Concert tickets" />`,
      kotlin: `PeerInvoicing(amount = 75.0, note = "Concert tickets")`,
    },
  },
  {
    id: 'paymentQR', title: '6.2 Payment QR', subtitle: 'Scan-to-pay QR request', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PaymentQRRequest(handle: "alexrivera", amount: 75)`,
      typescript: `export const PaymentQRRequest = () => (\n  <QR handle="alexrivera" amount={75} />\n);`,
      reactnative: `<PaymentQRRequest handle="alexrivera" amount={75} />`,
      kotlin: `PaymentQRRequest(handle = "alexrivera", amount = 75.0)`,
    },
  },
  {
    id: 'splitPayment', title: '6.3 Split Payment', subtitle: 'Divide bill across people', category: 'actions', badge: 'Flow',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SplitPayment(total: 180, shares: [60, 60, 60])`,
      typescript: `export const SplitPayment = () => (\n  <Splitter total={180} shares={[60,60,60]} />\n);`,
      reactnative: `<SplitPayment total={180} shares={[60,60,60]} />`,
      kotlin: `SplitPayment(total = 180.0, shares = listOf(60.0, 60.0, 60.0))`,
    },
  },
  {
    id: 'outstandingReceivables', title: '6.4 Outstanding Receivables', subtitle: 'Pending invoice tracker', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `OutstandingReceivables(items: store.pending)`,
      typescript: `export const OutstandingReceivables = () => (\n  <Tracker items={pending} onRemind={remind} />\n);`,
      reactnative: `<OutstandingReceivables items={pending} onRemind={remind} />`,
      kotlin: `OutstandingReceivables(items = store.pending, onRemind = ::remind)`,
    },
  },
  /* ------------------- Cards (7.1 – 7.3) ------------------- */
  {
    id: 'cardPreview', title: '7.1 Card Preview', subtitle: 'Metal card with active NFC badge', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardPreview(holder: "C MUTHU KRISHNAN", last4: "8824", tier: .platinum)`,
      typescript: `export const CardPreview = () => (\n  <MetalCard tier="platinum" last4="8824" />\n);`,
      reactnative: `<CardPreview last4="8824" />`,
      kotlin: `CardPreview(last4 = "8824", tier = Tier.PLATINUM)`,
    },
  },
  {
    id: 'cardControls', title: '7.2 Card Controls', subtitle: 'Freeze / online / NFC + spend limit', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `CardControls(frozen: $frozen, online: $online, nfc: $nfc, limit: 5000)`,
      typescript: `export const CardControls = () => (\n  <SecuritySwitches limit={5000} />\n);`,
      reactnative: `<CardControls limit={5000} />`,
      kotlin: `CardControls(limit = 5000.0)`,
    },
  },
  {
    id: 'pinVault', title: '7.3 PIN Vault', subtitle: 'Hold to view, change PIN, report lost', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `PinVault(onView: pin::reveal, onChange: pin::change, onReport: report)`,
      typescript: `export const PinVault = () => (\n  <PinVaultActions />\n);`,
      reactnative: `<PinVault />`,
      kotlin: `PinVault(onChange = pin::change, onReport = ::report)`,
    },
  },
  /* ------------------- Notifications (9.1 – 9.2) ------------------- */
  {
    id: 'alertCenter', title: '9.1 Alert Center', subtitle: 'Recent alerts feed with mark all as read', category: 'security', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `AlertCenter(items: store.alerts)`,
      typescript: `export const AlertCenter = () => (\n  <AlertFeed items={alerts} onMarkAllRead={markAll} />\n);`,
      reactnative: `<AlertCenter items={alerts} />`,
      kotlin: `AlertCenter(items = store.alerts)`,
    },
  },
  {
    id: 'deliveryChannels', title: '9.2 Delivery Channels', subtitle: 'Push / weekly / security preferences', category: 'security', badge: 'Push',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `DeliveryChannels(prefs: $prefs)`,
      typescript: `export const DeliveryChannels = () => (\n  <DeliveryChannelsForm prefs={prefs} />\n);`,
      reactnative: `<DeliveryChannels prefs={prefs} />`,
      kotlin: `DeliveryChannels(prefs = prefs)`,
    },
  },
  /* ------------------- Profile (10.1 – 10.3) ------------------- */
  {
    id: 'identityCard', title: '10.1 Identity Card', subtitle: 'Avatar, tier, tax ID and residence', category: 'security', badge: 'KYC',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `IdentityCard(user: auth.current)`,
      typescript: `export const IdentityCard = () => (\n  <IdentityCardView user={user} tier="BLACK" />\n);`,
      reactnative: `<IdentityCard user={user} />`,
      kotlin: `IdentityCard(user = auth.current)`,
    },
  },
  {
    id: 'securityBaseline', title: '10.2 Security Baseline', subtitle: 'Password, biometrics, hardware key', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `SecurityBaseline(passwordAge: 3, faceID: true, hardwareKey: true)`,
      typescript: `export const SecurityBaseline = () => (\n  <SecurityBaselineList />\n);`,
      reactnative: `<SecurityBaseline />`,
      kotlin: `SecurityBaseline(faceID = true, hardwareKey = true)`,
    },
  },
  {
    id: 'connectedDevices', title: '10.3 Connected Devices', subtitle: 'Active sessions and log-out-all', category: 'security', badge: 'Shield',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `ConnectedDevices(sessions: store.sessions)`,
      typescript: `export const ConnectedDevices = () => (\n  <ActiveSessions sessions={sessions} />\n);`,
      reactnative: `<ConnectedDevices sessions={sessions} />`,
      kotlin: `ConnectedDevices(sessions = store.sessions)`,
    },
  },
  /* ------------------- Accounts (3.1 – 3.3) ------------------- */
  {
    id: 'accountPortfolio', title: '3.1 Account Portfolio', subtitle: 'Everyday, savings and travel wallet', category: 'balances', badge: 'Core',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `AccountPortfolio(accounts: store.accounts)`,
      typescript: `export const AccountPortfolio = () => (\n  <AccountsGrid accounts={accounts} />\n);`,
      reactnative: `<AccountPortfolio accounts={accounts} />`,
      kotlin: `AccountPortfolio(accounts = store.accounts)`,
    },
  },
  {
    id: 'routingWireData', title: '3.2 Routing & Wire Data', subtitle: 'Holder, ACH routing and account number', category: 'balances', badge: 'Data',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    code: {
      swiftui: `RoutingWireData(holder: "Alex Rivera", routing: "021000021")`,
      typescript: `export const RoutingWireData = () => (\n  <WireDetails onShare={share} />\n);`,
      reactnative: `<RoutingWireData onShare={share} />`,
      kotlin: `RoutingWireData(onShare = ::share)`,
    },
  },
  {
    id: 'statementsExport', title: '3.3 Statements Export', subtitle: 'Cycle, format and SHA-256 seal', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `StatementsExport(cycle: .oct2024, format: .pdf)`,
      typescript: `export const StatementsExport = () => (\n  <AuditedStatements cycle={cycle} />\n);`,
      reactnative: `<StatementsExport cycle={cycle} />`,
      kotlin: `StatementsExport(cycle = Cycle.OCT_2024)`,
    },
  },
  /* ------------------- Others ------------------- */
  {
    id: 'historyPage', title: 'Ledger Filter Bar', subtitle: 'Date range, status and type chips', category: 'ledger', badge: 'Data',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    code: {
      swiftui: `LedgerFilters(range: .month, status: .all)`,
      typescript: `export const LedgerFilters = () => (\n  <Chips options={['All','Income','Spending','Pending']} />\n);`,
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
      typescript: `export const ProfileCard = ({ user }) => (\n  <Card><Avatar /><KycBadge level={2} /></Card>\n);`,
      reactnative: `<ProfileCard user={user} tier={2} />`,
      kotlin: `ProfileCard(kyc = KYC.VERIFIED, tier = 2)`,
    },
  },
  {
    id: 'freezeCard', title: 'Freeze Card Toggle', subtitle: 'Instantly block card transactions', category: 'security', badge: 'Card',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    code: {
      swiftui: `FreezeCard(isFrozen: state.frozen, onChange: card.freeze)`,
      typescript: `export const FreezeCard = ({ frozen, onChange }) => (\n  <Switch checked={frozen} onChange={onChange} />\n);`,
      reactnative: `<FreezeCard frozen={frozen} onChange={setFrozen} />`,
      kotlin: `FreezeCard(isFrozen = state.frozen, onChange = card::freeze)`,
    },
  },
];

const APP_KINDS: { id: AppKind; label: string; blurb: string }[] = [
  { id: 'banking', label: 'Banking app', blurb: 'Retail bank with accounts, cards and transfers' },
  { id: 'wallet', label: 'Digital wallet', blurb: 'P2P wallet with virtual cards and top-ups' },
  { id: 'crypto', label: 'Crypto exchange', blurb: 'Spot swaps, multi-chain balances and custody' },
];

const PAGES: { id: PageId; label: string; modules: ModuleId[] }[] = [
  { id: 'signin', label: 'Sign In', modules: ['signin'] },
  { id: 'home', label: 'Home', modules: ['accounts', 'cashflow', 'transfers', 'vaults', 'cards'] },
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

const PAGE_TO_TAB: Record<PageId, TabId> = {
  signin: 'home', home: 'home', accounts: 'home', transfers: 'home', send: 'send', payments: 'home',
  cards: 'cards', history: 'activity', notifications: 'home', profile: 'settings', splash: 'home',
};

const TAB_TO_PAGE: Record<TabId, PageId> = {
  home: 'home', cards: 'cards', activity: 'history', settings: 'profile', send: 'send', fx: 'home',
};

const SINGLE_SLOT: Partial<Record<PageId, boolean>> = { transfers: true };

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
  for (const p of PAGES) out[p.id] = [];
  return out;
};

const allModulesFor = (): ModuleAsset[] => [
  ...(CRYPTO_MODULES as unknown as ModuleAsset[]),
  ...(BANKING_WALLET_MODULES as unknown as ModuleAsset[]),
  ...availableModules,
];

const pageModulesFor = (page: PageId, appKind: AppKind): ModuleId[] => {
  const base = PAGES.find((p) => p.id === page)?.modules ?? [];
  if (appKind === 'crypto') {
    const prepend = (CRYPTO_PAGE_PREPEND[page] ?? []) as ModuleId[];
    return [...prepend, ...base];                            // ← crypto prepend
  }
  const prepend = (BANKING_WALLET_PAGE_PREPEND[page] ?? []) as ModuleId[];
  return [...prepend, ...base];                              // existing banking/wallet
};


const moduleFor = (id: ModuleId) => allModulesFor().find((m) => m.id === id);

interface ViewActions {
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
  send: noop, payments: noop, payBill: noop, topUp: noop, openWallet: noop, openFx: noop,
  openHistory: noop, seeAllSavings: noop, deposit: noop, toggleFaceId: noop, openAlerts: noop,
  signIn: noop, skipSignIn: noop, quickSignIn: noop, toggleFreeze: noop,
};

function Tap({
  ctx, onClick, label, className = '', children,
}: { ctx: ViewCtx; onClick: () => void; label: string; className?: string; children: React.ReactNode }) {
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
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} style={ringVar(accent)}
      className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {track}
    </button>
  );
}

function SectionHeader({ ctx, title, action, onAction }: { ctx: ViewCtx; title: string; action?: React.ReactNode; onAction?: () => void }) {
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

function ModuleHeader({ ctx, code, title }: { ctx: ViewCtx; code: string; title: string }) {
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

function BalanceCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div
      className={`relative h-[132px] overflow-hidden p-5 text-white ${ctx.radius.card} ${
        ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_10px_28px_rgba(20,20,40,0.22)]'
      }`}
      style={{ background: INK }}
    >
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

function CashflowStrip({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`relative grid grid-cols-2 overflow-hidden text-white ${ctx.radius.card} ${ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_8px_22px_rgba(20,20,40,0.18)]'}`} style={{ background: INK }}>
      <span aria-hidden className="absolute -left-4 -top-4 h-10 w-10 rounded-full bg-violet-500/30" />
      <span aria-hidden className="absolute -bottom-4 -right-4 h-10 w-10 rounded-full bg-amber-700/40" />
      <div className="relative flex items-center gap-2.5 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500/15 text-emerald-400"><ArrowDown className="h-4 w-4" /></span>
        <div><p className="text-[9px] text-white/50">Income</p><p className="text-[12px] font-semibold">{whole(ctx.income)}</p></div>
      </div>
      <div className="relative flex items-center gap-2.5 border-l border-white/10 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-500/15 text-rose-400"><ArrowUp className="h-4 w-4" /></span>
        <div><p className="text-[9px] text-white/50">Outcome</p><p className="text-[12px] font-semibold">{whole(ctx.outcome)}</p></div>
      </div>
    </div>
  );
}

function QuickActions({ ctx }: { ctx: ViewCtx }) {
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

function SavingsCards({ ctx }: { ctx: ViewCtx }) {
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

function TxRow({ tx, ctx }: { tx: Transaction; ctx: ViewCtx }) {
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

function RecentActivity({ ctx }: { ctx: ViewCtx }) {
  const rows = ctx.transactions.slice(0, ctx.interactive ? 3 : 1);
  return (
    <section>
      <SectionHeader ctx={ctx} title="Recent Activity" action={<><span>View History</span><ChevronRight className="h-3 w-3" /></>} onAction={ctx.actions.openHistory} />
      <div className="space-y-2.5">{rows.map((t) => <TxRow key={t.id} tx={t} ctx={ctx} />)}</div>
    </section>
  );
}

function FxWallets({ ctx }: { ctx: ViewCtx }) {
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

function SpendingCard({ ctx }: { ctx: ViewCtx }) {
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

function SecurityRow({ ctx }: { ctx: ViewCtx }) {
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

function AlertsRow({ ctx }: { ctx: ViewCtx }) {
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

/* -------------------------- Sign-in (new design) --------------------------- */

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

function SignInCard({ ctx }: { ctx: ViewCtx }) {
  const fieldCls = `flex items-center gap-2 border px-3 py-2.5 ${ctx.radius.icon} ${ctx.isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`;
  return (
    <div className={`space-y-3 p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div>
        <label className="mb-1 block text-[10px] font-semibold">Email</label>
        <div className={fieldCls}>
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400">Enter Your Email</span>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold">Password</label>
        <div className={fieldCls}>
          <Lock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400">Enter Your Password</span>
        </div>
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
          <Tap ctx={ctx} onClick={() => ctx.actions.quickSignIn('phone')} label="Continue with phone number" className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-700"><Phone className="h-3.5 w-3.5" /></Tap>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Accounts page modules -------------------------- */

function AccountPortfolio({ ctx }: { ctx: ViewCtx }) {
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

function RoutingWireData({ ctx }: { ctx: ViewCtx }) {
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

function StatementsExport({ ctx }: { ctx: ViewCtx }) {
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
          <button
            type="button"
            onClick={() => setFormat('pdf')}
            className={`py-2 text-[11px] font-bold ${ctx.radius.icon} ${format === 'pdf' ? 'text-white' : ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
            style={format === 'pdf' ? { background: '#0284C7' } : undefined}
          >
            PDF Format
          </button>
          <button
            type="button"
            onClick={() => setFormat('csv')}
            className={`py-2 text-[11px] font-bold ${ctx.radius.icon} ${format === 'csv' ? 'text-white' : ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
            style={format === 'csv' ? { background: '#0284C7' } : undefined}
          >
            CSV Sheet
          </button>
        </div>
      </div>
      <div className={`flex items-start gap-2 p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-blue-50'}`}>
        <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-[9px] leading-relaxed text-slate-600 dark:text-slate-300">
          Cryptographically sealed with SHA-256 for tax filing
        </p>
      </div>
      <button type="button" className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <Download className="h-3 w-3" /> Download {format === 'pdf' ? 'PDF (1.2 MB)' : 'CSV'}
      </button>
    </div>
  );
}

/* -------------------------- Cards page modules ----------------------------- */

function CardPreview({ ctx }: { ctx: ViewCtx }) {
  return (
    <div
      className={`relative h-[132px] overflow-hidden p-5 text-white ${ctx.radius.card} ${
        ctx.isDark ? 'ring-1 ring-white/10' : 'shadow-[0_10px_28px_rgba(20,20,40,0.22)]'
      }`}
      style={{ background: INK }}
    >
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

function CardControls({ ctx }: { ctx: ViewCtx }) {
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
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="text-[11px] font-medium">{label}</span>
            </div>
            <Switch checked={value} onChange={() => set(!value)} label={label} accent={ctx.accent} interactive={ctx.interactive} />
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-slate-500">Monthly Spend Limit</span>
          <span className="font-semibold">$2,500 / $5,000</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full" style={{ width: '50%', background: ctx.accent }} />
        </div>
      </div>
      <p className="text-center text-[9px] text-slate-400">Limits reset in 8 days</p>
    </div>
  );
}

function PinVault({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="7.3 Card Security" title="PIN Vault & Replacement" />
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center">
        <Fingerprint className="h-8 w-8 text-slate-600" />
        <p className="text-[12px] font-semibold">Hold to View PIN</p>
        <p className="text-[9px] text-slate-500">Reveals physical terminal code</p>
      </div>
      <button type="button" className={`w-full flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="text-[11px] font-semibold">Change PIN</span>
        </div>
        <ChevronRight className="h-3 w-3 text-slate-400" />
      </button>
      <button type="button" className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-rose-500 ${ctx.radius.icon} ${ctx.isDark ? 'bg-rose-900/20' : 'bg-rose-50'}`}>
        <AlertCircle className="h-3.5 w-3.5" /> Report Lost or Stolen
      </button>
    </div>
  );
}

/* -------------------------- Notifications modules -------------------------- */

function AlertCenter({ ctx }: { ctx: ViewCtx }) {
  const items = [
    { title: 'Payment Received: $4,250.00', sub: 'Your employer deposited funds via FedACH.', time: '10m ago', tone: 'blue', Icon: DollarIcon },
    { title: 'New Login from Chrome Mac', sub: 'New York, US · IP 192.88.21.0', time: '2h ago', tone: 'gray', Icon: ShieldCheck },
    { title: 'October Statement Ready', sub: 'Your monthly checking statement is ready for download.', time: '1d ago', tone: 'gray', Icon: FileText },
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

function DeliveryChannels({ ctx }: { ctx: ViewCtx }) {
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
            <div className="min-w-0">
              <p className="text-[11px] font-semibold">{item.title}</p>
              <p className="text-[9px] text-slate-500">{item.sub}</p>
            </div>
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

/* -------------------------- Profile page modules --------------------------- */

function IdentityCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="10.1 Identity Card" title="" />
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-700 text-white text-lg font-bold">AR</div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-bold">Alex Rivera</p>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="text-[10px] text-slate-500">alex.rivera@fintech.io</p>
          <p className="mt-0.5 text-[9px] font-bold text-amber-700">BLACK MEMBER</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex justify-between text-[10px]">
          <span className="text-slate-500">Tax ID (SSN)</span>
          <span className="font-mono">••••••8921</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-slate-500">Residence</span>
          <span>New York, United States</span>
        </div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        Edit Account Identity
      </button>
    </div>
  );
}

function SecurityBaseline({ ctx }: { ctx: ViewCtx }) {
  const [biometrics, setBiometrics] = useState(true);
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="10.2 Security Settings" title="Security Baseline" />
      <div className="space-y-2">
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div>
            <p className="text-[11px] font-semibold">Password</p>
            <p className="text-[9px] text-slate-500">Updated 3 mos ago</p>
          </div>
          <button type="button" className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Update</button>
        </div>
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div>
            <p className="text-[11px] font-semibold">Biometrics (Face ID)</p>
            <p className="text-[9px] text-emerald-600">Active & Enrolled</p>
          </div>
          <Switch checked={biometrics} onChange={() => setBiometrics(!biometrics)} label="Biometrics" accent={ctx.accent} interactive={ctx.interactive} />
        </div>
        <div className={`flex items-center justify-between p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div>
            <p className="text-[11px] font-semibold">Hardware Authenticator</p>
            <p className="text-[9px] text-slate-500">YubiKey 5C NFC</p>
          </div>
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

function ConnectedDevices({ ctx }: { ctx: ViewCtx }) {
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
              <div>
                <p className="text-[11px] font-semibold">{d.name}</p>
                <p className="text-[9px] text-slate-500">{d.sub}</p>
              </div>
            </div>
            {d.active ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> : <button type="button" className="text-[9px] font-semibold text-rose-500">Revoke</button>}
          </div>
        ))}
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-semibold text-rose-500 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        Log Out All Other Devices
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

/* ------------------------- legacy page modules ----------------------------- */

function AccountsOverview({ ctx }: { ctx: ViewCtx }) {
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

function DirectTransferEngine({ ctx }: { ctx: ViewCtx }) {
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

function MultiMarketFX({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.2 Currency Exchange" title="Mid-Market FX Swap" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-slate-400">You send exactly</span>
          <span className="text-[9px] text-slate-400">Fee: $0.00 USD</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold">1,000.00</p>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md ring-1 ring-slate-200">
            <span className="text-[10px]">🇺🇸</span><span className="text-[10px] font-bold">USD</span><ChevronDown className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-slate-500 flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> 1 USD = 0.9214 EUR (Guaranteed 1m)</span>
        <button aria-label="Swap currencies" className={`grid h-6 w-6 place-items-center rounded-full`} style={{ background: ctx.accent }}><RefreshCw className="h-3 w-3 text-white" /></button>
      </div>
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-slate-400">Recipient gets</span><span className="text-[9px] text-slate-400">Live Rate</span>
        </div>
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

function RecurringStanding({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.3 Scheduled Transfer" title="Recurring Standing Order" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md text-white" style={{ background: NAVY }}><Landmark className="h-4 w-4" /></span>
            <div>
              <p className="text-[11px] font-bold">Prime Manhattan Realty</p>
              <p className="text-[8px] text-slate-500">Monthly Rent · #402</p>
            </div>
          </div>
          <span className="h-3 w-3 rounded-sm" style={{ background: NAVY }} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
          <div><p className="text-[8px] text-slate-400">Amount</p><p className="text-[11px] font-bold">$2,100.00 / mo</p></div>
          <div className="text-right"><p className="text-[8px] text-slate-400">Next Run</p><p className="text-[11px] font-bold">Nov 1, 2024</p></div>
        </div>
      </div>
      <p className="flex items-center gap-1 text-[9px] text-slate-500"><Clock className="h-3 w-3" /> Automatic notification 24h prior to execution</p>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>Modify Schedule Rules</button>
    </div>
  );
}

function AuthorizationModal({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="4.4 Authorization Modal" title="" />
      <p className="text-center text-[10px] uppercase tracking-wider text-slate-400">Payment Review</p>
      <p className="text-center text-[26px] font-bold">$500.00</p>
      <p className="text-center text-[10px] text-slate-400">to Sarah Jenkins · Chase Bank</p>
      <div className="space-y-1.5 border-t border-slate-200 pt-2 dark:border-slate-700">
        <div className="flex justify-between text-[10px]"><span className="text-slate-400">Network Fee</span><span className="text-emerald-600 font-semibold">Free (FedNow Rail)</span></div>
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

function RecentRecipients({ ctx }: { ctx: ViewCtx }) {
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

function BeneficiaryValidation({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="5.2 Add Recipient" title="Beneficiary Validation" />
      <div>
        <p className="text-[9px] text-slate-400 mb-1">Legal Full Name</p>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}><span className="text-[11px] text-slate-400">e.g. Liam Gallagher</span></div>
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-[9px] text-slate-400">Routing Number or SWIFT</p>
          <p className="text-[9px] font-semibold text-emerald-600">Auto-detected: Chase</p>
        </div>
        <div className={`px-3 py-2 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}><span className="text-[11px]">021000021</span></div>
      </div>
      <button type="button" className={`w-full py-2.5 text-[11px] font-bold text-white ${ctx.radius.icon}`} style={{ background: NAVY }}>Save Beneficiary</button>
    </div>
  );
}

function SendMoneyAmount({ ctx }: { ctx: ViewCtx }) {
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

function TransferSuccess({ ctx }: { ctx: ViewCtx }) {
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

function PeerInvoicing({ ctx }: { ctx: ViewCtx }) {
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

function PaymentQR({ ctx }: { ctx: ViewCtx }) {
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

function SplitPayment({ ctx }: { ctx: ViewCtx }) {
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

function OutstandingReceivables({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`space-y-3 p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <ModuleHeader ctx={ctx} code="6.4 Pending Tracker" title="Outstanding Receivables" />
      <div className={`p-3 ${ctx.radius.icon} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div><p className="text-[11px] font-semibold">Mike Henderson</p><p className="text-[9px] text-slate-500">Pending 2 days · $45.00</p></div>
          <button className={`rounded-md bg-white px-3 py-1 text-[9px] font-bold shadow-sm`} style={{ color: ctx.accent }}>Remind</button>
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

function SplashCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex h-[240px] flex-col items-center justify-center gap-3 ${ctx.radius.card} ${ctx.isDark ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-slate-900 text-white'}`}>
      <span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-white" style={{ background: ctx.accent }}>A</span>
      <p className="text-[13px] font-bold tracking-wide text-white">APEX BANK</p>
      <span className="h-1 w-16 overflow-hidden rounded-full bg-white/20"><span className="block h-full w-1/2 rounded-full" style={{ background: ctx.accent }} /></span>
    </div>
  );
}

function ProfileCard({ ctx }: { ctx: ViewCtx }) {
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

function FreezeCard({ ctx }: { ctx: ViewCtx }) {
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

function ModuleView({ id, ctx }: { id: ModuleId; ctx: ViewCtx }) {
  // Crypto modules render from their own file
  if (CRYPTO_MODULE_IDS.has(id)) {
    return <CryptoModuleView id={id} ctx={ctx} />;
  }
  // Banking / wallet modules render from their own file
  if (BANKING_WALLET_MODULE_IDS.has(id)) {
    return <BankingWalletModuleView id={id} ctx={ctx} />;
  }

  switch (id) {
    case 'accounts':
      return <BalanceCard ctx={ctx} />;
    case 'cashflow':
      return <CashflowStrip ctx={ctx} />;
    case 'transfers':
      return <QuickActions ctx={ctx} />;
    case 'vaults':
      return <SavingsCards ctx={ctx} />;
    case 'cards':
      return <RecentActivity ctx={ctx} />;
    case 'fx':
      return <FxWallets ctx={ctx} />;
    case 'analytics':
      return <SpendingCard ctx={ctx} />;
    case 'security':
      return <SecurityRow ctx={ctx} />;
    case 'notifications':
      return <AlertsRow ctx={ctx} />;
    case 'signin':
      return <SignInCard ctx={ctx} />;
    case 'accountsPage':
      return <AccountsOverview ctx={ctx} />;
    case 'directTransferEngine':
      return <DirectTransferEngine ctx={ctx} />;
    case 'multiMarketFX':
      return <MultiMarketFX ctx={ctx} />;
    case 'recurringStanding':
      return <RecurringStanding ctx={ctx} />;
    case 'authorizationModal':
      return <AuthorizationModal ctx={ctx} />;
    case 'recentRecipients':
      return <RecentRecipients ctx={ctx} />;
    case 'beneficiaryValidation':
      return <BeneficiaryValidation ctx={ctx} />;
    case 'sendMoneyAmount':
      return <SendMoneyAmount ctx={ctx} />;
    case 'transferSuccess':
      return <TransferSuccess ctx={ctx} />;
    case 'peerInvoicing':
      return <PeerInvoicing ctx={ctx} />;
    case 'paymentQR':
      return <PaymentQR ctx={ctx} />;
    case 'splitPayment':
      return <SplitPayment ctx={ctx} />;
    case 'outstandingReceivables':
      return <OutstandingReceivables ctx={ctx} />;
    case 'historyPage':
      return <HistoryFilters ctx={ctx} />;
    case 'splash':
      return <SplashCard ctx={ctx} />;
    case 'profile':
      return <ProfileCard ctx={ctx} />;
    case 'freezeCard':
      return <FreezeCard ctx={ctx} />;
    case 'accountPortfolio':
      return <AccountPortfolio ctx={ctx} />;
    case 'routingWireData':
      return <RoutingWireData ctx={ctx} />;
    case 'statementsExport':
      return <StatementsExport ctx={ctx} />;
    case 'cardPreview':
      return <CardPreview ctx={ctx} />;
    case 'cardControls':
      return <CardControls ctx={ctx} />;
    case 'pinVault':
      return <PinVault ctx={ctx} />;
    case 'alertCenter':
      return <AlertCenter ctx={ctx} />;
    case 'deliveryChannels':
      return <DeliveryChannels ctx={ctx} />;
    case 'identityCard':
      return <IdentityCard ctx={ctx} />;
    case 'securityBaseline':
      return <SecurityBaseline ctx={ctx} />;
    case 'connectedDevices':
      return <ConnectedDevices ctx={ctx} />;
    default:
      return null;
  }
}

function HistoryFilters({ ctx }: { ctx: ViewCtx }) {
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
}: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button" aria-label={label} title={label} disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-6 w-6 cursor-pointer place-items-center rounded-full outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-30 ${danger ? 'text-rose-500' : 'text-slate-600'}`}
    >
      {children}
    </button>
  );
}

type Density = 'compact' | 'spacious';

const ACCENTS: { hex: string; name: string }[] = [
  { hex: '#0040DF', name: 'Indigo' },
  { hex: '#7C3AED', name: 'Violet' },
  { hex: '#A21CAF', name: 'Fuchsia' },
  { hex: '#0284C7', name: 'Sky' },
  { hex: '#0F172A', name: 'Midnight' },
];

const PAGE_BLURBS: Record<string, string> = {
  signin: 'Secure entry with email, captcha and quick sign-in options',
  home: 'Quick access to all the functionality and an overview of your account',
  accounts: 'Portfolio, routing details and audited statements',
  transfers: 'One transfer flow at a time — replace by dragging a new component',
  send: 'Contacts dock, beneficiary validation, amount, and success',
  payments: 'Peer invoicing, QR, splits and outstanding receivables',
  cards: 'Metal card preview, security switches and PIN vault',
  history: 'Search and filter every transaction',
  notifications: 'Alert feed and delivery channel preferences',
  profile: 'Identity, security baseline and connected devices',
  splash: 'Brand launch and loading experience',
};

const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastWithWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

interface PageMenuItemProps {
  page: string;
  label: string;
  count: number;
  active: boolean;
  expanded: boolean;
  accent: string;
  isCustom: boolean;
  singleSlot: boolean;
  dropSide: 'top' | 'bottom' | null;
  canvasModules: ModuleId[];
  thumbCtx: ViewCtx;
  appKind: AppKind;
  onSelect: () => void;
  onToggleExpand: () => void;
  onAddModule: (id: ModuleId) => void;
  onRemoveModule: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  drag: { id: ModuleId; from: 'library' | 'canvas' } | null;
  onPageDragStart: (e: React.DragEvent) => void;
  onPageDragEnd: () => void;
  onPageDragOver: (e: React.DragEvent) => void;
  onPageDrop: (e: React.DragEvent) => void;
  onMovePage: (dir: -1 | 1) => void;
  onRename?: (id: string, label: string) => void;
}

function PageMenuItem({
  page, label, count, active, expanded, accent, isCustom, singleSlot, dropSide, canvasModules, thumbCtx, appKind,
  onSelect, onToggleExpand, onAddModule, onRemoveModule, onStartDrag, onEndDrag, drag,
  onPageDragStart, onPageDragEnd, onPageDragOver, onPageDrop, onMovePage, onRename,
}: PageMenuItemProps) {
  const pageComponents = isCustom
    ? allModulesFor()
    : allModulesFor().filter((m) =>
        pageModulesFor(page as PageId, appKind).includes(m.id),
      );

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(label);

  const startRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameValue(label);
    setIsRenaming(true);
  };
  const finishRename = () => {
    const v = renameValue.trim();
    if (v && v !== label && onRename) onRename(page, v);
    setIsRenaming(false);
  };

  return (
    <li className="relative list-none" onDragOver={onPageDragOver} onDrop={onPageDrop}>
      {dropSide && (
        <span aria-hidden className={`pointer-events-none absolute inset-x-1 z-10 h-0.5 rounded-full ${dropSide === 'top' ? '-top-[3px]' : '-bottom-[3px]'}`} style={{ background: accent }} />
      )}

      <div
        draggable
        onDragStart={onPageDragStart}
        onDragEnd={onPageDragEnd}
        style={active ? { background: `${accent}12`, borderColor: `${accent}38` } : undefined}
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors ${active ? '' : 'border-transparent hover:bg-white/60'}`}
      >
        <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-slate-300 active:cursor-grabbing" aria-hidden />
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {isRenaming ? (
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={finishRename}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); finishRename(); } if (e.key === 'Escape') setIsRenaming(false); }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 rounded border border-blue-400 bg-white px-1 py-0.5 text-[12px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <button
              type="button"
              onClick={onSelect}
              onKeyDown={(e) => {
                if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); onMovePage(-1); }
                if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); onMovePage(1); }
              }}
              aria-current={active ? 'page' : undefined}
              title="Alt + Arrow keys to reorder"
              style={active ? { color: accent } : undefined}
              className={`min-w-0 flex-1 cursor-pointer truncate text-left text-[12px] outline-none focus-visible:underline ${active ? 'font-semibold' : 'font-medium text-slate-700'}`}
            >
              {label}
            </button>
          )}
          {isCustom && !isRenaming && (
            <button
              type="button"
              onClick={startRename}
              aria-label="Rename page"
              title="Rename page"
              className="grid h-4 w-4 shrink-0 cursor-pointer place-items-center rounded text-slate-400 transition hover:bg-white hover:text-slate-700"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
        <span
          style={active ? { background: accent } : undefined}
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${active ? 'font-semibold text-white' : 'bg-[#E3E6F7] font-medium text-slate-500'}`}
        >
          {count} comps
        </span>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={expanded ? `Hide ${label} components` : `Show ${label} components`}
          aria-expanded={expanded}
          style={active ? { color: accent } : undefined}
          className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full transition ${active ? '' : 'text-slate-400 hover:text-slate-700'}`}
        >
          {expanded ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" strokeWidth={active ? 2.75 : 2} />}
        </button>
      </div>

      {expanded && (
        <div className={`my-1.5 space-y-2 rounded-xl border border-[#E1E5F8] bg-white p-2 shadow-inner ${isCustom ? 'max-h-[320px] overflow-y-auto scrollbar-none' : ''}`}>
          {isCustom && (
            <p className="px-1 pb-1 text-[9px] italic leading-snug text-slate-400">
              Drag any component from the full library below into this custom page.
            </p>
          )}
          {singleSlot && (
            <p className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-medium leading-snug text-blue-700">
              This page holds one component at a time — adding a new one replaces the current.
            </p>
          )}
          {pageComponents.map((mod) => {
            const isAdded = canvasModules.includes(mod.id);
            const isDragging = drag?.id === mod.id && drag.from === 'library';
            return (
              <div
                key={mod.id}
                draggable
                onDragStart={(e) => onStartDrag(e, mod.id, 'library')}
                onDragEnd={onEndDrag}
                style={isAdded ? ringVar(accent) : undefined}
                className={`flex cursor-grab flex-col gap-2 rounded-lg bg-white p-2.5 ring-1 transition active:cursor-grabbing ${isAdded ? 'ring-2' : 'ring-slate-100 hover:ring-slate-200'} ${isDragging ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                      <h4 className="text-[11px] font-semibold text-slate-900">{mod.title}</h4>
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${mod.badgeColor}`}>{mod.badge}</span>
                    </div>
                    <p className="text-[9px] text-slate-500">{mod.subtitle}</p>
                  </div>
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
                </div>

                <div aria-hidden className="pointer-events-none select-none overflow-hidden rounded-md bg-[#F4F5FD] p-2">
                  <div className={outfit.className}><ModuleView id={mod.id} ctx={thumbCtx} /></div>
                </div>

                <button
                  type="button"
                  onClick={() => (isAdded ? onRemoveModule(mod.id) : onAddModule(mod.id))}
                  aria-label={isAdded ? `Remove ${mod.title}` : `Add ${mod.title}`}
                  style={isAdded ? { color: accent, background: `${accent}14` } : undefined}
                  className={`flex w-full cursor-pointer items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-bold transition ${isAdded ? '' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {isAdded ? (<><Check className="h-3 w-3 stroke-[3]" /> Added</>) : (<><Plus className="h-3 w-3" /> {singleSlot ? 'Use this' : 'Add'}</>)}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}

interface PageCanvasProps {
  page: PageId;
  pageLabel: string;
  modules: ModuleId[];
  ctx: ViewCtx;
  editMode: boolean;
  density: Density;
  drag: { id: ModuleId; from: 'library' | 'canvas' } | null;
  dropIndex: number | null;
  appKind: AppKind;
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
  page, pageLabel, modules, ctx, editMode, density, drag, dropIndex, appKind,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove, onQuickAdd,
  onBackHome, isDark, accent, radius,
}: PageCanvasProps) {
  const suggestions: ModuleId[] = pageModulesFor(page, appKind).length
    ? pageModulesFor(page, appKind)
    : ['accounts', 'transfers', 'cards'];

  return (
    <>
      {onBackHome && (
        <button type="button" onClick={onBackHome} className="mb-3 flex cursor-pointer items-center gap-1 self-start text-[11px] font-semibold hover:underline" style={{ color: accent }}>
          &larr; Back to Home
        </button>
      )}

      {page !== 'home' && <h3 className="mb-3 text-[15px] font-bold">{pageLabel}</h3>}

      {modules.length === 0 ? (
  <div
    onDragOver={(e) => {
      if (!drag) return;
      e.preventDefault();
      e.stopPropagation();
    }}
    onDrop={onDrop}
    style={drag ? { borderColor: accent, background: `${accent}14` } : undefined}
    className={`my-auto flex flex-col items-center justify-center space-y-3 border-2 border-dashed p-6 text-center transition-colors ${radius.card} ${
      drag ? 'border-solid' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-blue-300/60 bg-blue-50/20'
    }`}
  >
          <div className={`grid h-12 w-12 place-items-center text-white shadow-sm ${radius.icon}`} style={{ background: accent }}><Plus className="h-6 w-6" /></div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold">{drag ? 'Drop to add it here' : `Build the ${pageLabel} page`}</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">Drag tiles from the page menu, or tap a suggestion below.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
            {suggestions.slice(0, 3).map((id) => {
              const label = moduleFor(id)?.title ?? id;
              return (
                <button key={id} type="button" onClick={() => onQuickAdd(id)} className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
                  + {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col ${density === 'compact' ? 'gap-2.5' : 'gap-4'}`}>
          {modules.map((id, i) => {
            const mod = moduleFor(id);
            const title = mod?.title ?? id;
            const isSource = drag?.from === 'canvas' && drag.id === id;
            return (
              <div
                key={id} data-module-id={id} draggable={editMode}
                onMouseDown={(e) => {
                  const isField = (e.target as HTMLElement).closest('input,textarea,select');
                  e.currentTarget.draggable = editMode && !isField;
                }}
                onDragStart={(e) => onStartDrag(e, id, 'canvas')}
                onDragEnd={onEndDrag}
                onDragOver={(e) => onItemDragOver(e, i)}
                onDrop={onDrop}
                style={{ ['--tw-ring-color' as string]: accent } as React.CSSProperties}
                className={`group relative ${radius.card} ${editMode ? 'cursor-grab ring-offset-2 focus-within:ring-2 hover:ring-2 active:cursor-grabbing' : ''} ${isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'} ${isSource ? 'opacity-40' : ''}`}
              >
                {drag && dropIndex === i && <DropLine side="top" accent={accent} />}
                {drag && dropIndex === modules.length && i === modules.length - 1 && <DropLine side="bottom" accent={accent} />}

                {editMode && (
                  <div className="absolute -top-3.5 right-2 z-20 flex items-center gap-0.5 rounded-full bg-white p-0.5 opacity-0 shadow-md ring-1 ring-slate-200 transition group-focus-within:opacity-100 group-hover:opacity-100">
                    <GripVertical className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                    <ToolbarButton label={`Move ${title} up`} disabled={i === 0} onClick={() => onMove(id, -1)}><ChevronUp className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton label={`Move ${title} down`} disabled={i === modules.length - 1} onClick={() => onMove(id, 1)}><ChevronDown className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton label={`Remove ${title}`} danger onClick={() => onRemove(id)}><Trash2 className="h-3.5 w-3.5" /></ToolbarButton>
                  </div>
                )}

                <div className={drag ? 'pointer-events-none' : ''}><ModuleView id={id} ctx={ctx} /></div>
              </div>
            );
          })}
        </div>
      )}
      
    </>
  );
}

const CODE_TABS: { id: CodeLang; label: string }[] = [
  { id: 'swiftui', label: 'SwiftUI' },
  { id: 'typescript', label: 'Typescript' },
  { id: 'reactnative', label: 'React Native' },
  { id: 'kotlin', label: 'Kotlin' },
];

const indentLines = (snippet: string, n: number) =>
  snippet.split('\n').map((l) => ' '.repeat(n) + l);

function buildCode(
  lang: CodeLang, pageLabel: string, modules: ModuleId[], brand: string, accent: string, density: Density, balance: number
): string[] {
  const ident = pageLabel.replace(/[^A-Za-z0-9]+/g, '') || 'Page';
  const spacing = density === 'compact' ? 10 : 16;
  const bal = balance.toFixed(2);
  const theme = `// Theme: ${brand || 'Brand'} (${accent.toUpperCase()})`;
  const snippets = modules.map((id) => moduleFor(id)?.code[lang] ?? `// ${id}`);
  const place = (n: number, empty: string) => (snippets.length ? snippets.flatMap((s) => indentLines(s, n)) : [' '.repeat(n) + empty]);

  if (lang === 'swiftui') {
    return [
      '// Standard SwiftUI Whitelabel Screen', theme, '', 'import SwiftUI', '',
      `struct ${ident}Screen: View {`,
      `  @State private var availableBalance: Decimal = ${bal}`,
      '  @State private var pendingBalance: Decimal = 1200.00',
      '  @State private var previewState: String = "Default"',
      '', '  var body: some View {', '    ScrollView {', `      VStack(spacing: ${spacing}) {`,
      ...place(8, '// No components yet'),
      '      }', '      .padding(.horizontal, 16)', '    }',
      '    .background(Color("AppSurface"))', `    .navigationTitle("${pageLabel}")`, '  }', '}',
    ];
  }
  if (lang === 'typescript') {
    return [
      '// Standard TypeScript Whitelabel Screen', theme, '',
      'import React, { useState } from "react";', 'import { ScrollView, Stack } from "@studio/ui";', '',
      `export const ${ident}Screen = () => {`, `  const [availableBalance] = useState(${bal});`, '  return (',
      `    <ScrollView background="AppSurface" title="${pageLabel}">`, `      <Stack spacing={${spacing}} paddingX={16}>`,
      ...place(8, '{/* No components yet */}'),
      '      </Stack>', '    </ScrollView>', '  );', '};',
    ];
  }
  if (lang === 'reactnative') {
    return [
      '// Standard React Native Whitelabel Screen', theme, '',
      'import React, { useState } from "react";', 'import { ScrollView, View } from "react-native";', '',
      `export const ${ident}Screen = () => {`, `  const [availableBalance] = useState(${bal});`, '  return (',
      '    <ScrollView style={{ backgroundColor: "AppSurface" }}>', `      <View style={{ gap: ${spacing}, paddingHorizontal: 16 }}>`,
      ...place(8, '{/* No components yet */}'),
      '      </View>', '    </ScrollView>', '  );', '};',
    ];
  }
  return [
    '// Standard Jetpack Compose Whitelabel Screen', theme, '',
    'import androidx.compose.foundation.layout.*', 'import androidx.compose.runtime.*', '',
    '@Composable', `fun ${ident}Screen() {`, `  var availableBalance by remember { mutableStateOf(${bal}) }`, '',
    '  Column(', `    verticalArrangement = Arrangement.spacedBy(${spacing}.dp),`, '    modifier = Modifier.padding(horizontal = 16.dp)', '  ) {',
    ...place(4, '// No components yet'),
    '  }', '}',
  ];
}

const TOKEN =
  /(\/\/.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(@\w+|\b(?:import|struct|var|let|some|private|func|fun|val|by|return|export|const|from|class)\b)|(\b[A-Z][A-Za-z0-9]*Component\b)|(\b[A-Z][A-Za-z0-9]*\b)/g;

function highlight(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const color = m[1] ? '#94A3B8' : m[2] ? '#DC2626' : m[3] ? '#EA580C' : m[4] ? '#C026D3' : m[5] ? '#D97706' : '#2563EB';
    out.push(<span key={m.index} style={{ color }}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function CodePanel({
  pageLabel, blurb, modules, lang, onLang, accent, brand, density, balance,
}: {
  pageLabel: string; blurb: string; modules: ModuleId[]; lang: CodeLang; onLang: (l: CodeLang) => void;
  accent: string; brand: string; density: Density; balance: number;
}) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => buildCode(lang, pageLabel, modules, brand, accent, density, balance), [lang, pageLabel, modules, brand, accent, density, balance]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(lines.join('\n')); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="px-5 pb-3 pt-4">
        <h3 className="text-[14px] font-bold text-slate-900">{pageLabel}</h3>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{blurb}</p>
      </div>

      <div className="flex items-stretch justify-between border-y border-slate-200 bg-[#F4F5FC]" role="tablist" aria-label="Code language">
        <div className="flex">
          {CODE_TABS.map((t) => {
            const active = lang === t.id;
            return (
              <button
                key={t.id} type="button" role="tab" aria-selected={active} onClick={() => onLang(t.id)}
                style={active ? { borderBottomColor: accent } : undefined}
                className={`-mb-px cursor-pointer border-b-2 px-3.5 py-2.5 text-[11px] font-semibold outline-none transition focus-visible:underline ${active ? 'bg-white text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={copy} aria-label={copied ? 'Code copied' : 'Copy code'} title="Copy code"
          className="mr-2 grid h-8 w-8 cursor-pointer place-items-center self-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <pre className="scrollbar-none min-h-0 flex-1 overflow-auto px-5 py-4 font-mono text-[10.5px] leading-[1.75] text-slate-700">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre">{line === '' ? ' ' : highlight(line)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function Segmented<T extends string>({
  label, value, options, onChange, variant,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; Icon?: React.ComponentType<{ className?: string }> }[];
  onChange: (v: T) => void;
  variant: 'track' | 'buttons';
}) {
  return (
    <div role="radiogroup" aria-label={label} className={variant === 'track' ? 'grid gap-1 rounded-xl bg-[#EEF0FB] p-1' : 'grid gap-2'} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map(({ id, label: l, Icon }) => {
        const on = value === id;
        return (
          <button
            key={id} type="button" role="radio" aria-checked={on} onClick={() => onChange(id)}
            className={`flex cursor-pointer items-center justify-center gap-1.5 text-[12px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-[#0040DF] ${variant === 'track' ? `rounded-lg py-2 ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}` : `rounded-md py-2.5 ${on ? 'bg-[#0040DF] text-white' : 'bg-[#EEF0FB] text-slate-700 hover:bg-[#E3E6F7]'}`}`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}{l}
          </button>
        );
      })}
    </div>
  );
}

function StyleLabel({ id, children, right }: { id?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span id={id} className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{children}</span>
      {right}
    </div>
  );
}

interface StylePopoutProps {
  brandName: string; onBrandName: (v: string) => void;
  accent: string; onAccent: (v: string) => void;
  mode: 'light' | 'dark' | 'auto'; onMode: (v: 'light' | 'dark' | 'auto') => void;
  shape: RadiusMode; onShape: (v: RadiusMode) => void;
  density: Density; onDensity: (v: Density) => void;
  onClose: () => void;
}

function StylePopout({ brandName, onBrandName, accent, onAccent, mode, onMode, shape, onShape, density, onDensity, onClose }: StylePopoutProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<{ name: string; meta: string; url: string | null } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const ratio = contrastWithWhite(accent);

  useEffect(() => { nameRef.current?.focus(); }, []);
  useEffect(() => () => { if (logo?.url) URL.revokeObjectURL(logo.url); }, [logo]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const ok = /\.(svg|png)$/i.test(f.name) || f.type === 'image/svg+xml' || f.type === 'image/png';
    if (!ok) return setLogoError('Use an SVG or PNG file.');
    if (f.size > 2 * 1024 * 1024) return setLogoError('File is larger than 2MB.');
    setLogoError(null);
    const isSvg = /svg/i.test(f.type) || /\.svg$/i.test(f.name);
    setLogo({ name: f.name, meta: `${isSvg ? 'Vector' : 'Raster'} • ${Math.max(1, Math.round(f.size / 1024))} KB`, url: URL.createObjectURL(f) });
  };

  const assetName = logo?.name ?? `${(brandName.trim() || 'Brand').split(/\s+/)[0]}_Emblem.svg`;
  const assetMeta = logo?.meta ?? 'Vector • 48 × 48 dp • Scalable';

  return (
    <div role="dialog" aria-label="Brand and style" className="absolute left-3 top-3 z-30 max-h-[calc(100%-24px)] w-[min(300px,calc(100%-24px))] overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(30,41,90,0.28)] ring-1 ring-slate-200/80 scrollbar-none">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[17px] font-semibold text-slate-900"><Palette className="h-[18px] w-[18px] text-slate-600" /> Brand &amp; Style</h3>
        <button type="button" onClick={onClose} aria-label="Close style guide" className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="h-4 w-4" /></button>
      </div>

      <div className="space-y-5">
        <div>
          <StyleLabel id="sg-brand">Institution / Brand name</StyleLabel>
          <label className="flex items-center gap-2 rounded-lg bg-[#EEF0FB] px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#0040DF]">
            <Landmark className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            <input ref={nameRef} type="text" value={brandName} onChange={(e) => onBrandName(e.target.value)} aria-labelledby="sg-brand" className="w-full min-w-0 bg-transparent text-[13px] font-medium text-slate-900 outline-none" />
          </label>
        </div>

        <div>
          <StyleLabel right={<span className="text-[10px] text-slate-500">SVG/PNG max 2MB</span>}>Brand logo asset</StyleLabel>
          <div className="flex items-center gap-3 rounded-xl bg-[#EEF0FB] p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg text-[14px] font-bold text-white" style={{ background: accent }}>
              {logo?.url ? <img src={logo.url} alt="" className="h-full w-full object-contain" /> : (brandName.trim().charAt(0) || 'A').toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-900">{assetName}</p>
              <p className="text-[10px] text-slate-500">{assetMeta}</p>
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="cursor-pointer text-[12px] font-bold hover:underline" style={{ color: accent }}>Change</button>
            <input ref={fileRef} type="file" accept=".svg,.png,image/svg+xml,image/png" onChange={onFile} className="hidden" aria-label="Upload brand logo" />
          </div>
          {logoError && <p role="alert" className="mt-1.5 text-[10px] font-semibold text-rose-500">{logoError}</p>}
        </div>

        <div>
          <StyleLabel right={<span className="text-[12px] font-bold uppercase" style={{ color: accent }}>{accent}</span>}>Primary brand accent</StyleLabel>
          <div className="flex items-center gap-3 px-0.5 py-1" role="radiogroup" aria-label="Primary brand accent">
            {ACCENTS.map(({ hex, name }) => (
              <button
                key={hex} type="button" role="radio" aria-checked={accent === hex} aria-label={name} title={name} onClick={() => onAccent(hex)}
                style={{ backgroundColor: hex, ...ringVar(hex) }}
                className={`h-7 w-7 cursor-pointer rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-offset-2 ${accent === hex ? 'ring-2 ring-offset-2' : 'hover:scale-105'}`}
              />
            ))}
          </div>
          <p title={`Contrast with white labels: ${ratio.toFixed(1)}:1`} className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] ${ratio >= 4.5 ? 'bg-[#EEF0FB] text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
            <Contrast className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {ratio >= 4.5 ? 'Label adjusted for readability, contrast (WCAG AA)' : `Low contrast with white labels (${ratio.toFixed(1)}:1)`}
          </p>
        </div>

        <div>
          <StyleLabel>App interface mode</StyleLabel>
          <Segmented variant="track" label="App interface mode" value={mode} onChange={onMode}
            options={[{ id: 'light', label: 'Light', Icon: Sun }, { id: 'dark', label: 'Dark', Icon: Moon }, { id: 'auto', label: 'Auto', Icon: SunMoon }]} />
        </div>

        <div>
          <StyleLabel>Button shape</StyleLabel>
          <Segmented variant="buttons" label="Button shape" value={shape} onChange={onShape}
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

export default function BuildSection() {
  const [appKind, setAppKind] = useState<AppKind>('banking');
  const [styleOpen, setStyleOpen] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);

  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [brandName, setBrandName] = useState('Apex Bank');
  const userName = 'User';
  const [accentColor, setAccentColor] = useState('#0040DF');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<RadiusMode>('rounded');
  const [density, setDensity] = useState<Density>('spacious');
  const [prefersDark, setPrefersDark] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning!');
  const [codeLang, setCodeLang] = useState<CodeLang>('swiftui');

  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageModules, setPageModules] = useState<Record<PageId, ModuleId[]>>(buildInitialPages);
  const [histories, setHistories] = useState<Record<PageId, ModuleId[][]>>(() => {
    const out = {} as Record<PageId, ModuleId[][]>;
    for (const p of PAGES) out[p.id] = [];
    return out;
  });
  const [editMode, setEditMode] = useState(true);
  const [customPages, setCustomPages] = useState<{ id: string; label: string }[]>([]);
  const [pageOrder, setPageOrder] = useState<string[]>(() => PAGES.map((p) => p.id));
  const [expandedPage, setExpandedPage] = useState<PageId | null>(null);
  const [pageDrag, setPageDrag] = useState<string | null>(null);
  const [pageDrop, setPageDrop] = useState<number | null>(null);

  const labelFor = (id: string) =>
    customPages.find((p) => p.id === id)?.label ?? PAGES.find((p) => p.id === id)?.label ?? 'Page';

  // Page menu count: kit size for built-in pages, current canvas count for custom pages.
  const countFor = (id: string, appKind: AppKind) => {
  if (id.startsWith('custom-')) return (pageModules[id as PageId] ?? []).length;
  return pageModulesFor(id as PageId, appKind).length;
};

  const canvasModules = pageModules[activePage] ?? [];
  const history = histories[activePage] ?? [];
  const currentPageLabel = labelFor(activePage);
  const currentBlurb = PAGE_BLURBS[activePage] ?? 'A custom page built from your own components';
  const isSingleSlot = !!SINGLE_SLOT[activePage];

  const [drag, setDrag] = useState<{ id: ModuleId; from: 'library' | 'canvas' } | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

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

  const radius = RADII[buttonRadius];
  const isDark = interfaceMode === 'dark' || (interfaceMode === 'auto' && prefersDark);
  const isAndroid = platform === 'android';
  const accentName = ACCENTS.find((a) => a.hex === accentColor)?.name ?? 'Custom';

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

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (!styleOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setStyleOpen(false); styleBtnRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [styleOpen]);

  const closeStyle = () => { setStyleOpen(false); styleBtnRef.current?.focus(); };

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
    if (isSingleSlot) {
      commit([id]);
      return;
    }
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
    if (isSingleSlot) {
      commit([id]);
      setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
      scrollModuleIntoView(id);
      return;
    }
    if (canvasModules.includes(id)) return;
    commit([...canvasModules, id]);
    setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
    scrollModuleIntoView(id);
  };

  const removeModule = (id: ModuleId) => commit(canvasModules.filter((m) => m !== id));

  const moveModule = (id: ModuleId, dir: -1 | 1) => {
    const i = canvasModules.indexOf(id);
    const j = i + dir;
    if (i === -1 || j < 0 || j >= canvasModules.length) return;
    const next = [...canvasModules];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };

  const loadStarter = () => {
  const kit = pageModulesFor(activePage, appKind);
  commit(isSingleSlot ? kit.slice(0, 1) : kit);
  setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
};

  const selectPage = (id: PageId) => {
    setActivePage(id);
    setActiveTab(PAGE_TO_TAB[id] ?? 'home');
    setExpandedPage(id);
  };

  const goToPage = (id: PageId) => {
    setActivePage(id);
    setActiveTab(PAGE_TO_TAB[id] ?? 'home');
  };

  const addCustomPage = () => {
    const id = `custom-${Date.now()}`;
    const label = `Custom page ${customPages.length + 1}`;
    setCustomPages((p) => [...p, { id, label }]);
    setPageOrder((o) => [...o, id]);
    setPageModules((p) => ({ ...p, [id]: [] } as Record<PageId, ModuleId[]>));
    setHistories((p) => ({ ...p, [id]: [] } as Record<PageId, ModuleId[][]>));
    setActivePage(id as PageId);
    setActiveTab('home');
    setExpandedPage(id as PageId);
  };

  const renamePage = (id: string, label: string) => {
    setCustomPages((prev) => prev.map((p) => (p.id === id ? { ...p, label } : p)));
  };

  const reorderPage = (id: string, index: number) =>
    setPageOrder((o) => {
      const from = o.indexOf(id);
      if (from < 0) return o;
      const rest = o.filter((x) => x !== id);
      let at = index;
      if (from < index) at -= 1;
      rest.splice(Math.max(0, Math.min(at, rest.length)), 0, id);
      return rest;
    });

  const movePage = (id: string, dir: -1 | 1) => {
    const i = pageOrder.indexOf(id);
    if (i < 0) return;
    reorderPage(id, dir < 0 ? i - 1 : i + 2);
  };

  const startPageDrag = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', `page:${id}`);
    e.dataTransfer.effectAllowed = 'move';
    setPageDrag(id);
  };
  const endPageDrag = () => { setPageDrag(null); setPageDrop(null); };
  const overPage = (e: React.DragEvent, index: number) => {
    if (!pageDrag) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    setPageDrop(e.clientY < r.top + r.height / 2 ? index : index + 1);
  };
  const dropPage = (e: React.DragEvent) => {
    if (!pageDrag) return;
    e.preventDefault();
    e.stopPropagation();
    reorderPage(pageDrag, pageDrop ?? pageOrder.length);
    endPageDrag();
  };

  const startDrag = (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => {
  e.stopPropagation();
  e.dataTransfer.setData('text/plain', id);
  e.dataTransfer.setData('application/x-pf-module-id', id);
  e.dataTransfer.effectAllowed = from === 'library' ? 'copyMove' : 'move';
  setDrag({ id, from });
  if (activeTab !== PAGE_TO_TAB[activePage]) setActiveTab(PAGE_TO_TAB[activePage] ?? 'home');
};

  const endDrag = () => { setDrag(null); setDropIndex(null); };

  const autoScroll = (clientY: number) => {
    const el = bodyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (clientY < r.top + 48) el.scrollBy({ top: -14 });
    else if (clientY > r.bottom - 48) el.scrollBy({ top: 14 });
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
  const types = Array.from(e.dataTransfer.types);
  const isOurDrag = types.includes('application/x-pf-module-id');
  if (!drag && !isOurDrag) return;
  e.preventDefault();
  e.stopPropagation();
  if (drag) {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
    autoScroll(e.clientY);
  }
};

  const handleContainerDragOver = (e: React.DragEvent) => {
  const types = Array.from(e.dataTransfer.types);
  const isOurDrag = types.includes('application/x-pf-module-id');
  if (!drag && !isOurDrag) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = drag?.from === 'library' ? 'copy' : 'move';
  if (drag) {
    setDropIndex(canvasModules.length);
    autoScroll(e.clientY);
  }
};

  const handleContainerDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  // Fallback to dataTransfer so drops still work even if React state
  // hasn't committed `drag` yet (very common race on fast drags).
  const id = (drag?.id ?? e.dataTransfer.getData('application/x-pf-module-id')) as ModuleId | '';
  if (!id) { endDrag(); return; }

  // FIX: check against ALL modules (built-in + banking/wallet + crypto)
  if (allModulesFor().some((m) => m.id === id)) {
    placeModule(id, dropIndex ?? canvasModules.length);
    scrollModuleIntoView(id);
  }
  endDrag();
};

  const handleSend = () => {
    const amt = parseAmount(sendAmount);
    if (amt <= 0) return setSendError('Enter an amount greater than $0.00.');
    if (amt > balance) return setSendError(`That is more than your available balance of ${usd(balance)}.`);
    if (!recipient.trim()) return setSendError('Enter a recipient account or IBAN.');
    setSendError(null);
    setBalance((b) => round2(b - amt));
    setOutcome((o) => o + amt);
    setTransactions((t) => [{ id: `t${Date.now()}`, name: 'Wire Transfer', sub: 'Transfer · Just now', amount: amt, method: 'Wire', kind: 'out' }, ...t]);
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
    payments: () => goToPage('payments'),
    payBill: () => showToast('Choose a biller to pay'),
    topUp: () => showToast('Top up from linked card'),
    openWallet: () => goToPage('cards'),
    openFx: () => setActiveTab('fx'),
    openHistory: () => goToPage('history'),
    seeAllSavings: () => showToast(`${savings.length} savings goals active`),
    deposit: handleDeposit,
    toggleFaceId: () => setFaceId((v) => !v),
    openAlerts: () => goToPage('notifications'),
    signIn: () => goToPage('home'),
    skipSignIn: () => goToPage('home'),
    quickSignIn: (provider) => {
      const names: Record<'google' | 'facebook' | 'apple' | 'phone', string> = {
        google: 'Google', facebook: 'Facebook', apple: 'Apple', phone: 'phone number',
      };
      showToast(`Continue with ${names[provider]}`);
      goToPage('home');
    },
    toggleFreeze: () => setIsCardFrozen((v) => !v),
  };

  const liveCtx: ViewCtx = { radius, accent: accentColor, isDark, interactive: true, balance, income, outcome, savings, transactions, faceId, isCardFrozen, actions };
  const thumbCtx: ViewCtx = {
    radius, accent: accentColor, isDark: false, interactive: false, balance: INITIAL_BALANCE, income: INITIAL_INCOME, outcome: INITIAL_OUTCOME,
    savings: INITIAL_SAVINGS, transactions: INITIAL_TRANSACTIONS, faceId: true, isCardFrozen: false, actions: noopActions,
  };

  const pageSurface = surface(isDark);
  const inputCls = `w-full border p-3 text-xs outline-none focus:ring-2 ${radius.icon} ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'}`;

  const navItems: { id: TabId; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'cards', label: 'Wallet', Icon: Wallet },
    { id: 'activity', label: 'Activity', Icon: BarChart3 },
    { id: 'settings', label: 'Profile', Icon: User },
  ];

  const hasAlerts = canvasModules.includes('notifications');

  const canvasProps = {
    page: activePage, pageLabel: currentPageLabel, modules: canvasModules, ctx: liveCtx, editMode, density, drag, dropIndex, appKind,
    onStartDrag: startDrag, onEndDrag: endDrag, onItemDragOver: handleItemDragOver, onDrop: handleDrop,
    onMove: moveModule, onRemove: removeModule, onQuickAdd: addModule, isDark, accent: accentColor, radius,
  };

  const needsBackHome = activePage !== 'home' && PAGE_TO_TAB[activePage] === 'home';

  const segBtn = (on: boolean) =>
    `flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`;
  const iconBtn =
    'grid h-7 w-7 cursor-pointer place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <section className="w-full overflow-hidden bg-[#f4f6fc] px-4 py-12 font-sans text-slate-900 sm:px-6 md:py-16 lg:px-10">
      <div className="mx-auto max-w-full space-y-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#0040DF]">CORE MODULES</span>
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.25rem]">
              Customize every part of your banking app and mold it into your brand
            </h2>
          </div>
          <p className="max-w-md text-sm font-normal leading-relaxed text-slate-500">
            Choose a starting point, adjust colours and components, and watch the app update as you go. Each platform keeps its own navigation and patterns. Availability is confirmed per programme
          </p>
        </div>

        <div className="overflow-hidden border border-[#DDE2F6] bg-[#EEF0FB] shadow-[0_10px_40px_rgba(37,52,120,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E1E5F8] bg-[#F4F5FD] px-5 py-2.5">
            <div className="flex items-center gap-3">
              <h3 className="text-[13px] font-semibold text-slate-800">FintecConnect Mobile Application Build</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5 rounded-lg bg-slate-200/70 p-0.5" role="group" aria-label="Platform">
                {(['ios', 'android'] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setPlatform(p)} aria-pressed={platform === p} className={segBtn(platform === p)}>
                    {p === 'ios' ? 'Apple iOS' : 'Android'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-0.5 rounded-lg bg-slate-200/70 p-0.5" role="group" aria-label="Canvas mode">
                <button type="button" onClick={() => setEditMode(true)} aria-pressed={editMode} className={segBtn(editMode)}><Pencil className="h-2.5 w-2.5" /> Edit</button>
                <button type="button" onClick={() => setEditMode(false)} aria-pressed={!editMode} className={segBtn(!editMode)}><Eye className="h-2.5 w-2.5" /> Preview</button>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={loadStarter} aria-label="Load starter layout for this page" title="Starter layout" className={iconBtn}><Sparkles className="h-3.5 w-3.5 text-[#0040DF]" /></button>
                <button type="button" onClick={undo} disabled={history.length === 0} aria-label="Undo" title="Undo" className={iconBtn}><Undo2 className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => commit([])} disabled={canvasModules.length === 0} aria-label="Clear this page" title="Clear page" className={iconBtn}><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:h-[700px] lg:grid-cols-[minmax(250px,26%)_minmax(0,1fr)_minmax(290px,30%)]">
            <aside className="flex min-h-0 flex-col border-r border-[#E1E5F8] bg-[#EDEFFC]">
              <div className="space-y-4 px-4 pb-2 pt-5">
                <div>
                  <label htmlFor="product-type" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">Product Type</label>
                  <div className="relative">
                    <select
                      id="product-type" value={appKind} onChange={(e) => setAppKind(e.target.value as AppKind)}
                      className="w-full cursor-pointer appearance-none rounded-lg bg-white px-3.5 py-2.5 pr-9 text-[13px] font-semibold text-slate-900 shadow-sm outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#0040DF]"
                    >
                      {APP_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden />
                  </div>
                </div>

                <button
                  ref={styleBtnRef} type="button" onClick={() => setStyleOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={styleOpen}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#E2E6FA] px-3 py-2.5 text-left outline-none transition hover:bg-[#DADFF8] focus-visible:ring-2 focus-visible:ring-[#0040DF]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: accentColor }}><Palette className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-slate-900">Style Guide</span>
                    <span className="block truncate text-[11px] text-slate-500">{brandName || 'Your brand'} · {accentName}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" style={{ color: accentColor }} aria-hidden />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Pages</span>
                  <span className="text-[11px] text-slate-500">Reorderable</span>
                </div>
              </div>

              <ul className="scrollbar-none m-0 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-3" aria-label="App pages">
                {pageOrder.map((id, i) => {
                  const isCustom = id.startsWith('custom-');
                  const dropSide = pageDrag ? (pageDrop === i ? 'top' : pageDrop === pageOrder.length && i === pageOrder.length - 1 ? 'bottom' : null) : null;
                  return (
                    <PageMenuItem
                      key={id} page={id} label={labelFor(id)}
                      count={countFor(id, appKind)}
                      active={activePage === id} expanded={expandedPage === id} accent={accentColor} isCustom={isCustom} singleSlot={!!SINGLE_SLOT[id as PageId]} dropSide={dropSide}
                      canvasModules={canvasModules} thumbCtx={thumbCtx} appKind={appKind}
                      onSelect={() => selectPage(id as PageId)}
                      onToggleExpand={() => { if (expandedPage === id) setExpandedPage(null); else selectPage(id as PageId); }}
                      onAddModule={addModule} onRemoveModule={removeModule} onStartDrag={startDrag} onEndDrag={endDrag} drag={drag}
                      onPageDragStart={(e) => startPageDrag(e, id)} onPageDragEnd={endPageDrag}
                      onPageDragOver={(e) => overPage(e, i)} onPageDrop={dropPage} onMovePage={(dir) => movePage(id, dir)}
                      onRename={renamePage}
                    />
                  );
                })}
              </ul>

              <div className="border-t border-[#E1E5F8] bg-[#E6E9FA] p-3">
                <button
                  type="button" onClick={addCustomPage}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-[13px] font-semibold shadow-sm outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0040DF]"
                  style={{ color: accentColor }}
                >
                  <PlusCircle className="h-4 w-4" /> Add your own page
                </button>
              </div>
            </aside>

            <div className="relative flex min-h-0 flex-col items-center bg-gradient-to-b from-[#EEF0FB] via-[#F6F7FE] to-[#EEF0FB] pb-4">
              {styleOpen && <div className="absolute inset-0 z-20" onClick={closeStyle} aria-hidden />}
              {styleOpen && (
                <StylePopout
                  brandName={brandName} onBrandName={setBrandName} accent={accentColor} onAccent={setAccentColor}
                  mode={interfaceMode} onMode={setInterfaceMode} shape={buttonRadius} onShape={setButtonRadius}
                  density={density} onDensity={setDensity} onClose={closeStyle}
                />
              )}

              <p className="flex items-center gap-1.5 py-3 text-[10px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" aria-hidden /> Live Sandbox
              </p>

              <div className={`relative w-full max-w-[340px] shrink-0 border-[3px] border-[#1d2b52] bg-[#101c3a] p-[9px] shadow-2xl ring-1 ring-white/10 ${isAndroid ? 'rounded-[32px]' : 'rounded-[42px]'}`}>
                {isAndroid ? <div className="absolute left-1/2 top-[16px] z-30 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black" />
                  : <div className="absolute left-1/2 top-[16px] z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />}

                <div className={`${outfit.className} relative flex h-[590px] w-full flex-col overflow-hidden transition-colors duration-300 ${isAndroid ? 'rounded-[24px]' : 'rounded-[32px]'} ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F7F8FF] text-slate-900'}`}>
                  <div className="flex h-10 shrink-0 items-end justify-between px-6 pb-1 text-[10px] font-semibold">
                    <span>09:41</span>
                    <span className="flex items-center gap-1"><Signal className="h-2.5 w-2.5" /><Wifi className="h-2.5 w-2.5" /><BatteryFull className="h-3 w-3" /></span>
                  </div>

                  <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`grid h-8 w-8 place-items-center text-xs font-bold text-white ${radius.icon === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} style={{ background: accentColor }}>
                        {(userName || brandName || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <p className="text-[9px] text-slate-400">{greeting}</p>
                        <p className="text-[11px] font-semibold">{userName || brandName || 'Welcome'}</p>
                      </div>
                    </div>
                    <button type="button" aria-label="Notifications" onClick={() => showToast(hasAlerts ? '3 new alerts' : 'No new notifications')}
                      className={`relative grid h-7 w-7 cursor-pointer place-items-center ${radius.icon === 'rounded-full' ? 'rounded-full' : radius.icon}`}>
                      <Bell className="h-[15px] w-[15px]" />
                      {hasAlerts && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: PINK }} />}
                    </button>
                  </div>

                  <div ref={bodyRef} onDragOver={handleContainerDragOver} onDragLeave={handleContainerDragLeave} onDrop={handleDrop}
                    className={`flex flex-1 flex-col overflow-y-auto pb-24 pt-3 scrollbar-none ${density === 'compact' ? 'px-3.5' : 'px-4'}`}>
                    {activeTab === 'home' && <PageCanvas {...canvasProps} onBackHome={needsBackHome ? () => goToPage('home') : undefined} />}
                    {activeTab === 'cards' && activePage === 'cards' && <PageCanvas {...canvasProps} />}
                    {activeTab === 'activity' && activePage === 'history' && <PageCanvas {...canvasProps} />}
                    {activeTab === 'settings' && activePage === 'profile' && <PageCanvas {...canvasProps} />}

                    {activeTab === 'send' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <button type="button" onClick={() => goToPage('home')} className="flex cursor-pointer items-center gap-1 text-[10px] font-semibold hover:underline" style={{ color: accentColor }}>&larr; Back to Home</button>
                          <span className="text-[10px] font-semibold text-slate-400">Wire Transfer</span>
                        </div>
                        <PageCanvas {...canvasProps} />
                        
                      </div>
                    )}

                    {activeTab === 'fx' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <button type="button" onClick={() => goToPage('home')} className="flex cursor-pointer items-center gap-1 text-[10px] font-semibold hover:underline" style={{ color: accentColor }}>&larr; Back to Home</button>
                          <span className="text-[10px] font-semibold text-slate-400">FX Spot Swap</span>
                        </div>
                        <div className={`space-y-2.5 p-3 ${radius.card} ${pageSurface}`}>
                          <div className={`flex items-center justify-between border p-2.5 text-[11px] ${radius.icon} ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                            <div className="min-w-0 flex-1">
                              <label htmlFor="fx-amount" className="block text-[8px] font-semibold text-slate-400">You Pay</label>
                              <input id="fx-amount" type="text" inputMode="decimal" value={fxAmount} onChange={(e) => setFxAmount(e.target.value)} onBlur={() => setFxAmount(formatAmount(parseAmount(fxAmount)))} className="w-full bg-transparent text-xs font-bold outline-none" />
                            </div>
                            <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-600">{fxFrom}</span>
                          </div>
                          <div className="flex justify-center">
                            <button type="button" aria-label="Swap currencies" onClick={() => setFxFrom((c) => (c === 'USD' ? 'EUR' : 'USD'))}
                              className={`grid h-7 w-7 cursor-pointer place-items-center border border-blue-100 bg-blue-50 text-blue-600 shadow-xs transition hover:bg-blue-100 ${radius.icon}`}>
                              <RefreshCw className="h-3 w-3" />
                            </button>
                          </div>
                          <div className={`flex items-center justify-between border p-2.5 text-[11px] ${radius.icon} ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                            <div><span className="block text-[8px] font-semibold text-slate-400">You Receive</span><span className="text-xs font-bold">{formatAmount(fxOutput)} {fxTo}</span></div>
                            <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-600">{fxTo}</span>
                          </div>
                          <p className="text-center text-[8px] text-slate-400">{fxFrom === 'USD' ? `1 USD = ${FX_RATE} EUR` : `1 EUR = ${(1 / FX_RATE).toFixed(4)} USD`}</p>
                          <button type="button" onClick={() => { showToast(`Swapped ${fxAmount} ${fxFrom} to ${formatAmount(fxOutput)} ${fxTo}`); goToPage('home'); }}
                            disabled={fxValue <= 0} className={`w-full cursor-pointer py-2.5 text-[11px] font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${radius.icon}`} style={{ background: accentColor }}>
                            Execute Spot Swap
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div aria-live="polite" role="status" className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-center px-4">
                    {toast && <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg ring-1 ring-white/10">{toast}</span>}
                  </div>

                  <nav aria-label="App navigation"
                    className={`absolute inset-x-3 bottom-3 z-20 flex items-center justify-around px-3 py-2.5 ${isDark ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-white shadow-[0_8px_30px_rgba(37,52,120,0.14)]'} ${isAndroid ? 'rounded-[16px]' : 'rounded-[20px]'}`}>
                    {navItems.map(({ id, label, Icon }) => {
                      const active = activeTab === id || (id === 'home' && (activeTab === 'send' || activeTab === 'fx'));
                      return (
                        <button key={id} type="button" aria-label={label} aria-current={active ? 'page' : undefined} onClick={() => goToPage(TAB_TO_PAGE[id])}
                          style={{ ...ringVar(accentColor), color: active ? accentColor : undefined }}
                          className={`cursor-pointer rounded-full p-1 outline-none transition focus-visible:ring-2 ${active ? '' : 'text-slate-400'}`}>
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            <div className="min-h-[420px] min-w-0 border-l border-[#E1E5F8] lg:min-h-0">
              <CodePanel
                pageLabel={currentPageLabel} blurb={currentBlurb} modules={canvasModules} lang={codeLang} onLang={setCodeLang}
                accent={accentColor} brand={brandName} density={density} balance={balance}
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