"use client";

import React, { useState, ChangeEvent } from "react";
import { Landmark, ChevronDown, FileText, Upload, Minus } from "lucide-react";

interface FinancialStatementsProps {
  isOpen: boolean;
  onToggle: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, docName: string) => void;
}

export default function FinancialStatements({
  isOpen,
  onToggle,
  onFileChange,
}: FinancialStatementsProps) {
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

  const handleRemoveStatement = (id: string | number) => {
    setFinancialStatements((prev) =>
      prev.filter((statement) => statement.id !== id)
    );
  };

  return (
    <div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all bg-white">
      <button
        type="button"
        onClick={onToggle}
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
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
          {/* Financial Statement Upload Cards */}
          {financialStatements.map((statement, index) => (
            <div
              key={statement.id}
              className="group relative border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/20 space-y-4"
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
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase pt-0.5">
                    OPTIONAL
                  </span>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStatement(statement.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 rounded cursor-pointer"
                      title="Remove Statement"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
                      onChange={(e) => onFileChange(e, statement.title)}
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
  );
}