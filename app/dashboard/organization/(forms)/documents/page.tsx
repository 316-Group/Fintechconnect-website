"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, ArrowRight } from "lucide-react";

import EntityFormation from "@/app/dashboard/organization/(forms)/documents/EntityFormation";
import RegulatoryProof from "@/app/dashboard/organization/(forms)/documents/RegulatoryProof";
import FinancialStatements from "@/app/dashboard/organization/(forms)/documents/FinancialStatements";
import OwnershipStructure from "@/app/dashboard/organization/(forms)/documents/OwnershipStructure";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>("entity");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    docName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`Selected file for ${docName}:`, file.name);
      // Process file upload logic here
    }
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
        {/* Accordion 1: Entity Formation */}
        <EntityFormation
          isOpen={openSection === "entity"}
          onToggle={() => toggleSection("entity")}
          onFileChange={handleFileChange}
        />

        {/* Accordion 2: Regulatory Proof */}
        <RegulatoryProof
          isOpen={openSection === "regulatory"}
          onToggle={() => toggleSection("regulatory")}
          onFileChange={handleFileChange}
        />

        {/* Accordion 3: Financial Statements */}
        <FinancialStatements
          isOpen={openSection === "financial"}
          onToggle={() => toggleSection("financial")}
          onFileChange={handleFileChange}
        />

        {/* Accordion 4: Ownership Structure */}
        <OwnershipStructure
          isOpen={openSection === "ownership"}
          onToggle={() => toggleSection("ownership")}
          onFileChange={handleFileChange}
        />

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