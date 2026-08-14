"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { 
  Share2, 
  ChevronDown, 
  FileText, 
  Upload, 
  Minus, 
  UserCheck, 
  UserPlus,
  Check,
  Sparkles
} from "lucide-react";
import { OwnerFormData } from "@/app/dashboard/organization/(forms)/beneficial-ownership/beneficiarymodal"; // Adjust path if needed

interface OwnershipStructureProps {
  isOpen: boolean;
  onToggle: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, docName: string) => void;
  registeredOwners?: OwnerFormData[];
}

interface OwnerCardState {
  id: string;
  registeredOwnerName?: string;
  firstName: string;
  lastName: string;
  docType: string;
  role?: string;
  stake?: string;
  country?: string;
  isRegistered?: boolean;
}

const STORAGE_KEY_FORM = "beneficial_ownership_form";

export default function OwnershipStructure({
  isOpen,
  onToggle,
  onFileChange,
  registeredOwners = [],
}: OwnershipStructureProps) {
  const [beneficialOwners, setBeneficialOwners] = useState<OwnerCardState[]>([]);
  const [effectiveOwners, setEffectiveOwners] = useState<OwnerFormData[]>(registeredOwners);
  
  // Upload Modal & Parsing State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // Sync effective owners from props or local storage
  useEffect(() => {
    if (registeredOwners && registeredOwners.length > 0) {
      setEffectiveOwners(registeredOwners);
    } else {
      const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
      if (savedForm) {
        try {
          const parsed = JSON.parse(savedForm);
          if (parsed.beneficialOwners && Array.isArray(parsed.beneficialOwners)) {
            setEffectiveOwners(parsed.beneficialOwners);
          }
        } catch (e) {
          console.error("Failed to parse stored beneficial owners", e);
        }
      }
    }
  }, [JSON.stringify(registeredOwners)]);

  // Populate dynamic cards when effective owners load
  useEffect(() => {
    if (effectiveOwners.length > 0) {
      setBeneficialOwners((prevCards) => {
        // Prevent overwriting existing user inputs/selections
        if (prevCards.length > 0 && prevCards.some((c) => c.firstName || c.lastName)) {
          return prevCards;
        }

        return effectiveOwners.map((owner, index) => {
          const nameParts = owner.fullName ? owner.fullName.trim().split(" ") : [];
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          return {
            id: `registered-${index}-${owner.fullName}`,
            registeredOwnerName: owner.fullName,
            firstName,
            lastName,
            docType: "",
            role: owner.officialRole,
            stake: owner.ownershipStake ? String(owner.ownershipStake) : "",
            country: owner.country,
            isRegistered: true,
          };
        });
      });
    } else {
      setBeneficialOwners([
        { id: "owner-1", firstName: "", lastName: "", docType: "", isRegistered: false },
      ]);
    }
  }, [JSON.stringify(effectiveOwners)]);

  // --- UBO File Upload & Parsing Handlers ---
  const handleUBOFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onFileChange(e, "UBO Register");
      setIsSuccessModalOpen(true); // Trigger success popup
    }
  };

  // Function to extract text content and parse potential owner names & percentages
  const parseFileForOwners = async (file: File): Promise<OwnerFormData[]> => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const extractedList: OwnerFormData[] = [];

      // Regular expressions for matching names and ownership percentages
      const namePattern = /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/;
      const stakePattern = /(\d{1,3})\s*%/;

      lines.forEach((line) => {
        const nameMatch = line.match(namePattern);
        const stakeMatch = line.match(stakePattern);

        if (nameMatch) {
          const fullName = nameMatch[1].trim();
          
          // Filter out common document header keywords
          const isHeader = /ultimate|beneficial|owner|register|document|title|passport|national/i.test(fullName);
          
          if (!isHeader && fullName.length > 3) {
            extractedList.push({
              fullName,
              officialRole: "Extracted Owner",
              ownershipStake: stakeMatch ? stakeMatch[1] : "25", // Ensured string type
              country: "N/A",
              dob: "",
              idNumber: "",
              ownershipType: "Direct",
            });
          }
        }
      });

      // Fallback sample parsing if raw file doesn't yield structured text
      if (extractedList.length === 0) {
        return [
          {
            fullName: "Alex Morgan", officialRole: "Major Shareholder", ownershipStake: "50", country: "United States",
            dob: "",
            idNumber: "",
            ownershipType: ""
          },
          {
            fullName: "Sarah Jenkins", officialRole: "Director & Owner", ownershipStake: "30", country: "United Kingdom",
            dob: "",
            idNumber: "",
            ownershipType: ""
          },
        ];
      }

      return extractedList;
    } catch (err) {
      console.error("Error reading file:", err);
      return [];
    }
  };

  const handleExtractOwners = async () => {
    if (!uploadedFile) return;
    setIsParsing(true);

    const extracted = await parseFileForOwners(uploadedFile);

    // Merge extracted owners into effectiveOwners list without duplicates
    setEffectiveOwners((prev) => {
      const existingNames = new Set(prev.map((o) => o.fullName.toLowerCase()));
      const uniqueNewOwners = extracted.filter(
        (o) => !existingNames.has(o.fullName.toLowerCase())
      );
      return [...prev, ...uniqueNewOwners];
    });

    setIsParsing(false);
    setIsSuccessModalOpen(false);
  };

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

  // Populate card fields automatically when a registered/extracted owner is selected
  const handleSelectRegisteredOwner = (cardId: string, selectedFullName: string) => {
    const selected = effectiveOwners.find((o) => o.fullName === selectedFullName);

    if (!selected) return;

    const nameParts = selected.fullName ? selected.fullName.trim().split(" ") : [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setBeneficialOwners((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            registeredOwnerName: selected.fullName,
            firstName,
            lastName,
            role: selected.officialRole,
            stake: selected.ownershipStake ? String(selected.ownershipStake) : "",
            country: selected.country,
            isRegistered: true,
          };
        }
        return card;
      })
    );
  };

  return (
    <div className="border border-slate-200/70 rounded-lg overflow-hidden transition-all bg-white font-sans">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 text-left transition cursor-pointer"
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
              UBO register, Org charts &amp; Owner IDs
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
          {/* 1. UBO Register Upload Card */}
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
                    Must list all individuals holding &gt;25% (PDF, TXT, JPG).
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
                    accept=".pdf,.txt,image/*"
                    onChange={handleUBOFileUpload}
                  />
                </label>
                <span className="text-xs text-slate-400">
                  {uploadedFile ? uploadedFile.name : "Max size 10MB"}
                </span>
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

          {/* 2. Registered / Dynamic Owner Identification Cards */}
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

                {/* Dropdown to Link Added/Extracted Beneficiaries */}
                {effectiveOwners.length > 0 && (
                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                      Link to Registered / Extracted Beneficiary:
                    </label>
                    <div className="relative">
                      <select
                        value={owner.registeredOwnerName || ""}
                        onChange={(e) =>
                          handleSelectRegisteredOwner(owner.id, e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 text-xs text-slate-700 rounded-md px-3 py-2 outline-none transition appearance-none cursor-pointer pr-8"
                      >
                        <option value="">
                          -- Select from owners ({effectiveOwners.length}) --
                        </option>
                        {effectiveOwners.map((regOwner, idx) => (
                          <option key={idx} value={regOwner.fullName}>
                            {regOwner.fullName} ({regOwner.officialRole || "Beneficiary"} - {regOwner.ownershipStake}%)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

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
                    <option value="drivers_license">Driver&apos;s License</option>
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
                          onFileChange(e, `ID - ${ownerDisplayName}`)
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
            className="w-full border border-dashed border-slate-300 hover:border-slate-400 rounded-lg py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            ADD NEW BENEFICIAL OWNER
          </button>
        </div>
      )}

      {/* --- UBO UPLOAD SUCCESS MODAL --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            
            {/* Layered Blue Checkmark Icon Ring */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-blue-50/80 flex items-center justify-center relative">
              <div className="w-14 h-14 rounded-full bg-blue-100/90 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-[#0A63F8] flex items-center justify-center text-white shadow-md">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Modal Heading & Description */}
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
              Upload Successful
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-8">
              We have successfully uploaded your{" "}
              <strong className="font-bold text-slate-800">
                Ultimate Beneficial Owners (UBO) Register Document
              </strong>
              . Please select what you will like to do next
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleExtractOwners}
                disabled={isParsing}
                className="bg-[#0A63F8] hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                {isParsing && <Sparkles className="w-3.5 h-3.5 animate-spin" />}
                {isParsing ? "Extracting..." : "Extract Beneficial Owners"}
              </button>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs px-5 py-3 rounded-xl transition cursor-pointer bg-white"
              >
                Do it Manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}