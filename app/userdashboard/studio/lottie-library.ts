/**
 * The Lottie plugin's large library: Google's Noto Animated Emoji (about 600 animations, not
 * counting skin-tone variants), searched and loaded straight from Google in the browser, so it
 * needs no API key and works on the static site too.
 *
 * Licence: CC BY 4.0. Google's FAQ: "Can I use these animated assets commercially: for a
 * video, for broadcast, apps, etc.? Animated Noto Emoji is licensed under CC BY 4.0"
 * (https://googlefonts.github.io/noto-emoji-animation/). Using them means crediting Google,
 * which the plugin says next to the library.
 *
 * Placed animations keep only the file's link (LottieSpec.src), not the file: some are over
 * 500 KB, too big to save with the project in the browser.
 */

import { lottieProblem, type LottieJson } from './lottie-presets';

const CATALOG_URL = 'https://googlefonts.github.io/noto-emoji-animation/data/api.json';
const ASSET_BASE = 'https://fonts.gstatic.com/s/e/notoemoji/latest/';
/** Largest library file that will be loaded (the biggest Noto animations are about 600 KB). */
const MAX_REMOTE_BYTES = 2_000_000;

export const NOTO_CREDIT = 'Noto Animated Emoji by Google, CC BY 4.0';
export const NOTO_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';

export type NotoEmoji = {
  /** e.g. "1f4b8" or "26a0_fe0f"; also the id in the asset links. */
  codepoint: string;
  name: string;
  category: string;
  /** Lower-case name, tags and category, matched by the search box. */
  search: string;
  popularity: number;
};

/** Short labels for the catalogue's categories, in the order they're shown. */
export const NOTO_CATEGORIES: { id: string; label: string }[] = [
  { id: 'Smileys and emotions', label: 'Smileys' },
  { id: 'People', label: 'People' },
  { id: 'Activities and events', label: 'Events' },
  { id: 'Objects', label: 'Objects' },
  { id: 'Symbols', label: 'Symbols' },
  { id: 'Animals and nature', label: 'Nature' },
  { id: 'Food and drink', label: 'Food' },
  { id: 'Travel and places', label: 'Travel' },
  { id: 'Flags', label: 'Flags' },
];

/** Shown first: the ones a banking or payments app reaches for. */
export const NOTO_FINTECH_PICKS = [
  '1f4b8', '1fa99', '1f48e', '1f4c8', '1f4c9', '1f4ca', '2705', '274c', '26a0_fe0f', '1f512',
  '1f514', '1f6ce_fe0f', '23f0', '23f3', '231b', '1f680', '1f3c6', '1f389', '1f38a', '1f973',
  '1f911', '2728', '1f4af', '1f44d', '1f44f', '1f91e', '1f64f', '1f4aa', '1f525', '1f4a1',
  '1f381', '1f6a8', '1f440', '1f60e', '1f929', '1f914', '1f62c', '1f97a', '1f631', '2764_fe0f',
];

/** Fintech words the emoji names don't use, mapped to words they do. */
const SYNONYMS: Record<string, string[]> = {
  payment: ['money', 'coin'],
  pay: ['money', 'coin'],
  cash: ['money', 'coin'],
  transfer: ['money with wings'],
  send: ['money with wings', 'rocket'],
  success: ['check mark', 'party', 'trophy'],
  done: ['check mark'],
  approved: ['check mark', 'thumbs up'],
  error: ['cross mark', 'warning'],
  failed: ['cross mark'],
  declined: ['cross mark'],
  alert: ['warning', 'police car light', 'bell'],
  notification: ['bell'],
  loading: ['hourglass'],
  pending: ['hourglass', 'alarm clock'],
  wait: ['hourglass'],
  time: ['alarm clock', 'hourglass'],
  growth: ['chart increasing', 'rocket'],
  investment: ['chart increasing', 'gem'],
  stocks: ['chart increasing', 'chart decreasing'],
  loss: ['chart decreasing'],
  secure: ['locked'],
  security: ['locked'],
  reward: ['trophy', 'wrapped gift', 'gem'],
  rewards: ['trophy', 'wrapped gift', 'gem'],
  celebrate: ['party', 'confetti'],
  celebration: ['party', 'confetti'],
  savings: ['coin', 'gem'],
  thanks: ['folded hands', 'thank you'],
  love: ['heart'],
};

