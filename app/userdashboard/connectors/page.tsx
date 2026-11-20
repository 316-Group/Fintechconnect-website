"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Link2, Network, Search, Settings } from "lucide-react";
import { CONNECTORS } from "./connectors-data";
import { ConnectorLogo } from "./connector-logo";
import { connectedCount, isConnected, useConnectorState } from "./connector-store";

type Filter = "all" | "connected";

export default function ConnectorsPage() {
  const saved = useConnectorState();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl/⌘ + K focuses the connector search on this page.
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

  const q = query.trim().toLowerCase();
  const visible = CONNECTORS.filter((c) => {
    if (filter === "connected" && !isConnected(saved, c.slug)) return false;
    if (!q) return true;
    return [c.name, c.summary, ...c.categories].some((t) => t.toLowerCase().includes(q));
  });

  const pill = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
      active ? "bg-[#0040DF] text-white shadow-sm" : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
    }`;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#0040DF]">
          <Network className="h-3.5 w-3.5" /> Core Infrastructure &amp; Ecosystem
        </p>
        <h1 className="text-[28px] font-bold leading-tight text-slate-900">Connectors</h1>
        <p className="mt-1 text-[14px] text-slate-600">
          Extend your BaaS architecture with pre-built banking, payment, identity, and developer rails.
        </p>
      </div>

      {/* Filters + search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button type="button" className={pill(filter === "all")} onClick={() => setFilter("all")}>
            All connectors ({CONNECTORS.length})
          </button>
          <button type="button" className={pill(filter === "connected")} onClick={() => setFilter("connected")}>
            Connected ({connectedCount(saved)})
          </button>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search connectors"
            aria-label="Search connectors"
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
          <p className="text-[14px] font-semibold text-slate-800">No connectors found</p>
          <p className="mt-1 text-[13px] text-slate-500">
            {filter === "connected" && !q ? "You haven't connected any providers yet." : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => {
            const connected = isConnected(saved, c.slug);
            const href = `/userdashboard/connectors/${c.slug}`;
            return (
              <div
                key={c.slug}
                className="group relative flex min-h-[168px] flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-[0_6px_20px_-10px_rgba(15,23,42,0.25)]"
              >
                <div className="mb-4 flex h-10 items-center justify-between">
                  <ConnectorLogo kind={c.logo} />
                  <Link
                    href={`${href}?tab=configurations`}
                    className={`relative z-10 flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors ${
                      connected ? "text-slate-600 hover:bg-slate-100" : "text-[#0040DF] hover:bg-blue-50"
                    }`}
                  >
                    {connected ? <Settings className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                    {connected ? "Manage" : "Connect"}
                  </Link>
                </div>
                <h2 className="text-[15px] font-bold text-slate-900">
                  {/* The overlay link makes the whole card clickable. */}
                  <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-blue-500">
                    {c.name}
                  </Link>
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{c.summary}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
