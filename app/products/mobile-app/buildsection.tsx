'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeftRight, 
  Bell, 
  Lock, 
  FileText, 
  Sparkles, 
  Sun, 
  Moon, 
  Monitor, 
  Upload, 
  CheckCircle2,
  Sliders,
  Home,
  PieChart,
  Settings,
  RefreshCw,
  TrendingUp,
  LockKeyhole,
  ChevronRight,
  Search,
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Palette,
  LayoutGrid,
  GripVertical
} from 'lucide-react';

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'balances' | 'actions' | 'fx' | 'ledger' | 'security';
  icon: React.ReactNode;
}

const availableModules: ModuleItem[] = [
  { id: 'accounts', title: 'Multi-Layer Balance Card', subtitle: 'Available vs Reserved breakdown', category: 'balances', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
  { id: 'cards', title: 'Virtual Metallic Card', subtitle: 'Debit card widget with freeze & chip', category: 'balances', icon: <Sliders className="w-4 h-4 text-blue-600" /> },
  { id: 'transfers', title: 'Quick Actions Matrix', subtitle: 'Send, Request, Pay & QR shortcuts', category: 'actions', icon: <ArrowLeftRight className="w-4 h-4 text-blue-600" /> },
  { id: 'fx', title: 'FX Ticker & Wallets', subtitle: 'Multi-currency wallets with live spread', category: 'fx', icon: <RefreshCw className="w-4 h-4 text-blue-600" /> },
  { id: 'vaults', title: 'Automated Vaults & Goals', subtitle: 'High-yield savings pockets', category: 'balances', icon: <PiggyBank className="w-4 h-4 text-blue-600" /> },
  { id: 'analytics', title: 'Spending Intelligence', subtitle: 'Merchant categorization & budgets', category: 'ledger', icon: <PieChart className="w-4 h-4 text-blue-600" /> },
  { id: 'security', title: 'Biometric Shield & 2FA', subtitle: 'FaceID, session tokens & audit', category: 'security', icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> },
  { id: 'notifications', title: 'Real-Time Webhooks', subtitle: 'Push alerts & instant triggers', category: 'security', icon: <Bell className="w-4 h-4 text-blue-600" /> },
];

export default function BuildSection() {
  // Studio Navigation Tabs
  const [studioTab, setStudioTab] = useState<'brand' | 'components'>('brand');
  const [componentFilter, setComponentFilter] = useState<string>('all');

  // Builder Interactive State
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [template, setTemplate] = useState<'neobank' | 'corporate' | 'marketplace'>('neobank');
  const [brandName, setBrandName] = useState('Apex Bank');
  const [accentColor, setAccentColor] = useState('#0A63F8');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<'rounded' | 'sharp' | 'pill'>('rounded');
  const [activeModules, setActiveModules] = useState<string[]>(['accounts', 'cards', 'transfers', 'fx', 'vaults', 'analytics', 'security']);
  
  // App Preview Interactive State
  const [activeTab, setActiveTab] = useState<'home' | 'cards' | 'activity' | 'settings' | 'send' | 'fx'>('home');
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [vaultBalance, setVaultBalance] = useState(4850);
  const [sendAmount, setSendAmount] = useState('2,500.00');
  const [fxOutputAmount, setFxOutputAmount] = useState('924.50');

  const toggleModule = (id: string) => {
    setActiveModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Dynamic token radius mapper for mobile view elements
  const getRadiusClass = () => {
    if (buttonRadius === 'sharp') return 'rounded-none';
    if (buttonRadius === 'pill') return 'rounded-3xl';
    return 'rounded-xl';
  };

  const currentRadius = getRadiusClass();
  const isDark = interfaceMode === 'dark';

  const getGradientStyle = () => {
    if (accentColor === '#0A63F8') return 'from-blue-600 via-indigo-600 to-blue-700';
    if (accentColor === '#6366F1') return 'from-indigo-600 via-purple-600 to-indigo-800';
    if (accentColor === '#EC4899') return 'from-pink-600 via-rose-600 to-pink-700';
    if (accentColor === '#10B981') return 'from-emerald-600 via-teal-600 to-emerald-800';
    return 'from-slate-800 via-slate-900 to-black';
  };

  const filteredModules = componentFilter === 'all' 
    ? availableModules 
    : availableModules.filter(m => m.category === componentFilter);

  return (
    <section className="w-full bg-[#f4f6fc] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              CORE MODULES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Build and customize every part of your banking app, all in one place.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Take complete control of your mobile banking experience with a flexible workflow studio built for your brand. Choose from ready-made templates, customize colors and design systems, and preview changes in real time.
          </p>
        </div>

        {/* MAIN SPLIT LAYOUT: CUSTOMIZATION STUDIO (LEFT) & MOBILE PREVIEW (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CUSTOMIZATION STUDIO PANEL (BRAND & COMPONENTS TABS) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
            
            {/* TOP STUDIO NAVIGATION TABS */}
            <div className="flex items-center gap-8 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => setStudioTab('brand')}
                className={`flex items-center gap-2.5 text-sm font-bold pb-2 transition-all cursor-pointer relative ${
                  studioTab === 'brand' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Palette className="w-4 h-4" />
                Brand &amp; Identity
                {studioTab === 'brand' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('components')}
                className={`flex items-center gap-2.5 text-sm font-bold pb-2 transition-all cursor-pointer relative ${
                  studioTab === 'components' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Components &amp; Modules
                {studioTab === 'components' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            </div>

            {/* TAB 1: BRAND & IDENTITY SETTINGS */}
            {studioTab === 'brand' && (
              <div className="space-y-8">
                
                {/* BRAND LOGO ASSET */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Brand Logo Asset
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">SVG, PNG (max 2MB)</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                        {brandName ? brandName.charAt(0) : 'A'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{brandName ? brandName.replace(/\s+/g, '_') : 'Custom'}_Emblem.svg</h4>
                        <p className="text-[11px] text-slate-400">Vector • 48 × 48 dp • Scalable</p>
                      </div>
                    </div>
                    <button type="button" className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                      Change
                    </button>
                  </div>
                </div>

                {/* TEMPLATE PRESETS */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Template Presets</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'neobank', label: 'Neobank', name: 'Apex Bank' },
                      { id: 'corporate', label: 'Corporate', name: 'Vanguard Pay' },
                      { id: 'marketplace', label: 'Marketplace', name: 'Nova Capital' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { setTemplate(t.id as any); setBrandName(t.name); }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          template === t.id ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{t.label}</span>
                        {template === t.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BRAND & PALETTE */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Brand &amp; Palette</h3>
                    <span className="text-[11px] text-slate-400 font-medium">Live white-label styles</span>
                  </div>

                  {/* CUSTOM BRAND NAME INPUT FIELD */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 block">Custom Brand Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Enter your brand name..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-500">Primary Brand Accent</label>
                      <span className="text-[11px] font-bold text-slate-700">Selected: {accentColor}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center gap-2">
                        {['#0A63F8', '#6366F1', '#EC4899', '#10B981', '#1E293B'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setAccentColor(color)}
                            className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                              accentColor === color ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex-1 flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
                        <span>{accentColor}</span>
                        <span className="text-[10px] text-slate-400 font-sans">HEX</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 block">App Interface Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setInterfaceMode('light')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          interfaceMode === 'light' ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" /> Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterfaceMode('dark')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          interfaceMode === 'dark' ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" /> Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterfaceMode('auto')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          interfaceMode === 'auto' ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" /> OS Auto
                      </button>
                    </div>
                  </div>

                </div>

                {/* VISUAL SYSTEM TOKENS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Visual System Tokens</h3>
                    <span className="text-[11px] text-slate-400 font-medium">Atomic UI primitives</span>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500 block">Button &amp; Card Geometry Radius</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['rounded', 'sharp', 'pill'] as const).map(rad => (
                          <button
                            key={rad}
                            type="button"
                            onClick={() => setButtonRadius(rad)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer capitalize ${
                              buttonRadius === rad ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span>{rad}</span>
                            {buttonRadius === rad && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REFINED COMPONENTS & MODULES SETTINGS */}
            {studioTab === 'components' && (
              <div className="space-y-6">
                
                {/* FILTER PILLS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    { id: 'all', label: `All Modules (${availableModules.length})` },
                    { id: 'balances', label: 'Balances & Cards' },
                    { id: 'actions', label: 'Actions' },
                    { id: 'fx', label: 'FX & Wallets' },
                    { id: 'ledger', label: 'Ledger & Analytics' },
                    { id: 'security', label: 'Security & Alerts' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setComponentFilter(f.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        componentFilter === f.id ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border border-blue-100 p-3.5 rounded-2xl flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span>Toggle modules below to instantly enable or remove features in the interactive mobile application preview.</span>
                </div>

                {/* REFINED MODULE CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredModules.map((mod) => {
                    const isActive = activeModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-0.5 ${
                          isActive 
                            ? 'border-blue-600 bg-gradient-to-br from-blue-50/50 to-white shadow-sm ring-1 ring-blue-600/20' 
                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {React.cloneElement(mod.icon as React.ReactElement<{ className?: string }>, { className: `w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}` })}
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{mod.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{mod.subtitle}</p>
                            </div>
                          </div>

                          {/* REFINED TOGGLE SWITCH UI */}
                          <div className={`w-10 h-6 rounded-full transition-colors relative p-1 shrink-0 ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* CONTINUE CTA */}
            <div className="pt-6 border-t border-slate-100 flex justify-center w-full">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer w-full sm:w-auto text-center"
              >
                Continue Building Your App
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY MOBILE SCREEN PREVIEW */}
          <div className="lg:col-span-5 flex flex-col items-center sticky top-8">
            
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPlatform('ios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    platform === 'ios' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Apple iOS
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('android')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    platform === 'android' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Android
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview
              </div>
            </div>

            {/* HARDWARE PHONE FRAME */}
            <div className="w-full max-w-[380px] bg-slate-950 rounded-[48px] p-4 shadow-2xl border-4 border-slate-800 relative ring-1 ring-white/10">
              
              {/* Phone Speaker & Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-center shadow-inner">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Screen Inner Container */}
              <div className={`w-full rounded-[36px] overflow-hidden flex flex-col h-[660px] pt-12 pb-4 px-5 transition-colors duration-300 relative ${
                isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'
              }`}>
                
                {/* App Status Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 flex items-center justify-center text-white font-black text-xs shadow-md ${currentRadius}`} style={{ backgroundColor: accentColor }}>
                      {brandName ? brandName.charAt(0) : 'A'}
                    </div>
                    <div>
                      <span className="font-extrabold text-xs tracking-tight block leading-tight">{brandName || 'My Bank'}</span>
                      <span className="text-[9px] text-emerald-500 font-semibold">● Live Studio</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeModules.includes('notifications') && (
                      <div className={`w-7 h-7 flex items-center justify-center text-xs shadow-xs ${currentRadius} ${isDark ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200'}`}>
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`w-7 h-7 bg-slate-800 text-white flex items-center justify-center text-xs font-bold ${currentRadius}`}>
                      US
                    </div>
                  </div>
                </div>

                {/* SCROLLABLE APP BODY (APPLYING dynamic currentRadius to all cards & buttons) */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 pb-16 scrollbar-none">
                  
                  {activeTab === 'home' && (
                    <>
                      {activeModules.includes('accounts') ? (
                        <div className={`p-4 text-white shadow-xl bg-gradient-to-br ${getGradientStyle()} relative overflow-hidden ${currentRadius}`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block mb-1">
                            {template === 'corporate' ? 'Corporate Treasury' : 'Primary Checking Account'}
                          </span>
                          <div className="text-2xl font-black tracking-tight mb-3">$24,650.00</div>
                          <div className={`flex justify-between items-center text-[10px] opacity-90 border-t border-white/20 pt-2.5`}>
                            <span>Available Balance</span>
                            <span className={`bg-white/20 px-2 py-0.5 font-medium ${currentRadius}`}>USD / IBAN</span>
                          </div>
                        </div>
                      ) : null}

                      {/* Quick Actions Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {activeModules.includes('transfers') && (
                          <div 
                            onClick={() => setActiveTab('send')}
                            className={`flex flex-col items-center justify-center gap-1 p-2.5 border cursor-pointer hover:border-blue-600 transition-all ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 shadow-xs text-slate-800'}`}
                          >
                            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-bold">Send</span>
                          </div>
                        )}
                        {activeModules.includes('cards') && (
                          <div onClick={() => setActiveTab('cards')} className={`flex flex-col items-center justify-center gap-1 p-2.5 border cursor-pointer hover:border-blue-600 transition-all ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 shadow-xs text-slate-800'}`}>
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-bold">Cards</span>
                          </div>
                        )}
                        {activeModules.includes('fx') && (
                          <div 
                            onClick={() => setActiveTab('fx')}
                            className={`flex flex-col items-center justify-center gap-1 p-2.5 border cursor-pointer hover:border-blue-600 transition-all ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 shadow-xs text-slate-800'}`}
                          >
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-bold">FX</span>
                          </div>
                        )}
                        {activeModules.includes('vaults') && (
                          <div className={`flex flex-col items-center justify-center gap-1 p-2.5 border ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 shadow-xs text-slate-800'}`}>
                            <PiggyBank className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-bold">Vaults</span>
                          </div>
                        )}
                      </div>

                      {activeModules.includes('vaults') && (
                        <div className={`p-3.5 border ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                          <div className="flex justify-between items-center mb-1 text-xs font-bold">
                            <span>Tax Reserve Vault</span>
                            <span className="text-purple-600">${vaultBalance.toLocaleString()}</span>
                          </div>
                          <div className={`w-full bg-slate-100 h-1.5 overflow-hidden mb-2 ${currentRadius}`}>
                            <div className={`bg-purple-600 h-full w-[65%] ${currentRadius}`} />
                          </div>
                          <button onClick={() => setVaultBalance(v => v + 100)} className="text-[10px] text-purple-600 font-bold hover:underline">
                            + Deposit $100
                          </button>
                        </div>
                      )}

                      {/* Recent Activity */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 px-1">Recent Activity</span>
                        <div className={`p-3 border flex items-center justify-between ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold ${currentRadius}`}>
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold">Stripe Payout</h4>
                              <p className="text-[9px] text-slate-400">Today, 08:30</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-600">+$4,200.00</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SEND WIRE SUB-PAGE VIEW */}
                  {activeTab === 'send' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                          &larr; Back to Home
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wire Transfer</span>
                      </div>
                      <div className={`p-4 border space-y-3 ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Recipient IBAN / Account</label>
                          <input type="text" readOnly value="US89 APX 0000 9182 7364" className={`w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-mono text-slate-700 ${currentRadius}`} />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Transfer Amount (USD)</label>
                          <input 
                            type="text" 
                            value={sendAmount} 
                            onChange={(e) => setSendAmount(e.target.value)}
                            className={`w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-900 ${currentRadius}`} 
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => alert('Wire transfer successfully dispatched!')}
                          className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer ${currentRadius}`}
                        >
                          Confirm &amp; Send Wire
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FX SPOT EXCHANGE SUB-PAGE VIEW */}
                  {activeTab === 'fx' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                          &larr; Back to Home
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FX Spot Swap</span>
                      </div>
                      <div className={`p-4 border space-y-3 ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                        <div className={`flex justify-between items-center bg-slate-50 p-3 border border-slate-200 text-xs ${currentRadius}`}>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold">You Pay</span>
                            <span className="font-bold text-slate-900">1,000.00 USD</span>
                          </div>
                          <span className={`bg-blue-100 text-blue-600 px-2 py-0.5 text-[10px] font-bold ${currentRadius}`}>USD</span>
                        </div>
                        <div className="flex justify-center">
                          <div className={`w-7 h-7 bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs ${currentRadius}`}>
                            <RefreshCw className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className={`flex justify-between items-center bg-slate-50 p-3 border border-slate-200 text-xs ${currentRadius}`}>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold">You Receive (EUR)</span>
                            <span className="font-bold text-slate-900">{fxOutputAmount} EUR</span>
                          </div>
                          <span className={`bg-purple-100 text-purple-600 px-2 py-0.5 text-[10px] font-bold ${currentRadius}`}>EUR</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => alert('FX spot currency exchange executed successfully!')}
                          className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer ${currentRadius}`}
                        >
                          Execute Spot Swap
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'cards' && (
                    <div className="space-y-3">
                      <div className={`p-4 text-white shadow-lg bg-gradient-to-tr ${isCardFrozen ? 'from-slate-600 to-slate-700 grayscale' : getGradientStyle()} ${currentRadius}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-extrabold text-xs tracking-wider">{brandName ? brandName.toUpperCase() : 'MY BANK'}</span>
                          <CreditCard className="w-4 h-4 opacity-80" />
                        </div>
                        <div className="font-mono text-xs tracking-widest mb-3">4892 •••• •••• 7104</div>
                        <div className="flex justify-between items-end text-[9px] opacity-90">
                          <span>LEXI STERLING</span>
                          <span>09/28</span>
                        </div>
                      </div>

                      <div className={`p-3 border flex items-center justify-between ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                        <div>
                          <h4 className="text-xs font-bold">Freeze Card</h4>
                          <p className="text-[9px] text-slate-400">Block instant transactions</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCardFrozen(!isCardFrozen)}
                          className={`w-9 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${isCardFrozen ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isCardFrozen ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 px-1">Ledger History</span>
                      {['Stripe Payout (+$1,850)', 'AWS Hosting (-$240.50)', 'Client Wire (+$5,400)'].map((t, idx) => (
                        <div key={idx} className={`p-2.5 border text-xs font-semibold ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                          {t}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 px-1">Security &amp; Biometrics</span>
                      <div className={`p-3 border text-xs ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                        <span className="font-bold block mb-1">FaceID Authentication</span>
                        <p className="text-[9px] text-slate-400">Enforced for all outbound transfers.</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* BOTTOM APP TAB BAR */}
                <div className={`absolute bottom-0 left-0 right-0 py-2.5 px-6 border-t flex items-center justify-between z-20 backdrop-blur-md ${
                  isDark ? 'bg-slate-950/90 border-slate-800 text-slate-400' : 'bg-white/90 border-slate-100 text-slate-500'
                }`}>
                  <button type="button" onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'home' ? 'text-blue-600 font-bold' : ''}`}>
                    <Home className="w-4 h-4" />
                    <span className="text-[9px]">Home</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('cards')} className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'cards' ? 'text-blue-600 font-bold' : ''}`}>
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[9px]">Cards</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'activity' ? 'text-blue-600 font-bold' : ''}`}>
                    <FileText className="w-4 h-4" />
                    <span className="text-[9px]">Activity</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'settings' ? 'text-blue-600 font-bold' : ''}`}>
                    <Settings className="w-4 h-4" />
                    <span className="text-[9px]">Settings</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}