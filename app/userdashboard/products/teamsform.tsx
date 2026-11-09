"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  KeyRound,
  Lock,
  Mail,
  Search,
  Send,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */

export type CollaboratorRole =
  | "Compliance & Risk Auditor"
  | "White-label Studio Designer"
  | "Senior Core Banking Engineer"
  | "Treasury & Settlement Operations"
  | "Staff Security Engineer";

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  title: string;
  initials: string;
  avatarClass: string;
  isOwner?: boolean;
  isYou?: boolean;
  isPending?: boolean;
  role?: CollaboratorRole;
};

export type TeamMemberOption = {
  id: string;
  name: string;
  email: string;
  title: string;
  initials: string;
  avatarClass: string;
  department: "Engineering" | "Design" | "Operations" | "Compliance";
};

export type TeamsFormData = {
  collaborators: Collaborator[];
  pendingInvites: Collaborator[];
};

/* ─────────────────────── Static data ─────────────────────── */

const ROLE_OPTIONS: CollaboratorRole[] = [
  "Compliance & Risk Auditor",
  "White-label Studio Designer",
  "Senior Core Banking Engineer",
  "Treasury & Settlement Operations",
  "Staff Security Engineer",
];

const ROLE_DESCRIPTIONS: Record<CollaboratorRole, string> = {
  "Compliance & Risk Auditor":
    "Read-only access to ledger audit logs, KYC screening queues, and compliance reports.",
  "White-label Studio Designer":
    "Access to theme tokens, UI components and the design canvas.",
  "Senior Core Banking Engineer":
    "Access to API keys, sandbox ledgers and deployment pipelines.",
  "Treasury & Settlement Operations":
    "Access to balances, FX pools, and settlement schedules.",
  "Staff Security Engineer":
    "Access to IAM, key rotation and audit infrastructure.",
};

/**
 * Only the current user (owner) is seeded. Other collaborators are added
 * explicitly through the team picker or email invite flow.
 */
const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: "owner",
    name: "Marcus Vance",
    email: "marcus.v@apexfinance.io",
    title: "Project Owner · Moderator",
    initials: "MV",
    avatarClass: "bg-blue-600",
    isOwner: true,
    isYou: true,
  },
];

const DEFAULT_PENDING: Collaborator[] = [];

/**
 * Empty by default. In production this would be hydrated from the current
 * organization's member directory. With an empty list the picker shows a
 * helpful empty state that points to the email invite flow.
 */
const TEAM_LIBRARY: TeamMemberOption[] = [];

const DEPARTMENTS = ["All", "Engineering", "Design", "Operations", "Compliance"] as const;
type DepartmentFilter = (typeof DEPARTMENTS)[number];

/* ────────────────────────── Helpers ────────────────────────── */

function Avatar({ initials, avatarClass }: { initials: string; avatarClass: string }) {
  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${avatarClass}`}
    >
      {initials}
    </div>
  );
}

function RoleDropdown({
  value,
  onChange,
}: {
  value: CollaboratorRole;
  onChange: (v: CollaboratorRole) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
        <span className="whitespace-nowrap">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange(role);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
                  role === value
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700"
                }`}
              >
                <ShieldCheck
                  className={`h-3.5 w-3.5 ${
                    role === value ? "text-blue-600" : "text-slate-400"
                  }`}
                />
                {role}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────── Sidebar · Add team members ─────────────────── */

