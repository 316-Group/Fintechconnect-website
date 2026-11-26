'use client';

/**
 * The Unsplash and Pexels plugins: search free stock photos and add one to the current page.
 *
 * Searches go through this app's server (POST /api/plugins/photos/, see lib/stock-photos.ts),
 * which holds the API keys. Photos are hotlinked from the provider, as Unsplash's terms require,
 * which also keeps saved builds small. Adding an Unsplash photo reports the use back to Unsplash,
 * and both plugins credit the photographer.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ClipboardCopy, ExternalLink, LoaderCircle, PanelLeftClose, Plus, RefreshCw, Search } from 'lucide-react';
import type { PluginImage } from './plugin-iconify';
import { startAssetDrag } from './assettab';
import type { PhotoOrientation, PhotoProvider, StockPhoto, StockPhotoPage } from '@/lib/stock-photos';

const ENDPOINT = '/api/plugins/photos/';
const SEARCH_DELAY_MS = 450;

const PROVIDERS: Record<PhotoProvider, {
  title: string;
  site: string;
  siteUrl: string;
  licenseUrl: string;
  keyName: string;
}> = {
  unsplash: {
    title: 'Unsplash Photography',
    site: 'Unsplash',
    siteUrl: 'https://unsplash.com/?utm_source=fintechconnect_studio&utm_medium=referral',
    licenseUrl: 'https://unsplash.com/license',
    keyName: 'UNSPLASH_ACCESS_KEY',
  },
  pexels: {
    title: 'Pexels Stock Photos',
    site: 'Pexels',
    siteUrl: 'https://www.pexels.com',
    licenseUrl: 'https://www.pexels.com/license/',
    keyName: 'PEXELS_API_KEY',
  },
};

/** Searched while the box is empty: subjects a banking or payments app usually needs. */
const TOPICS = ['Finance', 'Payments', 'Savings', 'People', 'Business', 'City', 'Technology', 'Abstract'];

const ORIENTATIONS: { value: PhotoOrientation | null; label: string }[] = [
  { value: null, label: 'Any' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'square', label: 'Square' },
];

/** Largest box a photo gets on the page; it can be resized there. */
const MAX_W = 240;
const MAX_H = 300;

type PhotoErrorCode = 'not_configured' | 'bad_key' | 'rate_limited' | 'no_server' | 'offline' | 'other';
class PhotoRequestError extends Error {
  constructor(public code: PhotoErrorCode) {
    super(code);
  }
}

/** Pages already fetched this session, so going back to a query costs no request. */
const pageCache = new Map<string, StockPhotoPage>();

async function requestPhotos(
  provider: PhotoProvider, query: string, page: number, orientation: PhotoOrientation | null, signal?: AbortSignal,
) {
  const cacheKey = [provider, query.toLowerCase(), page, orientation ?? ''].join('|');
  const cached = pageCache.get(cacheKey);
  if (cached) return cached;
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'search', provider, query, page, orientation }),
      signal,
    });
  } catch (caught) {
    if ((caught as Error).name === 'AbortError') throw caught;
    throw new PhotoRequestError('offline');
  }
  // The static site has no API routes, so these come back as 404/405 pages, not JSON.
  if (response.status === 404 || response.status === 405) throw new PhotoRequestError('no_server');
  const data = (await response.json().catch(() => null)) as (StockPhotoPage & { code?: string }) | null;
  if (!response.ok || !data || !Array.isArray(data.photos)) {
    const code = data?.code;
    throw new PhotoRequestError(
      code === 'not_configured' || code === 'bad_key' || code === 'rate_limited' ? code : 'other',
    );
  }
  pageCache.set(cacheKey, data);
  return data;
}

function messageFor(code: PhotoErrorCode, provider: PhotoProvider) {
  const { site, keyName } = PROVIDERS[provider];
  switch (code) {
    case 'not_configured':
      return `${site} isn't connected yet. Add ${keyName} to client/.env, then restart npm run dev.`;
    case 'bad_key':
      return `${site} refused the API key. Check ${keyName} in client/.env, then restart npm run dev.`;
    case 'rate_limited':
      return `${site}'s hourly search limit has been reached. Try again later.`;
    case 'no_server':
      // In development the route exists, so a 404 means the dev server missed it when starting
      // (it sometimes does on Windows); any change under app/api makes it look again.
      return process.env.NODE_ENV === 'development'
        ? 'The dev server didn\'t load the photo search route. Stop npm run dev and start it again (or save app/api/plugins/photos/route.ts).'
        : 'Photo search runs through the app server, which isn\'t running on this site.';
    case 'offline':
      return 'Couldn\'t reach the app server. Check your connection and try again.';
    default:
      return `Couldn't load photos from ${site}. Try again.`;
  }
}

