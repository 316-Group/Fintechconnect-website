"use client";

import React, { useState } from "react";
import {
  Info,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  CreditCard,
  Wallet,
  Building2,
  Users,
  Monitor,
  Smartphone,
  LayoutGrid,
  Percent,
  Fingerprint,
} from "lucide-react";

export default function PlatformConfigurationForm({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  // --- State Management ---
  const [selectedRegion, setSelectedRegion] = useState("us");

  const [currencies, setCurrencies] = useState([
    { id: "usd", symbol: "$", code: "USD", name: "US Dollar", isBase: true, enabled: true, rail: "Core Clearing / ACH" },
    { id: "eur", symbol: "€", code: "EUR", name: "Euro", isBase: false, enabled: true, rail: "SEPA / TARGET2 Ready" },
    { id: "gbp", symbol: "£", code: "GBP", name: "British Pound", isBase: false, enabled: true, rail: "CHAPS & FPS Ready" },
    { id: "ngn", symbol: "₦", code: "NGN", name: "Nigerian Naira", isBase: false, enabled: true, rail: "Direct FX Corridor" },
  ]);

  const [selectedChannel, setSelectedChannel] = useState("both");

  const [capabilities, setCapabilities] = useState([
    { id: "accounts", title: "Account management", desc: "Multi-currency balances, virtual ledger accounts", icon: Wallet, selected: true },
    { id: "payments", title: "Payments and transfers", desc: "ACH, FedNow, SEPA and wire routing engines", icon: ArrowRight, selected: true },
    { id: "cards", title: "Card issuing", desc: "Physical or virtual Apple Pay / IP processing", icon: CreditCard, selected: true },
    { id: "lending", title: "Lending & credit", desc: "Automated underwriting, loan amortization schedules", icon: Percent, selected: true },
    { id: "identity", title: "Identity verification", desc: "KYC, KYB, OFAC, ID document verification & biometrics", icon: Fingerprint, selected: true },
    { id: "wallets", title: "Digital wallets", desc: "Stored value balances, sub-wallets, peer transfers", icon: LayoutGrid, selected: true },
    { id: "compliance", title: "Compliance", desc: "Automated sanctions screening, PEP check, SAR filing triggers", icon: ShieldCheck, selected: true },
    { id: "monitoring", title: "Transaction monitoring", desc: "Real-time AML rule engine & fraud heuristics", icon: Users, selected: true },
    { id: "treasury", title: "Treasury management", desc: "Yield routing and automated sweep parameters", icon: Building2, selected: false },
  ]);

  // --- Handlers ---
  const toggleCurrency = (id: string) => {
    setCurrencies(currencies.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  };

  const toggleCapability = (id: string) => {
    setCapabilities(capabilities.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const selectedCapCount = capabilities.filter((c) => c.selected).length;

  const regions = [
    { id: "us", flag: "🇺🇸", title: "United States", badge: "FINCEN / OCC / FedNow Ready", desc: "Includes automated routing for NACHA, RTP direct routing, and federal CFTI reporting hooks." },
    { id: "eu", flag: "🇪🇺", title: "European Union", badge: "SEPA / EBA / PSD2 Compliant", desc: "Instant Euro transfers via TIPS, Open Banking SCA authentication, and GDPR data residency." },
    { id: "uk", flag: "🇬🇧", title: "United Kingdom", badge: "FCA / PRA / FPS Ready", desc: "FPS sub-second settlement, BACS direct debiting facilities, and UK Open Banking routes." },
    { id: "wa", flag: "🌍", title: "West Africa", badge: "CBN / NIBSS / NIP Clearing", desc: "NIP instant clearing, Bank Verification Number (BVN) integrations, and eNaira rails." },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col min-h-[calc(100vh-8rem)] pb-12">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
            Overview
          </span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Project Details</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">How would you like your platform configured?</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Set a few preferences before we prepare your financial infrastructure. These establish double-entry routing, compliance checks, and clearing rails.
        </p>
      </div>

      {/* Banner */}
      <div className="mb-8 flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Architectural Pre-Wiring Active</h4>
          <p className="text-xs text-blue-700 mt-1">
            FintechConnect will use these preferences to recommend relevant infrastructure modules and pre-wire ledger schemas. You can customize or expand your selections later in the Architecture Canvas.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* SECTION 1: Region */}
        <section>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Region & Regulatory Jurisdiction</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Field</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Select your primary operational jurisdiction and supervisory regulatory framework.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {regions.map((region) => {
              const isSelected = selectedRegion === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl text-left border transition-all duration-200 ${
                    isSelected ? "bg-slate-50 border-blue-500 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl leading-none shrink-0">{region.flag}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{region.title}</h3>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-blue-600/80 uppercase tracking-wide mb-2">{region.badge}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{region.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: Currency */}
        <section>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Currency Configuration & FX Settlement</h2>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Settlement Currency
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">Activate settlement currencies available in multi-currency pool ledgers.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {currencies.map((curr) => (
              <div
                key={curr.id}
                className={`flex flex-col p-4 rounded-xl border transition-colors ${
                  curr.enabled ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {curr.symbol}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{curr.code}</span>
                  </div>
                  {curr.isBase ? (
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wide">Base</span>
                  ) : (
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${curr.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                      {curr.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4 flex-1">{curr.name}</p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">{curr.rail}</span>
                  {!curr.isBase && (
                    <button
                      onClick={() => toggleCurrency(curr.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                        curr.enabled ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                          curr.enabled ? "translate-x-[18px]" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}
                  {curr.isBase && (
                     <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-600" />
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Cross-currency real-time ledger settlement utilizes mid-market automated routing via ISO 20022 schemas.
            <span className="ml-auto text-blue-600 font-medium cursor-pointer hover:underline">View FX Ledger Engine</span>
          </div>
        </section>

        {/* SECTION 3: Customer Experience */}
        <section>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Customer Experience & Channels</h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">Which customer channels will this product primarily serve?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: "web", title: "Web Customers", desc: "Browser-based banking, treasury command desks, and responsive client portals.", sub: "Client Web SDK", icon: Monitor },
              { id: "mobile", title: "Mobile App Customers", desc: "iOS & Android native SDKs, biometric authentication, and Apple/Google Wallet cards.", sub: "iOS / Android Native", icon: Smartphone },
              { id: "both", title: "Both Web & Mobile Customers", desc: "Full omnichannel deployment with unified ledger state across web console and mobile SDKs.", sub: "Universal Synchronized Core", icon: LayoutGrid, recommended: true }
            ].map((channel) => {
              const isSelected = selectedChannel === channel.id;
              const Icon = channel.icon;
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`relative flex flex-col p-4 rounded-xl text-left border transition-all duration-200 ${
                    isSelected ? "bg-blue-50/50 border-blue-500 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {channel.recommended && (
                    <span className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Recommended
                    </span>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                     </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{channel.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">{channel.desc}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-200/60 w-full">
                    <span className="text-[10px] font-medium text-slate-500">{channel.sub}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: Capabilities */}
        <section>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Platform Capabilities & Module Pre-Wiring</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{selectedCapCount} of {capabilities.length} Selected</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Select the needed capabilities for this deployment. (Initial preferences, not final module selections).</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <button
                  key={cap.id}
                  onClick={() => toggleCapability(cap.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                    cap.selected 
                      ? "bg-slate-50 border-slate-200" 
                      : "bg-white border-transparent hover:bg-slate-50 opacity-70"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                    cap.selected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
                  }`}>
                    {cap.selected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold mb-0.5 ${cap.selected ? 'text-slate-900' : 'text-slate-600'}`}>{cap.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">{cap.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project Identity
        </button>
        
        <button
          onClick={onComplete}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          Create Project <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}