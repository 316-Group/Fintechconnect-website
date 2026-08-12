"use client";

import React, { useState } from "react";
import { ChevronDown, X, UserCheck } from "lucide-react";
import { OwnerFormData } from "./beneficiarymodal";

export interface SignatoryFormData {
  fullName: string;
  officialRole: string;
  country: string;
  dob: string;
  idNumber: string;
}

interface SignatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSignatory: (signatoryData: SignatoryFormData) => void;
  existingOwners?: OwnerFormData[];
}

const INITIAL_SIGNATORY_FORM: SignatoryFormData = {
  fullName: "",
  officialRole: "",
  country: "",
  dob: "",
  idNumber: "",
};

export default function SignatoryModal({
  isOpen,
  onClose,
  onAddSignatory,
  existingOwners = [],
}: SignatoryModalProps) {
  const [signatoryForm, setSignatoryForm] =
    useState<SignatoryFormData>(INITIAL_SIGNATORY_FORM);
  const [selectedOwnerIndex, setSelectedOwnerIndex] = useState<string>("");

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignatoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.value;
    setSelectedOwnerIndex(index);

    if (index === "") {
      setSignatoryForm(INITIAL_SIGNATORY_FORM);
      return;
    }

    const selectedOwner = existingOwners[parseInt(index, 10)];
    if (selectedOwner) {
      setSignatoryForm({
        fullName: selectedOwner.fullName || "",
        officialRole: selectedOwner.officialRole || "",
        country: selectedOwner.country || "",
        dob: selectedOwner.dob || "",
        idNumber: selectedOwner.idNumber || "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatoryForm.fullName) return;

    onAddSignatory(signatoryForm);
    setSignatoryForm(INITIAL_SIGNATORY_FORM);
    setSelectedOwnerIndex("");
    onClose();
  };

  const handleClose = () => {
    setSignatoryForm(INITIAL_SIGNATORY_FORM);
    setSelectedOwnerIndex("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Add Authorized Signatory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select an existing beneficial owner or add custom details for an
              authorized signatory.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select from Existing Owners Dropdown */}
          {existingOwners.length > 0 && (
            <div className="space-y-1.5 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
              <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Import from Registered Owners
              </label>
              <div className="relative">
                <select
                  value={selectedOwnerIndex}
                  onChange={handleSelectOwner}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 appearance-none bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">-- Choose an existing owner --</option>
                  {existingOwners.map((owner, idx) => (
                    <option key={idx} value={idx}>
                      {owner.fullName} {owner.officialRole ? `(${owner.officialRole})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={signatoryForm.fullName}
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
                  value={signatoryForm.officialRole}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 appearance-none bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Select role...</option>
                  <option value="CEO">Chief Executive Officer (CEO)</option>
                  <option value="CFO">Chief Financial Officer (CFO)</option>
                  <option value="Director">Director</option>
                  <option value="Authorized Representative">
                    Authorized Representative
                  </option>
                  <option value="Partner">Partner</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
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
                  value={signatoryForm.country}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 appearance-none bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
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
                value={signatoryForm.dob}
                onChange={handleInputChange}
                placeholder="mm/dd/yyyy"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Identification Number */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Identification Number
              </label>
              <input
                type="text"
                name="idNumber"
                value={signatoryForm.idNumber}
                onChange={handleInputChange}
                placeholder="SSN, TIN, or Passport"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              Add Signatory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}