"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Building2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Candidate keys to check in localStorage for each previous step
const KEY_CANDIDATES = {
  ORGANIZATION: [
    "onboarding_business_identity",
    "business_identity_form",
    "businessIdentity",
    "organization_data",
    "business_identity",
  ],
  COMPLIANCE_FORM: [
    "regulatory_compliance_form",
    "regulatoryCompliance",
    "compliance_form",
  ],
  BENEFICIAL_OWNERS: [
    "beneficial_ownership_form",
    "beneficial_owners_form",
    "beneficialOwners",
    "ownership_form",
  ],
};

interface Stakeholder {
  id: string;
  fullName: string;
  role: string;
  status: "needs_docs" | "pending_email" | "verified";
  actionLabel?: string;
}

interface StakeholderGroups {
  accountOwnership: Stakeholder[];
  regulatoryOversight: Stakeholder[];
  beneficialOwnership: Stakeholder[];
  authorisedSignatories: Stakeholder[];
}

export default function VerificationKYBHub() {
  const [groups, setGroups] = useState<StakeholderGroups>({
    accountOwnership: [],
    regulatoryOversight: [],
    beneficialOwnership: [],
    authorisedSignatories: [],
  });

  // Collapsible section state (all default to true/expanded)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    accountOwnership: true,
    regulatoryOversight: true,
    beneficialOwnership: true,
    authorisedSignatories: true,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to parse initials from full name
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper to retrieve and parse data using multiple fallback keys
  const getFromLocalStorage = (keys: string[]) => {
    for (const key of keys) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch (e) {
          console.warn(`Failed to parse localStorage key "${key}":`, e);
        }
      }
    }
    return null;
  };

  // Load and normalize stored data from all previous steps
  useEffect(() => {
    try {
      // 1. Account Ownership (Primary Applicant / Business Identity)
      const rawOrg = getFromLocalStorage(KEY_CANDIDATES.ORGANIZATION);
      const rawCompliance = getFromLocalStorage(KEY_CANDIDATES.COMPLIANCE_FORM);
      const rawOwners = getFromLocalStorage(KEY_CANDIDATES.BENEFICIAL_OWNERS);

      const accountOwnershipList: Stakeholder[] = [];
      const primaryName =
        rawOrg?.contactPerson || rawOrg?.applicantName || rawOrg?.legalName;
      if (primaryName) {
        accountOwnershipList.push({
          id: "account-1",
          fullName: primaryName,
          role: "Primary Applicant",
          status: "needs_docs",
          actionLabel: "Complete ID & Facial Scan",
        });
      } else {
        // Mock default if empty in localStorage to preserve UI fidelity
        accountOwnershipList.push({
          id: "account-default",
          fullName: "Michael Ross",
          role: "Primary Applicant",
          status: "needs_docs",
          actionLabel: "Complete ID & Facial Scan",
        });
      }

      // 2. Regulatory Oversight (Compliance Officer)
      const regulatoryList: Stakeholder[] = [];
      const complianceOfficer =
        rawCompliance?.contactPerson || rawCompliance?.complianceOfficer;
      if (complianceOfficer) {
        regulatoryList.push({
          id: "regulatory-1",
          fullName: complianceOfficer,
          role: "Compliance/MLRO Officer",
          status: "needs_docs",
          actionLabel: "Request ID & Facial Scan",
        });
      } else {
        regulatoryList.push({
          id: "regulatory-default",
          fullName: "Sarah Chen",
          role: "Compliance/MLRO Officer",
          status: "needs_docs",
          actionLabel: "Request ID & Facial Scan",
        });
      }

      // 3. Beneficial Ownership
      const beneficialList: Stakeholder[] = [];
      let rawOwnerArray: any[] = [];
      if (Array.isArray(rawOwners)) {
        rawOwnerArray = rawOwners;
      } else if (rawOwners) {
        rawOwnerArray =
          rawOwners.beneficialOwners || rawOwners.owners || [];
      }

      if (rawOwnerArray.length > 0) {
        rawOwnerArray.forEach((owner, idx) => {
          const name = owner.fullName || owner.full_name || owner.name;
          if (name) {
            beneficialList.push({
              id: `bo-${idx}`,
              fullName: name,
              role: owner.officialRole || "Compliance/MLRO Officer",
              status: "pending_email",
              actionLabel: "Send Invitation",
            });
          }
        });
      } else {
        // Mock defaults matching the mockup
        beneficialList.push(
          {
            id: "bo-1",
            fullName: "Arthur Jenkins",
            role: "Compliance/MLRO Officer",
            status: "pending_email",
            actionLabel: "Send Invitation",
          },
          {
            id: "bo-2",
            fullName: "Maria Chen",
            role: "Compliance/MLRO Officer",
            status: "pending_email",
            actionLabel: "Send Invitation",
          },
          {
            id: "bo-3",
            fullName: "Sarah Chen",
            role: "Compliance/MLRO Officer",
            status: "pending_email",
            actionLabel: "Send Invitation",
          }
        );
      }

      // 4. Authorised Signatories
      const signatoryList: Stakeholder[] = [];
      let rawSignatoryArray: any[] = [];
      if (rawOwners && Array.isArray(rawOwners.signatories)) {
        rawSignatoryArray = rawOwners.signatories;
      }

      if (rawSignatoryArray.length > 0) {
        rawSignatoryArray.forEach((sig, idx) => {
          const name = sig.fullName || sig.full_name || sig.name;
          if (name) {
            signatoryList.push({
              id: `sig-${idx}`,
              fullName: name,
              role: sig.officialRole || "Compliance/MLRO Officer",
              status: "pending_email",
              actionLabel: idx === 0 ? "Send Reminder" : "Send Invitation",
            });
          }
        });
      } else {
        // Mock defaults matching the mockup
        signatoryList.push(
          {
            id: "sig-1",
            fullName: "Arthur Jenkins",
            role: "Compliance/MLRO Officer",
            status: "pending_email",
            actionLabel: "Send Reminder",
          },
          {
            id: "sig-2",
            fullName: "Maria Chen",
            role: "Compliance/MLRO Officer",
            status: "pending_email",
            actionLabel: "Send Invitation",
          },
          {
            id: "sig-3",
            fullName: "Sarah Chen",
            role: "Compliance/MLRO Officer",
            status: "pending_email",
            actionLabel: "Send Invitation",
          }
        );
      }

      setGroups({
        accountOwnership: accountOwnershipList,
        regulatoryOversight: regulatoryList,
        beneficialOwnership: beneficialList,
        authorisedSignatories: signatoryList,
      });
    } catch (error) {
      console.error("Failed to parse verification KYB data:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Total stakeholders calculation
  const allStakeholders = [
    ...groups.accountOwnership,
    ...groups.regulatoryOversight,
    ...groups.beneficialOwnership,
    ...groups.authorisedSignatories,
  ];

  const totalStakeholders = allStakeholders.length;
  const verifiedCount = allStakeholders.filter((s) => s.status === "verified").length;
  const pendingCount = totalStakeholders - verifiedCount;

  const handleVerifyAll = () => {
    alert("Bulk verification invitations triggered for all pending stakeholders!");
  };

  if (!isInitialized) {
    return (
      <div className="w-full p-12 text-center text-xs text-slate-400 font-sans">
        Loading verification hub...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 text-slate-800 font-sans pb-12">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="text-[11px] text-slate-400 font-medium mb-3">
          Merchants <span className="mx-0.5">&gt;</span> New Onboarding{" "}
          <span className="mx-0.5">&gt;</span>{" "}
          <span className="text-slate-600 font-semibold">Business Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Verification &amp; KYB Hub
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage and trigger identity verification for all required stakeholders.
        </p>
      </div>

      {/* Info Banner Notice */}
      <div className="bg-[#EFF4FE] border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-md bg-white text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-blue-950">Why do we need this?</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Your documents are securely encrypted and processed according to institutional-grade security standards.
          </p>
        </div>
      </div>

      {/* Total Stakeholders Metrics Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
              TOTAL STAKEHOLDERS
            </span>
            <span className="text-2xl font-bold text-slate-900">{totalStakeholders}</span>
          </div>
          <button
            type="button"
            onClick={handleVerifyAll}
            className="bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Verify all stakeholders
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0A63F8] h-full transition-all duration-500"
            style={{
              width: `${totalStakeholders > 0 ? (verifiedCount / totalStakeholders) * 100 : 0}%`,
            }}
          />
        </div>

        {/* Status Count Badges */}
        <div className="flex items-center gap-3 pt-0.5">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-blue-100">
            <span className="w-4 h-4 rounded-full bg-[#0A63F8] text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </span>
            <span>Verified</span>
            <span className="font-bold ml-1">{verifiedCount}</span>
          </div>

          <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-red-100">
            <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
              !
            </span>
            <span>Pending</span>
            <span className="font-bold ml-1">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Stakeholder Category Accordion Sections */}
      <div className="space-y-4">
        {/* Section Helper Function */}
        {[
          {
            key: "accountOwnership",
            title: "Account Ownership",
            data: groups.accountOwnership,
          },
          {
            key: "regulatoryOversight",
            title: "Regulatory Oversight",
            data: groups.regulatoryOversight,
          },
          {
            key: "beneficialOwnership",
            title: "Beneficial Ownership",
            data: groups.beneficialOwnership,
          },
          {
            key: "authorisedSignatories",
            title: "Authorised Signatories",
            data: groups.authorisedSignatories,
          },
        ].map((section) => {
          const isOpen = openSections[section.key];

          return (
            <div
              key={section.key}
              className="bg-white border border-slate-200/80 rounded-1xl p-5 shadow-2xs transition-all"
            >
              {/* Category Header */}
              <div
                onClick={() => toggleSection(section.key)}
                className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 pb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-1xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">
                    {section.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600"
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Individual Stakeholders List */}
              {isOpen && (
                <div className="mt-4 space-y-3">
                  {section.data.map((person) => (
                    <div
                      key={person.id}
                      className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white hover:border-slate-300 transition-colors"
                    >
                      {/* Person Details */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF4FE] text-[#0A63F8] font-bold text-xs flex items-center justify-center shrink-0 uppercase tracking-wider">
                          {getInitials(person.fullName)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">
                            {person.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {person.role}
                          </p>
                        </div>
                      </div>

                      {/* Status Tag & Action Button */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {person.status === "needs_docs" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-semibold border border-red-100">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            Needs Documents
                          </span>
                        )}
                        {person.status === "pending_email" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-semibold border border-slate-200/60">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Pending Email
                          </span>
                        )}
                        {person.status === "verified" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Verified
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => alert(`Action triggered for ${person.fullName}`)}
                          className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-2xs cursor-pointer"
                        >
                          {person.actionLabel || "Send Invitation"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Page Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
        <Link
          href="/dashboard/organization/ownership"
          className="px-5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-2xs"
        >
          Back
        </Link>
        <Link
          href="/dashboard/organization/documents"
          className="px-6 py-2 bg-[#0A63F8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
        >
          Save and Continue <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}