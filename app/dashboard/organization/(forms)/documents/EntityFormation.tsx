"use client";

import React, { ChangeEvent } from "react";
import { Building2, ChevronDown, FileText, Upload } from "lucide-react";

interface EntityFormationProps {
  isOpen: boolean;
  onToggle: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, docName: string) => void;
}

export default function EntityFormation({
  isOpen,
  onToggle,
  onFileChange,
}: EntityFormationProps) {
  return (
    <div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all">
      <button
        type="button"
        onClick={onToggle}
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
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
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
                  onChange={(e) =>
                    onFileChange(e, "Certificate of Incorporation")
                  }
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
                  onChange={(e) =>
                    onFileChange(e, "Articles of Association")
                  }
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
  );
}