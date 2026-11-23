/* ------------------------------------------------------------------ */
/*  Integrator catalogue for /userdashboard/integrators                 */
/* ------------------------------------------------------------------ */

export type IntegratorLogo =
  | "slack"
  | "dropbox"
  | "mailchimp"
  | "hubspot"
  | "google-analytics"
  | "asana"
  | "salesforce"
  | "trello"
  | "zendesk"
  | "notion"
  | "github"
  | "zoom"
  | "google-drive"
  | "intercom";

export type IntegratorOption = { id: string; label: string; description: string; defaultOn: boolean };

export type Integrator = {
  slug: string;
  name: string;
  logo: IntegratorLogo;
  description: string;
  category: string;
  /** Example workspace/account shown once connected. */
  account: string;
  connectedByDefault: boolean;
  options: IntegratorOption[];
};

export const SYNC_FREQUENCIES = ["Real-time", "Every 15 minutes", "Hourly", "Daily"] as const;
export type SyncFrequency = (typeof SYNC_FREQUENCIES)[number];

export const INTEGRATORS: Integrator[] = [
  {
    slug: "slack",
    name: "Slack",
    logo: "slack",
    description: "Get real-time notifications and updates directly in your workspace.",
    category: "Communication",
    account: "apex-global.slack.com",
    connectedByDefault: true,
    options: [
      { id: "alerts", label: "Transaction alerts", description: "Post large or flagged transactions to #finance-alerts.", defaultOn: true },
      { id: "approvals", label: "Approval requests", description: "Send approval requests to the approver's DMs.", defaultOn: true },
      { id: "digest", label: "Daily digest", description: "A summary of balances and activity every morning.", defaultOn: false },
    ],
  },
  {
    slug: "dropbox",
    name: "Dropbox",
    logo: "dropbox",
    description: "Store, share, and access your files securely from the cloud.",
    category: "File Storage",
    account: "Apex Global Team Space",
    connectedByDefault: false,
    options: [
      { id: "statements", label: "Back up statements", description: "Save monthly statements to /Finance/Statements.", defaultOn: true },
      { id: "kyc", label: "Store KYC documents", description: "Archive verified KYC documents to a restricted folder.", defaultOn: false },
      { id: "exports", label: "Report exports", description: "Copy scheduled report exports to Dropbox.", defaultOn: true },
    ],
  },
  {
    slug: "mailchimp",
    name: "Mailchimp",
    logo: "mailchimp",
    description: "Manage and automate your email marketing campaigns effortlessly.",
    category: "Marketing",
    account: "Apex Global Audience",
    connectedByDefault: false,
    options: [
      { id: "sync-customers", label: "Sync new customers", description: "Add customers who opt in to your main audience.", defaultOn: true },
      { id: "tags", label: "Tag by product", description: "Tag contacts with the products they use.", defaultOn: true },
      { id: "unsubscribe", label: "Respect unsubscribes", description: "Mirror Mailchimp unsubscribes to customer preferences.", defaultOn: true },
    ],
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    logo: "hubspot",
    description: "Centralize your marketing, sales, and customer service efforts.",
    category: "CRM",
    account: "Apex Global (Portal 44120983)",
    connectedByDefault: false,
    options: [
      { id: "contacts", label: "Sync contacts", description: "Keep customer profiles and HubSpot contacts in sync.", defaultOn: true },
      { id: "deals", label: "Create deals", description: "Open a deal when a business account applies.", defaultOn: false },
      { id: "tickets", label: "Support tickets", description: "Link HubSpot tickets to customer timelines.", defaultOn: true },
    ],
  },
  {
    slug: "google-analytics",
    name: "Google analytics",
    logo: "google-analytics",
    description: "Track and analyze your website traffic and user behavior.",
    category: "Analytics",
    account: "Apex Global — GA4 Property",
    connectedByDefault: false,
    options: [
      { id: "conversions", label: "Send conversion events", description: "Track account opening and first deposit as conversions.", defaultOn: true },
      { id: "funnels", label: "Onboarding funnel", description: "Report each onboarding step as an event.", defaultOn: true },
      { id: "anonymize", label: "Anonymize IPs", description: "Strip IP addresses before sending events.", defaultOn: true },
    ],
  },
  {
    slug: "asana",
    name: "Asana",
    logo: "asana",
    description: "Coordinate team tasks and track project progress in real-time.",
    category: "Project Management",
    account: "Apex Global — Operations",
    connectedByDefault: true,
    options: [
      { id: "disputes", label: "Dispute tasks", description: "Create a task for every new dispute.", defaultOn: true },
      { id: "reviews", label: "Compliance reviews", description: "Create tasks for manual KYC reviews.", defaultOn: true },
      { id: "complete", label: "Close on resolve", description: "Complete the task when the case is resolved.", defaultOn: false },
    ],
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    logo: "salesforce",
    description: "Sync customer data and manage your sales pipeline seamlessly.",
    category: "CRM",
    account: "apex-global.my.salesforce.com",
    connectedByDefault: false,
    options: [
      { id: "accounts", label: "Sync accounts", description: "Mirror business customers as Salesforce accounts.", defaultOn: true },
      { id: "opportunities", label: "Opportunities", description: "Create opportunities from product applications.", defaultOn: false },
      { id: "activity", label: "Activity timeline", description: "Log key account events on the Salesforce record.", defaultOn: true },
    ],
  },
  {
    slug: "trello",
    name: "Trello",
    logo: "trello",
    description: "Organize and manage your projects with Trello boards and cards.",
    category: "Project Management",
    account: "Apex Launch Board",
    connectedByDefault: false,
    options: [
      { id: "cards", label: "Create cards", description: "Add a card when an approval request is raised.", defaultOn: true },
      { id: "move", label: "Move on approval", description: "Move cards to Done when requests are approved.", defaultOn: true },
      { id: "comments", label: "Sync comments", description: "Copy request comments to the card.", defaultOn: false },
    ],
  },
  {
    slug: "zendesk",
    name: "Zendesk",
    logo: "zendesk",
    description: "Handle customer support tickets and improve service quality.",
    category: "Customer Support",
    account: "apexglobal.zendesk.com",
    connectedByDefault: false,
    options: [
      { id: "profile", label: "Customer sidebar", description: "Show balances and recent activity next to tickets.", defaultOn: true },
      { id: "card-freeze", label: "Card actions", description: "Let agents freeze cards from a ticket.", defaultOn: false },
      { id: "csat", label: "CSAT reporting", description: "Import satisfaction scores into analytics.", defaultOn: true },
    ],
  },
  {
    slug: "notion",
    name: "Notion",
    logo: "notion",
    description: "Keep runbooks, policies, and launch docs linked to your workspace.",
    category: "Documentation",
    account: "Apex Global Wiki",
    connectedByDefault: true,
    options: [
      { id: "policies", label: "Link policies", description: "Show linked policy pages on compliance screens.", defaultOn: true },
      { id: "changelog", label: "Release notes", description: "Publish product release notes to a Notion database.", defaultOn: false },
      { id: "search", label: "Search from dashboard", description: "Include Notion pages in dashboard search.", defaultOn: true },
    ],
  },
  {
    slug: "github",
    name: "GitHub",
    logo: "github",
    description: "Connect repositories to track deployments and webhook changes.",
    category: "Developer Tools",
    account: "apex-global (organization)",
    connectedByDefault: true,
    options: [
      { id: "deploys", label: "Deployment tracking", description: "Show production deploys on the audit log.", defaultOn: true },
      { id: "secrets", label: "Secret scanning alerts", description: "Alert when API keys are found in a repository.", defaultOn: true },
      { id: "issues", label: "Create issues", description: "Open an issue when a webhook endpoint fails.", defaultOn: false },
    ],
  },
  {
    slug: "zoom",
    name: "Zoom",
    logo: "zoom",
    description: "Schedule customer calls and verification meetings in one click.",
    category: "Communication",
    account: "Apex Global (Pro)",
    connectedByDefault: false,
    options: [
      { id: "kyc-calls", label: "Video KYC calls", description: "Schedule video verification for high-risk applicants.", defaultOn: true },
      { id: "record", label: "Record calls", description: "Store recordings with the customer's case.", defaultOn: false },
      { id: "reminders", label: "Email reminders", description: "Remind customers 15 minutes before a call.", defaultOn: true },
    ],
  },
  {
    slug: "google-drive",
    name: "Google Drive",
    logo: "google-drive",
    description: "Save statements, exports, and reports to shared drives automatically.",
    category: "File Storage",
    account: "Apex Global Shared Drive",
    connectedByDefault: true,
    options: [
      { id: "reports", label: "Report exports", description: "Save scheduled reports to the Finance shared drive.", defaultOn: true },
      { id: "sheets", label: "Live Sheets", description: "Keep a Google Sheet of daily balances up to date.", defaultOn: false },
      { id: "statements", label: "Back up statements", description: "Copy monthly statements to Drive.", defaultOn: true },
    ],
  },
  {
    slug: "intercom",
    name: "Intercom",
    logo: "intercom",
    description: "Chat with customers in-app and route conversations to the right team.",
    category: "Customer Support",
    account: "Apex Global Messenger",
    connectedByDefault: false,
    options: [
      { id: "identity", label: "Identify customers", description: "Pass verified customer IDs to the messenger.", defaultOn: true },
      { id: "routing", label: "Route by product", description: "Send conversations to the team for each product.", defaultOn: true },
      { id: "bots", label: "Balance bot", description: "Let customers ask for their balance in chat.", defaultOn: false },
    ],
  },
];

export function findIntegrator(slug: string) {
  return INTEGRATORS.find((i) => i.slug === slug);
}

export type IntegratorSettings = {
  frequency: SyncFrequency;
  options: Record<string, boolean>;
};

export function defaultSettings(integrator: Integrator): IntegratorSettings {
  return {
    frequency: "Real-time",
    options: Object.fromEntries(integrator.options.map((o) => [o.id, o.defaultOn])),
  };
}
