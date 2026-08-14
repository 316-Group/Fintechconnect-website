"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Shield,
  UserPlus,
  Users,
  PieChart,
  Minus,
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";
import BeneficiaryModal, { OwnerFormData } from "./beneficiarymodal";
import SignatoryModal, { SignatoryFormData } from "./signatorymodal";

const STORAGE_KEY_FORM = "beneficial_ownership_form";

export default function BeneficialOwnership() {
  const [openSections, setOpenSections] = useState({
    owners: true,
    signatories: true,
  });

  const [formData, setFormData] = useState({
    ownersProvideLater: false,
    signatoriesProvideLater: false,
  });

  const [beneficialOwners, setBeneficialOwners] = useState<any[]>([]);
  const [signatories, setSignatories] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal Visibility & Edit Target State
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isSignatoryModalOpen, setIsSignatoryModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any | null>(null);
  const [editingSignatory, setEditingSignatory] = useState<any | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData(
          parsed.formData || {
            ownersProvideLater: false,
            signatoriesProvideLater: false,
          }
        );
        setBeneficialOwners(parsed.beneficialOwners || []);
        setSignatories(parsed.signatories || []);
      } catch (error) {
        console.error("Failed to parse saved ownership form", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage on update
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(
      STORAGE_KEY_FORM,
      JSON.stringify({ formData, beneficialOwners, signatories })
    );
  }, [formData, beneficialOwners, signatories, isInitialized]);

  const toggleSection = (section: "owners" | "signatories") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate dynamic declared total (capped visually at 100 max)
  const rawTotalDeclaredStake = beneficialOwners.reduce(
    (acc, owner) => acc + (Number(owner.ownershipStake) || 0),
    0
  );
  const totalDeclaredStake = Math.min(rawTotalDeclaredStake, 100);

  // Calculate max allowable stake for current modal context (Adding vs Editing)
  const totalStakeExcludingCurrent = beneficialOwners.reduce(
    (acc, owner) =>
      acc + (owner.id === editingOwner?.id ? 0 : Number(owner.ownershipStake) || 0),
    0
  );
  const maxAllowedStake = Math.max(0, 100 - totalStakeExcludingCurrent);

  // Beneficial Owner Handlers (Add & Edit)
  const handleSaveOwner = (ownerData: OwnerFormData) => {
    const rawStake = parseFloat(ownerData.ownershipStake as any) || 0;
    // Cap stake so cumulative total never exceeds 100%
    const clampedStake = Math.min(rawStake, maxAllowedStake);

    if (editingOwner) {
      setBeneficialOwners((prev) =>
        prev.map((owner) =>
          owner.id === editingOwner.id
            ? {
                ...owner,
                ...ownerData,
                ownershipStake: clampedStake,
              }
            : owner
        )
      );
    } else {
      setBeneficialOwners((prev) => [
        ...prev,
        {
          id: `owner-${Date.now()}`,
          ...ownerData,
          ownershipStake: clampedStake,
        },
      ]);
    }
    setEditingOwner(null);
  };

  const handleOpenEditOwner = (owner: any) => {
    setEditingOwner(owner);
    setIsOwnerModalOpen(true);
  };

  const handleRemoveOwner = (id: string) => {
    setBeneficialOwners((prev) => prev.filter((owner) => owner.id !== id));
  };

  // Authorized Signatory Handlers (Add & Edit)
  const handleSaveSignatory = (signatoryData: SignatoryFormData) => {
    if (editingSignatory) {
      setSignatories((prev) =>
        prev.map((sig) =>
          sig.id === editingSignatory.id
            ? {
                ...sig,
                ...signatoryData,
              }
            : sig
        )
      );
    } else {
      setSignatories((prev) => [
        ...prev,
        {
          id: `signatory-${Date.now()}`,
          ...signatoryData,
        },
      ]);
    }
    setEditingSignatory(null);
  };

  const handleOpenEditSignatory = (signatory: any) => {
    setEditingSignatory(signatory);
    setIsSignatoryModalOpen(true);
  };

  const handleRemoveSignatory = (id: string) => {
    setSignatories((prev) => prev.filter((sig) => sig.id !== id));
  };

  // Helper function to render all dynamic properties of an owner/signatory
  const renderDetails = (item: Record<string, any>, excludeKeys: string[]) => {
    const entries = Object.entries(item).filter(
      ([key, val]) =>
        !excludeKeys.includes(key) &&
        val !== undefined &&
        val !== null &&
        val !== ""
    );

    if (entries.length === 0) return null;

    return (
      <div className="mt-3 pt-2.5 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-[11px]">
        {entries.map(([key, val]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          return (
            <div key={key} className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-semibold text-slate-400 shrink-0">{label}:</span>
              <span className="font-medium text-slate-700 truncate">
                {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-6 font-sans text-slate-800 relative">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-medium mb-5">
          Merchants &gt; New Onboarding &gt;{" "}
          <span className="text-slate-600 font-semibold">
            Business Profile
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Beneficial Ownership &amp; Signatories
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Declare all individuals who ultimately own or control more than 25%
          of the entity. Regulatory compliance requires complete transparency
          of your ownership structure.
        </p>
      </div>

      {/* Callout Box */}
      <div className="bg-blue-50/60 border border-blue-100/80 rounded-xl p-4 flex gap-3.5">
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-blue-900">
            Why do we need this?
          </h4>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            To comply with Anti-Money Laundering (AML) regulations, we must
            verify the identity of the Ultimate Beneficial Owners (UBOs) who
            control or financially benefit from the company.
          </p>
        </div>
      </div>

      {/* Total Declared Percentage Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
              TOTAL DECLARED
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold text-slate-900">
                {totalDeclaredStake}%
              </span>
              {totalDeclaredStake >= 100 ? (
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  COMPLETE
                </span>
              ) : (
                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  INCOMPLETE
                </span>
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <PieChart className="w-5 h-5" />
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${totalDeclaredStake}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400">
          {Math.max(0, 100 - totalDeclaredStake)}%+ ownership structure
          remaining undeclared.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
        {/* ================= Accordion 1: Registered Owners ================= */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden transition-all bg-white">
          <button
            type="button"
            onClick={() => toggleSection("owners")}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 text-left transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">
                  Registered Owners
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Declare all individuals who own or control more than 25% of
                  the entity.
                </p>
              </div>
            </div>
            {openSections.owners ? (
              <Minus className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.owners && (
            <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
              {/* List of Added Beneficial Owners */}
              {beneficialOwners.length > 0 && (
                <div className="space-y-3 mb-4">
                  {beneficialOwners.map((owner) => (
                    <div
                      key={owner.id}
                      className="group bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs hover:border-slate-300 transition-all flex flex-col"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {owner.fullName}
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            {owner.officialRole || "Owner"} &bull;{" "}
                            {owner.ownershipType} Ownership
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="font-bold text-blue-600 text-sm mr-1">
                            {owner.ownershipStake}%
                          </div>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditOwner(owner)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer"
                            title="Edit owner"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Red X Delete Icon on Hover */}
                          <button
                            type="button"
                            onClick={() => handleRemoveOwner(owner.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                            title="Remove owner"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display All Remaining Information dynamically */}
                      {renderDetails(owner, [
                        "id",
                        "fullName",
                        "officialRole",
                        "ownershipType",
                        "ownershipStake",
                      ])}
                    </div>
                  ))}
                </div>
              )}

              {/* Dashed Entry Box */}
              <div className="border border-dashed border-slate-300 rounded-lg p-5 bg-slate-50/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Add Beneficial Owners
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Register an individual or holding entity.
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase">
                    REQUIRED
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    disabled={maxAllowedStake < 25}
                    onClick={() => {
                      setEditingOwner(null);
                      setIsOwnerModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-2xs cursor-pointer"
                  >
                    {maxAllowedStake < 25 ? "100% Limit Reached" : "Add Entry"}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black pt-1">
                <input
                  type="checkbox"
                  name="ownersProvideLater"
                  checked={formData.ownersProvideLater}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownersProvideLater: e.target.checked,
                    }))
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                Do this later
              </label>
            </div>
          )}
        </div>

        {/* ================= Accordion 2: Authorized Signatories ================= */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden transition-all bg-white">
          <button
            type="button"
            onClick={() => toggleSection("signatories")}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 text-left transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">
                  Authorized Signatories
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Define the individuals authorized to sign on behalf of the
                  entity.
                </p>
              </div>
            </div>
            {openSections.signatories ? (
              <Minus className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.signatories && (
            <div className="p-4 pt-2 space-y-4 border-t border-slate-100">
              {/* List of Added Authorized Signatories */}
              {signatories.length > 0 && (
                <div className="space-y-3 mb-4">
                  {signatories.map((sig) => (
                    <div
                      key={sig.id}
                      className="group bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs hover:border-slate-300 transition-all flex flex-col"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {sig.fullName}
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            {sig.officialRole || "Signatory"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditSignatory(sig)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer"
                            title="Edit signatory"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Red X Delete Icon on Hover */}
                          <button
                            type="button"
                            onClick={() => handleRemoveSignatory(sig.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                            title="Remove signatory"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display All Remaining Information dynamically */}
                      {renderDetails(sig, ["id", "fullName", "officialRole"])}
                    </div>
                  ))}
                </div>
              )}

              {/* Dashed Entry Box */}
              <div className="border border-dashed border-slate-300 rounded-lg p-5 bg-slate-50/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Add Authorized Signatories
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Add an individual with the authority to sign.
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase">
                    REQUIRED
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSignatory(null);
                      setIsSignatoryModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-2xs cursor-pointer"
                  >
                    Add Signatory
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black pt-1">
                <input
                  type="checkbox"
                  name="signatoriesProvideLater"
                  checked={formData.signatoriesProvideLater}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      signatoriesProvideLater: e.target.checked,
                    }))
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                Do this later
              </label>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/compliance"
            className="px-6 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="button"
            className="bg-[#0A63F8] hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            Save and Continue &rarr;
          </button>
        </div>
      </div>

      {/* Beneficial Owner Modal */}
      <BeneficiaryModal
        isOpen={isOwnerModalOpen}
        onClose={() => {
          setIsOwnerModalOpen(false);
          setEditingOwner(null);
        }}
        onAddOwner={handleSaveOwner}
        initialData={editingOwner}
        maxAllowedStake={maxAllowedStake}
      />

      {/* Signatory Modal */}
      {(() => {
        const SignatoryModalAny = SignatoryModal as any;
        return (
          <SignatoryModalAny
            isOpen={isSignatoryModalOpen}
            onClose={() => {
              setIsSignatoryModalOpen(false);
              setEditingSignatory(null);
            }}
            onAddSignatory={handleSaveSignatory}
            existingOwners={beneficialOwners}
            initialData={editingSignatory}
          />
        );
      })()}
    </div>
  );
}