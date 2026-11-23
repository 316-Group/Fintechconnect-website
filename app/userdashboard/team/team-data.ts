import { Building2, ClipboardCheck, Landmark, Palette, Server, ShieldCheck, type LucideIcon } from "lucide-react";

/* Roles a team member can hold, and the sample team shown before anything is saved. */

export type RoleId = "moderator" | "project-admin" | "banking-architect" | "studio-designer" | "infrastructure-engineer" | "compliance-auditor";

export type Role = {
  id: RoleId;
  name: string;
  icon: LucideIcon;
  /** What the role can access, shown in "Roles & permissions". */
  description: string;
  /** A one-line summary, shown under the role picker and on a member's assigned role. */
  summary: string;
  /** The workspace a member with this role works in. */
  workspace: string;
};

export const ROLES: Role[] = [
  {
    id: "moderator",
    name: "Moderator",
    icon: ShieldCheck,
    description:
      "Full platform and workspace access. Can manage members, permissions, project settings and all available product capabilities.",
    summary: "Full access to every workspace and product, including members, permissions and project settings.",
    workspace: "Apex Platform",
  },
  {
    id: "project-admin",
    name: "Project Admin",
    icon: Building2,
    description: "Manages project configuration, team access, product setup and workspace administration.",
    summary: "Can configure projects and products, invite members and administer the workspace.",
    workspace: "Apex Platform",
  },
  {
    id: "banking-architect",
    name: "Banking & Ledger Architect",
    icon: Landmark,
    description:
      "Designs and configures banking products, accounts, wallets, payment rails, cards, treasury and ledger infrastructure.",
    summary: "Can build and configure accounts, wallets, cards, payment rails, treasury and the ledger.",
    workspace: "Apex Core Banking",
  },
  {
    id: "studio-designer",
    name: "White-label Studio Designer",
    icon: Palette,
    description:
      "Works on the visual application experience, including the whiteboard, pages, components, themes, assets, layouts and prototypes.",
    summary: "Can design and customise the visual experience of your financial products, manage components, tokens and prototypes.",
    workspace: "Apex UI Core",
  },
  {
    id: "infrastructure-engineer",
    name: "Infrastructure Engineer",
    icon: Server,
    description: "Works with APIs, integrations, webhooks, code, workflows and technical infrastructure configuration.",
    summary: "Can manage API keys, integrations, webhooks, workflows and infrastructure settings.",
    workspace: "Apex Infrastructure",
  },
  {
    id: "compliance-auditor",
    name: "Compliance & Risk Auditor",
    icon: ClipboardCheck,
    description: "Reviews compliance, KYC, fraud monitoring, audit records and risk configurations with controlled access.",
    summary: "Read-only access to ledger audit logs, KYC screening queues, and compliance reports.",
    workspace: "Apex Risk Office",
  },
];

export function findRole(id: RoleId): Role {
  return ROLES.find((role) => role.id === id) ?? ROLES[ROLES.length - 1];
}

export type MemberStatus = "active" | "invited" | "suspended";

export const STATUSES: { id: MemberStatus; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "invited", label: "Invited" },
  { id: "suspended", label: "Suspended" },
];

export type Member = {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  status: MemberStatus;
  /** When they were added (or invited), in ms. */
  addedAt: number;
  /** The id of the member who invited them. */
  invitedBy?: string;
  /** The note sent with their invitation. */
  message?: string;
  /** Avatar colour, an index into AVATAR_COLORS. */
  color: number;
};

/** Avatar colours: [background, text]. */
export const AVATAR_COLORS: [string, string][] = [
  ["#0040DF", "#FFFFFF"],
  ["#E3E6F7", "#1E293B"],
  ["#6D3FD1", "#FFFFFF"],
  ["#2563EB", "#FFFFFF"],
  ["#DDE4FB", "#1E293B"],
  ["#0F766E", "#FFFFFF"],
];

/** The signed-in user: they send invitations from this page. */
export const CURRENT_MEMBER_ID = "marcus-vance";

const day = 24 * 60 * 60 * 1000;
const date = (iso: string) => Date.parse(`${iso}T09:00:00Z`);

export const SEED_MEMBERS: Member[] = [
  { id: "marcus-vance", name: "Marcus Vance", email: "marcus@apexfinance.io", role: "moderator", status: "active", addedAt: date("2024-03-02"), color: 0 },
  { id: "elena-rostova", name: "Elena Rostova", email: "elena@apexfinance.io", role: "compliance-auditor", status: "active", addedAt: date("2024-06-18"), invitedBy: "marcus-vance", color: 1 },
];

/* ------------------------------- Helpers -------------------------------- */

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

/** "david.miller@fintech.gov" → "David Miller". */
export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const words = local.split(/[._\-+]+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** "5 months ago", "today", … */
export function timeAgo(ms: number, now = Date.now()) {
  const days = Math.floor((now - ms) / day);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export const MESSAGE_LIMIT = 300;
