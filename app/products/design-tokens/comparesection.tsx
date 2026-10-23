'use client';
import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';

// --- Theme Data Definitions ---

type ThemeId = 'harbor' | 'lumen' | 'northbeam' | 'custom';

interface ThemeTokens {
  id: ThemeId;
  name: string;
  description: string;
  colorDot: string;
  tokens: {
    'color.primary': string;
    'color.surface': string;
    'color.text': string;
    'radius.base': string;
    'radius.button': string;
    'font.family': string;
    'space.inset': string;
    'border.subtle': string;
  };
}

const THEMES: Record<ThemeId, ThemeTokens> = {
  harbor: {
    id: 'harbor',
    name: 'Harbor',
    description: 'Deep Navy & Cyan',
    colorDot: '#002019',
    tokens: {
      'color.primary': '#002019',
      'color.surface': '#0F172A',
      'color.text': '#F8FAFC',
      'radius.base': '4px',
      'radius.button': '6px',
      'font.family': 'Geist, sans-serif',
      'space.inset': '20px',
      'border.subtle': 'rgba(255,255,255,0.1)',
    },
  },
  lumen: {
    id: 'lumen',
    name: 'Lumen',
    description: 'Clean White & Cobalt',
    colorDot: '#0040DF',
    tokens: {
      'color.primary': '#0040DF',
      'color.surface': '#FFFFFF',
      'color.text': '#0F172A',
      'radius.base': '8px',
      'radius.button': '8px',
      'font.family': 'Inter, sans-serif',
      'space.inset': '24px',
      'border.subtle': 'rgba(0,0,0,0.1)',
    },
  },
  northbeam: {
    id: 'northbeam',
    name: 'Northbeam',
    description: 'Slate & Emerald',
    colorDot: '#10B981',
    tokens: {
      'color.primary': '#10B981',
      'color.surface': '#1E293B',
      'color.text': '#F8FAFC',
      'radius.base': '12px',
      'radius.button': '12px',
      'font.family': 'Geist, sans-serif',
      'space.inset': '16px',
      'border.subtle': 'rgba(255,255,255,0.05)',
    },
  },
  custom: {
    id: 'custom',
    name: 'Your colour',
    description: 'Custom theme',
    colorDot: '#7C3AED',
    tokens: {
      'color.primary': '#7C3AED',
      'color.surface': '#FAFAFA',
      'color.text': '#111827',
      'radius.base': '0px',
      'radius.button': '999px',
      'font.family': 'Space Grotesk, sans-serif',
      'space.inset': '32px',
      'border.subtle': 'rgba(0,0,0,0.05)',
    },
  },
};

const TABLE_KEYS = [
  'color.primary',
  'color.surface',
  'color.text',
  'radius.base',
  'radius.button',
  'font.family',
  'space.inset',
  'border.subtle',
] as const;

// --- Main Component ---

