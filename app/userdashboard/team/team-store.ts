"use client";

import { useSyncExternalStore } from "react";
import { AVATAR_COLORS, CURRENT_MEMBER_ID, SEED_MEMBERS, nameFromEmail, type Member, type RoleId } from "./team-data";

/* The team list, kept in localStorage so invitations and changes survive reloads.
   Until something is saved, the sample team is shown. */

const STORAGE_KEY = "fintechconnect:team:v1";

let members: Member[] | null = null;
const listeners = new Set<() => void>();

function load(): Member[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_MEMBERS;
    const parsed = JSON.parse(raw) as { members?: Member[] };
    return Array.isArray(parsed.members) ? parsed.members : SEED_MEMBERS;
  } catch {
    return SEED_MEMBERS;
  }
}

function getSnapshot() {
  if (!members) members = load();
  return members;
}

function getServerSnapshot() {
  return SEED_MEMBERS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    members = load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returns false if the browser refused to store the change (it still applies for this visit). */
function update(fn: (prev: Member[]) => Member[]): boolean {
  members = fn(getSnapshot());
  listeners.forEach((l) => l());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ members }));
    return true;
  } catch {
    return false;
  }
}

export function useTeamMembers() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function inviteMember(email: string, role: RoleId, message: string): { ok: boolean; member: Member } {
  const normalized = email.trim().toLowerCase();
  const member: Member = {
    id: `member-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: nameFromEmail(normalized),
    email: normalized,
    role,
    status: "invited",
    addedAt: Date.now(),
    invitedBy: CURRENT_MEMBER_ID,
    message: message.trim() || undefined,
    color: Math.floor(Math.random() * AVATAR_COLORS.length),
  };
  const ok = update((prev) => [...prev, member]);
  return { ok, member };
}

export function updateMember(id: string, patch: Partial<Omit<Member, "id">>) {
  return update((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
}

/** Removes a member. Returns a function that puts them back where they were. */
export function removeMember(id: string): { ok: boolean; restore: () => void } {
  const before = getSnapshot();
  const index = before.findIndex((m) => m.id === id);
  const removed = before[index];
  const ok = update((prev) => prev.filter((m) => m.id !== id));
  return {
    ok,
    restore: () => {
      if (!removed) return;
      update((prev) => {
        if (prev.some((m) => m.id === id)) return prev;
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, removed);
        return next;
      });
    },
  };
}

export function isEmailTaken(list: Member[], email: string, exceptId?: string) {
  const normalized = email.trim().toLowerCase();
  return list.some((m) => m.id !== exceptId && m.email.toLowerCase() === normalized);
}
