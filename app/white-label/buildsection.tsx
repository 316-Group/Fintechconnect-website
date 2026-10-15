'use client';

import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeftRight, 
  Bell, 
  FileText, 
  Sun, 
  Moon, 
  Monitor, 
  Sliders,
  Home,
  PieChart,
  Settings,
  RefreshCw,
  Search,
  PiggyBank,
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
  const [template, setTemplate] = useState<'neobank' | 'corporate' | 'marketplace'>('neobank');
  const [brandName, setBrandName] = useState('Apex Bank');
  const [accentColor, setAccentColor] = useState('#0A63F8');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<'rounded' | 'sharp' | 'pill'>('rounded');
  const [activeModules, setActiveModules] = useState<string[]>(['accounts', 'cards', 'transfers', 'fx', 'vaults', 'analytics', 'security']);
  
  // Desktop App Preview Interactive State
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

  // Dynamic token radius mapper for desktop view elements
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
            Take complete control of your desktop banking experience with a flexible workflow studio built for your brand. Choose from ready-made templates, customize colors and design systems, and preview changes in real time.
          </p>
        </div>

        {/* MAIN SPLIT LAYOUT: CUSTOMIZATION STUDIO (LEFT) & DESKTOP CONSOLE PREVIEW (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CUSTOMIZATION STUDIO PANEL (BRAND & COMPONENTS TABS) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
            
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
                  <span>Toggle modules below to instantly enable or remove features in the desktop application preview.</span>
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

          {/* RIGHT COLUMN: DESKTOP BANKING WEB APP CONSOLE PREVIEW */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                <Monitor className="w-4 h-4 text-blue-600" />
                Desktop Web Console Preview
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Studio
              </div>
            </div>

            {/* DESKTOP APP CONSOLE WINDOW FRAME */}
            <div className="w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col h-[700px] text-slate-900 ring-1 ring-white/10">
              
              {/* Window Title Bar */}
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono font-medium text-slate-400">{brandName} — Web Treasury Console</span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>v2.4.0</span>
                </div>
              </div>

              {/* App Body Container */}
              <div className={`flex-1 flex overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
                
                {/* Sidebar Navigation */}
                <div className={`w-56 border-r flex flex-col justify-between p-4 shrink-0 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80'}`}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 flex items-center justify-center text-white font-black text-xs shadow-md ${currentRadius}`} style={{ backgroundColor: accentColor }}>
                        {brandName ? brandName.charAt(0) : 'A'}
                      </div>
                      <span className="font-extrabold text-xs tracking-tight truncate">{brandName || 'Bank'}</span>
                    </div>

                    <nav className="space-y-1">
                      {[
                        { id: 'home', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
                        { id: 'cards', label: 'Cards & Limits', icon: <CreditCard className="w-4 h-4" /> },
                        { id: 'activity', label: 'Ledger & Audit', icon: <FileText className="w-4 h-4" /> },
                        { id: 'settings', label: 'Security & 2FA', icon: <Settings className="w-4 h-4" /> },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id as any)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${currentRadius} ${
                            activeTab === item.id 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className={`p-3 border ${currentRadius} ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-[10px] font-bold text-slate-400">Workspace Status</div>
                    <div className="text-xs font-bold flex items-center gap-1.5 mt-0.5 text-emerald-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Production
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Top Header */}
                  <div className={`px-6 py-3.5 border-b flex items-center justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        <Search className="w-3.5 h-3.5" />
                        <span>Search accounts, txns, beneficiaries...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {activeModules.includes('notifications') && (
                        <div className={`w-8 h-8 flex items-center justify-center text-xs shadow-xs cursor-pointer ${currentRadius} ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                      <div className={`px-3 py-1 bg-blue-600 text-white text-xs font-bold ${currentRadius}`}>
                        Admin Workspace
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Dashboard Workspace */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
                    
                    {activeTab === 'home' && (
                      <div className="space-y-6">
                        
                        {/* Top Stats / Accounts Row */}
                        <div className="grid grid-cols-3 gap-4">
                          {activeModules.includes('accounts') ? (
                            <div className={`p-5 text-white shadow-lg bg-gradient-to-br ${getGradientStyle()} relative overflow-hidden ${currentRadius} col-span-2`}>
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block mb-1">
                                {template === 'corporate' ? 'Corporate Treasury Master' : 'Primary Checking Account'}
                              </span>
                              <div className="text-3xl font-black tracking-tight mb-4">$24,650.00</div>
                              <div className="flex justify-between items-center text-xs opacity-90 border-t border-white/20 pt-3">
                                <span>Available vs Reserved ($4,850.00)</span>
                                <span className={`bg-white/20 px-2.5 py-1 font-medium ${currentRadius}`}>USD / SWIFT</span>
                              </div>
                            </div>
                          ) : null}

                          {activeModules.includes('vaults') && (
                            <div className={`p-5 border flex flex-col justify-between ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                                  <span>Tax Reserve Vault</span>
                                  <span className="text-purple-600 font-extrabold">${vaultBalance.toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mb-3">Automated 15% inbound withholding</p>
                                <div className={`w-full bg-slate-100 h-2 overflow-hidden mb-3 ${currentRadius}`}>
                                  <div className={`bg-purple-600 h-full w-[65%] ${currentRadius}`} />
                                </div>
                              </div>
                              <button onClick={() => setVaultBalance(v => v + 250)} className={`w-full py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-xs transition-colors cursor-pointer ${currentRadius}`}>
                                + Allocate $250
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quick Actions & FX Ticker Row */}
                        <div className="grid grid-cols-2 gap-4">
                          {activeModules.includes('transfers') && (
                            <div className={`p-5 border space-y-3 ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider">Quick Actions Matrix</h4>
                                <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setActiveTab('send')} className={`p-3 border text-center font-bold text-xs flex flex-col items-center gap-1 hover:border-blue-600 transition-all cursor-pointer ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                  <ArrowUpRight className="w-4 h-4 text-blue-600" /> Send Wire
                                </button>
                                <button onClick={() => setActiveTab('fx')} className={`p-3 border text-center font-bold text-xs flex flex-col items-center gap-1 hover:border-blue-600 transition-all cursor-pointer ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                  <RefreshCw className="w-4 h-4 text-blue-600" /> FX Swap
                                </button>
                                <button onClick={() => setActiveTab('cards')} className={`p-3 border text-center font-bold text-xs flex flex-col items-center gap-1 hover:border-blue-600 transition-all cursor-pointer ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                  <CreditCard className="w-4 h-4 text-blue-600" /> Cards
                                </button>
                              </div>
                            </div>
                          )}

                          {activeModules.includes('fx') && (
                            <div className={`p-5 border space-y-3 ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider">Live FX Spread Ticker</h4>
                                <span className="text-[10px] text-emerald-500 font-bold">● Connected</span>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className={`flex justify-between items-center p-2.5 border ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                  <span className="font-bold">USD / EUR</span>
                                  <span className="font-mono font-bold text-emerald-600">0.9245 (+0.14%)</span>
                                </div>
                                <div className={`flex justify-between items-center p-2.5 border ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                  <span className="font-bold">USD / GBP</span>
                                  <span className="font-mono font-bold text-emerald-600">0.7890 (+0.08%)</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Recent Ledger Table */}
                        <div className={`p-5 border space-y-4 ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider">Recent Enterprise Ledger Activity</h4>
                            <button onClick={() => setActiveTab('activity')} className="text-xs font-bold text-blue-600 hover:underline">View All &rarr;</button>
                          </div>
                          <div className="space-y-2 text-xs">
                            {[
                              { title: 'Stripe Global Payout', type: 'Credit', amount: '+$4,200.00', date: 'Today, 08:30 AM' },
                              { title: 'AWS Cloud Infrastructure', type: 'Debit', amount: '-$240.50', date: 'Yesterday, 04:15 PM' },
                              { title: 'Client Enterprise Wire', type: 'Credit', amount: '+$14,500.00', date: 'Oct 12, 2026' }
                            ].map((row, i) => (
                              <div key={i} className={`flex justify-between items-center p-3 border ${currentRadius} ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs ${currentRadius} ${row.type === 'Credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {row.type === 'Credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <h5 className="font-bold">{row.title}</h5>
                                    <p className="text-[10px] text-slate-400">{row.date}</p>
                                  </div>
                                </div>
                                <span className={`font-mono font-bold ${row.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>{row.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* SEND WIRE SUB-PAGE VIEW */}
                    {activeTab === 'send' && (
                      <div className={`p-6 border space-y-4 max-w-lg mx-auto ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'}`}>
                        <div className="flex justify-between items-center">
                          <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider">Outbound Wire Transfer</h4>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Beneficiary Institution &amp; IBAN</label>
                            <input type="text" readOnly value="US89 APX 0000 9182 7364 — JP Morgan Chase" className={`w-full p-3 border border-slate-200 bg-slate-50 font-mono text-slate-800 ${currentRadius}`} />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Transfer Amount (USD)</label>
                            <input type="text" value={sendAmount} onChange={e => setSendAmount(e.target.value)} className={`w-full p-3 border border-slate-200 bg-slate-50 font-bold text-slate-900 ${currentRadius}`} />
                          </div>
                          <button onClick={() => alert('Enterprise wire successfully transmitted!')} className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer ${currentRadius}`}>
                            Authorize &amp; Dispatch Wire
                          </button>
                        </div>
                      </div>
                    )}

                    {/* FX SPOT SWAP SUB-PAGE VIEW */}
                    {activeTab === 'fx' && (
                      <div className={`p-6 border space-y-4 max-w-lg mx-auto ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'}`}>
                        <div className="flex justify-between items-center">
                          <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider">FX Spot Exchange</h4>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className={`p-3 border bg-slate-50 flex justify-between items-center ${currentRadius}`}>
                            <div>
                              <span className="text-[10px] text-slate-400 font-semibold block">Convert From</span>
                              <span className="font-bold">10,000.00 USD</span>
                            </div>
                            <span className="bg-blue-600 text-white px-2.5 py-1 font-bold text-[10px] rounded">USD</span>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100`}>
                              <RefreshCw className="w-4 h-4" />
                            </div>
                          </div>
                          <div className={`p-3 border bg-slate-50 flex justify-between items-center ${currentRadius}`}>
                            <div>
                              <span className="text-[10px] text-slate-400 font-semibold block">Convert To (EUR)</span>
                              <span className="font-bold">{fxOutputAmount} EUR</span>
                            </div>
                            <span className="bg-purple-600 text-white px-2.5 py-1 font-bold text-[10px] rounded">EUR</span>
                          </div>
                          <button onClick={() => alert('FX Spot Swap executed successfully!')} className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer ${currentRadius}`}>
                            Execute Instant Spot Swap
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'cards' && (
                      <div className="space-y-4 max-w-lg mx-auto">
                        <div className="flex justify-between items-center">
                          <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider">Virtual Metallic Cards</h4>
                        </div>
                        <div className={`p-6 text-white shadow-xl bg-gradient-to-tr ${isCardFrozen ? 'from-slate-600 to-slate-700 grayscale' : getGradientStyle()} ${currentRadius}`}>
                          <div className="flex justify-between items-start mb-6">
                            <span className="font-extrabold text-sm tracking-wider">{brandName ? brandName.toUpperCase() : 'APEX BANK'}</span>
                            <CreditCard className="w-6 h-6 opacity-80" />
                          </div>
                          <div className="font-mono text-base tracking-widest mb-6">4892 •••• •••• 7104</div>
                          <div className="flex justify-between items-end text-xs opacity-90">
                            <span>CARDHOLDER: TREASURY ADMIN</span>
                            <span>09/28</span>
                          </div>
                        </div>
                        <div className={`p-4 border flex items-center justify-between ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div>
                            <h5 className="text-xs font-bold">Freeze Virtual Card</h5>
                            <p className="text-[10px] text-slate-400">Instantly block merchant authorizations</p>
                          </div>
                          <button onClick={() => setIsCardFrozen(!isCardFrozen)} className={`w-11 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${isCardFrozen ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isCardFrozen ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'activity' && (
                      <div className={`p-6 border space-y-4 ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                        <div className="flex justify-between items-center">
                          <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider">Full Enterprise Ledger Audit Log</h4>
                        </div>
                        <div className="space-y-2 text-xs">
                          {['Stripe Global Payout (+$4,200.00)', 'AWS Cloud Infrastructure (-$240.50)', 'Client Enterprise Wire (+$14,500.00)', 'SaaS Subscriptions (-$1,200.00)', 'Legal Retainer (-$5,000.00)'].map((t, idx) => (
                            <div key={idx} className={`p-3 border font-semibold ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'settings' && (
                      <div className={`p-6 border space-y-4 max-w-lg mx-auto ${currentRadius} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                        <div className="flex justify-between items-center">
                          <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider">Security &amp; 2FA Policies</h4>
                        </div>
                        <div className={`p-4 border space-y-2 text-xs ${currentRadius} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <span className="font-bold block">Biometric Hardware Security Key</span>
                          <p className="text-[10px] text-slate-400">Enforced for all outbound wires exceeding $10,000.</p>
                        </div>
                      </div>
                    )}

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