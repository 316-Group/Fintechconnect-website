"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { getPath } from "@/utils/helper";
import { APP_THEMES } from "./builder-data";
import { PRIMARY_BUTTON, StepBreadcrumb, StepFooter } from "./step-chrome";

/** "Select Visual Theme & Brand Experience": pick one of the app themes. */
export default function ThemeSelection({
  initialThemeId,
  onBack,
  onOverview,
  onContinue,
}: {
  initialThemeId?: string;
  /** Gets the current pick, so it is kept when coming back. */
  onBack: (themeId: string) => void;
  onOverview: () => void;
  onContinue: (themeId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(initialThemeId ?? APP_THEMES[0].id);

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-300">
      <StepBreadcrumb onOverview={onOverview} />
      <h1 className="text-2xl font-bold text-slate-900 md:text-[28px]">Select Visual Theme &amp; Brand Experience</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Choose a curated design theme for your platform. This applies consistent styling, tokens, and components
        across your customer mobile and web screens.
      </p>

      <div role="radiogroup" aria-label="App theme" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APP_THEMES.map((theme) => {
          const selected = theme.id === selectedId;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setSelectedId(theme.id)}
              onDoubleClick={() => onContinue(theme.id)}
              className={`group relative overflow-hidden rounded-xl bg-white text-left transition-all ${
                selected
                  ? "border-2 border-[#0040DF] shadow-[0_6px_18px_rgba(0,64,223,0.12)]"
                  : "border-2 border-transparent ring-1 ring-slate-200 hover:ring-slate-300"
              }`}
            >
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#E9E4FF] via-[#EEF0FF] to-[#DCE6FF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPath(theme.image)}
                  alt=""
                  className="absolute inset-x-[12%] top-3 h-[calc(100%-12px)] w-[76%] rounded-t-md object-cover object-top shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {selected && (
                  <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#0040DF] text-white shadow">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <div className="border-t border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{theme.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{theme.components} components</p>
              </div>
            </button>
          );
        })}
      </div>

      <StepFooter
        backLabel="Back to Configuration"
        onBack={() => onBack(selectedId)}
        primary={
          <button type="button" onClick={() => onContinue(selectedId)} className={PRIMARY_BUTTON}>
            Proceed to Preferences <ArrowRight className="h-4 w-4" />
          </button>
        }
      />
    </div>
  );
}
