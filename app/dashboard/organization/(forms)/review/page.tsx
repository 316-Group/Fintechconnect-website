"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building,
  Shield,
  Users,
  FileText,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// LocalStorage Keys for all steps
const KEYS = {
  ORGANIZATION: "business_identity_form",
  COMPLIANCE_FORM: "regulatory_compliance_form",
  COMPLIANCE_JURISDICTIONS: "regulatory_compliance_jurisdictions",
  BENEFICIAL_OWNERS: "beneficial_owners_form",
  DOCUMENTS: "uploaded_documents_form",
};

interface OrganizationData {
  legalName?: string;
  registrationNumber?: string;
  country?: string;
  entityType?: string;
  taxId?: string;
  website?: string;
}

interface ComplianceData {
  regulatoryStatus?: string;
  primaryRegulator?: string;
  licenseNumber?: string;
  provideLater?: boolean;
  contactPerson?: string;
}

interface BeneficialOwner {
  fullName: string;
  officialRole: string;
  ownershipStake: string;
  country: string;
}

interface UploadedDoc {
  name: string;
  status: "uploaded" | "pending";
}

export default function ReviewAndSubmit() {
  const [orgData, setOrgData] = useState<OrganizationData>({});
  const [complianceData, setComplianceData] = useState<ComplianceData>({});
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [beneficialOwners, setBeneficialOwners] = useState<BeneficialOwner[]>([]);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);

  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stored data from all previous steps
  useEffect(() => {
    try {
      const savedOrg = localStorage.getItem(KEYS.ORGANIZATION);
      if (savedOrg) setOrgData(JSON.parse(savedOrg));

      const savedCompliance = localStorage.getItem(KEYS.COMPLIANCE_FORM);
      if (savedCompliance) setComplianceData(JSON.parse(savedCompliance));

      const savedJurisdictions = localStorage.getItem(KEYS.COMPLIANCE_JURISDICTIONS);
      if (savedJurisdictions) setJurisdictions(JSON.parse(savedJurisdictions));

      const savedOwners = localStorage.getItem(KEYS.BENEFICIAL_OWNERS);
      if (savedOwners) setBeneficialOwners(JSON.parse(savedOwners));

      const savedDocs = localStorage.getItem(KEYS.DOCUMENTS);
      if (savedDocs) setDocuments(JSON.parse(savedDocs));
    } catch (error) {
      console.error("Failed to load submission review data:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!isDeclarationChecked) return;
    setIsSubmitting(true);

    const payload = {
      organization: orgData,
      compliance: {
        ...complianceData,
        authorizedJurisdictions: jurisdictions,
      },
      beneficialOwners,
      documents,
      submittedAt: new Date().toISOString(),
    };

    console.log("Submitting Onboarding Data Payload:", payload);

    // Simulate API request submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Application submitted successfully!");
      // Optionally redirect to success/dashboard page:
      // window.location.href = "/dashboard";
    }, 1500);
  };

  if (!isInitialized) {
    return (
      <div className="w-full p-12 text-center text-xs text-slate-400">
        Loading review details...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 text-slate-800 font-sans pb-12">
      {/* Header & Breadcrumb */}
      <div>
        <div className="text-xs text-slate-400 font-medium mb-5">
          Merchants &gt; New Onboarding &gt;{" "}
          <span className="text-slate-600 font-semibold">Review &amp; Submit</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Review &amp; Submit
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Please review all provided information carefully before submitting your application for institutional verification.
        </p>
      </div>

      {/* Top Banner Notice */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-blue-900">
            Final Verification Step
          </h4>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Ensure all legal details match your supporting documentation to prevent delays during our compliance team&apos;s review process.
          </p>
        </div>
      </div>

      {/* Section 1: Organization Details */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Business Identity
            </h3>
          </div>
          <Link
            href="/dashboard/organization/businessidentity"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Legal Entity Name</span>
            <span className="font-semibold text-slate-800">
              {orgData.legalName || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Registration Number</span>
            <span className="font-semibold text-slate-800">
              {orgData.registrationNumber || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Country of Registration</span>
            <span className="font-semibold text-slate-800">
              {orgData.country || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Entity Type</span>
            <span className="font-semibold text-slate-800">
              {orgData.entityType || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tax Identification (TIN)</span>
            <span className="font-semibold text-slate-800">
              {orgData.taxId || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Website URL</span>
            <span className="font-semibold text-slate-800">
              {orgData.website ? (
                <a
                  href={orgData.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {orgData.website} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                "—"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Regulatory Compliance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Regulatory Compliance
            </h3>
          </div>
          <Link
            href="/dashboard/organization/compliance"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Regulatory Status</span>
            <span className="font-semibold text-slate-800 capitalize">
              {complianceData.regulatoryStatus || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Primary Regulator</span>
            <span className="font-semibold text-slate-800">
              {complianceData.primaryRegulator || "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">License Number</span>
            <span className="font-semibold text-slate-800">
              {complianceData.provideLater
                ? "Provided Later"
                : complianceData.licenseNumber || "—"}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-400 block text-[11px]">Authorized Jurisdictions</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {jurisdictions.length > 0 ? (
                jurisdictions.map((country) => (
                  <span
                    key={country}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                  >
                    {country}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Compliance Officer</span>
            <span className="font-semibold text-slate-800">
              {complianceData.contactPerson || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Beneficial Ownership */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Beneficial Ownership
            </h3>
          </div>
          <Link
            href="/dashboard/organization/ownership"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>

        {beneficialOwners.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {beneficialOwners.map((owner, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{owner.fullName}</p>
                  <p className="text-slate-400 text-[11px]">{owner.officialRole}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-bold">
                    {owner.ownershipStake}% Ownership
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{owner.country}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No beneficial owners added.</p>
        )}
      </div>

      {/* Section 4: Supporting Documents */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Submitted Documents
            </h3>
          </div>
          <Link
            href="/dashboard/organization/documents"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{doc.name}</span>
                </div>
                {doc.status === "uploaded" ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No documents uploaded yet.</p>
        )}
      </div>

      {/* Declaration & Submission Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200/60">
          <input
            type="checkbox"
            id="declaration"
            checked={isDeclarationChecked}
            onChange={(e) => setIsDeclarationChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="declaration" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
            I hereby certify that I am an authorized representative of the entity and that all information provided in this onboarding form is accurate, complete, and up to date.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <Link
            href="/dashboard/organization/documents"
            className="px-6 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isDeclarationChecked || isSubmitting}
            className={`px-6 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
              isDeclarationChecked && !isSubmitting
                ? "bg-[#0A63F8] hover:bg-blue-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
            {!isSubmitting && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}