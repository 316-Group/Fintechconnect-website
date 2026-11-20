/* ------------------------------------------------------------------ */
/*  Connector catalogue                                                 */
/*  One entry per connector. The directory page lists them and         */
/*  /userdashboard/connectors/[slug] renders the detail sub-page.      */
/* ------------------------------------------------------------------ */

export type LogoKind = "stripe" | "plaid" | "adyen" | "marqeta" | "brex" | "unit" | "alloy";

export type FeatureIcon =
  | "card"
  | "payout"
  | "dispute"
  | "stream"
  | "vault"
  | "bank"
  | "identity"
  | "ledger"
  | "fraud"
  | "limits";

export type FeatureTone = "blue" | "violet" | "amber" | "emerald" | "rose" | "sky";

export type FeedStatus = "Settled" | "In Transit" | "Pending" | "Failed";

export type FeedRow = {
  rail: string;
  id: string;
  sub: string;
  amount: string;
  positive: boolean;
  fee: string;
  feeNote: string;
  status: FeedStatus;
  when: string;
};

export type WebhookEvent = { event: string; text: string };

export type Scope = { scope: string; text: string; status: "Mandatory" | "Active" };

export type Connector = {
  slug: string;
  name: string;
  logo: LogoKind;
  /** Gradient for the large tile on the detail page. */
  tile: [string, string];
  /** Letter drawn on the large tile. */
  glyph: string;
  summary: string;
  title: string;
  connectedByDefault: boolean;
  languages: string;
  pricing: { text: string; note: string };
  actionRequired: string;
  categories: string[];
  gateway: { label: string; listener: string; columns: [string, string, string] };
  feed: FeedRow[];
  headline: string;
  paragraphs: string[];
  features: { title: string; text: string; icon: FeatureIcon; tone: FeatureTone }[];
  credentials: {
    alias: string;
    publishableLabel: string;
    publishableKey: string;
    secretLabel: string;
    secretFormat: string;
    secretKey: string;
    webhookSecret: string;
  };
  ledger: { asset: string; account: string; schedule: string };
  webhooks: WebhookEvent[];
  scopes: Scope[];
  encryption: { transport: string; hsm: string; boundary: string };
  region: { primary: string; text: string };
};

export const SETTLEMENT_ASSETS = [
  "USD — United States Dollar",
  "EUR — Euro",
  "GBP — British Pound",
  "CAD — Canadian Dollar",
  "SGD — Singapore Dollar",
];

export const LEDGER_ACCOUNTS = [
  "Apex Primary Omnibus Reserve (Account #9901-BaaS)",
  "Apex Operating Account (Account #4410-OPS)",
  "Apex Card Program Float (Account #7720-CARD)",
  "Apex Escrow Sub-ledger (Account #3305-ESC)",
];

export const SETTLEMENT_SCHEDULES = [
  "Immediate / Continuous (T+0 via FedNow/RTP)",
  "Same Day (T+0 batch at 17:00 ET)",
  "Next Business Day (T+1 via ACH)",
  "Weekly Sweep (Fridays, T+2)",
];

