"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Info,
  ChevronDown,
  Building2,
  FileCheck2,
  Landmark,
  Share2,
  ArrowRight,
  FileText,
  Upload,
} from "lucide-react";

export default function DocumentUploadPage() {
  const router = useRouter();
  // Set default active sections to match design
  const [openSection, setOpenSection] = useState<string | null>("entity");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, docName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`Selected file for ${docName}:`, file.name);
      // Process file upload logic here
    }
  };

  // State to track dynamically added license cards
const [additionalLicenses, setAdditionalLicenses] = useState<
  Array<{ id: string; country: string }>
>([]);

// Function to handle adding a new license card with an empty country
const handleAddLicense = () => {
  setAdditionalLicenses((prev) => [
    ...prev,
    { id: `custom-license-${Date.now()}`, country: "" },
  ]);
};

// Function to update country selection for dynamic cards
const handleCountrySelect = (id: string, country: string) => {
  setAdditionalLicenses((prev) =>
    prev.map((item) => (item.id === id ? { ...item, country } : item))
  );
};

//State handlers to handle financial statements accordion
const [financialStatements, setFinancialStatements] = useState([
  {
    id: "financial-1",
    title: "Latest Audited Financials",
    subtitle: "Previous fiscal year (PDF, JPG).",
  },
]);

const handleAddStatement = () => {
  setFinancialStatements((prev) => [
    ...prev,
    {
      id: `financial-${Date.now()}`,
      title: "Financial Statement",
      subtitle: "Upload financial statement or bank report (PDF, JPG).",
    },
  ]);
};

const [beneficialOwners, setBeneficialOwners] = useState([
  { id: "owner-1", firstName: "", lastName: "", docType: "" },
]);