let catalog: Promise<NotoEmoji[]> | null = null;

/** The catalogue, fetched once per visit. Skin-tone variants are left out. */
export function loadNotoCatalog(): Promise<NotoEmoji[]> {
  catalog ??= fetch(CATALOG_URL, { credentials: 'omit', signal: AbortSignal.timeout(15_000) })
    .then((response) => {
      if (!response.ok) throw new Error(`Catalogue returned ${response.status}`);
      return response.json() as Promise<{ icons?: { codepoint?: string; tags?: string[]; categories?: string[]; popularity?: number }[] }>;
    })
    .then((data) => (data.icons ?? []).flatMap((icon): NotoEmoji[] => {
      const codepoint = icon.codepoint ?? '';
      if (!/^[0-9a-f_]+$/.test(codepoint) || /_1f3f[b-f]/.test(codepoint)) return [];
      const words = (icon.tags ?? []).map((tag) => tag.replace(/^:|:$/g, '').replace(/-/g, ' ')).filter(Boolean);
      if (!words.length) return [];
      const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      const category = icon.categories?.[0] ?? 'Other';
      return [{ codepoint, name, category, popularity: icon.popularity ?? 0, search: `${words.join(' ')} ${category}`.toLowerCase() }];
    }))
    .catch((error) => {
      catalog = null; // let the next attempt try again
      throw error;
    });
  return catalog;
}

/** Filters the catalogue by search words (with fintech synonyms) and category. */
export function searchNoto(list: NotoEmoji[], query: string, category: string): NotoEmoji[] {
  const q = query.trim().toLowerCase();
  let result = list;
  if (category === 'fintech' && !q) {
    const byCode = new Map(list.map((item) => [item.codepoint, item]));
    return NOTO_FINTECH_PICKS.flatMap((code) => byCode.get(code) ?? []);
  }
  if (category !== 'all' && category !== 'fintech') result = result.filter((item) => item.category === category);
  if (!q) return [...result].sort((a, b) => b.popularity - a.popularity);
  const options = [q, ...(SYNONYMS[q] ?? [])];
  return result
    .filter((item) => options.some((option) => item.search.includes(option)))
    .sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)) || b.popularity - a.popularity);
}

export const notoLottieUrl = (codepoint: string) => `${ASSET_BASE}${codepoint}/lottie.json`;
export const notoPosterUrl = (codepoint: string) => `${ASSET_BASE}${codepoint}/emoji.svg`;

/** Only library files are loaded by link, so a saved project can't point the player anywhere else. */
export function isLibraryLottieUrl(src: string) {
  return src.startsWith(ASSET_BASE) && /^[0-9a-f_]+\/lottie\.json$/.test(src.slice(ASSET_BASE.length));
}

const files = new Map<string, Promise<LottieJson>>();

/** Loads a library animation by its link, once per visit. */
export function fetchLibraryLottie(src: string): Promise<LottieJson> {
  if (!isLibraryLottieUrl(src)) return Promise.reject(new Error('Not a library animation.'));
  let file = files.get(src);
  if (!file) {
    file = fetch(src, { credentials: 'omit', signal: AbortSignal.timeout(20_000) })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Animation returned ${response.status}`);
        const text = await response.text();
        if (text.length > MAX_REMOTE_BYTES) throw new Error('Animation is too large.');
        const data = JSON.parse(text) as unknown;
        const problem = lottieProblem(data);
        if (problem) throw new Error(problem);
        return data as LottieJson;
      })
      .catch((error) => {
        files.delete(src);
        throw error;
      });
    files.set(src, file);
  }
  return file;
}
