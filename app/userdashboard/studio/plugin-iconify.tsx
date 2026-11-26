'use client';

/**
 * The Iconify plugin: browse and search the open-source icon sets on the public Iconify API
 * (Lucide, Material Symbols, Tabler, Phosphor, MDI and 250+ more), then drag an icon onto the
 * canvas, add it to the page, or copy it as SVG markup or a React component.
 *
 * How icons are found:
 * - With a set picked, its full list of names is downloaded once (`/collection?prefix=`) and
 *   searched here, so every icon in the set is available (Lucide 2,000+, MDI 7,000+, ...).
 * - With "All sets", typing uses `/search`, which the public API caps at 128 matches.
 * Icons are drawn as they scroll into view; their shapes come from `/{prefix}.json?icons=…`,
 * one request per set per batch of names, and the SVGs are then built here.
 * API reference: https://iconify.design/docs/api/
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Check, ChevronLeft, ClipboardCopy, Code2, LoaderCircle, PanelLeftClose, Plus, RefreshCw, Search } from 'lucide-react';
import { startAssetDrag } from './assettab';
import type { LottieSpec } from './lottie-presets';

/**
 * An image a plugin adds to the page. `url` is a data URL (icons, so the build works offline)
 * or an https link to a hotlinked stock photo.
 */
export type PluginImage = {
  name: string;
  url: string;
  w: number;
  h: number;
  /**
   * Set for single-colour icons: they are placed recolourable, starting in this colour.
   * On a built-in Lottie animation it is the colour the animation is drawn in.
   */
  iconColor?: string;
  /** Set for Lottie animations: the canvas plays this instead of showing `url`. */
  lottie?: LottieSpec;
};

const API = 'https://api.iconify.design';
/** The most results the public API's search returns, whatever `limit` asks for. */
const SEARCH_LIMIT = 128;
const SEARCH_DELAY_MS = 300;
/** Icons drawn per step as the list scrolls. */
const PAGE_SIZE = 160;
/** Icon names per shapes request, to keep URLs short. */
const NAMES_PER_REQUEST = 100;
/** Shape requests in flight at once: the API rate-limits bursts. */
const MAX_PARALLEL = 4;

const POPULAR_SETS: { prefix: string; label: string }[] = [
  { prefix: '', label: 'All sets' },
  { prefix: 'lucide', label: 'Lucide' },
  { prefix: 'material-symbols', label: 'Material' },
  { prefix: 'tabler', label: 'Tabler' },
  { prefix: 'ph', label: 'Phosphor' },
  { prefix: 'mdi', label: 'MDI' },
  { prefix: 'fa6-solid', label: 'Font Awesome' },
  { prefix: 'logos', label: 'Brand logos' },
];

/** Browsed when "All sets" is picked and the search box is empty. */
const BROWSE_SET = 'lucide';

/** Shown first while browsing: icons a banking or payments app usually needs. */
const STARTER_ICONS = [
  'wallet', 'credit-card', 'landmark', 'banknote', 'piggy-bank',
  'send', 'arrow-left-right', 'arrow-down-left', 'arrow-up-right', 'receipt',
  'chart-line', 'chart-pie', 'shield-check', 'lock', 'fingerprint',
  'scan-face', 'qr-code', 'bell', 'user', 'users',
  'globe', 'coins', 'bitcoin', 'hand-coins', 'circle-dollar-sign',
  'euro', 'pound-sterling', 'percent', 'calendar', 'settings',
];

const SIZES = [16, 20, 24, 32, 48, 64];
const HEX = /^#[0-9a-f]{6}$/i;

type Collection = { name: string; total?: number; hidden?: boolean; license?: { title?: string; url?: string } };

/** An icon's shape: its SVG body and view box. */
type IconShape = { body: string; left: number; top: number; width: number; height: number };

type RawIcon = { body?: string; left?: number; top?: number; width?: number; height?: number };
type IconSetResponse = {
  icons?: Record<string, RawIcon>;
  aliases?: Record<string, RawIcon & { parent: string }>;
  left?: number; top?: number; width?: number; height?: number;
};

/** Every icon name in a set, plus its aliases (alias → icon), for searching. */
type SetIndex = { prefix: string; names: string[]; aliases: Record<string, string> };

