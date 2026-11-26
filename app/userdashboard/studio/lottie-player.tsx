'use client';

import { useEffect, useRef, useState } from 'react';
import type { AnimationItem } from 'lottie-web';
import { fetchLibraryLottie } from './lottie-library';
import type { LottieJson } from './lottie-presets';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Plays a Lottie animation, scaled to fit its box. Uses lottie-web's light SVG player, which
 * doesn't run the scripts (expressions) an imported file may contain. With reduced motion
 * turned on, it shows a still frame instead of playing.
 *
 * Takes the animation itself (`data`) or, for the large library, its link (`src`), which it
 * loads first; `poster` is shown while that loads.
 */
export function LottiePlayer({
  data,
  src,
  poster,
  loop = true,
  speed = 1,
  label,
  className = '',
}: {
  data: LottieJson | null;
  src?: string;
  poster?: string;
  loop?: boolean;
  speed?: number;
  label: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [failed, setFailed] = useState<LottieJson | null>(null);
  const [remote, setRemote] = useState<{ src: string; data: LottieJson | null; error: boolean } | null>(null);

  const remoteSrc = !data && src ? src : null;
  useEffect(() => {
    if (!remoteSrc) return;
    let cancelled = false;
    fetchLibraryLottie(remoteSrc).then(
      (loaded) => { if (!cancelled) setRemote({ src: remoteSrc, data: loaded, error: false }); },
      () => { if (!cancelled) setRemote({ src: remoteSrc, data: null, error: true }); },
    );
    return () => { cancelled = true; };
  }, [remoteSrc]);

  const remoteState = remoteSrc && remote?.src === remoteSrc ? remote : null;
  const shown = data ?? remoteState?.data ?? null;
  const loading = !!remoteSrc && !remoteState;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !shown) return;
    let cancelled = false;
    import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
      if (cancelled) return;
      try {
        const reduced = prefersReducedMotion();
        const animation = lottie.loadAnimation({
          container: host,
          renderer: 'svg',
          loop,
          autoplay: !reduced,
          // lottie-web changes the data it is given, so it gets its own copy.
          animationData: structuredClone(shown),
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        });
        animation.setSpeed(speed);
        if (reduced) animation.goToAndStop(Math.max(0, animation.totalFrames * 0.6), true);
        animationRef.current = animation;
      } catch {
        setFailed(shown);
      }
    }).catch(() => setFailed(shown));
    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
      host.replaceChildren();
    };
    // Speed changes are applied below without reloading the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, loop]);

  useEffect(() => {
    animationRef.current?.setSpeed(speed);
  }, [speed]);

  // Each state gets its own element (the keys): lottie-web fills and clears the player's box
  // itself, so React must never put its own children in that box.
  if (loading) {
    return (
      <div key="loading" role="img" aria-label={`${label} (loading)`} aria-busy="true" className={`grid place-items-center ${className}`}>
        {poster
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={poster} alt="" className="h-full max-h-full w-full max-w-full object-contain opacity-80" />
          : <span className="h-1/3 w-1/3 animate-pulse rounded-full bg-slate-200" />}
      </div>
    );
  }
  if (!shown || failed === shown) {
    return (
      <div key="failed" role="img" aria-label={`${label} (can't be played)`} className={`grid place-items-center text-[10px] text-slate-400 ${className}`}>
        Animation unavailable
      </div>
    );
  }
  return <div key="player" ref={hostRef} role="img" aria-label={label} className={`[&>svg]:block ${className}`} />;
}
