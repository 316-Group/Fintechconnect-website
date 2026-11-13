'use client';

import React, { useState } from 'react';
import {
  AlertCircle, ArrowDownLeft, ArrowRight, ArrowUp, ArrowUpRight, Bell,
  Camera, Car, Check, ChevronDown, ChevronLeft, ChevronRight, Coffee,
  CreditCard, Download, Droplet, EllipsisVertical, Eye, FileText, Globe,
  Headphones, Info, Landmark, Lock, LogOut, Minus, Pencil, PiggyBank, Play,
  Plus, QrCode, RefreshCw, Search, Settings, Share2, ShoppingBag, ShieldCheck,
  SlidersHorizontal, Snowflake, Sparkles, Star, Sun, TrendingUp, TrendingDown,
  Truck, Upload, User, Utensils, Wifi, X, Zap,
} from 'lucide-react';

import { EditableText, useModuleColor } from '@/app/userdashboard/studio/edit-context';

/* ------------------------------------------------------------------ */
/*  Shared types                                                       */
/* ------------------------------------------------------------------ */

export type BankingWalletModuleId =
  | 'homeHeroBalance' | 'quickSendRow' | 'spendingChart' | 'creditCardCarousel'
  | 'cardSecurityLock' | 'detailedHistory' | 'notificationCenter' | 'profileMenu'
  | 'sendMoneySheet' | 'transferMoneyHeader' | 'transferAmountMethods'
  | 'transferReviewFooter' | 'homeBlueHero' | 'billNegotiatorCard'
  | 'billsPaymentsList' | 'myCardsHero' | 'cardSpendingLimit'
  | 'cardSecurityPermissions' | 'cardCashPerks' | 'cardRecentActivity'
  | 'accountsSpendHero' | 'smartCashflowInsight' | 'spendingBreakdownList'
  | 'septemberBudgetCard' | 'transferDetailsHero' | 'transferRecipientCard'
  | 'transferDetailsSummary' | 'transferSecurityFooter' | 'profileIdentityHero'
  | 'vaultConciergeCard' | 'profileSettingsGroups' | 'profileHelpFooter'
  | 'notificationsHero' | 'notificationsFilterChips' | 'notificationsFeed'
  | 'notificationsQuietHours';

export type BWCategory =
  | 'balances' | 'actions' | 'fx' | 'ledger' | 'security' | 'onboarding';

export interface BWModuleAsset {
  id: BankingWalletModuleId;
  title: string;
  subtitle: string;
  category: BWCategory;
  badge: string;
  badgeColor: string;
  code: { swiftui: string; typescript: string; reactnative: string; kotlin: string };
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
    send: () => void; payments: () => void; payBill: () => void; topUp: () => void;
    openWallet: () => void; openFx: () => void; openHistory: () => void;
    seeAllSavings: () => void; deposit: (goalId: string) => void;
    toggleFaceId: () => void; openAlerts: () => void;
    signIn: () => void; skipSignIn: () => void;
    quickSignIn: (provider: 'google' | 'facebook' | 'apple' | 'phone') => void;
    toggleFreeze: () => void;
  };
}

/* ------------------------------------------------------------------ */
/*  Module catalogue (unchanged)                                       */
/* ------------------------------------------------------------------ */

