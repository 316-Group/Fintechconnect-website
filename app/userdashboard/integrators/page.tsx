"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Search, Settings, TriangleAlert, X } from "lucide-react";
import { INTEGRATORS, SYNC_FREQUENCIES, findIntegrator, type IntegratorSettings, type SyncFrequency } from "./integrators-data";
import { IntegratorLogo } from "./integrator-logo";
import { isConnected, saveSettings, setConnected, settingsFor, useIntegratorState, type IntegratorState } from "./integrator-store";

type Filter = "all" | "connected" | "disconnected";
type Notice = { text: string; tone: "success" | "error"; undo?: () => void };

/* ------------------------------- Toggle -------------------------------- */

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "border-[#22C55E] bg-[#22C55E]" : "border-slate-200 bg-slate-100"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.25)] transition-all ${
          checked ? "left-[18px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

/* -------------------------------- Page --------------------------------- */

export default function IntegratorsPage() {
  const saved = useIntegratorState();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [managing, setManaging] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl/⌘ + K focuses the integrator search on this page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = (next: Notice) => {
    setNotice(next);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), next.undo ? 5000 : 3000);
  };

  const toggle = (slug: string, next: boolean) => {
    const name = findIntegrator(slug)?.name ?? slug;
    const stored = setConnected(slug, next);
    if (!stored) {
      notify({ text: "Couldn't save this change. Browser storage may be full.", tone: "error" });
      return;
    }
    notify({
      text: next ? `${name} connected.` : `${name} disconnected.`,
      tone: "success",
      undo: () => {
        setConnected(slug, !next);
        setNotice(null);
      },
    });
  };

  const connectedTotal = INTEGRATORS.filter((i) => isConnected(saved, i.slug)).length;
  const q = query.trim().toLowerCase();
  const visible = INTEGRATORS.filter((i) => {
    const on = isConnected(saved, i.slug);
    if (filter === "connected" && !on) return false;
    if (filter === "disconnected" && on) return false;
    if (!q) return true;
    return [i.name, i.description, i.category].some((t) => t.toLowerCase().includes(q));
  });

  const pill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
      active ? "bg-[#0040DF] text-white shadow-sm" : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
    }`;

  const managed = managing ? findIntegrator(managing) : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold leading-tight text-slate-900">Integrators</h1>
        <p className="mt-1 text-[14px] text-slate-600">Easily connect and manage your favorite tools and platforms.</p>
      </div>

      {/* Filters + search */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={pill(filter === "all")} onClick={() => setFilter("all")}>
            All Integrators ({INTEGRATORS.length})
          </button>
          <button type="button" className={pill(filter === "connected")} onClick={() => setFilter("connected")}>
            Connected ({connectedTotal})
          </button>
          <button type="button" className={pill(filter === "disconnected")} onClick={() => setFilter("disconnected")}>
            Disconnected ({INTEGRATORS.length - connectedTotal})
          </button>
        </div>
        <div className="relative w-full md:w-[300px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search integrators"
            aria-label="Search integrators"
            className="h-10 w-full rounded-lg border border-transparent bg-[#EEF2FF] pl-9 pr-12 text-[13px] text-slate-800 placeholder:text-slate-500 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-[14px] font-semibold text-slate-800">No integrators found</p>
          <p className="mt-1 text-[13px] text-slate-500">
            {q ? "Try a different search term." : filter === "connected" ? "Nothing is connected yet." : "Everything is connected."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((i) => {
            const on = isConnected(saved, i.slug);
            return (
              <div
                key={i.slug}
                className="flex min-h-[176px] flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-[0_6px_20px_-12px_rgba(15,23,42,0.25)]"
              >
                <div className="mb-3 flex h-9 items-center">
                  <IntegratorLogo kind={i.logo} />
                </div>
                <h2 className="text-[15px] font-bold text-slate-900">{i.name}</h2>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">{i.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setManaging(i.slug)}
                    className="-ml-1.5 flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Settings className="h-3.5 w-3.5" /> Manage
                  </button>
                  <Toggle checked={on} onChange={(v) => toggle(i.slug, v)} label={`${on ? "Disconnect" : "Connect"} ${i.name}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {managed && (
        <ManagePanel
          key={managed.slug}
          slug={managed.slug}
          saved={saved}
          onToggle={(v) => toggle(managed.slug, v)}
          onClose={() => setManaging(null)}
          notify={notify}
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

/* ----------------------------- Manage panel ----------------------------- */

function ManagePanel({
  slug,
  saved,
  onToggle,
  onClose,
  notify,
}: {
  slug: string;
  saved: IntegratorState;
  onToggle: (v: boolean) => void;
  onClose: () => void;
  notify: (n: Notice) => void;
}) {
  const integrator = findIntegrator(slug)!;
  const on = isConnected(saved, slug);
  const stored = settingsFor(saved, slug);
  const [draft, setDraft] = useState<IntegratorSettings>(stored);
  const dirty = JSON.stringify(draft) !== JSON.stringify(stored);
  const connectedAt = saved.connectedAt[slug];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    if (saveSettings(slug, draft)) {
      notify({ text: `${integrator.name} settings saved.`, tone: "success" });
      onClose();
    } else {
      notify({ text: "Couldn't save. Browser storage may be full.", tone: "error" });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Manage ${integrator.name}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white">
              <IntegratorLogo kind={integrator.logo} size={26} />
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900">{integrator.name}</h2>
              <p className="text-[12px] text-slate-500">{integrator.category}</p>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <p className="text-[13px] leading-relaxed text-slate-600">{integrator.description}</p>

          {/* Connection */}
          <section className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-slate-900">Connection</p>
                <p className={`mt-0.5 flex items-center gap-1.5 text-[12px] ${on ? "text-emerald-600" : "text-slate-500"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-slate-300"}`} />
                  {on ? "Connected" : "Not connected"}
                </p>
              </div>
              <Toggle checked={on} onChange={onToggle} label={`${on ? "Disconnect" : "Connect"} ${integrator.name}`} />
            </div>
            {on && (
              <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Account</dt>
                  <dd className="text-right font-medium text-slate-800">{integrator.account}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Connected</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {connectedAt ? new Date(connectedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Set up by your workspace admin"}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {/* Settings */}
          <section className={on ? "" : "opacity-60"}>
            <p className="text-[13px] font-semibold text-slate-900">Settings</p>
            {!on && <p className="mt-0.5 text-[12px] text-slate-500">Connect {integrator.name} to change these settings.</p>}

            <label className="mt-4 block text-[12px] font-medium text-slate-700" htmlFor="int-frequency">
              Sync frequency
            </label>
            <select
              id="int-frequency"
              disabled={!on}
              value={draft.frequency}
              onChange={(e) => setDraft((d) => ({ ...d, frequency: e.target.value as SyncFrequency }))}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {SYNC_FREQUENCIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>

            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {integrator.options.map((o) => (
                <div key={o.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-900">{o.label}</p>
                    <p className="mt-0.5 text-[12px] text-slate-500">{o.description}</p>
                  </div>
                  <Toggle
                    checked={!!draft.options[o.id]}
                    disabled={!on}
                    label={o.label}
                    onChange={(v) => setDraft((d) => ({ ...d, options: { ...d.options, [o.id]: v } }))}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="h-9 rounded-lg px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!on || !dirty}
            className="h-9 rounded-lg bg-[#0040DF] px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-[#0035b8] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save changes
          </button>
        </div>
      </aside>
    </>
  );
}
