'use client';

import { useSyncExternalStore } from 'react';

/* The plugins a studio user can install, and which ones they have installed (saved in localStorage). */

export type PluginId = 'contrast-auditor' | 'unsplash' | 'pexels' | 'iconify' | 'lottie' | 'mock-data';

export type Plugin = {
  id: PluginId;
  name: string;
  version: string;
  /** Shown as a green pill next to the version. */
  official?: boolean;
  description: string;
  author: string;
  rating: number;
  /** Install count, e.g. "34.1k". */
  installs: string;
  category: string;
};

export const PLUGINS: Plugin[] = [
  {
    id: 'contrast-auditor',
    name: 'Color Contrast & WCAG 2.2 Auditor',
    version: 'v3.1',
    description:
      'Evaluates all high-contrast typography, interactive buttons, and touch-target radii against Section 508 and institutional banking compliance guidelines.',
    author: 'Accessibility Guild',
    rating: 5.0,
    installs: '34.1k',
    category: 'Auditing Active',
  },
  {
    id: 'unsplash',
    name: 'Unsplash Photography',
    version: 'v2.8',
    official: true,
    description:
      'Instant access to over 3 million curated, high-resolution royalty-free photos directly on your canvas. Auto-crops into avatar masks, KYC test personas, and banking promo cards.',
    author: 'Unsplash Official',
    rating: 4.9,
    installs: '84.2k',
    category: 'Stock Photography',
  },
  {
    id: 'pexels',
    name: 'Pexels Stock & Video',
    version: 'v2.1',
    description:
      'Browse free authentic stock photos and looping video backgrounds tailored for modern fintech hero banners, investor decks, and onboarding walk-throughs.',
    author: 'Pexels Team',
    rating: 4.8,
    installs: '52.6k',
    category: 'Royalty-Free Media',
  },
  {
    id: 'iconify',
    name: 'Iconify Universal Icons',
    version: 'v3.0 Pro',
    description:
      'Universal search across 200,000+ open-source vector icons from 150+ icon sets (Lucide, Material Symbols, Feather, Tabler, Phosphor, and FontAwesome). Export as SVG or React JSX tokens.',
    author: 'Iconify Design Guild',
    rating: 5.0,
    installs: '118.5k',
    category: 'Vector Icons',
  },
  {
    id: 'lottie',
    name: 'Lottie Motion Library',
    version: 'v1.6',
    description:
      'Drop lightweight animations straight into your screens: success ticks, card flips, loading spinners and payment confirmations, all recoloured to your theme.',
    author: 'Motion Collective',
    rating: 4.7,
    installs: '41.3k',
    category: 'Animations',
  },
  {
    id: 'mock-data',
    name: 'Banking Mock Data Generator',
    version: 'v2.4',
    official: true,
    description:
      'Fills screens with realistic test data: transactions, IBANs, card numbers, balances and customer personas that follow each locale’s currency and date formats.',
    author: 'Fintech Connect Labs',
    rating: 4.9,
    installs: '29.8k',
    category: 'Test Data',
  },
];

export function findPlugin(id: PluginId) {
  return PLUGINS.find((plugin) => plugin.id === id);
}

/* ------------------------------ Installed list ------------------------------ */

const STORAGE_KEY = 'fintechconnect:studio:plugins:v1';
/** Installed until the user changes anything. */
const DEFAULT_INSTALLED: PluginId[] = ['contrast-auditor', 'lottie', 'mock-data'];

const listeners = new Set<() => void>();
let cache: PluginId[] | null = null;

function load(): PluginId[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as { installed?: unknown }).installed : null;
    cache = Array.isArray(saved)
      ? saved.filter((id): id is PluginId => typeof id === 'string' && PLUGINS.some((p) => p.id === id))
      : DEFAULT_INSTALLED;
  } catch {
    cache = DEFAULT_INSTALLED;
  }
  return cache;
}

function save(next: PluginId[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ installed: next }));
  } catch {
    /* Storage unavailable: the change lasts until reload. */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const NONE: PluginId[] = [];

/** The installed plugin ids, in the order they were installed. */
export function useInstalledPlugins(): PluginId[] {
  return useSyncExternalStore(subscribe, load, () => NONE);
}

export function installPlugin(id: PluginId) {
  const current = load();
  if (!current.includes(id)) save([...current, id]);
}

export function uninstallPlugin(id: PluginId) {
  save(load().filter((item) => item !== id));
}

/** Matches a plugin against a search query (name, description, author or category). */
export function pluginMatches(plugin: Plugin, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [plugin.name, plugin.description, plugin.author, plugin.category].some((text) => text.toLowerCase().includes(q));
}