/** The photo's size on the page: its own shape, at most MAX_W × MAX_H. */
function boxFor(photo: StockPhoto) {
  const scale = Math.min(MAX_W / photo.width, MAX_H / photo.height);
  return { w: Math.round(photo.width * scale), h: Math.round(photo.height * scale) };
}

export function PhotosPlugin({
  provider,
  logo,
  onBack,
  onCollapse,
  onInsert,
  onDragImageStart,
  onNotice,
}: {
  provider: PhotoProvider;
  /** The plugin's logo, as drawn in the plugin list. */
  logo: React.ReactNode;
  onBack: () => void;
  onCollapse: () => void;
  onInsert: (image: PluginImage) => void;
  /** Registers the photo for a drag onto the canvas; returns the id to drag it by. */
  onDragImageStart: (image: PluginImage) => string;
  onNotice: (message: string) => void;
}) {
  const info = PROVIDERS[provider];
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [orientation, setOrientation] = useState<PhotoOrientation | null>(null);
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<PhotoErrorCode | null>(null);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<StockPhoto | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  /** The search the shown photos belong to, so a late "load more" for an older search is dropped. */
  const searchKey = useRef('');

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // An empty box searches the chosen topic.
  const trimmed = query.trim();
  const effectiveQuery = trimmed || topic;

  useEffect(() => {
    const key = `${effectiveQuery}|${orientation ?? ''}`;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      searchKey.current = key;
      setLoading(true);
      setError(null);
      try {
        const result = await requestPhotos(provider, effectiveQuery, 1, orientation, controller.signal);
        setPhotos(result.photos);
        setTotal(result.total);
        setPage(1);
        setHasMore(result.hasMore);
      } catch (caught) {
        if ((caught as Error).name === 'AbortError') return;
        setError(caught instanceof PhotoRequestError ? caught.code : 'other');
        setPhotos([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, trimmed ? SEARCH_DELAY_MS : 0);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [provider, effectiveQuery, trimmed, orientation, retry]);

  const loadMore = async () => {
    const key = searchKey.current;
    setLoadingMore(true);
    try {
      const result = await requestPhotos(provider, effectiveQuery, page + 1, orientation);
      if (searchKey.current !== key) return;
      setPhotos((current) => {
        const seen = new Set(current.map((photo) => photo.id));
        return [...current, ...result.photos.filter((photo) => !seen.has(photo.id))];
      });
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (caught) {
      onNotice(messageFor(caught instanceof PhotoRequestError ? caught.code : 'other', provider));
    } finally {
      setLoadingMore(false);
    }
  };

  const imageFor = (photo: StockPhoto): PluginImage => ({
    name: `Photo by ${photo.photographer} on ${info.site}`,
    url: photo.imageUrl,
    ...boxFor(photo),
  });

  /** Unsplash's terms ask apps to report each use; it doesn't affect the page if it fails. */
  const reportUse = (photo: StockPhoto) => {
    if (provider !== 'unsplash' || !photo.downloadLocation) return;
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'download', provider, downloadLocation: photo.downloadLocation }),
    }).catch(() => undefined);
  };

  const insert = (photo: StockPhoto) => {
    onInsert(imageFor(photo));
    onNotice(`Added ${photo.photographer}'s photo to this page`);
    reportUse(photo);
  };

  const startDrag = (event: React.DragEvent, photo: StockPhoto) => {
    setSelected(photo);
    startAssetDrag(event, onDragImageStart(imageFor(photo)));
  };

  const copyCredit = async (photo: StockPhoto) => {
    try {
      await navigator.clipboard.writeText(`Photo by ${photo.photographer} on ${info.site}: ${photo.pageUrl}`);
      onNotice('Photo credit copied to the clipboard');
    } catch {
      onNotice("Couldn't copy the credit. Check clipboard permissions and try again.");
    }
  };

  const chip = (active: boolean) => `rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
    active ? 'bg-[#0040DF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
  }`;

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
        {logo}
        <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-slate-900">{info.title}</span>
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

      {/* Search, topics and orientation */}
      <div className="space-y-2 px-3 pb-2 pt-3">
        <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus-within:border-[#0040DF]/50">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${info.site} photos…`}
            aria-label={`Search ${info.site} photos`}
            className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400"
          />
          {loading && <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" />}
        </label>
        <div role="radiogroup" aria-label="Topic" className="flex flex-wrap gap-1">
          {TOPICS.map((name) => {
            const active = !trimmed && topic === name;
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setQuery('');
                  setTopic(name);
                }}
                className={chip(active)}
              >
                {name}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[10px] text-slate-500" aria-live="polite">
            {error ? '' : loading && photos.length === 0
              ? 'Searching…'
              : `${total.toLocaleString()} photo${total === 1 ? '' : 's'}${trimmed ? '' : ` · ${topic}`}`}
          </p>
          <label className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500">
            <span className="sr-only">Orientation</span>
            <select
              value={orientation ?? ''}
              onChange={(event) => setOrientation((event.target.value || null) as PhotoOrientation | null)}
              aria-label="Orientation"
              className="bg-transparent text-[10px] font-semibold text-slate-700 outline-none"
            >
              {ORIENTATIONS.map((option) => (
                <option key={option.label} value={option.value ?? ''}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
        {error ? (
          <div className="flex flex-col items-center px-3 py-10 text-center">
            <p className="text-[11.5px] leading-relaxed text-slate-600">{messageFor(error, provider)}</p>
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
        ) : photos.length === 0 ? (
          loading ? (
            <div className="columns-2 gap-1.5" aria-hidden="true">
              {[150, 110, 130, 170, 120, 140].map((height, index) => (
                <div key={index} className="mb-1.5 animate-pulse rounded-lg bg-white/70" style={{ height }} />
              ))}
            </div>
          ) : (
            <p className="px-4 py-10 text-center text-[11.5px] text-slate-500">
              No photos match “{effectiveQuery}”. Try another word{orientation ? ' or any orientation' : ''}.
            </p>
          )
        ) : (
          <>
            <div className={`columns-2 gap-1.5 transition-opacity ${loading ? 'opacity-60' : ''}`}>
              {photos.map((photo) => {
                const active = selected?.id === photo.id;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    draggable
                    title={`Photo by ${photo.photographer} · drag onto the canvas or double-click to add`}
                    aria-label={photo.alt}
                    aria-pressed={active}
                    onClick={() => setSelected(photo)}
                    onDoubleClick={() => insert(photo)}
                    onDragStart={(event) => startDrag(event, photo)}
                    // A drag that ends on the canvas has a drop effect; one let go elsewhere doesn't.
                    onDragEnd={(event) => {
                      if (event.dataTransfer.dropEffect !== 'none') reportUse(photo);
                    }}
                    className={`group relative mb-1.5 block w-full cursor-grab break-inside-avoid overflow-hidden rounded-lg outline-offset-1 active:cursor-grabbing ${
                      active ? 'outline-2 outline-[#0040DF]' : ''
                    }`}
                    style={{ aspectRatio: `${photo.width} / ${photo.height}`, background: photo.color ?? '#e2e8f0' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.thumbUrl} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-3 text-left text-[9.5px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {photo.photographer}
                    </span>
                  </button>
                );
              })}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="mt-1 flex h-7 w-full items-center justify-center gap-1.5 rounded-md bg-white text-[10.5px] font-semibold text-[#0040DF] hover:bg-slate-50 disabled:opacity-70"
              >
                {loadingMore && <LoaderCircle className="h-3 w-3 animate-spin" />}
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>

      {/* The selected photo */}
      {selected ? (
        <div className="space-y-2.5 border-t border-slate-200 p-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.thumbUrl}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
              style={{ background: selected.color ?? '#e2e8f0' }}
            />
            <p className="min-w-0 text-[10.5px] leading-snug text-slate-500">
              Photo by{' '}
              <a href={selected.photographerUrl} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 hover:underline">
                {selected.photographer}
              </a>
              {' '}on{' '}
              <a href={info.siteUrl} target="_blank" rel="noreferrer" className="hover:underline">{info.site}</a>
              <span className="block text-[10px]">
                {selected.width} × {selected.height} ·{' '}
                <a href={info.licenseUrl} target="_blank" rel="noreferrer" className="underline decoration-slate-300 hover:text-slate-700">
                  Free to use
                </a>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => insert(selected)}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] text-[11.5px] font-semibold text-white transition-colors hover:bg-[#0035b8]"
          >
            <Plus className="h-3.5 w-3.5" /> Add to page
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => void copyCredit(selected)}
              className="flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ClipboardCopy className="h-3 w-3" /> Copy credit
            </button>
            <a
              href={selected.pageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-3 w-3" /> View on {info.site}
            </a>
          </div>
        </div>
      ) : (
        <p className="border-t border-slate-200 px-3 py-2.5 text-[10px] leading-relaxed text-slate-500">
          Drag a photo onto the canvas, or pick one to add it. Photos provided by{' '}
          <a href={info.siteUrl} target="_blank" rel="noreferrer" className="font-semibold text-slate-700 hover:underline">{info.site}</a>.
        </p>
      )}
    </div>
  );
}
