"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

/** "Overview • Project Details" trail above each step's title. */
export function StepBreadcrumb({ onOverview }: { onOverview: () => void }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-500">
      <button type="button" onClick={onOverview} className="hover:text-slate-700">
        Overview
      </button>
      <span className="h-1 w-1 rounded-full bg-[#0040DF]" aria-hidden />
      <span className="font-medium text-[#0040DF]">Project Details</span>
    </div>
  );
}

/** The bar at the bottom of each step: a back button and the main action, with an optional note under it. */
export function StepFooter({
  backLabel,
  onBack,
  primary,
  note,
}: {
  backLabel: string;
  onBack: () => void;
  primary: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EEF0FA] px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-[#E3E6F5]"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </button>
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        {primary}
        {note && <p className="text-[11px] text-slate-500 sm:text-right">{note}</p>}
      </div>
    </div>
  );
}

export const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0040DF] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0036BF] disabled:cursor-not-allowed disabled:bg-slate-300";
