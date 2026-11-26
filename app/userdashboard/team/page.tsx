"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Ellipsis, Info, Plus, Search, TriangleAlert, UserPlus, Users, X } from "lucide-react";
import { ROLES, STATUSES, firstName, type Member, type MemberStatus, type RoleId } from "./team-data";
import { inviteMember, removeMember, updateMember, useTeamMembers } from "./team-store";
import { Avatar, Drawer, DrawerHeader, RolePill, StatusPill } from "./team-ui";
import { InvitePanel } from "./InvitePanel";
import { MemberPanel } from "./MemberPanel";

type Notice = { text: string; tone: "success" | "error"; undo?: () => void };
type Panel = { kind: "invite" } | { kind: "roles" } | { kind: "member"; id: string; changeRole?: boolean } | null;

const STORAGE_ERROR = "Couldn't save this change. Browser storage may be full.";

export default function TeamPage() {
  const members = useTeamMembers();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
  const [panel, setPanel] = useState<Panel>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (next: Notice) => {
    setNotice(next);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), next.undo ? 6000 : 3000);
  };

  const closePanel = React.useCallback(() => setPanel(null), []);

  const invite = (email: string, role: RoleId, message: string) => {
    const { ok } = inviteMember(email, role, message);
    setPanel(null);
    notify(ok ? { text: `Invitation sent to ${email.toLowerCase()}.`, tone: "success" } : { text: STORAGE_ERROR, tone: "error" });
  };

  const update = (id: string, patch: Partial<Omit<Member, "id">>, what: string) => {
    notify(updateMember(id, patch) ? { text: what, tone: "success" } : { text: STORAGE_ERROR, tone: "error" });
  };

  const remove = (member: Member) => {
    const { ok, restore } = removeMember(member.id);
    setMenuFor(null);
    setPanel((p) => (p?.kind === "member" && p.id === member.id ? null : p));
    if (!ok) {
      notify({ text: STORAGE_ERROR, tone: "error" });
      return;
    }
    notify({
      text: `${member.name} was removed from the team.`,
      tone: "success",
      undo: () => {
        restore();
        setNotice(null);
      },
    });
  };

  const resend = (member: Member) => {
    setMenuFor(null);
    const ok = updateMember(member.id, { addedAt: Date.now() });
    notify(ok ? { text: `Invitation resent to ${member.email}.`, tone: "success" } : { text: STORAGE_ERROR, tone: "error" });
  };

  const q = query.trim().toLowerCase();
  const visible = members.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });
  const filtered = q !== "" || roleFilter !== "all" || statusFilter !== "all";
  const clearFilters = () => {
    setQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const openMember = panel?.kind === "member" ? members.find((m) => m.id === panel.id) : undefined;
  const columns = "md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_96px_64px]";

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-slate-900">Team &amp; Access</h1>
          <p className="mt-1 text-[13px] text-slate-600">
            Manage your organisation&apos;s members and control what they can access across Fintech Connect.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPanel({ kind: "invite" })}
          className="flex h-10 shrink-0 items-center gap-2 self-start rounded-lg bg-[#0040DF] px-4 text-[13px] font-medium text-white shadow-sm hover:bg-[#0035b8]"
        >
          <UserPlus className="h-4 w-4" /> Invite member
        </button>
      </div>

      {/* Team members card */}
      <section className="relative rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] sm:p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <h2 className="text-[17px] font-semibold text-slate-900">Team members</h2>
            <span className="rounded-full bg-[#E3E8FA] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#3A4A7A]">
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPanel({ kind: "roles" })}
            aria-haspopup="dialog"
            className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-[#0040DF] hover:underline"
          >
            <Info className="h-3.5 w-3.5" /> View Role Info
          </button>
        </div>

        {/* Search + filters */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search by name or email"
              className="h-10 w-full rounded-lg border border-slate-200 bg-[#F5F6FC] pl-9 pr-3 text-[13px] text-slate-800 placeholder:text-slate-500 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <FilterSelect label="Filter by role" value={roleFilter} onChange={(v) => setRoleFilter(v as RoleId | "all")} className="flex-1 sm:w-[170px]">
              <option value="all">All roles</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Filter by status" value={statusFilter} onChange={(v) => setStatusFilter(v as MemberStatus | "all")} className="flex-1 sm:w-[96px]">
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>

        {/* Table */}
        <div role="table" aria-label="Team members">
          <div role="row" className={`grid grid-cols-[minmax(0,1fr)_64px] items-center rounded-lg bg-[#EEF1FD] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 ${columns}`}>
            <span role="columnheader">Member</span>
            <span role="columnheader" className="hidden md:block">Role</span>
            <span role="columnheader" className="hidden md:block">Status</span>
            <span role="columnheader" className="text-right">Actions</span>
          </div>

          {members.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-b-lg bg-[#F8F9FE] px-6 py-12 text-center">
              <Users className="h-7 w-7 text-slate-800" strokeWidth={1.6} />
              <p className="mt-3 text-[13px] italic text-slate-600">No collaborators yet.</p>
              <p className="mt-1 max-w-sm text-[10px] text-slate-400">
                You have not invited anyone to your team yet. Invite a member to view and manage them here.
              </p>
              <button
                type="button"
                onClick={() => setPanel({ kind: "invite" })}
                className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#0040DF] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add a team member
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-b-lg bg-[#F8F9FE] px-6 py-10 text-center">
              <p className="text-[13px] font-semibold text-slate-800">No members match your filters</p>
              <p className="mt-1 text-[12px] text-slate-500">Try a different name, role or status.</p>
              {filtered && (
                <button type="button" onClick={clearFilters} className="mt-3 text-[12px] font-semibold text-[#0040DF] hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div role="rowgroup">
              {visible.map((m) => (
                <div
                  key={m.id}
                  role="row"
                  tabIndex={0}
                  onClick={() => setPanel({ kind: "member", id: m.id })}
                  onKeyDown={(e) => {
                    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setPanel({ kind: "member", id: m.id });
                    }
                  }}
                  className={`relative grid cursor-pointer grid-cols-[minmax(0,1fr)_64px] items-center gap-y-2 rounded-lg px-3 py-3 transition-colors hover:bg-[#F7F8FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${columns}`}
                >
                  <div role="cell" className="flex min-w-0 items-center gap-3">
                    <Avatar member={m} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-900">{m.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{m.email}</p>
                      {/* On small screens the role and status sit under the name. */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
                        <RolePill role={m.role} />
                        <StatusPill status={m.status} />
                      </div>
                    </div>
                  </div>
                  <div role="cell" className="hidden min-w-0 md:block">
                    <RolePill role={m.role} />
                  </div>
                  <div role="cell" className="hidden md:block">
                    <StatusPill status={m.status} />
                  </div>
                  <div role="cell" className="flex justify-end">
                    <RowActions
                      member={m}
                      open={menuFor === m.id}
                      onToggle={(open) => setMenuFor(open ? m.id : null)}
                      onView={() => {
                        setMenuFor(null);
                        setPanel({ kind: "member", id: m.id });
                      }}
                      onChangeRole={() => {
                        setMenuFor(null);
                        setPanel({ kind: "member", id: m.id, changeRole: true });
                      }}
                      onResend={() => resend(m)}
                      onToggleSuspend={() => {
                        setMenuFor(null);
                        const suspend = m.status === "active";
                        update(m.id, { status: suspend ? "suspended" : "active" }, suspend ? `${m.name}'s access is suspended.` : `${m.name}'s access is restored.`);
                      }}
                      onRemove={() => remove(m)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-600">
          <Info className="h-3.5 w-3.5 shrink-0" /> Click any member to view details or manage permissions.
        </p>
      </section>

      {panel?.kind === "invite" && <InvitePanel members={members} onClose={closePanel} onInvite={invite} />}
      {panel?.kind === "roles" && (
        <RolesPanel
          members={members}
          onClose={closePanel}
          onInvite={() => setPanel({ kind: "invite" })}
        />
      )}
      {openMember && panel?.kind === "member" && (
        <MemberPanel
          key={openMember.id}
          member={openMember}
          members={members}
          startWithRoleChange={!!panel.changeRole}
          onClose={closePanel}
          onUpdate={(patch, what) => update(openMember.id, patch, what)}
          onRemove={() => remove(openMember)}
          onResend={() => resend(openMember)}
        />
      )}

      {notice && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-[60] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-3 text-[13px] shadow-lg ${
            notice.tone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          {notice.tone === "error" ? <TriangleAlert className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
          <span>{notice.text}</span>
          {notice.undo && (
            <button type="button" onClick={notice.undo} className="ml-1 font-semibold text-[#0040DF] hover:underline">
              Undo
            </button>
          )}
          <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)} className="ml-1 text-slate-400 hover:text-slate-700">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Filters -------------------------------- */

function FilterSelect({
  label,
  value,
  onChange,
  className = "",
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none truncate rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[12px] text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

/* ------------------------- Roles & permissions ------------------------- */

/** "View Role Info": what each role can access, in the same side panel as "Invite member". */
function RolesPanel({ members, onClose, onInvite }: { members: Member[]; onClose: () => void; onInvite: () => void }) {
  return (
    <Drawer label="Roles and permissions" onClose={onClose}>
      <DrawerHeader title="Roles & permissions" subtitle="Understand what each role can access." onClose={onClose} />
      <ul className="flex-1 space-y-2.5 overflow-y-auto px-5 py-5">
        {ROLES.map((r) => {
          const count = members.filter((m) => m.role === r.id).length;
          return (
            <li key={r.id} className="rounded-xl border border-slate-100 bg-[#F8F9FE] p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#E3E8FA] text-[#0040DF]">
                  <r.icon className="h-4 w-4" />
                </span>
                <p className="min-w-0 flex-1 text-[13px] font-semibold text-slate-900">{r.name}</p>
                <span className="shrink-0 text-[10.5px] font-medium text-slate-500">
                  {count} {count === 1 ? "member" : "members"}
                </span>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-slate-600">{r.description}</p>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-4">
        <button type="button" onClick={onClose} className="h-9 rounded-lg px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100">
          Close
        </button>
        <button
          type="button"
          onClick={onInvite}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0040DF] px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-[#0035b8]"
        >
          <UserPlus className="h-3.5 w-3.5" /> Invite member
        </button>
      </div>
    </Drawer>
  );
}

/* ----------------------------- Row actions ----------------------------- */

function RowActions({
  member,
  open,
  onToggle,
  onView,
  onChangeRole,
  onResend,
  onToggleSuspend,
  onRemove,
}: {
  member: Member;
  open: boolean;
  onToggle: (open: boolean) => void;
  onView: () => void;
  onChangeRole: () => void;
  onResend: () => void;
  onToggleSuspend: () => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onToggle(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onToggle]);

  const item = "flex w-full items-center px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-[#F1F3FD]";

  return (
    // Clicks here never open the member panel underneath.
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={`Actions for ${member.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => onToggle(!open)}
        className="grid h-7 w-7 place-items-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <Ellipsis className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button type="button" role="menuitem" className={item} onClick={onView}>
            View details
          </button>
          <button type="button" role="menuitem" className={item} onClick={onChangeRole}>
            Change role
          </button>
          {member.status === "invited" ? (
            <button type="button" role="menuitem" className={item} onClick={onResend}>
              Resend invitation
            </button>
          ) : (
            <button type="button" role="menuitem" className={item} onClick={onToggleSuspend}>
              {member.status === "active" ? "Suspend access" : "Restore access"}
            </button>
          )}
          <div className="my-1 border-t border-slate-100" />
          <button type="button" role="menuitem" className={`${item} text-rose-600 hover:bg-rose-50`} onClick={onRemove}>
            Remove {firstName(member.name)}
          </button>
        </div>
      )}
    </div>
  );
}
