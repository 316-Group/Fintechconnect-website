'use client';

/**
 * The Iconify plugin: searches the public Iconify API (open-source icon sets such as Lucide,
 * Material Symbols, Tabler and Phosphor) and adds the chosen icon to the current page as an
 * SVG image, or copies it as SVG markup or a React component.
 *
 * Requests stay few, because the API rate-limits: one search request, then one request per
 * icon set for the shapes of every icon shown (`/{prefix}.json?icons=…`). SVGs are then built
 * here, so previews, colours, sizes and copies need no further requests.
 * API reference: https://iconify.design/docs/api/
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Check, ChevronLeft, ClipboardCopy, Code2, LoaderCircle, PanelLeftClose, Plus, RefreshCw, Search } from 'lucide-react';

/** An image a plugin adds to the page. `url` is a data URL so the build keeps working offline. */
export type PluginImage = { name: string; url: string; w: number; h: number };

const API = 'https://api.iconify.design';
const RESULT_LIMIT = 96;
const SEARCH_DELAY_MS = 300;
/** Icon names per shapes request, to keep URLs short. */
const NAMES_PER_REQUEST = 80;

const SETS: { prefix: string; label: string }[] = [
  { prefix: '', label: 'All sets' },
  { prefix: 'lucide', label: 'Lucide' },
  { prefix: 'material-symbols', label: 'Material Symbols' },
  { prefix: 'tabler', label: 'Tabler' },
  { prefix: 'ph', label: 'Phosphor' },
  { prefix: 'feather', label: 'Feather' },
  { prefix: 'fa6-solid', label: 'Font Awesome' },
];

/** Shown before the user searches: icons a banking or payments app usually needs. */
const STARTER_ICONS = [
  'lucide:wallet', 'lucide:credit-card', 'lucide:landmark', 'lucide:banknote', 'lucide:piggy-bank',
  'lucide:send', 'lucide:arrow-left-right', 'lucide:arrow-down-left', 'lucide:arrow-up-right', 'lucide:receipt',
  'lucide:chart-line', 'lucide:chart-pie', 'lucide:shield-check', 'lucide:lock', 'lucide:fingerprint',
  'lucide:scan-face', 'lucide:qr-code', 'lucide:bell', 'lucide:user', 'lucide:users',
  'lucide:globe', 'lucide:coins', 'lucide:bitcoin', 'lucide:hand-coins', 'lucide:circle-dollar-sign',
  'lucide:euro', 'lucide:pound-sterling', 'lucide:percent', 'lucide:calendar', 'lucide:settings',
];

const SIZES = [16, 20, 24, 32, 48, 64];
const HEX = /^#[0-9a-f]{6}$/i;

type Collection = { name: string; license?: { title?: string; url?: string } };

/** An icon's shape: its SVG body and view box. */
type IconShape = { body: string; left: number; top: number; width: number; height: number };

type RawIcon = { body?: string; left?: number; top?: number; width?: number; height?: number };
type IconSetResponse = {
  icons?: Record<string, RawIcon>;
  aliases?: Record<string, RawIcon & { parent: string }>;
  left?: number; top?: number; width?: number; height?: number;
};

/** Shapes already downloaded this session (null = the set has no such icon). */
const shapeCache = new Map<string, IconShape | null>();

function splitId(id: string) {
  const at = id.indexOf(':');
  return { prefix: id.slice(0, at), name: id.slice(at + 1) };
}