export default function CompareSection() {
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('harbor');
  const [compareMode, setCompareMode] = useState(false);

  const activeTheme = THEMES[activeThemeId];
  const { tokens } = activeTheme;

  // Determine text color based on surface for the preview
  const isSurfaceDark = tokens['color.surface'] === '#0F172A' || tokens['color.surface'] === '#1E293B';

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto flex flex-col items-center space-y-12">
        
        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#0040DF]">
              Themes
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
              Swap the values. Keep the structure.
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-500">
              A theme is a set of values for the same token names. Switch themes and the same components take on a different brand without being rebuilt.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 text-[13px] font-semibold text-slate-900 mt-2">
            <button className="flex items-center gap-1.5 hover:text-[#0040DF] transition-colors">
              See light and dark <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#0040DF] transition-colors">
              Build your own <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Theme Switcher & Controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(Object.values(THEMES) as ThemeTokens[]).map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold transition-all ${
                    isActive
                      ? 'border-transparent bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.colorDot }}
                  />
                  <span>
                    {theme.name}{' '}
                    <span className={`font-normal ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      ({theme.description})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-slate-500">Compare</span>
            <button 
              onClick={() => setCompareMode(!compareMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${compareMode ? 'bg-[#0040DF]' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${compareMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Token Values Table */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-slate-900">Token Values</h3>
              <span className="text-[11px] font-medium text-slate-400">Dynamic Bindings</span>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 px-4 py-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Token</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Value</span>
              </div>
              <div className="divide-y divide-slate-100">
                {TABLE_KEYS.map((key) => (
                  <div key={key} className="grid grid-cols-2 px-4 py-3 items-center hover:bg-slate-50/50 transition-colors">
                    <span className="text-[11px] font-semibold text-slate-700">{key}</span>
                    <span className="font-mono text-[11px] text-slate-500 truncate" title={tokens[key]}>
                      {tokens[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Preview Area */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Preview Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-slate-900">Preview</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real-Time Reskin
              </span>
            </div>

            {/* Preview Card Container */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-[#F8F9FC] p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
              
              {/* The Dynamic Card */}
              <div 
                className="relative w-full max-w-[560px] overflow-hidden transition-all duration-500 ease-in-out flex flex-col"
                style={{
                  backgroundColor: tokens['color.surface'],
                  color: tokens['color.text'],
                  borderRadius: tokens['radius.base'],
                  padding: tokens['space.inset'],
                  border: `1px solid ${tokens['border.subtle']}`,
                  boxShadow: isSurfaceDark 
                    ? '0 20px 40px -10px rgba(0,0,0,0.5)' 
                    : '0 20px 40px -10px rgba(0,0,0,0.1)'
                }}
              >
                {/* Decorative background gradient/shape based on primary color */}
                <div 
                  className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full opacity-30 blur-3xl transition-colors duration-500"
                  style={{ backgroundColor: tokens['color.primary'] }}
                />

                {/* Card Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> Total Net Balance
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                      ↗ +4.4% vs last month
                    </span>
                  </div>

                  <div className="mb-8">
                    <p className="text-[42px] font-bold leading-none tracking-tight">
                      $25,000<span className="text-[24px] opacity-50">.40</span>
                    </p>
                    <p className="mt-2 text-[11px] opacity-50">Active Vault • Obsidian Tier Account</p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2.5 rounded-full bg-black/20 p-1.5 pr-4 backdrop-blur-sm border border-white/5">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                          <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" />
                        </span>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider opacity-50">Inflow Total</p>
                          <p className="text-[12px] font-bold">+$20,000.00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-full bg-black/20 p-1.5 pr-4 backdrop-blur-sm border border-white/5">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                          <ArrowUpRight className="h-3.5 w-3.5 text-rose-400" />
                        </span>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider opacity-50">Outflow Total</p>
                          <p className="text-[12px] font-bold">-$17,000.00</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="flex items-center gap-2 bg-white px-4 py-2.5 text-[11px] font-bold shadow-lg transition-transform hover:scale-105"
                      style={{ 
                        color: tokens['color.surface'],
                        borderRadius: tokens['radius.button']
                      }}
                    >
                      My Wallet 
                      <span 
                        className="grid h-4 w-4 place-items-center rounded-full text-white"
                        style={{ backgroundColor: tokens['color.primary'] }}
                      >
                        <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section: Same Names, Different Values */}
        <div className="w-full border-t border-slate-100 pt-10">
          <h4 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Same names, different values
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[THEMES.harbor, THEMES.lumen, THEMES.northbeam].map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <div 
                  key={theme.id} 
                  className={`rounded-xl border p-4 transition-all ${
                    isActive ? 'border-slate-300 bg-slate-50 shadow-sm' : 'border-slate-100 bg-white opacity-60 hover:opacity-100'
                  }`}
                >
                  <p className="mb-3 text-[12px] font-bold text-slate-900">{theme.name}</p>
                  <div className="space-y-1.5 font-mono text-[10px] text-slate-500">
                    <p className="flex justify-between">
                      <span>color.primary:</span> 
                      <span className="font-semibold text-slate-700">{theme.tokens['color.primary']}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>color.surface:</span> 
                      <span className="font-semibold text-slate-700">{theme.tokens['color.surface']}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>radius.base:</span> 
                      <span className="font-semibold text-slate-700">{theme.tokens['radius.base']}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}