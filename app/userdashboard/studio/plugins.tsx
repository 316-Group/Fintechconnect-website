'use client';

/**
 * Studio plugins: the left-hand Plugins panel (opened from the icon rail) listing the
 * installed plugins, and the "Plugins & Integrations Browser" modal opened by
 * "Add more Plugins", where plugins are installed, run and removed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Box, ChevronLeft, CirclePlus, Contrast, Database, Download, EllipsisVertical, LoaderCircle,
  Play, Puzzle, RefreshCw, Search, Sparkles, Star, Trash2, X,
} from 'lucide-react';
import {
  PLUGINS, installPlugin, pluginMatches, uninstallPlugin, useInstalledPlugins,
  type Plugin, type PluginId,
} from './plugins-data';

/* ---------------------------------- Logos ---------------------------------- */

const LOGO_BG: Record<PluginId, string> = {
  'contrast-auditor': '#12A37A',
  unsplash: '#111111',
  pexels: '#05A081',
  iconify: '#1769AA',
  lottie: '#7C3AED',
  'mock-data': '#E8890C',
};

function PluginLogo({ id, size }: { id: PluginId; size: number }) {
  const icon = Math.round(size * 0.46);
  const mark = (() => {
    switch (id) {
      case 'contrast-auditor':
        return <Contrast style={{ width: icon, height: icon }} strokeWidth={2.4} />;
      case 'unsplash':
        return (
          <svg viewBox="0 0 24 24" style={{ width: icon, height: icon }} aria-hidden="true">
            <path d="M8.5 3h7v5h-7z M3 10.5h6v5h6v-5h6V21H3z" fill="currentColor" />
          </svg>
        );
      case 'pexels':
        return <span style={{ fontSize: Math.round(size * 0.46) }} className="font-extrabold leading-none">P</span>;
      case 'iconify':
        return <Box style={{ width: icon, height: icon }} strokeWidth={2.2} />;
      case 'lottie':
        return <Sparkles style={{ width: icon, height: icon }} strokeWidth={2.2} />;
      case 'mock-data':
        return <Database style={{ width: icon, height: icon }} strokeWidth={2.2} />;
    }
  })();
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center text-white"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.24), background: LOGO_BG[id] }}
    >
      {mark}
    </span>
  );
}

/* ------------------------------ Running plugins ----------------------------- */

const RUN_TIME_MS = 1400;

/** Which plugin is running right now (shared by the panel and the browser). */
function useRunner(onNotice: (message: string) => void) {
  const [runningId, setRunningId] = useState<PluginId | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const run = (plugin: Plugin) => {
    if (timer.current) clearTimeout(timer.current);
    setRunningId(plugin.id);
    timer.current = setTimeout(() => {
      setRunningId(null);
      onNotice(`${plugin.name} ran on this page`);
    }, RUN_TIME_MS);
  };
  return { runningId, run };
}

/** Ctrl/⌘ + / focuses this search box while it is on screen. */
function useSearchShortcut(input: React.RefObject<HTMLInputElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [input, enabled]);
}

/* ------------------------------- Left panel -------------------------------- */