/** Downloads the shapes of any icons not yet cached: one request per icon set. */
async function loadShapes(ids: string[], signal: AbortSignal) {
  const missing = new Map<string, string[]>();
  ids.forEach((id) => {
    if (shapeCache.has(id)) return;
    const { prefix, name } = splitId(id);
    missing.set(prefix, [...(missing.get(prefix) ?? []), name]);
  });
  const requests: Promise<void>[] = [];
  missing.forEach((names, prefix) => {
    for (let start = 0; start < names.length; start += NAMES_PER_REQUEST) {
      const batch = names.slice(start, start + NAMES_PER_REQUEST);
      requests.push((async () => {
        const params = new URLSearchParams({ icons: batch.join(',') });
        const response = await fetch(`${API}/${encodeURIComponent(prefix)}.json?${params}`, { signal });
        if (!response.ok) throw new Error(`Iconify returned ${response.status}`);
        const data = (await response.json()) as IconSetResponse;
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
          shapeCache.set(`${prefix}:${name}`, icon?.body ? {
            body: icon.body,
            left: icon.left ?? data.left ?? 0,
            top: icon.top ?? data.top ?? 0,
            width: icon.width ?? data.width ?? 16,
            height: icon.height ?? data.height ?? 16,
          } : null);
        });
      })());
    }
  });
  await Promise.all(requests);
  return Object.fromEntries(ids.map((id) => [id, shapeCache.get(id) ?? null]));
}

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
 * One icon drawn through a CSS mask of its SVG, so it takes the text colour (and works in
 * dark mode). The markup is never put in the page, so nothing in it can run.
 */
