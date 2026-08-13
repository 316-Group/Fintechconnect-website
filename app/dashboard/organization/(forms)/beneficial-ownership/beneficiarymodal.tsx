"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export interface OwnerFormData {
  fullName: string;
  officialRole: string;
  ownershipStake: string;
  country: string;
  dob: string;
  idNumber: string;
  ownershipType: string;
}

interface BeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOwner: (owner: OwnerFormData) => void;
  initialData?: OwnerFormData | null; // Added prop for editing
}

const INITIAL_OWNER_FORM: OwnerFormData = {
  fullName: "",
  officialRole: "",
  ownershipStake: "25", // Default value set to 25%
  country: "",
  dob: "",
  idNumber: "",
  ownershipType: "Direct",
};

export default function BeneficiaryModal({
  isOpen,
  onClose,
  onAddOwner,
  initialData,
}: BeneficiaryModalProps) {
  const [ownerForm, setOwnerForm] = useState<OwnerFormData>(INITIAL_OWNER_FORM);

  // Sync state whenever the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setOwnerForm({
          fullName: initialData.fullName || "",
          officialRole: initialData.officialRole || "",
          ownershipStake: String(initialData.ownershipStake ?? "25"),
          country: initialData.country || "",
          dob: initialData.dob || "",
          idNumber: initialData.idNumber || "",
          ownershipType: initialData.ownershipType || "Direct",
        });
      } else {
        setOwnerForm(INITIAL_OWNER_FORM);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOwnerForm((prev) => ({ ...prev, [name]: value }));
  };

  // Enforce minimum limit of 25% when leaving the field
  const handleOwnershipBlur = () => {
    const val = parseFloat(ownerForm.ownershipStake);
    if (isNaN(val) || val < 25) {
      setOwnerForm((prev) => ({ ...prev, ownershipStake: "25" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stake = parseFloat(ownerForm.ownershipStake);

    // Prevent submission if name is missing or ownership stake is less than 25%
    if (!ownerForm.fullName || isNaN(stake) || stake < 25) return;

    onAddOwner(ownerForm);
    setOwnerForm(INITIAL_OWNER_FORM);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Beneficial Owner" : "Add Beneficial Owner"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide details for individuals who own or control 25% or more of
              the entity.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                Ownership Stake <span className="text-slate-400 font-normal">(Min. 25%)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="25"
                  max="100"
                  name="ownershipStake"
                  value={ownerForm.ownershipStake}
                  onChange={handleInputChange}
                  onBlur={handleOwnershipBlur}
                  placeholder="25.00"
                  required
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
              Indirect ownership implies control through an intermediary entity
              or trust.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              {initialData ? "Save Changes" : "Add Owner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}