/* --------------------------------- Requests --------------------------------- */

let inFlight = 0;
const waiting: (() => void)[] = [];

/** Fetches JSON, at most MAX_PARALLEL at a time, retrying once after a pause if it fails. */
async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  if (inFlight >= MAX_PARALLEL) await new Promise<void>((resolve) => waiting.push(resolve));
  inFlight += 1;
  try {
    for (let attempt = 0; ; attempt += 1) {
      try {
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`Iconify returned ${response.status}`);
        return (await response.json()) as T;
      } catch (caught) {
        // A rate-limited request reaches the browser as a network error (no CORS header).
        if ((caught as Error).name === 'AbortError' || attempt > 0) throw caught;
        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      }
    }
  } finally {
    inFlight -= 1;
    waiting.shift()?.();
  }
}

/** Shapes already downloaded this session (null = the set has no such icon). */
const shapeCache = new Map<string, IconShape | null>();
const setIndexCache = new Map<string, SetIndex>();
let collectionsCache: Record<string, Collection> | null = null;

function splitId(id: string) {
  const at = id.indexOf(':');
  return { prefix: id.slice(0, at), name: id.slice(at + 1) };
}

/** Downloads the shapes of any icons not yet cached; returns only the newly loaded ones. */
async function loadShapes(ids: string[], signal: AbortSignal) {
  const missing = new Map<string, string[]>();
  ids.forEach((id) => {
    if (shapeCache.has(id)) return;
    const { prefix, name } = splitId(id);
    missing.set(prefix, [...(missing.get(prefix) ?? []), name]);
  });
  const loaded: Record<string, IconShape | null> = {};
  const requests: Promise<void>[] = [];
  missing.forEach((names, prefix) => {
    for (let start = 0; start < names.length; start += NAMES_PER_REQUEST) {
      const batch = names.slice(start, start + NAMES_PER_REQUEST);
      requests.push((async () => {
        const params = new URLSearchParams({ icons: batch.join(',') });
        const data = await getJson<IconSetResponse>(`${API}/${encodeURIComponent(prefix)}.json?${params}`, signal);
        const resolve = (name: string, depth = 0): RawIcon | null => {
          const icon = data.icons?.[name];
          if (icon) return icon;
          const alias = data.aliases?.[name];
          if (!alias || depth > 4) return null;
          const parent = resolve(alias.parent, depth + 1);
          return parent ? { ...parent, ...alias, body: parent.body } : null;
        };
        batch.forEach((name) => {
          const icon = resolve(name);
          const shape = icon?.body ? {
            body: icon.body,
            left: icon.left ?? data.left ?? 0,
            top: icon.top ?? data.top ?? 0,
            width: icon.width ?? data.width ?? 16,
            height: icon.height ?? data.height ?? 16,
          } : null;
          shapeCache.set(`${prefix}:${name}`, shape);
          loaded[`${prefix}:${name}`] = shape;
        });
      })());
    }
  });
  await Promise.all(requests);
  return loaded;
}

/** Every icon in a set (hidden ones left out), downloaded once per session. */
async function loadSetIndex(prefix: string, signal: AbortSignal): Promise<SetIndex> {
  const cached = setIndexCache.get(prefix);
  if (cached) return cached;
  const data = await getJson<{
    uncategorized?: string[]; categories?: Record<string, string[]>; hidden?: string[]; aliases?: Record<string, string>;
  }>(`${API}/collection?${new URLSearchParams({ prefix })}`, signal);
  const hidden = new Set(data.hidden ?? []);
  const names = [...new Set([...(data.uncategorized ?? []), ...Object.values(data.categories ?? {}).flat()])]
    .filter((name) => !hidden.has(name))
    .sort();
  const index = { prefix, names, aliases: data.aliases ?? {} };
  setIndexCache.set(prefix, index);
  return index;
}

/** Icons in a set matching every word of the query, best matches first. */
function searchSet(index: SetIndex, query: string) {
  const words = query.toLowerCase().split(/[\s_-]+/).filter(Boolean);
  if (words.length === 0) return index.names;
  const phrase = words.join('-');
  const matches = (name: string) => words.every((word) => name.includes(word));
  const found = new Set(index.names.filter(matches));
  Object.entries(index.aliases).forEach(([alias, parent]) => {
    if (matches(alias)) found.add(parent);
  });
  const rank = (name: string) => (name === phrase ? 0 : name.startsWith(phrase) ? 1 : name.includes(phrase) ? 2 : 3);
  return [...found].sort((a, b) => rank(a) - rank(b) || a.length - b.length || a.localeCompare(b));
}