function MaskedIcon({ shape, className }: { shape: IconShape | null | undefined; className: string }) {
  if (!shape) {
    return <span aria-hidden="true" className={`block rounded bg-current opacity-15 ${shape === undefined ? 'animate-pulse' : ''} ${className}`} />;
  }
  const url = `url("${svgDataUrl(buildSvg(shape, 24))}")`;
  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className}`}
      style={{
        maskImage: url, WebkitMaskImage: url,
        maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center', WebkitMaskPosition: 'center',
        maskSize: 'contain', WebkitMaskSize: 'contain',
      }}
    />
  );
}

export function IconifyPlugin({
  accent,
  onBack,
  onCollapse,
  onInsert,
  onNotice,
}: {
  /** Starting icon colour: the project's brand colour. */
  accent: string;
  onBack: () => void;
  onCollapse: () => void;
  onInsert: (image: PluginImage) => void;
  onNotice: (message: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [prefix, setPrefix] = useState('');
  const [results, setResults] = useState<string[] | null>(null);
  const [total, setTotal] = useState(0);
  const [collections, setCollections] = useState<Record<string, Collection>>({});
  const [shapes, setShapes] = useState<Record<string, IconShape | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [color, setColor] = useState(HEX.test(accent) ? accent : '#0040DF');
  const [hexDraft, setHexDraft] = useState(color);
  const [size, setSize] = useState(24);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Search as the user types (after a short pause); an empty box shows the starter icons.
  const trimmed = query.trim();
  useEffect(() => {
    if (!trimmed) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ query: trimmed, limit: String(RESULT_LIMIT) });
        if (prefix) params.set('prefixes', prefix);
        const response = await fetch(`${API}/search?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Iconify returned ${response.status}`);
        const data = (await response.json()) as { icons?: string[]; total?: number; collections?: Record<string, Collection> };
        setResults(Array.isArray(data.icons) ? data.icons : []);
        setTotal(typeof data.total === 'number' ? data.total : 0);
        if (data.collections) setCollections((current) => ({ ...current, ...data.collections }));
      } catch (caught) {
        if ((caught as Error).name === 'AbortError') return;
        setError("Couldn't reach Iconify. Check your connection and try again.");
        setResults(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DELAY_MS);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [trimmed, prefix, retry]);

  const showingStarter = !trimmed;
  // A search cancelled by clearing the box leaves `loading` set; it only counts while searching.
  const searching = loading && !showingStarter;
  const icons = showingStarter ? STARTER_ICONS : results ?? [];

  // Fetch the shapes of the icons on screen.
  const iconsKey = icons.join(',');
  useEffect(() => {
    if (!iconsKey) return;
    const controller = new AbortController();
    loadShapes(iconsKey.split(','), controller.signal)
      .then((loaded) => setShapes((current) => ({ ...current, ...loaded })))
      .catch((caught: Error) => {
        if (caught.name !== 'AbortError') setError("Couldn't load icons from Iconify. Check your connection and try again.");
      });
    return () => controller.abort();
  }, [iconsKey, retry]);

  const selectedShape = selected ? shapes[selected] : null;
  const selectedPrefix = selected ? splitId(selected).prefix : '';
  const selectedSet = collections[selectedPrefix]?.name ?? SETS.find((set) => set.prefix === selectedPrefix)?.label ?? selectedPrefix;
  const license = collections[selectedPrefix]?.license;

  const pickColor = (next: string) => {
    setHexDraft(next);
    if (HEX.test(next)) setColor(next);
  };

  const insert = (id: string) => {
    const shape = shapes[id];
    if (!shape) {
      onNotice('That icon is still loading. Try again in a moment.');
      return;
    }
    onInsert({ name: `${labelFor(id)} icon`, url: svgDataUrl(buildSvg(shape, size, color)), w: size, h: size });
    onNotice(`Added the ${labelFor(id)} icon to this page`);
  };

  const copy = async (id: string, as: 'svg' | 'jsx') => {
    const shape = shapes[id];
    if (!shape) return;
    const svg = buildSvg(shape, size, color);
    try {
      await navigator.clipboard.writeText(as === 'svg' ? svg : toJsx(svg, componentNameFor(id)));
      onNotice(as === 'svg' ? 'SVG copied to the clipboard' : `${componentNameFor(id)} copied as a React component`);
    } catch {
      onNotice("Couldn't copy the icon. Check clipboard permissions and try again.");
    }
  };

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
            placeholder="Search 200,000+ icons…"
            aria-label="Search icons"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400"
          />
          {searching && <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" />}
        </label>
        <div role="radiogroup" aria-label="Icon set" className="flex flex-wrap gap-1">
          {SETS.map((set) => {
            const active = prefix === set.prefix;
            return (
              <button
                key={set.prefix || 'all'}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPrefix(set.prefix)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  active ? 'bg-[#0040DF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {set.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500" aria-live="polite">
          {showingStarter
            ? 'Popular for banking apps · type to search every set'
            : error
              ? ''
              : searching && results === null
                ? 'Searching…'
                : `${total.toLocaleString()} result${total === 1 ? '' : 's'}${total > icons.length ? ` · showing ${icons.length}` : ''}`}
        </p>
      </div>

      {/* Results */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
        {error ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <p className="text-[11.5px] text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setRetry((count) => count + 1);
              }}
              className="mt-3 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0040DF] hover:bg-slate-100"
            >
              <RefreshCw className="h-3 w-3" /> Try again
            </button>
          </div>
        ) : icons.length === 0 && !searching ? (
          <p className="px-4 py-10 text-center text-[11.5px] text-slate-500">
            No icons match “{trimmed}”{prefix ? ' in this set' : ''}. Try another word{prefix ? ' or All sets' : ''}.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-1">
            {icons.map((id) => {
              const active = id === selected;
              return (
                <button
                  key={id}
                  type="button"
                  title={`${id} · double-click to add`}
                  aria-label={labelFor(id)}
                  aria-pressed={active}
                  onClick={() => setSelected(id)}
                  onDoubleClick={() => insert(id)}
                  className={`grid aspect-square place-items-center rounded-lg border transition-colors ${
                    active
                      ? 'border-[#0040DF] bg-white text-[#0040DF]'
                      : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  <MaskedIcon shape={shapes[id]} className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* The selected icon */}
      {selected ? (
        <div className="space-y-2.5 border-t border-slate-200 p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white" style={{ color }}>
              <MaskedIcon shape={selectedShape} className="h-6 w-6" />
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
          Pick an icon to colour, size and add it. Double-click adds it straight away.
        </p>
      )}
    </div>
  );
}
