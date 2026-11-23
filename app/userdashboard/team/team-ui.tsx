"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { AVATAR_COLORS, ROLES, findRole, initials, type Member, type MemberStatus, type RoleId } from "./team-data";

/* Small pieces shared by the team table and its side panels. */

export function Avatar({ member, size = 36, className = "" }: { member: Pick<Member, "name" | "color">; size?: number; className?: string }) {
  const [bg, fg] = AVATAR_COLORS[member.color % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${className}`}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.36) }}
    >
      {initials(member.name)}
    </span>
  );
}

export function RolePill({ role }: { role: RoleId }) {
  const designer = role === "studio-designer";
  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-[4px] px-2 py-1 text-[10px] font-medium leading-none ${
        designer ? "bg-[#EFE4FF] text-[#8B3FD9]" : "bg-[#E3E8FA] text-[#3A4A7A]"
      }`}
    >
      {findRole(role).name}
    </span>
  );
}

const STATUS_STYLE: Record<MemberStatus, { label: string; pill: string; dot: string }> = {
  active: { label: "Active", pill: "bg-[#E8EDFB] text-slate-700", dot: "bg-[#0040DF]" },
  invited: { label: "Invited", pill: "bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  suspended: { label: "Suspended", pill: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export function StatusPill({ status }: { status: MemberStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/** Plain "● Active" text, used in the member details list. */
export function StatusText({ status }: { status: MemberStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/** A panel that slides in from the right over a dimmed page. Escape or a click outside closes it. */
export function Drawer({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[360px] flex-col bg-white shadow-2xl"
      >
        {children}
      </aside>
    </>
  );
}

export function DrawerHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-[16px] font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{subtitle}</p>}
      </div>
      <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** A role dropdown that shows each role's icon. */
export function RolePicker({
  value,
  onChange,
  id,
  autoOpen = false,
}: {
  value: RoleId;
  onChange: (role: RoleId) => void;
  id?: string;
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(autoOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const role = findRole(value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Close the list, not the panel around it.
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left text-[13px] text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <role.icon className="h-4 w-4 shrink-0 text-[#0040DF]" />
        <span className="flex-1 truncate">{role.name}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label="Project role" className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {ROLES.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                role="option"
                aria-selected={r.id === value}
                onClick={() => {
                  onChange(r.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] hover:bg-[#F1F3FD] ${r.id === value ? "font-semibold text-[#0040DF]" : "text-slate-700"}`}
              >
                <r.icon className="h-3.5 w-3.5 shrink-0 text-[#0040DF]" />
                <span className="flex-1">{r.name}</span>
                {r.id === value && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