export const CONNECTORS: Connector[] = [
  {
    slug: "stripe",
    name: "Stripe",
    logo: "stripe",
    tile: ["#7C6CFF", "#3D2DF0"],
    glyph: "S",
    summary: "Connect Stripe to accept global payments, manage recurring billing, and automate payouts.",
    title: "Stripe Payments & Payouts",
    connectedByDefault: false,
    languages: "English, Spanish, French, German, Japanese",
    pricing: { text: "Included with your platform subscription", note: "(Standard BaaS tier)" },
    actionRequired: "Stripe Merchant or Platform account required (API keys or OAuth)",
    categories: ["Payments & Settlement", "Card Acquiring"],
    gateway: { label: "Stripe Gateway", listener: "prod_wh_89xK2", columns: ["Gross Volume", "BaaS Reserve Fee", "Settlement Date"] },
    feed: [
      { rail: "CARD", id: "ch_3Op87L2eZvKYIo2", sub: "Apple Pay — 4242 (Stripe Connect)", amount: "+$4,850.00 USD", positive: true, fee: "$12.12", feeNote: "(0.25%)", status: "Settled", when: "Just now" },
      { rail: "PAYOUT", id: "po_1Nqo022eZvKYIo8", sub: "FedNow Instant Payout → Acct_9901", amount: "-$2,120.40 USD", positive: false, fee: "$1.50", feeNote: "(Flat rail)", status: "In Transit", when: "2 min ago" },
      { rail: "CARD", id: "ch_3M190T2eZvKYIo0", sub: "Visa Direct — 9811 (EUR Settlement)", amount: "+€1,250.00 EUR", positive: true, fee: "€3.12", feeNote: "(0.25%)", status: "Settled", when: "14 min ago" },
    ],
    headline:
      "One unified ledger, all payment rails. Keep confirmed Stripe card payments and seller payouts synchronized in your core ledger automatically.",
    paragraphs: [
      "Connect Stripe to add confirmed card charges, recurring subscriptions, disputes, and marketplace payouts directly into your Fintech Connect multi-currency double-entry ledger. Keep the settlement date, gross volume, net fee splits, and dispute statuses synced in real time.",
      "Fintech Connect remains the single source of truth for platform balances, virtual accounts, and compliance reporting. If a chargeback or refund occurs in Stripe, it is automatically posted to your reserve sub-ledger without manual reconciliation.",
    ],
    features: [
      { title: "Card Acquiring & Apple Pay", text: "Process global debit and credit transactions with automated fee deductions and instant settlement notifications.", icon: "card", tone: "blue" },
      { title: "Automated Seller & Vendor Payouts", text: "Route scheduled and on-demand payouts via ACH, SEPA, and FedNow directly to connected merchant accounts.", icon: "payout", tone: "violet" },
      { title: "Real-Time Dispute & Chargeback Sync", text: "Ingest dispute evidence requests immediately and lock contested escrow funds in your risk ledger automatically.", icon: "dispute", tone: "amber" },
      { title: "Webhook Event Streaming", text: "Stream raw Stripe payment_intent, customer.created, and payout.paid events into your Kafka event bus with guaranteed delivery.", icon: "stream", tone: "emerald" },
      { title: "Customer Tokenization & Vaulting", text: "Securely map Stripe customer IDs to your internal KYC user profiles without storing sensitive PAN or CVV data.", icon: "vault", tone: "violet" },
    ],
    credentials: {
      alias: "Apex Global — Stripe Sandbox US",
      publishableLabel: "Publishable Key (Client-Safe)",
      publishableKey: "pk_test_51Mzx93KdF83l9LqX9320kLwPq7Tz",
      secretLabel: "Secret API Key (Restricted Server Key)",
      secretFormat: "sk_test_...",
      secretKey: "sk_test_51Mzx93KdF83l9LqXSecretKeyVaultProtectedKey",
      webhookSecret: "whsec_908fbb23ef21aa80739c3da19f07",
    },
    ledger: { asset: SETTLEMENT_ASSETS[0], account: LEDGER_ACCOUNTS[0], schedule: SETTLEMENT_SCHEDULES[0] },
    webhooks: [
      { event: "payment_intent.succeeded", text: "Dispatches to Kafka topic: fintech.ledger.settlement" },
      { event: "charge.refunded", text: "Triggers reserve credit reversal" },
      { event: "payout.paid", text: "Dispatches seller remittance notification" },
      { event: "dispute.created", text: "Escalates to AML & Risk desk" },
    ],
    scopes: [
      { scope: "charges:read_write", text: "Authorized to capture charges, execute refunds, and debit customer balances", status: "Mandatory" },
      { scope: "payment_intents:stream", text: "Real-time webhook telemetry stream for ledger ingestion", status: "Active" },
      { scope: "balance:realtime", text: "Read-only access to available and pending settlement balances", status: "Active" },
      { scope: "customers:tokenized", text: "Customer vault ID linkage without cardholder data exposure", status: "Active" },
      { scope: "payouts:schedule", text: "Disbursal trigger for seller payouts via FedNow/ACH", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 14 days ago", boundary: "Zero PAN Exposure" },
    region: {
      primary: "US East (AWS GovCloud) & EU Frankfurt Mirror",
      text: "Cardholder data residency adheres to ISO/IEC 27701 privacy standards. Data Processing Agreement (DPA) signed on May 12, 2025 with standard EU contractual clauses (SCCs) active.",
    },
  },
  {
    slug: "plaid",
    name: "Plaid",
    logo: "plaid",
    tile: ["#2B2F36", "#0B0D10"],
    glyph: "P",
    summary: "Verify bank accounts, retrieve account balances, and authorize ACH transfers securely.",
    title: "Plaid Account Linking & ACH",
    connectedByDefault: true,
    languages: "English, Spanish, French, Dutch",
    pricing: { text: "Usage based — billed per linked Item", note: "(Pass-through)" },
    actionRequired: "Plaid team with Auth, Balance, and Transfer products enabled",
    categories: ["Bank Data & ACH", "Account Verification"],
    gateway: { label: "Plaid Link Gateway", listener: "prod_wh_PL41a", columns: ["Amount", "Verification Fee", "Posted"] },
    feed: [
      { rail: "AUTH", id: "item_Kd82LmQ0vNx7", sub: "Chase — Checking ••6621 (Instant Auth)", amount: "+$0.00 USD", positive: true, fee: "$0.30", feeNote: "(per Item)", status: "Settled", when: "Just now" },
      { rail: "ACH", id: "tfr_9Wq1ZpLc33Rf", sub: "ACH Debit → Acct_9901 (Same Day)", amount: "+$12,400.00 USD", positive: true, fee: "$0.25", feeNote: "(Flat rail)", status: "In Transit", when: "6 min ago" },
      { rail: "BALANCE", id: "bal_Lp0r52XmYt81", sub: "Wells Fargo — Savings ••0912", amount: "$48,210.77 USD", positive: true, fee: "$0.10", feeNote: "(per call)", status: "Settled", when: "21 min ago" },
    ],
    headline: "Verified bank accounts in seconds. Link customer accounts, check balances, and move money over ACH from one ledger.",
    paragraphs: [
      "Connect Plaid to let customers link their external bank accounts through Plaid Link. Account and routing numbers are verified instantly and stored as tokenized funding sources against each KYC profile.",
      "Every balance check and ACH transfer is written to your Fintech Connect ledger with its return window, so NSF returns and reversals post automatically to the right sub-ledger.",
    ],
    features: [
      { title: "Instant Account Verification", text: "Verify account ownership and routing details without micro-deposits using Plaid Auth.", icon: "bank", tone: "blue" },
      { title: "Real-Time Balance Checks", text: "Check available balances before initiating debits to reduce NSF returns.", icon: "ledger", tone: "emerald" },
      { title: "ACH Transfers & Returns", text: "Originate same-day and standard ACH and post R01–R29 returns automatically.", icon: "payout", tone: "violet" },
      { title: "Identity Match", text: "Compare account-holder names and addresses against your KYC records.", icon: "identity", tone: "amber" },
      { title: "Tokenized Funding Sources", text: "Store processor tokens rather than raw account numbers in your platform.", icon: "vault", tone: "sky" },
    ],
    credentials: {
      alias: "Apex Global — Plaid Production",
      publishableLabel: "Client ID",
      publishableKey: "62f1a9c0b4e2d1001a7c55e3",
      secretLabel: "Secret (Environment Key)",
      secretFormat: "32-char hex",
      secretKey: "3f9c2b7e1d0a4c8bb6e5f2a1d9c07e44",
      webhookSecret: "plwh_77c0e1fa29b84d03a6b1c2d4e5f6",
    },
    ledger: { asset: SETTLEMENT_ASSETS[0], account: LEDGER_ACCOUNTS[1], schedule: SETTLEMENT_SCHEDULES[2] },
    webhooks: [
      { event: "TRANSFER_EVENTS_UPDATE", text: "Posts ACH status changes to the ledger" },
      { event: "ITEM_LOGIN_REQUIRED", text: "Prompts the customer to re-link their account" },
      { event: "AUTH_DEFAULT_UPDATE", text: "Refreshes verified routing details" },
      { event: "BANK_TRANSFERS_RETURN", text: "Reverses the original credit and flags the account" },
    ],
    scopes: [
      { scope: "auth:read", text: "Read account and routing numbers for verified Items", status: "Mandatory" },
      { scope: "balance:realtime", text: "Real-time available and current balance checks", status: "Active" },
      { scope: "transfer:originate", text: "Originate ACH debits and credits on linked accounts", status: "Active" },
      { scope: "identity:match", text: "Account-holder name and address matching", status: "Active" },
      { scope: "item:webhook", text: "Receive Item status and error notifications", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 9 days ago", boundary: "Processor Tokens Only" },
    region: {
      primary: "US East (AWS us-east-1) & US West Mirror",
      text: "Consumer financial data is processed under the Gramm-Leach-Bliley Act. Data Processing Agreement signed on March 3, 2025 with retention limited to 24 months.",
    },
  },
  {
    slug: "adyen",
    name: "Adyen",
    logo: "adyen",
    tile: ["#22D16B", "#0A9A48"],
    glyph: "A",
    summary: "Unified commerce engine for omnichannel credit card processing and global acquiring.",
    title: "Adyen Unified Commerce",
    connectedByDefault: true,
    languages: "English, Dutch, German, French, Portuguese, Chinese",
    pricing: { text: "Interchange++ pass-through", note: "(Enterprise tier)" },
    actionRequired: "Adyen company account with an API credential and HMAC key",
    categories: ["Payments & Settlement", "Card Acquiring"],
    gateway: { label: "Adyen Gateway", listener: "live_wh_AD552", columns: ["Gross Volume", "Processing Fee", "Settlement Date"] },
    feed: [
      { rail: "CARD", id: "psp_8815920471263904", sub: "Mastercard — 5100 (In-store POS)", amount: "+$860.00 USD", positive: true, fee: "$2.41", feeNote: "(IC++)", status: "Settled", when: "Just now" },
      { rail: "CARD", id: "psp_8815920471263877", sub: "iDEAL — ING (EUR)", amount: "+€325.00 EUR", positive: true, fee: "€0.29", feeNote: "(Flat)", status: "Pending", when: "4 min ago" },
      { rail: "REFUND", id: "psp_8815920471262110", sub: "Visa — 4111 (E-commerce)", amount: "-$75.00 USD", positive: false, fee: "$0.00", feeNote: "", status: "Settled", when: "33 min ago" },
    ],
    headline: "Every channel, one settlement report. Bring online, in-store, and mobile card volume into the same ledger.",
    paragraphs: [
      "Connect Adyen to reconcile settlement batches, interchange++ fees, and payment method mix across every sales channel. Each Adyen PSP reference becomes a ledger transaction with its fee breakdown attached.",
      "Refunds, chargebacks, and reserve holds are mirrored to your risk sub-ledger automatically, so finance teams close the month without exporting settlement CSVs.",
    ],
    features: [
      { title: "Omnichannel Acquiring", text: "Process card-present and card-not-present payments on one merchant account.", icon: "card", tone: "emerald" },
      { title: "Local Payment Methods", text: "Accept iDEAL, Bancontact, Pix, and 250+ local methods with automatic currency mapping.", icon: "bank", tone: "blue" },
      { title: "Settlement Reconciliation", text: "Match Adyen settlement batches to ledger entries with fee splits per transaction.", icon: "ledger", tone: "violet" },
      { title: "RevenueProtect Signals", text: "Ingest risk scores and block decisions into your fraud monitoring queue.", icon: "fraud", tone: "rose" },
      { title: "Notification Streaming", text: "Stream AUTHORISATION, CAPTURE, and REFUND notifications with HMAC verification.", icon: "stream", tone: "amber" },
    ],
    credentials: {
      alias: "Apex Global — Adyen Live EU",
      publishableLabel: "Client Key (Client-Safe)",
      publishableKey: "live_KX8R2WQ7NFGPJBZ4QUV3T6E5",
      secretLabel: "API Key (Web Service User)",
      secretFormat: "AQE...",
      secretKey: "AQEyhmfxK4LJahdFw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZiuFvBfVx",
      webhookSecret: "hmac_44AB09C2E1F7D3B58A6C0E9F1B2D3C4E",
    },
    ledger: { asset: SETTLEMENT_ASSETS[1], account: LEDGER_ACCOUNTS[0], schedule: SETTLEMENT_SCHEDULES[1] },
    webhooks: [
      { event: "AUTHORISATION", text: "Creates a pending ledger entry" },
      { event: "CAPTURE", text: "Moves the entry to settled" },
      { event: "REFUND", text: "Posts a reversal to the reserve sub-ledger" },
      { event: "CHARGEBACK", text: "Escalates to AML & Risk desk" },
    ],
    scopes: [
      { scope: "checkout:payments", text: "Create and capture payments across channels", status: "Mandatory" },
      { scope: "management:read", text: "Read merchant accounts, terminals, and stores", status: "Active" },
      { scope: "reports:settlement", text: "Download settlement and payment accounting reports", status: "Active" },
      { scope: "recurring:tokens", text: "Store and use shopper tokens for repeat payments", status: "Active" },
      { scope: "disputes:respond", text: "Submit defense documents for chargebacks", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 21 days ago", boundary: "Client-side Encryption" },
    region: {
      primary: "EU Amsterdam (Primary) & US Chicago Mirror",
      text: "Payment data is processed under GDPR with Adyen as an independent controller for card scheme data. DPA signed on January 18, 2025 with SCCs active.",
    },
  },
  {
    slug: "marqeta",
    name: "Marqeta",
    logo: "marqeta",
    tile: ["#2A2A2E", "#050506"],
    glyph: "M",
    summary: "Modern card issuing and tokenization platform for custom debit and prepaid programs.",
    title: "Marqeta Card Issuing",
    connectedByDefault: true,
    languages: "English, Spanish, Portuguese",
    pricing: { text: "Per active card plus interchange share", note: "(Issuing tier)" },
    actionRequired: "Marqeta program with Just-in-Time Funding configured",
    categories: ["Card Issuing", "Tokenization"],
    gateway: { label: "Marqeta JIT Gateway", listener: "prod_jit_MQ7c1", columns: ["Amount", "Interchange", "Cleared"] },
    feed: [
      { rail: "JIT", id: "txn_7d1c22e0-41b8", sub: "Debit ••3381 — Starbucks #1182", amount: "-$6.45 USD", positive: false, fee: "$0.11", feeNote: "(Interchange)", status: "Settled", when: "Just now" },
      { rail: "JIT", id: "txn_7d1c22e0-41a2", sub: "Prepaid ••0920 — Delta Air Lines", amount: "-$412.80 USD", positive: false, fee: "$7.01", feeNote: "(Interchange)", status: "Pending", when: "3 min ago" },
      { rail: "TOKEN", id: "dtk_0c19aa71-9b30", sub: "Apple Pay provisioning ••3381", amount: "$0.00 USD", positive: true, fee: "$0.00", feeNote: "", status: "Settled", when: "18 min ago" },
    ],
    headline: "Issue cards that spend straight from your ledger. Approve every authorization in real time against live balances.",
    paragraphs: [
      "Connect Marqeta to issue virtual and physical debit or prepaid cards on top of Fintech Connect accounts. Just-in-Time Funding requests are answered from your ledger, so card balances are never out of sync.",
      "Spend controls, merchant category limits, and digital wallet tokens are managed from one place, and every authorization, clearing, and reversal is posted automatically.",
    ],
    features: [
      { title: "Virtual & Physical Cards", text: "Issue cards instantly and ship branded physical cards to customers.", icon: "card", tone: "violet" },
      { title: "Just-in-Time Funding", text: "Approve or decline each authorization against the live ledger balance.", icon: "ledger", tone: "blue" },
      { title: "Spend Controls", text: "Set velocity limits and merchant category rules per card or program.", icon: "limits", tone: "amber" },
      { title: "Digital Wallet Tokens", text: "Provision cards to Apple Pay and Google Pay with lifecycle sync.", icon: "vault", tone: "emerald" },
      { title: "Authorization Streaming", text: "Stream authorization and clearing events to your event bus.", icon: "stream", tone: "sky" },
    ],
    credentials: {
      alias: "Apex Global — Marqeta Program 01",
      publishableLabel: "Application Token",
      publishableKey: "app_6b0f2c11-8f7e-4a3c-9d1b",
      secretLabel: "Admin Access Token",
      secretFormat: "UUID",
      secretKey: "adm_e2b74c90-1a5d-4f8e-b3c6-77d0a9e1f245",
      webhookSecret: "mqwh_51e9b0a7c3d24f8a9e6b1c0d2f3a",
    },
    ledger: { asset: SETTLEMENT_ASSETS[0], account: LEDGER_ACCOUNTS[2], schedule: SETTLEMENT_SCHEDULES[1] },
    webhooks: [
      { event: "transaction.authorization", text: "Holds funds on the card's ledger account" },
      { event: "transaction.authorization.clearing", text: "Settles the hold to a posted debit" },
      { event: "digitalwallettoken.transition", text: "Updates wallet token status" },
      { event: "card.transition", text: "Syncs card state (active, suspended, terminated)" },
    ],
    scopes: [
      { scope: "cards:issue", text: "Create, activate, and terminate cards", status: "Mandatory" },
      { scope: "jit:respond", text: "Answer Just-in-Time Funding requests", status: "Mandatory" },
      { scope: "velocity:manage", text: "Create and update spend controls", status: "Active" },
      { scope: "tokens:provision", text: "Provision digital wallet tokens", status: "Active" },
      { scope: "transactions:read", text: "Read authorization and clearing records", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 6 days ago", boundary: "PCI Proxy Display" },
    region: {
      primary: "US East (Marqeta Oakland DC) & US West Mirror",
      text: "Cardholder data is stored in Marqeta's PCI-DSS Level 1 environment. DPA signed on April 2, 2025.",
    },
  },
  {
    slug: "brex",
    name: "Brex",
    logo: "brex",
    tile: ["#FF7A45", "#E2410F"],
    glyph: "B",
    summary: "Sync corporate credit cards, auto-issue virtual employee cards, and track spend limits.",
    title: "Brex Corporate Cards & Spend",
    connectedByDefault: true,
    languages: "English",
    pricing: { text: "Included with your platform subscription", note: "(Standard BaaS tier)" },
    actionRequired: "Brex account admin with API token (Cards and Transactions scopes)",
    categories: ["Spend Management", "Corporate Cards"],
    gateway: { label: "Brex Spend Gateway", listener: "prod_wh_BX903", columns: ["Amount", "Cashback", "Posted"] },
    feed: [
      { rail: "CARD", id: "expense_cl9rq2k3", sub: "Virtual ••7712 — AWS Marketplace", amount: "-$1,980.00 USD", positive: false, fee: "$19.80", feeNote: "(1% back)", status: "Settled", when: "Just now" },
      { rail: "CARD", id: "expense_cl9rq0z8", sub: "Physical ••2290 — United Airlines", amount: "-$642.15 USD", positive: false, fee: "$6.42", feeNote: "(1% back)", status: "Pending", when: "9 min ago" },
      { rail: "LIMIT", id: "limit_ck81mm0a", sub: "Engineering budget — raised to $25k", amount: "$25,000.00 USD", positive: true, fee: "$0.00", feeNote: "", status: "Settled", when: "1 hr ago" },
    ],
    headline: "Corporate spend, reconciled as it happens. Bring card expenses and budgets into your ledger automatically.",
    paragraphs: [
      "Connect Brex to sync employee card transactions, receipts, and budgets into your Fintech Connect ledger. Expenses are categorised and matched to cost centres as they post.",
      "Issue virtual cards for vendors or new hires straight from Fintech Connect, with limits that follow your approval policies.",
    ],
    features: [
      { title: "Expense Sync", text: "Post card transactions with merchant, category, and receipt data.", icon: "ledger", tone: "amber" },
      { title: "Virtual Employee Cards", text: "Issue cards for vendors and new hires with one click.", icon: "card", tone: "blue" },
      { title: "Budget Limits", text: "Mirror Brex budgets and alert when teams reach their limit.", icon: "limits", tone: "violet" },
      { title: "Bill Pay", text: "Pay vendors via ACH or check and post remittances to the ledger.", icon: "payout", tone: "emerald" },
      { title: "Event Streaming", text: "Stream expense and card events to your event bus.", icon: "stream", tone: "sky" },
    ],
    credentials: {
      alias: "Apex Global — Brex Corporate",
      publishableLabel: "Client ID",
      publishableKey: "brex_client_0b7e6d2f91",
      secretLabel: "User Token (Admin)",
      secretFormat: "bxt_...",
      secretKey: "bxt_7XfQ2mLr0pZk9WvA1sDc3EeR5tYuIoPl",
      webhookSecret: "bxwh_a0c3e19d7f2b46e8b1c5d9e0f2a3",
    },
    ledger: { asset: SETTLEMENT_ASSETS[0], account: LEDGER_ACCOUNTS[1], schedule: SETTLEMENT_SCHEDULES[2] },
    webhooks: [
      { event: "EXPENSE_PAYMENT_UPDATED", text: "Posts card expense to the ledger" },
      { event: "TRANSFER_PROCESSED", text: "Records bill pay remittance" },
      { event: "USER_UPDATED", text: "Syncs cardholder profile" },
      { event: "REFERRAL_ACTIVATED", text: "Notifies the finance team" },
    ],
    scopes: [
      { scope: "expenses.card:readonly", text: "Read card expenses and receipts", status: "Mandatory" },
      { scope: "cards", text: "Create and lock virtual and physical cards", status: "Active" },
      { scope: "budgets", text: "Read and update budget limits", status: "Active" },
      { scope: "transfers", text: "Initiate vendor payments", status: "Active" },
      { scope: "users", text: "Read and invite employees", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 30 days ago", boundary: "Masked Card Numbers" },
    region: {
      primary: "US West (GCP us-west1) & US East Mirror",
      text: "Corporate spend data is processed under SOC-2 Type II controls. DPA signed on February 9, 2025.",
    },
  },
  {
    slug: "unit",
    name: "Unit",
    logo: "unit",
    tile: ["#2C3442", "#121820"],
    glyph: "U",
    summary: "Banking-as-a-Service APIs to create FDIC-insured checking, savings, and ledger accounts.",
    title: "Unit Banking-as-a-Service",
    connectedByDefault: true,
    languages: "English",
    pricing: { text: "Revenue share on interchange and deposits", note: "(Partner tier)" },
    actionRequired: "Unit org with a sponsor bank program and org API token",
    categories: ["Banking & Accounts", "Payments & Settlement"],
    gateway: { label: "Unit Banking Gateway", listener: "prod_wh_UN118", columns: ["Amount", "Program Fee", "Posted"] },
    feed: [
      { rail: "BOOK", id: "txn_4419920", sub: "Book transfer → Savings 3301", amount: "+$5,000.00 USD", positive: true, fee: "$0.00", feeNote: "", status: "Settled", when: "Just now" },
      { rail: "WIRE", id: "pmt_1188301", sub: "Outgoing wire — First Republic", amount: "-$48,000.00 USD", positive: false, fee: "$15.00", feeNote: "(Flat rail)", status: "In Transit", when: "12 min ago" },
      { rail: "ACH", id: "pmt_1188297", sub: "Payroll credit — Gusto", amount: "+$3,412.66 USD", positive: true, fee: "$0.10", feeNote: "(per item)", status: "Settled", when: "40 min ago" },
    ],
    headline: "FDIC-insured accounts behind your brand. Open deposit accounts and move money from the same ledger.",
    paragraphs: [
      "Connect Unit to open checking and savings accounts at Unit's partner banks for your customers. Account balances, holds, and statements stay mirrored in your Fintech Connect ledger.",
      "Book transfers, ACH, and wires post automatically, and interest accruals are written to each account daily.",
    ],
    features: [
      { title: "Deposit Accounts", text: "Open FDIC-insured checking and savings accounts in minutes.", icon: "bank", tone: "blue" },
      { title: "Money Movement", text: "Send ACH, wires, and instant book transfers between accounts.", icon: "payout", tone: "violet" },
      { title: "Debit Cards", text: "Issue debit cards tied to each deposit account.", icon: "card", tone: "emerald" },
      { title: "Statements & Interest", text: "Generate monthly statements and accrue interest automatically.", icon: "ledger", tone: "amber" },
      { title: "Onboarding & KYC", text: "Submit applications and receive KYC decisions in real time.", icon: "identity", tone: "sky" },
    ],
    credentials: {
      alias: "Apex Global — Unit Production",
      publishableLabel: "Org ID",
      publishableKey: "org_4471",
      secretLabel: "Org API Token",
      secretFormat: "JWT",
      secretKey: "v2.public.eyJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiIxMTg4In0",
      webhookSecret: "unwh_63d2a0f1b8c94e7d0a1b2c3d4e5f",
    },
    ledger: { asset: SETTLEMENT_ASSETS[0], account: LEDGER_ACCOUNTS[0], schedule: SETTLEMENT_SCHEDULES[0] },
    webhooks: [
      { event: "transaction.created", text: "Posts the transaction to the ledger" },
      { event: "payment.returned", text: "Reverses the payment and notifies the customer" },
      { event: "application.approved", text: "Opens the deposit account" },
      { event: "account.frozen", text: "Escalates to AML & Risk desk" },
    ],
    scopes: [
      { scope: "accounts", text: "Open, close, and freeze deposit accounts", status: "Mandatory" },
      { scope: "payments-write", text: "Originate ACH, wire, and book payments", status: "Active" },
      { scope: "cards-write", text: "Issue and manage debit cards", status: "Active" },
      { scope: "applications", text: "Submit customer applications", status: "Active" },
      { scope: "statements", text: "Read account statements", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 11 days ago", boundary: "Sponsor Bank Ledger" },
    region: {
      primary: "US East (AWS us-east-1) & US East-2 Mirror",
      text: "Deposit data is held under sponsor bank oversight with FDIC pass-through insurance records. DPA signed on June 4, 2025.",
    },
  },
  {
    slug: "alloy",
    name: "Alloy",
    logo: "alloy",
    tile: ["#FF8A3D", "#F25C05"],
    glyph: "A",
    summary: "Identity verification, automated KYC/AML onboarding checks, and real-time fraud scoring.",
    title: "Alloy Identity & Risk Decisioning",
    connectedByDefault: true,
    languages: "English, Spanish",
    pricing: { text: "Per evaluation", note: "(Volume pricing)" },
    actionRequired: "Alloy workflow token and secret for each onboarding journey",
    categories: ["Identity & KYC", "Fraud Monitoring"],
    gateway: { label: "Alloy Decision Gateway", listener: "prod_wh_AL221", columns: ["Risk Score", "Evaluation Fee", "Decided"] },
    feed: [
      { rail: "KYC", id: "EV-7KQ2P9XN1W", sub: "Consumer onboarding — Approved", amount: "Score 12", positive: true, fee: "$1.40", feeNote: "(per eval)", status: "Settled", when: "Just now" },
      { rail: "KYB", id: "EV-7KQ2P9XM8C", sub: "Business onboarding — Manual review", amount: "Score 58", positive: false, fee: "$3.10", feeNote: "(per eval)", status: "Pending", when: "7 min ago" },
      { rail: "TXN", id: "EV-7KQ2P9XL0A", sub: "Transaction monitoring — Denied", amount: "Score 91", positive: false, fee: "$0.08", feeNote: "(per eval)", status: "Failed", when: "25 min ago" },
    ],
    headline: "Onboard good customers faster. Run KYC, KYB, and fraud checks from one decision engine.",
    paragraphs: [
      "Connect Alloy to run identity verification and risk decisioning on every application and transaction. Decisions and evidence are attached to the customer's profile in Fintech Connect.",
      "Manual review cases open in your compliance queue automatically, and ongoing monitoring alerts are posted to the fraud desk.",
    ],
    features: [
      { title: "Identity Verification", text: "Verify name, address, SSN, and documents against 200+ data sources.", icon: "identity", tone: "amber" },
      { title: "Business Verification", text: "Verify businesses and beneficial owners for KYB.", icon: "bank", tone: "blue" },
      { title: "Fraud Scoring", text: "Score applications and transactions in real time.", icon: "fraud", tone: "rose" },
      { title: "Case Management", text: "Route manual reviews to your compliance team.", icon: "dispute", tone: "violet" },
      { title: "Ongoing Monitoring", text: "Re-screen customers for sanctions and watchlist changes.", icon: "stream", tone: "emerald" },
    ],
    credentials: {
      alias: "Apex Global — Alloy Onboarding",
      publishableLabel: "Workflow Token",
      publishableKey: "wf_tok_3J9xR2LmQ8vN",
      secretLabel: "Workflow Secret",
      secretFormat: "Base64",
      secretKey: "c2VjcmV0X2FsbG95X3dvcmtmbG93X2tleV92YXVsdA==",
      webhookSecret: "alwh_9e1b0c2d3f4a5b6c7d8e9f0a1b2c",
    },
    ledger: { asset: SETTLEMENT_ASSETS[0], account: LEDGER_ACCOUNTS[1], schedule: SETTLEMENT_SCHEDULES[2] },
    webhooks: [
      { event: "evaluation.completed", text: "Attaches the decision to the customer profile" },
      { event: "case.created", text: "Opens a manual review in the compliance queue" },
      { event: "monitoring.alert", text: "Escalates to AML & Risk desk" },
      { event: "document.verified", text: "Marks the document as verified" },
    ],
    scopes: [
      { scope: "evaluations:write", text: "Submit applications for evaluation", status: "Mandatory" },
      { scope: "entities:read", text: "Read customer and business entities", status: "Active" },
      { scope: "cases:manage", text: "Create and resolve review cases", status: "Active" },
      { scope: "documents:upload", text: "Upload identity documents", status: "Active" },
      { scope: "monitoring:subscribe", text: "Receive ongoing monitoring alerts", status: "Active" },
    ],
    encryption: { transport: "TLS_AES_256_GCM_SHA384", hsm: "Rotated 3 days ago", boundary: "Tokenized PII" },
    region: {
      primary: "US East (AWS us-east-1) & US West Mirror",
      text: "Personal data is processed under GLBA and CCPA with field-level encryption for SSNs. DPA signed on August 22, 2025.",
    },
  },
];

export function findConnector(slug: string): Connector | undefined {
  return CONNECTORS.find((c) => c.slug === slug);
}

/* ------------------------- Saved configuration ------------------------- */

export type ConnectorConfig = {
  environment: "sandbox" | "production";
  streaming: boolean;
  alias: string;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  asset: string;
  account: string;
  schedule: string;
  quarantineDisputes: boolean;
  webhooks: (WebhookEvent & { subscribed: boolean; custom?: boolean })[];
};

export function defaultConfig(c: Connector): ConnectorConfig {
  return {
    environment: "sandbox",
    streaming: true,
    alias: c.credentials.alias,
    publishableKey: c.credentials.publishableKey,
    secretKey: c.credentials.secretKey,
    webhookSecret: c.credentials.webhookSecret,
    asset: c.ledger.asset,
    account: c.ledger.account,
    schedule: c.ledger.schedule,
    quarantineDisputes: true,
    webhooks: c.webhooks.map((w) => ({ ...w, subscribed: true })),
  };
}
