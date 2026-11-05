"use client";

import React, { useState } from "react";
import {
  Building2,
  ChevronDown,
  Upload,
  Info,
  ArrowRight,
  ArrowLeft,
  Layers,
  Check,
} from "lucide-react";
import { archetypes } from "./archetypeselectionform";

const jurisdictions = [
  { value: "us", label: "United States (US - OCC / FDIC Sponsor Partner)" },
  { value: "uk", label: "United Kingdom (FCA)" },
  { value: "eu", label: "European Union (EBA)" },
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
];

const targetCustomers = [
  { value: "individuals", label: "Individuals", description: "Retail / B2C" },
  { value: "businesses", label: "Businesses", description: "Commercial / B2B" },
  { value: "hybrid", label: "Both (Hybrid)", description: "Omnichannel Program" },
] as const;

type TargetCustomer = (typeof targetCustomers)[number]["value"];

export default function ProjectDetailsForm({
  onBack,
  onContinue,
  initialArchetypeId,
}: {
  onBack: () => void;
  onContinue: () => void;
  initialArchetypeId: string;
}) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [organization, setOrganization] = useState("");
  const [archetypeId, setArchetypeId] = useState(initialArchetypeId);
  const [jurisdiction, setJurisdiction] = useState("");
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);
  const [targetCustomer, setTargetCustomer] = useState<TargetCustomer>("hybrid");
  const [brandMark, setBrandMark] = useState<File | null>(null);
  const [brandMarkError, setBrandMarkError] = useState("");

  const selectedArchetype = archetypes.find((item) => item.id === archetypeId);
  const selectedOrganization =
    organization === "apex" ? "Apex Global Finance Team" : "";
  const selectedJurisdiction = jurisdictions.find(
    (item) => item.value === jurisdiction,
  )?.label;
  const selectedTargetCustomer = targetCustomers.find(
    (item) => item.value === targetCustomer,
  )?.label;

  const toggleCurrency = (code: string) => {
    setSupportedCurrencies((current) =>
      current.includes(code)
        ? current.filter((currency) => currency !== code)
        : [...current, code],
    );
  };

  const handleBrandMarkChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = ["image/png", "image/svg+xml", "image/webp"];
    if (!supportedTypes.includes(file.type)) {
      setBrandMark(null);
      setBrandMarkError("Choose a PNG, SVG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setBrandMark(null);
      setBrandMarkError("The brand mark must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    setBrandMark(file);
    setBrandMarkError("");
  };

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
              <label htmlFor="product-archetype" className="text-sm font-semibold text-slate-900">Product Archetype</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  id="product-archetype"
                  value={archetypeId}
                  onChange={(event) => setArchetypeId(event.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  <option value="">Select archetype...</option>
                  {archetypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Supported Currencies <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {currencies.map((currency) => {
                const isSelected = supportedCurrencies.includes(currency.code);

                return (
                  <button
                    key={currency.code}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleCurrency(currency.code)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                      isSelected
                        ? "text-blue-700 bg-blue-50 border-blue-200"
                        : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {currency.symbol}
                    </span>
                    {currency.name}
                  </button>
                );
              })}
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
            <label
              htmlFor="brand-mark-upload"
              className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-blue-600">
                {brandMark ? "Change Logo" : "Upload Logo"}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                {brandMark
                  ? brandMark.name
                  : "Recommended: 512x512 PNG, SVG, or high-density WebP (max 2MB)"}
              </span>
            </label>
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
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Program Summary</h3>
            </div>
            
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
                      <span key={code} className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
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
            onClick={onContinue}
            className="flex-1 sm:flex-none w-[500px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}