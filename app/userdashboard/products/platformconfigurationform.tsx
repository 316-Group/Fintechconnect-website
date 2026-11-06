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

type RegionId = "us" | "eu" | "uk" | "wa";

export type PlatformCurrency = {
  id: string;
  symbol: string;
  code: string;
  name: string;
  isBase: boolean;
  enabled: boolean;
  rail: string;
};

export type PlatformCapability = {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  selected: boolean;
};

export type PlatformConfigurationData = {
  selectedRegion: string;
  currencies: PlatformCurrency[];
  selectedChannel: string;
  capabilities: PlatformCapability[];
};

export type PersistedPlatformConfigurationData = Omit<PlatformConfigurationData, "capabilities"> & {
  capabilities: Array<Omit<PlatformCapability, "icon">>;
};

const DEFAULT_CURRENCIES: PlatformCurrency[] = [
  { id: "usd", symbol: "$", code: "USD", name: "US Dollar", isBase: true, enabled: true, rail: "Core Clearing / ACH" },
  { id: "eur", symbol: "€", code: "EUR", name: "Euro", isBase: false, enabled: true, rail: "SEPA / TARGET2 Ready" },
  { id: "gbp", symbol: "£", code: "GBP", name: "British Pound", isBase: false, enabled: true, rail: "CHAPS & FPS Ready" },
  { id: "ngn", symbol: "₦", code: "NGN", name: "Nigerian Naira", isBase: false, enabled: true, rail: "Direct FX Corridor" },
];

const DEFAULT_CAPABILITIES: PlatformCapability[] = [
  { id: "accounts", title: "Account management", desc: "Multi-currency balances, virtual ledger accounts", icon: Wallet, selected: true },
  { id: "payments", title: "Payments and transfers", desc: "ACH, FedNow, SEPA and wire routing engines", icon: ArrowRight, selected: true },
  { id: "cards", title: "Card issuing", desc: "Physical or virtual Apple Pay / IP processing", icon: CreditCard, selected: true },
  { id: "lending", title: "Lending & credit", desc: "Automated underwriting, loan amortization schedules", icon: Percent, selected: true },
  { id: "identity", title: "Identity verification", desc: "KYC, KYB, OFAC, ID document verification & biometrics", icon: Fingerprint, selected: true },
  { id: "wallets", title: "Digital wallets", desc: "Stored value balances, sub-wallets, peer transfers", icon: LayoutGrid, selected: true },
  { id: "compliance", title: "Compliance", desc: "Automated sanctions screening, PEP check, SAR filing triggers", icon: ShieldCheck, selected: true },
  { id: "monitoring", title: "Transaction monitoring", desc: "Real-time AML rule engine & fraud heuristics", icon: Users, selected: true },
  { id: "treasury", title: "Treasury management", desc: "Yield routing and automated sweep parameters", icon: Building2, selected: false },
];

export function restorePlatformConfigurationData(
  data: PersistedPlatformConfigurationData,
): PlatformConfigurationData {
  return {
    ...data,
    capabilities: data.capabilities.map((capability) => {
      const defaultCapability = DEFAULT_CAPABILITIES.find(
        (item) => item.id === capability.id,
      );
      if (!defaultCapability) {
        throw new Error(`Unknown saved platform capability: ${capability.id}`);
      }
      return { ...capability, icon: defaultCapability.icon };
    }),
  };
}

function starPoints(cx: number, cy: number, outerRadius: number, innerRadius: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const angle = (index * Math.PI) / 5 - Math.PI / 2;
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(" ");
}

