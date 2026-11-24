/* Shared by the dashboard theme store and the root layout (a server component), so no "use client" here. */

export const THEME_STORAGE_KEY = "fintechconnect:dashboard:theme";
export const THEME_ATTRIBUTE = "data-dashboard-theme";

/**
 * Runs before the page is drawn (see app/layout.tsx): turns dark mode on straight
 * away for dashboard pages, except the full-screen studio, which keeps its own look.
 * (It matches "/userdashboard" anywhere in the path, as production builds sit under a base path.)
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/+$/,"");if(!/\\/userdashboard(\\/|$)/.test(p)||/\\/userdashboard\\/studio$/.test(p))return;if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="dark")document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},"dark")}catch(e){}})();`;