/* ----------------------------------- SVGs ----------------------------------- */

/** Single-colour icons use `currentColor`; multicolour ones (logos, emoji) keep their own colours. */
const isMonochrome = (shape: IconShape) => shape.body.includes('currentColor');

/** The icon as standalone SVG markup, `currentColor` replaced by `color` when given. */
function buildSvg(shape: IconShape, size: number, color?: string) {
  const body = color ? shape.body.replace(/currentColor/g, color) : shape.body;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${shape.left} ${shape.top} ${shape.width} ${shape.height}">${body}</svg>`;
}

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** "arrow-left-right" → "Arrow left right" */
function labelFor(id: string) {
  const words = splitId(id).name.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** "arrow-left-right" → "ArrowLeftRightIcon" */
function componentNameFor(id: string) {
  const pascal = splitId(id).name
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${/^[0-9]/.test(pascal) ? 'Icon' : ''}${pascal}Icon`;
}

/** Turns SVG markup into a typed React component. */
function toJsx(svg: string, componentName: string) {
  const body = svg
    .replace(/\sxmlns:xlink=/g, ' xmlnsXlink=')
    .replace(/\sxlink:href=/g, ' xlinkHref=')
    .replace(/\sclass=/g, ' className=')
    .replace(/\s([a-z]+(?:-[a-z]+)+)=/g, (match, attribute: string) => (
      attribute.startsWith('data-') || attribute.startsWith('aria-')
        ? match
        : ` ${attribute.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase())}=`
    ))
    .replace('<svg ', '<svg {...props} ');
  return `export function ${componentName}(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${body}\n  );\n}\n`;
}

/**
 * One icon. Single-colour icons are drawn through a CSS mask of their SVG, so they take the
 * text colour (and work in dark mode); multicolour ones as an image. Either way the markup
 * is never put in the page, so nothing in it can run.
 */
function IconGlyph({ shape, className }: { shape: IconShape | null | undefined; className: string }) {
  if (!shape) {
    return <span aria-hidden="true" className={`block rounded bg-current opacity-15 ${shape === undefined ? 'animate-pulse' : ''} ${className}`} />;
  }
  const url = svgDataUrl(buildSvg(shape, 24));
  if (!isMonochrome(shape)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" aria-hidden="true" draggable={false} className={`block object-contain ${className}`} />;
  }
  const mask = `url("${url}")`;
  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className}`}
      style={{
        maskImage: mask, WebkitMaskImage: mask,
        maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center', WebkitMaskPosition: 'center',
        maskSize: 'contain', WebkitMaskSize: 'contain',
      }}
    />
  );
}

/* --------------------------------- The panel -------------------------------- */

