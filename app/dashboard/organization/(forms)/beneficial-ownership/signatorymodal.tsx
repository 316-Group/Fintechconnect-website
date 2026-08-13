"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X, UserCheck, UserPlus, Check } from "lucide-react";
import { OwnerFormData } from "./beneficiarymodal";

export interface SignatoryFormData {
  fullName: string;
  email: string;
  officialRole: string;
  signingAuthority: "Sole" | "Joint" | "Specific" | string;
  transactionLimit: string;
  country: string;
  dob: string;
  idNumber: string;
}

interface SignatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSignatory: (signatoryData: SignatoryFormData) => void;
  existingOwners?: OwnerFormData[];
  initialData?: SignatoryFormData | null; // Added prop for editing
}

const INITIAL_SIGNATORY_FORM: SignatoryFormData = {
  fullName: "",
  email: "",
  officialRole: "",
  signingAuthority: "Sole",
  transactionLimit: "",
  country: "",
  dob: "",
  idNumber: "",
};

export default function SignatoryModal({
  isOpen,
  onClose,
  onAddSignatory,
  existingOwners = [],
  initialData,
}: SignatoryModalProps) {
  const [signatoryForm, setSignatoryForm] =
    useState<SignatoryFormData>(INITIAL_SIGNATORY_FORM);
  const [selectedOwnerIndex, setSelectedOwnerIndex] = useState<string>("");

  // Sync state whenever the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSignatoryForm({
          fullName: initialData.fullName || "",
          email: initialData.email || "",
          officialRole: initialData.officialRole || "",
          signingAuthority: initialData.signingAuthority || "Sole",
          transactionLimit: initialData.transactionLimit || "",
          country: initialData.country || "",
          dob: initialData.dob || "",
          idNumber: initialData.idNumber || "",
        });
        setSelectedOwnerIndex("");
      } else {
        setSignatoryForm(INITIAL_SIGNATORY_FORM);
        setSelectedOwnerIndex("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignatoryForm((prev) => ({ ...prev, [name]: value }));
    // Clear dropdown selection if user manually edits fields
    if (selectedOwnerIndex !== "") {
      setSelectedOwnerIndex("");
    }
  };

  const handleSelectOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.value;
    setSelectedOwnerIndex(index);

    if (index === "") {
      setSignatoryForm(INITIAL_SIGNATORY_FORM);
      return;
    }

    const selectedOwner = existingOwners[parseInt(index, 10)] as
      | (OwnerFormData & Partial<Pick<SignatoryFormData, "email">>)
      | undefined;

    if (selectedOwner) {
      setSignatoryForm({
        fullName: selectedOwner.fullName || "",
        email: selectedOwner.email || "",
        officialRole: selectedOwner.officialRole || "",
        signingAuthority: "Sole",
        transactionLimit: "",
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
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Authorized Signatory" : "Add Authorized Signatory"}
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
          {/* Select from Existing Owners Dropdown (Only show when adding new) */}
          {!initialData && existingOwners.length > 0 && (
            <>
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
                        {owner.fullName}{" "}
                        {owner.officialRole ? `(${owner.officialRole})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Visual "OR" Separator */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">
                  OR ENTER NEW DETAILS
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </>
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

            {/* Professional Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Professional Email
              </label>
              <input
                type="email"
                name="email"
                value={signatoryForm.email}
                onChange={handleInputChange}
                placeholder="jane.doe@company.com"
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
            <div className="space-y-1.5">
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

            {/* Signing Authority */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">
                Signing Authority
              </label>
              <div className="bg-[#EEF2FF]/60 p-1 rounded-xl flex gap-1 border border-slate-200/50">
                {["Sole", "Joint", "Specific"].map((authority) => {
                  const isActive = signatoryForm.signingAuthority === authority;
                  return (
                    <button
                      key={authority}
                      type="button"
                      onClick={() =>
                        setSignatoryForm((prev) => ({
                          ...prev,
                          signingAuthority: authority,
                        }))
                      }
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {authority}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Transaction Limit (Optional) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Individual Transaction Limit{" "}
                <span className="font-normal text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">
                  $
                </span>
                <input
                  type="text"
                  name="transactionLimit"
                  value={signatoryForm.transactionLimit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Set an optional limit for this signatory's independent authorization.
              </p>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              {initialData ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Add Signatory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}