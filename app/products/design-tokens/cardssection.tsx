'use client';
import React, { useState } from 'react';
import { 
  Lock, LayoutGrid, SlidersHorizontal, RefreshCw, 
  ArrowDownLeft, ShoppingBag, Utensils, Cloud, Wifi 
} from 'lucide-react';

// --- Data Definitions ---

const ACCENT_COLORS = [
  { id: 'blue', value: '#0040DF', label: 'Primary Blue' },
  { id: 'green', value: '#059669', label: 'Emerald Green' },
  { id: 'purple', value: '#7C3AED', label: 'Violet' },
  { id: 'dark', value: '#0F172A', label: 'Midnight' },
];

const ACTIVITY_DATA = [
  {
    id: '1',
    title: 'Acme Design Studio',
    tag: 'Inflow',
    tagColor: 'bg-emerald-100 text-emerald-700',
    subtitle: 'Today, 4:10 PM · Direct Deposit',
    amount: '+$2,400.00',
    status: 'Received',
    statusColor: 'text-emerald-600',
    Icon: ArrowDownLeft,
    iconBg: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: '2',
    title: 'Apple Park Store',
    tag: 'Shopping',
    tagColor: 'bg-slate-200 text-slate-600',
    subtitle: 'Today, 2:45 PM · Contactless',
    amount: '-$1,199.00',
    status: 'Settled',
    statusColor: 'text-slate-400',
    Icon: ShoppingBag,
    iconBg: 'bg-slate-900 text-white'
  },
  {
    id: '3',
    title: 'Nobu Downtown',
    tag: 'Dining',
    tagColor: 'bg-orange-100 text-orange-700',
    subtitle: 'Yesterday, 8:12 PM · Chip',
    amount: '-$248.50',
    status: 'Settled',
    statusColor: 'text-slate-400',
    Icon: Utensils,
    iconBg: 'bg-orange-100 text-orange-600'
  },
  {
    id: '4',
    title: 'OpenAI API Cloud',
    tag: 'Subscriptions',
    tagColor: 'bg-blue-100 text-blue-700',
    subtitle: 'May 14, 00:01 AM · Recurring',
    amount: '-$120.00',
    status: 'Pending',
    statusColor: 'text-orange-500',
    Icon: Cloud,
    iconBg: 'bg-purple-100 text-purple-600'
  }
];

// --- Main Component ---