const handleAddBeneficialOwner = () => {
  setBeneficialOwners((prev) => [
    ...prev,
    {
      id: `owner-${Date.now()}`,
      firstName: "",
      lastName: "",
      docType: "",
    },
  ]);
};

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
        <span>Merchants</span>
        <span>&rsaquo;</span>
        <span>New Onboarding</span>
        <span>&rsaquo;</span>
        <span className="text-slate-600 font-semibold">Business Profile</span>
      </div>

      {/* Page Title & Description */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Document Upload
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Provide the required entity documentation to verify your regulatory
          status and business structure. All uploads are securely encrypted.
        </p>
      </div>

      {/* Compliance Note Banner */}
      <div className="bg-[#EEF4FF] border border-[#D0E2FF] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-blue-900 mb-0.5">Compliance Note</h4>
          <p className="text-slate-600 leading-relaxed">
            Files are processed immediately upon upload. Our compliance team
            aims to verify documents within 24 hours.
          </p>
        </div>
      </div>

      {/* Main Accordion & Form Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        {/* ================= Accordion 1: Entity Formation ================= */}
        <div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("entity")}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 text-left transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Entity Formation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Certificate of Incorporation, Articles of Association
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSection === "entity" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSection === "entity" && (
            <div className="p-4 pt-1 space-y-4 border-t border-slate-100">
              {/* Certificate of Incorporation */}
              <div className="border border-dashed border-slate-300 rounded-lg p-4 mt-5 bg-slate-50/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Certificate of Incorporation
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Official municipal or national operating certificate (PDF, JPG).
                      </p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    REQUIRED
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, "Certificate of Incorporation")}
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">Max size 10MB</span>
                </div>
              </div>

              {/* Articles of Association */}
              <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Articles of Association
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Official municipal or national operating certificate (PDF, JPG).
                      </p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    REQUIRED
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, "Articles of Association")}
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">Max size 10MB</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Do this later
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= Accordion 2: Regulatory Proof ================= */}
<div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all">
  <button
    type="button"
    onClick={() => toggleSection("regulatory")}
    className="w-full p-4 bg-white hover:bg-slate-50/50 text-left transition space-y-3"
  >
    {/* Header Title Row */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FileCheck2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Regulatory Proof
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            License copies, Registration certificates
          </p>
        </div>
      </div>
      <ChevronDown
        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
          openSection === "regulatory" ? "rotate-180" : ""
        }`}
      />
    </div>

    {/* Region Pills - Always Visible */}
    <div className="flex flex-wrap gap-2 pt-1">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 rounded-md border border-slate-200/50 text-xs font-semibold text-slate-700">
        <span className="w-4 h-3 rounded-xs overflow-hidden flex shrink-0 border border-slate-300">
          <svg viewBox="0 0 60 30" className="w-full h-full">
            <clipPath id="s1">
              <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="t1">
              <path d="M30,15 L60,30H45L15,15L0,30H-15L15,15L-15,0H0L30,15L45,0H60z" />
            </clipPath>
            <g clipPath="url(#s1)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
              <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t1)" stroke="#C8102E" strokeWidth="4" />
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
          </svg>
        </span>
        United Kingdom
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 rounded-md border border-slate-200/50 text-xs font-semibold text-slate-700">
        <span className="w-4 h-3 rounded-xs bg-[#003399] overflow-hidden flex items-center justify-center shrink-0 border border-slate-300">
          <span className="text-[7px] text-yellow-400 font-bold leading-none">★</span>
        </span>
        European Union
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 rounded-md border border-slate-200/50 text-xs font-semibold text-slate-700">
        <span className="w-4 h-3 rounded-xs overflow-hidden flex flex-col shrink-0 border border-slate-300">
          <span className="h-1/3 bg-black w-full" />
          <span className="h-1/3 bg-[#990000] w-full" />
          <span className="h-1/3 bg-[#006600] w-full" />
        </span>
        Kenya
      </div>
    </div>
  </button>

  {/* Accordion Content - Only visible when open */}
  {openSection === "regulatory" && (
    <div className="p-4 pt-4 space-y-4 border-t border-slate-100">
      {/* License Card 1 - UK */}
      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Operating License</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Provide active financial services license (PDF, JPG).
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            REQUIRED
          </span>
        </div>

        <div>
          <select defaultValue="United Kingdom" className="w-full bg-slate-100/80 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 font-medium outline-none focus:border-blue-500">
            <option>United Kingdom</option>
            <option>European Union</option>
            <option>Kenya</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              Upload File
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileChange(e, "UK Operating License")}
              />
            </label>
            <span className="text-[11px] text-slate-400">Max size 10MB</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
            Provide later
          </label>
        </div>
      </div>

      {/* License Card 2 - EU */}
      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Operating License</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Provide active financial services license (PDF, JPG).
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            REQUIRED
          </span>
        </div>

        <div>
          <select defaultValue="European Union" className="w-full bg-slate-100/80 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 font-medium outline-none focus:border-blue-500">
            <option>United Kingdom</option>
            <option>European Union</option>
            <option>Kenya</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              Upload File
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileChange(e, "EU Operating License")}
              />
            </label>
            <span className="text-[11px] text-slate-400">Max size 10MB</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
            Provide later
          </label>
        </div>
      </div>

      {/* License Card 3 - Kenya */}
      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Operating License</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Provide active financial services license (PDF, JPG).
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            REQUIRED
          </span>
        </div>

        <div>
          <select defaultValue="Kenya" className="w-full bg-slate-100/80 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 font-medium outline-none focus:border-blue-500">
            <option>United Kingdom</option>
            <option>European Union</option>
            <option>Kenya</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              Upload File
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileChange(e, "Kenya Operating License")}
              />
            </label>
            <span className="text-[11px] text-slate-400">Max size 10MB</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
            Provide later
          </label>
        </div>
      </div>

      {/* Dynamic Additional License Cards */}
      {additionalLicenses.map((license) => (
        <div
          key={license.id}
          className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Operating License</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Provide active financial services license (PDF, JPG).
                </p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              REQUIRED
            </span>
          </div>

          <div>
            <select
              value={license.country}
              onChange={(e) => handleCountrySelect(license.id, e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 font-medium outline-none focus:border-blue-500"
            >
              <option value="" disabled hidden>
                Select Country
              </option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="European Union">European Union</option>
              <option value="Kenya">Kenya</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      `${license.country || "Additional"} Operating License`
                    )
                  }
                />
              </label>
              <span className="text-[11px] text-slate-400">Max size 10MB</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              Provide later
            </label>
          </div>
        </div>
      ))}

      {/* Add License Button */}
      <button
        type="button"
        onClick={handleAddLicense}
        className="w-full border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition uppercase tracking-wide cursor-pointer"
      >
        ADD LICENSE
      </button>
    </div>
  )}
</div>

       {/* ================= Accordion 3: Financial Statements ================= */}
<div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all bg-white">
  <button
    type="button"
    onClick={() => toggleSection("financial")}
    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 text-left transition"
  >
    <div className="flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        <Landmark className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          Financial Statements
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Audited reports, Bank statements
        </p>
      </div>
    </div>
    <ChevronDown
      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
        openSection === "financial" ? "rotate-180" : ""
      }`}
    />
  </button>

  {/* Accordion Content */}
  {openSection === "financial" && (
    <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
      {/* Financial Statement Upload Cards */}
      {financialStatements.map((statement) => (
        <div
          key={statement.id}
          className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/20 space-y-4"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {statement.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {statement.subtitle}
                </p>
              </div>
            </div>
            <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase pt-0.5">
              OPTIONAL
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange(e, statement.title)}
                />
              </label>
              <span className="text-xs text-slate-400">Max size 10MB</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-px bg-slate-200" />
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                Provide later
              </label>
            </div>
          </div>
        </div>
      ))}

      {/* Dynamic Add Statement Button */}
      <button
        type="button"
        onClick={handleAddStatement}
        className="w-full border border-dashed border-slate-300 hover:border-slate-400 rounded-lg py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition uppercase tracking-wide cursor-pointer"
      >
        ADD STATEMENT
      </button>
    </div>
  )}
