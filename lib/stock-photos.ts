/**
 * Stock photo search for the Studio's Unsplash and Pexels plugins. Runs on the server only, so
 * the API keys (UNSPLASH_ACCESS_KEY, PEXELS_API_KEY) never reach the browser. The browser calls
 * POST /api/plugins/photos/ and gets back the same StockPhoto shape from either provider.
 *
 * Unsplash: https://unsplash.com/documentation (demo apps get 50 requests an hour)
 * Pexels:   https://www.pexels.com/api/documentation/ (200 requests an hour)
 */

export type PhotoProvider = 'unsplash' | 'pexels';
export type PhotoOrientation = 'landscape' | 'portrait' | 'square';

export type StockPhoto = {
  id: string;
  width: number;
  height: number;
  /** The photo's average colour, shown while it loads. */
  color: string | null;
  alt: string;
  /** Small image for the results grid. */
  thumbUrl: string;
  /** About 1000px wide: what goes on the page. Hotlinked, as Unsplash requires. */
  imageUrl: string;
  /** The photo's page on Unsplash / Pexels. */
  pageUrl: string;
  photographer: string;
  photographerUrl: string;
  /** Unsplash only: must be called when the photo is used (see trackUnsplashDownload). */
  downloadLocation?: string;
};

export type StockPhotoPage = { photos: StockPhoto[]; total: number; page: number; hasMore: boolean };

/** Error codes the browser turns into messages. */
export type StockPhotoErrorCode = 'bad_request' | 'not_configured' | 'bad_key' | 'rate_limited' | 'upstream';

export class StockPhotoError extends Error {
  constructor(public code: StockPhotoErrorCode, message: string, public status: number) {
    super(message);
  }
}

export const PER_PAGE = 24;
const TIMEOUT_MS = 10_000;

/**
 * Unsplash asks every link back to it to carry these, with utm_source set to the app's name
 * as registered at unsplash.com/oauth/applications (also used in plugin-photos.tsx).
 */
const UNSPLASH_UTM = 'utm_source=fintechconnect_studio&utm_medium=referral';

function withUtm(url: string) {
  return `${url}${url.includes('?') ? '&' : '?'}${UNSPLASH_UTM}`;
}

function keyFor(provider: PhotoProvider) {
  const key = provider === 'unsplash' ? process.env.UNSPLASH_ACCESS_KEY : process.env.PEXELS_API_KEY;
  if (!key?.trim()) {
    const name = provider === 'unsplash' ? 'UNSPLASH_ACCESS_KEY' : 'PEXELS_API_KEY';
    throw new StockPhotoError('not_configured', `${name} is not set on the server.`, 503);
  }
  return key.trim();
}

async function upstream(provider: PhotoProvider, url: string, key: string) {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: provider === 'unsplash'
        ? { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' }
        : { Authorization: key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch {
    throw new StockPhotoError('upstream', `Couldn't reach ${provider === 'unsplash' ? 'Unsplash' : 'Pexels'}.`, 502);
  }
  if (response.ok) return response;
  // Unsplash answers 403 with X-Ratelimit-Remaining: 0 when the hourly limit is used up.
  const outOfRequests = response.status === 429
    || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0');
  if (outOfRequests) throw new StockPhotoError('rate_limited', 'The hourly request limit has been reached.', 429);
  if (response.status === 401 || response.status === 403) {
    throw new StockPhotoError('bad_key', 'The API key was refused.', 502);
  }
  throw new StockPhotoError('upstream', `The provider returned ${response.status}.`, 502);
}

/* ------------------------------ Response shapes ----------------------------- */

type UnsplashPhoto = {
  id: string;
  width: number;
  height: number;
  color?: string | null;
  alt_description?: string | null;
  description?: string | null;
  urls: { small: string; regular: string };
  links: { html: string; download_location: string };
  user: { name: string; links: { html: string } };
};

type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  alt?: string | null;
  avg_color?: string | null;
  photographer: string;
  photographer_url: string;
  src: { medium: string; large: string };
};

export function fromUnsplash(photo: UnsplashPhoto): StockPhoto {
  return {
    id: `unsplash-${photo.id}`,
    width: photo.width,
    height: photo.height,
    color: photo.color ?? null,
    alt: photo.alt_description || photo.description || `Photo by ${photo.user.name}`,
    thumbUrl: photo.urls.small,
    imageUrl: photo.urls.regular,
    pageUrl: withUtm(photo.links.html),
    photographer: photo.user.name,
    photographerUrl: withUtm(photo.user.links.html),
    downloadLocation: photo.links.download_location,
  };
}

export function fromPexels(photo: PexelsPhoto): StockPhoto {
  return {
    id: `pexels-${photo.id}`,
    width: photo.width,
    height: photo.height,
    color: photo.avg_color ?? null,
    alt: photo.alt || `Photo by ${photo.photographer}`,
    thumbUrl: photo.src.medium,
    imageUrl: photo.src.large,
    pageUrl: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
  };
}

/* ---------------------------------- Search ---------------------------------- */

/** Recent searches, so retyping a query or reopening the plugin doesn't spend the hourly limit. */
const cache = new Map<string, { at: number; page: StockPhotoPage }>();
const CACHE_MS = 15 * 60_000;
const CACHE_SIZE = 200;

export async function searchPhotos(
  provider: PhotoProvider,
  query: string,
  page: number,
  orientation: PhotoOrientation | null,
): Promise<StockPhotoPage> {
  const key = keyFor(provider);
  const cacheKey = [provider, query.toLowerCase(), page, orientation ?? ''].join('|');
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.page;

  let result: StockPhotoPage;
  if (provider === 'unsplash') {
    const params = new URLSearchParams({
      query, page: String(page), per_page: String(PER_PAGE), content_filter: 'high',
    });
    if (orientation) params.set('orientation', orientation === 'square' ? 'squarish' : orientation);
    const response = await upstream(provider, `https://api.unsplash.com/search/photos?${params}`, key);
    const data = (await response.json()) as { total?: number; total_pages?: number; results?: UnsplashPhoto[] };
    result = {
      photos: (data.results ?? []).map(fromUnsplash),
      total: data.total ?? 0,
      page,
      hasMore: page < (data.total_pages ?? 0),
    };
  } else {
    const params = new URLSearchParams({ query, page: String(page), per_page: String(PER_PAGE) });
    if (orientation) params.set('orientation', orientation);
    const response = await upstream(provider, `https://api.pexels.com/v1/search?${params}`, key);
    const data = (await response.json()) as { total_results?: number; photos?: PexelsPhoto[]; next_page?: string };
    result = {
      photos: (data.photos ?? []).map(fromPexels),
      total: data.total_results ?? 0,
      page,
      hasMore: !!data.next_page,
    };
  }

  if (cache.size >= CACHE_SIZE) cache.delete(cache.keys().next().value!);
  cache.set(cacheKey, { at: Date.now(), page: result });
  return result;
}

/**
 * Tells Unsplash a photo was used, which its API terms require whenever a photo is added
 * to a design. Only Unsplash's own download links are accepted.
 */
export async function trackUnsplashDownload(downloadLocation: string) {
  let url: URL;
  try {
    url = new URL(downloadLocation);
  } catch {
    throw new StockPhotoError('bad_request', 'Not an Unsplash download link.', 400);
  }
  if (url.protocol !== 'https:' || url.hostname !== 'api.unsplash.com' || !url.pathname.startsWith('/photos/')) {
    throw new StockPhotoError('bad_request', 'Not an Unsplash download link.', 400);
  }
  await upstream('unsplash', url.toString(), keyFor('unsplash'));
}
