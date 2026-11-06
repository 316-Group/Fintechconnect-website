"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  ChevronDown,
  Upload,
  Info,
  ArrowRight,
  ArrowLeft,
  Layers,
  Check,
  Plus,
  X,
  CreditCard,
  Wallet,
  Landmark,
  HandCoins,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import { archetypes } from "./archetypeselectionform";

type IconComponent = React.ComponentType<{ className?: string }>;

const jurisdictions = [
  { value: "us", label: "United States (US - OCC / FDIC Sponsor Partner)" },
  { value: "uk", label: "United Kingdom (FCA)" },
  { value: "eu", label: "European Union (EBA)" },
];

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
] as const;

const targetCustomers = [
  { value: "individuals", label: "Individuals", description: "Retail / B2C" },
  { value: "businesses", label: "Businesses", description: "Commercial / B2B" },
  { value: "hybrid", label: "Both (Hybrid)", description: "Omnichannel Program" },
] as const;

type TargetCustomer = (typeof targetCustomers)[number]["value"];

type ProjectDetailsData = {
  projectName: string;
  description: string;
  organization: string;
  archetypeId: string;
  jurisdiction: string;
  supportedCurrencies: string[];
  targetCustomer: TargetCustomer;
  brandMark: File | null;
};

const archetypeIconMap: Record<string, IconComponent> = {
  "card-issuing": CreditCard,
  "digital-wallet": Wallet,
  "deposit-taking": Landmark,
  "lending-credit": HandCoins,
  payments: ArrowLeftRight,
  "wealth-investments": TrendingUp,
};

function getArchetypeIcon(id: string, title: string): IconComponent {
  if (archetypeIconMap[id]) return archetypeIconMap[id];

  const key = `${id} ${title}`.toLowerCase();
  if (key.includes("card")) return CreditCard;
  if (key.includes("wallet")) return Wallet;
  if (key.includes("deposit") || key.includes("bank") || key.includes("savings")) {
    return Landmark;
  }
  if (key.includes("credit") || key.includes("lend") || key.includes("loan")) {
    return HandCoins;
  }
  if (key.includes("payment") || key.includes("transfer") || key.includes("remit")) {
    return ArrowLeftRight;
  }
  if (key.includes("invest") || key.includes("wealth") || key.includes("trading")) {
    return TrendingUp;
  }
  return Layers;
}

/**
 * Inline SVG flags.
 * Emoji flags (🇺🇸 🇪🇺 …) collapse into two letter codes ("US", "EU")
 * on Windows and several Linux setups, so we draw them ourselves.
 */
function FlagArt({ code }: { code: string }) {
  switch (code) {
    case "USD":
      return (
        <>
          <rect width="24" height="24" fill="#FFFFFF" />
          {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
            <rect
              key={stripe}
              y={stripe * (24 / 13)}
              width="24"
              height={24 / 13}
              fill="#B22234"
            />
          ))}
          <rect width="10.6" height={(24 / 13) * 7} fill="#3C3B6E" />
          {Array.from({ length: 12 }).map((_, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            return (
              <circle
                key={index}
                cx={1.7 + col * 2.4}
                cy={1.5 + row * 3}
                r={0.55}
                fill="#FFFFFF"
              />
            );
          })}
        </>
      );

    case "EUR":
      return (
        <>
          <rect width="24" height="24" fill="#003399" />
          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index / 12) * Math.PI * 2;
            return (
              <circle
                key={index}
                cx={12 + Math.sin(angle) * 7}
                cy={12 - Math.cos(angle) * 7}
                r={1.15}
                fill="#FFCC00"
              />
            );
          })}
        </>
      );

    case "GBP":
      return (
        <>
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="4.4" />
          <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="2" />
          <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3.4" />
        </>
      );

    case "NGN":
      return (
        <>
          <rect width="24" height="24" fill="#008751" />
          <rect x="8" width="8" height="24" fill="#FFFFFF" />
        </>
      );

    case "KES":
      return (
        <>
          <rect width="24" height="24" fill="#FFFFFF" />
          <rect width="24" height="7" fill="#000000" />
          <rect y="8.5" width="24" height="7" fill="#BB0000" />
          <rect y="17" width="24" height="7" fill="#006600" />
          <ellipse
            cx="12"
            cy="12"
            rx="3.4"
            ry="4.6"
            fill="#BB0000"
            stroke="#FFFFFF"
            strokeWidth="0.9"
          />
          <ellipse cx="12" cy="12" rx="1.5" ry="2.5" fill="#FFFFFF" />
        </>
      );

    case "JPY":
      return (
        <>
          <rect width="24" height="24" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="7" fill="#BC002D" />
        </>
      );

    case "CAD":
      return (
        <>
          <rect width="24" height="24" fill="#FFFFFF" />
          <rect width="6" height="24" fill="#D80621" />
          <rect x="18" width="6" height="24" fill="#D80621" />
          <path
            d="M12 3.5l1.4 3 2.4-1-.7 2.7 2.8.8-1.8 2 2.1 1.5-2.8.9.3 2.6-2.4-1.1-1.3 3.4-1.3-3.4-2.4 1.1.3-2.6-2.8-.9 2.1-1.5-1.8-2 2.8-.8-.7-2.7 2.4 1z"
            fill="#D80621"
          />
        </>
      );

    default:
      return <rect width="24" height="24" fill="#CBD5E1" />;
  }
}

