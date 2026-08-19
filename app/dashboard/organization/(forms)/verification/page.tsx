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
  X,
  Lock,
  Mail,
  Smartphone,
  Copy,
  Check,
  User,
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("johndoe@gmail.com");
  const [phoneInput, setPhoneInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [sentEmailStatus, setSentEmailStatus] = useState(false);
  const [sentPhoneStatus, setSentPhoneStatus] = useState(false);

  // Dynamic Base Path resolution (Solution 2 for GitHub Pages)
  const repoName = "/Fintechconnect-website";
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const basePath = currentPath.startsWith(repoName) ? repoName : "";

  // Mobile flow redirect URL (/verify/m)
  const mobileVerifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${basePath}/verify/m`
      : "https://yourdomain.com/verify/m";

  // QR Code Image Generator URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    mobileVerifyUrl
  )}`;

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
      const rawOrg = getFromLocalStorage(KEY_CANDIDATES.ORGANIZATION);
      const rawCompliance = getFromLocalStorage(KEY_CANDIDATES.COMPLIANCE_FORM);
      const rawOwners = getFromLocalStorage(KEY_CANDIDATES.BENEFICIAL_OWNERS);

      // 1. Account Ownership (Primary Applicant / Business Identity)
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
              role: owner.officialRole || "Beneficial Owner",
              status: "pending_email",
              actionLabel: "Send Invitation",
            });
          }
        });
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
              role: sig.officialRole || "Authorised Signatory",
              status: "pending_email",
              actionLabel: idx === 0 ? "Send Reminder" : "Send Invitation",
            });
          }
        });
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
    if (totalStakeholders === 0) {
      alert("No stakeholders available to verify.");
      return;
    }
    alert("Bulk verification invitations triggered for all pending stakeholders!");
  };

  const handleActionClick = (person: Stakeholder) => {
    // Save the clicked stakeholder's name so Step 1 picks it up
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_applicant_name", person.fullName);
    }

    const label = person.actionLabel?.toLowerCase() || "";
    if (label.includes("complete id") || label.includes("facial scan") || label.includes("request id")) {
      setIsModalOpen(true);
    } else {
      alert(`Action triggered for ${person.fullName}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileVerifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!emailInput) return;
    setSentEmailStatus(true);
    setTimeout(() => setSentEmailStatus(false), 2500);
  };

  const handleSendPhone = () => {
    if (!phoneInput) return;
    setSentPhoneStatus(true);
    setTimeout(() => setSentPhoneStatus(false), 2500);
  };

  if (!isInitialized) {
    return (
      <div className="w-full p-12 text-center text-xs text-slate-400 font-sans">
        Loading verification hub...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 text-slate-800 font-sans pb-12 relative">
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
            disabled={totalStakeholders === 0}
            className="bg-[#0A63F8] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
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
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs transition-all"
            >
              {/* Category Header */}
              <div
                onClick={() => toggleSection(section.key)}
                className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 pb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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

              {/* Individual Stakeholders List or Empty State */}
              {isOpen && (
                <div className="mt-4 space-y-3">
                  {section.data.length > 0 ? (
                    section.data.map((person) => (
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
                            onClick={() => handleActionClick(person)}
                            className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-2xs cursor-pointer"
                          >
                            {person.actionLabel || "Send Invitation"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      No stakeholder data found for this section.
                    </div>
                  )}
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

      {/* BIOMETRIC VERIFICATION MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Biometric Verification Info */}
            <div className="bg-[#EEF4FF]/70 p-8 flex flex-col justify-between md:w-[42%] shrink-0 border-r border-blue-50/50">
              <div>
                {/* Smiley/User Face Icon */}
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0A63F8] flex items-center justify-center mb-6">
                  <User className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  Biometric Verification
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-8">
                  For security and compliance purposes, we require a live facial scan. This process is optimized for mobile devices with high-resolution cameras.
                </p>

                <div className="space-y-5">
                  {/* Institutional Grade Security */}
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0A63F8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-none">
                        Institutional Grade Security
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        End-to-end encrypted biometric data processing.
                      </p>
                    </div>
                  </div>

                  {/* Privacy First */}
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0A63F8] flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-none">
                        Privacy First
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        Scans are never stored on device and are automatically purged after verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Continue on Mobile Action Section */}
            <div className="p-8 flex-1 flex flex-col items-center text-center justify-center">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                Continue on Mobile
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
                Scan the QR code with your smartphone camera to securely complete your facial verification.
              </p>

              {/* QR Code Phone Frame Container */}
              <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-4 mb-4 w-full max-w-[240px] flex flex-col items-center shadow-2xs">
                {/* Mockup phone bar */}
                <div className="flex items-center justify-between w-full text-[9px] text-slate-400 mb-2 px-1">
                  <span>&lt;</span>
                  <span className="font-semibold text-slate-700">Facial Scan</span>
                  <span></span>
                </div>

                <span className="text-[11px] font-bold text-slate-800 mb-3 block">
                  Secure Mobile Handoff
                </span>

                {/* QR Code Display */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                  <img
                    src={qrCodeImageUrl}
                    alt="Scan QR code to verify on mobile"
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <p className="text-[9.5px] text-slate-500 max-w-[180px] mt-3 mb-2 leading-tight">
                  Scan this code with your phone to complete the facial verification on your mobile device.
                </p>

                <div className="flex items-center gap-1 text-[9.5px] text-slate-500 font-medium">
                  <Shield className="w-2.5 h-2.5 text-slate-400" /> Ensure good lighting
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3 w-full max-w-sm my-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">OR</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Email Send Field */}
              <div className="w-full max-w-sm space-y-2.5">
                <div className="flex items-center border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/50 p-1 w-full focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Mail className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                  <input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-800 px-2.5 py-1.5 focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    {sentEmailStatus ? "Sent!" : "Send Link"}
                  </button>
                </div>

                {/* Phone Send Field */}
                <div className="flex items-center border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/50 p-1 w-full focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Smartphone className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-800 px-2.5 py-1.5 focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleSendPhone}
                    className="bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    {sentPhoneStatus ? "Sent!" : "Send Link"}
                  </button>
                </div>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full border border-slate-200 rounded-xl py-2 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer bg-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#0A63F8]" />
                      Copy secure link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}