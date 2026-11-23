"use client";

import React, { useState } from "react";
import { Pencil, RotateCw, UserMinus } from "lucide-react";
import { EMAIL_PATTERN, findRole, firstName, formatDate, timeAgo, type Member, type MemberStatus, type RoleId } from "./team-data";
import { isEmailTaken } from "./team-store";
import { Avatar, Drawer, DrawerHeader, RolePicker, StatusPill, StatusText } from "./team-ui";

/** A member's details: profile, general information and assigned role, with edit and remove. */
export function MemberPanel({
  member,
  members,
  startWithRoleChange,
  onClose,
  onUpdate,
  onRemove,
  onResend,
}: {
  member: Member;
  members: Member[];
  startWithRoleChange: boolean;
  onClose: () => void;
  onUpdate: (patch: Partial<Omit<Member, "id">>, what: string) => void;
  onRemove: () => void;
  onResend: () => void;
}) {
  const role = findRole(member.role);
  const inviter = member.invitedBy ? members.find((m) => m.id === member.invitedBy) : undefined;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: member.name, email: member.email, status: member.status });
  const [submitted, setSubmitted] = useState(false);
  const [changingRole, setChangingRole] = useState(startWithRoleChange);

  const nameError = !draft.name.trim() ? "Enter a name." : null;
  const emailError = !draft.email.trim()
    ? "Enter an email address."
    : !EMAIL_PATTERN.test(draft.email.trim())
      ? "Enter a valid email address."
      : isEmailTaken(members, draft.email, member.id)
        ? "Another member already uses this email."
        : null;

  const startEditing = () => {
    setDraft({ name: member.name, email: member.email, status: member.status });
    setSubmitted(false);
    setEditing(true);
  };

  const saveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || emailError) return;
    onUpdate({ name: draft.name.trim(), email: draft.email.trim().toLowerCase(), status: draft.status }, "Member details updated.");
    setEditing(false);
  };

  const changeRole = (next: RoleId) => {
    setChangingRole(false);
    if (next !== member.role) onUpdate({ role: next }, `${firstName(member.name)} is now ${findRole(next).name}.`);
  };

  const row = "flex min-h-[46px] items-center justify-between gap-4 border-b border-slate-100 px-1 py-2.5 text-[12px] last:border-b-0";
  const input = (invalid: boolean) =>
    `h-8 w-[190px] rounded-md border bg-white px-2 text-right text-[12px] text-slate-800 focus:outline-none focus:ring-2 ${
      invalid ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
    }`;

  return (
    <Drawer label={`Team member ${member.name}`} onClose={onClose}>
      <DrawerHeader title="Team Member" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Profile */}
        <section className="rounded-xl bg-[#F1F3FD] p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar member={member} size={52} />
              <span
                title={role.name}
                className="absolute -bottom-0.5 -left-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-[#F1F3FD] bg-white text-[#0040DF]"
              >
                <role.icon className="h-3 w-3" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[18px] font-semibold leading-tight text-slate-900">{member.name}</p>
                {!editing && (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#0040DF] hover:underline"
                  >
                    Edit member <Pencil className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">{member.email}</p>
              <div className="mt-1.5">
                <StatusPill status={member.status} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Designation</p>
              <p className="truncate text-[12px] text-slate-800">{role.name}</p>
            </div>
            <span className="shrink-0 rounded-[4px] bg-[#DDE4FB] px-2 py-1 text-[10px] font-semibold text-[#0040DF]">{role.workspace}</span>
          </div>
        </section>

        {/* General information */}
        <h3 className="mb-1 mt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-600">General information</h3>
        <form onSubmit={saveEdits} noValidate>
          <div>
            <div className={row}>
              <label htmlFor="member-name" className="text-slate-600">Full name</label>
              {editing ? (
                <input
                  id="member-name"
                  autoFocus
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  aria-invalid={submitted && !!nameError}
                  className={input(submitted && !!nameError)}
                />
              ) : (
                <span className="truncate text-right text-slate-800">{member.name}</span>
              )}
            </div>
            <div className={row}>
              <label htmlFor="member-email" className="text-slate-600">Email address</label>
              {editing ? (
                <input
                  id="member-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  aria-invalid={submitted && !!emailError}
                  className={input(submitted && !!emailError)}
                />
              ) : (
                <span className="truncate text-right text-slate-800">{member.email}</span>
              )}
            </div>
            <div className={row}>
              <label htmlFor="member-status" className="text-slate-600">Membership status</label>
              {editing && member.status !== "invited" ? (
                <select
                  id="member-status"
                  value={draft.status}
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as MemberStatus }))}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-[12px] text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              ) : (
                <span className="text-right text-slate-800">
                  <StatusText status={member.status} />
                </span>
              )}
            </div>
            <div className={row}>
              <span className="text-slate-600">{member.status === "invited" ? "Date invited" : "Date added"}</span>
              <span className="text-right text-slate-800">
                {formatDate(member.addedAt)} <span className="text-slate-500">({timeAgo(member.addedAt)})</span>
              </span>
            </div>
            <div className={row}>
              <span className="text-slate-600">Invited by</span>
              {inviter ? (
                <span className="flex min-w-0 items-center gap-1.5 text-slate-800">
                  <Avatar member={inviter} size={18} />
                  <span className="truncate">{inviter.name}</span>
                  <span className="shrink-0 text-[10px] text-slate-500">({findRole(inviter.role).name})</span>
                </span>
              ) : (
                <span className="text-right text-slate-500">{member.invitedBy ? "A former member" : "Workspace owner"}</span>
              )}
            </div>
          </div>

          {submitted && (nameError || emailError) && (
            <p className="mt-2 text-[11px] text-rose-600">{nameError ?? emailError}</p>
          )}

          {editing && (
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(false)} className="h-8 rounded-lg px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" className="h-8 rounded-lg bg-[#0040DF] px-3 text-[12px] font-semibold text-white hover:bg-[#0035b8]">
                Save changes
              </button>
            </div>
          )}
        </form>

        {member.status === "invited" && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-800">
            <span>Waiting for {firstName(member.name)} to accept the invitation.</span>
            <button type="button" onClick={onResend} className="flex shrink-0 items-center gap-1 font-semibold hover:underline">
              <RotateCw className="h-3 w-3" /> Resend
            </button>
          </div>
        )}

        {/* Assigned role */}
        <h3 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Assigned role</h3>
        <section className="rounded-xl bg-[#F1F3FD] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-slate-900">{role.name}</p>
            <button
              type="button"
              onClick={() => setChangingRole((v) => !v)}
              className="shrink-0 text-[11px] font-semibold text-[#0040DF] hover:underline"
            >
              {changingRole ? "Cancel" : "Change role"}
            </button>
          </div>
          {changingRole && (
            <div className="mt-3">
              <RolePicker value={member.role} onChange={changeRole} autoOpen />
            </div>
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{role.summary}</p>
        </section>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRemove}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#FDE2E2] px-3 text-[12px] font-semibold text-[#C81E1E] hover:bg-[#FBD0D0]"
          >
            <UserMinus className="h-3.5 w-3.5" /> Remove from team
          </button>
        </div>
        <p className="mt-2 text-right text-[10px] text-slate-500">
          Removing {firstName(member.name)} will revoke access to all Fintech Connect workspaces and products immediately.
        </p>
      </div>
    </Drawer>
  );
}
