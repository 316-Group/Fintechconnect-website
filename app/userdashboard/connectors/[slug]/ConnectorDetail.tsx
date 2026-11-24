"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Check,
  Clock,
  CodeXml,
  Copy,
  CreditCard,
  Cpu,
  Download,
  Eye,
  EyeOff,
  Flag,
  KeyRound,
  Landmark,
  Lock,
  Maximize2,
  Minimize2,
  Plus,
  Receipt,
  RefreshCw,
  Scale,
  ScanFace,
  Send,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Unlink,
  X,
  Zap,
} from "lucide-react";
import {
  LEDGER_ACCOUNTS,
  SETTLEMENT_ASSETS,
  SETTLEMENT_SCHEDULES,
  findConnector,
  type Connector,
  type ConnectorConfig,
  type FeatureIcon,
  type FeatureTone,
  type FeedRow,
  type FeedStatus,
} from "../connectors-data";
import { isConnected, saveConfig, savedConfig, setConnected, useConnectorState } from "../connector-store";

export type DetailTab = "description" | "configurations" | "security";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "configurations", label: "Configurations" },
  { id: "security", label: "Security & Compliance" },
];

/** Shown as the person who last saved a configuration (matches the dashboard top bar). */
const CURRENT_USER = "Marcus Vance";

type Notify = (text: string, tone?: "success" | "error") => void;

/* -------------------------------- Helpers -------------------------------- */

