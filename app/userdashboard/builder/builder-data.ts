/* The choices offered by the Product Builder guide: app themes, colour palettes, fonts and prompt ideas. */

import type { AppLook } from "../products/projectrecords";

/* --------------------------------- Themes --------------------------------- */

export type AppTheme = {
  id: string;
  name: string;
  components: number;
  /** Preview picture. These reuse the template screenshots for now; swap in each theme's own. */
  image: string;
};

const PREVIEWS = ["/dashboard/template1.png", "/dashboard/template2.png", "/dashboard/template3.png"];

export const APP_THEMES: AppTheme[] = [
  { id: "digital-banking", name: "Digital Banking App", components: 184 },
  { id: "neobank-dashboard", name: "Neobank Web Dashboard", components: 162 },
  { id: "business-banking", name: "Business Banking Portal", components: 148 },
  { id: "psp-merchant", name: "PSP Merchant Console", components: 171 },
  { id: "payment-checkout", name: "Payment Gateway Checkout", components: 96 },
  { id: "fintech-super-app", name: "Fintech Super App", components: 212 },
  { id: "wealth-investing", name: "Wealth & Investing UI", components: 158 },
  { id: "lending-bnpl", name: "Lending & BNPL App", components: 134 },
  { id: "card-issuing", name: "Card Issuing Portal", components: 127 },
  { id: "remittance", name: "Remittance & Payouts", components: 119 },
  { id: "crypto-wallet", name: "Crypto Wallet", components: 184 },
  { id: "expense-management", name: "Expense Management", components: 141 },
].map((theme, index) => ({ ...theme, image: PREVIEWS[index % PREVIEWS.length] }));

/* -------------------------------- Palettes -------------------------------- */

export type Palette = {
  id: string;
  name: string;
  description: string;
  primary: string;
  accent: string;
  /** The three dots shown on the card. */
  swatches: [string, string, string];
};

export const PALETTES: Palette[] = [
  {
    id: "royal-violet", name: "Royal Violet", description: "Innovative, sleek, and high-growth fintech",
    primary: "#5B3FE0", accent: "#A855F7", swatches: ["#4F46E5", "#A855F7", "#E9E3FF"],
  },
  {
    id: "emerald-green", name: "Emerald Green", description: "Wealth, prosperity, and climate finance",
    primary: "#059669", accent: "#10B981", swatches: ["#059669", "#34D399", "#D1FAE5"],
  },
  {
    id: "midnight-dark", name: "Midnight Dark", description: "Private wealth, luxury, and institutional",
    primary: "#1E293B", accent: "#64748B", swatches: ["#0F172A", "#475569", "#E2E8F0"],
  },
  {
    id: "sunset-warmth", name: "Sunset Warmth", description: "Vibrant, inviting, consumer rewards vibe",
    primary: "#EA580C", accent: "#F59E0B", swatches: ["#EA580C", "#FB923C", "#FEF3C7"],
  },
  {
    id: "ocean-fresh", name: "Ocean Fresh", description: "Calm, clear digital savings and lifestyle",
    primary: "#0284C7", accent: "#06B6D4", swatches: ["#0284C7", "#22D3EE", "#E0F2FE"],
  },
  {
    id: "classic-navy", name: "Classic Navy", description: "Crisp, trustworthy, and modern financial",
    primary: "#0040DF", accent: "#6941C6", swatches: ["#0040DF", "#2F6BFF", "#E3EAFD"],
  },
];

/* ---------------------------------- Fonts ---------------------------------- */

export type FontOption = { name: string; description: string; stack: string };

export const FONTS: FontOption[] = [
  { name: "Inter", description: "Clean & Modern · Standard", stack: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { name: "Jakarta Sans", description: "Friendly & Geometric", stack: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" },
  { name: "SF Pro", description: "Native iOS feel", stack: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" },
  { name: "Outfit", description: "Rounded & Contemporary", stack: "Outfit, ui-sans-serif, system-ui, sans-serif" },
  { name: "Poppins", description: "Playful & Bold", stack: "Poppins, ui-sans-serif, system-ui, sans-serif" },
  { name: "IBM Plex", description: "Technical & Precise", stack: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" },
];

export function fontFor(name: string): FontOption {
  return FONTS.find((font) => font.name === name) ?? { name, description: "Custom font", stack: `'${name}', ui-sans-serif, system-ui, sans-serif` };
}

/* ------------------------------ Defaults & ideas ----------------------------- */

const CLASSIC_NAVY = PALETTES.find((palette) => palette.id === "classic-navy")!;

export const DEFAULT_LOOK: AppLook = {
  paletteId: CLASSIC_NAVY.id,
  primary: CLASSIC_NAVY.primary,
  accent: CLASSIC_NAVY.accent,
  appearance: "light",
  font: "Inter",
  textSize: "standard",
  shape: "rounded",
  brandFeel: "trustworthy",
};

export const VISION_IDEAS: { emoji: string; text: string }[] = [
  { emoji: "⚡", text: "Gen-Z freelance banking with automated invoice discounting" },
  { emoji: "🌍", text: "Cross-border B2B payouts for remote tech teams" },
  { emoji: "🌱", text: "Eco-savings account with carbon tracking" },
  { emoji: "🎨", text: "Creator economy debit card with revenue splits" },
];

export const VISION_MAX_LENGTH = 1000;
