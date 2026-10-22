'use client';
import React, { useState, useMemo } from 'react';

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

// --- Main Component ---

export default function CardsSection() {
  // Default seed color matching the image visually (correcting the typo in the image #172EAS -> #172EA5)
  const [baseSeed, setBaseSeed] = useState('#172EA5');

  // Derive the full palette whenever the seed changes
  const palette = useMemo(() => generateScale(baseSeed), [baseSeed]);

  // Semantic mappings
  const surface50 = palette[0];
  const action500 = palette[5];

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto flex flex-col space-y-12">
        
        {/* Header - Aligned to the left border */}
        <div className="mb-10 w-full text-left">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#0040DF]">
            Architectural Pipeline
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
            From one colour to a full palette.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            Designed to derive complete, stable token architectures deterministically from initial inputs.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* STEP 01: Input Brand Seed */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-3 text-lg font-bold uppercase tracking-wider text-slate-400">Step 01</p>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Input Brand Seed</h3>
            <p className="mb-8 text-base leading-relaxed text-slate-500">
              One hexadecimal seed colour enters the perceptual engine.
            </p>
            
            <div className="mt-auto flex justify-center pb-2">
              <div className="relative group cursor-pointer transition-transform hover:scale-105">
                <input
                  type="color"
                  value={baseSeed}
                  onChange={(e) => setBaseSeed(e.target.value.toUpperCase())}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Select brand seed color"
                />
                <div 
                  className="flex h-14 w-24 items-center justify-center rounded-xl text-xs font-bold shadow-inner transition-colors duration-300"
                  style={{ 
                    backgroundColor: baseSeed,
                    color: isLight(baseSeed) ? '#000000' : '#FFFFFF'
                  }}
                >
                  {baseSeed}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 02: 10-Step Scale */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-3 text-lg font-bold uppercase tracking-wider text-slate-400">Step 02</p>
            <h3 className="mb-2 text-lg font-bold text-slate-900">10-Step Scale</h3>
            <p className="mb-8 text-base leading-relaxed text-slate-500">
              Generates 50 through 900 total stops across equal optical steps.
            </p>
            
            <div className="mt-auto flex w-full overflow-hidden rounded-md shadow-sm border border-black/5">
              {palette.map((color, i) => (
                <div 
                  key={i} 
                  className="h-10 flex-1 transition-colors duration-300"
                  style={{ backgroundColor: color }}
                  title={`Shade ${(i + 1) * 100}: ${color}`}
                />
              ))}
            </div>
          </div>

          {/* STEP 03: Semantic Light & Dark */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-3 text-lg font-bold uppercase tracking-wider text-slate-400">Step 03</p>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Semantic Light & Dark</h3>
            <p className="mb-8 text-base leading-relaxed text-slate-500">
              Splits the scale into balanced pairs calibrated for ambient shifts.
            </p>
            
            <div className="mt-auto flex items-center gap-2">
              {/* Light Mode Token */}
              <div 
                className="flex h-10 flex-1 items-center justify-center rounded-md text-[11px] font-semibold transition-colors duration-300 border border-black/5 shadow-sm"
                style={{ 
                  backgroundColor: palette[0], // surface.50
                  color: palette[8]            // text.primary using dark shade
                }}
              >
                Light Mode
              </div>
              {/* Dark Mode Token */}
              <div 
                className="flex h-10 flex-1 items-center justify-center rounded-md text-[11px] font-semibold transition-colors duration-300 border border-white/10 shadow-sm"
                style={{ 
                  backgroundColor: '#0F172A', // A standard dark surface, or could use palette[9]
                  color: palette[0]            // text.primary using light shade
                }}
              >
                Dark Mode
              </div>
            </div>
          </div>

          {/* STEP 04: Component Roles */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-3 text-lg font-bold uppercase tracking-wider text-slate-400">Step 04</p>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Component Roles</h3>
            <p className="mb-8 text-base leading-relaxed text-slate-500">
              Maps automatically to interactive buttons, surfaces, and ledger rules.
            </p>
            
            <div className="mt-auto space-y-1.5">
              {/* Action 500 */}
              <div 
                className="flex h-8 w-full items-center justify-center rounded-md text-[10px] font-semibold tracking-wide transition-colors duration-300 shadow-sm"
                style={{ 
                  backgroundColor: action500,
                  color: isLight(action500) ? '#000000' : '#FFFFFF'
                }}
              >
                Action 500
              </div>
              
              {/* Surface 50 */}
              <div 
                className="flex h-8 w-full items-center justify-center rounded-md text-[10px] font-semibold tracking-wide transition-colors duration-300 border border-black/5"
                style={{ 
                  backgroundColor: surface50,
                  color: palette[8] // Dark text for contrast on light surface
                }}
              >
                Surface 50
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}