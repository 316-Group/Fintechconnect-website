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
  ArrowDownLeft
} from 'lucide-react';

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const availableModules: ModuleItem[] = [
  { id: 'accounts', title: 'Accounts & Multi-Currency', subtitle: 'Balances, IBANs & live streams', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
  { id: 'transfers', title: 'Global Wire Transfers', subtitle: 'SWIFT, SEPA & instant P2P', icon: <ArrowLeftRight className="w-4 h-4 text-blue-600" /> },
  { id: 'cards', title: 'Virtual Card Manager', subtitle: 'PIN reset, limits & freeze', icon: <Sliders className="w-4 h-4 text-blue-600" /> },
  { id: 'fx', title: 'FX Spot Exchange', subtitle: 'Interbank currency conversion', icon: <RefreshCw className="w-4 h-4 text-blue-600" /> },
  { id: 'vaults', title: 'Automated Vaults & Goals', subtitle: 'High-yield savings pockets', icon: <PiggyBank className="w-4 h-4 text-blue-600" /> },
  { id: 'analytics', title: 'Spending Intelligence', subtitle: 'Merchant categorization & budgets', icon: <PieChart className="w-4 h-4 text-blue-600" /> },
  { id: 'security', title: 'Biometric Shield & 2FA', subtitle: 'FaceID, session tokens & audit', icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> },
  { id: 'notifications', title: 'Real-Time Webhooks', subtitle: 'Push alerts & instant triggers', icon: <Bell className="w-4 h-4 text-blue-600" /> },
];

export default function BuildSection() {
  // Builder Interactive State
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [template, setTemplate] = useState<'neobank' | 'corporate' | 'marketplace'>('neobank');
  const [brandName, setBrandName] = useState('Apex Bank');
  const [accentColor, setAccentColor] = useState('#0A63F8');
  const [interfaceMode, setInterfaceMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [buttonRadius, setButtonRadius] = useState<'rounded' | 'sharp' | 'pill'>('rounded');
  const [activeModules, setActiveModules] = useState<string[]>(['accounts', 'transfers', 'cards', 'fx', 'vaults', 'analytics', 'security']);
  
  // App Preview Interactive State
  const [activeTab, setActiveTab] = useState<'home' | 'cards' | 'activity' | 'settings'>('home');
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [fxFromAmount, setFxFromAmount] = useState('1000');
  const [vaultBalance, setVaultBalance] = useState(4850);

  const toggleModule = (id: string) => {
    setActiveModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const getRadiusClass = () => {
    if (buttonRadius === 'sharp') return 'rounded-sm';
    if (buttonRadius === 'pill') return 'rounded-full';
    return 'rounded-xl';
  };

  const isDark = interfaceMode === 'dark';

  // Dynamic gradient map based on user's accent color picker
  const getGradientStyle = () => {
    if (accentColor === '#0A63F8') return 'from-blue-600 via-indigo-600 to-blue-700';
    if (accentColor === '#6366F1') return 'from-indigo-600 via-purple-600 to-indigo-800';
    if (accentColor === '#EC4899') return 'from-pink-600 via-rose-600 to-pink-700';
    if (accentColor === '#10B981') return 'from-emerald-600 via-teal-600 to-emerald-800';
    return 'from-slate-800 via-slate-900 to-black';
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
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
          
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
            Live Neobank Interactive Studio
          </div>

          {/* FULL SIZE MOBILE SCREEN PREVIEW WITH REALISTIC HARDWARE CHASSIS */}
          <div className="w-full max-w-[390px] bg-slate-950 rounded-[52px] p-4 shadow-2xl border-4 border-slate-800 relative ring-1 ring-white/10">
            
            {/* Phone Speaker & Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-center shadow-inner">
              <div className="w-12 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Screen Inner Container */}
            <div className={`w-full rounded-[38px] overflow-hidden flex flex-col h-[700px] pt-12 pb-4 px-5 transition-colors duration-300 relative ${
              isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'
            }`}>
              
              {/* App Status Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md" style={{ backgroundColor: accentColor }}>
                    {brandName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs tracking-tight block leading-tight">{brandName}</span>
                    <span className="text-[9px] text-emerald-500 font-semibold flex items-center gap-1">● Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeModules.includes('notifications') && (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-xs ${isDark ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${isDark ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' : 'bg-gradient-to-tr from-slate-800 to-slate-900 text-white'}`}>
                    US
                  </div>
                </div>
              </div>

              {/* MAIN SCROLLABLE APP BODY ACCORDING TO TABS */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 pb-20 scrollbar-none">
                
                {activeTab === 'home' && (
                  <>
                    {/* Rich Gradient Dynamic Balance Card */}
                    {activeModules.includes('accounts') ? (
                      <div className={`p-5 rounded-2xl text-white shadow-xl bg-gradient-to-br ${getGradientStyle()} relative overflow-hidden transition-all`}>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                            {template === 'corporate' ? 'Corporate Treasury' : template === 'marketplace' ? 'Escrow & Settlements' : 'Primary Checking Account'}
                          </span>
                          <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-semibold">USD / IBAN</span>
                        </div>
                        <div className="text-3xl font-black tracking-tight mb-4">$24,650.00</div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15 text-[11px]">
                          <div>
                            <span className="block opacity-70 text-[9px]">MONTHLY INFLOW</span>
                            <span className="font-bold text-emerald-300">+$14,200.00</span>
                          </div>
                          <div>
                            <span className="block opacity-70 text-[9px]">YIELD APY</span>
                            <span className="font-bold text-blue-200">4.85% APY</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-2xl border text-center text-xs ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                        Accounts module is currently disabled.
                      </div>
                    )}

                    {/* Quick Action Grid */}
                    <div className="grid grid-cols-4 gap-2.5">
                      {activeModules.includes('transfers') && (
                        <div className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all hover:scale-105 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-lg' : 'bg-white border-slate-100/80 shadow-md text-slate-800'}`}>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                            <ArrowLeftRight className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold">Transfer</span>
                        </div>
                      )}
                      {activeModules.includes('cards') && (
                        <div onClick={() => setActiveTab('cards')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-lg' : 'bg-white border-slate-100/80 shadow-md text-slate-800'}`}>
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold">Cards</span>
                        </div>
                      )}
                      {activeModules.includes('fx') && (
                        <div className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all hover:scale-105 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-lg' : 'bg-white border-slate-100/80 shadow-md text-slate-800'}`}>
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold">Swap FX</span>
                        </div>
                      )}
                      {activeModules.includes('vaults') && (
                        <div className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all hover:scale-105 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-lg' : 'bg-white border-slate-100/80 shadow-md text-slate-800'}`}>
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                            <PiggyBank className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold">Vaults</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Vaults Widget */}
                    {activeModules.includes('vaults') && (
                      <div className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${isDark ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                              <PiggyBank className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-extrabold">Tax Reserve Vault</span>
                          </div>
                          <span className="text-xs font-black text-purple-600">${vaultBalance.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                          <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: '65%' }} />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>Target: $7,500</span>
                          <button onClick={() => setVaultBalance(prev => prev + 250)} className="text-purple-600 font-bold hover:underline">
                            + Deposit $250
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Spending Analytics Widget Preview */}
                    {activeModules.includes('analytics') && (
                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold">Monthly Spend Budget</span>
                          <span className="text-[10px] font-semibold text-emerald-600">72% Left</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                          <div className="bg-blue-600 h-full rounded-full w-[28%]" />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Spent: $3,420</span>
                          <span>Limit: $12,000</span>
                        </div>
                      </div>
                    )}

                    {/* Recent Activity List */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
                        <span>Recent Ledger Activity</span>
                        <button onClick={() => setActiveTab('activity')} className="text-blue-600 hover:underline">View all</button>
                      </div>
                      <div className={`p-3 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100/80 shadow-xs'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <ArrowDownLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Stripe Payout</h4>
                            <p className="text-[10px] text-slate-400">Today, 08:30 • Wire Transfer</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600">+$4,200.00</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'cards' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Virtual &amp; Physical Cards</h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2 Active</span>
                    </div>

                    {/* Interactive 3D Neobank Card Artwork */}
                    <div className={`p-5 rounded-2xl text-white shadow-2xl relative overflow-hidden transition-all duration-300 bg-gradient-to-tr ${isCardFrozen ? 'from-slate-600 to-slate-700 opacity-80 grayscale' : getGradientStyle()}`}>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex justify-between items-start mb-6">
                        <span className="font-extrabold tracking-widest text-sm">{brandName.toUpperCase()}</span>
                        <CreditCard className="w-6 h-6 opacity-90" />
                      </div>
                      <div className="font-mono text-base tracking-widest mb-4 font-bold">4892 •••• •••• 7104</div>
                      <div className="flex justify-between items-end text-[10px] opacity-90">
                        <div>
                          <span className="block opacity-60 text-[8px]">CARDHOLDER</span>
                          <span className="font-semibold tracking-wide">LEXI STERLING</span>
                        </div>
                        <div>
                          <span className="block opacity-60 text-[8px]">EXPIRES</span>
                          <span className="font-semibold">09/28</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Controls Panel */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold">Freeze Card Instantly</h4>
                          <p className="text-[10px] text-slate-400">Block online &amp; POS payments immediately</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCardFrozen(!isCardFrozen)}
                          className={`w-10 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${isCardFrozen ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${isCardFrozen ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Complete Ledger</h3>
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>

                    {[
                      { title: 'Stripe Payout', date: 'Oct 12, 14:22', amount: '+$1,850.00', type: 'in' },
                      { title: 'AWS Cloud Hosting', date: 'Oct 11, 09:00', amount: '-$240.50', type: 'out' },
                      { title: 'Client Retainer Wire', date: 'Oct 10, 16:45', amount: '+$5,400.00', type: 'in' },
                      { title: 'GitHub Enterprise', date: 'Oct 08, 11:15', amount: '-$48.00', type: 'out' },
                    ].map((tx, idx) => (
                      <div key={idx} className={`p-3.5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-slate-100/80 shadow-xs'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx.title}</h4>
                            <p className="text-[10px] text-slate-400">{tx.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-extrabold ${tx.type === 'in' ? 'text-emerald-600' : isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Security &amp; Compliance</h3>
                    
                    <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Biometric Authentication</span>
                        <span className="text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">Enforced</span>
                      </div>
                      <p className="text-[10px] text-slate-400">FaceID &amp; TouchID required for transfers over $1,000.</p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>AML Fraud Screening</span>
                        <span className="text-blue-600 text-[10px] bg-blue-50 px-2 py-0.5 rounded-md">Real-Time Active</span>
                      </div>
                      <p className="text-[10px] text-slate-400">In-flight ML scoring checking all outbound payments.</p>
                    </div>
                  </div>
                )}

              </div>

              {/* BOTTOM APP NAVIGATION TAB BAR */}
              <div className={`absolute bottom-0 left-0 right-0 py-3 px-6 border-t flex items-center justify-between z-20 backdrop-blur-xl ${
                isDark ? 'bg-slate-950/90 border-slate-800 text-slate-400' : 'bg-white/90 border-slate-100 text-slate-500'
              }`}>
                <button type="button" onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'hover:text-slate-800'}`}>
                  <Home className="w-4 h-4" />
                  <span className="text-[9px]">Home</span>
                </button>
                <button type="button" onClick={() => setActiveTab('cards')} className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeTab === 'cards' ? 'text-blue-600 font-bold' : 'hover:text-slate-800'}`}>
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[9px]">Cards</span>
                </button>
                <button type="button" onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeTab === 'activity' ? 'text-blue-600 font-bold' : 'hover:text-slate-800'}`}>
                  <FileText className="w-4 h-4" />
                  <span className="text-[9px]">Activity</span>
                </button>
                <button type="button" onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-blue-600 font-bold' : 'hover:text-slate-800'}`}>
                  <Settings className="w-4 h-4" />
                  <span className="text-[9px]">Settings</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM CONFIGURATION STUDIO PANEL */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-10">
          
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

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                      {brandName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{brandName}_Emblem.svg</h4>
                      <p className="text-[11px] text-slate-400">Vector • 48 × 48 dp • Scalable</p>
                    </div>
                  </div>
                  <button type="button" className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-xs transition-colors cursor-pointer">
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
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
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
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
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
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
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
                        className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
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

                {/* App Interface Mode */}
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

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
                  {/* Typography Pairing */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block">Typography Pairing</label>
                    <div className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between shadow-xs">
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
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          buttonRadius === 'rounded' ? 'border-blue-600 bg-blue-50/40 text-blue-600' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>Rounded (8px)</span>
                        {buttonRadius === 'rounded' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setButtonRadius('sharp')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          buttonRadius === 'sharp' ? 'border-blue-600 bg-blue-50/40 text-blue-600' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>Sharp (2px)</span>
                        {buttonRadius === 'sharp' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setButtonRadius('pill')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
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
                    {activeModules.length} / {availableModules.length} Active
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 font-normal">
                  Toggle modules to instantly add or remove capabilities from your application preview.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableModules.map((mod) => {
                    const isActive = activeModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                          isActive ? 'border-blue-600 bg-blue-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
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