export function PluginsPanel({
  onNotice,
  onCollapse,
  modalClassName = '',
}: {
  /** Shows a short message at the bottom of the studio. */
  onNotice: (message: string) => void;
  onCollapse: () => void;
  /** Extra classes for the browser modal (e.g. the studio font, as it renders outside the studio tree). */
  modalClassName?: string;
}) {
  const installedIds = useInstalledPlugins();
  const [query, setQuery] = useState('');
  const [browserOpen, setBrowserOpen] = useState(false);
  const { runningId, run } = useRunner(onNotice);
  const searchRef = useRef<HTMLInputElement>(null);
  useSearchShortcut(searchRef, !browserOpen);

  const installed = installedIds
    .map((id) => PLUGINS.find((plugin) => plugin.id === id))
    .filter((plugin): plugin is Plugin => !!plugin);
  const shown = installed.filter((plugin) => pluginMatches(plugin, query));

  return (
    <aside className="relative flex w-full min-w-0 flex-col border-r border-slate-200 bg-[#EDEFFC]">
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
        <Puzzle className="h-3.5 w-3.5 text-[#0040DF]" />
        <span className="flex-1 text-[12px] font-bold uppercase tracking-wider text-[#0040DF]">Plugins</span>
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{installed.length}</span>
        <button
          type="button"
          title="Collapse left panel"
          aria-label="Collapse left panel"
          onClick={onCollapse}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-[#0040DF]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pb-1 pt-3">
        <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus-within:border-[#0040DF]/50">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search plugins…"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400"
          />
          <kbd className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-medium text-slate-400">⌘/</kbd>
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin-blue [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#0040DF] shadow-sm">
              <Puzzle className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[12px] font-semibold text-slate-800">
              {installed.length === 0 ? 'No plugins installed yet' : 'No plugins match your search'}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {installed.length === 0
                ? 'Add photo libraries, icon sets, auditors and more to your studio.'
                : 'Try another name, or browse more plugins below.'}
            </p>
          </div>
        ) : (
          <ul className="m-0 list-none space-y-1 p-0 pt-2">
            {shown.map((plugin) => {
              const running = runningId === plugin.id;
              return (
                <li key={plugin.id} className="rounded-xl px-1 py-2.5 transition-colors hover:bg-white/60">
                  <div className="flex items-center gap-2">
                    <PluginLogo id={plugin.id} size={22} />
                    <span className="min-w-0 truncate text-[13px] font-bold text-slate-900">{plugin.name}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-[1.45] text-slate-600">{plugin.description}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-[10px] text-slate-500">
                      By <span className="font-medium text-slate-700">{plugin.author}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => run(plugin)}
                      disabled={running}
                      className="flex shrink-0 items-center gap-1 text-[10.5px] font-semibold text-[#0040DF] hover:text-[#002db3] disabled:opacity-70"
                    >
                      {running ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                      {running ? 'Running…' : 'Run Plugin'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={() => setBrowserOpen(true)}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0035b8]"
        >
          <CirclePlus className="h-3.5 w-3.5" /> Add more Plugins
        </button>
      </div>

      {browserOpen && (
        <PluginsBrowser
          className={modalClassName}
          runningId={runningId}
          onRun={run}
          onNotice={onNotice}
          onClose={() => setBrowserOpen(false)}
        />
      )}
    </aside>
  );
}

/* ------------------------------ Browser modal ------------------------------ */

const INSTALL_TIME_MS = 700;

function PluginsBrowser({
  className,
  runningId,
  onRun,
  onNotice,
  onClose,
}: {
  className: string;
  runningId: PluginId | null;
  onRun: (plugin: Plugin) => void;
  onNotice: (message: string) => void;
  onClose: () => void;
}) {
  const installedIds = useInstalledPlugins();
  const [filter, setFilter] = useState<'all' | 'installed'>('all');
  const [query, setQuery] = useState('');
  const [installing, setInstalling] = useState<PluginId | null>(null);
  const [menuFor, setMenuFor] = useState<PluginId | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useSearchShortcut(searchRef);

  useEffect(() => {
    searchRef.current?.focus();
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Escape closes an open row menu first, then the browser.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      if (menuFor) setMenuFor(null);
      else onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [menuFor, onClose]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const install = (plugin: Plugin) => {
    setInstalling(plugin.id);
    later(() => {
      installPlugin(plugin.id);
      setInstalling(null);
      onNotice(`${plugin.name} installed: it's now in your Plugins panel`);
    }, INSTALL_TIME_MS);
  };

  const remove = (plugin: Plugin) => {
    setMenuFor(null);
    uninstallPlugin(plugin.id);
    onNotice(`${plugin.name} removed`);
  };

  const refresh = () => {
    setRefreshing(true);
    later(() => setRefreshing(false), 600);
  };

  const visible = PLUGINS.filter(
    (plugin) => (filter === 'all' || installedIds.includes(plugin.id)) && pluginMatches(plugin, query),
  );

  const tab = (id: 'all' | 'installed', label: string, count: number) => {
    const active = filter === id;
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => setFilter(id)}
        className={`flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors ${
          active ? 'bg-[#0040DF] text-white' : 'bg-[#E9EAF0] text-slate-700 hover:bg-[#DFE1EA]'
        }`}
      >
        {label}
        <span
          className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold ${
            active ? 'bg-white/20 text-white' : 'bg-[#D5D8E2] text-slate-600'
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className={`${className} fixed inset-0 z-[400] flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plugins-browser-title"
        className="relative flex max-h-[90vh] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-[#F8F9FC] shadow-[0_24px_64px_rgba(15,23,42,0.28)] ring-1 ring-slate-200"
        onClick={() => setMenuFor(null)}
      >
        {/* Header */}
        <div className="flex items-start gap-3.5 px-7 pb-4 pt-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0040DF] text-white">
            <Puzzle className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="plugins-browser-title" className="text-[22px] font-semibold leading-tight text-slate-900">
              Plugins &amp; Integrations Browser
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-600">
              Extend white-label banking canvases with our array of plugins and asset libraries
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title="Refresh"
              aria-label="Refresh plugins"
              onClick={refresh}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
            >
              <RefreshCw className={`h-[18px] w-[18px] ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              title="Close"
              aria-label="Close"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="px-7">
          <label className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-[#0040DF]/60 focus-within:ring-2 focus-within:ring-[#0040DF]/10">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search installed and community plugins (⌘/)..."
              className="min-w-0 flex-1 bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
            />
            <span className="flex shrink-0 items-center gap-1.5">
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">⌘</kbd>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">/</kbd>
            </span>
          </label>
          <div role="tablist" aria-label="Filter plugins" className="mt-4 flex items-center gap-2">
            {tab('all', 'All', PLUGINS.length)}
            {tab('installed', 'Installed', installedIds.length)}
          </div>
        </div>

        {/* Plugin list */}
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-7 pb-7 scrollbar-thin-blue [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-[14px] font-semibold text-slate-800">
                {filter === 'installed' && installedIds.length === 0 ? 'No plugins installed yet' : 'No plugins found'}
              </p>
              <p className="mt-1 text-[12.5px] text-slate-500">
                {filter === 'installed' && installedIds.length === 0
                  ? 'Install one from the All tab to see it here.'
                  : 'Try a different search.'}
              </p>
            </div>
          ) : (
            <ul className="m-0 list-none space-y-3 p-0">
              {visible.map((plugin) => (
                <PluginRow
                  key={plugin.id}
                  plugin={plugin}
                  installed={installedIds.includes(plugin.id)}
                  installing={installing === plugin.id}
                  running={runningId === plugin.id}
                  menuOpen={menuFor === plugin.id}
                  onInstall={() => install(plugin)}
                  onRun={() => onRun(plugin)}
                  onToggleMenu={() => setMenuFor((current) => (current === plugin.id ? null : plugin.id))}
                  onRemove={() => remove(plugin)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PluginRow({
  plugin, installed, installing, running, menuOpen, onInstall, onRun, onToggleMenu, onRemove,
}: {
  plugin: Plugin;
  installed: boolean;
  installing: boolean;
  running: boolean;
  menuOpen: boolean;
  onInstall: () => void;
  onRun: () => void;
  onToggleMenu: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-start">
      <PluginLogo id={plugin.id} size={52} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[16px] font-semibold text-slate-900">{plugin.name}</h3>
          <span className="rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[11px] font-semibold text-[#0040DF]">{plugin.version}</span>
          {plugin.official && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              Official
            </span>
          )}
        </div>
        <p className="mt-1.5 max-w-[620px] text-[13.5px] leading-relaxed text-slate-600">{plugin.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-500">
          <span>
            By <span className="font-medium text-slate-800">{plugin.author}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-amber-500">{plugin.rating.toFixed(1)}</span>
            <span>({plugin.installs} installs)</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11.5px] text-slate-600">{plugin.category}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {installed ? (
          <>
            <button
              type="button"
              onClick={onRun}
              disabled={running}
              className="flex h-9 w-[94px] items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] text-[12.5px] font-medium text-white transition-colors hover:bg-[#0035b8] disabled:opacity-80"
            >
              {running ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              {running ? 'Running' : 'Run'}
            </button>
            <div className="relative" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                title="More options"
                aria-label={`More options for ${plugin.name}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={onToggleMenu}
                className="grid h-9 w-9 place-items-center rounded-lg bg-[#E3E8FA] text-slate-700 transition-colors hover:bg-[#D6DEFA]"
              >
                <EllipsisVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 top-10 z-10 w-44 rounded-lg bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { onToggleMenu(); onRun(); }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-slate-700 hover:bg-slate-100"
                  >
                    <Play className="h-3.5 w-3.5" /> Run plugin
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onRemove}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Uninstall
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={onInstall}
            disabled={installing}
            className="flex h-9 w-[132px] items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] text-[12.5px] font-medium text-white transition-colors hover:bg-[#0035b8] disabled:opacity-80"
          >
            {installing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {installing ? 'Installing…' : 'Install'}
          </button>
        )}
      </div>
    </li>
  );
}