function AddTeamMembersSidebar({
  currentIds,
  onClose,
  onAdd,
  onSwitchToInvite,
}: {
  currentIds: Set<string>;
  onClose: () => void;
  onAdd: (ids: string[]) => void;
  onSwitchToInvite: () => void;
}) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<DepartmentFilter>("All");
  const [checked, setChecked] = useState<Set<string>>(() => new Set());

  const isOnTeam = (id: string) => currentIds.has(id);
  const libraryEmpty = TEAM_LIBRARY.length === 0;

  const filtered = useMemo(
    () =>
      TEAM_LIBRARY.filter((m) => {
        if (dept !== "All" && m.department !== dept) return false;
        if (
          search &&
          !`${m.name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [dept, search],
  );

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const counts = useMemo<Record<DepartmentFilter, number>>(() => {
    return DEPARTMENTS.reduce((acc, d) => {
      acc[d] =
        d === "All"
          ? TEAM_LIBRARY.length
          : TEAM_LIBRARY.filter((m) => m.department === d).length;
      return acc;
    }, {} as Record<DepartmentFilter, number>);
  }, []);

  const selectedCount = checked.size;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-900/30" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Add team members"
        className="flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between px-6 pb-4 pt-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add team members</h2>
            <p className="mt-1 text-xs text-slate-500">
              Choose people from your organization to collaborate on this project.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {libraryEmpty ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-50 text-slate-400">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No team members to add yet.
            </p>
            <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-slate-400">
              Your organization doesn't have any other members in this
              workspace. You can still invite external collaborators by
              email.
            </p>
            <button
              type="button"
              onClick={onSwitchToInvite}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Invite by email <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 pb-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team members..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 px-6 pb-3">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDept(d)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    dept === d
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {d} ({counts[d]})
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6">
              <div className="space-y-1.5 py-3">
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-xs text-slate-400">
                    No team members match your search.
                  </p>
                )}
                {filtered.map((m) => {
                  const isChecked = checked.has(m.id);
                  const onTeam = isOnTeam(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggle(m.id)}
                      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${
                        isChecked ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <Avatar initials={m.initials} avatarClass={m.avatarClass} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-slate-900">
                            {m.name}
                          </span>
                          {onTeam && (
                            <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                              On team
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-slate-500">
                          {m.email} · {m.title}
                        </p>
                      </div>
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                          isChecked
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {selectedCount} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onAdd(Array.from(checked))}
              disabled={selectedCount === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add {selectedCount} members
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─────────────────── Sidebar · Invite by email ─────────────────── */

function InviteByEmailSidebar({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (email: string, role: CollaboratorRole, message: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CollaboratorRole>("Compliance & Risk Auditor");
  const [message, setMessage] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-900/30" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Invite someone"
        className="flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between px-6 pb-4 pt-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Invite someone</h2>
            <p className="mt-1 text-xs text-slate-500">
              Give an external collaborator access to this project.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-4">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-500">
              <KeyRound className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
              External collaborators outside this project will receive a secure token.
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Project role
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen((o) => !o)}
                className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left"
              >
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <span className="flex-1 text-sm font-medium text-slate-800">{role}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {roleOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setRoleOpen(false)} />
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    {ROLE_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setRoleOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
                          r === role
                            ? "bg-blue-50 font-semibold text-blue-700"
                            : "text-slate-700"
                        }`}
                      >
                        <ShieldCheck
                          className={`h-3.5 w-3.5 ${
                            r === role ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>

          {/* Message */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Personal message (optional)
              </label>
              <span className="text-[10px] text-slate-400">Max 300 chars</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 300))}
              rows={4}
              placeholder="Add a note to the invitation..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
              <Info className="h-3 w-3" />
            </div>
            <p className="text-[11px] leading-relaxed text-blue-800">
              They'll receive an email invitation and will need to accept it before
              accessing the project.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(email, role, message)}
            disabled={!emailValid}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" /> Send Invitation
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ──────────────────────── Main component ──────────────────────── */

export default function TeamsForm({
  onBack,
  onComplete,
  initialCollaborators,
  initialPending,
}: {
  onBack: () => void;
  onComplete: (data: TeamsFormData) => void;
  initialCollaborators?: Collaborator[];
  initialPending?: Collaborator[];
}) {
  /**
   * Always seed at least the owner row — this keeps the "Owner (Root)"
   * affordance visible even if a previously saved project persisted an
   * empty collaborators array (e.g. via "Proceed as sole moderator").
   */
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const base = initialCollaborators ?? DEFAULT_COLLABORATORS;
    if (base.some((c) => c.isOwner)) return base;
    const owner = DEFAULT_COLLABORATORS.find((c) => c.isOwner)!;
    return [owner, ...base];
  });
  const [pending, setPending] = useState<Collaborator[]>(
    initialPending ?? DEFAULT_PENDING,
  );
  const [sidebar, setSidebar] = useState<"none" | "team-picker" | "email-invite">(
    "none",
  );

  const currentIds = useMemo(
    () => new Set(collaborators.map((c) => c.id)),
    [collaborators],
  );
  const nonOwnerCount = useMemo(
    () => collaborators.filter((c) => !c.isOwner).length,
    [collaborators],
  );

  const isCompletelyEmpty = nonOwnerCount === 0 && pending.length === 0;

  /* ── handlers ── */
  const changeRole = (id: string, role: CollaboratorRole) =>
    setCollaborators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, role } : c)),
    );

  const removeCollaborator = (id: string) =>
    setCollaborators((prev) => prev.filter((c) => c.id !== id));

  const removePending = (id: string) =>
    setPending((prev) => prev.filter((c) => c.id !== id));

  const addTeamMembers = (ids: string[]) => {
    const additions: Collaborator[] = TEAM_LIBRARY.filter(
      (m) => ids.includes(m.id) && !currentIds.has(m.id),
    ).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      title: m.title,
      initials: m.initials,
      avatarClass: m.avatarClass,
      role: "Senior Core Banking Engineer",
    }));
    if (additions.length > 0) {
      setCollaborators((prev) => [...prev, ...additions]);
    }
    setSidebar("none");
  };

  const sendInvite = (email: string, role: CollaboratorRole, message: string) => {
    const localPart = email.split("@")[0] ?? "invitee";
    const initials = localPart.slice(0, 2).toUpperCase();
    const invite: Collaborator = {
      id: `pending-${Date.now()}`,
      name: email,
      email,
      title: ROLE_DESCRIPTIONS[role].split(".")[0],
      initials,
      avatarClass: "bg-slate-200 !text-slate-600",
      isPending: true,
      role,
    };
    setPending((prev) => [...prev, invite]);
    setSidebar("none");
    // `message` is available if you want to persist it alongside the invite.
    void message;
  };

  /** Keeps the owner row when the user chooses to proceed alone. */
  const proceedAsSoleModerator = () => {
    onComplete({
      collaborators: collaborators.filter((c) => c.isOwner),
      pendingInvites: [],
    });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl flex-col pb-12">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <span className="cursor-pointer hover:text-slate-700" onClick={onBack}>
            Overview
          </span>
          <span>/</span>
          <span className="font-semibold text-blue-600">
            Governance &amp; Access Controls
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Who's working on this project?
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          You're the project moderator. You can continue on your own or give
          teammates access now. You can always add people later.
        </p>
      </div>

      {/* Collaborators card */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Project collaborators
              </h2>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                {collaborators.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Define multi-tenant permissions and ledger signing capabilities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebar("team-picker")}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add from your team
            </button>
            <button
              onClick={() => setSidebar("email-invite")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Mail className="h-3.5 w-3.5" /> Invite by email
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Owner first */}
          {collaborators
            .filter((c) => c.isOwner)
            .map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar initials={c.initials} avatarClass={c.avatarClass} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {c.name}
                    </span>
                    {c.isYou && (
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                        You
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-slate-500">
                    {c.email} · {c.title}
                  </p>
                </div>
                <span className="hidden items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 sm:flex">
                  <Lock className="h-3 w-3" /> Owner (Root)
                </span>
                <button
                  disabled
                  aria-label="Owner cannot be removed"
                  className="grid h-7 w-7 cursor-not-allowed place-items-center rounded-md text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

          {/* Non-owner collaborators */}
          {collaborators
            .filter((c) => !c.isOwner)
            .map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar initials={c.initials} avatarClass={c.avatarClass} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {c.name}
                    </span>
                    {c.isYou && (
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                        You
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-slate-500">
                    {c.email} · {c.title}
                  </p>
                </div>
                {c.role && (
                  <RoleDropdown
                    value={c.role}
                    onChange={(r) => changeRole(c.id, r)}
                  />
                )}
                <button
                  onClick={() => removeCollaborator(c.id)}
                  aria-label={`Remove ${c.name}`}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

          {/* Pending invites */}
          {pending.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar initials={p.initials} avatarClass={p.avatarClass} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-slate-900">
                    {p.email}
                  </span>
                  <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700 ring-1 ring-amber-200">
                    Pending Invite
                  </span>
                </div>
                <p className="truncate text-[11px] text-slate-500">{p.title}</p>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:underline">
                Resend Link
              </button>
              <button
                onClick={() => removePending(p.id)}
                aria-label={`Remove pending invite ${p.email}`}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Empty state — matches the mockup */}
          {isCompletelyEmpty && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-50 text-slate-400">
                <UserPlus className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No additional collaborators yet.
              </p>
              <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-slate-400">
                You have full root authority to complete provisioning
                independently.
              </p>
              <button
                type="button"
                onClick={() => setSidebar("team-picker")}
                className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                + Add a collaborator
              </button>
            </div>
          )}
        </div>

        {/* Bottom "add another person" — hidden when the empty state is shown */}
        {!isCompletelyEmpty && (
          <div className="border-t border-slate-100 px-5 py-3">
            <button
              onClick={() => setSidebar("team-picker")}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              + Add another person
            </button>
          </div>
        )}
      </div>

      {/* Audit trail */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            RBAC Audit Trail Active{" "}
            <span className="ml-1 font-mono text-[10px] font-normal text-slate-400">
              #84920
            </span>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Members will receive workspace invitations immediately upon project
            initialization.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Configuration
        </button>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
  onClick={proceedAsSoleModerator}
  className="flex-1 whitespace-nowrap rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 sm:flex-none"
>
  Proceed as sole moderator
</button>
          <button
            onClick={() => onComplete({ collaborators, pendingInvites: pending })}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:flex-none"
          >
            Initialize Project
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sidebars */}
      {sidebar === "team-picker" && (
        <AddTeamMembersSidebar
          currentIds={currentIds}
          onClose={() => setSidebar("none")}
          onAdd={addTeamMembers}
          onSwitchToInvite={() => setSidebar("email-invite")}
        />
      )}
      {sidebar === "email-invite" && (
        <InviteByEmailSidebar
          onClose={() => setSidebar("none")}
          onSend={sendInvite}
        />
      )}
    </div>
  );
}