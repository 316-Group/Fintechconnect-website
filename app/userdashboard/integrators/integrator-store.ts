"use client";

import { useSyncExternalStore } from "react";
import { defaultSettings, findIntegrator, type IntegratorSettings } from "./integrators-data";

/* Which integrators are switched on, and their settings, kept in localStorage
   so the toggles survive reloads. */

const STORAGE_KEY = "fintechconnect:integrators:v1";

export type IntegratorState = {
  connected: Record<string, boolean>;
  settings: Record<string, IntegratorSettings>;
  /** When each integrator was last switched on (ms). */
  connectedAt: Record<string, number>;
};

const EMPTY: IntegratorState = { connected: {}, settings: {}, connectedAt: {} };

let state: IntegratorState | null = null;
const listeners = new Set<() => void>();

function load(): IntegratorState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<IntegratorState>;
    return {
      connected: parsed.connected ?? {},
      settings: parsed.settings ?? {},
      connectedAt: parsed.connectedAt ?? {},
    };
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  if (!state) state = load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    state = load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returns false if the browser refused to store the change (it still applies for this visit). */
function update(fn: (prev: IntegratorState) => IntegratorState): boolean {
  state = fn(getSnapshot());
  listeners.forEach((l) => l());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function useIntegratorState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function isConnected(s: IntegratorState, slug: string) {
  return s.connected[slug] ?? findIntegrator(slug)?.connectedByDefault ?? false;
}

export function settingsFor(s: IntegratorState, slug: string): IntegratorSettings {
  const integrator = findIntegrator(slug);
  if (!integrator) throw new Error(`Unknown integrator ${slug}`);
  const defaults = defaultSettings(integrator);
  const saved = s.settings[slug];
  return saved ? { ...defaults, ...saved, options: { ...defaults.options, ...saved.options } } : defaults;
}

export function setConnected(slug: string, connected: boolean) {
  return update((prev) => ({
    ...prev,
    connected: { ...prev.connected, [slug]: connected },
    connectedAt: connected ? { ...prev.connectedAt, [slug]: Date.now() } : prev.connectedAt,
  }));
}

export function saveSettings(slug: string, settings: IntegratorSettings) {
  return update((prev) => ({ ...prev, settings: { ...prev.settings, [slug]: settings } }));
}
