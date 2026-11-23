"use client";

import React, { useState } from "react";
import { Info, Mail, Send } from "lucide-react";
import { EMAIL_PATTERN, MESSAGE_LIMIT, findRole, type Member, type RoleId } from "./team-data";
import { isEmailTaken } from "./team-store";
import { Drawer, DrawerHeader, RolePicker } from "./team-ui";

/** "Invite a team member": email, role and an optional note. */
export function InvitePanel({
  members,
  onClose,
  onInvite,
}: {
  members: Member[];
  onClose: () => void;
  onInvite: (email: string, role: RoleId, message: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleId>("compliance-auditor");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const trimmed = email.trim();
  const emailError = !trimmed
    ? "Enter an email address."
    : !EMAIL_PATTERN.test(trimmed)
      ? "Enter a valid email address, like name@company.com."
      : isEmailTaken(members, trimmed)
        ? `${trimmed} is already on your team.`
        : null;
  const showError = submitted && emailError;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (emailError) return;
    onInvite(trimmed, role, message);
  };

  return (
    <Drawer label="Invite a team member" onClose={onClose}>
      <DrawerHeader
        title="Invite a team member"
        subtitle="Give someone access to your Fintech Connect workspace by assigning them a role."
        onClose={onClose}
      />
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <label htmlFor="invite-email" className="block text-[12px] font-medium text-slate-800">
              Email address
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="invite-email"
                type="email"
                autoFocus
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                aria-invalid={!!showError}
                aria-describedby={showError ? "invite-email-error" : undefined}
                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  showError ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
                }`}
              />
            </div>
            {showError && (
              <p id="invite-email-error" className="mt-1.5 text-[11px] text-rose-600">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="invite-role" className="block text-[12px] font-medium text-slate-800">
              Project role
            </label>
            <div className="mt-1.5">
              <RolePicker id="invite-role" value={role} onChange={setRole} />
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{findRole(role).summary}</p>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="invite-message" className="block text-[12px] font-medium text-slate-800">
                Personal message (optional)
              </label>
              <span className="text-[10px] text-slate-400">
                {message.length > 0 ? `${message.length}/${MESSAGE_LIMIT}` : `Max ${MESSAGE_LIMIT} chars`}
              </span>
            </div>
            <textarea
              id="invite-message"
              rows={3}
              maxLength={MESSAGE_LIMIT}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note to your invitation"
              className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[12px] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex gap-2.5 rounded-lg border border-[#D6DEFA] bg-[#EEF2FF] px-3 py-3 text-[11px] leading-relaxed text-slate-600">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0040DF]" />
            <p>An automated activation link with single-use authentication token will expire in 48 hours.</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="h-9 rounded-lg px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            className="flex h-9 items-center gap-2 rounded-lg bg-[#0040DF] px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-[#0035b8]"
          >
            <Send className="h-3.5 w-3.5" /> Send invitation
          </button>
        </div>
      </form>
    </Drawer>
  );
}
