"use client";

import React, { useState, ChangeEvent } from "react";
import { FileCheck2, ChevronDown, FileText, Upload, Minus } from "lucide-react";

interface RegulatoryProofProps {
  isOpen: boolean;
  onToggle: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, docName: string) => void;
}

export default function RegulatoryProof({
  isOpen,
  onToggle,
  onFileChange,
}: RegulatoryProofProps) {
  const [additionalLicenses, setAdditionalLicenses] = useState<
    Array<{ id: string; country: string }>
  >([]);

  const handleAddLicense = () => {
    setAdditionalLicenses((prev) => [
      ...prev,
      { id: `custom-license-${Date.now()}`, country: "" },
    ]);
  };

  const handleCountrySelect = (id: string, country: string) => {
    setAdditionalLicenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, country } : item))
    );
  };

  const handleRemoveLicense = (id: string | number) => {
    setAdditionalLicenses((prev) => prev.filter((license) => license.id !== id));
  };

  return (
    <div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all">
      <button
        type="button"
        onClick={onToggle}
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
              isOpen ? "rotate-180" : ""
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

      {/* Accordion Content */}
      {isOpen && (
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
                    onChange={(e) => onFileChange(e, "UK Operating License")}
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
                    onChange={(e) => onFileChange(e, "EU Operating License")}
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
                    onChange={(e) => onFileChange(e, "Kenya Operating License")}
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
              className="group relative border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30 space-y-3"
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
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    REQUIRED
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLicense(license.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 rounded cursor-pointer"
                    title="Remove License"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
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
                        onFileChange(
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
  );
}