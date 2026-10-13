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
  Sliders
} from 'lucide-react';

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const availableModules: ModuleItem[] = [
  { id: 'accounts', title: 'Accounts (Home)', subtitle: 'Balances, charts & history', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
  { id: 'transfers', title: 'Transfers', subtitle: 'SEPA, ACH & peer-to-peer', icon: <ArrowLeftRight className="w-4 h-4 text-blue-600" /> },
  { id: 'cards', title: 'Card Controls', subtitle: 'PIN reset, spending caps etc.', icon: <Sliders className="w-4 h-4 text-blue-600" /> },
  { id: 'notifications', title: 'Notifications', subtitle: 'Real-time webhooks & pushes', icon: <Bell className="w-4 h-4 text-blue-600" /> },
  { id: 'security', title: 'Security', subtitle: 'Biometrics, 2FA & session keys', icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> },
  { id: 'kyc', title: 'KYC In-App', subtitle: 'Passport scan & liveness check', icon: <FileText className="w-4 h-4 text-blue-600" /> },
];

export default function BuildSection() {
  // Builder Interactive State
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [template, setTemplate] = useState<'neobank' | 'corporate' | 'marketplace'>('neobank');
  const [brandName, setBrandName] = useState('Apex Bank');
  const [accentColor, setAccentColor] = useState('#0A63F8');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<'rounded' | 'sharp' | 'pill'>('rounded');
  const [activeModules, setActiveModules] = useState<string[]>(['accounts', 'transfers', 'cards', 'security']);

  const toggleModule = (id: string) => {
    setActiveModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const getRadiusClass = () => {
    if (buttonRadius === 'sharp') return 'rounded-xs';
    if (buttonRadius === 'pill') return 'rounded-full';
    return 'rounded-xl';
  };

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
            Take complete control of your mobile banking experience with a flexible workflow studio built for your brand. Choose from ready-made templates, customize colors and design systems, enable essential banking features, and preview changes across iOS and Android in real time.
          </p>
        </div>

        {/* TOP PREVIEW CONTAINER */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
          
          {/* PLATFORM SWITCHERS */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl mb-6 z-10">
            <button
              type="button"
              onClick={() => setPlatform('ios')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platform === 'ios' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Apple iOS <span className="text-[10px] font-normal text-slate-400">SWIFTUI</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatform('android')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platform === 'android' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Google Android <span className="text-[10px] font-normal text-slate-400">COMPOSE</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Rendering Hotspot
          </div>

          {/* FULL SIZE MOBILE SCREEN PREVIEW */}
          <div className="w-full max-w-[380px] bg-slate-900 rounded-[48px] p-4 shadow-2xl border-4 border-slate-800 relative">
            {/* Phone Speaker & Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
            </div>

            {/* Screen Inner Container */}
            <div className={`w-full rounded-[36px] overflow-hidden flex flex-col min-h-[640px] pt-10 pb-6 px-5 transition-colors duration-300 ${
              interfaceMode === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
            }`}>
              
              {/* App Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs" style={{ backgroundColor: accentColor }}>
                    {brandName.charAt(0)}
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">{brandName}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-200/50 flex items-center justify-center text-xs font-bold text-slate-600">
                  U
                </div>
              </div>

              {/* Dynamic Balance Card */}
              {activeModules.includes('accounts') && (
                <div className="p-5 rounded-1xl text-white shadow-lg mb-6 transition-all" style={{ backgroundColor: accentColor }}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80 block mb-1">
                    {template === 'corporate' ? 'Corporate Treasury' : template === 'marketplace' ? 'Vendor Balance' : 'Main Checking •••• 0000'}
                  </span>
                  <div className="text-2xl font-black mb-3">$24,650.00</div>
                  <div className="flex items-center justify-between text-[11px] opacity-90 border-t border-white/20 pt-3">
                    <span>Active Profile: Verified</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-md font-medium">Primary</span>
                  </div>
                </div>
              )}

              {/* Quick Actions / Modules Simulated View */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {activeModules.includes('transfers') && (
                  <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-1xl bg-white shadow-xs border border-slate-100 text-slate-800">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold">Send</span>
                  </div>
                )}
                {activeModules.includes('cards') && (
                  <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-1xl bg-white shadow-xs border border-slate-100 text-slate-800">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold">Cards</span>
                  </div>
                )}
                {activeModules.includes('security') && (
                  <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-1xl bg-white shadow-xs border border-slate-100 text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold">Security</span>
                  </div>
                )}
                {activeModules.includes('notifications') && (
                  <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-1xl bg-white shadow-xs border border-slate-100 text-slate-800">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold">Alerts</span>
                  </div>
                )}
              </div>

              {/* Recent Activity Mock */}
              <div className="space-y-3 mt-auto">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
                  <span>Recent Activity</span>
                  <span className="text-blue-600">View all</span>
                </div>
                <div className="bg-white p-3 rounded-1xl border border-slate-100 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Supplier Settlement</h4>
                      <p className="text-[10px] text-slate-400">Today, 08:30 • Wire</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">+$4,200.00</span>
                </div>
              </div>

              {/* Dynamic Action Button based on radius state */}
              <div className="mt-4">
                <button 
                  type="button"
                  className={`w-full py-3 text-white text-xs font-bold shadow-md transition-all ${getRadiusClass()}`}
                  style={{ backgroundColor: accentColor }}
                >
                  Configure Quick Action
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM CONFIGURATION STUDIO PANEL */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE CONTROLS: BRAND & PALETTE */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* BRAND LOGO ASSET */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Brand Logo Asset
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">SVG, PNG (max 2MB)</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-1xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-1xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                      {brandName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{brandName}_Emblem.svg</h4>
                      <p className="text-[11px] text-slate-400">Vector • 48 × 48 dp • Scalable</p>
                    </div>
                  </div>
                  <button type="button" className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-1xl shadow-xs transition-colors cursor-pointer">
                    Change
                  </button>
                </div>
              </div>

              {/* 1. TEMPLATE PRESETS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] flex items-center justify-center border border-blue-100">1</span>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Template Presets</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => { setTemplate('neobank'); setBrandName('Apex Bank'); }}
                    className={`p-3.5 rounded-1xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      template === 'neobank' ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className={`w-4 h-4 ${template === 'neobank' ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900">Neobank</span>
                    </div>
                    {template === 'neobank' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTemplate('corporate'); setBrandName('Vanguard Pay'); }}
                    className={`p-3.5 rounded-1xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      template === 'corporate' ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className={`w-4 h-4 ${template === 'corporate' ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900">Corporate</span>
                    </div>
                    {template === 'corporate' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTemplate('marketplace'); setBrandName('Nova Capital'); }}
                    className={`p-3.5 rounded-1xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      template === 'marketplace' ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className={`w-4 h-4 ${template === 'marketplace' ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900">Marketplace</span>
                    </div>
                    {template === 'marketplace' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>
                </div>
              </div>

              {/* 2. BRAND & PALETTE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] flex items-center justify-center border border-blue-100">2</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Brand &amp; Palette</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Live white-label styles</span>
                </div>

                {/* Synthetic Wordmark Identity */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block">Synthetic Wordmark Identity</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Apex Bank', 'Vanguard Pay', 'Nova Capital'].map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setBrandName(name)}
                        className={`py-2.5 px-3 rounded-1xl border text-xs font-bold transition-all cursor-pointer ${
                          brandName === name ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Brand Accent */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-500">Primary Brand Accent</label>
                    <span className="text-[11px] font-bold text-slate-700">Selected: {accentColor}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-1xl border border-slate-200/80">
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
                    <div className="flex-1 flex items-center justify-between bg-white px-3 py-1.5 rounded-1xl border border-slate-200 text-xs font-mono text-slate-700">
                      <span>{accentColor}</span>
                      <span className="text-[10px] text-slate-400 font-sans">HEX</span>
                    </div>
                  </div>
                </div>

                {/* App Interface Mode */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block">App Interface Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setInterfaceMode('light')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-1xl border text-xs font-bold transition-all cursor-pointer ${
                        interfaceMode === 'light' ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterfaceMode('dark')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-1xl border text-xs font-bold transition-all cursor-pointer ${
                        interfaceMode === 'dark' ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" /> Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterfaceMode('auto')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-1xl border text-xs font-bold transition-all cursor-pointer ${
                        interfaceMode === 'auto' ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" /> OS Auto
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE CONTROLS: VISUAL SYSTEM TOKENS & CORE JOURNEY MODULES */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* 3. VISUAL SYSTEM TOKENS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] flex items-center justify-center border border-blue-100">3</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Visual System Tokens</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Atomic UI primitives</span>
                </div>

                <div className="bg-slate-50 p-5 rounded-1xl border border-slate-200/80 space-y-4">
                  {/* Typography Pairing */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block">Typography Pairing</label>
                    <div className="w-full bg-white px-4 py-2.5 rounded-1xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Aa Inter Institutional (San-serif crisp) — Default</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Button Geometry Radius */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block">Button Geometry Radius</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setButtonRadius('rounded')}
                        className={`py-2 px-3 rounded-1xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          buttonRadius === 'rounded' ? 'border-blue-600 bg-blue-50/40 text-blue-600' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>Rounded (8px)</span>
                        {buttonRadius === 'rounded' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setButtonRadius('sharp')}
                        className={`py-2 px-3 rounded-1xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          buttonRadius === 'sharp' ? 'border-blue-600 bg-blue-50/40 text-blue-600' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>Sharp (2px)</span>
                        {buttonRadius === 'sharp' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setButtonRadius('pill')}
                        className={`py-2 px-3 rounded-1xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          buttonRadius === 'pill' ? 'border-blue-600 bg-blue-50/40 text-blue-600' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>Full Pill</span>
                        {buttonRadius === 'pill' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. CORE JOURNEY MODULES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] flex items-center justify-center border border-blue-100">4</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Core Journey Modules</h3>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {activeModules.length} / 6 Active
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 font-normal">
                  Illustrative modules. Availability is confirmed per programme licensing tier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableModules.map((mod) => {
                    const isActive = activeModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-3.5 rounded-1xl border transition-all cursor-pointer flex items-start justify-between ${
                          isActive ? 'border-blue-600 bg-blue-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-1xl flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {mod.icon}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">{mod.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{mod.subtitle}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border mt-0.5 ${
                          isActive ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isActive && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* CONTINUE CTA BUTTON */}
          <div className="pt-6 border-t border-slate-100 flex justify-center w-full">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-1xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              Continue Building Your App
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

// Simple helper icon for dropdown select state
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}