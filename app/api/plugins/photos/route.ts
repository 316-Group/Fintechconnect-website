import { NextResponse } from 'next/server';
import {
  StockPhotoError, searchPhotos, trackUnsplashDownload,
  type PhotoOrientation, type PhotoProvider,
} from '@/lib/stock-photos';

/**
 * Stock photos for the Studio's Unsplash and Pexels plugins. The browser never sees the API
 * keys: it posts here and this route calls the provider.
 *
 *   { action: "search", provider, query, page?, orientation? }  → StockPhotoPage
 *   { action: "download", provider: "unsplash", downloadLocation } → { ok: true }
 *
 * POST, like the other routes here: with `output: 'export'`, a GET handler can't read the request.
 */

const PROVIDERS: PhotoProvider[] = ['unsplash', 'pexels'];
const ORIENTATIONS: PhotoOrientation[] = ['landscape', 'portrait', 'square'];
const MAX_QUERY = 100;
const MAX_PAGE = 50;

function fail(code: string, message: string, status: number) {
  return NextResponse.json({ code, message }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object') throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail('bad_request', 'Send a JSON body.', 400);
  }

  const provider = PROVIDERS.find((value) => value === body.provider);
  if (!provider) return fail('bad_request', 'provider must be "unsplash" or "pexels".', 400);

  try {
    if (body.action === 'download') {
      if (provider !== 'unsplash' || typeof body.downloadLocation !== 'string') {
        return fail('bad_request', 'Only Unsplash photos need a download call.', 400);
      }
      await trackUnsplashDownload(body.downloadLocation);
      return NextResponse.json({ ok: true });
    }

    if (body.action !== 'search') return fail('bad_request', 'action must be "search" or "download".', 400);
    const query = typeof body.query === 'string' ? body.query.trim().slice(0, MAX_QUERY) : '';
    if (!query) return fail('bad_request', 'query is required.', 400);
    const page = Number.isInteger(body.page) ? Math.min(Math.max(body.page as number, 1), MAX_PAGE) : 1;
    const orientation = ORIENTATIONS.find((value) => value === body.orientation) ?? null;

    return NextResponse.json(await searchPhotos(provider, query, page, orientation));
  } catch (error) {
    if (error instanceof StockPhotoError) return fail(error.code, error.message, error.status);
    console.error('Stock photo request failed:', error);
    return fail('upstream', 'Something went wrong fetching photos.', 500);
  }
}
