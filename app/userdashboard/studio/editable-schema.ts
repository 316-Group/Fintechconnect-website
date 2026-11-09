// /client/app/userdashboard/studio/editable-schema.ts
import type { ModuleId } from './phone-cards';

export interface TextSlot  { slot: string; label: string; defaultValue: string }
export interface ColorSlot { slot: string; label: string; defaultValue: string }

/**
 * Every module declares the slots it exposes to the RightPanel.
 * defaultValue is only a placeholder; the component's `fallback` renders
 * when no override exists.
 */
export const EDITABLE_SCHEMA: Partial<
  Record<ModuleId, { text?: TextSlot[]; colors?: ColorSlot[] }>
> = {
  /* ── Home widgets ─────────────────────────────────────────────── */
  headerGreeting: {
    text: [
      { slot: 'greeting', label: 'Greeting',       defaultValue: 'Good morning' },
      { slot: 'name',     label: 'Name',           defaultValue: 'Krishnan' },
      { slot: 'avatar',   label: 'Avatar initial', defaultValue: 'K' },
    ],
    colors: [
      { slot: 'avatarBg', label: 'Avatar background', defaultValue: '#0040DF' },
    ],
  },
  accounts: {
    text: [
      { slot: 'label',   label: 'Top label', defaultValue: 'Total Balance' },
      { slot: 'balance', label: 'Balance',   defaultValue: '$25,000.40' },
      { slot: 'cta',     label: 'CTA label', defaultValue: 'My Wallet' },
    ],
    colors: [
      { slot: 'bg',     label: 'Card background', defaultValue: '#1B1B1F' },
      { slot: 'accent', label: 'Accent circle',   defaultValue: '#0040DF' },
      { slot: 'ctaBg',  label: 'CTA pill',        defaultValue: '#FFFFFF' },
    ],
  },
  cashflow: {
    text: [
      { slot: 'incomeLabel',  label: 'Income label',  defaultValue: 'Income' },
      { slot: 'incomeValue',  label: 'Income value',  defaultValue: '$ 20,000' },
      { slot: 'outcomeLabel', label: 'Outcome label', defaultValue: 'Outcome' },
      { slot: 'outcomeValue', label: 'Outcome value', defaultValue: '$ 17,000' },
    ],
    colors: [
      { slot: 'bg',          label: 'Card background', defaultValue: '#1B1B1F' },
      { slot: 'incomeTint',  label: 'Income tint',     defaultValue: '#10B981' },
      { slot: 'outcomeTint', label: 'Outcome tint',    defaultValue: '#F43F5E' },
    ],
  },
  transfers: {
    text: [
      { slot: 'sendLabel',     label: 'Send',     defaultValue: 'Send' },
      { slot: 'paymentsLabel', label: 'Payments', defaultValue: 'Payments' },
      { slot: 'payBillLabel',  label: 'Pay Bill', defaultValue: 'Pay Bill' },
      { slot: 'topUpLabel',    label: 'Top Up',   defaultValue: 'Top Up' },
    ],
    colors: [
      { slot: 'sendTint',     label: 'Send icon',     defaultValue: '#0040DF' },
      { slot: 'paymentsTint', label: 'Payments icon', defaultValue: '#16A36B' },
      { slot: 'payBillTint',  label: 'Pay Bill icon', defaultValue: '#F5B921' },
      { slot: 'topUpTint',    label: 'Top Up icon',   defaultValue: '#EF4F6B' },
    ],
  },
  vaults: {
    text: [
      { slot: 'sectionTitle',  label: 'Title',            defaultValue: 'Savings' },
      { slot: 'sectionAction', label: 'Action',           defaultValue: 'See All' },
      { slot: 'goal1Name',     label: 'Goal 1 name',      defaultValue: 'iPhone 13 Mini' },
      { slot: 'goal1Amount',   label: 'Goal 1 amount',    defaultValue: '$699' },
      { slot: 'goal2Name',     label: 'Goal 2 name',      defaultValue: 'Macbook Pro M1' },
      { slot: 'goal2Amount',   label: 'Goal 2 amount',    defaultValue: '$1,499' },
    ],
  },
  cards: {
    text: [
      { slot: 'sectionTitle', label: 'Title',        defaultValue: 'Recent Activity' },
      { slot: 'action',       label: 'Action',       defaultValue: 'View History' },
      { slot: 'tx1Name',      label: 'Tx 1 name',    defaultValue: 'Apple Flagship Store' },
      { slot: 'tx1Sub',       label: 'Tx 1 detail',  defaultValue: 'Gadgets · Today, 10:24 AM' },
      { slot: 'tx1Amount',    label: 'Tx 1 amount',  defaultValue: '- $149.00' },
      { slot: 'tx1Method',    label: 'Tx 1 method',  defaultValue: 'Visa - #022' },
      { slot: 'tx2Name',      label: 'Tx 2 name',    defaultValue: 'Stripe Payout' },
      { slot: 'tx2Sub',       label: 'Tx 2 detail',  defaultValue: 'Income · Today, 08:30 AM' },
      { slot: 'tx2Amount',    label: 'Tx 2 amount',  defaultValue: '+ $4,200.00' },
      { slot: 'tx2Method',    label: 'Tx 2 method',  defaultValue: 'Bank - #118' },
      { slot: 'tx3Name',      label: 'Tx 3 name',    defaultValue: 'AWS Hosting' },
      { slot: 'tx3Sub',       label: 'Tx 3 detail',  defaultValue: 'Cloud · Yesterday, 6:12 PM' },
      { slot: 'tx3Amount',    label: 'Tx 3 amount',  defaultValue: '- $240.50' },
      { slot: 'tx3Method',    label: 'Tx 3 method',  defaultValue: 'Visa - #022' },
    ],
  },
  fx: {
    text: [
      { slot: 'sectionTitle', label: 'Title',       defaultValue: 'Wallets' },
      { slot: 'action',       label: 'Action',      defaultValue: 'Convert' },
      { slot: 'usdAmount',    label: 'USD amount',  defaultValue: '$18.2k' },
      { slot: 'eurAmount',    label: 'EUR amount',  defaultValue: '€6.4k' },
      { slot: 'gbpAmount',    label: 'GBP amount',  defaultValue: '£2.1k' },
    ],
  },
  analytics: {
    text: [
      { slot: 'label',  label: 'Label',          defaultValue: 'Monthly spending' },
      { slot: 'amount', label: 'Amount',         defaultValue: '$4,820' },
      { slot: 'delta',  label: 'Delta caption',  defaultValue: '-12.4% vs last month' },
    ],
    colors: [
      { slot: 'barAccent', label: 'Bar accent', defaultValue: '#0040DF' },
    ],
  },
  security: {
    text: [
      { slot: 'title', label: 'Title',       defaultValue: 'Face ID' },
      { slot: 'subOn', label: 'Sub (on)',    defaultValue: 'Required for transfers' },
      { slot: 'subOff',label: 'Sub (off)',   defaultValue: 'Turned off' },
    ],
    colors: [
      { slot: 'iconBg', label: 'Icon background', defaultValue: '#ECFDF5' },
    ],
  },
  notifications: {
    text: [
      { slot: 'title', label: 'Title',     defaultValue: '3 new alerts' },
      { slot: 'sub',   label: 'Subtitle',  defaultValue: 'Stripe payout received' },
    ],
    colors: [
      { slot: 'iconBg',  label: 'Icon background', defaultValue: '#FFFBEB' },
      { slot: 'dotColor',label: 'Dot color',       defaultValue: '#EF4F6B' },
    ],
  },

  /* ── Auth ─────────────────────────────────────────────────────── */
  signin: {
    text: [
      { slot: 'emailLabel',    label: 'Email label',        defaultValue: 'Email' },
      { slot: 'emailPh',       label: 'Email placeholder',  defaultValue: 'Enter Your Email' },
      { slot: 'pwdLabel',      label: 'Password label',     defaultValue: 'Password' },
      { slot: 'pwdPh',         label: 'Password placeholder', defaultValue: 'Enter Your Password' },
      { slot: 'forgot',        label: 'Forgot link',        defaultValue: 'Forgot Password?' },
      { slot: 'captcha',       label: 'Captcha text',       defaultValue: 'Click to start verification' },
      { slot: 'signinBtn',     label: 'Sign in button',     defaultValue: 'Sign in' },
      { slot: 'skipBtn',       label: 'Skip button',        defaultValue: 'Skip for now' },
      { slot: 'noAccount',     label: 'No-account text',    defaultValue: "Don't have an account?" },
      { slot: 'signup',        label: 'Sign-up link',       defaultValue: 'Sign up' },
      { slot: 'quickLogin',    label: 'Quick login label',  defaultValue: 'Quick Login:' },
    ],
    colors: [
      { slot: 'cardBg',       label: 'Card background',  defaultValue: '#FFFFFF' },
      { slot: 'signinBtnBg',  label: 'Sign in button',   defaultValue: '#111827' },
    ],
  },

  /* ── Accounts ─────────────────────────────────────────────────── */
  accountsPage: {
    text: [
      { slot: 'title',  label: 'Title',        defaultValue: 'Your accounts' },
      { slot: 'action', label: 'Action',       defaultValue: 'Manage' },
      { slot: 'a1Name', label: 'Row 1 name',   defaultValue: 'Everyday Checking' },
      { slot: 'a1Sub',  label: 'Row 1 sub',    defaultValue: 'Available · USD' },
      { slot: 'a1Amt',  label: 'Row 1 amount', defaultValue: '$12,480.20' },
      { slot: 'a2Name', label: 'Row 2 name',   defaultValue: 'High-Yield Savings' },
      { slot: 'a2Sub',  label: 'Row 2 sub',    defaultValue: 'Available · USD' },
      { slot: 'a2Amt',  label: 'Row 2 amount', defaultValue: '$8,920.00' },
      { slot: 'a3Name', label: 'Row 3 name',   defaultValue: 'Euro Travel Account' },
      { slot: 'a3Sub',  label: 'Row 3 sub',    defaultValue: 'Available · EUR' },
      { slot: 'a3Amt',  label: 'Row 3 amount', defaultValue: '€3,410.55' },
    ],
  },
  accountPortfolio: {
    text: [
      { slot: 'code',        label: 'Code',          defaultValue: '3.1 My Accounts' },
      { slot: 'title',       label: 'Title',         defaultValue: 'Account Portfolio' },
      { slot: 'a1Name',      label: 'Account 1 name',defaultValue: 'Everyday Checking' },
      { slot: 'a1Right',     label: 'Account 1 #',   defaultValue: '··· 4912' },
      { slot: 'a1Bal',       label: 'Account 1 bal', defaultValue: '$12,450.20' },
      { slot: 'a1Badge',     label: 'Account 1 tag', defaultValue: 'Active' },
      { slot: 'a2Name',      label: 'Account 2 name',defaultValue: 'High-Yield Savings' },
      { slot: 'a2Right',     label: 'Account 2 #',   defaultValue: '4.85% APY' },
      { slot: 'a2Bal',       label: 'Account 2 bal', defaultValue: '$11,200.00' },
      { slot: 'a2Badge',     label: 'Account 2 tag', defaultValue: 'Tier 1 Pot' },
      { slot: 'a3Name',      label: 'Account 3 name',defaultValue: 'Euro Travel Wallet' },
      { slot: 'a3Right',     label: 'Account 3 #',   defaultValue: 'EUR' },
      { slot: 'a3Bal',       label: 'Account 3 bal', defaultValue: '€1,200.00' },
      { slot: 'a3Badge',     label: 'Account 3 tag', defaultValue: 'IBAN DE89…' },
      { slot: 'cta',         label: 'Open-pocket button', defaultValue: 'Open New Pocket' },
    ],
  },
  routingWireData: {
    text: [
      { slot: 'code',         label: 'Code',             defaultValue: '3.2 Account Details' },
      { slot: 'title',        label: 'Title',            defaultValue: 'Routing & Wire Data' },
      { slot: 'holderLabel',  label: 'Holder label',     defaultValue: 'Account Holder' },
      { slot: 'holderValue',  label: 'Holder value',     defaultValue: 'Alex Rivera · Apex Holdings LLC' },
      { slot: 'r1Label',      label: 'Routing label',    defaultValue: 'ACH Routing Number' },
      { slot: 'r1Value',      label: 'Routing value',    defaultValue: '021000021' },
      { slot: 'r2Label',      label: 'Account label',    defaultValue: 'Account Number' },
      { slot: 'r2Value',      label: 'Account value',    defaultValue: '884920194821' },
      { slot: 'cta',          label: 'Share CTA',        defaultValue: 'Share Bank Details' },
    ],
    colors: [
      { slot: 'ctaBg', label: 'Share button', defaultValue: '#C026D3' },
    ],
  },
  statementsExport: {
    text: [
      { slot: 'code',        label: 'Code',           defaultValue: '3.3 Statements Export' },
      { slot: 'title',       label: 'Title',          defaultValue: 'Monthly Audited Files' },
      { slot: 'cycleLabel',  label: 'Cycle label',    defaultValue: 'Select Statement Cycle' },
      { slot: 'cycleValue',  label: 'Cycle value',    defaultValue: 'October 2024 (Current)' },
      { slot: 'formatLabel', label: 'Format label',   defaultValue: 'Format' },
      { slot: 'pdfBtn',      label: 'PDF button',     defaultValue: 'PDF Format' },
      { slot: 'csvBtn',      label: 'CSV button',     defaultValue: 'CSV Sheet' },
      { slot: 'seal',        label: 'Seal notice',    defaultValue: 'Cryptographically sealed with SHA-256 for tax filing' },
      { slot: 'download',    label: 'Download CTA',   defaultValue: 'Download PDF (1.2 MB)' },
    ],
    colors: [
      { slot: 'pdfActiveBg', label: 'PDF active bg', defaultValue: '#0284C7' },
      { slot: 'csvActiveBg', label: 'CSV active bg', defaultValue: '#0284C7' },
    ],
  },

  /* ── Transfers ────────────────────────────────────────────────── */
  directTransferEngine: {
    text: [
      { slot: 'code',          label: 'Code',              defaultValue: '4.1 Transfer Form' },
      { slot: 'title',         label: 'Title',             defaultValue: 'Direct Transfer Engine' },
      { slot: 'fromLabel',     label: 'From label',        defaultValue: 'From Account' },
      { slot: 'fromAccount',   label: 'From account',      defaultValue: 'Checking (··· 4912)' },
      { slot: 'fromBalance',   label: 'From balance',      defaultValue: '$12,450.20' },
      { slot: 'toLabel',       label: 'To label',          defaultValue: 'To Recipient' },
      { slot: 'toName',        label: 'Recipient name',    defaultValue: 'Sarah Jenkins (Chase)' },
      { slot: 'amountLabel',   label: 'Amount label',      defaultValue: 'Amount to Send' },
      { slot: 'amountValue',   label: 'Amount',            defaultValue: '$ 500.00' },
      { slot: 'instantTitle',  label: 'Instant title',     defaultValue: 'Instant FedNow' },
      { slot: 'instantSub',    label: 'Instant subtitle',  defaultValue: 'Free · Arrives Now' },
      { slot: 'achTitle',      label: 'ACH title',         defaultValue: 'Standard ACH' },
      { slot: 'achSub',        label: 'ACH subtitle',      defaultValue: '1-2 Business Days' },
      { slot: 'cta',           label: 'Continue CTA',      defaultValue: 'Continue to Review' },
    ],
    colors: [
      { slot: 'accentBorder', label: 'Instant border',   defaultValue: '#0040DF' },
      { slot: 'ctaBg',        label: 'Continue button',  defaultValue: '#0B1A56' },
      { slot: 'recipientBg',  label: 'Recipient avatar', defaultValue: '#3B82F6' },
    ],
  },
  multiMarketFX: {
    text: [
      { slot: 'code',       label: 'Code',             defaultValue: '4.2 Currency Exchange' },
      { slot: 'title',      label: 'Title',            defaultValue: 'Mid-Market FX Swap' },
      { slot: 'sendLabel',  label: 'Send label',       defaultValue: 'You send exactly' },
      { slot: 'feeLabel',   label: 'Fee label',        defaultValue: 'Fee: $0.00 USD' },
      { slot: 'sendValue',  label: 'Send amount',      defaultValue: '1,000.00' },
      { slot: 'sendCcy',    label: 'Send currency',    defaultValue: 'USD' },
      { slot: 'rateLabel',  label: 'Rate caption',     defaultValue: '1 USD = 0.9214 EUR (1m)' },
      { slot: 'recLabel',   label: 'Recipient label',  defaultValue: 'Recipient gets' },
      { slot: 'recValue',   label: 'Recipient amount', defaultValue: '921.40' },
      { slot: 'recCcy',     label: 'Recipient currency', defaultValue: 'EUR' },
      { slot: 'cta',        label: 'CTA',              defaultValue: 'Lock Rate & Exchange' },
    ],
    colors: [
      { slot: 'ctaBg',    label: 'CTA background',  defaultValue: '#F97316' },
      { slot: 'recValue', label: 'Recipient amount color', defaultValue: '#059669' },
    ],
  },
  recurringStanding: {
    text: [
      { slot: 'code',        label: 'Code',            defaultValue: '4.3 Scheduled Transfer' },
      { slot: 'title',       label: 'Title',           defaultValue: 'Recurring Standing Order' },
      { slot: 'payeeName',   label: 'Payee',           defaultValue: 'Prime Manhattan Realty' },
      { slot: 'payeeSub',    label: 'Payee sub',       defaultValue: 'Monthly Rent · #402' },
      { slot: 'amountLabel', label: 'Amount label',    defaultValue: 'Amount' },
      { slot: 'amountValue', label: 'Amount value',    defaultValue: '$2,100.00 / mo' },
      { slot: 'nextLabel',   label: 'Next label',      defaultValue: 'Next Run' },
      { slot: 'nextValue',   label: 'Next value',      defaultValue: 'Nov 1, 2024' },
      { slot: 'note',        label: 'Notice',          defaultValue: 'Automatic notification 24h prior' },
      { slot: 'cta',         label: 'Modify CTA',      defaultValue: 'Modify Schedule Rules' },
    ],
    colors: [
      { slot: 'payeeIconBg', label: 'Payee icon bg', defaultValue: '#0B1A56' },
    ],
  },
  authorizationModal: {
    text: [
      { slot: 'code',           label: 'Code',           defaultValue: '4.4 Authorization Modal' },
      { slot: 'reviewLabel',    label: 'Review label',   defaultValue: 'Payment Review' },
      { slot: 'amountValue',    label: 'Amount',         defaultValue: '$500.00' },
      { slot: 'toLine',         label: 'Recipient line', defaultValue: 'to Sarah Jenkins · Chase Bank' },
      { slot: 'feeLabel',       label: 'Fee label',      defaultValue: 'Network Fee' },
      { slot: 'feeValue',       label: 'Fee value',      defaultValue: 'Free (FedNow)' },
      { slot: 'deliveryLabel',  label: 'Delivery label', defaultValue: 'Estimated Delivery' },
      { slot: 'deliveryValue',  label: 'Delivery value', defaultValue: 'Within seconds' },
      { slot: 'originLabel',    label: 'Origin label',   defaultValue: 'Origin Account' },
      { slot: 'originValue',    label: 'Origin value',   defaultValue: '··· 4912' },
      { slot: 'cta',            label: 'CTA',            defaultValue: 'Authorize Transfer ($500.00)' },
      { slot: 'cancel',         label: 'Cancel link',    defaultValue: 'Cancel transaction' },
    ],
    colors: [
      { slot: 'ctaBg', label: 'CTA background', defaultValue: '#14B8A6' },
    ],
  },

  /* ── Send ─────────────────────────────────────────────────────── */
  recentRecipients: {
    text: [
      { slot: 'code',     label: 'Code',           defaultValue: '5.1 Recent Recipients' },
      { slot: 'title',    label: 'Title',          defaultValue: 'One-Tap Contacts Dock' },
      { slot: 'addNew',   label: 'Add new label',  defaultValue: 'Add New' },
      { slot: 'c1Name',   label: 'Contact 1 name', defaultValue: 'Sarah J.' },
      { slot: 'c2Name',   label: 'Contact 2 name', defaultValue: 'Marcus' },
      { slot: 'c3Name',   label: 'Contact 3 name', defaultValue: 'Elena' },
      { slot: 'footer',   label: 'Footer',         defaultValue: 'Synced with Device Contacts' },
      { slot: 'manage',   label: 'Manage link',    defaultValue: 'Manage (24)' },
    ],
    colors: [
      { slot: 'c1Bg', label: 'Avatar 1 bg', defaultValue: '#3B82F6' },
      { slot: 'c2Bg', label: 'Avatar 2 bg', defaultValue: '#818CF8' },
      { slot: 'c3Bg', label: 'Avatar 3 bg', defaultValue: '#34D399' },
    ],
  },
  beneficiaryValidation: {
    text: [
      { slot: 'code',         label: 'Code',           defaultValue: '5.2 Add Recipient' },
      { slot: 'title',        label: 'Title',          defaultValue: 'Beneficiary Validation' },
      { slot: 'nameLabel',    label: 'Name label',     defaultValue: 'Legal Full Name' },
      { slot: 'namePh',       label: 'Name placeholder', defaultValue: 'e.g. Liam Gallagher' },
      { slot: 'routingLabel', label: 'Routing label',  defaultValue: 'Routing Number or SWIFT' },
      { slot: 'detected',     label: 'Detected text',  defaultValue: 'Auto-detected: Chase' },
      { slot: 'routingValue', label: 'Routing value',  defaultValue: '021000021' },
      { slot: 'cta',          label: 'Save CTA',       defaultValue: 'Save Beneficiary' },
    ],
    colors: [
      { slot: 'ctaBg', label: 'Save button', defaultValue: '#0B1A56' },
    ],
  },
  sendMoneyAmount: {
    text: [
      { slot: 'code',        label: 'Code',         defaultValue: '5.3 Send Money Focus' },
      { slot: 'label',       label: 'Label',        defaultValue: 'Amount to Dispatch' },
      { slot: 'amountValue', label: 'Amount',       defaultValue: '$120.00' },
      { slot: 'note',        label: 'Note',         defaultValue: 'Dinner & drinks 🍕' },
      { slot: 'cta',         label: 'Review CTA',   defaultValue: 'Review Payment' },
    ],
    colors: [
      { slot: 'ctaBg', label: 'Review button', defaultValue: '#0B1A56' },
    ],
  },
  transferSuccess: {
    text: [
      { slot: 'code',    label: 'Code',             defaultValue: '5.4 Transfer Success' },
      { slot: 'title',   label: 'Title',            defaultValue: 'Transfer Dispatched!' },
      { slot: 'sub',     label: 'Subtitle',         defaultValue: '$120.00 sent to Sarah Jenkins' },
      { slot: 'txid',    label: 'Transaction ID',   defaultValue: 'TXID: #US-99214-88A' },
      { slot: 'share',   label: 'Share button',     defaultValue: 'Share' },
      { slot: 'done',    label: 'Done button',      defaultValue: 'Done' },
    ],
    colors: [
      { slot: 'doneBg', label: 'Done button',   defaultValue: '#3B82F6' },
      { slot: 'iconBg', label: 'Success circle', defaultValue: '#D1FAE5' },
    ],
  },

  /* ── Payments ─────────────────────────────────────────────────── */
  peerInvoicing: {
    text: [
      { slot: 'code',        label: 'Code',         defaultValue: '6.1 Request Money' },
      { slot: 'title',       label: 'Title',        defaultValue: 'Peer Invoicing' },
      { slot: 'amountLabel', label: 'Amount label', defaultValue: 'Requested Amount' },
      { slot: 'amountValue', label: 'Amount',       defaultValue: '75.00' },
      { slot: 'noteLabel',   label: 'Note label',   defaultValue: 'Purpose Note' },
      { slot: 'noteValue',   label: 'Note',         defaultValue: 'Concert tickets 🎫' },
      { slot: 'cta',         label: 'Send CTA',     defaultValue: 'Send Request' },
    ],
    colors: [
      { slot: 'ctaBg', label: 'Send button', defaultValue: '#0B1A56' },
    ],
  },
  paymentQR: {
    text: [
      { slot: 'code',     label: 'Code',             defaultValue: '6.2 Payment QR' },
      { slot: 'scan',     label: 'Scan caption',     defaultValue: 'Scan to pay Alex Rivera' },
      { slot: 'amount',   label: 'Amount caption',   defaultValue: 'Custom fixed amount: $75.00' },
      { slot: 'download', label: 'Download button',  defaultValue: 'Download QR' },
      { slot: 'copy',     label: 'Copy button',      defaultValue: 'Copy Link' },
    ],
    colors: [
      { slot: 'ringColor', label: 'QR ring',     defaultValue: '#0040DF' },
      { slot: 'copyBg',    label: 'Copy button', defaultValue: '#1E40AF' },
    ],
  },
  splitPayment: {
    text: [
      { slot: 'code',        label: 'Code',           defaultValue: '6.3 Split Payment' },
      { slot: 'totalLabel',  label: 'Total label',    defaultValue: 'Total Bill' },
      { slot: 'totalValue',  label: 'Total',          defaultValue: '$180.00' },
      { slot: 'splitLabel',  label: 'Split label',    defaultValue: 'Split 3 ways' },
      { slot: 'splitValue',  label: 'Split amount',   defaultValue: '$60.00 each' },
      { slot: 'youName',     label: 'You name',       defaultValue: 'You (Alex)' },
      { slot: 'youLabel',    label: 'You status',     defaultValue: 'Paid ($60)' },
      { slot: 'p2Name',      label: 'Person 2',       defaultValue: 'Mike Henderson' },
      { slot: 'p2Label',     label: 'Person 2 status',defaultValue: 'Request $60' },
      { slot: 'p3Name',      label: 'Person 3',       defaultValue: 'Jessica Taylor' },
      { slot: 'p3Label',     label: 'Person 3 status',defaultValue: 'Request $60' },
      { slot: 'cta',         label: 'Send requests',  defaultValue: 'Send 2 Requests ($120.00)' },
    ],
    colors: [
      { slot: 'ctaBg',  label: 'CTA background', defaultValue: '#0B1A56' },
      { slot: 'accent', label: 'Accent dots',    defaultValue: '#0040DF' },
    ],
  },
  outstandingReceivables: {
    text: [
      { slot: 'code',   label: 'Code',            defaultValue: '6.4 Pending Tracker' },
      { slot: 'title',  label: 'Title',           defaultValue: 'Outstanding Receivables' },
      { slot: 'r1Name', label: 'Row 1 name',      defaultValue: 'Mike Henderson' },
      { slot: 'r1Sub',  label: 'Row 1 sub',       defaultValue: 'Pending 2 days · $45.00' },
      { slot: 'r1Btn',  label: 'Row 1 button',    defaultValue: 'Remind' },
      { slot: 'r2Name', label: 'Row 2 name',      defaultValue: 'Jessica Taylor' },
      { slot: 'r2Sub',  label: 'Row 2 sub',       defaultValue: 'Paid today · $120.00' },
      { slot: 'total',  label: 'Total caption',   defaultValue: 'Total outstanding: $45.00' },
      { slot: 'action', label: 'Action link',     defaultValue: 'Clear Settled' },
    ],
  },

  /* ── Cards ────────────────────────────────────────────────────── */
  cardPreview: {
    text: [
      { slot: 'label',   label: 'Top label', defaultValue: 'Total Balance' },
      { slot: 'balance', label: 'Balance',   defaultValue: '$25,000.40' },
      { slot: 'cta',     label: 'CTA label', defaultValue: 'My Wallet' },
    ],
    colors: [
      { slot: 'bg',     label: 'Card background', defaultValue: '#1B1B1F' },
      { slot: 'accent', label: 'Accent circle',   defaultValue: '#0040DF' },
      { slot: 'ctaBg',  label: 'CTA pill',        defaultValue: '#FFFFFF' },
    ],
  },
  cardControls: {
    text: [
      { slot: 'code',         label: 'Code',            defaultValue: '7.2 Card Controls' },
      { slot: 'title',        label: 'Title',           defaultValue: 'Security Switches' },
      { slot: 'freezeLabel',  label: 'Freeze label',    defaultValue: 'Freeze Card' },
      { slot: 'onlineLabel',  label: 'Online label',    defaultValue: 'Online Payments' },
      { slot: 'nfcLabel',     label: 'NFC label',       defaultValue: 'Contactless (NFC)' },
      { slot: 'limitLabel',   label: 'Limit label',     defaultValue: 'Monthly Spend Limit' },
      { slot: 'limitValue',   label: 'Limit value',     defaultValue: '$2,500 / $5,000' },
      { slot: 'note',         label: 'Reset note',      defaultValue: 'Limits reset in 8 days' },
    ],
    colors: [
      { slot: 'barColor', label: 'Progress bar', defaultValue: '#0040DF' },
    ],
  },
  pinVault: {
    text: [
      { slot: 'code',         label: 'Code',           defaultValue: '7.3 Card Security' },
      { slot: 'title',        label: 'Title',          defaultValue: 'PIN Vault & Replacement' },
      { slot: 'holdTitle',    label: 'Hold title',     defaultValue: 'Hold to View PIN' },
      { slot: 'holdSub',      label: 'Hold subtitle',  defaultValue: 'Reveals physical terminal code' },
      { slot: 'changeTitle',  label: 'Change PIN',     defaultValue: 'Change PIN' },
      { slot: 'reportTitle',  label: 'Report label',   defaultValue: 'Report Lost or Stolen' },
    ],
    colors: [
      { slot: 'reportBg', label: 'Report button bg', defaultValue: '#FEF2F2' },
    ],
  },

  /* ── Alerts ───────────────────────────────────────────────────── */
  alertCenter: {
    text: [
      { slot: 'code',     label: 'Code',           defaultValue: '9.1 Alert Feed' },
      { slot: 'title',    label: 'Title',          defaultValue: 'Alert Center' },
      { slot: 'a1Title',  label: 'Alert 1 title',  defaultValue: 'Payment Received: $4,250.00' },
      { slot: 'a1Sub',    label: 'Alert 1 sub',    defaultValue: 'Your employer deposited funds via FedACH.' },
      { slot: 'a1Time',   label: 'Alert 1 time',   defaultValue: '10m ago' },
      { slot: 'a2Title',  label: 'Alert 2 title',  defaultValue: 'New Login from Chrome Mac' },
      { slot: 'a2Sub',    label: 'Alert 2 sub',    defaultValue: 'New York, US · IP 192.88.21.0' },
      { slot: 'a2Time',   label: 'Alert 2 time',   defaultValue: '2h ago' },
      { slot: 'a3Title',  label: 'Alert 3 title',  defaultValue: 'October Statement Ready' },
      { slot: 'a3Sub',    label: 'Alert 3 sub',    defaultValue: 'Your monthly checking statement is ready.' },
      { slot: 'a3Time',   label: 'Alert 3 time',   defaultValue: '1d ago' },
      { slot: 'markAll',  label: 'Mark-all link',  defaultValue: 'Mark all as read' },
    ],
    colors: [
      { slot: 'a1IconBg', label: 'Alert 1 icon bg', defaultValue: '#1D4ED8' },
    ],
  },
  deliveryChannels: {
    text: [
      { slot: 'code',     label: 'Code',           defaultValue: '9.2 Preferences' },
      { slot: 'title',    label: 'Title',          defaultValue: 'Delivery Channels' },
      { slot: 'd1Title',  label: 'Large-payment title', defaultValue: 'Push Alerts for Large Payments' },
      { slot: 'd1Sub',    label: 'Large-payment sub',   defaultValue: 'Notify when debit exceeds $10.00' },
      { slot: 'd2Title',  label: 'Weekly title',    defaultValue: 'Weekly Spending Digest' },
      { slot: 'd2Sub',    label: 'Weekly sub',      defaultValue: 'Summary sent Sunday evening' },
      { slot: 'd3Title',  label: 'Security title',  defaultValue: 'Security & Anomaly Warnings' },
      { slot: 'd3Sub',    label: 'Security sub',    defaultValue: 'Critical unblockable security emails' },
      { slot: 'footer',   label: 'Footer',          defaultValue: 'Delivery via APNs & Webhook' },
      { slot: 'save',     label: 'Save link',       defaultValue: 'Save Rule Set' },
    ],
  },

  /* ── Profile & security ───────────────────────────────────────── */
  identityCard: {
    text: [
      { slot: 'code',      label: 'Code',           defaultValue: '10.1 Identity Card' },
      { slot: 'name',      label: 'Name',           defaultValue: 'Alex Rivera' },
      { slot: 'email',     label: 'Email',          defaultValue: 'alex.rivera@fintech.io' },
      { slot: 'tier',      label: 'Tier',           defaultValue: 'BLACK MEMBER' },
      { slot: 'taxLabel',  label: 'Tax label',      defaultValue: 'Tax ID (SSN)' },
      { slot: 'taxValue',  label: 'Tax value',      defaultValue: '••••••8921' },
      { slot: 'resLabel',  label: 'Residence label',defaultValue: 'Residence' },
      { slot: 'resValue',  label: 'Residence value',defaultValue: 'New York, United States' },
      { slot: 'cta',       label: 'Edit CTA',       defaultValue: 'Edit Account Identity' },
    ],
    colors: [
      { slot: 'avatarBg', label: 'Avatar bg', defaultValue: '#B45309' },
    ],
  },
  securityBaseline: {
    text: [
      { slot: 'code',      label: 'Code',          defaultValue: '10.2 Security Settings' },
      { slot: 'title',     label: 'Title',         defaultValue: 'Security Baseline' },
      { slot: 'pwdTitle',  label: 'Password title',defaultValue: 'Password' },
      { slot: 'pwdSub',    label: 'Password sub',  defaultValue: 'Updated 3 mos ago' },
      { slot: 'pwdBtn',    label: 'Update link',   defaultValue: 'Update' },
      { slot: 'bioTitle',  label: 'Biometric title', defaultValue: 'Biometrics (Face ID)' },
      { slot: 'bioSub',    label: 'Biometric sub', defaultValue: 'Active & Enrolled' },
      { slot: 'hwTitle',   label: 'Hardware title',defaultValue: 'Hardware Authenticator' },
      { slot: 'hwSub',     label: 'Hardware sub',  defaultValue: 'YubiKey 5C NFC' },
      { slot: 'score',     label: 'Score',         defaultValue: 'Security Score: 98%' },
      { slot: 'status',    label: 'Status',        defaultValue: 'Optimal' },
    ],
  },
  connectedDevices: {
    text: [
      { slot: 'code',     label: 'Code',            defaultValue: '10.3 Active Sessions' },
      { slot: 'title',    label: 'Title',           defaultValue: 'Connected Devices' },
      { slot: 'd1Name',   label: 'Device 1 name',   defaultValue: 'iPhone 15 Pro' },
      { slot: 'd1Sub',    label: 'Device 1 sub',    defaultValue: 'New York, US · This device' },
      { slot: 'd2Name',   label: 'Device 2 name',   defaultValue: 'MacBook Pro 16"' },
      { slot: 'd2Sub',    label: 'Device 2 sub',    defaultValue: 'Chrome 128 · Active 2h ago' },
      { slot: 'revoke',   label: 'Revoke link',     defaultValue: 'Revoke' },
      { slot: 'logOut',   label: 'Log-out button',  defaultValue: 'Log Out All Other Devices' },
    ],
  },

  /* ── History, splash, profile ─────────────────────────────────── */
  historyPage: {
    text: [
      { slot: 'placeholder', label: 'Search placeholder', defaultValue: 'Search transactions…' },
      { slot: 'chip1',       label: 'Chip 1',             defaultValue: 'All' },
      { slot: 'chip2',       label: 'Chip 2',             defaultValue: 'Income' },
      { slot: 'chip3',       label: 'Chip 3',             defaultValue: 'Spending' },
      { slot: 'chip4',       label: 'Chip 4',             defaultValue: 'Pending' },
    ],
    colors: [
      { slot: 'activeChipBg', label: 'Active chip bg', defaultValue: '#0040DF' },
    ],
  },
  splash: {
    text: [
      { slot: 'brand',  label: 'Brand name', defaultValue: 'APEX BANK' },
      { slot: 'letter', label: 'Letter mark', defaultValue: 'A' },
    ],
    colors: [
      { slot: 'brandBg', label: 'Brand bg', defaultValue: '#0F172A' },
      { slot: 'accent',  label: 'Accent',   defaultValue: '#0040DF' },
    ],
  },
  profile: {
    text: [
      { slot: 'name',  label: 'Name',   defaultValue: 'User Name' },
      { slot: 'email', label: 'Email',  defaultValue: 'user@apex.bank' },
      { slot: 'kyc',   label: 'KYC',    defaultValue: 'KYC Verified' },
      { slot: 'tier',  label: 'Tier',   defaultValue: 'Tier 2' },
    ],
    colors: [
      { slot: 'avatarBg', label: 'Avatar bg', defaultValue: '#0040DF' },
    ],
  },
  freezeCard: {
    text: [
      { slot: 'title',  label: 'Title',       defaultValue: 'Freeze Card' },
      { slot: 'subOn',  label: 'Sub (frozen)',defaultValue: 'Card is frozen' },
      { slot: 'subOff', label: 'Sub (active)',defaultValue: 'Block instant transactions' },
    ],
    colors: [
      { slot: 'iconBg', label: 'Icon bg', defaultValue: '#F0F9FF' },
    ],
  },
};