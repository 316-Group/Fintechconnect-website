'use client';
import React, { useState } from 'react';
import { Wifi } from 'lucide-react';

// --- Types & Constants ---

const ACCENT_COLORS = [
  { id: 'blue', hex: '#0040DF', label: 'Electric Blue' },
  { id: 'teal', hex: '#0D9488', label: 'Teal' },
  { id: 'indigo', hex: '#6366F1', label: 'Indigo' },
  { id: 'dark', hex: '#0F172A', label: 'Midnight' },
];

const DENSITIES = [
  { id: 'compact', label: 'Compact' },
  { id: 'default', label: 'Default' },
  { id: 'spacious', label: 'Spacious' },
];

// Helper to map density to spacing classes
const getSpacing = (density: string) => {
  switch (density) {
    case 'compact':
      return { p: 'p-2', py: 'py-1.5', gap: 'gap-1', text: 'text-[10px]', amount: 'text-xl' };
    case 'spacious':
      return { p: 'p-4', py: 'py-3', gap: 'gap-3', text: 'text-xs', amount: 'text-3xl' };
    default:
      return { p: 'p-3', py: 'py-2', gap: 'gap-1.5', text: 'text-[11px]', amount: 'text-2xl' };
  }
};

export default function CardsSection() {
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].hex);
  const [radius, setRadius] = useState(8);
  const [density, setDensity] = useState('default');

  const spacing = getSpacing(density);

  // Shared styles for the three grey surface panels
  const panelClass = 'flex flex-col rounded-2xl bg-[#F1F2F7] p-2.5 lg:min-h-[340px]';
  const panelLabelClass =
    'pb-3 pt-1.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500';

  return (
    <section
      className="w-full bg-[#F8F9FE] py-16 text-slate-900"
      
    >
      {/* Font + range slider styling (swap the @import for next/font if you prefer) */}
      <style>{`
        next/font;

        .token-range { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; background: #EEF0F6; outline: none; cursor: pointer; }
        .token-range::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: #EEF0F6; }
        .token-range::-moz-range-track { height: 6px; border-radius: 999px; background: #EEF0F6; }
        .token-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 14px; width: 14px; margin-top: -4px; border-radius: 999px; background: #fff; box-shadow: 0 0 0 1px #E2E5EE, 0 1px 3px rgba(15,23,42,.15); }
        .token-range::-moz-range-thumb { height: 14px; width: 14px; border: 0; border-radius: 999px; background: #fff; box-shadow: 0 0 0 1px #E2E5EE, 0 1px 3px rgba(15,23,42,.15); }
        .token-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 2px #0040DF; }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-[#0040DF]">
            Multi-Surface Architecture
          </p>
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-[#0B0F1A] md:text-[44px] md:leading-[1.1]">
            Same tokens, every surface.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-500">
            Adjust foundational tokens and watch uniform token values drive mobile applications,
            enterprise web consoles, and institutional physical cards simultaneously.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* ========================================================
              GLOBAL CONTROL RAIL
             ======================================================== */}
          <div className="flex flex-col self-start rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] lg:mr-3">
            <h3 className="mb-6 text-base font-semibold text-slate-900">Global Control Rail</h3>

            <div className="space-y-6">
              {/* Color Picker */}
              <div>
                <label className="mb-2.5 block text-xs font-medium text-slate-500">
                  Primary Accent
                </label>
                <div className="flex gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccentColor(color.hex)}
                      aria-label={`Select ${color.label}`}
                      aria-pressed={accentColor === color.hex}
                      className={`h-9 flex-1 rounded-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                        accentColor === color.hex ? 'shadow-md' : 'hover:opacity-90'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Radius Slider */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label htmlFor="base-radius" className="text-xs font-medium text-slate-500">
                    Base Radius
                  </label>
                  <span className="text-xs font-bold text-[#0040DF]">{radius}px</span>
                </div>
                <input
                  id="base-radius"
                  type="range"
                  min="0"
                  max="24"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="token-range"
                />
              </div>

              {/* Density Toggle */}
              <div>
                <label className="mb-2.5 block text-xs font-medium text-slate-500">
                  Spatial Density
                </label>
                <div className="flex gap-2">
                  {DENSITIES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDensity(d.id)}
                      aria-pressed={density === d.id}
                      className={`flex-1 rounded-md py-2.5 text-[11px] font-bold transition-colors ${
                        density === d.id
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-[#F1F2F7] text-slate-800 hover:bg-[#E8EAF2]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-[11px] italic leading-relaxed text-slate-600">
              &ldquo;Designed to reuse the same approved settings across channels. Channel
              availability is agreed per programme*&rdquo;
            </p>
          </div>

          {/* ========================================================
              MOBILE SURFACE
             ======================================================== */}
          <div className={panelClass}>
            <div className={panelLabelClass}>Mobile Surface</div>

            <div
              className="flex flex-1 flex-col bg-white p-2 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
              style={{ borderRadius: `${radius * 1.5}px` }}
            >
              {/* Status Bar */}
              <div className="flex items-center justify-between px-2 pb-2 pt-1.5 text-[9px] font-medium text-slate-500">
                <span>09:41</span>
                <div className="flex items-end gap-[1.5px]" aria-hidden="true">
                  <span className="h-1 w-[2px] bg-slate-500" />
                  <span className="h-1.5 w-[2px] bg-slate-500" />
                  <span className="h-2 w-[2px] bg-slate-500" />
                </div>
              </div>

              {/* Greeting */}
              <div className="mb-3 flex items-center gap-2 px-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600">
                  SC
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold text-slate-900">Sample Customer</p>
                  <p className="text-[9px] text-slate-500">Primary Vault</p>
                </div>
              </div>

              {/* Balance + Action */}
              <div className={`flex flex-col ${spacing.gap}`}>
                <div
                  className={`text-white ${spacing.p}`}
                  style={{ backgroundColor: accentColor, borderRadius: `${radius}px` }}
                >
                  <p className="mb-1 text-[9px] font-medium opacity-80">Treasury Total</p>
                  <p className={`${spacing.amount} font-bold tracking-tight`}>$24,850.40</p>
                </div>

                <button
                  className={`w-full text-center font-bold uppercase tracking-wide text-white ${spacing.text} ${spacing.py}`}
                  style={{ backgroundColor: accentColor, borderRadius: `${radius}px` }}
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              WEB PORTAL CONSOLE
             ======================================================== */}
          <div className={panelClass}>
            <div className={panelLabelClass}>Web Portal Console</div>

            <div
              className="flex flex-1 flex-col overflow-hidden bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
              style={{ borderRadius: `${radius * 1.5}px` }}
            >
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                </div>
                <span className="text-[8px] text-slate-400">vault.institutional.connect</span>
              </div>

              {/* Console Content */}
              <div className={`flex flex-col px-2 pb-2 ${spacing.gap}`}>
                <div
                  className={`flex flex-col gap-0.5 bg-[#F3F4F8] ${spacing.p}`}
                  style={{ borderRadius: `${radius}px` }}
                >
                  <p className="text-[10px] font-semibold text-slate-700">Ledger Settlement</p>
                  <p className="text-lg font-bold tracking-tight text-slate-900">$24,850.40</p>
                </div>

                <div className="flex items-center justify-between px-2 py-2">
                  <p className="text-[10px] font-medium text-slate-600">Pending Approvals</p>
                  <span className="text-[10px] font-bold text-slate-900">3</span>
                </div>

                <button
                  className={`w-full text-center font-bold uppercase tracking-wide text-white ${spacing.text} ${spacing.py}`}
                  style={{ backgroundColor: accentColor, borderRadius: `${radius}px` }}
                >
                  Export Ledger
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              INSTITUTIONAL DEBIT CARD
             ======================================================== */}
          <div className={panelClass}>
            <div className={panelLabelClass}>Institutional Debit Card</div>

            <div className="flex flex-1 items-center">
              <div
                className="flex aspect-[1.65/1] w-full flex-col justify-between p-4 text-white shadow-sm transition-all duration-300"
                style={{ backgroundColor: accentColor, borderRadius: `${radius}px` }}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wide">Connect Card</div>
                  <div className="grid h-5 w-5 place-items-center rounded-full border border-white/70">
                    <Wifi className="h-2.5 w-2.5 rotate-90" />
                  </div>
                </div>

                {/* Card Number */}
                <div className="text-center text-[9px] tracking-[0.2em] opacity-80">
                  &middot;&middot;&middot;&middot; &middot;&middot;&middot;&middot;
                  &middot;&middot;&middot;&middot; 0000
                </div>

                {/* Bottom Row */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="mb-0.5 text-[7px] font-medium uppercase tracking-wider opacity-70">
                      Cardholder
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wide">Sample Customer</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5 text-[7px] font-medium uppercase tracking-wider opacity-70">
                      Expires
                    </p>
                    <p className="text-[9px] font-bold">12/28</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}