"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Share2, ChevronDown, FileText, Upload, Minus, UserCheck } from "lucide-react";
import { OwnerFormData } from "@/app/dashboard/organization/(forms)/beneficial-ownership/beneficiarymodal"; // Adjust import path if needed

interface OwnershipStructureProps {
  isOpen: boolean;
  onToggle: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, docName: string) => void;
  registeredOwners?: OwnerFormData[];
}

interface OwnerCardState {
  id: string;
  firstName: string;
  lastName: string;
  docType: string;
  role?: string;
  stake?: string;
  country?: string;
  isRegistered?: boolean;
}

export default function OwnershipStructure({
  isOpen,
  onToggle,
  onFileChange,
  registeredOwners = [],
}: OwnershipStructureProps) {
  const [beneficialOwners, setBeneficialOwners] = useState<OwnerCardState[]>([]);

  // Serialize registeredOwners to break array reference loops
  const serializedOwners = JSON.stringify(registeredOwners);

  useEffect(() => {
    if (registeredOwners && registeredOwners.length > 0) {
      const initialCards: OwnerCardState[] = registeredOwners.map((owner, index) => {
        const nameParts = owner.fullName ? owner.fullName.trim().split(" ") : [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
          id: `registered-${index}`,
          firstName,
          lastName,
          docType: "",
          role: owner.officialRole,
          stake: owner.ownershipStake,
          country: owner.country,
          isRegistered: true,
        };
      });
      setBeneficialOwners(initialCards);
    } else {
      setBeneficialOwners([
        { id: "owner-1", firstName: "", lastName: "", docType: "", isRegistered: false },
      ]);
    }
  }, [serializedOwners]); // <-- Primitive string dependency prevents infinite re-render loops

  const handleAddBeneficialOwner = () => {
    setBeneficialOwners((prev) => [
      ...prev,
      {
        id: `owner-${Date.now()}`,
        firstName: "",
        lastName: "",
        docType: "",
        isRegistered: false,
      },
    ]);
  };

  const handleRemoveBeneficialOwner = (id: string) => {
    setBeneficialOwners((prev) => prev.filter((owner) => owner.id !== id));
  };

  const handleOwnerInputChange = (
    id: string,
    field: keyof OwnerCardState,
    value: string
  ) => {
    setBeneficialOwners((prev) =>
      prev.map((owner) => (owner.id === id ? { ...owner, [field]: value } : owner))
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
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Ownership Structure
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              UBO register, Org charts
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
          {/* 1. UBO Register Card */}
          <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/20 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Ultimate Beneficial Owners (UBO) Register
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Must list all individuals holding &gt;25% (PDF, JPG).
                  </p>
                </div>
              </div>
              <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase pt-0.5">
                REQUIRED
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={(e) => onFileChange(e, "UBO Register")}
                  />
                </label>
                <span className="text-xs text-slate-400">Max size 10MB</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                Provide later
              </label>
            </div>
          </div>

          {/* Registered / Dynamic Owner Identification Cards */}
          {beneficialOwners.map((owner) => {
            const ownerDisplayName =
              owner.firstName || owner.lastName
                ? `${owner.firstName} ${owner.lastName}`.trim()
                : "Beneficial Owner";

            return (
              <div
                key={owner.id}
                className="group relative border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/20 space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      {owner.isRegistered ? (
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800">
                          {owner.isRegistered
                            ? `${ownerDisplayName} Identification`
                            : "Owner Identification"}
                        </h4>
                        {owner.stake && (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                            {owner.stake}% Stake
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {owner.role ? `${owner.role} • ` : ""}
                        Valid Passport or National ID (PDF, JPG).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase pt-0.5">
                      REQUIRED
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBeneficialOwner(owner.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 rounded cursor-pointer"
                      title="Remove Beneficial Owner"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* First & Last Name Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={owner.firstName}
                    onChange={(e) =>
                      handleOwnerInputChange(owner.id, "firstName", e.target.value)
                    }
                    className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 rounded-md px-3 py-2.5 outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={owner.lastName}
                    onChange={(e) =>
                      handleOwnerInputChange(owner.id, "lastName", e.target.value)
                    }
                    className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 rounded-md px-3 py-2.5 outline-none transition"
                  />
                </div>

                {/* Document Type Dropdown */}
                <div className="relative">
                  <select
                    value={owner.docType}
                    onChange={(e) =>
                      handleOwnerInputChange(owner.id, "docType", e.target.value)
                    }
                    className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-600 rounded-md px-3 py-2.5 outline-none transition appearance-none cursor-pointer pr-8"
                  >
                    <option value="" disabled hidden>
                      Select document type
                    </option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* File Upload Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) =>
                          onFileChange(
                            e,
                            `ID - ${ownerDisplayName}`
                          )
                        }
                      />
                    </label>
                    <span className="text-xs text-slate-400">Max size 10MB</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    Provide later
                  </label>
                </div>
              </div>
            );
          })}

          {/* Add New Beneficial Owner Button */}
          <button
            type="button"
            onClick={handleAddBeneficialOwner}
            className="w-full border border-dashed border-slate-300 hover:border-slate-400 rounded-lg py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition uppercase tracking-wide cursor-pointer"
          >
            ADD NEW BENEFICIAL OWNER
          </button>
        </div>
      )}
    </div>
  );
}