"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Shield,
  UserPlus,
  Users,
  PieChart,
  Minus,
  X,
} from "lucide-react";
import Link from "next/link";

const STORAGE_KEY_FORM = "beneficial_ownership_form";

const INITIAL_OWNER_FORM = {
  fullName: "",
  officialRole: "",
  ownershipStake: "",
  country: "",
  dob: "",
  idNumber: "",
  ownershipType: "Direct", // 'Direct' | 'Indirect'
};

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerForm, setOwnerForm] = useState(INITIAL_OWNER_FORM);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOwnerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerForm.fullName) return;

    setBeneficialOwners((prev) => [
      ...prev,
      {
        id: `owner-${Date.now()}`,
        ...ownerForm,
        ownershipStake: parseFloat(ownerForm.ownershipStake) || 0,
      },
    ]);

    // Reset and close modal
    setOwnerForm(INITIAL_OWNER_FORM);
    setIsModalOpen(false);
  };

  const handleAddSignatory = () => {
    setSignatories((prev) => [
      ...prev,
      { id: `signatory-${Date.now()}`, name: "", role: "" },
    ]);
  };

  // Calculate dynamic declared total
  const totalDeclaredStake = beneficialOwners.reduce(
    (acc, owner) => acc + (Number(owner.ownershipStake) || 0),
    0
  );

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
          Declare all individuals who ultimately own or control more than
          25% of the entity. Regulatory compliance requires complete
          transparency of your ownership structure.
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
            verify the identity of the Ultimate Beneficial Owners (UBOs)
            who control or financially benefit from the company.
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
            style={{ width: `${Math.min(totalDeclaredStake, 100)}%` }}
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
                <div className="space-y-2 mb-4">
                  {beneficialOwners.map((owner) => (
                    <div
                      key={owner.id}
                      className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">
                          {owner.fullName}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {owner.officialRole || "Owner"} &bull;{" "}
                          {owner.ownershipType} Ownership
                        </p>
                      </div>
                      <div className="font-bold text-blue-600 text-sm">
                        {owner.ownershipStake}%
                      </div>
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
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-2xs cursor-pointer"
                  >
                    Add Entry
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
                    onClick={handleAddSignatory}
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

      {/* ================= ADD BENEFICIAL OWNER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Add Beneficial Owner
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Provide details for individuals who own or control 25% or more
                  of the entity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveOwner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={ownerForm.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Official Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Official Role
                  </label>
                  <div className="relative">
                    <select
                      name="officialRole"
                      value={ownerForm.officialRole}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 appearance-none bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select role...</option>
                      <option value="CEO">Chief Executive Officer (CEO)</option>
                      <option value="Director">Director</option>
                      <option value="Shareholder">Major Shareholder</option>
                      <option value="Partner">Partner</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Ownership Stake */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Ownership Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      name="ownershipStake"
                      value={ownerForm.ownershipStake}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Country of Residence */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Country of Residence
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={ownerForm.country}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 appearance-none bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select country...</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    name="dob"
                    value={ownerForm.dob}
                    onChange={handleInputChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Identification Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Identification Number
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={ownerForm.idNumber}
                    onChange={handleInputChange}
                    placeholder="SSN, TIN, or Passport"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Ownership Type Segmented Toggle */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700">
                  Ownership Type
                </label>
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setOwnerForm((prev) => ({
                        ...prev,
                        ownershipType: "Direct",
                      }))
                    }
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      ownerForm.ownershipType === "Direct"
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Direct
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOwnerForm((prev) => ({
                        ...prev,
                        ownershipType: "Indirect",
                      }))
                    }
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      ownerForm.ownershipType === "Indirect"
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Indirect
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Indirect ownership implies control through an intermediary entity or trust.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
                >
                  Add Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}