export function IconifyPlugin({
  accent,
  onBack,
  onCollapse,
  onInsert,
  onDragImageStart,
  onNotice,
}: {
  /** Starting icon colour: the project's brand colour. */
  accent: string;
  onBack: () => void;
  onCollapse: () => void;
  onInsert: (image: PluginImage) => void;
  /** Registers the icon for a drag onto the canvas; returns the id to drag it by. */
  onDragImageStart: (image: PluginImage) => string;
  onNotice: (message: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [prefix, setPrefix] = useState('');
  const [remote, setRemote] = useState<{ query: string; icons: string[]; total: number } | null>(null);
  const [setIndex, setSetIndex] = useState<SetIndex | null>(null);
  const [collections, setCollections] = useState<Record<string, Collection>>(() => collectionsCache ?? {});
  const [shapes, setShapes] = useState<Record<string, IconShape | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [visible, setVisible] = useState({ key: '', count: PAGE_SIZE });
  const [selected, setSelected] = useState<string | null>(null);
  const [color, setColor] = useState(HEX.test(accent) ? accent : '#0040DF');
  const [hexDraft, setHexDraft] = useState(color);
  const [size, setSize] = useState(24);
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Set names and licences, for "More sets" and the selected icon's credit.
  useEffect(() => {
    if (collectionsCache) return;
    const controller = new AbortController();
    getJson<Record<string, Collection>>(`${API}/collections`, controller.signal)
      .then((data) => {
        collectionsCache = data;
        setCollections(data);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const trimmed = query.trim();
  /** The set whose full list is used: the picked one, or Lucide while browsing "All sets". */
  const listPrefix = prefix || (trimmed ? '' : BROWSE_SET);

  // Download the set's names.
  useEffect(() => {
    if (!listPrefix) return;
    const controller = new AbortController();
    const cached = setIndexCache.get(listPrefix);
    const timer = window.setTimeout(async () => {
      if (cached) {
        setSetIndex(cached);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        setSetIndex(await loadSetIndex(listPrefix, controller.signal));
      } catch (caught) {
        if ((caught as Error).name === 'AbortError') return;
        setError("Couldn't load this icon set from Iconify. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 0);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [listPrefix, retry]);

  // Search every set (after a short pause).
  useEffect(() => {
    if (listPrefix || !trimmed) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ query: trimmed, limit: String(SEARCH_LIMIT) });
        const data = await getJson<{ icons?: string[]; total?: number; collections?: Record<string, Collection> }>(
          `${API}/search?${params}`, controller.signal,
        );
        const icons = Array.isArray(data.icons) ? data.icons : [];
        setRemote({ query: trimmed, icons, total: typeof data.total === 'number' ? data.total : icons.length });
        if (data.collections) setCollections((current) => ({ ...data.collections, ...current }));
      } catch (caught) {
        if ((caught as Error).name === 'AbortError') return;
        setError("Couldn't reach Iconify. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DELAY_MS);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [listPrefix, trimmed, retry]);

  // The icons to show, in order.
  const indexReady = !!listPrefix && setIndex?.prefix === listPrefix;
  const icons = useMemo(() => {
    if (listPrefix) {
      if (!indexReady || !setIndex) return [];
      const names = searchSet(setIndex, trimmed);
      if (prefix || trimmed) return names.map((name) => `${listPrefix}:${name}`);
      // Browsing "All sets": banking favourites first, then the rest of the set.
      const known = new Set(setIndex.names);
      const starters = STARTER_ICONS.filter((name) => known.has(name));
      const starterSet = new Set(starters);
      return [...starters, ...names.filter((name) => !starterSet.has(name))].map((name) => `${listPrefix}:${name}`);
    }
    return remote?.query === trimmed ? remote.icons : [];
  }, [listPrefix, indexReady, setIndex, prefix, trimmed, remote]);

  // Draw the list in steps as it scrolls.
  const listKey = `${listPrefix}|${trimmed}|${icons.length}`;
  const count = visible.key === listKey ? visible.count : PAGE_SIZE;
  const shown = useMemo(() => icons.slice(0, count), [icons, count]);
  const hasMore = shown.length < icons.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible({ key: listKey, count: count + PAGE_SIZE });
      }
    }, { root: scrollRef.current, rootMargin: '240px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, listKey, count]);

  // A new list starts at the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [listPrefix, trimmed]);

  // Fetch the shapes of the icons drawn.
  const shownKey = shown.join(',');
  useEffect(() => {
    if (!shownKey) return;
    const controller = new AbortController();
    loadShapes(shownKey.split(','), controller.signal)
      .then((loaded) => {
        if (Object.keys(loaded).length > 0) setShapes((current) => ({ ...current, ...loaded }));
      })
      .catch((caught: Error) => {
        if (caught.name !== 'AbortError') setError("Couldn't load icons from Iconify. Check your connection and try again.");
      });
    return () => controller.abort();
  }, [shownKey, retry]);

  const shapeOf = (id: string) => shapes[id] ?? shapeCache.get(id);
  const selectedShape = selected ? shapeOf(selected) : null;
  const selectedMono = !!selectedShape && isMonochrome(selectedShape);
  const selectedPrefix = selected ? splitId(selected).prefix : '';
  const selectedSet = collections[selectedPrefix]?.name ?? selectedPrefix;
  const license = collections[selectedPrefix]?.license;
  const setName = collections[listPrefix]?.name ?? POPULAR_SETS.find((set) => set.prefix === listPrefix)?.label ?? listPrefix;

  const moreSets = useMemo(() => Object.entries(collections)
    .filter(([key, info]) => !info.hidden && !POPULAR_SETS.some((set) => set.prefix === key))
    .sort(([, a], [, b]) => a.name.localeCompare(b.name)), [collections]);

  const pickColor = (next: string) => {
    setHexDraft(next);
    if (HEX.test(next)) setColor(next);
  };

  /** The icon as it goes on the page: single-colour icons stay recolourable. */
  const imageFor = (id: string): PluginImage | null => {
    const shape = shapeOf(id);
    if (!shape) return null;
    const mono = isMonochrome(shape);
    return {
      name: `${labelFor(id)} icon`,
      url: svgDataUrl(buildSvg(shape, size, mono ? color : undefined)),
      w: size,
      h: size,
      iconColor: mono ? color : undefined,
    };
  };

  const insert = (id: string) => {
    const image = imageFor(id);
    if (!image) {
      onNotice('That icon is still loading. Try again in a moment.');
      return;
    }
    onInsert(image);
    onNotice(`Added the ${labelFor(id)} icon to this page`);
  };

  const startDrag = (event: React.DragEvent, id: string) => {
    const image = imageFor(id);
    if (!image) {
      event.preventDefault();
      return;
    }
    setSelected(id);
    startAssetDrag(event, onDragImageStart(image));
  };

  const copy = async (id: string, as: 'svg' | 'jsx') => {
    const shape = shapeOf(id);
    if (!shape) return;
    const svg = buildSvg(shape, size, isMonochrome(shape) ? color : undefined);
    try {
      await navigator.clipboard.writeText(as === 'svg' ? svg : toJsx(svg, componentNameFor(id)));
      onNotice(as === 'svg' ? 'SVG copied to the clipboard' : `${componentNameFor(id)} copied as a React component`);
    } catch {
      onNotice("Couldn't copy the icon. Check clipboard permissions and try again.");
    }
  };

  const status = (() => {
    if (error) return '';
    if (listPrefix) {
      if (!indexReady || !setIndex) return `Loading ${setName}…`;
      const all = setIndex.names.length.toLocaleString();
      if (trimmed) return `${icons.length.toLocaleString()} of ${all} ${setName} icons`;
      return prefix
        ? `${all} icons in ${setName}`
        : `Banking picks, then all ${all} ${setName} icons · type to search every set`;
    }
    if (remote?.query !== trimmed) return 'Searching…';
    return remote.total >= SEARCH_LIMIT
      ? `Top ${SEARCH_LIMIT} matches · pick a set to see every match`
      : `${remote.total} match${remote.total === 1 ? '' : 'es'} across all sets`;
  })();

  const chip = (active: boolean) => `rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
    active ? 'bg-[#0040DF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
  }`;
  const otherSetPicked = !!prefix && !POPULAR_SETS.some((set) => set.prefix === prefix);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-2 py-2">
        <button
          type="button"
          onClick={onBack}
          title="Back to plugins"
          aria-label="Back to plugins"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-[#0040DF]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] bg-[#1769AA] text-white">
          <Box className="h-3 w-3" strokeWidth={2.4} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-slate-900">Iconify Universal Icons</span>
        <button
          type="button"
          title="Collapse left panel"
          aria-label="Collapse left panel"
          onClick={onCollapse}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-[#0040DF]"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Search and icon sets */}
      <div className="space-y-2 px-3 pb-2 pt-3">
        <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus-within:border-[#0040DF]/50">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={prefix ? `Search ${setName}…` : 'Search 200,000+ icons…'}
            aria-label="Search icons"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400"
          />
          {loading && <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" />}
        </label>
        <div role="radiogroup" aria-label="Icon set" className="flex flex-wrap gap-1">
          {POPULAR_SETS.map((set) => (
            <button
              key={set.prefix || 'all'}
              type="button"
              role="radio"
              aria-checked={prefix === set.prefix}
              onClick={() => setPrefix(set.prefix)}
              className={chip(prefix === set.prefix)}
            >
              {set.label}
            </button>
          ))}
          {moreSets.length > 0 && (
            <select
              value={otherSetPicked ? prefix : ''}
              onChange={(event) => setPrefix(event.target.value)}
              aria-label="More icon sets"
              className={`max-w-[132px] cursor-pointer appearance-none truncate outline-none ${chip(otherSetPicked)}`}
            >
              <option value="">More sets ({moreSets.length})…</option>
              {moreSets.map(([key, info]) => (
                <option key={key} value={key}>
                  {info.name}{info.total ? ` (${info.total.toLocaleString()})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
        <p className="truncate text-[10px] text-slate-500" aria-live="polite">{status}</p>
      </div>

      {/* Results */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
        {error ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <p className="text-[11.5px] text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setRetry((value) => value + 1);
              }}
              className="mt-3 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0040DF] hover:bg-slate-100"
            >
              <RefreshCw className="h-3 w-3" /> Try again
            </button>
          </div>
        ) : icons.length === 0 && !loading && (indexReady || remote?.query === trimmed) ? (
          <p className="px-4 py-10 text-center text-[11.5px] text-slate-500">
            No icons match “{trimmed}”{prefix ? ' in this set' : ''}. Try another word{prefix ? ' or All sets' : ''}.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-1">
              {shown.map((id) => {
                const active = id === selected;
                return (
                  <button
                    key={id}
                    type="button"
                    draggable
                    title={`${id} · drag onto the canvas or double-click to add`}
                    aria-label={labelFor(id)}
                    aria-pressed={active}
                    onClick={() => setSelected(id)}
                    onDoubleClick={() => insert(id)}
                    onDragStart={(event) => startDrag(event, id)}
                    className={`grid aspect-square cursor-grab place-items-center rounded-lg border transition-colors active:cursor-grabbing ${
                      active
                        ? 'border-[#0040DF] bg-white text-[#0040DF]'
                        : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <IconGlyph shape={shapeOf(id)} className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
            {hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-3 text-slate-400" aria-hidden="true">
                <LoaderCircle className="h-4 w-4 animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      {/* The selected icon */}
      {selected ? (
        <div className="space-y-2.5 border-t border-slate-200 p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white" style={{ color }}>
              <IconGlyph shape={selectedShape} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-slate-900">{labelFor(selected)}</p>
              <p className="truncate text-[10px] text-slate-500">
                {selectedSet}
                {license?.title && (
                  <>
                    {' · '}
                    {license.url ? (
                      <a href={license.url} target="_blank" rel="noreferrer" className="underline decoration-slate-300 hover:text-slate-700">
                        {license.title}
                      </a>
                    ) : license.title}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedMono || !selectedShape ? (
              <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-1.5 py-1">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => pickColor(event.target.value)}
                  aria-label="Icon colour"
                  className="h-5 w-5 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <input
                  value={hexDraft}
                  onChange={(event) => pickColor(event.target.value.trim())}
                  onBlur={() => setHexDraft(color)}
                  aria-label="Icon colour hex code"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent font-mono text-[10.5px] uppercase text-slate-700 outline-none"
                />
              </label>
            ) : (
              <p className="min-w-0 flex-1 text-[10px] leading-tight text-slate-500">Multicolour icon: keeps its own colours</p>
            )}
            <label className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10.5px] text-slate-500">
              Size
              <select
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                aria-label="Icon size"
                className="bg-transparent text-[10.5px] font-semibold text-slate-700 outline-none"
              >
                {SIZES.map((value) => <option key={value} value={value}>{value}px</option>)}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => insert(selected)}
            disabled={!selectedShape}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] text-[11.5px] font-semibold text-white transition-colors hover:bg-[#0035b8] disabled:opacity-60"
          >
            <Plus className="h-3.5 w-3.5" /> Add to page
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => void copy(selected, 'svg')}
              disabled={!selectedShape}
              className="flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <ClipboardCopy className="h-3 w-3" /> Copy SVG
            </button>
            <button
              type="button"
              onClick={() => void copy(selected, 'jsx')}
              disabled={!selectedShape}
              className="flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <Code2 className="h-3 w-3" /> Copy JSX
            </button>
          </div>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 border-t border-slate-200 px-3 py-2.5 text-[10px] text-slate-500">
          <Check className="h-3 w-3 shrink-0 text-emerald-600" />
          Drag an icon onto the canvas, or pick one to colour, size and add it.
        </p>
      )}
    </div>
  );
}
