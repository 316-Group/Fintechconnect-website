'use client';

/**
 * The Lottie plugin, with two libraries:
 *  - Fintech set: animations drawn in code (payment confirmed, card flip, loading, ...) in the
 *    project's colours, recolourable from the right panel.
 *  - Animated emoji: Google's Noto Animated Emoji (about 600, CC BY 4.0), searched and loaded
 *    from Google (see lottie-library.ts).
 * Plus imported Lottie files (.json, from the computer or a link). Animations are dragged onto
 * the canvas or added to the page, where they play. Nothing here needs an API key.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Check, Download, ExternalLink, Link2, LoaderCircle, Plus, RefreshCw, Search, Upload, X } from 'lucide-react';
import { startAssetDrag } from './assettab';
import {
  NOTO_CATEGORIES, NOTO_CREDIT, NOTO_LICENSE_URL, fetchLibraryLottie, loadNotoCatalog, notoLottieUrl,
  notoPosterUrl, searchNoto, type NotoEmoji,
} from './lottie-library';
import { LottiePlayer } from './lottie-player';
import {
  LOTTIE_PRESETS, MAX_LOTTIE_BYTES, lottieProblem, type LottieJson, type LottiePreset,
} from './lottie-presets';
import { PluginHeader } from './plugin-header';
import type { PluginImage } from './plugin-iconify';

const HEX = /^#[0-9a-f]{6}$/i;
const SPEEDS = [0.5, 0.75, 1, 1.5, 2];

/** Shown only if an animation ever lands somewhere that can't play it (e.g. as an image fill). */
const POSTER_URL = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#EEF2FF"/><path d="M19 15v18l15-9z" fill="#7C3AED"/></svg>',
)}`;

type Imported = { id: string; name: string; json: string; data: LottieJson; w: number; h: number };
type ColorMode = 'own' | 'brand' | 'custom';
type Source = 'fintech' | 'emoji';

/** Emoji tiles shown at first, and added by each "Show more". */
const EMOJI_PAGE = 48;
/** Size an emoji animation gets on the page; it can be resized there. */
const EMOJI_SIZE = 96;
const notoId = (codepoint: string) => `noto-${codepoint}`;

/** Fits an animation's size inside a box on the canvas. */
function fitSize(w: number, h: number, max = 200) {
  const scale = Math.min(1, max / Math.max(w, h));
  return { w: Math.max(24, Math.round(w * scale)), h: Math.max(24, Math.round(h * scale)) };
}

/** Reads and checks Lottie JSON text; throws a message that can be shown as is. */
function parseLottie(text: string): LottieJson {
  if (text.length > MAX_LOTTIE_BYTES) {
    throw new Error(`That animation is over ${Math.round(MAX_LOTTIE_BYTES / 1000)} KB. Try a simpler one.`);
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't JSON. Export the animation as Lottie JSON (.json).");
  }
  const problem = lottieProblem(data);
  if (problem) throw new Error(problem);
  return data as LottieJson;
}

export function LottiePlugin({
  accent,
  logo,
  onBack,
  onCollapse,
  onInsert,
  onDragImageStart,
  onNotice,
}: {
  /** The project's brand colour. */
  accent: string;
  logo: React.ReactNode;
  onBack: () => void;
  onCollapse: () => void;
  onInsert: (image: PluginImage) => void;
  onDragImageStart: (image: PluginImage) => string;
  onNotice: (message: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [colorMode, setColorMode] = useState<ColorMode>('brand');
  const [customColor, setCustomColor] = useState(HEX.test(accent) ? accent : '#7C3AED');
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [imports, setImports] = useState<Imported[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<Source>('fintech');
  const [emoji, setEmoji] = useState<NotoEmoji[] | null>(null);
  const [emojiState, setEmojiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [emojiCategory, setEmojiCategory] = useState('fintech');
  const [emojiLimit, setEmojiLimit] = useState(EMOJI_PAGE);
  const [hovered, setHovered] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const loadEmoji = () => {
    if (emoji || emojiState === 'loading') return;
    setEmojiState('loading');
    loadNotoCatalog().then(
      (list) => {
        setEmoji(list);
        setEmojiState('idle');
      },
      () => setEmojiState('error'),
    );
  };

  const showSource = (next: Source) => {
    setSource(next);
    if (next === 'emoji') loadEmoji();
  };

  const colorFor = (preset: LottiePreset) =>
    colorMode === 'custom' ? customColor : colorMode === 'brand' ? accent : preset.color ?? accent;

  // Each preset's animation, rebuilt only when the colours change (so players don't restart).
  const presetData = useMemo(() => new Map(LOTTIE_PRESETS.map((preset) => {
    const color = colorMode === 'custom' ? customColor : colorMode === 'brand' ? accent : preset.color ?? accent;
    return [preset.id, preset.build(color)];
  })), [colorMode, customColor, accent]);

  const q = query.trim().toLowerCase();
  const presets = LOTTIE_PRESETS.filter((preset) => !q || `${preset.name} ${preset.tags}`.toLowerCase().includes(q));
  const shownImports = imports.filter((item) => !q || item.name.toLowerCase().includes(q));

  const emojiResults = useMemo(
    () => (emoji ? searchNoto(emoji, query, emojiCategory) : []),
    [emoji, query, emojiCategory],
  );
  const emojiById = useMemo(() => new Map((emoji ?? []).map((item) => [notoId(item.codepoint), item])), [emoji]);

  const selectedPreset = LOTTIE_PRESETS.find((preset) => preset.id === selected);
  const selectedImport = imports.find((item) => item.id === selected);
  const selectedEmoji = selected ? emojiById.get(selected) : undefined;
  const selectedName = selectedPreset?.name ?? selectedImport?.name ?? selectedEmoji?.name ?? '';
  const selectedData = selectedPreset ? presetData.get(selectedPreset.id) ?? null : selectedImport?.data ?? null;

  const imageFor = (id: string): PluginImage | null => {
    const item = emojiById.get(id);
    if (item) {
      return {
        name: `${item.name} animation`,
        url: notoPosterUrl(item.codepoint),
        w: EMOJI_SIZE,
        h: EMOJI_SIZE,
        lottie: { src: notoLottieUrl(item.codepoint), loop, speed },
      };
    }
    return imageForOwn(id);
  };

  const imageForOwn = (id: string): PluginImage | null => {
    const preset = LOTTIE_PRESETS.find((item) => item.id === id);
    if (preset) {
      return {
        name: `${preset.name} animation`,
        url: POSTER_URL,
        w: preset.w,
        h: preset.h,
        iconColor: colorFor(preset),
        lottie: { preset: preset.id, loop, speed },
      };
    }
    const item = imports.find((entry) => entry.id === id);
    if (!item) return null;
    return { name: `${item.name} animation`, url: POSTER_URL, w: item.w, h: item.h, lottie: { json: item.json, loop, speed } };
  };

  const insert = (id: string) => {
    const image = imageFor(id);
    if (!image) return;
    onInsert(image);
    onNotice(`Added the ${image.name} to this page`);
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

  const addImport = (name: string, text: string) => {
    const data = parseLottie(text);
    const size = fitSize(data.w as number, data.h as number);
    const id = `import-${imports.length + 1}-${name}`;
    const label = (typeof data.nm === 'string' && data.nm.trim()) || name.replace(/\.json$/i, '');
    setImports((list) => [{ id, name: label.slice(0, 48), json: text, data, ...size }, ...list]);
    setSelected(id);
    setImportError(null);
    onNotice(`Imported ${label}: drag it onto the canvas or add it to the page`);
  };

  const importFile = async (file: File) => {
    setImportError(null);
    if (/\.lottie$/i.test(file.name)) {
      setImportError('.lottie files are zipped. Download the Lottie JSON (.json) version instead.');
      return;
    }
    if (file.size > MAX_LOTTIE_BYTES) {
      setImportError(`That animation is over ${Math.round(MAX_LOTTIE_BYTES / 1000)} KB. Try a simpler one.`);
      return;
    }
    try {
      addImport(file.name, await file.text());
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Couldn't read that file.");
    }
  };

  const importUrl = async () => {
    const link = urlDraft.trim();
    setImportError(null);
    let url: URL;
    try {
      url = new URL(link);
    } catch {
      setImportError('Paste a full link to a Lottie .json file (https://…).');
      return;
    }
    if (url.protocol !== 'https:') {
      setImportError('Only https:// links can be imported.');
      return;
    }
    setImporting(true);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), credentials: 'omit' });
      if (!response.ok) throw new Error(`That link returned an error (${response.status}).`);
      const text = await response.text();
      addImport(url.pathname.split('/').pop() || 'Animation', text);
      setUrlDraft('');
    } catch (error) {
      setImportError(error instanceof TypeError
        ? "That site doesn't allow loading its files from here. Download the .json and upload it instead."
        : error instanceof Error && error.name === 'TimeoutError'
          ? 'That link took too long to load. Try again, or upload the file instead.'
          : error instanceof Error ? error.message : "Couldn't import that link.");
    } finally {
      setImporting(false);
    }
  };

  const downloadJson = async () => {
    let data = selectedData;
    if (!data && selectedEmoji) {
      setDownloading(true);
      try {
        data = await fetchLibraryLottie(notoLottieUrl(selectedEmoji.codepoint));
      } catch {
        onNotice("Couldn't download that animation. Check the connection and try again.");
        return;
      } finally {
        setDownloading(false);
      }
    }
    if (!data) return;
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'animation'}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const chip = (active: boolean) => `rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
    active ? 'bg-[#0040DF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
  }`;

  const tile = (id: string, name: string, data: LottieJson | null) => {
    const active = id === selected;
    return (
      <button
        key={id}
        type="button"
        draggable
        title={`${name} · drag onto the canvas or double-click to add`}
        aria-pressed={active}
        onClick={() => setSelected(id)}
        onDoubleClick={() => insert(id)}
        onDragStart={(event) => startDrag(event, id)}
        className={`flex cursor-grab flex-col overflow-hidden rounded-lg border bg-white text-left transition-colors active:cursor-grabbing ${
          active ? 'border-[#0040DF] ring-1 ring-[#0040DF]' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <LottiePlayer data={data} label={name} speed={speed} className="pointer-events-none h-[88px] w-full overflow-hidden p-2" />
        <span className="truncate border-t border-slate-100 px-2 py-1 text-[10.5px] font-semibold text-slate-700">{name}</span>
      </button>
    );
  };

  /** An emoji tile: a still picture that plays while pointed at or selected (600 players at once would be too slow). */
  const emojiTile = (item: NotoEmoji) => {
    const id = notoId(item.codepoint);
    const active = id === selected;
    const playing = active || hovered === id;
    return (
      <button
        key={id}
        type="button"
        draggable
        title={`${item.name} · drag onto the canvas or double-click to add`}
        aria-label={item.name}
        aria-pressed={active}
        onClick={() => setSelected(id)}
        onDoubleClick={() => insert(id)}
        onDragStart={(event) => startDrag(event, id)}
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered((current) => (current === id ? null : current))}
        onFocus={() => setHovered(id)}
        className={`aspect-square cursor-grab rounded-lg border bg-white p-1.5 transition-colors active:cursor-grabbing ${
          active ? 'border-[#0040DF] ring-1 ring-[#0040DF]' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {playing ? (
          <LottiePlayer
            data={null}
            src={notoLottieUrl(item.codepoint)}
            poster={notoPosterUrl(item.codepoint)}
            label={item.name}
            speed={speed}
            className="pointer-events-none h-full w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={notoPosterUrl(item.codepoint)} alt="" loading="lazy" draggable={false} className="pointer-events-none h-full w-full object-contain" />
        )}
      </button>
    );
  };

  const shownEmoji = emojiResults.slice(0, emojiLimit);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PluginHeader logo={logo} title="Lottie Motion Library" onBack={onBack} onCollapse={onCollapse} />

      <div className="space-y-2 px-3 pb-2 pt-3">
        <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus-within:border-[#0040DF]/50">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setEmojiLimit(EMOJI_PAGE);
            }}
            placeholder={source === 'emoji' ? 'Search 600+ animated emoji…' : 'Search animations…'}
            aria-label="Search animations"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>
        <div role="tablist" aria-label="Animation library" className="grid grid-cols-2 gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {([['fintech', `Fintech set · ${LOTTIE_PRESETS.length}`], ['emoji', 'Animated emoji · 600+']] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={source === id}
              onClick={() => showSource(id)}
              className={`rounded-md px-2 py-1 text-[10.5px] font-semibold transition-colors ${
                source === id ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {source === 'emoji' ? (
          <div role="radiogroup" aria-label="Emoji categories" className="flex flex-wrap items-center gap-1">
            {[{ id: 'fintech', label: 'Fintech picks' }, { id: 'all', label: 'All' }, ...NOTO_CATEGORIES].map((category) => (
              <button
                key={category.id}
                type="button"
                role="radio"
                aria-checked={emojiCategory === category.id}
                onClick={() => {
                  setEmojiCategory(category.id);
                  setEmojiLimit(EMOJI_PAGE);
                }}
                className={chip(emojiCategory === category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        ) : (
        <div role="radiogroup" aria-label="Animation colours" className="flex flex-wrap items-center gap-1">
          <button type="button" role="radio" aria-checked={colorMode === 'brand'} onClick={() => setColorMode('brand')} className={chip(colorMode === 'brand')}>
            Brand colour
          </button>
          <button type="button" role="radio" aria-checked={colorMode === 'own'} onClick={() => setColorMode('own')} className={chip(colorMode === 'own')}>
            Original
          </button>
          <label className={`flex cursor-pointer items-center gap-1 ${chip(colorMode === 'custom')}`}>
            <input
              type="color"
              value={customColor}
              onChange={(event) => {
                setCustomColor(event.target.value);
                setColorMode('custom');
              }}
              aria-label="Custom animation colour"
              className="h-3 w-3 cursor-pointer rounded-full border-0 bg-transparent p-0"
            />
            Custom
          </label>
        </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
        {shownImports.length > 0 && (
          <>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Imported</p>
            <div className="mb-3 grid grid-cols-2 gap-2">{shownImports.map((item) => tile(item.id, item.name, item.data))}</div>
          </>
        )}
        {source === 'fintech' ? (
          <>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fintech set · recolourable</p>
            {presets.length === 0 ? (
              <div className="px-2 py-6 text-center text-[11px] text-slate-500">
                <p>No animations match “{query.trim()}”.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEmojiCategory('all');
                    showSource('emoji');
                  }}
                  className="mt-1.5 font-semibold text-[#0040DF] hover:underline"
                >
                  Search the animated emoji instead
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => tile(preset.id, preset.name, presetData.get(preset.id) ?? null))}
              </div>
            )}
          </>
        ) : (
          <>
            {emojiState === 'error' ? (
              <div role="alert" className="rounded-lg border border-slate-200 bg-white px-3 py-5 text-center text-[11px] text-slate-600">
                <p>Couldn&apos;t load the animated emoji. Check the internet connection.</p>
                <button
                  type="button"
                  onClick={loadEmoji}
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-[#0040DF] hover:underline"
                >
                  <RefreshCw className="h-3 w-3" /> Try again
                </button>
              </div>
            ) : !emoji ? (
              <div className="grid grid-cols-4 gap-1.5" aria-busy="true" aria-label="Loading animated emoji">
                {Array.from({ length: 16 }, (_, index) => (
                  <span key={index} className="aspect-square animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : emojiResults.length === 0 ? (
              <p className="px-2 py-6 text-center text-[11px] text-slate-500">
                No animated emoji match “{query.trim()}”{emojiCategory !== 'all' && emojiCategory !== 'fintech' ? ' in this category' : ''}.
              </p>
            ) : (
              <>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {emojiResults.length} animated emoji · point at one to play it
                </p>
                <div className="grid grid-cols-4 gap-1.5">{shownEmoji.map(emojiTile)}</div>
                {emojiResults.length > shownEmoji.length && (
                  <button
                    type="button"
                    onClick={() => setEmojiLimit((limit) => limit + EMOJI_PAGE)}
                    className="mt-2 flex h-7 w-full items-center justify-center rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Show more ({emojiResults.length - shownEmoji.length} left)
                  </button>
                )}
              </>
            )}
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
              {NOTO_CREDIT}. Free for commercial use; credit Google in your app or its about page.{' '}
              <a
                href={NOTO_LICENSE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-semibold text-[#0040DF] hover:underline"
              >
                Licence <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </p>
          </>
        )}

        <div className="mt-4 space-y-2 rounded-lg border border-dashed border-slate-300 bg-white/70 p-2.5">
          <p className="text-[11px] font-semibold text-slate-800">Import your own</p>
          <p className="text-[10px] leading-relaxed text-slate-500">
            Lottie JSON from LottieFiles, After Effects (Bodymovin) or any Lottie tool, up to {Math.round(MAX_LOTTIE_BYTES / 1000)} KB.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json,.lottie"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) void importFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-7 w-full items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Upload className="h-3 w-3" /> Upload .json file
          </button>
          <form
            className="flex items-center gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              void importUrl();
            }}
          >
            <label className="flex min-w-0 flex-1 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1">
              <Link2 className="h-3 w-3 shrink-0 text-slate-400" />
              <input
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
                placeholder="https://…/animation.json"
                aria-label="Lottie JSON link"
                className="min-w-0 flex-1 bg-transparent text-[10.5px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              type="submit"
              disabled={importing || !urlDraft.trim()}
              className="flex h-[26px] shrink-0 items-center rounded-md bg-white px-2 text-[10.5px] font-semibold text-[#0040DF] ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              {importing ? <LoaderCircle className="h-3 w-3 animate-spin" /> : 'Import'}
            </button>
          </form>
          {importError && (
            <p role="alert" className="flex items-start gap-1 text-[10px] leading-snug text-red-600">
              <X className="mt-px h-3 w-3 shrink-0" /> {importError}
            </p>
          )}
        </div>
      </div>

      {selected && (selectedData || selectedEmoji) ? (
        <div className="space-y-2.5 border-t border-slate-200 p-3">
          <div className="flex items-center gap-2.5">
            <LottiePlayer
              data={selectedData}
              src={selectedEmoji ? notoLottieUrl(selectedEmoji.codepoint) : undefined}
              poster={selectedEmoji ? notoPosterUrl(selectedEmoji.codepoint) : undefined}
              label={selectedName}
              loop={loop}
              speed={speed}
              className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 bg-white p-1"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-slate-900">{selectedName}</p>
              <p className="truncate text-[10px] text-slate-500">
                {selectedPreset
                  ? 'Recolour it later from the right panel'
                  : selectedEmoji ? 'Noto emoji · CC BY 4.0 · own colours' : 'Imported · keeps its own colours'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10.5px] text-slate-600">
              <input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} className="accent-[#0040DF]" />
              Loop
            </label>
            <label className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10.5px] text-slate-500">
              Speed
              <select
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                aria-label="Animation speed"
                className="bg-transparent text-[10.5px] font-semibold text-slate-700 outline-none"
              >
                {SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => insert(selected)}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] text-[11.5px] font-semibold text-white transition-colors hover:bg-[#0035b8]"
          >
            <Plus className="h-3.5 w-3.5" /> Add to page
          </button>
          <button
            type="button"
            onClick={() => void downloadJson()}
            disabled={downloading}
            className="flex h-7 w-full items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {downloading ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} Download Lottie JSON
          </button>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 border-t border-slate-200 px-3 py-2.5 text-[10px] text-slate-500">
          <Check className="h-3 w-3 shrink-0 text-emerald-600" />
          Drag an animation onto the canvas, or pick one to set its loop and speed.
        </p>
      )}
    </div>
  );
}