export const BANKING_WALLET_MODULES: BWModuleAsset[] = [
  { id: 'homeHeroBalance', title: 'Total Balance Hero', subtitle: 'Purple gradient balance with transfer, receive and card actions', category: 'balances', badge: 'Hero', badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100', code: { swiftui: `BalanceHeroCard(\n  balance: 24787.00,\n  actions: [.transfer, .receive, .card]\n)`, typescript: `export const BalanceHeroCard = ({ balance }) => (\n  <GradientCard><Balance value={balance} /><ActionRow /></GradientCard>\n);`, reactnative: `<BalanceHeroCard balance={24787.00} />`, kotlin: `BalanceHeroCard(balance = 24787.00, actions = listOf(TRANSFER, RECEIVE, CARD))` } },
  { id: 'quickSendRow', title: 'Quick Send Row', subtitle: 'Avatar carousel of recent recipients', category: 'actions', badge: 'Quick', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `QuickSendRow(contacts: store.recent)`, typescript: `export const QuickSendRow = ({ contacts }) => (\n  <AvatarScroll items={contacts} onSelect={openSend} />\n);`, reactnative: `<QuickSendRow contacts={recent} />`, kotlin: `QuickSendRow(contacts = store.recent, onSelect = ::openSend)` } },
  { id: 'spendingChart', title: 'Spending Statistics', subtitle: 'Daily / Weekly / Monthly chart with highlighted day', category: 'ledger', badge: 'Chart', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: { swiftui: `SpendingStatistics(range: .daily, highlight: .wed)`, typescript: `export const SpendingStatistics = () => (\n  <Tabs items={['Daily','Weekly','Monthly']} /><Bars data={daily} />\n);`, reactnative: `<SpendingStatistics range="daily" />`, kotlin: `SpendingStatistics(range = Range.DAILY, highlight = Day.WED)` } },
  { id: 'creditCardCarousel', title: 'Credit Card Carousel', subtitle: 'Horizontal card deck with add-new slot', category: 'security', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `CreditCardCarousel(cards: store.cards, onAdd: addCard)`, typescript: `export const CreditCardCarousel = ({ cards }) => (\n  <HScroll>{cards.map(CreditCard)}</HScroll>\n);`, reactnative: `<CreditCardCarousel cards={cards} />`, kotlin: `CreditCardCarousel(cards = store.cards, onAdd = ::addCard)` } },
  { id: 'cardSecurityLock', title: 'Card Security Lock', subtitle: 'Temporarily freeze instant tap', category: 'security', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `CardSecurityLock(frozen: $frozen, onChange: card::lock)`, typescript: `export const CardSecurityLock = ({ frozen, onChange }) => (\n  <Row icon={<Lock />} trailing={<Switch checked={frozen} />} />\n);`, reactnative: `<CardSecurityLock frozen={frozen} onChange={setFrozen} />`, kotlin: `CardSecurityLock(frozen = state.frozen, onChange = card::lock)` } },
  { id: 'detailedHistory', title: 'Detailed Transaction History', subtitle: 'Search, filters, budget card and grouped rows', category: 'ledger', badge: 'Ledger', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: { swiftui: `DetailedHistory(search: $query, filter: $filter)`, typescript: `export const DetailedHistory = () => (\n  <SearchBar /><Chips /><BudgetCard /><GroupedRows />\n);`, reactnative: `<DetailedHistory />`, kotlin: `DetailedHistory(query = state.query, filter = state.filter)` } },
  { id: 'notificationCenter', title: 'Neo Guard Alert Center', subtitle: 'Smart protect banner and rich alert feed', category: 'security', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `NeoGuardAlertCenter(alerts: store.alerts)`, typescript: `export const NeoGuardAlertCenter = ({ alerts }) => (\n  <SmartProtectBanner /><AlertFeed items={alerts} />\n);`, reactnative: `<NeoGuardAlertCenter alerts={alerts} />`, kotlin: `NeoGuardAlertCenter(alerts = store.alerts)` } },
  { id: 'profileMenu', title: 'Kinetic Profile Menu', subtitle: 'Identity, points banner, settings groups', category: 'security', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `KineticProfileMenu(user: auth.current)`, typescript: `export const KineticProfileMenu = ({ user }) => (\n  <Identity /><PointsBanner /><SettingsGroups />\n);`, reactnative: `<KineticProfileMenu user={user} />`, kotlin: `KineticProfileMenu(user = auth.current)` } },
  { id: 'sendMoneySheet', title: 'Send Money Sheet', subtitle: 'Recipient, amount, source, note and slide-to-send', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `SendMoneySheet(\n  to: .daniel,\n  amount: 850,\n  source: .primary\n)`, typescript: `export const SendMoneySheet = () => (\n  <RecipientPicker /><AmountCard /><SourceCard /><SlideToSend />\n);`, reactnative: `<SendMoneySheet amount={850} />`, kotlin: `SendMoneySheet(to = DANIEL, amount = 850.0, source = PRIMARY)` } },
  { id: 'transferMoneyHeader', title: 'Transfer Money Header', subtitle: 'Blue hero with Send Again favourites and search', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `TransferMoneyHeader(\n  balance: 124892.65,\n  favorites: store.recent\n)`, typescript: `export const TransferMoneyHeader = ({ balance, favorites }) => (\n  <BlueHero /><SendAgain items={favorites} /><SearchBar />\n);`, reactnative: `<TransferMoneyHeader balance={124892.65} />`, kotlin: `TransferMoneyHeader(balance = 124892.65, favorites = store.recent)` } },
  { id: 'transferAmountMethods', title: 'Transfer Amount & Methods', subtitle: 'Amount chips with rail picker', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `TransferAmountMethods(\n  amount: 250,\n  method: .instant\n)`, typescript: `export const TransferAmountMethods = () => (\n  <AmountChips /><MethodList />\n);`, reactnative: `<TransferAmountMethods amount={250} />`, kotlin: `TransferAmountMethods(amount = 250.0, method = Method.INSTANT)` } },
  { id: 'transferReviewFooter', title: 'Transfer Review CTA', subtitle: 'Continue to review with encryption note', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `TransferReviewFooter(onReview: review)`, typescript: `export const TransferReviewFooter = ({ onReview }) => (\n  <PrimaryCTA onClick={onReview} /><EncryptionNote />\n);`, reactnative: `<TransferReviewFooter onReview={review} />`, kotlin: `TransferReviewFooter(onReview = ::review)` } },
  { id: 'homeBlueHero', title: 'Home Blue Hero', subtitle: 'Ethan-style greeting, total balance and quick actions', category: 'balances', badge: 'Hero', badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100', code: { swiftui: `HomeBlueHero(\n  user: auth.current,\n  balance: 124892.65,\n  delta: "+8.42%"\n)`, typescript: `export const HomeBlueHero = ({ user, balance }) => (\n  <BlueGradient><Greeting /><Balance /><ActionRow /></BlueGradient>\n);`, reactnative: `<HomeBlueHero balance={124892.65} />`, kotlin: `HomeBlueHero(user = auth.current, balance = 124892.65)` } },
  { id: 'billNegotiatorCard', title: 'Bill Negotiator', subtitle: 'Savings recommendation with start-negotiation CTA', category: 'actions', badge: 'New', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `BillNegotiatorCard(\n  provider: "AT&T Fiber",\n  savings: 12.00\n)`, typescript: `export const BillNegotiatorCard = ({ provider, savings }) => (\n  <OfferCard title="Bill negotiator" cta="Start negotiation" />\n);`, reactnative: `<BillNegotiatorCard savings={12.00} />`, kotlin: `BillNegotiatorCard(provider = "AT&T Fiber", savings = 12.0)` } },
  { id: 'billsPaymentsList', title: 'Bills & Payments', subtitle: 'All Bills / Need Actions tabs with due timeline', category: 'ledger', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: { swiftui: `BillsPaymentsList(\n  tab: $tab,\n  bills: store.bills\n)`, typescript: `export const BillsPaymentsList = ({ bills }) => (\n  <Segmented items={['All Bills','Need Actions']} /><Rows items={bills} />\n);`, reactnative: `<BillsPaymentsList bills={bills} />`, kotlin: `BillsPaymentsList(tab = state.tab, bills = store.bills)` } },
  { id: 'myCardsHero', title: 'My Cards Hero', subtitle: 'Blue hero with Visa card visual and quick actions', category: 'security', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `MyCardsHero(\n  card: store.cards.primary,\n  active: 2\n)`, typescript: `export const MyCardsHero = ({ card }) => (\n  <BlueGradient><CardVisual card={card} /><QuickActions /></BlueGradient>\n);`, reactnative: `<MyCardsHero card={card} />`, kotlin: `MyCardsHero(card = store.cards.primary)` } },
  { id: 'cardSpendingLimit', title: 'Card Monthly Spending Limit', subtitle: 'Usage progress with safe-to-spend hint', category: 'security', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `CardSpendingLimit(\n  spent: 2450,\n  limit: 8000,\n  safeUntil: .oct1\n)`, typescript: `export const CardSpendingLimit = ({ spent, limit }) => (\n  <Progress value={spent} max={limit} />\n);`, reactnative: `<CardSpendingLimit spent={2450} limit={8000} />`, kotlin: `CardSpendingLimit(spent = 2450.0, limit = 8000.0)` } },
  { id: 'cardSecurityPermissions', title: 'Card Security Permissions', subtitle: 'Online / International / ATM real-time toggles', category: 'security', badge: 'Shield', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `CardSecurityPermissions(\n  online: $online,\n  international: $intl,\n  atm: $atm\n)`, typescript: `export const CardSecurityPermissions = () => (\n  <PermissionRow id="online" /><PermissionRow id="intl" /><PermissionRow id="atm" />\n);`, reactnative: `<CardSecurityPermissions />`, kotlin: `CardSecurityPermissions(online = state.online, intl = state.intl, atm = state.atm)` } },
  { id: 'cardCashPerks', title: 'Card Cash Perks', subtitle: 'Highlighted cashback detected this cycle', category: 'security', badge: 'Card', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `CardCashPerks(rate: 3.0, categories: [.dining, .transport])`, typescript: `export const CardCashPerks = ({ rate }) => (\n  <PerksBanner rate={rate} cta="Explore Cashback Perks" />\n);`, reactnative: `<CardCashPerks rate={3.0} />`, kotlin: `CardCashPerks(rate = 3.0, categories = listOf(DINING, TRANSPORT))` } },
  { id: 'cardRecentActivity', title: 'Card Recent Activity', subtitle: 'Apple Store, Starbucks and Uber purchases', category: 'ledger', badge: 'Live', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: { swiftui: `CardRecentActivity(items: store.cardActivity)`, typescript: `export const CardRecentActivity = ({ items }) => (\n  <ActivityRows items={items.slice(0, 3)} />\n);`, reactnative: `<CardRecentActivity items={items} />`, kotlin: `CardRecentActivity(items = store.cardActivity)` } },
  { id: 'accountsSpendHero', title: 'Accounts Spending Hero', subtitle: 'Total spent with weekly pace chart', category: 'ledger', badge: 'Hero', badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100', code: { swiftui: `AccountsSpendHero(\n  month: .sep2024,\n  totalSpent: 3842.50,\n  pace: .weekly\n)`, typescript: `export const AccountsSpendHero = () => (\n  <BlueGradient><MonthPicker /><TotalSpent /><WeeklyPace /></BlueGradient>\n);`, reactnative: `<AccountsSpendHero totalSpent={3842.50} />`, kotlin: `AccountsSpendHero(totalSpent = 3842.50, pace = Pace.WEEKLY)` } },
  { id: 'smartCashflowInsight', title: 'Smart Cash Flow Insight', subtitle: 'AI savings recommendation card', category: 'ledger', badge: 'AI', badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100', code: { swiftui: `SmartCashflowInsight(savings: 180, cta: .viewRecurringAudits)`, typescript: `export const SmartCashflowInsight = () => (\n  <InsightCard cta="View recurring audits" />\n);`, reactnative: `<SmartCashflowInsight />`, kotlin: `SmartCashflowInsight(savings = 180, cta = CTA.VIEW_RECURRING_AUDITS)` } },
  { id: 'spendingBreakdownList', title: 'Spending Breakdown', subtitle: 'Categories / Merchants / Cash Flow tabs', category: 'ledger', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: { swiftui: `SpendingBreakdownList(\n  categories: store.categories,\n  tab: $tab\n)`, typescript: `export const SpendingBreakdownList = () => (\n  <Chips items={['Categories','Merchants','Cash Flow']} /><CategoryRows />\n);`, reactnative: `<SpendingBreakdownList />`, kotlin: `SpendingBreakdownList(categories = store.categories, tab = state.tab)` } },
  { id: 'septemberBudgetCard', title: 'September Budget', subtitle: 'Remaining budget with adjust CTA', category: 'ledger', badge: 'Data', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100', code: { swiftui: `SeptemberBudgetCard(remaining: 1157.50, total: 5000)`, typescript: `export const SeptemberBudgetCard = () => (\n  <BudgetCard remaining={1157.50} total={5000} />\n);`, reactnative: `<SeptemberBudgetCard />`, kotlin: `SeptemberBudgetCard(remaining = 1157.50, total = 5000.0)` } },
  { id: 'transferDetailsHero', title: 'Transfer Details Hero', subtitle: 'Review & Authorize blue header', category: 'actions', badge: 'Hero', badgeColor: 'bg-violet-50 text-violet-600 border border-violet-100', code: { swiftui: `TransferDetailsHero(amount: 250, mode: .review)`, typescript: `export const TransferDetailsHero = () => (\n  <BlueGradient><ReviewPill /><TransferDetailsTitle /></BlueGradient>\n);`, reactnative: `<TransferDetailsHero />`, kotlin: `TransferDetailsHero(amount = 250.0, mode = Mode.REVIEW)` } },
  { id: 'transferRecipientCard', title: 'Transfer Recipient Card', subtitle: 'Trusted recipient with sending total', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `TransferRecipientCard(\n  name: "Sarah Jenkins",\n  trusted: true,\n  amount: 250\n)`, typescript: `export const TransferRecipientCard = () => (\n  <RecipientCard /><SendingTotal />\n);`, reactnative: `<TransferRecipientCard />`, kotlin: `TransferRecipientCard(name = "Sarah Jenkins", amount = 250.0)` } },
  { id: 'transferDetailsSummary', title: 'Transfer Details Summary', subtitle: 'From / method / arrival / fee / note', category: 'actions', badge: 'Flow', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `TransferDetailsSummary(\n  from: .smartWallet,\n  method: .instant,\n  fee: 0\n)`, typescript: `export const TransferDetailsSummary = () => (\n  <DetailRow id="from" /><DetailRow id="method" /><DetailRow id="fee" />\n);`, reactnative: `<TransferDetailsSummary />`, kotlin: `TransferDetailsSummary(from = WALLET, method = INSTANT, fee = 0.0)` } },
  { id: 'transferSecurityFooter', title: 'Transfer Security Footer', subtitle: 'Protected transfer, recurring tip and confirm CTA', category: 'security', badge: 'Shield', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100', code: { swiftui: `TransferSecurityFooter(amount: 250, onConfirm: confirm)`, typescript: `export const TransferSecurityFooter = ({ onConfirm }) => (\n  <ProtectedTransfer /><RecurringTip /><ConfirmCTA onClick={onConfirm} />\n);`, reactnative: `<TransferSecurityFooter onConfirm={confirm} />`, kotlin: `TransferSecurityFooter(amount = 250.0, onConfirm = ::confirm)` } },
  { id: 'profileIdentityHero', title: 'Profile Identity Hero', subtitle: 'Blue hero with avatar, tier and vault stats', category: 'security', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `ProfileIdentityHero(user: auth.current, tier: .platinum3)`, typescript: `export const ProfileIdentityHero = ({ user }) => (\n  <BlueGradient><Avatar /><Name /><Badge /><Stats /></BlueGradient>\n);`, reactnative: `<ProfileIdentityHero user={user} />`, kotlin: `ProfileIdentityHero(user = auth.current, tier = Tier.PLATINUM_3)` } },
  { id: 'vaultConciergeCard', title: 'Vault Concierge', subtitle: 'Priority support line and instant bill review', category: 'security', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `VaultConciergeCard(available: true)`, typescript: `export const VaultConciergeCard = () => (\n  <Card><Shield /><Title>Vault Concierge Active</Title></Card>\n);`, reactnative: `<VaultConciergeCard />`, kotlin: `VaultConciergeCard(available = true)` } },
  { id: 'profileSettingsGroups', title: 'Profile Settings Groups', subtitle: 'Account, security and app preference groups', category: 'security', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `ProfileSettingsGroups(groups: [.account, .security, .language])`, typescript: `export const ProfileSettingsGroups = () => (\n  <Section id="account" /><Section id="security" /><Section id="language" />\n);`, reactnative: `<ProfileSettingsGroups />`, kotlin: `ProfileSettingsGroups(groups = listOf(ACCOUNT, SECURITY, LANGUAGE))` } },
  { id: 'profileHelpFooter', title: 'Profile Help & Footer', subtitle: 'Help centre, log out, system status', category: 'security', badge: 'KYC', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `ProfileHelpFooter(onLogout: auth::signOut)`, typescript: `export const ProfileHelpFooter = ({ onLogout }) => (\n  <HelpRow /><LogoutRow onPress={onLogout} /><SystemStatus />\n);`, reactnative: `<ProfileHelpFooter onLogout={onLogout} />`, kotlin: `ProfileHelpFooter(onLogout = auth::signOut)` } },
  { id: 'notificationsHero', title: 'Notifications Hero', subtitle: 'Blue header with unread alert banner', category: 'security', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `NotificationsHero(unread: 3, live: true)`, typescript: `export const NotificationsHero = ({ unread }) => (\n  <BlueGradient><Title /><UnreadBanner count={unread} /></BlueGradient>\n);`, reactnative: `<NotificationsHero unread={3} />`, kotlin: `NotificationsHero(unread = 3, live = true)` } },
  { id: 'notificationsFilterChips', title: 'Notification Filter Chips', subtitle: 'All / Transactions / Security / Promos', category: 'security', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `NotificationsFilterChips(selected: $tab)`, typescript: `export const NotificationsFilterChips = () => (\n  <Chips items={['All','Transactions','Security','Promos']} />\n);`, reactnative: `<NotificationsFilterChips />`, kotlin: `NotificationsFilterChips(selected = state.tab)` } },
  { id: 'notificationsFeed', title: 'Notifications Feed', subtitle: 'Grouped alert feed with actions', category: 'security', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `NotificationsFeed(items: store.alerts)`, typescript: `export const NotificationsFeed = ({ items }) => (\n  <GroupedFeed items={items} />\n);`, reactnative: `<NotificationsFeed items={items} />`, kotlin: `NotificationsFeed(items = store.alerts)` } },
  { id: 'notificationsQuietHours', title: 'Quiet Hours & Preferences', subtitle: 'Mute weekdays 10 PM – 7 AM', category: 'security', badge: 'Push', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100', code: { swiftui: `NotificationsQuietHours(start: 22, end: 7)`, typescript: `export const NotificationsQuietHours = () => (\n  <Row title="Preferences & Quiet Hours" />\n);`, reactnative: `<NotificationsQuietHours />`, kotlin: `NotificationsQuietHours(startHour = 22, endHour = 7)` } },
];

