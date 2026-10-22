'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// --- Color Math Utilities ---

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1).toUpperCase()}`;
}

// Linearly interpolate between two colors
function mixColors(color1: string, color2: string, weight: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = c1.r + (c2.r - c1.r) * weight;
  const g = c1.g + (c2.g - c1.g) * weight;
  const b = c1.b + (c2.b - c1.b) * weight;
  return rgbToHex(r, g, b);
}

// Generate a 10-step scale from a base hex
function generateScale(baseHex: string) {
  const white = '#FFFFFF';
  const black = '#000000';

  return [
    mixColors(baseHex, white, 0.90), // 50
    mixColors(baseHex, white, 0.75), // 100
    mixColors(baseHex, white, 0.60), // 200
    mixColors(baseHex, white, 0.40), // 300
    mixColors(baseHex, white, 0.20), // 400
    baseHex,                         // 500 (Base)
    mixColors(baseHex, black, 0.20), // 600
    mixColors(baseHex, black, 0.40), // 700
    mixColors(baseHex, black, 0.60), // 800
    mixColors(baseHex, black, 0.80), // 900
  ];
}

// Determine if a hex color is light or dark (for text contrast)
function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128;
}

// --- Theming ---

type Mode = 'light' | 'dark';

const SHADE_NAMES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const BASE_SHADE_INDEX = 5;

interface Theme {
  bg: string;      // section background
  card: string;    // card surface
  border: string;  // card + divider borders
  text: string;    // headings
  muted: string;   // body copy
  label: string;   // "Step 0X" labels
  eyebrow: string; // small coloured heading
}

// Everything on the page is derived from the chosen accent (the selected shade)
// and the palette generated from the seed.
function buildTheme(palette: string[], accent: string, mode: Mode): Theme {
  if (mode === 'dark') {
    return {
      bg: mixColors(accent, '#000000', 0.85),
      card: mixColors(accent, '#000000', 0.7),
      border: mixColors(accent, '#FFFFFF', 0.15),
      text: palette[0],
      muted: palette[2],
      label: palette[4],
      eyebrow: palette[3],
    };
  }
  return {
    bg: mixColors(accent, '#FFFFFF', 0.88),
    card: mixColors(accent, '#FFFFFF', 0.96),
    border: mixColors(accent, '#FFFFFF', 0.78),
    text: palette[9],
    muted: palette[7],
    label: palette[4],
    eyebrow: palette[6],
  };
}

// --- Main Component ---

export default function PaletteSection() {
  const [baseSeed, setBaseSeed] = useState('#172EA5');
  const [activeShade, setActiveShade] = useState(BASE_SHADE_INDEX);
  const [mode, setMode] = useState<Mode>('light');
  const [copied, setCopied] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Derive the full palette whenever the seed changes
  const palette = useMemo(() => generateScale(baseSeed), [baseSeed]);

  // The accent is whichever shade is selected in Step 02
  const accent = palette[activeShade];

  const theme = useMemo(() => buildTheme(palette, accent, mode), [palette, accent, mode]);
  const lightTheme = useMemo(() => buildTheme(palette, accent, 'light'), [palette, accent]);
  const darkTheme = useMemo(() => buildTheme(palette, accent, 'dark'), [palette, accent]);

  // Clear the "Copied" flag shortly after copying
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(null), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleSeedChange = (hex: string) => {
    setBaseSeed(hex.toUpperCase());
    setActiveShade(BASE_SHADE_INDEX); // a new seed becomes the theme colour
  };

  const copyHex = async (key: string, hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(key);
    } catch (err) {
      console.error('Unable to copy colour:', err);
    }
  };

  // Shared card styling (every card is interactive, so every card gets a pointer)
  const cardClass =
    'flex cursor-pointer flex-col rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md';
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.card,
    borderColor: theme.border,
  };

  const surfaceChipColor = theme.bg;
  const surfaceChipLabel = mode === 'light' ? 'Surface 50' : 'Surface 900';

  return (
    <section
      className="w-full overflow-hidden px-4 py-16 font-sans transition-colors duration-300 sm:px-6 md:py-24 lg:pl-20 lg:pr-14"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="mx-auto flex max-w-full flex-col space-y-12">
        {/* Header - Aligned to the left border */}
        <div className="mb-10 w-full text-left">
          <p
            className="mb-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300"
            style={{ color: theme.eyebrow }}
          >
            Architectural Pipeline
          </p>
          <h2
            className="mb-3 text-3xl font-bold tracking-tight transition-colors duration-300"
            style={{ color: theme.text }}
          >
            From one colour to a full palette.
          </h2>
          <p
            className="max-w-2xl text-sm leading-relaxed transition-colors duration-300"
            style={{ color: theme.muted }}
          >
            Designed to derive complete, stable token architectures deterministically from initial inputs.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* STEP 01: Input Brand Seed */}
          <div
            className={cardClass}
            style={cardStyle}
            onClick={(e) => {
              // Clicking anywhere on the card opens the picker
              if (e.target !== colorInputRef.current) colorInputRef.current?.click();
            }}
          >
            <p className="mb-3 text-lg font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: theme.label }}>
              Step 01
            </p>
            <h3 className="mb-2 text-lg font-bold transition-colors duration-300" style={{ color: theme.text }}>
              Input Brand Seed
            </h3>
            <p className="mb-8 text-base leading-relaxed transition-colors duration-300" style={{ color: theme.muted }}>
              One hexadecimal seed colour enters the perceptual engine.
            </p>

            <div className="mt-auto flex justify-center pb-2">
              <div className="group relative cursor-pointer transition-transform hover:scale-105">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={baseSeed}
                  onChange={(e) => handleSeedChange(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Select brand seed color"
                />
                <div
                  className="flex h-14 w-24 items-center justify-center rounded-xl text-xs font-bold shadow-inner transition-colors duration-300"
                  style={{
                    backgroundColor: baseSeed,
                    color: isLight(baseSeed) ? '#000000' : '#FFFFFF',
                  }}
                >
                  {baseSeed}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 02: 10-Step Scale */}
          <div className={cardClass} style={cardStyle}>
            <p className="mb-3 text-lg font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: theme.label }}>
              Step 02
            </p>
            <h3 className="mb-2 text-lg font-bold transition-colors duration-300" style={{ color: theme.text }}>
              10-Step Scale
            </h3>
            <p className="mb-8 text-base leading-relaxed transition-colors duration-300" style={{ color: theme.muted }}>
              Generates 50 through 900 total stops across equal optical steps. Select a stop to theme the page.
            </p>

            <div
              className="mt-auto flex w-full overflow-hidden rounded-md border shadow-sm"
              style={{ borderColor: theme.border }}
              role="group"
              aria-label="Palette shades"
            >
              {palette.map((color, i) => {
                const selected = i === activeShade;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveShade(i)}
                    aria-pressed={selected}
                    aria-label={`Use shade ${SHADE_NAMES[i]} (${color})`}
                    title={`Shade ${SHADE_NAMES[i]}: ${color}`}
                    className="flex h-10 flex-1 cursor-pointer items-center justify-center transition-all duration-300 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                    style={{ backgroundColor: color }}
                  >
                    {selected && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: isLight(color) ? '#000000' : '#FFFFFF' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 03: Semantic Light & Dark */}
          <div
            className={cardClass}
            style={cardStyle}
            onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          >
            <p className="mb-3 text-lg font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: theme.label }}>
              Step 03
            </p>
            <h3 className="mb-2 text-lg font-bold transition-colors duration-300" style={{ color: theme.text }}>
              Semantic Light &amp; Dark
            </h3>
            <p className="mb-8 text-base leading-relaxed transition-colors duration-300" style={{ color: theme.muted }}>
              Splits the scale into balanced pairs calibrated for ambient shifts.
            </p>

            <div className="mt-auto flex items-center gap-2">
              {/* Light Mode Token */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode('light');
                }}
                aria-pressed={mode === 'light'}
                className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md border text-[11px] font-semibold shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: lightTheme.bg,
                  color: lightTheme.text,
                  borderColor: lightTheme.border,
                  boxShadow:
                    mode === 'light' ? `0 0 0 2px ${theme.card}, 0 0 0 4px ${theme.text}` : undefined,
                }}
              >
                Light Mode
              </button>

              {/* Dark Mode Token */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode('dark');
                }}
                aria-pressed={mode === 'dark'}
                className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md border text-[11px] font-semibold shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: darkTheme.bg,
                  color: darkTheme.text,
                  borderColor: darkTheme.border,
                  boxShadow:
                    mode === 'dark' ? `0 0 0 2px ${theme.card}, 0 0 0 4px ${theme.text}` : undefined,
                }}
              >
                Dark Mode
              </button>
            </div>
          </div>

          {/* STEP 04: Component Roles */}
          <div className={cardClass} style={cardStyle}>
            <p className="mb-3 text-lg font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: theme.label }}>
              Step 04
            </p>
            <h3 className="mb-2 text-lg font-bold transition-colors duration-300" style={{ color: theme.text }}>
              Component Roles
            </h3>
            <p className="mb-8 text-base leading-relaxed transition-colors duration-300" style={{ color: theme.muted }}>
              Maps automatically to interactive buttons, surfaces, and ledger rules. Click a role to copy its hex.
            </p>

            <div className="mt-auto space-y-1.5">
              {/* Action role */}
              <button
                type="button"
                onClick={() => copyHex('action', accent)}
                className="flex h-8 w-full cursor-pointer items-center justify-center rounded-md text-[10px] font-semibold tracking-wide shadow-sm transition-all duration-300 hover:brightness-95"
                style={{
                  backgroundColor: accent,
                  color: isLight(accent) ? '#000000' : '#FFFFFF',
                }}
              >
                {copied === 'action' ? 'Copied' : `Action ${SHADE_NAMES[activeShade]}`}
              </button>

              {/* Surface role */}
              <button
                type="button"
                onClick={() => copyHex('surface', surfaceChipColor)}
                className="flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-[10px] font-semibold tracking-wide transition-all duration-300 hover:brightness-95"
                style={{
                  backgroundColor: surfaceChipColor,
                  color: theme.text,
                  borderColor: theme.border,
                }}
              >
                {copied === 'surface' ? 'Copied' : surfaceChipLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}