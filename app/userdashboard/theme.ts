"use client";

import { useSyncExternalStore } from "react";
import { THEME_AREA_ATTRIBUTE, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from "./theme-boot";

/*
 * Light / dark theme for the user dashboard only.
 *
 * The choice is saved in localStorage. While a dashboard page is open, the
 * dashboard layout puts `data-dashboard-theme="dark"` on <html>, and
 * `dashboard-theme.css` re-colours the page from that attribute. Leaving the
 * dashboard removes the attribute, so the rest of the site is never affected.
 * The root layout runs a tiny script that sets the attribute before the first
 * paint on a full page load, so a dark dashboard never flashes light.
 */

export type DashboardTheme = "light" | "dark";

const listeners = new Set<() => void>();

function read(): DashboardTheme {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the theme.
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDashboardTheme(): DashboardTheme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

/** Which part of the dashboard is open: the studio has its own dark palette. */
export type DashboardArea = "studio" | null;

let currentArea: DashboardArea = null;

export function setDashboardTheme(theme: DashboardTheme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Storage unavailable (private mode): the choice lasts until reload. */
  }
  applyDashboardTheme(theme, currentArea);
  listeners.forEach((listener) => listener());
}

/** Puts the theme on <html> (or removes it, for light / when leaving the dashboard). */
export function applyDashboardTheme(theme: DashboardTheme | null, area: DashboardArea = null) {
  const root = document.documentElement;
  currentArea = area;
  if (theme === "dark") root.setAttribute(THEME_ATTRIBUTE, "dark");
  else root.removeAttribute(THEME_ATTRIBUTE);
  if (theme === "dark" && area) root.setAttribute(THEME_AREA_ATTRIBUTE, area);
  else root.removeAttribute(THEME_AREA_ATTRIBUTE);
}