export const BANKING_WALLET_PAGE_PREPEND: Record<string, string[]> = {
  home: ['homeBlueHero', 'billNegotiatorCard', 'billsPaymentsList', 'homeHeroBalance', 'quickSendRow'],
  accounts: ['accountsSpendHero', 'smartCashflowInsight', 'spendingBreakdownList', 'septemberBudgetCard'],
  history: ['spendingChart', 'detailedHistory'],
  transfers: ['transferDetailsHero', 'transferRecipientCard', 'transferDetailsSummary', 'transferSecurityFooter'],
  cards: ['myCardsHero', 'cardSpendingLimit', 'cardSecurityPermissions', 'cardCashPerks', 'cardRecentActivity', 'creditCardCarousel', 'cardSecurityLock'],
  notifications: ['notificationsHero', 'notificationsFilterChips', 'notificationsFeed', 'notificationsQuietHours', 'notificationCenter'],
  profile: ['profileIdentityHero', 'vaultConciergeCard', 'profileSettingsGroups', 'profileHelpFooter', 'profileMenu'],
  send: ['transferMoneyHeader', 'transferAmountMethods', 'transferReviewFooter', 'sendMoneySheet'],
};

export const BANKING_WALLET_MODULE_IDS: Set<string> = new Set(BANKING_WALLET_MODULES.map((m) => m.id));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const BLUE_GRADIENT = 'linear-gradient(170deg, #4A7CFF 0%, #2563EB 45%, #1D4ED8 100%)';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const surface = (dark: boolean) =>
  dark
    ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5'
    : 'bg-white text-slate-900 shadow-[0_6px_24px_rgba(37,52,120,0.08)]';

function Switch({ checked, onChange, label, accent, interactive = true }: { checked: boolean; onChange: () => void; label: string; accent: string; interactive?: boolean }) {
  const track = (
    <span className={`relative inline-block h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${checked ? '' : 'bg-slate-300'}`} style={checked ? { background: accent } : undefined}>
      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </span>
  );
  if (!interactive) return track;
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">{track}</button>
  );
}

function BlueHeroShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden px-4 pb-3 pt-2 text-white ${className}`} style={{ background: BLUE_GRADIENT }}>
      <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <span aria-hidden className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/5" />
      <div className="relative">{children}</div>
    </div>
  );
}

function HeroTopBar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 text-[10px] font-bold">EC</span>
        <div className="leading-tight">
          <p className="text-[8px] uppercase tracking-wide text-white/70">Good Morning 🌤</p>
          <p className="text-[12px] font-bold">Ethan Carter</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15"><Search className="h-3.5 w-3.5" /></button>
        <button type="button" className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/15"><User className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch 1 components                                                 */
/* ------------------------------------------------------------------ */

function HomeHeroBalance({ ctx }: { ctx: BankingWalletCtx }) {
  const pill = useModuleColor('pill', '#C7F03F');
  return (
    <div className={`relative overflow-hidden p-4 text-white ${ctx.radius.card}`} style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}>
      <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-1.5 text-[10px] text-white/80">
        <EditableText slot="label" fallback="Total Balance" />
        <Info className="h-2.5 w-2.5" />
      </div>
      <EditableText slot="balance" fallback={usd(ctx.balance)} className="relative mt-1 block text-[24px] font-bold leading-none tracking-tight" />
      <div className="relative mt-4 flex items-center gap-2">
        <button type="button" data-studio-element="transfer" onClick={ctx.actions.send} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold text-[#0B1A56]" style={{ background: pill }}>
          <ArrowUpRight className="h-3 w-3" />
          <EditableText slot="transfer" fallback="Transfer" />
        </button>
        <button type="button" data-studio-element="receive" onClick={ctx.actions.payBill} className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#0B1A56]">
          <ArrowDownLeft className="h-3 w-3" />
          <EditableText slot="receive" fallback="Receive" />
        </button>
        <button type="button" data-studio-element="cards" aria-label="Cards" onClick={ctx.actions.openWallet} className="ml-auto grid h-8 w-8 place-items-center rounded-full" style={{ background: pill }}>
          <CreditCard className="h-4 w-4 text-[#0B1A56]" />
        </button>
      </div>
    </div>
  );
}

function QuickSendRow({ ctx }: { ctx: BankingWalletCtx }) {
  const people = [
    { slot: 'p1', name: 'Daniel', from: '#FBBF24', to: '#F59E0B' },
    { slot: 'p2', name: 'Ethan', from: '#60A5FA', to: '#3B82F6' },
    { slot: 'p3', name: 'Gabriel', from: '#34D399', to: '#10B981' },
    { slot: 'p4', name: 'Henry', from: '#818CF8', to: '#6366F1' },
    { slot: 'p5', name: 'James', from: '#FB7185', to: '#F43F5E' },
  ];
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <EditableText slot="title" fallback="Quick Send" className="text-[13px] font-bold" />
        <button type="button" onClick={ctx.actions.send} className="text-[10px] font-semibold" style={{ color: ctx.accent }}>
          <EditableText slot="action" fallback="See All" />
        </button>
      </div>
      <div className="flex items-start gap-3 overflow-x-auto pb-1 scrollbar-none">
        {people.map((p) => (
          <button key={p.slot} type="button" onClick={ctx.actions.send} className="flex shrink-0 flex-col items-center gap-1">
            <span className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
            <EditableText slot={p.slot} fallback={p.name} className="text-[9px] text-slate-500" />
          </button>
        ))}
        <button type="button" onClick={ctx.actions.send} className="flex shrink-0 flex-col items-center gap-1">
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-slate-300">
            <Plus className="h-3.5 w-3.5 text-slate-400" />
          </span>
          <EditableText slot="add" fallback="Add" className="text-[9px] text-slate-500" />
        </button>
      </div>
    </section>
  );
}

function SpendingChart({ ctx }: { ctx: BankingWalletCtx }) {
  const [range, setRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const activeBar = useModuleColor('activeBar', '#6D4AFF');
  const bars = [55, 40, 78, 30, 62];
  const labels = [
    { slot: 'day1', label: 'Mon' }, { slot: 'day2', label: 'Tue' }, { slot: 'day3', label: 'Wed' },
    { slot: 'day4', label: 'Thu' }, { slot: 'day5', label: 'Fri' },
  ];
  return (
    <div className={`p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="mb-3 flex items-center gap-1 rounded-full bg-slate-100 p-0.5 dark:bg-slate-800">
        {(['Daily', 'Weekly', 'Monthly'] as const).map((r, i) => (
          <button key={r} type="button" onClick={() => setRange(r)} className={`flex-1 cursor-pointer rounded-full py-1.5 text-[10px] font-semibold transition ${range === r ? 'text-white' : 'text-slate-500'}`} style={range === r ? { background: activeBar } : undefined}>
            <EditableText slot={`tab${i + 1}`} fallback={r} />
          </button>
        ))}
      </div>
      <div className="relative flex h-32 items-end justify-between gap-3 pt-6" aria-hidden>
        {bars.map((h, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center">
            {i === 2 && (
              <span className="absolute -top-6 whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-bold text-white shadow" style={{ background: activeBar }}>
                <EditableText slot="highlight" fallback="$3.24.00" />
              </span>
            )}
            <span className="w-full rounded-full" style={{ height: `${h}%`, background: i === 2 ? activeBar : '#E5E7EB' }} />
            <span className={`mt-2 text-[9px] font-semibold ${i === 2 ? '' : 'text-slate-400'}`} style={i === 2 ? { color: activeBar } : undefined}>
              <EditableText slot={labels[i].slot} fallback={labels[i].label} />
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
          <EditableText slot="subLabel" fallback="Your card information" className="block text-[9px] text-slate-400" />
          <EditableText slot="title" fallback="All Credit Cards (2)" className="text-[13px] font-bold" />
        </div>
        <button type="button" onClick={ctx.actions.openWallet} className="text-[10px] font-semibold" style={{ color: ctx.accent }}>
          <EditableText slot="manage" fallback="Manage" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"><Plus className="h-3.5 w-3.5" /></span>
          <EditableText slot="addLabel" fallback="Add" className="text-[9px] text-slate-500" />
        </div>
        <div className="relative h-[120px] w-[200px] shrink-0 overflow-hidden rounded-2xl p-3 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #5B3FF0 100%)' }}>
          <span aria-hidden className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="flex items-center justify-between">
            <EditableText slot="currentBalance" fallback="Current Balance" className="text-[9px] text-white/70" />
            <Wifi className="h-3.5 w-3.5 rotate-90 text-white/80" />
          </div>
          <EditableText slot="balance" fallback={usd(ctx.balance)} className="mt-0.5 block text-[18px] font-bold" />
          <div className="mt-6 flex items-end justify-between">
            <div>
              <EditableText slot="cardHolder" fallback="Sajibur Rahman 08/24" className="block text-[8px] uppercase tracking-wide text-white/70" />
              <EditableText slot="cardNum" fallback="•••• •••• •••• 1234" className="block font-mono text-[9px] tracking-widest text-white/90" />
            </div>
            <span className="flex">
              <span className="h-4 w-4 rounded-full bg-rose-500" />
              <span className="-ml-2 h-4 w-4 rounded-full bg-amber-400" />
            </span>
          </div>
        </div>
        <div className="relative h-[120px] w-[160px] shrink-0 overflow-hidden rounded-2xl p-3 text-[#0B1A56] shadow-md" style={{ background: 'linear-gradient(135deg, #E8FFB0 0%, #C7F03F 100%)' }}>
          <EditableText slot="kineticLabel" fallback="Kinetic" className="text-[8px] font-bold uppercase tracking-wide opacity-70" />
          <EditableText slot="kineticBal" fallback="$0.00" className="mt-1 block text-[14px] font-bold" />
          <EditableText slot="kineticNum" fallback="•••• 8821" className="mt-8 block font-mono text-[9px] tracking-widest opacity-70" />
        </div>
      </div>
    </section>
  );
}

function CardSecurityLock({ ctx }: { ctx: BankingWalletCtx }) {
  const iconBg = useModuleColor('iconBg', '#C7F03F');
  return (
    <div className={`flex items-center justify-between p-3.5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center text-[#0B1A56] ${ctx.radius.icon}`} style={{ background: iconBg }}><Lock className="h-4 w-4" /></span>
        <div>
          <EditableText slot="title" fallback="Card Security Lock" className="block text-[12px] font-semibold" />
          <EditableText slot="sub" fallback="Temporarily freeze instant tap" className="block text-[9px] text-slate-400" />
        </div>
      </div>
      <Switch checked={ctx.isCardFrozen} onChange={ctx.actions.toggleFreeze} label="Card Security Lock" accent={ctx.accent} interactive={ctx.interactive} />
    </div>
  );
}

function DetailedHistory({ ctx }: { ctx: BankingWalletCtx }) {
  const [filter, setFilter] = useState('All');
  const filters = [
    { slot: 'filter1', label: 'All' },
    { slot: 'filter2', label: 'Income' },
    { slot: 'filter3', label: 'Expenses' },
    { slot: 'filter4', label: 'Transfers' },
  ];
  const groups = [
    {
      slot: 'group1', dateSlot: 'group1Date', label: 'TODAY', date: 'Nov 24',
      items: [
        { name: 'Uber', sub: 'Transport • 8:00 AM', method: 'Debit Card', amount: -55, Icon: Truck, tone: 'slate' as const },
        { name: 'Starbucks', sub: 'Food & Drinks • 10:15 AM', method: 'Apple Pay', amount: -8.5, Icon: Coffee, tone: 'blue' as const },
        { name: 'Salary Deposit', sub: 'TechCorp Inc.', method: 'Direct Deposit', amount: 4200, Icon: ArrowUp, tone: 'green' as const },
      ],
    },
    {
      slot: 'group2', dateSlot: 'group2Date', label: 'YESTERDAY', date: 'Nov 23',
      items: [
        { name: 'Amazon', sub: 'Shopping • 12:00 AM', method: 'Virtual Card', amount: -160, Icon: ShoppingBag, tone: 'slate' as const },
        { name: 'Netflix Subscription', sub: 'Entertainment • Monthly', method: 'Recurring', amount: -19.99, Icon: Play, tone: 'rose' as const },
        { name: 'Transfer from Ethan', sub: 'Dinner Split • 9:45 PM', method: 'Instant', amount: 120, Icon: ArrowDownLeft, tone: 'green' as const },
      ],
    },
  ];
  const toneCls = (tone: string) =>
    tone === 'green' ? 'bg-emerald-50 text-emerald-600'
      : tone === 'blue' ? 'bg-blue-50 text-blue-600'
      : tone === 'rose' ? 'bg-rose-50 text-rose-500'
      : 'bg-slate-100 text-slate-600';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`flex flex-1 items-center gap-2 px-3 py-2.5 ${ctx.radius.icon} ${surface(ctx.isDark)}`}>
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <EditableText slot="searchPh" fallback="Search merchant or category…" className="text-[10px] text-slate-400" />
        </div>
        <span className={`grid h-9 w-9 place-items-center ${ctx.radius.icon} ${surface(ctx.isDark)}`}><SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" /></span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button key={f.slot} type="button" onClick={() => setFilter(f.label)} className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${filter === f.label ? 'bg-[#6D4AFF] text-white' : ctx.isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
            <EditableText slot={f.slot} fallback={f.label} />
          </button>
        ))}
      </div>
      <div className={`relative overflow-hidden p-4 text-white ${ctx.radius.card}`} style={{ background: 'linear-gradient(135deg, #1F2937 0%, #0F172A 100%)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 text-[9px] text-white/70">
            <EditableText slot="budgetLabel" fallback="Total Spent • Nov" />
            <Info className="h-2.5 w-2.5" />
          </div>
          <span className="rounded-full bg-[#C7F03F] px-2 py-0.5 text-[8px] font-bold text-[#0B1A56]">
            <EditableText slot="budgetDelta" fallback="↑ +14.2%" />
          </span>
        </div>
        <EditableText slot="budgetTotal" fallback="$2,840.50" className="mt-1 block text-[22px] font-bold" />
        <div className="mt-3 flex items-center justify-between text-[9px] text-white/70">
          <span>Budget Left</span>
          <span className="text-[#C7F03F]"><EditableText slot="budgetLeft" fallback="$1,659.50" /></span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[#C7F03F]" style={{ width: '63%' }} />
        </div>
      </div>
      {groups.map((g) => (
        <section key={g.slot}>
          <div className="mb-1.5 flex items-center justify-between">
            <EditableText slot={g.slot} fallback={g.label} className="text-[9px] font-bold uppercase tracking-wider text-slate-500" />
            <EditableText slot={g.dateSlot} fallback={g.date} className="text-[9px] text-slate-400" />
          </div>
          <div className={`divide-y divide-slate-100 overflow-hidden dark:divide-slate-800 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            {g.items.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.name} className="flex items-center justify-between gap-2 p-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`grid h-8 w-8 place-items-center ${ctx.radius.icon} ${toneCls(item.tone)}`}><Icon className="h-3.5 w-3.5" /></span>
                    <div>
                      <p className="text-[11px] font-semibold">{item.name}</p>
                      <p className="text-[8px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] font-bold ${item.amount > 0 ? 'text-emerald-600' : ''}`}>{item.amount > 0 ? '+' : ''}{usd(item.amount)}</p>
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
  const items = [
    { i: 1, title: 'New sign-in detected', sub: 'Apple iPhone 15 Pro, San Francisco CA', Icon: ShieldCheck, time: '10m' },
    { i: 2, title: 'Instant transfer received', sub: 'Daniel Vance • +$850.00', Icon: ArrowDownLeft, time: '1h' },
    { i: 3, title: 'Statements ready', sub: 'November 2024 PDF export', Icon: FileText, time: '2h' },
  ];
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const Icon = item.Icon;
        return (
          <div key={item.i} className={`flex items-start gap-2.5 p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center bg-slate-100 text-slate-600 ${ctx.radius.icon}`}><Icon className="h-3.5 w-3.5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <EditableText slot={`a${item.i}Title`} fallback={item.title} className="text-[11px] font-semibold" />
                <EditableText slot={`a${item.i}Time`} fallback={item.time} className="text-[8px] text-slate-400" />
              </div>
              <EditableText slot={`a${item.i}Sub`} fallback={item.sub} className="mt-0.5 block text-[9px] text-slate-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileMenu({ ctx }: { ctx: BankingWalletCtx }) {
  const rows = [
    { slot: 'm1', label: 'Personal Information' },
    { slot: 'm2', label: 'Linked Accounts & Cards' },
    { slot: 'm3', label: 'Security & Face ID' },
    { slot: 'm4', label: 'Statements & Tax Reports' },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.slot} className={`flex items-center justify-between p-3 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
          <EditableText slot={r.slot} fallback={r.label} className="text-[11px] font-semibold" />
          <ChevronRight className="h-3 w-3 text-slate-400" />
        </div>
      ))}
    </div>
  );
}

function SendMoneySheet({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className={`space-y-3 p-4 text-center ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 dark:bg-slate-800">
        <EditableText slot="badge" fallback="↔ TRANSFER AMOUNT" />
      </span>
      <EditableText slot="amount" fallback="$850.00" className="block text-[26px] font-bold tracking-tight" />
      <p className="text-[9px] text-slate-400">
        Sending to <span className="font-bold text-slate-700 dark:text-slate-200"><EditableText slot="recipient" fallback="Daniel Vance" /></span>
      </p>
      <button type="button" onClick={ctx.actions.send} className="flex w-full items-center justify-between rounded-full bg-[#6D4AFF] py-2 pl-1 pr-3 text-white">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#C7F03F] text-[#0B1A56]"><ArrowRight className="h-4 w-4" /></span>
        <span className="text-[11px] font-bold"><EditableText slot="cta" fallback="Slide To Transfer" /></span>
        <Lock className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch 2 components                                                 */
/* ------------------------------------------------------------------ */

function TransferMoneyHeader({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div>
      <BlueHeroShell className="rounded-b-3xl pb-8">
        <HeroTopBar />
        <div className="mt-3 flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          <EditableText slot="title" fallback="Transfer Money" className="flex-1 text-[14px] font-bold" />
          <RefreshCw className="h-3.5 w-3.5" />
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[9px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <EditableText slot="available" fallback="Available Balance:" /> {usd(ctx.balance)}
        </div>
      </BlueHeroShell>
      <div className="-mt-6 bg-[#F7F8FF] px-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <EditableText slot="sendAgain" fallback="Send Again" className="text-[11px] font-bold" />
            <EditableText slot="favorites" fallback="Favorites" className="text-[8px] uppercase tracking-wider text-slate-400" />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
            <Search className="h-3 w-3 text-slate-400" />
            <EditableText slot="recent" fallback="Sarah Jenkins" className="flex-1 text-[10px] text-slate-500" />
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
  const chips = [
    { slot: 'chip1', value: 50 },
    { slot: 'chip2', value: 100 },
    { slot: 'chip3', value: 250 },
    { slot: 'chip4', value: 500 },
  ];
  const methods = [
    { id: 'instant', titleSlot: 'm1Title', subSlot: 'm1Sub', title: 'Instant to Bank', sub: 'Direct wire link • Free', badge: 'Fastest', Icon: Landmark },
    { id: 'debit', titleSlot: 'm2Title', subSlot: 'm2Sub', title: 'Debit Card Transfer', sub: 'Instant receipt • Visa ending 4821', Icon: CreditCard },
    { id: 'wire', titleSlot: 'm3Title', subSlot: 'm3Sub', title: 'Wire Transfer', sub: 'Standard domestic (1-2 days)', Icon: RefreshCw },
  ];
  return (
    <div className="space-y-3 bg-[#F7F8FF] px-3">
      <div className="rounded-2xl bg-[#EEF3FF] p-4 text-center">
        <EditableText slot="amountLabel" fallback="Set Transfer Amount" className="text-[9px] font-bold uppercase tracking-wider text-slate-500" />
        <p className="mt-1 text-[26px] font-bold text-slate-900">${amount}<span className="ml-1 text-[10px] font-medium text-slate-400">USD</span></p>
        <EditableText slot="feeNote" fallback="No transaction fee applies with instant priority" className="mt-1 block text-[9px] text-slate-500" />
        <div className="mt-3 flex justify-center gap-1.5">
          {chips.map((c) => (
            <button key={c.slot} type="button" onClick={() => setAmount(c.value)} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${amount === c.value ? 'bg-[#0B1A56] text-white' : 'bg-white text-slate-600'}`}>
              <EditableText slot={c.slot} fallback={`$${c.value}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <EditableText slot="methodTitle" fallback="Transfer Method" className="text-[11px] font-bold" />
        <EditableText slot="methodFee" fallback="⚡ Zero Fees" className="text-[9px] font-semibold text-emerald-600" />
      </div>
      <div className="space-y-1.5">
        {methods.map((m) => {
          const Icon = m.Icon;
          const active = method === m.id;
          return (
            <button key={m.id} type="button" onClick={() => setMethod(m.id)} className={`flex w-full items-center gap-2.5 rounded-xl bg-white p-2.5 text-left shadow-sm ${active ? 'ring-2 ring-blue-500' : ''}`}>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-4 w-4" /></span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <EditableText slot={m.titleSlot} fallback={m.title} className="text-[11px] font-semibold" />
                  {m.badge && <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">{m.badge}</span>}
                </div>
                <EditableText slot={m.subSlot} fallback={m.sub} className="block text-[9px] text-slate-500" />
              </div>
              <span className={`grid h-4 w-4 place-items-center rounded-full border-2 ${active ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
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
      <button type="button" onClick={ctx.actions.send} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] py-3 text-[12px] font-bold text-white shadow-lg shadow-blue-600/30">
        <EditableText slot="cta" fallback="Continue to Review" /> <ArrowRight className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-2 rounded-xl bg-[#EEF3FF] p-3">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        <div>
          <EditableText slot="encryption" fallback="Bank-grade 256-bit Encryption" className="block text-[10px] font-bold text-slate-800" />
          <EditableText slot="encryptionSub" fallback="Guaranteed instant settlement protected by Federal insurance." className="mt-0.5 block text-[9px] text-slate-500" />
        </div>
      </div>
    </div>
  );
}

function HomeBlueHero({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <BlueHeroShell className="rounded-b-3xl pb-6">
      <HeroTopBar />
      <div className="mt-4 flex items-center gap-1.5 text-[9px] text-white/80">
        <EditableText slot="label" fallback="Total Balance" />
        <Eye className="h-3 w-3" />
      </div>
      <EditableText slot="balance" fallback={usd(ctx.balance)} className="mt-0.5 block text-[26px] font-bold leading-none tracking-tight" />
      <p className="mt-1 text-[10px] font-semibold text-emerald-300">
        <EditableText slot="delta" fallback="+8.42% Today" />{' '}
        <span className="text-white/70">(<EditableText slot="deltaNote" fallback="+$9,684.20" />)</span>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={ctx.actions.topUp} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B1A56]">
          <Plus className="h-3 w-3" />
          <EditableText slot="deposit" fallback="Deposit" />
        </button>
        <button type="button" onClick={ctx.actions.send} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B1A56]">
          <ArrowRight className="h-3 w-3" />
          <EditableText slot="transfer" fallback="Transfer" />
        </button>
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-[#0B1A56]"><QrCode className="h-4 w-4" /></button>
      </div>
    </BlueHeroShell>
  );
}

function BillNegotiatorCard({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 -mt-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
        <EditableText slot="title" fallback="Bill negotiator" className="text-[11px] font-bold" />
      </div>
      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-center">
        <p className="text-[10px] leading-snug text-slate-600">
          We found a way to cut your <EditableText slot="provider" fallback="AT&T Fiber" /> bill by{' '}
          <span className="font-bold text-slate-900"><EditableText slot="savings" fallback="$12/month" /></span>{' '}
          <EditableText slot="description" fallback="without changing your speed." />
        </p>
        <button type="button" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-900">
          <EditableText slot="cta" fallback="Start negotiation" /> <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function BillsPaymentsList({ ctx }: { ctx: BankingWalletCtx }) {
  const [tab, setTab] = useState('All Bills');
  const bills = [
    { i: 1, name: 'Internet — FiberLink', sub: 'Due Sep 18 • 2 days left', amount: '$10.99', Icon: Wifi },
    { i: 2, name: 'Electricity — PowerGrid', sub: 'Due Sep 18 • 2 days left', amount: '$120.75', Icon: Zap },
    { i: 3, name: 'Water — AquaPure', sub: 'Due Sep 22 • 6 days left', amount: '$45.00', Icon: Droplet },
  ];
  return (
    <div className="space-y-3 px-3 pb-2">
      <div className="flex items-center justify-between">
        <EditableText slot="title" fallback="Bills & Payments" className="text-[13px] font-bold" />
      </div>
      <div className="flex gap-1.5">
        {[{ slot: 'tab1', label: 'All Bills' }, { slot: 'tab2', label: 'Need Actions' }].map((t) => (
          <button key={t.slot} type="button" onClick={() => setTab(t.label)} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${tab === t.label ? 'bg-[#0B1A56] text-white' : 'bg-white text-slate-500'}`}>
            <EditableText slot={t.slot} fallback={t.label} />
          </button>
        ))}
      </div>
      <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
        {bills.map((b) => {
          const Icon = b.Icon;
          return (
            <div key={b.i} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-4 w-4" /></span>
                <div>
                  <EditableText slot={`b${b.i}Name`} fallback={b.name} className="block text-[11px] font-semibold" />
                  <EditableText slot={`b${b.i}Sub`} fallback={b.sub} className="block text-[8px] text-slate-400" />
                </div>
              </div>
              <EditableText slot={`b${b.i}Amount`} fallback={b.amount} className="text-[11px] font-bold" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyCardsHero({ ctx }: { ctx: BankingWalletCtx }) {
  const actions = [
    { slot: 'action1', label: 'Freeze', Icon: Snowflake },
    { slot: 'action2', label: 'Limits', Icon: SlidersHorizontal },
    { slot: 'action3', label: 'PIN', Icon: Lock },
    { slot: 'action4', label: 'Replace', Icon: CreditCard },
  ];
  return (
    <div>
      <BlueHeroShell className="rounded-b-3xl">
        <HeroTopBar />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EditableText slot="title" fallback="My Cards" className="text-[14px] font-bold" />
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px]"><EditableText slot="activeBadge" fallback="2 Active" /></span>
          </div>
          <button type="button" className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-semibold"><EditableText slot="newCard" fallback="+ New Card" /></button>
        </div>
        <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] p-3 shadow-lg">
          <span aria-hidden className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between">
            <span className="grid h-7 w-9 place-items-center rounded bg-gradient-to-br from-amber-300 to-amber-500">
              <span className="h-3 w-5 rounded border border-amber-600/30" />
            </span>
          </div>
          <EditableText slot="cardNumber" fallback="•••• •••• •••• 4829" className="relative mt-6 block font-mono text-[14px] tracking-[0.3em]" />
          <div className="relative mt-3 flex items-end justify-between">
            <div>
              <p className="text-[7px] uppercase tracking-wider text-white/60">Card Holder</p>
              <EditableText slot="cardHolder" fallback="ETHAN CARTER" className="block text-[10px] font-bold" />
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-wider text-white/60">Expires</p>
              <EditableText slot="expires" fallback="08/28" className="block text-[10px] font-bold" />
            </div>
            <div className="text-right">
              <EditableText slot="cardBrand" fallback="VISA" className="block text-[14px] font-bold italic" />
              <EditableText slot="cardTier" fallback="Platinum" className="block text-[7px] uppercase tracking-wider text-white/60" />
            </div>
          </div>
        </div>
      </BlueHeroShell>
      <div className="bg-[#F7F8FF] px-3 pt-2 pb-1">
        <div className="grid grid-cols-4 gap-1">
          {actions.map(({ slot, label, Icon }) => (
            <button key={slot} type="button" onClick={label === 'Freeze' ? ctx.actions.toggleFreeze : ctx.actions.openWallet} className="flex flex-col items-center gap-1 rounded-xl bg-white py-2.5 shadow-sm">
              <Icon className="h-4 w-4 text-blue-600" />
              <EditableText slot={slot} fallback={label} className="text-[9px] font-medium" />
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
          <EditableText slot="label" fallback="Monthly Spending Limit" className="text-[10px] font-semibold" />
        </div>
        <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600"><EditableText slot="percentBadge" fallback="30.6% Used" /></span>
      </div>
      <p className="mt-2 text-[16px] font-bold">
        <EditableText slot="spentValue" fallback="$2,450.00" />{' '}
        <span className="text-[9px] font-medium text-slate-500"><EditableText slot="spentSuffix" fallback="spent" /></span>
      </p>
      <EditableText slot="limitValue" fallback="of $8,000.00" className="block text-[9px] text-slate-400" />
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: '30.6%' }} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="flex items-center gap-1 text-[9px] text-slate-500">
          <Check className="h-2.5 w-2.5 text-emerald-600" />
          <EditableText slot="safeNote" fallback="$5,550.00 safe to spend until Oct 1" />
        </p>
        <button type="button" className="text-[9px] font-bold text-blue-600"><EditableText slot="adjust" fallback="Adjust" /></button>
      </div>
    </div>
  );
}

function CardSecurityPermissions({ ctx }: { ctx: BankingWalletCtx }) {
  const [online, setOnline] = useState(true);
  const [intl, setIntl] = useState(true);
  const [atm, setAtm] = useState(true);
  const items = [
    { key: 'r1', titleSlot: 'r1Title', subSlot: 'r1Sub', title: 'Online Payments', sub: 'E-commerce and app subscriptions', Icon: ShoppingBag, value: online, set: setOnline },
    { key: 'r2', titleSlot: 'r2Title', subSlot: 'r2Sub', title: 'International Transactions', sub: 'Foreign currency and overseas usage', Icon: Globe, value: intl, set: setIntl },
    { key: 'r3', titleSlot: 'r3Title', subSlot: 'r3Sub', title: 'ATM Withdrawals', sub: 'Physical cash dispensing', Icon: CreditCard, value: atm, set: setAtm },
  ];
  return (
    <div className="mx-3 rounded-2xl bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <EditableText slot="title" fallback="Security & Permissions" className="text-[11px] font-bold" />
        <EditableText slot="sub" fallback="Real-time control" className="text-[8px] text-slate-400" />
      </div>
      <div className="space-y-2">
        {items.map(({ key, titleSlot, subSlot, title, sub, Icon, value, set }) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-3.5 w-3.5" /></span>
              <div>
                <EditableText slot={titleSlot} fallback={title} className="block text-[10px] font-semibold" />
                <EditableText slot={subSlot} fallback={sub} className="block text-[8px] text-slate-400" />
              </div>
            </div>
            <Switch checked={value} onChange={() => set(!value)} label={title} accent={ctx.accent} interactive={ctx.interactive} />
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
        <EditableText slot="title" fallback="Card Cash Perks Detected" className="text-[11px] font-bold" />
      </div>
      <div className="mt-2 rounded-xl bg-blue-50/60 p-3">
        <p className="text-[10px] leading-snug text-slate-600">
          You have <span className="font-bold text-slate-900"><EditableText slot="rate" fallback="3.0% cashback" /></span>{' '}
          <EditableText slot="description" fallback="active on dining & transport with Visa Platinum this billing cycle." />
        </p>
      </div>
      <button type="button" className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-slate-100 py-2 text-[10px] font-semibold text-slate-800">
        <EditableText slot="cta" fallback="Explore Cashback Perks" /> <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function CardRecentActivity({ ctx }: { ctx: BankingWalletCtx }) {
  const rows = [
    { i: 1, name: 'Apple Store Fifth Ave', sub: 'Today • Electronics', amount: '-$149.00', Icon: ShoppingBag },
    { i: 2, name: 'Starbucks Coffee', sub: 'Yesterday • Dining', amount: '-$6.45', Icon: Coffee },
    { i: 3, name: 'Uber Technologies', sub: 'Sep 18 • Travel', amount: '-$24.80', Icon: Truck },
  ];
  return (
    <div className="mx-3 mb-2 rounded-2xl bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <EditableText slot="title" fallback="Recent Card Activity" className="text-[11px] font-bold" />
        <button type="button" onClick={ctx.actions.openHistory} className="text-[9px] font-semibold text-blue-600">
          <EditableText slot="viewAll" fallback="View All" />
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((r) => {
          const Icon = r.Icon;
          return (
            <div key={r.i} className="flex items-center justify-between gap-2 py-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-3.5 w-3.5" /></span>
                <div>
                  <EditableText slot={`r${r.i}Name`} fallback={r.name} className="block text-[10px] font-semibold" />
                  <EditableText slot={`r${r.i}Sub`} fallback={r.sub} className="block text-[8px] text-slate-400" />
                </div>
              </div>
              <EditableText slot={`r${r.i}Amount`} fallback={r.amount} className="text-[10px] font-bold" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch 3 — Accounts page                                            */
/* ------------------------------------------------------------------ */

function AccountsSpendHero({ ctx }: { ctx: BankingWalletCtx }) {
  const bars = [30, 25, 45, 20, 35, 100, 55];
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <BlueHeroShell className="rounded-b-3xl">
      <HeroTopBar />
      <div className="mt-3 flex items-center gap-2">
        <button type="button" className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold">
          📅 <EditableText slot="month" fallback="September 2024" /> <ChevronDown className="h-3 w-3" />
        </button>
        <div className="ml-auto flex gap-1.5">
          <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/20"><Upload className="h-3 w-3" /></button>
          <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/20"><SlidersHorizontal className="h-3 w-3" /></button>
        </div>
      </div>
      <EditableText slot="label" fallback="Total Spent" className="mt-4 block text-[9px] uppercase tracking-wider text-white/70" />
      <div className="mt-1 flex items-center gap-2">
        <EditableText slot="total" fallback="$3,842.50" className="text-[26px] font-bold leading-none tracking-tight" />
        <Eye className="h-4 w-4 text-white/70" />
      </div>
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-400/25 px-2 py-0.5 text-[9px] font-semibold text-emerald-200">
        <TrendingDown className="h-2.5 w-2.5" /> <EditableText slot="delta" fallback="Down 4.2% vs last month ($4,011.00)" />
      </span>
      <div className="mt-4 flex items-center justify-between text-[9px]">
        <EditableText slot="paceLabel" fallback="WEEKLY PACE" className="text-white/70" />
        <span className="text-white/70">
          <EditableText slot="peakLabel" fallback="Peak: Saturday" />
        </span>
      </div>
      <div className="relative mt-2 flex h-24 items-end justify-between gap-2 pt-2" aria-hidden>
        {bars.map((h, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center">
            {i === 5 && (
              <span className="absolute -top-6 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-bold text-[#1D4ED8]">
                <EditableText slot="peakValue" fallback="$840" />
              </span>
            )}
            <span className="w-full rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? '#fff' : 'rgba(255,255,255,0.3)' }} />
            <span className="mt-2 text-[8px] text-white/70">{labels[i]}</span>
          </div>
        ))}
      </div>
      <EditableText slot="peakDetail" fallback="Saturday spent: $840.00 (Dinner & Weekend Getaway)" className="mt-2 block text-center text-[8px] text-white/70" />
    </BlueHeroShell>
  );
}

function SmartCashflowInsight({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 -mt-4 rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-violet-600" />
        <EditableText slot="title" fallback="Smart Cash Flow Insight" className="text-[11px] font-bold" />
      </div>
      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-center">
        <p className="text-[10px] leading-snug text-slate-600">
          You&apos;re spending <span className="font-bold text-slate-900"><EditableText slot="savings" fallback="$180 less" /></span>{' '}
          <EditableText slot="description" fallback="on recurring subscriptions compared to last quarter! Nice work keeping your monthly overhead lean." />
        </p>
        <button type="button" className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[9px] font-bold text-slate-800 ring-1 ring-slate-200">
          <EditableText slot="cta" fallback="View recurring audits" /> <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}

function SpendingBreakdownList({ ctx }: { ctx: BankingWalletCtx }) {
  const [tab, setTab] = useState('Categories');
  const chips = [
    { slot: 'chip1', label: 'Categories' },
    { slot: 'chip2', label: 'Merchants' },
    { slot: 'chip3', label: 'Cash Flow' },
    { slot: 'chip4', label: 'Insights' },
  ];
  const categories = [
    { i: 1, name: 'Food & Dining', sub: '32% of monthly spend', amount: '$1,240.80', delta: '+4.1% vs Aug', deltaTone: 'rose', Icon: Utensils, pct: 32 },
    { i: 2, name: 'Bills & Utilities', sub: '23% of monthly spend', amount: '$892.40', delta: 'Stable (0.0%)', deltaTone: 'slate', Icon: Zap, pct: 23 },
    { i: 3, name: 'Shopping & Tech', sub: '17% of monthly spend', amount: '$645.00', delta: '-12% vs Aug', deltaTone: 'emerald', Icon: ShoppingBag, pct: 17 },
    { i: 4, name: 'Travel & Transit', sub: '11% of monthly spend', amount: '$420.30', delta: '-3.4% vs Aug', deltaTone: 'emerald', Icon: Car, pct: 11 },
  ];
  const deltaCls = (tone: string) =>
    tone === 'rose' ? 'text-rose-500'
      : tone === 'emerald' ? 'text-emerald-600'
      : 'text-slate-400';
  return (
    <div className="space-y-3 px-3 pb-2">
      <div className="flex items-center justify-between">
        <EditableText slot="title" fallback="Spending Breakdown" className="text-[13px] font-bold" />
        <button type="button" className="text-[10px] font-semibold text-blue-600">
          <EditableText slot="report" fallback="Detailed Report ›" />
        </button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {chips.map((c) => (
          <button key={c.slot} type="button" onClick={() => setTab(c.label)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold ${tab === c.label ? 'bg-[#0B1A56] text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
            <EditableText slot={c.slot} fallback={c.label} />
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {categories.map((cat) => {
          const Icon = cat.Icon;
          return (
            <div key={cat.i} className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-4 w-4" /></span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <EditableText slot={`cat${cat.i}Name`} fallback={cat.name} className="text-[11px] font-semibold" />
                    <EditableText slot={`cat${cat.i}Amt`} fallback={cat.amount} className="text-[11px] font-bold" />
                  </div>
                  <div className="flex items-center justify-between">
                    <EditableText slot={`cat${cat.i}Sub`} fallback={cat.sub} className="text-[8px] text-slate-400" />
                    <EditableText slot={`cat${cat.i}Delta`} fallback={cat.delta} className={`text-[8px] font-semibold ${deltaCls(cat.deltaTone)}`} />
                  </div>
                </div>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${cat.pct * 2}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeptemberBudgetCard({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl bg-[#EEF3FF] p-3">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-blue-600"><PiggyBank className="h-4 w-4" /></span>
      <div className="flex-1">
        <EditableText slot="title" fallback="September Budget" className="block text-[11px] font-bold" />
        <EditableText slot="remaining" fallback="$1,157.50 remaining of $5,000" className="block text-[9px] text-slate-500" />
      </div>
      <button type="button" className="rounded-full bg-white px-3 py-1 text-[9px] font-bold text-slate-700 shadow-sm">
        <EditableText slot="adjust" fallback="Adjust" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch 3 — Transfers page                                           */
/* ------------------------------------------------------------------ */

function TransferDetailsHero({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <BlueHeroShell className="rounded-b-3xl pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          <EditableText slot="title" fallback="Bill Payments" className="text-[13px] font-bold" />
        </div>
        <div className="flex items-center gap-1.5">
          <EllipsisVertical className="h-4 w-4" />
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/25 text-[9px] font-bold">EC</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        <span className="rounded-full bg-white/20 px-3 py-1 text-[9px] font-semibold">
          <EditableText slot="pill" fallback="● Review & Authorize" />
        </span>
        <EditableText slot="heading" fallback="Transfer Details" className="mt-3 text-[22px] font-bold" />
        <EditableText slot="description" fallback="Please double-check recipient info and amount" className="mt-1 text-[10px] text-white/70" />
      </div>
    </BlueHeroShell>
  );
}

function TransferRecipientCard({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="-mt-4 mx-3 rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-[13px] font-bold text-white">SJ</span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <EditableText slot="name" fallback="Sarah Jenkins" className="text-[12px] font-bold" />
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[8px] font-bold text-blue-600"><EditableText slot="trusted" fallback="Trusted" /></span>
          </div>
          <EditableText slot="email" fallback="sarah.j@email.com" className="block text-[9px] text-slate-500" />
          <EditableText slot="account" fallback="Chase Checking ••4821" className="block text-[9px] text-slate-500" />
        </div>
        <button type="button" aria-label="Edit recipient" className="grid h-8 w-8 place-items-center rounded-full bg-slate-100"><Pencil className="h-3.5 w-3.5 text-slate-600" /></button>
      </div>
      <div className="mt-3 rounded-xl bg-[#EEF3FF] p-3 text-center">
        <EditableText slot="totalLabel" fallback="Sending Total" className="text-[9px] font-bold uppercase tracking-wider text-slate-500" />
        <EditableText slot="totalValue" fallback="$250.00" className="mt-1 block text-[24px] font-bold text-slate-900" />
        <p className="mt-1 inline-flex items-center gap-1 text-[9px] text-emerald-600">
          <Check className="h-2.5 w-2.5" /> <EditableText slot="feeNote" fallback="Zero transfer fee applied" />
        </p>
      </div>
    </div>
  );
}

function TransferDetailsSummary({ ctx }: { ctx: BankingWalletCtx }) {
  const rows = [
    { i: 1, label: 'From Account', value: 'Ethan Carter', sub: 'Smart Wallet (••9042)', Icon: CreditCard, valueTone: '', strikethrough: false },
    { i: 2, label: 'Transfer Method', value: 'Instant to Bank', sub: 'Direct wire link', Icon: Zap, valueTone: '', strikethrough: false },
    { i: 3, label: 'Est. Arrival', value: 'Instant (1-2 mins)', sub: 'Available immediately', Icon: ClockIcon, valueTone: '', strikethrough: false },
    { i: 4, label: 'Transfer Fee', value: '$0.00 (Promo)', sub: '$2.50', Icon: ShieldCheck, valueTone: 'text-emerald-600', strikethrough: true },
  ];
  return (
    <div className="mx-3 space-y-2 rounded-2xl bg-white p-3 shadow-sm">
      {rows.map((row) => {
        const Icon = row.Icon;
        return (
          <div key={row.i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-3.5 w-3.5" /></span>
              <EditableText slot={`r${row.i}Label`} fallback={row.label} className="text-[10px] text-slate-500" />
            </div>
            <div className="text-right">
              <p className={`text-[10px] font-semibold ${row.valueTone}`}>
                {row.strikethrough && <span className="mr-1 text-slate-400 line-through"><EditableText slot={`r${row.i}Sub`} fallback={row.sub} /></span>}
                <EditableText slot={`r${row.i}Value`} fallback={row.value} />
              </p>
              {!row.strikethrough && row.sub && <EditableText slot={`r${row.i}Sub`} fallback={row.sub} className="block text-[8px] text-slate-400" />}
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600"><Pencil className="h-3.5 w-3.5" /></span>
          <div>
            <EditableText slot="noteLabel" fallback="Transfer Note" className="block text-[9px] text-slate-500" />
            <EditableText slot="noteValue" fallback="Dinner & concert tickets 🎵🎶" className="block text-[10px] font-semibold" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransferSecurityFooter({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 mb-2 space-y-2">
      <div className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><ShieldCheck className="h-4 w-4" /></span>
        <div>
          <p className="flex items-center gap-1 text-[11px] font-bold">
            <EditableText slot="protectedTitle" fallback="Protected Transfer" /> <Lock className="h-2.5 w-2.5" />
          </p>
          <EditableText slot="protectedSub" fallback="Covered by 256-bit bank grade encryption & Zero-Liability guarantee." className="mt-0.5 block text-[9px] text-slate-500" />
        </div>
      </div>
      <div className="rounded-2xl bg-[#EEF3FF] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <EditableText slot="tipTitle" fallback="Smart Recurring Tip" className="text-[10px] font-bold" />
          </div>
          <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold text-blue-600"><EditableText slot="tipBadge" fallback="New" /></span>
        </div>
        <EditableText slot="tipBody" fallback="Sending shared costs frequently? Set up an auto-split rule for recurring payments and save on average 4% in utility balance." className="mt-1 block text-[9px] leading-snug text-slate-600" />
      </div>
      <button type="button" onClick={ctx.actions.send} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] py-3 text-[12px] font-bold text-white shadow-lg shadow-blue-600/30">
        <EditableText slot="confirmCta" fallback="Confirm & Send $250.00" /> <ArrowRight className="h-3.5 w-3.5" />
      </button>
      <button type="button" className="w-full py-2 text-center text-[10px] font-semibold text-slate-500">
        <EditableText slot="cancelCta" fallback="Cancel Transfer" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch 3 — Profile page                                             */
/* ------------------------------------------------------------------ */

function ProfileIdentityHero({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <BlueHeroShell className="rounded-b-3xl pb-4">
      <HeroTopBar />
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="relative">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-[22px] font-bold text-white shadow-lg ring-4 ring-white/30">EC</span>
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-blue-600 shadow"><Pencil className="h-2.5 w-2.5" /></span>
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#0B1A56] text-white shadow"><Settings className="h-2.5 w-2.5" /></span>
        </div>
        <EditableText slot="name" fallback="Ethan Carter" className="mt-2 text-[16px] font-bold" />
        <EditableText slot="handle" fallback="@ethancarter" className="text-[9px] text-white/70" />
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[9px]">
          <EditableText slot="tier" fallback="👑 Platinum Member • Tier 3" /> <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <div className="mt-3 flex w-full gap-2">
          <button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B1A56]">
            <Share2 className="h-3 w-3" /> <EditableText slot="share" fallback="Share Profile" />
          </button>
          <button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B1A56]">
            <QrCode className="h-3 w-3" /> <EditableText slot="qr" fallback="My QR Code" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-white/10 p-2.5 backdrop-blur">
        <div>
          <EditableText slot="memberLabel" fallback="Member Since" className="block text-[8px] text-white/70" />
          <EditableText slot="memberValue" fallback="Sep 2021" className="mt-0.5 block text-[10px] font-bold" />
          <EditableText slot="memberSub" fallback="🕐 3.5 yrs" className="block text-[8px] text-white/70" />
        </div>
        <div>
          <EditableText slot="vaultsLabel" fallback="Total Vaults" className="block text-[8px] text-white/70" />
          <EditableText slot="vaultsValue" fallback="3 Active" className="mt-0.5 block text-[10px] font-bold" />
          <EditableText slot="vaultsSub" fallback="↓ +4.8% APY" className="block text-[8px] text-emerald-300" />
        </div>
        <div>
          <EditableText slot="scoreLabel" fallback="Credit Score" className="block text-[8px] text-white/70" />
          <p className="mt-0.5 flex items-center gap-0.5 text-[10px] font-bold">
            <EditableText slot="scoreValue" fallback="785" /> <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </p>
          <EditableText slot="scoreSub" fallback="Excellent" className="block text-[8px] text-emerald-300" />
        </div>
      </div>
    </BlueHeroShell>
  );
}

function VaultConciergeCard({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 -mt-4 flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><ShieldCheck className="h-4 w-4" /></span>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-[11px] font-bold">
          <EditableText slot="title" fallback="Vault Concierge Active" />
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600"><EditableText slot="badge" fallback="24/7" /></span>
        </p>
        <EditableText slot="sub" fallback="Priority support line & instant bill review" className="block text-[9px] text-slate-500" />
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
    </div>
  );
}

function ProfileSettingsGroups({ ctx }: { ctx: BankingWalletCtx }) {
  const [faceId, setFaceId] = useState(true);
  const accountRows = [
    { i: 1, title: 'Personal Information', sub: 'ethan.carter@workmail.co', Icon: CreditCard, badge: 'KYC Verified' },
    { i: 2, title: 'Bank Accounts & Linked', sub: 'Chase Premier ••8841, Titan', Icon: Landmark, badge: '2 Linked' },
    { i: 3, title: 'Direct Deposit & Routing Data', sub: 'Routing: 021000021 • Acct: ••••4', Icon: RefreshCw, badge: '' },
    { i: 4, title: 'Statements & Tax Documents', sub: '2024 Form 1099-INT Ready, PDF Available', Icon: FileText, badge: '' },
  ];
  const securityRows = [
    { i: 1, title: 'Face ID & Biometrics', sub: 'Fast biometric login enabled', Icon: Eye, toggle: faceId, setToggle: setFaceId },
    { i: 2, title: 'Two-Factor Authentication', sub: 'Authenticator App & SMS backup', Icon: Lock, badge: 'Enabled' },
    { i: 3, title: 'App Language & Currency', sub: 'English (US) • USD ($)', Icon: Globe },
  ];
  return (
    <div className="space-y-3 px-3 pb-2">
      <div>
        <EditableText slot="section1" fallback="Account & Preferences" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-slate-500" />
        <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {accountRows.map(({ i, title, sub, Icon, badge }) => (
            <div key={i} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-3.5 w-3.5" /></span>
                <div>
                  <EditableText slot={`a${i}Title`} fallback={title} className="block text-[11px] font-semibold" />
                  <EditableText slot={`a${i}Sub`} fallback={sub} className="block text-[8px] text-slate-400" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                {badge && <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600"><EditableText slot={`a${i}Badge`} fallback={badge} /></span>}
                <ChevronRight className="h-3 w-3 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <EditableText slot="section2" fallback="Security & App Settings" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-slate-500" />
        <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {securityRows.map(({ i, title, sub, Icon, badge, toggle, setToggle }: any) => (
            <div key={i} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-3.5 w-3.5" /></span>
                <div>
                  <EditableText slot={`s${i}Title`} fallback={title} className="block text-[11px] font-semibold" />
                  <EditableText slot={`s${i}Sub`} fallback={sub} className="block text-[8px] text-slate-400" />
                </div>
              </div>
              {toggle != null && setToggle ? (
                <Switch checked={toggle} onChange={() => setToggle(!toggle)} label={title} accent={ctx.accent} interactive={ctx.interactive} />
              ) : badge ? (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600"><EditableText slot={`s${i}Badge`} fallback={badge} /></span>
              ) : (
                <ChevronRight className="h-3 w-3 text-slate-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileHelpFooter({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="space-y-3 px-3 pb-2">
      <div>
        <EditableText slot="sectionTitle" fallback="Help & Support" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-slate-500" />
        <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {[
            { i: 1, title: 'Help Center & Concierge', sub: 'Average reply time under 2 minutes', Icon: Headphones },
            { i: 2, title: 'Privacy & Legal Disclosures', sub: 'Terms of Service, FDIC Insurance info', Icon: ShieldCheck },
          ].map(({ i, title, sub, Icon }) => (
            <div key={i} className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-3.5 w-3.5" /></span>
                <div>
                  <EditableText slot={`h${i}Title`} fallback={title} className="block text-[11px] font-semibold" />
                  <EditableText slot={`h${i}Sub`} fallback={sub} className="block text-[8px] text-slate-400" />
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          ))}
          <div className="flex items-center justify-between gap-2 p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-rose-500"><LogOut className="h-3.5 w-3.5" /></span>
              <div>
                <EditableText slot="logout" fallback="Log Out" className="block text-[11px] font-semibold text-rose-600" />
                <EditableText slot="logoutSub" fallback="Safely end this session" className="block text-[8px] text-rose-400" />
              </div>
            </div>
            <ChevronRight className="h-3 w-3 text-rose-400" />
          </div>
        </div>
      </div>
      <div className="pt-1 text-center">
        <p className="flex items-center justify-center gap-1 text-[9px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <EditableText slot="status" fallback="All Systems Operational" />
          <span className="text-slate-400">• <EditableText slot="statusSub" fallback="End-to-End Encrypted" /></span>
        </p>
        <EditableText slot="version" fallback="Aura Wealth v4.18.2 (Build 2024.9) • FDIC Insured through Partner Banks" className="mt-0.5 block text-[8px] text-slate-400" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch 3 — Notifications page                                       */
/* ------------------------------------------------------------------ */

function NotificationsHero({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <BlueHeroShell className="rounded-b-3xl pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/20"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <EditableText slot="title" fallback="Notifications" className="text-[14px] font-bold" />
        </div>
        <div className="flex gap-1.5">
          <button type="button" className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-semibold">
            <Check className="h-3 w-3" /> <EditableText slot="markRead" fallback="Mark read" />
          </button>
          <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-white/20"><SlidersHorizontal className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/25"><Bell className="h-4 w-4" /></span>
          <div>
            <EditableText slot="unread" fallback="3 Unread Alerts" className="block text-[11px] font-bold" />
            <EditableText slot="unreadSub" fallback="Financial security & updates active" className="block text-[9px] text-white/70" />
          </div>
        </div>
        <span className="rounded-full bg-emerald-400 px-2.5 py-1 text-[9px] font-bold text-emerald-900"><EditableText slot="liveFeed" fallback="Live Feed" /></span>
      </div>
    </BlueHeroShell>
  );
}

function NotificationsFilterChips({ ctx }: { ctx: BankingWalletCtx }) {
  const [selected, setSelected] = useState('All');
  const chips = [
    { slot: 'chip1', id: 'All', count: 5 },
    { slot: 'chip2', id: 'Transactions' },
    { slot: 'chip3', id: 'Security' },
    { slot: 'chip4', id: 'Promos' },
  ];
  return (
    <div className="-mt-4 mx-3 rounded-full bg-white p-1.5 shadow-sm">
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {chips.map((c) => (
          <button key={c.slot} type="button" onClick={() => setSelected(c.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${selected === c.id ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
            <EditableText slot={c.slot} fallback={c.id} />
            {c.count != null && <span className="ml-1 rounded-full bg-white/20 px-1 text-[8px]">{c.count}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function NotificationsFeed({ ctx }: { ctx: BankingWalletCtx }) {
  const groups = [
    {
      gSlot: 'g1', sortSlot: 'g1Sort', label: 'TODAY', sort: 'Newest First',
      items: [
        { i: 1, title: 'Apple Store Fifth Ave', sub: 'Payment of $149.00 confirmed with Apple Pay.', time: '2m ago', unread: true, badge: '🧾 Receipt ready', Icon: ShoppingBag, iconTone: 'bg-blue-50 text-blue-600' },
        { i: 2, title: 'New Sign-in Detected', sub: 'New authorized login from iPhone 15 Pro near New York, NY.', time: '1h ago', unread: true, cta: { label: 'Review Access', tone: 'bg-rose-500 text-white' }, badge: 'Device verified', Icon: ShieldCheck, iconTone: 'bg-rose-100 text-rose-600' },
        { i: 3, title: 'Paycheck Settled', sub: 'Direct deposit of +$4,850.00 from Acme Corp is now cleared and…', time: '3h ago', unread: true, Icon: Camera, iconTone: 'bg-emerald-100 text-emerald-700' },
      ],
    },
    {
      gSlot: 'g2', label: 'YESTERDAY',
      items: [
        { i: 4, title: 'Bill Negotiator Success', sub: 'Good news! We renegotiated your AT&T Fiber rate down by $12/month without touching your speed tier.', time: 'Yesterday', badge: '💾 Save $144 annually', cta: { label: 'Details →', tone: 'text-blue-600' }, Icon: Sparkles, iconTone: 'bg-blue-50 text-blue-600' },
        { i: 5, title: 'Card Limit Pace', sub: 'Monthly card spending reached 30% of your configured $8,000 safety threshold.', time: 'Sep 17', Icon: CreditCard, iconTone: 'bg-slate-100 text-slate-600' },
      ],
    },
    {
      gSlot: 'g3', label: 'EARLIER THIS WEEK',
      items: [
        { i: 6, title: 'Perk Boost Applied', sub: 'You earned +$4.47 instant cashback bonus on your recent dining transaction at Nobu.', time: 'Sep 15', Icon: PiggyBank, iconTone: 'bg-violet-50 text-violet-600' },
      ],
    },
  ];
  return (
    <div className="space-y-3 px-3 pb-2">
      {groups.map((g) => (
        <section key={g.gSlot}>
          <div className="mb-1.5 flex items-center justify-between">
            <EditableText slot={g.gSlot} fallback={g.label} className="text-[9px] font-bold uppercase tracking-wider text-slate-500" />
            {g.sort && <EditableText slot={g.sortSlot!} fallback={g.sort} className="text-[9px] text-slate-400" />}
          </div>
          <div className="space-y-1.5">
            {g.items.map((item: any) => {
              const Icon = item.Icon;
              return (
                <div key={item.i} className="flex items-start gap-2.5 rounded-2xl bg-white p-3 shadow-sm">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.iconTone}`}><Icon className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <EditableText slot={`a${item.i}Title`} fallback={item.title} className="text-[11px] font-semibold" />
                      <div className="flex items-center gap-1">
                        <EditableText slot={`a${item.i}Time`} fallback={item.time} className="text-[8px] text-slate-400" />
                        {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                      </div>
                    </div>
                    <EditableText slot={`a${item.i}Sub`} fallback={item.sub} className="mt-0.5 block text-[9px] leading-snug text-slate-500" />
                    {(item.badge || item.cta) && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {item.cta && (
                          <button type="button" className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${item.cta.tone}`}>
                            <EditableText slot={`a${item.i}Cta`} fallback={item.cta.label} />
                          </button>
                        )}
                        {item.badge && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-semibold text-slate-600">
                            <EditableText slot={`a${item.i}Badge`} fallback={item.badge} />
                          </span>
                        )}
                      </div>
                    )}
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

function NotificationsQuietHours({ ctx }: { ctx: BankingWalletCtx }) {
  return (
    <div className="mx-3 mb-2">
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600"><Minus className="h-4 w-4" /></span>
          <div>
            <EditableText slot="title" fallback="Preferences & Quiet Hours" className="block text-[11px] font-semibold" />
            <EditableText slot="sub" fallback="Muted weekdays from 10 PM to 7 AM" className="block text-[8px] text-slate-400" />
          </div>
        </div>
        <ChevronRight className="h-3 w-3 text-slate-400" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public renderer                                                    */
/* ------------------------------------------------------------------ */

export function BankingWalletModuleView({ id, ctx }: { id: string; ctx: BankingWalletCtx }) {
  switch (id) {
    case 'homeHeroBalance': return <HomeHeroBalance ctx={ctx} />;
    case 'quickSendRow': return <QuickSendRow ctx={ctx} />;
    case 'spendingChart': return <SpendingChart ctx={ctx} />;
    case 'creditCardCarousel': return <CreditCardCarousel ctx={ctx} />;
    case 'cardSecurityLock': return <CardSecurityLock ctx={ctx} />;
    case 'detailedHistory': return <DetailedHistory ctx={ctx} />;
    case 'notificationCenter': return <NotificationCenter ctx={ctx} />;
    case 'profileMenu': return <ProfileMenu ctx={ctx} />;
    case 'sendMoneySheet': return <SendMoneySheet ctx={ctx} />;
    case 'transferMoneyHeader': return <TransferMoneyHeader ctx={ctx} />;
    case 'transferAmountMethods': return <TransferAmountMethods ctx={ctx} />;
    case 'transferReviewFooter': return <TransferReviewFooter ctx={ctx} />;
    case 'homeBlueHero': return <HomeBlueHero ctx={ctx} />;
    case 'billNegotiatorCard': return <BillNegotiatorCard ctx={ctx} />;
    case 'billsPaymentsList': return <BillsPaymentsList ctx={ctx} />;
    case 'myCardsHero': return <MyCardsHero ctx={ctx} />;
    case 'cardSpendingLimit': return <CardSpendingLimit ctx={ctx} />;
    case 'cardSecurityPermissions': return <CardSecurityPermissions ctx={ctx} />;
    case 'cardCashPerks': return <CardCashPerks ctx={ctx} />;
    case 'cardRecentActivity': return <CardRecentActivity ctx={ctx} />;
    case 'accountsSpendHero': return <AccountsSpendHero ctx={ctx} />;
    case 'smartCashflowInsight': return <SmartCashflowInsight ctx={ctx} />;
    case 'spendingBreakdownList': return <SpendingBreakdownList ctx={ctx} />;
    case 'septemberBudgetCard': return <SeptemberBudgetCard ctx={ctx} />;
    case 'transferDetailsHero': return <TransferDetailsHero ctx={ctx} />;
    case 'transferRecipientCard': return <TransferRecipientCard ctx={ctx} />;
    case 'transferDetailsSummary': return <TransferDetailsSummary ctx={ctx} />;
    case 'transferSecurityFooter': return <TransferSecurityFooter ctx={ctx} />;
    case 'profileIdentityHero': return <ProfileIdentityHero ctx={ctx} />;
    case 'vaultConciergeCard': return <VaultConciergeCard ctx={ctx} />;
    case 'profileSettingsGroups': return <ProfileSettingsGroups ctx={ctx} />;
    case 'profileHelpFooter': return <ProfileHelpFooter ctx={ctx} />;
    case 'notificationsHero': return <NotificationsHero ctx={ctx} />;
    case 'notificationsFilterChips': return <NotificationsFilterChips ctx={ctx} />;
    case 'notificationsFeed': return <NotificationsFeed ctx={ctx} />;
    case 'notificationsQuietHours': return <NotificationsQuietHours ctx={ctx} />;
    default: return null;
  }
}