</div>
        {/* ================= Accordion 4: Ownership Structure ================= */}
<div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all bg-white">
  <button
    type="button"
    onClick={() => toggleSection("ownership")}
    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 text-left transition"
  >
    <div className="flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        <Share2 className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          Ownership Structure
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          UBO register, Org charts
        </p>
      </div>
    </div>
    <ChevronDown
      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
        openSection === "ownership" ? "rotate-180" : ""
      }`}
    />
  </button>

  {/* Accordion Content */}
  {openSection === "ownership" && (
    <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
      {/* 1. UBO Register Card */}
      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/20 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Ultimate Beneficial Owners (UBO) Register
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Must list all individuals holding &gt;25% (PDF, JPG).
              </p>
            </div>
          </div>
          <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase pt-0.5">
            REQUIRED
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              Upload File
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileChange(e, "UBO Register")}
              />
            </label>
            <span className="text-xs text-slate-400">Max size 10MB</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            Provide later
          </label>
        </div>
      </div>

      {/* 2. Owner Identification Cards (Dynamic) */}
      {beneficialOwners.map((owner) => (
        <div
          key={owner.id}
          className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/20 space-y-3.5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Owner Identification
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Valid Passport or National ID of beneficial owner. (PDF, JPG).
                </p>
              </div>
            </div>
            <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase pt-0.5">
              REQUIRED
            </span>
          </div>

          {/* First & Last Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 rounded-md px-3 py-2.5 outline-none transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 rounded-md px-3 py-2.5 outline-none transition"
            />
          </div>

          {/* Document Type Dropdown */}
          <div className="relative">
            <select
              defaultValue=""
              className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-600 rounded-md px-3 py-2.5 outline-none transition appearance-none cursor-pointer pr-8"
            >
              <option value="" disabled hidden>
                Select document type
              </option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="drivers_license">Driver's License</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* File Upload Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={(e) =>
                    handleFileChange(e, "Owner Identification")
                  }
                />
              </label>
              <span className="text-xs text-slate-400">Max size 10MB</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              Provide later
            </label>
          </div>
        </div>
      ))}

      {/* Add New Beneficial Owner Button */}
      <button
        type="button"
        onClick={handleAddBeneficialOwner}
        className="w-full border border-dashed border-slate-300 hover:border-slate-400 rounded-lg py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition uppercase tracking-wide cursor-pointer"
      >
        ADD NEW BENEFICIAL OWNER
      </button>
    </div>
  )}
</div>

        {/* Pending Uploads Card */}
        <div className="bg-[#EEF4FF]/70 border border-[#D0E2FF] rounded-lg p-5 flex items-center gap-4 mt-6">
          <div className="w-9 h-9 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 text-[11px] font-bold shrink-0">
            0%
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Pending Uploads
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              5 mandatory documents required
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-8">
          <Link
            href="/dashboard/organization/beneficial-ownership"
            className="px-6 py-2.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={() => router.push("/dashboard/organization/review")}
            className="px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            Save and Continue
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}