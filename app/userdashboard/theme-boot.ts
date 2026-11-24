/* Shared by the dashboard theme store and the root layout (a server component), so no "use client" here. */

export const THEME_STORAGE_KEY = "fintechconnect:dashboard:theme";
export const THEME_ATTRIBUTE = "data-dashboard-theme";
/** Set to "studio" in the studio, which has its own (charcoal) dark palette. */
export const THEME_AREA_ATTRIBUTE = "data-dashboard-area";

/**
 * Runs before the page is drawn (see app/layout.tsx): turns dark mode on straight
 * away for dashboard pages, and marks the studio so it gets its own dark palette.
 * (It matches "/userdashboard" anywhere in the path, as production builds sit under a base path.)
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/+$/,"");if(!/\\/userdashboard(\\/|$)/.test(p))return;if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})!=="dark")return;var r=document.documentElement;r.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},"dark");if(/\\/userdashboard\\/studio$/.test(p))r.setAttribute(${JSON.stringify(THEME_AREA_ATTRIBUTE)},"studio")}catch(e){}})();`;
