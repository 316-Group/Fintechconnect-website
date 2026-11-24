"use client";

import React from "react";
import { getPath } from "@/utils/helper";

/**
 * The illustration on the blue band (the dotted workflow drawing). Until it is added, the band
 * is plain brand blue. To add it, put the image in /public and set its path here, e.g.
 * "/dashboard/builder-hero.png".
 */
const HERO_BAND_IMAGE: string | null = null;

/** First page of the Product Builder: the hero card with "Start Building Free". */
export default function BuilderLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto w-full max-w-6xl animate-in fade-in duration-300">
      <div className="relative overflow-hidden border border-slate-200 bg-white">
        {/* White strip above the band */}
        <div className="h-28 md:h-36" />
        {/* Blue band (placeholder for the illustration) */}
        <div
          className="h-[300px] bg-[#0040DF] bg-cover bg-center md:h-[340px]"
          style={HERO_BAND_IMAGE ? { backgroundImage: `url("${getPath(HERO_BAND_IMAGE)}")` } : undefined}
          aria-hidden
        />

        {/* The card sits across the white strip and the band */}
        <div className="absolute inset-x-4 top-4 flex justify-center md:top-5">
          <div className="w-full max-w-[520px] bg-white px-8 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.16)] md:px-12 md:py-14">
            <h1 className="text-[32px] font-extrabold leading-[1.08] tracking-tight text-slate-950 md:text-[42px]">
              Build autonomous
              <br />
              <span className="text-[#0040DF]">Financial Products</span>
              <br />
              without code
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600">
              Create autonomous workflows, connect tools, and deploy intelligent agents in minutes.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="mt-10 w-full rounded-md bg-[#0040DF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0036BF]"
            >
              Start Building Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