function CurrencyFlag({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-1 ring-black/10 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <FlagArt code={code} />
      </svg>
    </span>
  );
}

export default function ProjectDetailsForm({
  onBack,
  onContinue,
  initialValues,
  backLabel = "Back to Archetype",
}: {
  onBack: () => void;
  onContinue: (data: ProjectDetailsData) => void;
  initialValues?: Partial<ProjectDetailsData>;
  backLabel?: string;
}) {
  const [projectName, setProjectName] = useState(initialValues?.projectName ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [organization, setOrganization] = useState(initialValues?.organization ?? "");
  const [archetypeId, setArchetypeId] = useState(initialValues?.archetypeId ?? "");
  const [jurisdiction, setJurisdiction] = useState(initialValues?.jurisdiction ?? "");
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>(
    initialValues?.supportedCurrencies ?? [],
  );
  const [targetCustomer, setTargetCustomer] = useState<TargetCustomer>(
    initialValues?.targetCustomer ?? "hybrid",
  );
  const [brandMark, setBrandMark] = useState<File | null>(
    initialValues?.brandMark ?? null,
  );
  const [brandMarkPreview, setBrandMarkPreview] = useState<string | null>(() =>
    initialValues?.brandMark
      ? URL.createObjectURL(initialValues.brandMark)
      : null,
  );
  const [brandMarkError, setBrandMarkError] = useState("");

  const [openMenu, setOpenMenu] = useState<"currency" | "archetype" | null>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const archetypeMenuRef = useRef<HTMLDivElement>(null);

  const selectedArchetype = archetypes.find((item) => item.id === archetypeId);
  const selectedOrganization =
    organization === "apex" ? "Apex Global Finance Team" : "";
  const selectedJurisdiction = jurisdictions.find(
    (item) => item.value === jurisdiction,
  )?.label;
  const selectedTargetCustomer = targetCustomers.find(
    (item) => item.value === targetCustomer,
  )?.label;

  const availableCurrencies = currencies.filter(
    (currency) => !supportedCurrencies.includes(currency.code),
  );

  useEffect(() => {
    if (!openMenu) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        currencyMenuRef.current?.contains(target) ||
        archetypeMenuRef.current?.contains(target)
      ) {
        return;
      }
      setOpenMenu(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  // Release the object URL when it is replaced or the component unmounts.
  useEffect(() => {
    if (!brandMarkPreview) return;
    return () => URL.revokeObjectURL(brandMarkPreview);
  }, [brandMarkPreview]);

  const addCurrency = (code: string) => {
    setSupportedCurrencies((current) =>
      current.includes(code) ? current : [...current, code],
    );
    setOpenMenu(null);
  };

  const removeCurrency = (code: string) => {
    setSupportedCurrencies((current) =>
      current.filter((currency) => currency !== code),
    );
  };

  const clearBrandMark = () => {
    setBrandMark(null);
    setBrandMarkPreview(null);
  };

  const handleBrandMarkChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = ["image/png", "image/svg+xml", "image/webp"];
    if (!supportedTypes.includes(file.type)) {
      clearBrandMark();
      setBrandMarkError("Choose a PNG, SVG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      clearBrandMark();
      setBrandMarkError("The brand mark must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    setBrandMark(file);
    setBrandMarkPreview(URL.createObjectURL(file));
    setBrandMarkError("");
  };

  const handleContinue = () => {
    onContinue({
      projectName,
      description,
      organization,
      archetypeId,
      jurisdiction,
      supportedCurrencies,
      targetCustomer,
      brandMark,
    });
  };

  const SelectedArchetypeIcon = selectedArchetype
    ? getArchetypeIcon(selectedArchetype.id, selectedArchetype.title)
    : null;

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
            Overview
          </span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Project Details</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Give your project an identity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up the basic institutional parameters, jurisdiction profiles, and core ledger metadata of your financial product.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Form Column */}
        <div className="flex-1 w-full space-y-8">
          
          {/* Project Name */}
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="project-name"
                type="text"
                placeholder="e.g. Apex Digital Banking"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                maxLength={64}
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500">
              A distinct internal and external identifier for your deployed program and API access points.
            </p>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="project-description" className="text-sm font-semibold text-slate-900">Project Description</label>
              <span className="text-[11px] text-slate-400">Optional specification</span>
            </div>
            <textarea
              id="project-description"
              placeholder="Describe the purpose, target audience, and scope of this financial program..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {/* Organization & Archetype */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="project-organization" className="text-sm font-semibold text-slate-900">Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  id="project-organization"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  <option value="">Select organization...</option>
                  <option value="apex">Apex Global Finance Team</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label id="product-archetype-label" className="text-sm font-semibold text-slate-900">Product Archetype</label>
              <div className="relative" ref={archetypeMenuRef}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === "archetype"}
                  aria-labelledby="product-archetype-label"
                  onClick={() =>
                    setOpenMenu(openMenu === "archetype" ? null : "archetype")
                  }
                  className="flex w-full items-center gap-2.5 pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    {SelectedArchetypeIcon ? (
                      <SelectedArchetypeIcon className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Layers className="w-4 h-4 text-slate-400" />
                    )}
                  </span>
                  <span
                    className={`flex-1 truncate ${
                      selectedArchetype ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {selectedArchetype?.title ?? "Select archetype..."}
                  </span>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${
                      openMenu === "archetype" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMenu === "archetype" && (
                  <div
                    role="listbox"
                    aria-labelledby="product-archetype-label"
                    className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                  >
                    {archetypes.map((item) => {
                      const Icon = getArchetypeIcon(item.id, item.title);
                      const isSelected = item.id === archetypeId;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setArchetypeId(item.id);
                            setOpenMenu(null);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-blue-50 font-semibold text-blue-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? "text-blue-600" : "text-slate-400"
                            }`}
                          />
                          <span className="flex-1 truncate">{item.title}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Market & Jurisdiction */}
          <div className="space-y-2">
            <label htmlFor="project-jurisdiction" className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Primary Market & Jurisdiction <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="project-jurisdiction"
                value={jurisdiction}
                onChange={(event) => setJurisdiction(event.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                <option value="">Select jurisdiction...</option>
                {jurisdictions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-500">
              Determines compliance rule engine baseline, KYC routing, and core correspondent settlement rail.
            </p>
          </div>

          {/* Supported Currencies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                Supported Currencies <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {supportedCurrencies.length} Active Multi-currency Wallet
                {supportedCurrencies.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative" ref={currencyMenuRef}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === "currency"}
                  onClick={() =>
                    setOpenMenu(openMenu === "currency" ? null : "currency")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Currency
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      openMenu === "currency" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMenu === "currency" && (
                  <div
                    role="listbox"
                    aria-label="Available currencies"
                    className="absolute left-0 top-full z-20 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                  >
                    {availableCurrencies.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-slate-500">
                        All supported currencies added.
                      </p>
                    ) : (
                      availableCurrencies.map((currency) => (
                        <button
                          key={currency.code}
                          type="button"
                          role="option"
                          aria-selected={false}
                          onClick={() => addCurrency(currency.code)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <CurrencyFlag code={currency.code} />
                          <span className="flex-1 truncate">{currency.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {currency.code}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {supportedCurrencies.map((code) => {
                const currency = currencies.find((item) => item.code === code);
                if (!currency) return null;

                return (
                  <span
                    key={code}
                    className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-full"
                  >
                    <CurrencyFlag code={currency.code} />
                    {currency.name}
                    <button
                      type="button"
                      onClick={() => removeCurrency(code)}
                      aria-label={`Remove ${currency.name}`}
                      className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {supportedCurrencies.length === 0 && (
                <span className="text-xs text-slate-400">
                  No currencies selected yet.
                </span>
              )}
            </div>
          </div>

          {/* Target Customers */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Target Customers <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {targetCustomers.map((customer) => {
                const isSelected = targetCustomer === customer.value;

                return (
                  <button
                    key={customer.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setTargetCustomer(customer.value)}
                    className={`relative flex flex-col items-center justify-center py-3 px-4 border rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-slate-50 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                      {customer.label}
                    </span>
                    <span className={`text-[10px] ${isSelected ? "text-blue-600" : "text-slate-500"}`}>
                      {customer.description}
                    </span>
                    {isSelected && (
                      <>
                        <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-blue-600" />
                        <span className="sr-only">Selected</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Program Brand Mark & Icon (Optional)</p>

            {brandMark && brandMarkPreview ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brandMarkPreview}
                    alt={`Preview of ${brandMark.name}`}
                    className="max-h-28 max-w-full rounded-lg bg-white object-contain shadow-sm ring-1 ring-slate-200"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="min-w-0 flex-1 truncate text-[11px] text-slate-500">
                    {brandMark.name}
                  </p>
                  <label
                    htmlFor="brand-mark-upload"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Change Logo
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor="brand-mark-upload"
                className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-blue-600 mb-2" />
                <span className="text-sm font-semibold text-blue-600">
                  Upload Logo
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Recommended: 512x512 PNG, SVG, or high-density WebP (max 2MB)
                </span>
              </label>
            )}

            <input
              id="brand-mark-upload"
              type="file"
              accept="image/png,image/svg+xml,image/webp"
              onChange={handleBrandMarkChange}
              aria-describedby={brandMarkError ? "brand-mark-error" : undefined}
              className="sr-only"
            />
            {brandMarkError && (
              <p id="brand-mark-error" role="alert" className="text-xs text-red-600">
                {brandMarkError}
              </p>
            )}
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="w-full lg:w-80 shrink-0 sticky top-24">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
            <div className="flex items-center justify-between px-1.5 pt-1 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                  <Layers className="h-4 w-4 text-white" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Program Summary</h3>
                  <p className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Live Architecture Blueprint
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Program Name</p>
                  <p className="font-semibold text-slate-900 truncate">
                    {projectName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Description</p>
                  <p className="font-medium text-slate-700 break-words">
                    {description || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Host Organization</p>
                  <p className="font-medium text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {selectedOrganization || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Archetype</p>
                  <p className="font-medium text-slate-700">
                    {selectedArchetype?.title || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Market & Sponsor</p>
                  <p className="font-medium text-slate-700">
                    {selectedJurisdiction || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Settlement Currencies</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {supportedCurrencies.length > 0 ? (
                      supportedCurrencies.map((code) => (
                        <span
                          key={code}
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold"
                        >
                          <CurrencyFlag code={code} className="h-3 w-3" />
                          {code}
                        </span>
                      ))
                    ) : (
                      <span className="font-medium text-slate-700">None selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Demographics</p>
                  <p className="font-medium text-slate-700">
                    {selectedTargetCustomer || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Program Brand Mark</p>
                  <p className="font-medium text-slate-700 break-all">
                    {brandMark?.name || "Not uploaded"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50/50 rounded-xl flex gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              You can adjust tokenization ranges and sub-merchant BIN sponsorship routing later in the Program Configuration view.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Archetype
        </button>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors">
            Save Draft
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 sm:flex-none w-[500px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}