"use client";

import { Moon, Sun } from "lucide-react";
import { setDashboardTheme, useDashboardTheme } from "./theme";

/**
 * The dashboard's light / dark switch. `compact` shows a single icon button
 * (for the collapsed sidebar); otherwise it is a small sliding switch.
 */
export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useDashboardTheme();
  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  const toggle = () => setDashboardTheme(dark ? "light" : "dark");

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        title={label}
        aria-label={label}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={label}
      onClick={toggle}
      className="relative flex h-7 w-[52px] shrink-0 items-center justify-between rounded-full border border-slate-200 bg-slate-100 px-[7px] text-slate-400 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <Sun className="h-3 w-3" aria-hidden="true" />
      <Moon className="h-3 w-3" aria-hidden="true" />
      <span
        aria-hidden="true"
        className={`absolute top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.25)] transition-[left] duration-200 ${
          dark ? "left-[26px]" : "left-[2px]"
        }`}
      >
        {dark ? <Moon className="h-3 w-3 text-blue-400" /> : <Sun className="h-3 w-3 text-amber-500" />}
      </span>
    </button>
  );
}