function randomToken(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

/** Keeps a key's prefix (e.g. "sk_test_") and replaces the rest. */
function rotateKey(key: string) {
  const cut = key.lastIndexOf("_");
  const prefix = cut > 0 && cut < 12 ? key.slice(0, cut + 1) : "";
  return prefix + randomToken(Math.max(16, key.length - prefix.length));
}

function utcStamp(date = new Date()) {
  return `${date.toISOString().replace("T", " ").slice(0, 19)} UTC`;
}

function maskSecret(value: string) {
  if (value.length <= 10) return "•".repeat(value.length);
  return value.slice(0, 8) + "•".repeat(Math.min(28, value.length - 12)) + value.slice(-4);
}

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const card = "rounded-2xl border border-slate-200 bg-white";
const sectionTitle = "text-[15px] font-bold text-slate-900";
const sectionSub = "mt-0.5 text-[12px] text-slate-500";
const inputCls =
  "h-10 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-[13px] text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelCls = "mb-1.5 block text-[12px] font-semibold text-slate-800";

/* ------------------------------- Component ------------------------------- */

export default function ConnectorDetail({ slug }: { slug: string }) {
  const connector = findConnector(slug)!;
  const saved = useConnectorState();
  const connected = isConnected(saved, slug);
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<DetailTab>(() => TABS.find((t) => t.id === searchParams.get("tab"))?.id ?? "description");
  const [notice, setNotice] = useState<{ text: string; tone: "success" | "error" } | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify: Notify = (text, tone = "success") => {
    setNotice({ text, tone });
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3200);
  };

  const selectTab = (next: DetailTab) => {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === "description") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  };

  const connect = () => {
    if (!setConnected(slug, true)) notify("Couldn't save the connection. Browser storage may be full.", "error");
    else notify(`${connector.name} connected. Review the configuration before going live.`);
  };
  const disconnect = () => {
    if (!setConnected(slug, false)) notify("Couldn't save the change. Browser storage may be full.", "error");
    else notify(`${connector.name} disconnected. Webhook ingestion has stopped.`);
  };

  // Remount the configuration form whenever the saved copy changes (load or save).
  const config = savedConfig(saved, slug);
  const configKey = `${saved.savedAt[slug] ?? 0}`;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link
        href="/userdashboard/connectors"
        className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Connectors
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidePanel connector={connector} connected={connected} onConnect={connect} onDisconnect={disconnect} notify={notify} />

        <div className="min-w-0">
          <h1 className="text-[26px] font-bold leading-tight text-slate-900">{connector.title}</h1>
          <div role="tablist" className="mt-3 flex gap-5 border-b border-slate-200 sm:gap-7">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => selectTab(t.id)}
                className={`-mb-px whitespace-nowrap border-b-2 pb-2.5 text-[13px] font-medium transition-colors ${
                  tab === t.id ? "border-[#0040DF] text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {tab === "description" && <DescriptionTab connector={connector} notify={notify} onConfigure={() => selectTab("configurations")} />}
            {tab === "configurations" && (
              <ConfigurationsTab key={configKey} connector={connector} saved={config} savedAt={saved.savedAt[slug]} notify={notify} />
            )}
            {tab === "security" && <SecurityTab connector={connector} connected={connected} notify={notify} />}
          </div>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-2 rounded-xl border px-4 py-3 text-[13px] shadow-lg ${
            notice.tone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          {notice.tone === "error" ? (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <span>{notice.text}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)} className="ml-1 text-slate-400 hover:text-slate-700">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Side panel ------------------------------ */

function SidePanel({
  connector,
  connected,
  onConnect,
  onDisconnect,
  notify,
}: {
  connector: Connector;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  notify: Notify;
}) {
  const [confirming, setConfirming] = useState(false);
  const [reported, setReported] = useState(false);
  const meta = "text-[10px] font-semibold uppercase tracking-wider text-slate-400";

  return (
    <aside className="space-y-5">
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl shadow-[0_10px_30px_-12px_rgba(61,45,240,0.45)] lg:aspect-square"
        style={{ background: `linear-gradient(145deg, ${connector.tile[0]}, ${connector.tile[1]})` }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span className="relative text-[96px] font-black leading-none text-white drop-shadow-sm">{connector.glyph}</span>
      </div>

      {!connected && (
        <button
          type="button"
          onClick={onConnect}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0040DF] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0035b8]"
        >
          Connect {connector.name} <ArrowRight className="h-4 w-4" />
        </button>
      )}

      <div className="space-y-4 border-t border-slate-200 pt-4">
        <div>
          <p className={meta}>Supported Languages</p>
          <p className="mt-1 text-[13px] text-slate-800">{connector.languages}</p>
        </div>
        <div>
          <p className={meta}>Pricing</p>
          <p className="mt-1 text-[13px] text-slate-800">
            {connector.pricing.text} <span className="text-[11px] text-slate-500">{connector.pricing.note}</span>
          </p>
        </div>
        <div>
          <p className={meta}>Action Required</p>
          <p className="mt-1 text-[13px] text-slate-800">{connector.actionRequired}</p>
        </div>
        <div>
          <p className={meta}>Categories</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {connector.categories.map((c, i) => (
              <span
                key={c}
                className={`rounded-md border px-2.5 py-1 text-[11px] font-medium ${
                  i === 0 ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-200 pt-4">
        <p className="text-[11px] leading-relaxed text-slate-500">
          FintechConnect reviews connector listings for compliance, security, and ledger accuracy. {connector.name} is an independent
          financial infrastructure provider and this connection is encrypted via SOC-2 Type II certified mutual TLS.
        </p>
        <button
          type="button"
          disabled={reported}
          onClick={() => {
            setReported(true);
            notify("Thanks — our partner team will review this listing.");
          }}
          className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 disabled:cursor-default disabled:text-emerald-600"
        >
          {reported ? <Check className="h-3.5 w-3.5" /> : <Flag className="h-3.5 w-3.5" />}
          {reported ? "Report sent" : "Report this connector"}
        </button>
      </div>

      {connected && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-rose-600">
            <TriangleAlert className="h-4 w-4" /> Disconnect Provider
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
            Disconnecting will immediately halt real-time transaction ingestion and webhook ledger posting.
          </p>
          {confirming ? (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  onDisconnect();
                }}
                className="h-9 flex-1 rounded-lg bg-rose-600 text-[12px] font-semibold text-white hover:bg-rose-700"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="h-9 flex-1 rounded-lg border border-slate-200 bg-white text-[12px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-rose-100 bg-white text-[12px] font-semibold text-rose-600 hover:bg-rose-50"
            >
              <Unlink className="h-3.5 w-3.5" /> Disconnect {connector.name}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

/* ----------------------------- Description tab ---------------------------- */

const STATUS_STYLES: Record<FeedStatus, string> = {
  Settled: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "In Transit": "border-blue-200 bg-blue-50 text-blue-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Failed: "border-rose-200 bg-rose-50 text-rose-700",
};

const TONE_STYLES: Record<FeatureTone, string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-600",
  violet: "border-violet-100 bg-violet-50 text-violet-600",
  amber: "border-amber-100 bg-amber-50 text-amber-600",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-600",
  rose: "border-rose-100 bg-rose-50 text-rose-600",
  sky: "border-sky-100 bg-sky-50 text-sky-600",
};

const FEATURE_ICONS: Record<FeatureIcon, React.ComponentType<{ className?: string }>> = {
  card: CreditCard,
  payout: Send,
  dispute: ShieldAlert,
  stream: CodeXml,
  vault: KeyRound,
  bank: Landmark,
  identity: ScanFace,
  ledger: Receipt,
  fraud: Activity,
  limits: Scale,
};

function DescriptionTab({ connector, notify, onConfigure }: { connector: Connector; notify: Notify; onConfigure: () => void }) {
  return (
    <div className="space-y-10">
      <GatewayCard connector={connector} notify={notify} onConfigure={onConfigure} />

      <div>
        <h2 className="max-w-3xl text-[20px] font-bold leading-snug text-slate-900">{connector.headline}</h2>
        <div className="mt-4 max-w-3xl space-y-4 text-[13px] leading-relaxed text-slate-600">
          {connector.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[14px] font-bold text-slate-900">What This Connector Helps You Do</h3>
        <div className="space-y-3">
          {connector.features.map((f) => {
            const Icon = FEATURE_ICONS[f.icon];
            return (
              <div key={f.title} className={`${card} flex items-start gap-4 px-5 py-4`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${TONE_STYLES[f.tone]}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">{f.title}</p>
                  <p className="mt-0.5 text-[12px] text-slate-500">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GatewayCard({ connector, notify, onConfigure }: { connector: Connector; notify: Notify; onConfigure: () => void }) {
  const [rows, setRows] = useState<FeedRow[]>(connector.feed);
  const [expanded, setExpanded] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [testing, setTesting] = useState(false);

  const testWebhook = () => {
    if (testing) return;
    setTesting(true);
    const id = `evt_test_${randomToken(10)}`;
    setRows((prev) => [
      {
        rail: "TEST",
        id,
        sub: "Test webhook — signature verified",
        amount: "$0.00 USD",
        positive: true,
        fee: "$0.00",
        feeNote: "",
        status: "Pending",
        when: "Just now",
      },
      ...prev,
    ]);
    setTimeout(() => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Settled" } : r)));
      setTesting(false);
      notify(`Test webhook delivered and posted to the ledger (${id}).`);
    }, 1200);
  };

  const latest = rows[0];
  const payload = latest
    ? JSON.stringify(
        { id: latest.id, rail: latest.rail, description: latest.sub, amount: latest.amount, fee: latest.fee, status: latest.status, listener: connector.gateway.listener },
        null,
        2,
      )
    : "{}";

  const body = (
    <div className={`${card} flex flex-col overflow-hidden ${expanded ? "h-full" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </span>
          <span className="text-[12px] font-semibold text-slate-700">{connector.gateway.label}</span>
          <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-700">
            Live Websocket
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0040DF]" /> Listening: {connector.gateway.listener}
          </span>
          <button
            type="button"
            onClick={testWebhook}
            disabled={testing}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {testing ? "Sending…" : "Test Webhook"}
          </button>
        </div>
      </div>

      <div className={`overflow-x-auto ${expanded ? "flex-1 overflow-y-auto" : ""}`}>
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-2.5 font-semibold">Event ID &amp; Rail</th>
              <th className="px-4 py-2.5 font-semibold">{connector.gateway.columns[0]}</th>
              <th className="px-4 py-2.5 font-semibold">{connector.gateway.columns[1]}</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 text-right font-semibold">{connector.gateway.columns[2]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="text-[12px]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-500">{r.rail}</span>
                    <span className="font-medium text-slate-800">{r.id}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">{r.sub}</p>
                </td>
                <td className={`px-4 py-3 font-medium ${r.positive ? "text-emerald-600" : "text-slate-800"}`}>{r.amount}</td>
                <td className="px-4 py-3 text-slate-700">
                  {r.fee} <span className="text-[10px] text-slate-400">{r.feeNote}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-right text-slate-500">{r.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPayload && (
        <pre className="max-h-56 overflow-auto border-t border-slate-100 bg-slate-900 px-4 py-3 text-[11px] leading-relaxed text-slate-100">{payload}</pre>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Show latest event payload"
            aria-pressed={showPayload}
            onClick={() => setShowPayload((v) => !v)}
            className={`rounded-md p-1.5 hover:bg-slate-100 ${showPayload ? "text-[#0040DF]" : "text-slate-400"}`}
          >
            <CodeXml className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Refresh feed"
            onClick={() => {
              setRows(connector.feed);
              notify("Event feed refreshed.");
            }}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onConfigure}
            className="ml-2 rounded-md bg-[#0040DF] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0035b8]"
          >
            Ask to configure
          </button>
        </div>
        <button
          type="button"
          title={expanded ? "Exit full screen" : "Full screen"}
          onClick={() => setExpanded((v) => !v)}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
        >
          {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  if (!expanded) return body;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setExpanded(false)} />
      <div className="fixed inset-4 z-50 md:inset-10">{body}</div>
    </>
  );
}

/* --------------------------- Configurations tab -------------------------- */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#0040DF]" : "bg-slate-300"}`}
    >
      <span data-theme-keep className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function ConfigurationsTab({
  connector,
  saved,
  savedAt,
  notify,
}: {
  connector: Connector;
  saved: ConnectorConfig;
  savedAt: number | undefined;
  notify: Notify;
}) {
  const [draft, setDraft] = useState<ConnectorConfig>(saved);
  const [revealSecret, setRevealSecret] = useState(false);
  const [testState, setTestState] = useState<{ status: "idle" | "running" | "ok" | "warn"; text?: string }>({ status: "idle" });
  const [adding, setAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ event: "", text: "" });

  const set = <K extends keyof ConnectorConfig>(key: K, value: ConnectorConfig[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const copy = async (value: string, what: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notify(`${what} copied to clipboard.`);
    } catch {
      notify(`Couldn't copy the ${what.toLowerCase()}.`, "error");
    }
  };

  const testCredentials = () => {
    setTestState({ status: "running" });
    setTimeout(() => {
      if (!draft.secretKey.trim()) {
        setTestState({ status: "warn", text: "Add a secret key before testing the connection." });
      } else if (draft.environment === "production" && /test/i.test(draft.secretKey)) {
        setTestState({ status: "warn", text: "Test key detected — use a live key with the Production / Live Rail." });
      } else {
        const ms = 90 + Math.floor(Math.random() * 120);
        setTestState({ status: "ok", text: `Mutual TLS handshake succeeded · ${ms} ms round trip` });
      }
    }, 900);
  };

  const addEvent = () => {
    const event = newEvent.event.trim();
    if (!event) return;
    if (draft.webhooks.some((w) => w.event === event)) {
      notify(`${event} is already in the matrix.`, "error");
      return;
    }
    set("webhooks", [...draft.webhooks, { event, text: newEvent.text.trim() || "Custom event — posts to the default ledger topic", subscribed: true, custom: true }]);
    setNewEvent({ event: "", text: "" });
    setAdding(false);
  };

  const save = () => {
    if (!draft.alias.trim() || !draft.secretKey.trim()) {
      notify("Connection alias and secret key are required.", "error");
      return;
    }
    if (saveConfig(connector.slug, draft)) notify("Configuration saved.");
    else notify("Couldn't save. Browser storage may be full.", "error");
  };

  const segment = (active: boolean) =>
    `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
      active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
    }`;

  return (
    <div className="space-y-6">
      {/* Environment */}
      <section className={`${card} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={sectionTitle}>Environment &amp; Sync Mode</h2>
            <p className={sectionSub}>Choose the runtime rail and streaming mode for processing webhook events.</p>
          </div>
          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button type="button" className={segment(draft.environment === "sandbox")} onClick={() => set("environment", "sandbox")}>
              {draft.environment === "sandbox" && <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" />} Sandbox (Testmode)
            </button>
            <button type="button" className={segment(draft.environment === "production")} onClick={() => set("environment", "production")}>
              {draft.environment === "production" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />} Production / Live Rail
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                Real-time Event Streaming (Kafka)
                <span
                  className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                    draft.streaming ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {draft.streaming ? "Active" : "Paused"}
                </span>
              </p>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Dispatches {connector.name} webhook events directly into the fintech ledger pipeline with zero polling latency.
              </p>
            </div>
          </div>
          <Toggle checked={draft.streaming} onChange={(v) => set("streaming", v)} label="Real-time event streaming" />
        </div>
      </section>

      {/* Credentials */}
      <section className={`${card} p-5`}>
        <h2 className={sectionTitle}>Authentication &amp; API Credentials</h2>
        <p className={sectionSub}>Configure client keys and server secrets used to negotiate mutual TLS sessions with {connector.name}.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="cfg-alias">Connection Alias</label>
            <input id="cfg-alias" className={inputCls} value={draft.alias} onChange={(e) => set("alias", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="cfg-pk">{connector.credentials.publishableLabel}</label>
            <div className="relative">
              <input id="cfg-pk" className={`${inputCls} pr-16`} value={draft.publishableKey} onChange={(e) => set("publishableKey", e.target.value)} />
              <button
                type="button"
                onClick={() => copy(draft.publishableKey, "Key")}
                className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-[#0040DF] hover:bg-blue-50"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-800" htmlFor="cfg-sk">
              {connector.credentials.secretLabel}
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                Format Valid ({connector.credentials.secretFormat})
              </span>
            </label>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Lock className="h-3 w-3" /> Stored in AWS KMS HSM vault
            </span>
          </div>
          <div className="relative">
            <input
              id="cfg-sk"
              className={`${inputCls} pr-10 font-mono text-[12px]`}
              value={revealSecret ? draft.secretKey : maskSecret(draft.secretKey)}
              readOnly={!revealSecret}
              onChange={(e) => set("secretKey", e.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              aria-label={revealSecret ? "Hide secret key" : "Show secret key"}
              onClick={() => setRevealSecret((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              {revealSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls} htmlFor="cfg-whsec">Webhook Signing Secret</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input id="cfg-whsec" className={`${inputCls} font-mono text-[12px]`} value={draft.webhookSecret} readOnly spellCheck={false} />
            <button
              type="button"
              onClick={() => {
                set("webhookSecret", rotateKey(draft.webhookSecret));
                notify("New webhook secret generated. Save to apply it.");
              }}
              className="h-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100"
            >
              Regenerate Webhook Secret
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={testCredentials}
            disabled={testState.status === "running"}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-[12px] font-semibold text-[#0040DF] hover:bg-blue-100 disabled:opacity-60"
          >
            <Zap className={`h-3.5 w-3.5 ${testState.status === "running" ? "animate-pulse" : ""}`} />
            {testState.status === "running" ? "Testing…" : "Test Connection Credentials"}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft((d) => ({ ...d, publishableKey: rotateKey(d.publishableKey), secretKey: rotateKey(d.secretKey) }));
              setTestState({ status: "idle" });
              notify("API keys rotated. Save to apply them.");
            }}
            className="h-9 px-2 text-[12px] font-medium text-slate-700 hover:text-slate-900"
          >
            Rotate API Keys
          </button>
          {(testState.status === "ok" || testState.status === "warn") && (
            <span className={`flex items-center gap-1.5 text-[12px] ${testState.status === "ok" ? "text-emerald-600" : "text-amber-600"}`}>
              {testState.status === "ok" ? <Check className="h-3.5 w-3.5" /> : <TriangleAlert className="h-3.5 w-3.5" />}
              {testState.text}
            </span>
          )}
        </div>
      </section>

      {/* Ledger */}
      <section className={`${card} p-5`}>
        <h2 className={sectionTitle}>Ledger Reconciliation &amp; Reserve Rules</h2>
        <p className={sectionSub}>Define settlement currencies, omnibus reserve routing, and dispute escrow mechanisms.</p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="cfg-asset">Default Settlement Asset / Currency</label>
            <select id="cfg-asset" className={inputCls} value={draft.asset} onChange={(e) => set("asset", e.target.value)}>
              {SETTLEMENT_ASSETS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="cfg-account">Target BaaS Ledger Account</label>
            <select id="cfg-account" className={inputCls} value={draft.account} onChange={(e) => set("account", e.target.value)}>
              {LEDGER_ACCOUNTS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="cfg-schedule">Settlement Schedule</label>
            <select id="cfg-schedule" className={inputCls} value={draft.schedule} onChange={(e) => set("schedule", e.target.value)}>
              {SETTLEMENT_SCHEDULES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2.5 text-[12px] text-slate-700">
            <input
              type="checkbox"
              checked={draft.quarantineDisputes}
              onChange={(e) => set("quarantineDisputes", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-[#0040DF]"
            />
            Automatically quarantine disputed funds in Escrow Sub-ledger
          </label>
        </div>
      </section>

      {/* Webhooks */}
      <section className={`${card} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={sectionTitle}>Webhook Event Subscriptions Matrix</h2>
            <p className={sectionSub}>Manage granular webhook subscriptions routed to ledger event consumers.</p>
          </div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-9 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 text-[12px] font-semibold text-[#0040DF] hover:bg-blue-100"
          >
            Add Custom Webhook Event <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          {draft.webhooks.map((w, i) => (
            <div key={w.event} className={`flex items-center justify-between gap-3 px-4 py-3 ${i % 2 ? "bg-slate-50/70" : "bg-white"} ${i ? "border-t border-slate-100" : ""}`}>
              <div className="flex min-w-0 items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${w.subscribed ? "bg-[#0040DF]" : "bg-slate-300"}`} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-slate-900">{w.event}</p>
                  <p className="truncate text-[11px] text-slate-500">{w.text}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-pressed={w.subscribed}
                  title={w.subscribed ? "Click to pause this event" : "Click to subscribe"}
                  onClick={() => set("webhooks", draft.webhooks.map((x) => (x.event === w.event ? { ...x, subscribed: !x.subscribed } : x)))}
                  className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                    w.subscribed ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {w.subscribed ? "Subscribed" : "Paused"}
                </button>
                {w.custom && (
                  <button
                    type="button"
                    aria-label={`Remove ${w.event}`}
                    onClick={() => set("webhooks", draft.webhooks.filter((x) => x.event !== w.event))}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {adding && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-blue-50/40 px-4 py-3 md:flex-row">
              <input
                autoFocus
                placeholder="event.name"
                aria-label="Event name"
                className={`${inputCls} h-9 md:w-56`}
                value={newEvent.event}
                onChange={(e) => setNewEvent((n) => ({ ...n, event: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
              />
              <input
                placeholder="What happens when it fires (optional)"
                aria-label="Event description"
                className={`${inputCls} h-9 flex-1`}
                value={newEvent.text}
                onChange={(e) => setNewEvent((n) => ({ ...n, text: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
              />
              <div className="flex gap-2">
                <button type="button" onClick={addEvent} className="h-9 rounded-lg bg-[#0040DF] px-3 text-[12px] font-semibold text-white hover:bg-[#0035b8]">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setNewEvent({ event: "", text: "" });
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <p className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {savedAt
            ? `Last saved ${new Date(savedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} by ${CURRENT_USER}`
            : "Using the default configuration — not saved yet"}
          {dirty && <span className="ml-2 flex items-center gap-1 text-amber-600"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Unsaved changes</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!dirty}
            onClick={() => {
              setDraft(saved);
              setTestState({ status: "idle" });
              notify("Changes reverted.");
            }}
            className="h-9 rounded-lg px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            Revert Changes
          </button>
          <button type="button" onClick={save} className="h-9 rounded-lg bg-[#0040DF] px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-[#0035b8]">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Security tab ----------------------------- */

function initialAuditLog(name: string) {
  return [
    { at: "2026-10-24 14:32:01 UTC", text: `Handshake verified — Mutual TLS session established with ${name} Edge`, detail: "IP: 54.187.x.x" },
    { at: "2026-10-24 14:15:33 UTC", text: "Secret rotation check — Key signature validated against AWS KMS HSM", detail: "" },
    { at: "2026-10-24 13:58:12 UTC", text: "SOC-2 boundary inspection — 0 unencrypted fields detected in payload dispatch", detail: "" },
  ];
}

function SecurityTab({ connector, connected, notify }: { connector: Connector; connected: boolean; notify: Notify }) {
  const [log, setLog] = useState(() => initialAuditLog(connector.name));
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  const runCheck = () => {
    setChecking(true);
    setTimeout(() => {
      const at = utcStamp();
      setLog((prev) => [{ at, text: `Real-time compliance check — ${connector.scopes.length} scopes, 3 certifications and encryption boundary verified`, detail: "" }, ...prev]);
      setLastCheck(at);
      setChecking(false);
      notify("Compliance check passed. All controls verified.");
    }, 1400);
  };

  const exportLogs = () => {
    downloadFile(
      `${connector.slug}-audit-log.json`,
      JSON.stringify({ connector: connector.name, exportedAt: utcStamp(), hash: "SHA-256", scopes: connector.scopes, entries: log }, null, 2),
      "application/json",
    );
  };

  const downloadAttestation = () => {
    downloadFile(
      `${connector.slug}-soc2-attestation-summary.txt`,
      [
        `SOC-2 Type II attestation summary — ${connector.name}`,
        `Generated: ${utcStamp()}`,
        "",
        "Certifications: SOC-2 Type II, PCI-DSS Level 1, ISO 27001:2022",
        `Transport: TLS 1.3 (${connector.encryption.transport})`,
        `Key management: FIPS 140-2 Level 3 HSM (${connector.encryption.hsm.toLowerCase()})`,
        `Data boundary: ${connector.encryption.boundary}`,
        `Primary region: ${connector.region.primary}`,
      ].join("\n"),
      "text/plain",
    );
  };

  const certs = [
    { title: "SOC-2 Type II", text: "Continuous Security Attestation", Icon: BadgeCheck },
    { title: "PCI-DSS Level 1", text: "Service Provider Certified", Icon: CreditCard },
    { title: "ISO 27001 : 2022", text: "InfoSec Management Standard", Icon: Award },
  ];

  const encryption = [
    {
      title: "Transport Security (TLS 1.3)",
      text: "End-to-end mutual TLS encryption across all inbound webhooks and outbound payment intents. Zero unencrypted payload transit.",
      foot: connector.encryption.transport,
      Icon: Zap,
      tone: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Hardware Security Modules (HSM)",
      text: "Secrets stored in FIPS 140-2 Level 3 compliant hardware enclaves. Keys rotated automatically every 90 days.",
      foot: connector.encryption.hsm,
      Icon: Cpu,
      tone: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      title: "Tokenization & PCI Boundary",
      text: `Raw PANs and CVV data never touch your BaaS servers. ${connector.name} vault tokens are strictly used.`,
      foot: connector.encryption.boundary,
      Icon: Lock,
      tone: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Status banner */}
      <section className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white text-[#0040DF]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-slate-900">
              Compliance Status: Audit Ready &amp; Validated
              {connected ? (
                <span className="rounded-full border border-blue-200 bg-blue-100/70 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Verified Active</span>
              ) : (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Monitoring Paused</span>
              )}
            </p>
            <p className="mt-0.5 max-w-xl text-[12px] text-slate-600">
              {connected
                ? `${connector.name} integration environment satisfies continuous automated compliance monitoring across federal and global banking mandates.`
                : `Connect ${connector.name} to resume continuous automated compliance monitoring for this integration.`}
            </p>
            {lastCheck && <p className="mt-1 text-[11px] font-medium text-emerald-700">Last real-time check passed · {lastCheck}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={runCheck}
          disabled={checking}
          className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-[#0035b8] disabled:opacity-70"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Running Check…" : "Run Real-time Compliance Check"}
        </button>
      </section>

      {/* Certifications */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {certs.map(({ title, text, Icon }) => (
          <div key={title} className={`${card} flex items-center gap-3 p-4`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] font-bold uppercase text-slate-900">{title}</p>
              <p className="text-[11px] text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Encryption */}
      <section>
        <h2 className={sectionTitle}>Encryption &amp; Key Management Architecture</h2>
        <p className={sectionSub}>Hardware-enforced encryption primitives across transit, storage, and token validation boundaries.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {encryption.map(({ title, text, foot, Icon, tone }) => (
            <div key={title} className={`${card} flex flex-col p-4`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-slate-900">{title}</p>
              <p className="mt-1 flex-1 text-[12px] leading-relaxed text-slate-500">{text}</p>
              <p className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] font-medium text-[#0040DF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" /> {foot}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Scopes */}
      <section>
        <h2 className={sectionTitle}>Granted Data Access Scopes &amp; Least-Privilege Model</h2>
        <p className={sectionSub}>Granular OAuth 2.0 scopes constrained to financial reconciliation and automated payouts.</p>
        <div className={`${card} mt-4 overflow-x-auto`}>
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-semibold">Permission Scope</th>
                <th className="px-4 py-3 font-semibold">Description &amp; Operational Boundary</th>
                <th className="px-4 py-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {connector.scopes.map((s) => (
                <tr key={s.scope} className="text-[12px]">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-[#0040DF]">{s.scope}</td>
                  <td className="px-4 py-3 text-slate-600">{s.text}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        s.status === "Mandatory" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit log */}
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={sectionTitle}>Regulatory &amp; Audit Trail Logging</h2>
            <p className={sectionSub}>WORM (Write Once, Read Many) compliance log stream with cryptographic signatures.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadAttestation}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" /> Download SOC-2 Attestation
            </button>
            <button
              type="button"
              onClick={exportLogs}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" /> Export Full Audit Logs (JSON)
            </button>
          </div>
        </div>
        <div className={`${card} mt-4 overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" /> Secure Audit Stream — Immutable Hash Verified
            </p>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">SHA-256 SYNCED</span>
          </div>
          <ul className="max-h-64 space-y-2.5 overflow-y-auto px-4 py-4 text-[12px]">
            {log.map((entry, i) => (
              <li key={`${entry.at}-${i}`} className="text-slate-700">
                <span className="text-[#0040DF]">[{entry.at}]</span> {entry.text}
                {entry.detail && <span className="text-slate-500"> ({entry.detail})</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Data residency */}
      <section>
        <h2 className={sectionTitle}>Data Residency &amp; Legal Jurisdiction</h2>
        <p className={sectionSub}>Geographic boundaries and statutory commitments governing this connection.</p>
        <div className={`${card} mt-4 flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between`}>
          <div>
            <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-900">
              Primary Region: {connector.region.primary}
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">GDPR Compliant</span>
            </p>
            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-slate-600">{connector.region.text}</p>
          </div>
          <span className="flex h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-[#0040DF] md:self-auto">
            <ShieldCheck className="h-3.5 w-3.5" /> DPA Signed &amp; Privacy Shield Active
          </span>
        </div>
      </section>
    </div>
  );
}