function RegionFlag({ region }: { region: RegionId }) {
  if (region === "us") {
    const starRows = [6, 5, 6, 5, 6, 5, 6, 5, 6];
    let starIndex = 0;

    return (
      <svg viewBox="0 0 100 60" aria-hidden="true" className="h-7 w-10 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
        <rect width="100" height="60" fill="white" />
        {Array.from({ length: 7 }, (_, index) => (
          <rect key={index} y={index * (60 / 13) * 2} width="100" height={60 / 13} fill="#B22234" />
        ))}
        <rect width="40" height={(60 / 13) * 7} fill="#3C3B6E" />
        {starRows.map((count, row) =>
          Array.from({ length: count }, (_, column) => {
            const index = starIndex++;
            const x = count === 6 ? 3.3 + column * 6.6 : 6.6 + column * 6.6;
            const y = 1.8 + row * 3.4;
            return <polygon key={index} points={starPoints(x, y, 1.05, 0.45)} fill="white" />;
          }),
        )}
      </svg>
    );
  }

  if (region === "eu") {
    return (
      <svg viewBox="0 0 100 60" aria-hidden="true" className="h-7 w-10 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
        <rect width="100" height="60" fill="#003399" />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index * 2 * Math.PI) / 12 - Math.PI / 2;
          return (
            <polygon
              key={index}
              points={starPoints(50 + Math.cos(angle) * 14, 30 + Math.sin(angle) * 14, 3.2, 1.35)}
              fill="#FFCC00"
            />
          );
        })}
      </svg>
    );
  }

  if (region === "uk") {
    return (
      <svg viewBox="0 0 100 60" aria-hidden="true" className="h-7 w-10 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
        <rect width="100" height="60" fill="#012169" />
        <path d="M0 0 100 60M100 0 0 60" stroke="white" strokeWidth="12" />
        <path d="M0 0 100 60M100 0 0 60" stroke="#C8102E" strokeWidth="5" />
        <path d="M50 0v60M0 30h100" stroke="white" strokeWidth="20" />
        <path d="M50 0v60M0 30h100" stroke="#C8102E" strokeWidth="10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 60" aria-hidden="true" className="h-7 w-10 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
      <rect width="100" height="60" fill="white" />
      <rect width="33.33" height="60" fill="#008751" />
      <rect x="66.67" width="33.33" height="60" fill="#008751" />
    </svg>
  );
}

export default function PlatformConfigurationForm({
  onBack,
  onComplete,
  initialValues,
  isEditing = false,
}: {
  onBack: () => void;
  onComplete: (data: PlatformConfigurationData) => void;
  initialValues?: Partial<PlatformConfigurationData>;
  isEditing?: boolean;
}) {
  // --- State Management ---
  const [selectedRegion, setSelectedRegion] = useState(
    initialValues?.selectedRegion ?? "us",
  );

  const [currencies, setCurrencies] = useState<PlatformCurrency[]>(
    initialValues?.currencies ?? DEFAULT_CURRENCIES,
  );

  const [selectedChannel, setSelectedChannel] = useState(
    initialValues?.selectedChannel ?? "both",
  );

  const [capabilities, setCapabilities] = useState<PlatformCapability[]>(
    initialValues?.capabilities ?? DEFAULT_CAPABILITIES,
  );

  // --- Handlers ---
  const toggleCurrency = (id: string) => {
    setCurrencies((currentCurrencies) =>
      currentCurrencies.map((currency) =>
        currency.id === id ? { ...currency, enabled: !currency.enabled } : currency,
      ),
    );
  };

  const toggleCapability = (id: string) => {
    setCapabilities(
      capabilities.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  };

  const handleComplete = () => {
    onComplete({ selectedRegion, currencies, selectedChannel, capabilities });
  };

  const selectedCapCount = capabilities.filter((c) => c.selected).length;

  const regions = [
    { id: "us" as const, title: "United States", badge: "FINCEN / OCC / FedNow Ready", desc: "Includes automated routing for NACHA, RTP direct routing, and federal CFTI reporting hooks." },
    { id: "eu" as const, title: "European Union", badge: "SEPA / EBA / PSD2 Compliant", desc: "Instant Euro transfers via TIPS, Open Banking SCA authentication, and GDPR data residency." },
    { id: "uk" as const, title: "United Kingdom", badge: "FCA / PRA / FPS Ready", desc: "FPS sub-second settlement, BACS direct debiting facilities, and UK Open Banking routes." },
    { id: "wa" as const, title: "West Africa", badge: "CBN / NIBSS / NIP Clearing", desc: "NIP instant clearing, Bank Verification Number (BVN) integrations, and eNaira rails." },
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
                  <RegionFlag region={region.id} />
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
                      type="button"
                      role="switch"
                      aria-checked={curr.enabled}
                      aria-label={`${curr.enabled ? "Disable" : "Enable"} ${curr.code} settlement`}
                      title={`${curr.enabled ? "Disable" : "Enable"} ${curr.code} settlement`}
                      onClick={() => toggleCurrency(curr.id)}
                      className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        curr.enabled ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                          curr.enabled ? "translate-x-5" : "translate-x-0"
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
                    cap.selected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-900"
                  }`}>
                    {cap.selected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold mb-0.5 ${cap.selected ? 'text-slate-900' : 'text-slate-900'}`}>{cap.title}</h4>
                    <p className="text-[11px] text-slate-900 leading-snug">{cap.desc}</p>
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
          onClick={handleComplete}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {isEditing ? "Save Changes" : "Create Project"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}