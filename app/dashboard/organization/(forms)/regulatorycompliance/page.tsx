"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Landmark, 
  Hash, 
  User, 
  Building, 
  X, 
  Shield 
} from "lucide-react";
import Link from "next/link";

const STORAGE_KEY_FORM = "regulatory_compliance_form";
const STORAGE_KEY_JURISDICTIONS = "regulatory_compliance_jurisdictions";

export default function RegulatoryCompliance() {
  const [formData, setFormData] = useState({
    regulatoryStatus: "",
    primaryRegulator: "",
    licenseNumber: "",
    provideLater: false,
    contactPerson: "",
  });

  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const ALL_JURISDICTIONS = [
    "United Kingdom",
    "European Union",
    "Kenya",
    "USA",
    "Nigeria"
  ];

  // Load from localStorage on initial client mount
  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
    const savedJurisdictions = localStorage.getItem(STORAGE_KEY_JURISDICTIONS);

    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (error) {
        console.error("Failed to parse saved form data", error);
      }
    }

    if (savedJurisdictions) {
      try {
        setSelectedJurisdictions(JSON.parse(savedJurisdictions));
      } catch (error) {
        console.error("Failed to parse saved jurisdictions", error);
      }
    }

    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
  }, [formData, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEY_JURISDICTIONS, JSON.stringify(selectedJurisdictions));
  }, [selectedJurisdictions, isInitialized]);

  // Validation logic for required fields
  const isFormValid = Boolean(
    formData.regulatoryStatus.trim() !== "" &&
    formData.contactPerson.trim() !== "" &&
    (formData.provideLater || formData.licenseNumber.trim() !== "")
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addJurisdiction = (country: string) => {
    if (country && !selectedJurisdictions.includes(country)) {
      setSelectedJurisdictions((prev) => [...prev, country]);
    }
  };

  const removeJurisdiction = (country: string) => {
    setSelectedJurisdictions((prev) => prev.filter((item) => item !== country));
  };

  const flags: Record<string, string> = {
    "United Kingdom": "🇬🇧",
    "European Union": "🇪🇺",
    "Kenya": "🇰🇪",
    "USA": "🇺🇸",
    "Nigeria": "🇳🇬"
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6 text-slate-800 font-sans">
      {/* Step Heading */}
      <div>
        <div className="text-xs text-slate-400 font-medium mb-1">
          Merchants &gt; New Onboarding &gt; <span className="text-slate-600 font-semibold">Business Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Regulatory Compliance</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Provide the legal foundation for your institution. This data is used for regulatory compliance and network registration.
        </p>
      </div>

      {/* Top Callout Banner */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex gap-3 shadow-sm">
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-blue-900">Regulatory Compliance</h4>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Provide your regulatory status and licensing details to verify institutional eligibility. This information is required for access to primary liquidity pools.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Regulatory Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Regulatory Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="regulatoryStatus"
              value={formData.regulatoryStatus}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-8"
            >
              <option value="">Select status...</option>
              <option value="authorized">Fully Authorized / Licensed</option>
              <option value="pending">Application Pending</option>
              <option value="exempt">Exempt Entity</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Primary Regulator & License Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Primary Regulator</label>
            <div className="relative flex items-center">
              <Landmark className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                name="primaryRegulator"
                placeholder="e.g. FCA, MAS, SEC"
                value={formData.primaryRegulator}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">License / Registration Number</label>
            <div className="relative flex items-center">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                name="licenseNumber"
                placeholder="e.g. LCN-9920112"
                value={formData.licenseNumber}
                onChange={handleChange}
                disabled={formData.provideLater}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="provideLater"
                name="provideLater"
                checked={formData.provideLater}
                onChange={handleChange}
                className="w-3.5 h-3.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="provideLater" className="text-xs font-medium text-slate-700 cursor-pointer">
                Provide Later
              </label>
            </div>
          </div>
        </div>

        {/* Compliance Contact Person */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Compliance Contact Person <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Full name of the primary compliance officer, MLRO or designated representative.
          </p>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              name="contactPerson"
              placeholder="Jane Doe"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Authorized Jurisdictions Dynamic Dropdown & Tag List */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">Authorized Jurisdictions</label>
          <p className="text-[11px] text-slate-500">
            Select regions or countries where the entity is authorized to operate.
          </p>

          <div className="border border-slate-200 rounded-xl p-3 bg-[#F8FAFC] space-y-3">
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <select
                value=""
                onChange={(e) => addJurisdiction(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 text-xs text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Please select all countries &amp; regions where you are authorised
                </option>
                {ALL_JURISDICTIONS.filter((country) => !selectedJurisdictions.includes(country)).map((country) => (
                  <option key={country} value={country}>
                    {flags[country] || "🌐"} {country}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {selectedJurisdictions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedJurisdictions.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs"
                  >
                    <span>{flags[country] || "🌐"}</span>
                    <span>{country}</span>
                    <button
                      type="button"
                      onClick={() => removeJurisdiction(country)}
                      className="text-slate-400 hover:text-slate-600 transition-colors ml-0.5"
                      aria-label={`Remove ${country}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/organization/businessidentity"
            className="px-6 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="button"
            disabled={!isFormValid}
            className={`px-6 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
              isFormValid
                ? "bg-[#0A63F8] hover:bg-blue-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            Save and Continue &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}