export default function MultiSurfaceSection() {
  const [accentColor, setAccentColor] = useState('#0040DF');
  const [radius, setRadius] = useState(8);
  const [density, setDensity] = useState<'compact' | 'default' | 'spacious'>('default');

  // Helper to calculate spacing based on density
  const getSpacing = () => {
    switch (density) {
      case 'compact': return { cardPad: 'p-4', gap: 'gap-2', itemPad: 'p-2.5' };
      case 'spacious': return { cardPad: 'p-8', gap: 'gap-4', itemPad: 'p-4' };
      default: return { cardPad: 'p-6', gap: 'gap-3', itemPad: 'p-3.5' };
    }
  };

  const spacing = getSpacing();

  return (
    <section className="w-full bg-[#F8F9FC] py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
      <div className="mx-auto max-w-full px-6">
        
        {/* Header Section */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#0040DF]">
            Multi-Surface Architecture
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
            Same tokens, every surface.
          </h2>
          <p className="text-[14px] leading-relaxed text-slate-500">
            Adjust foundational tokens and watch uniform token values drive mobile applications, enterprise web consoles, and institutional physical cards simultaneously.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* ========================================================
              1. Global Control Rail
             ======================================================== */}
          <div className="lg:col-span-4 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-[14px] font-bold text-slate-900">Global Control Rail</h3>
            </div>
            
            <div className="flex-1 space-y-6 p-5">
              
              {/* Primary Accent */}
              <div>
                <label className="mb-3 block text-[11px] font-medium text-slate-500">Primary Accent</label>
                <div className="flex gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccentColor(color.value)}
                      aria-label={`Select ${color.label}`}
                      className={`h-9 w-full rounded-md transition-all duration-200 ${
                        accentColor === color.value 
                          ? 'ring-2 ring-offset-2 ring-slate-900 scale-[1.02]' 
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Base Radius */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-medium text-slate-500">Base Radius</label>
                  <span className="font-mono text-[11px] font-semibold text-slate-900">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Spatial Density */}
              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-500">Spatial Density</label>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {(['compact', 'default', 'spacious'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`flex-1 rounded-md py-1.5 text-[10px] font-bold capitalize transition-all ${
                        density === d
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {d === 'default' ? 'Default' : d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="rounded-b-xl border-t border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] leading-relaxed text-slate-500 italic">
                "Designed to reuse the same approved settings across channels. Channel availability is agreed per programme."
              </p>
            </div>
          </div>

          {/* ========================================================
              2. Middle Column: Card & Actions
             ======================================================== */}
          <div className="lg:col-span-4 flex flex-col items-center">
            
            {/* The Card */}
            <div 
              className={`relative w-full aspect-[1.586/1] overflow-hidden text-white shadow-xl transition-all duration-300 flex flex-col justify-between ${spacing.cardPad}`}
              style={{ 
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 50%, ${accentColor} 100%)`,
                borderRadius: `${radius}px`
              }}
            >
              {/* Card Top Row */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                    <span className="text-[10px] font-bold">A</span>
                  </div>
                  <span className="text-[11px] font-bold tracking-wider">APEX COMMERCIAL FLEET</span>
                </div>
                <Wifi className="h-4 w-4 rotate-90 opacity-60" />
              </div>

              {/* Chip & Number */}
              <div className="relative z-10">
                <div className="mb-3 h-7 w-9 rounded-sm bg-gradient-to-br from-slate-300 to-slate-400 opacity-80" />
                <p className="font-mono text-[15px] tracking-[0.25em] opacity-90">•••• •••• •••• 4892</p>
              </div>

              {/* Card Bottom Row */}
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-widest opacity-60 mb-0.5">Cardholder</p>
                  <p className="text-[11px] font-semibold tracking-wide">ALEX RIVERA</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-widest opacity-60 mb-0.5">Expires</p>
                  <p className="text-[11px] font-mono">08/28</p>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="mt-4 flex gap-1.5">
              <span className="h-1 w-4 rounded-full bg-slate-800" />
              <span className="h-1 w-1 rounded-full bg-slate-300" />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid w-full grid-cols-4 gap-2">
              {[
                { label: 'Freeze', Icon: Lock },
                { label: 'Details', Icon: LayoutGrid },
                { label: 'Limits', Icon: SlidersHorizontal },
                { label: 'Replace', Icon: RefreshCw }
              ].map((btn) => (
                <button 
                  key={btn.label} 
                  className="flex flex-col items-center justify-center gap-2 border border-slate-200 bg-white py-3 shadow-sm transition-colors hover:bg-slate-50"
                  style={{ borderRadius: `${radius}px` }}
                >
                  <btn.Icon className="h-4 w-4 text-slate-600" />
                  <span className="text-[9px] font-semibold text-slate-600">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================
              3. Right Column: Activity List
             ======================================================== */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">Card Activity</h3>
              <span className="text-[10px] font-semibold text-slate-400">Titanium · 8824</span>
            </div>

            <div className={`flex flex-col ${spacing.gap}`}>
              {ACTIVITY_DATA.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between bg-white border border-slate-200 shadow-sm transition-all ${spacing.itemPad}`}
                  style={{ borderRadius: `${radius}px` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.iconBg}`} style={{ borderRadius: `${radius}px` }}>
                      <item.Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] font-bold text-slate-900">{item.title}</p>
                        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[9px] text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[12px] font-bold ${item.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.amount}
                    </p>
                    <p className={`text-[9px] font-semibold ${item.statusColor}`}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}