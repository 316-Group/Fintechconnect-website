"use client";

import { useSyncExternalStore } from "react";
import { CONNECTORS, defaultConfig, findConnector, type ConnectorConfig } from "./connectors-data";

/* Connection status and saved configuration for each connector, kept in
   localStorage so it survives reloads and is shared between the directory
   page and the detail sub-pages. */

const STORAGE_KEY = "fintechconnect:connectors:v1";

type SavedState = {
  connected: Record<string, boolean>;
  config: Record<string, ConnectorConfig>;
  savedAt: Record<string, number>;
};

const EMPTY: SavedState = { connected: {}, config: {}, savedAt: {} };

let state: SavedState | null = null;
const listeners = new Set<() => void>();

function load(): SavedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      connected: parsed.connected ?? {},
      config: parsed.config ?? {},
      savedAt: parsed.savedAt ?? {},
    };
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): SavedState {
  if (!state) state = load();
  return state;
}

function getServerSnapshot(): SavedState {
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

/** Returns false if the browser refused to store the change. */
function update(fn: (prev: SavedState) => SavedState): boolean {
  state = fn(getSnapshot());
  listeners.forEach((l) => l());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function useConnectorState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function isConnected(saved: SavedState, slug: string): boolean {
  return saved.connected[slug] ?? findConnector(slug)?.connectedByDefault ?? false;
}

export function connectedCount(saved: SavedState): number {
  return CONNECTORS.filter((c) => isConnected(saved, c.slug)).length;
}

export function savedConfig(saved: SavedState, slug: string): ConnectorConfig {
  const stored = saved.config[slug];
  const connector = findConnector(slug);
  if (!connector) throw new Error(`Unknown connector ${slug}`);
  return stored ? { ...defaultConfig(connector), ...stored } : defaultConfig(connector);
}

export function setConnected(slug: string, connected: boolean) {
  return update((prev) => ({ ...prev, connected: { ...prev.connected, [slug]: connected } }));
}

export function saveConfig(slug: string, config: ConnectorConfig) {
  return update((prev) => ({
    ...prev,
    config: { ...prev.config, [slug]: config },
    savedAt: { ...prev.savedAt, [slug]: Date.now() },
  }));
}
