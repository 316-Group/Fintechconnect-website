"use client";

import React from "react";
import { getPath } from "@/utils/helper";

/**
 * The illustration on the blue band (the dotted workflow drawing). The band stays brand blue
 * behind it, so set this to null to show the band without the drawing.
 */
const HERO_BAND_IMAGE: string | null = "/dashboard/builderbackground.png";

/**
 * First page of the Product Builder: the hero card with "Start Building Free".
 *
 * The hero fills the visible page area (the window minus the 4rem top bar and the page's
 * own padding) and the card sits in its exact centre, over a white strip and the blue band.
 */
export default function BuilderLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-in fade-in duration-300 min-h-[calc(100dvh-6rem)] md:min-h-[calc(100dvh-8rem)]">
      <div className="relative grid flex-1 place-items-center overflow-hidden border border-slate-200 bg-white px-4 py-6 dashdark:bg-[#242424]! md:py-10">
        {/* Blue band across the lower part, starting a little above the card's centre so the
            card always straddles the white strip and the band (blue behind the illustration). */}
        <div
          className="absolute inset-x-0 bottom-0 top-[calc(50%-110px)] bg-[#0040DF] bg-cover bg-bottom md:top-[calc(50%-140px)]"
          style={HERO_BAND_IMAGE ? { backgroundImage: `url("${getPath(HERO_BAND_IMAGE)}")` } : undefined}
          aria-hidden
        />

        {/* The card, centred over the strip and the band */}
        <div className="relative w-full max-w-[520px] bg-white px-8 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.16)] md:px-12 md:py-14">
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
  );
}
