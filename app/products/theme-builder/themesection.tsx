'use client';
import React, { useState, useMemo } from 'react';
import {
  Search, Bell, ArrowRight, ArrowUpRight, ArrowDownLeft,
  Send, CreditCard, Receipt, Plus, Users, Wifi, Smartphone,
  Monitor, Shuffle, Moon, Sun, Snowflake,
  Eye, Coffee, PenTool, Sparkles, Home, PieChart, Settings, User, Battery, Signal,
  ShieldCheck
} from 'lucide-react';

// --- Types & Interfaces ---

type RadiusMode = 'sharp' | 'default' | 'organic';
type DensityMode = 'compact' | 'standard' | 'roomy';
type ElevationMode = 'flat' | 'soft';

interface ViewCtx {
  accent: string;
  secondary: string;
  neutral: string;
  isDark: boolean;
  radius: string;
  elevation: string;
  borderWeight: string;
  density: DensityMode;
  bgCard: string;
  bgSurface: string;
  textPrimary: string;
  textSecondary: string;
}

// --- Color Utilities ---

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1).toUpperCase()}`;
}

function mixColors(color1: string, color2: string, weight: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    c1.r + (c2.r - c1.r) * weight,
    c1.g + (c2.g - c1.g) * weight,
    c1.b + (c2.b - c1.b) * weight
  );
}

function generateScale(baseHex: string) {
  const white = '#FFFFFF';
  const black = '#000000';
  return [
    mixColors(baseHex, white, 0.90), // 50
    mixColors(baseHex, white, 0.75), // 100
    mixColors(baseHex, white, 0.60), // 200
    mixColors(baseHex, white, 0.40), // 300
    mixColors(baseHex, white, 0.20), // 400
    baseHex,                         // 500
    mixColors(baseHex, black, 0.20), // 600
    mixColors(baseHex, black, 0.40), // 700
    mixColors(baseHex, black, 0.60), // 800
    mixColors(baseHex, black, 0.90), // 900
  ];
}

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128;
}

// --- Module Components ---

function HeroBalanceCard({ ctx }: { ctx: ViewCtx }) {
  const pad = ctx.density === 'compact' ? 'p-4' : ctx.density === 'roomy' ? 'p-8' : 'p-6';
  // Use primary accent to tint the dark background
  const gradient = `linear-gradient(135deg, #0B132B 0%, ${mixColors(ctx.accent, '#000000', 0.7)} 100%)`; 
  
  return (
    <div className={`relative flex h-full min-h-[220px] flex-col overflow-hidden text-white ${pad} ${ctx.radius} ${ctx.elevation}`} style={{ background: gradient }}>
      <svg viewBox="0 0 600 240" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
        
      </svg>
      
      <div className="relative z-10 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" /> Total Net Balance
        </span>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">+4.4% vs last month</span>
      </div>

      <div className="relative z-10 mt-4 flex flex-1 flex-col justify-between">
        <div>
          <p className="text-[36px] font-bold leading-none tracking-tight">$25,000<span className="text-[20px] text-white/60">.40</span></p>
          <p className="mt-2 text-[10px] text-white/50">Active Vault • Obsidian Tier Account</p>
        </div>
        
        <div className="mt-6 flex items-end justify-between">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10"><ArrowDownLeft className="h-3 w-3 text-emerald-300" /></span>
              <div><p className="text-[8px] uppercase tracking-wider text-white/50">Inflow Total</p><p className="text-[11px] font-bold">+$20,000.00</p></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10"><ArrowUpRight className="h-3 w-3 text-rose-300" /></span>
              <div><p className="text-[8px] uppercase tracking-wider text-white/50">Outflow Total</p><p className="text-[11px] font-bold">-$17,000.00</p></div>
            </div>
          </div>
          <button type="button" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-bold text-slate-900 shadow-lg transition hover:bg-slate-100">
            My Wallet <span className="grid h-4 w-4 place-items-center rounded-full text-white" style={{ backgroundColor: ctx.accent }}><ArrowRight className="h-2.5 w-2.5" /></span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveCardWidget({ ctx }: { ctx: ViewCtx }) {
  const pad = ctx.density === 'compact' ? 'p-3' : ctx.density === 'roomy' ? 'p-5' : 'p-4';
  return (
    <div className={`${ctx.bgCard} ${pad} ${ctx.radius} ${ctx.elevation} ${ctx.borderWeight}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className={`text-[12px] font-bold ${ctx.textPrimary}`}>My Active Card</p>
        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: `${ctx.accent}15`, color: ctx.accent }}>Platinum</span>
      </div>
      
      <div className={`relative flex min-h-[150px] flex-col justify-between overflow-hidden p-4 text-white ${ctx.radius}`} style={{ background: `linear-gradient(135deg, ${ctx.secondary} 0%, ${mixColors(ctx.secondary, '#000000', 0.6)} 100%)` }}>
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-extrabold tracking-wider">OK PRIVATE</span>
          <Wifi className="h-4 w-4 rotate-90 opacity-70" />
        </div>
        <div>
          <div className="h-5 w-7 rounded-sm bg-gradient-to-br from-amber-300 to-amber-500" />
          <p className="mt-2 font-mono text-[12px] tracking-[0.2em]">•••• 8824</p>
        </div>
        <div className="flex items-end justify-between text-[8px] opacity-80">
          <span>KRISHNAN A.</span>
          <span>EXP 08/29</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className={`flex flex-1 items-center justify-center gap-1.5 border border-slate-200 py-1.5 text-[10px] font-semibold hover:bg-slate-50 ${ctx.radius} ${ctx.isDark ? 'border-slate-700 text-slate-300' : 'text-slate-600'}`}>
          <Snowflake className="h-3 w-3" /> Freeze Card
        </button>
        <button className={`flex flex-1 items-center justify-center gap-1.5 border border-slate-200 py-1.5 text-[10px] font-semibold hover:bg-slate-50 ${ctx.radius} ${ctx.isDark ? 'border-slate-700 text-slate-300' : 'text-slate-600'}`}>
          <Eye className="h-3 w-3" /> View Details
        </button>
      </div>
    </div>
  );
}

function EarningsChannelsCard({ ctx }: { ctx: ViewCtx }) {
  const pad = ctx.density === 'compact' ? 'p-3' : ctx.density === 'roomy' ? 'p-5' : 'p-4';
  // Dynamically generate gradient variations based on primary and secondary seeds
  const channels = [
    { name: 'Upwork Escrow', amt: '$3,000.00', tag: '8 Contracts', bg: `linear-gradient(135deg, ${ctx.accent} 0%, ${mixColors(ctx.accent, '#000000', 0.3)} 100%)`, icon: 'U' },
    { name: 'Freepik Contributor', amt: '$3,000.00', tag: 'Monthly Fee', bg: `linear-gradient(135deg, ${ctx.secondary} 0%, ${mixColors(ctx.secondary, '#000000', 0.3)} 100%)`, icon: 'F' },
    { name: 'Envato Market', amt: '$2,000.00', tag: 'Royalties', bg: `linear-gradient(135deg, ${mixColors(ctx.accent, ctx.secondary, 0.5)} 0%, ${mixColors(ctx.accent, '#000000', 0.5)} 100%)`, icon: 'E' },
  ];

  return (
    <div className={`flex h-full flex-col ${ctx.bgCard} ${ctx.borderWeight} ${ctx.radius} ${ctx.elevation} overflow-hidden`}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <p className={`text-[12px] font-bold ${ctx.textPrimary}`}>Earnings Channels</p>
        <button className="text-[10px] font-semibold" style={{ color: ctx.accent }}>Manage Streams</button>
      </div>
      <div className={`grid flex-1 grid-cols-3 gap-3 ${pad}`}>
        {channels.map((c) => (
          <div key={c.name} className={`relative flex flex-col justify-between p-3 text-white ${ctx.radius}`} style={{ background: c.bg }}>
            <div className="flex items-start justify-between">
              <span className="grid h-6 w-6 place-items-center rounded bg-white/20 text-[10px] font-bold">{c.icon}</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[7px] font-bold">{c.tag}</span>
            </div>
            <div className="mt-4">
              <p className="text-[8px] text-white/80">{c.name}</p>
              <p className="mt-0.5 text-[14px] font-bold tracking-tight">{c.amt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickTransferCard({ ctx }: { ctx: ViewCtx }) {
  const pad = ctx.density === 'compact' ? 'p-3' : ctx.density === 'roomy' ? 'p-5' : 'p-4';
  const people = ['SJ', 'AR', 'DC', 'MP'];
  
  return (
    <div className={`${ctx.bgCard} ${pad} ${ctx.radius} ${ctx.elevation} ${ctx.borderWeight}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className={`text-[12px] font-bold ${ctx.textPrimary}`}>Quick Transfer</p>
        <Users className="h-3.5 w-3.5 text-slate-400" />
      </div>
      
      <div className="flex items-center gap-2">
        <button className="flex flex-col items-center gap-1">
          <span className={`grid h-8 w-8 place-items-center border border-dashed border-slate-300 text-slate-400 ${ctx.radius}`}><Plus className="h-3 w-3" /></span>
          <span className="text-[7px] font-medium text-slate-400">Add</span>
        </button>
        {people.map((p, i) => (
          <div key={p} className="flex flex-col items-center gap-1">
            <span 
              className={`grid h-8 w-8 place-items-center text-[9px] font-bold ${ctx.radius} ${i === 0 ? 'text-white' : ''}`} 
              style={{ 
                backgroundColor: i === 0 ? ctx.accent : `${ctx.accent}20`, 
                color: i === 0 ? '#fff' : ctx.accent 
              }}
            >
              {p}
            </span>
            <span className="text-[7px] font-medium text-slate-500">{p === 'SJ' ? 'Sarah' : p === 'AR' ? 'Alex R.' : p === 'DC' ? 'David C.' : 'Maya P.'}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className={`flex-1 px-3 py-1.5 text-[11px] font-bold ${ctx.radius} ${ctx.isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>$ 350.00</div>
        <button 
          className="text-white text-[10px] font-bold px-3 py-1.5 transition-colors hover:opacity-90" 
          style={{ backgroundColor: ctx.accent, borderRadius: ctx.radius === 'rounded-full' ? '9999px' : ctx.radius === 'rounded-lg' ? '8px' : ctx.radius === 'rounded-none' ? '0px' : '16px' }}
        >
          Send Now
        </button>
      </div>
    </div>
  );
}

function ActivityFeedCard({ ctx }: { ctx: ViewCtx }) {
  const pad = ctx.density === 'compact' ? 'p-3' : ctx.density === 'roomy' ? 'p-5' : 'p-4';
  const rows = [
    { name: 'Apple Flagship Store', sub: 'Card • 8824 • Today, 10:42 AM', tag: 'Electronics', amt: -149.0, Icon: CreditCard },
    { name: 'Figma Design Payout', sub: 'Direct Deposit • Yesterday • Settled', tag: 'Design System Contract', amt: 1250.0, Icon: PenTool },
    { name: 'Blue Bottle Coffee', sub: 'Contactless Pay • Oct 22, 09:15 AM', tag: 'Dining', amt: -8.4, Icon: Coffee },
    { name: 'Stripe Payout', sub: 'Automated Sweep • Oct 21', tag: 'SaaS Subscriptions', amt: 2400.0, Icon: Sparkles },
  ];

  return (
    <div className={`${ctx.bgCard} ${pad} ${ctx.radius} ${ctx.elevation} ${ctx.borderWeight} flex flex-col`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className={`text-[12px] font-bold ${ctx.textPrimary}`}>Activity & Transactions</p>
          <p className="mt-0.5 text-[9px] text-slate-400">Live clearing records for all connected cards and payouts</p>
        </div>
        <div className={`flex items-center gap-0.5 p-0.5 ${ctx.radius} ${ctx.isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          {(['All', 'Income', 'Expenses'] as const).map((t, i) => (
            <button key={t} className={`px-2 py-0.5 text-[8px] font-bold ${i === 0 ? `${ctx.radius} shadow-sm ${ctx.isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'}` : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="mt-1 flex-1 space-y-1.5">
        {rows.map((r) => (
          <div key={r.name} className={`flex items-center justify-between gap-3 p-2 transition-colors ${ctx.radius} ${ctx.isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded ${ctx.isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}><r.Icon className="h-3.5 w-3.5" /></span>
              <div className="min-w-0">
                <p className={`truncate text-[10px] font-bold ${ctx.textPrimary}`}>{r.name}</p>
                <p className="truncate text-[8px] text-slate-400">{r.sub}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-[10px] font-bold ${r.amt > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {r.amt > 0 ? '+' : '-'}${Math.abs(r.amt).toFixed(2)}
              </p>
              <p className="text-[8px] text-slate-400">{r.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsTargetsCard({ ctx }: { ctx: ViewCtx }) {
  const pad = ctx.density === 'compact' ? 'p-3' : ctx.density === 'roomy' ? 'p-5' : 'p-4';
  const goals = [
    { name: 'iPhone 13 Mini', pct: 100, amt: '$699', left: 'Saved $699 of $699', right: 'Target Cleared' },
    { name: 'MacBook Pro M1', pct: 75, amt: '$1,499', left: 'Saved $1,499 of $2,000', right: '$501 remaining' },
  ];

  return (
    <div className={`${ctx.bgCard} ${pad} ${ctx.radius} ${ctx.elevation} ${ctx.borderWeight}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className={`text-[12px] font-bold ${ctx.textPrimary}`}>Savings Targets</p>
        <button className={`grid h-5 w-5 place-items-center ${ctx.radius} ${ctx.isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}><Plus className="h-3 w-3" /></button>
      </div>
      
      <div className="space-y-2">
        {goals.map((g) => (
          <div key={g.name} className={`border p-2.5 ${ctx.radius} ${ctx.isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <p className={`text-[10px] font-bold ${ctx.textPrimary}`}>{g.name}</p>
                <p className="text-[8px] text-slate-400">{g.pct}% {g.pct === 100 ? 'Reached' : 'of Target'}</p>
              </div>
              <span className={`text-[10px] font-bold ${ctx.textPrimary}`}>{g.amt}</span>
            </div>
            <div className={`h-1 overflow-hidden rounded-full ${ctx.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.pct === 100 ? '#10B981' : ctx.accent }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[8px] font-semibold text-slate-400">
              <span>{g.left}</span>
              <span style={{ color: g.pct === 100 ? '#10B981' : ctx.accent }}>{g.right}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Theme Section Component ---

export default function ThemeSection() {
  // Theme State
  const [primarySeed, setPrimarySeed] = useState('#172EA5');
  const [secondarySeed, setSecondarySeed] = useState('#5E7E9E');
  const [neutralSurface, setNeutralSurface] = useState('#F2F4F7');
  const [isDark, setIsDark] = useState(false);
  const [radiusMode, setRadiusMode] = useState<RadiusMode>('default');
  const [borderWeight, setBorderWeight] = useState('1px');
  const [density, setDensity] = useState<DensityMode>('standard');
  const [elevation, setElevation] = useState<ElevationMode>('soft');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Derived scale
  const scale = useMemo(() => generateScale(primarySeed), [primarySeed]);

  // Derived Context
  const ctx: ViewCtx = useMemo(() => {
    const radiusClass = radiusMode === 'sharp' ? 'rounded-none' : radiusMode === 'organic' ? 'rounded-2xl' : 'rounded-lg';
    const elevationClass = elevation === 'flat' ? '' : 'shadow-sm';
    
    return {
      accent: primarySeed,
      secondary: secondarySeed,
      neutral: neutralSurface,
      isDark,
      radius: radiusClass,
      elevation: elevationClass,
      borderWeight: borderWeight === '2px' ? `border-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}` : `border ${isDark ? 'border-slate-800' : 'border-slate-200'}`,
      density,
      bgCard: isDark ? 'bg-slate-900 text-white' : 'bg-white',
      bgSurface: isDark ? 'bg-slate-950' : 'bg-[#F8F9FC]',
      textPrimary: isDark ? 'text-white' : 'text-slate-900',
      textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
    };
  }, [primarySeed, secondarySeed, neutralSurface, isDark, radiusMode, borderWeight, density, elevation]);

  const shuffleColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    setPrimarySeed(randomHex);
  };

  const renderHomeContent = () => (
    <div className={`flex flex-col gap-4 ${viewMode === 'mobile' ? 'w-full pb-20' : 'w-full'}`}>
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-[22px] font-bold tracking-tight ${ctx.textPrimary}`}>Good Morning, User</h2>
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[8px] font-bold text-indigo-600" style={{ backgroundColor: `${ctx.accent}20`, color: ctx.accent }}>PRO HUB</span>
          </div>
          <p className={`mt-1 max-w-sm text-[10px] ${ctx.textSecondary}`}>Here is an integrated breakdown of your cash velocity and liquid capital for today.</p>
        </div>
        {viewMode === 'desktop' && (
          <div className="flex items-center gap-1.5">
            <button className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold text-white ${ctx.radius}`} style={{ backgroundColor: ctx.accent }}><Send className="h-2.5 w-2.5" /> Send Money</button>
            <button className={`flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold ${ctx.textPrimary} ${ctx.radius}`}><CreditCard className="h-2.5 w-2.5" /> Top Up Card</button>
            <button className={`flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold ${ctx.textPrimary} ${ctx.radius}`}><ArrowDownLeft className="h-2.5 w-2.5" /> Request</button>
            <button className={`flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold ${ctx.textPrimary} ${ctx.radius}`}><Receipt className="h-2.5 w-2.5" /> Pay Bills</button>
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className={`grid gap-4 ${viewMode === 'desktop' ? 'grid-cols-12' : 'grid-cols-1'}`}>
        <div className={viewMode === 'desktop' ? 'col-span-8' : ''}>
          <HeroBalanceCard ctx={ctx} />
        </div>
        <div className={viewMode === 'desktop' ? 'col-span-4' : ''}>
          <ActiveCardWidget ctx={ctx} />
        </div>
        <div className={viewMode === 'desktop' ? 'col-span-8' : ''}>
          <EarningsChannelsCard ctx={ctx} />
        </div>
        <div className={viewMode === 'desktop' ? 'col-span-4' : ''}>
          <QuickTransferCard ctx={ctx} />
        </div>
        <div className={viewMode === 'desktop' ? 'col-span-8' : ''}>
          <ActivityFeedCard ctx={ctx} />
        </div>
        <div className={viewMode === 'desktop' ? 'col-span-4' : ''}>
          <SavingsTargetsCard ctx={ctx} />
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[#F8F9FC] py-16 font-sans text-slate-900">
      <div className="mx-auto max-w-[1400px] px-6">
        
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#0040DF]">Theme Builder</p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">Shape a theme, then see it on every screen.</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            Pick a seed colour, set type, shape and spacing, and watch the components, mobile frame and desktop portal update as you go. Save versions and send changes for review.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-bold text-slate-900">Apex Commercial v3</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">v3.2.0-draft</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDark(false)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${!isDark ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Sun className="h-3 w-3" /> Light
            </button>
            <button 
              onClick={() => setIsDark(true)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${isDark ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Moon className="h-3 w-3" /> Dark
            </button>
            <button className="ml-2 flex items-center gap-1.5 rounded-md px-4 py-1.5 text-[11px] font-bold text-white shadow-sm hover:opacity-90" style={{ backgroundColor: ctx.accent }}>
              Export code
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          
          {/* Left Panel: Theme Controls */}
          <div className="space-y-4">
            
            {/* Theme Library */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Theme Library Item</span>
                <span className="text-[10px] text-slate-400">4 registered</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { name: 'Apex Primary', active: true },
                  { name: 'Slate Nordic', active: false, status: 'Approved' },
                  { name: 'Indigo Trust', active: false, status: 'In review' }
                ].map(item => (
                  <div key={item.name} className={`flex flex-col items-center justify-center rounded-md border p-2 text-center cursor-pointer hover:bg-slate-50 ${item.active ? 'border-slate-300 bg-slate-50' : 'border-transparent'}`}>
                    <span className={`text-[9px] font-bold ${item.active ? 'text-slate-900' : 'text-slate-500'}`}>{item.name}</span>
                    {item.status ? (
                      <span className={`mt-0.5 rounded-sm px-1 text-[7px] font-bold ${item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                    ) : (
                      <span className="mt-0.5 text-[7px] text-slate-400">Draft</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Seed & Scale */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Primary seed</span>
                <button onClick={shuffleColor} className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900">
                  <Shuffle className="h-3 w-3" /> Shuffle
                </button>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded border border-slate-200">
                  <input type="color" value={primarySeed} onChange={(e) => setPrimarySeed(e.target.value.toUpperCase())} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  <div className="h-full w-full" style={{ backgroundColor: primarySeed }} />
                </div>
                <input 
                  type="text" 
                  value={primarySeed} 
                  onChange={(e) => setPrimarySeed(e.target.value.toUpperCase())}
                  className="flex-1 rounded bg-slate-50 px-2 py-1.5 text-[11px] font-mono font-medium outline-none ring-1 ring-transparent focus:ring-blue-500"
                />
              </div>

              <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] font-medium text-slate-500">10-step harmonic scale</span>
                <span className="text-[9px] text-slate-400">Tone vs Canvas</span>
              </div>
              <div className="flex h-8 w-full overflow-hidden rounded">
                {scale.map((color, i) => (
                  <div key={i} className="relative flex flex-1 items-end justify-center pb-1" style={{ backgroundColor: color }}>
                    <span className={`text-[7px] font-bold ${isLight(color) ? 'text-slate-800' : 'text-white'}`}>{i * 100 + 50}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary & Neutral */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Secondary seed</span>
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded border border-slate-200">
                    <input type="color" value={secondarySeed} onChange={(e) => setSecondarySeed(e.target.value.toUpperCase())} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    <div className="h-full w-full" style={{ backgroundColor: secondarySeed }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{secondarySeed}</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Neutral surface</span>
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded border border-slate-200">
                    <input type="color" value={neutralSurface} onChange={(e) => setNeutralSurface(e.target.value.toUpperCase())} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    <div className="h-full w-full" style={{ backgroundColor: neutralSurface }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{neutralSurface}</span>
                </div>
              </div>
            </div>

            {/* Radius */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Corner radius</span>
                <span className="text-[11px] font-bold text-slate-900">{radiusMode === 'sharp' ? '0px' : radiusMode === 'organic' ? '20px' : '8px'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['sharp', 'default', 'organic'] as RadiusMode[]).map(r => (
                  <button 
                    key={r}
                    onClick={() => setRadiusMode(r)}
                    className={`rounded border py-2 text-[9px] font-semibold transition ${radiusMode === r ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {r === 'sharp' ? '0px (Sharp)' : r === 'default' ? '8px (Default)' : '20px (Organic)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Weight */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Border structural weight</span>
                <span className="text-[11px] font-bold text-slate-900">{borderWeight}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['1px', '2px'].map(w => (
                  <button 
                    key={w}
                    onClick={() => setBorderWeight(w)}
                    className={`rounded border py-2 text-[9px] font-semibold transition ${borderWeight === w ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {w === '1px' ? '1px' : '2px'}
                  </button>
                ))}
              </div>
            </div>

            {/* Density & Elevation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Density scale</span>
                <div className="flex bg-slate-100 p-0.5 rounded">
                  {(['compact', 'standard', 'roomy'] as DensityMode[]).map(d => (
                    <button 
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`flex-1 rounded py-1 text-[8px] font-semibold transition ${density === d ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      {d === 'compact' ? 'Compact' : d === 'standard' ? 'Std' : 'Roomy'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Elevation depth</span>
                <div className="flex bg-slate-100 p-0.5 rounded">
                  {(['flat', 'soft'] as ElevationMode[]).map(e => (
                    <button 
                      key={e}
                      onClick={() => setElevation(e)}
                      className={`flex-1 rounded py-1 text-[8px] font-semibold transition ${elevation === e ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      {e === 'flat' ? 'Flat (px)' : 'Soft shadow'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Preview Area */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            
            {/* Preview Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-[#FBFCFF] px-4 py-2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-1.5 pb-2 text-[11px] font-bold border-b-2 transition-colors ${viewMode === 'desktop' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Monitor className="h-3.5 w-3.5" /> Desktop portal (1440px)
                </button>
                <button 
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-1.5 pb-2 text-[11px] font-bold border-b-2 transition-colors ${viewMode === 'mobile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> Mobile frame (390px)
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium text-slate-400">Auto-sync enabled</span>
              </div>
            </div>

            {/* Preview Toolbar (Desktop only) */}
            {viewMode === 'desktop' && (
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
                <div className="relative flex w-full max-w-md items-center">
                  <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search transactions, cards, payees..." 
                    className="w-full rounded-md bg-slate-50 py-1.5 pl-9 pr-3 text-[11px] outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-slate-500">Thursday, Oct 24</span>
                  <button className="rounded px-3 py-1.5 text-[10px] font-bold text-white hover:opacity-90" style={{ backgroundColor: ctx.accent }}>Send Money</button>
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-600"><Bell className="h-3 w-3" /></div>
                    <div className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: ctx.accent }}>A</div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Canvas */}
            <div className={`flex-1 overflow-y-auto ${ctx.bgSurface} p-6 flex justify-center`}>
              
              {viewMode === 'mobile' ? (
                /* MOBILE FRAME */
                <div className="relative w-[380px] h-[800px] bg-slate-900 rounded-[50px] p-3 shadow-2xl overflow-hidden border-[8px] border-slate-900 flex flex-col">
                  
                  {/* Notch / Dynamic Island */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl z-50 flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-slate-700" />
                  </div>

                  {/* Screen Content */}
                  <div className={`relative flex-1 rounded-[38px] overflow-y-auto scrollbar-none pb-24 ${ctx.bgSurface}`}>
                    
                    {/* Fake Status Bar */}
                    <div className={`sticky top-0 z-40 flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-bold ${ctx.isDark ? 'text-white bg-slate-950' : 'text-slate-900 bg-[#F8F9FC]'}`}>
                      <span>09:41</span>
                      <div className="flex items-center gap-1">
                        <Signal className="h-3 w-3" />
                        <Wifi className="h-3 w-3" />
                        <Battery className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="px-5 pt-2 pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full text-white text-sm font-bold shadow-sm" style={{ backgroundColor: ctx.accent }}>
                          U
                        </div>
                        <div>
                          <p className={`text-[10px] font-medium ${ctx.textSecondary}`}>Good Evening!</p>
                          <p className={`text-[13px] font-bold ${ctx.textPrimary}`}>User</p>
                        </div>
                      </div>
                      <button className={`grid h-9 w-9 place-items-center rounded-full border shadow-sm ${ctx.bgCard} ${ctx.borderWeight}`}>
                        <Bell className={`h-4 w-4 ${ctx.textSecondary}`} />
                      </button>
                    </div>

                    {/* Mobile Content Flow */}
                    <div className="px-5">
                      {renderHomeContent()}
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className={`absolute bottom-3 left-3 right-3 h-[72px] rounded-[28px] shadow-lg flex items-center justify-around px-2 backdrop-blur-md border ${ctx.isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
                    <button className="flex flex-col items-center gap-1 text-blue-600">
                      <Home className="h-5 w-5" />
                      <span className="text-[9px] font-bold">Home</span>
                    </button>
                    <button className={`flex flex-col items-center gap-1 ${ctx.textSecondary} hover:text-slate-900`}>
                      <CreditCard className="h-5 w-5" />
                      <span className="text-[9px] font-medium">Cards</span>
                    </button>
                    <button className={`flex flex-col items-center gap-1 ${ctx.textSecondary} hover:text-slate-900`}>
                      <PieChart className="h-5 w-5" />
                      <span className="text-[9px] font-medium">Stats</span>
                    </button>
                    <button className={`flex flex-col items-center gap-1 ${ctx.textSecondary} hover:text-slate-900`}>
                      <User className="h-5 w-5" />
                      <span className="text-[9px] font-medium">Profile</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* DESKTOP VIEW */
                <div className="w-full max-w-[1200px]">
                  {renderHomeContent()}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}