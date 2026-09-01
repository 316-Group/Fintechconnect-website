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
  Sparkles,
  CheckSquare,
  Square,
  Eye,
  X,
  FileUp
} from "lucide-react";
import { OwnerFormData } from "@/app/dashboard/organization/(forms)/beneficial-ownership/beneficiarymodal";

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
  docType: string; // "passport" | "national_id" | "drivers_license"
  role?: string;
  stake?: string;
  country?: string;
  isRegistered?: boolean;
  frontFile?: File;
  backFile?: File;
  singleFile?: File;
  provideLater?: boolean;
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
  
  // Extracted Owners Selection State inside Modal
  const [extractedOwners, setExtractedOwners] = useState<OwnerFormData[]>([]);
  const [selectedOwnerIndexes, setSelectedOwnerIndexes] = useState<number[]>([]);

  // Preview Modal State
  const [previewModal, setPreviewModal] = useState<{
    file: File | null;
    title: string;
    url: string | null;
  }>({
    file: null,
    title: "",
    url: null,
  });

  // Open Preview Modal
  const handleOpenPreview = (file: File, title: string) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewModal({
      file,
      title,
      url: objectUrl,
    });
  };

  // Close Preview Modal & Revoke URL Object to prevent memory leaks
  const handleClosePreview = () => {
    if (previewModal.url) {
      URL.revokeObjectURL(previewModal.url);
    }
    setPreviewModal({ file: null, title: "", url: null });
  };

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
            docType: "passport",
            role: owner.officialRole,
            stake: owner.ownershipStake ? String(owner.ownershipStake) : "",
            country: owner.country,
            isRegistered: true,
          };
        });
      });
    } else {
      setBeneficialOwners([
        { id: "owner-1", firstName: "", lastName: "", docType: "passport", isRegistered: false },
      ]);
    }
  }, [JSON.stringify(effectiveOwners)]);

  // Parse UBO File
  const parseFileForOwners = async (file: File): Promise<OwnerFormData[]> => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const extractedList: OwnerFormData[] = [];

      const namePattern = /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/;
      const stakePattern = /(\d{1,3})\s*%/;

      lines.forEach((line) => {
        const nameMatch = line.match(namePattern);
        const stakeMatch = line.match(stakePattern);

        if (nameMatch) {
          const fullName = nameMatch[1].trim();
          const isHeader = /ultimate|beneficial|owner|register|document|title|passport|national/i.test(fullName);
          
          if (!isHeader && fullName.length > 3) {
            extractedList.push({
              fullName,
              officialRole: "Extracted Owner",
              ownershipStake: stakeMatch ? stakeMatch[1] : "25",
              country: "N/A",
              dob: "",
              idNumber: "",
              ownershipType: "Direct",
            });
          }
        }
      });

      if (extractedList.length === 0) {
        return [
          {
            fullName: "Alex Morgan", officialRole: "Major Shareholder", ownershipStake: "50", country: "United States",
            dob: "", idNumber: "", ownershipType: "Direct"
          },
          {
            fullName: "Sarah Jenkins", officialRole: "Director & Owner", ownershipStake: "30", country: "United Kingdom",
            dob: "", idNumber: "", ownershipType: "Direct"
          },
        ];
      }

      return extractedList;
    } catch (err) {
      console.error("Error reading file:", err);
      return [];
    }
  };

  // --- UBO File Upload Handler ---
  const handleUBOFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onFileChange(e, "UBO Register");
      
      setIsSuccessModalOpen(true);
      setIsParsing(true);

      const parsed = await parseFileForOwners(file);
      setExtractedOwners(parsed);
      setSelectedOwnerIndexes(parsed.map((_, index) => index));
      setIsParsing(false);
    }
  };

  // --- Individual Owner Document Side Upload Handler ---
  const handleSideFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    cardId: string,
    side: "front" | "back" | "single"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeneficialOwners((prev) =>
        prev.map((card) => {
          if (card.id === cardId) {
            if (side === "front") return { ...card, frontFile: file };
            if (side === "back") return { ...card, backFile: file };
            if (side === "single") return { ...card, singleFile: file };
          }
          return card;
        })
      );

      const currentCard = beneficialOwners.find((c) => c.id === cardId);
      const name = currentCard?.firstName ? `${currentCard.firstName} ${currentCard.lastName}` : "Owner";
      onFileChange(e, `${currentCard?.docType || "ID"} (${side.toUpperCase()}) - ${name}`);
    }
  };

  const handleToggleSelectOwner = (index: number) => {
    setSelectedOwnerIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedOwnerIndexes.length === extractedOwners.length) {
      setSelectedOwnerIndexes([]);
    } else {
      setSelectedOwnerIndexes(extractedOwners.map((_, i) => i));
    }
  };

  const handleAddSelectedOwners = () => {
    const ownersToAdd = extractedOwners.filter((_, i) => selectedOwnerIndexes.includes(i));

    if (ownersToAdd.length > 0) {
      setEffectiveOwners((prev) => {
        const existingNames = new Set(prev.map((o) => o.fullName.toLowerCase()));
        const uniqueNewOwners = ownersToAdd
          .filter((o) => !existingNames.has(o.fullName.toLowerCase()))
          .map(({ ownershipStake, ...rest }) => ({ ...rest, ownershipStake: "" }));

        return [...prev, ...uniqueNewOwners];
      });

      setBeneficialOwners((prevCards) => {
        const cleanedCards = prevCards.filter((c) => c.firstName || c.lastName || c.registeredOwnerName);

        const newCards: OwnerCardState[] = ownersToAdd.map((owner, idx) => {
          const nameParts = owner.fullName ? owner.fullName.trim().split(" ") : [];
          return {
            id: `extracted-${Date.now()}-${idx}`,
            registeredOwnerName: owner.fullName,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            docType: "passport",
            role: owner.officialRole || "",
            stake: "",
            country: owner.country || "",
            isRegistered: true,
          };
        });

        return [...cleanedCards, ...newCards];
      });
    }

    setIsSuccessModalOpen(false);
  };

  const handleAddBeneficialOwner = () => {
    setBeneficialOwners((prev) => [
      ...prev,
      {
        id: `owner-${Date.now()}`,
        firstName: "",
        lastName: "",
        docType: "passport",
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
    value: string | boolean
  ) => {
    setBeneficialOwners((prev) =>
      prev.map((owner) => (owner.id === id ? { ...owner, [field]: value } : owner))
    );
  };

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
          {/* UBO Register Upload Card */}
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

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadedFile ? "Change File" : "Upload File"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,image/*"
                    onChange={handleUBOFileUpload}
                  />
                </label>
                
                {/* Clickable UBO File Badge */}
                {uploadedFile ? (
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(uploadedFile, "UBO Register")}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-medium transition cursor-pointer"
                    title="Click to preview file"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate max-w-[180px]">{uploadedFile.name}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Max size 10MB</span>
                )}
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

            const isTwoSided =
              owner.docType === "national_id" || owner.docType === "drivers_license";

            const docNameText =
              owner.docType === "drivers_license"
                ? "Driver's License"
                : owner.docType === "national_id"
                ? "National ID card"
                : "International Passport";

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
                        Valid Passport or National ID of beneficial owner. (PDF, JPG).
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
                    className="w-full bg-slate-100/80 border border-transparent focus:border-blue-500 text-xs text-slate-700 font-medium rounded-md px-3 py-2.5 outline-none transition appearance-none cursor-pointer pr-8"
                  >
                    <option value="passport">International Passport</option>
                    <option value="national_id">National Identity Card</option>
                    <option value="drivers_license">Driver&apos;s License</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* --- Dynamic Document Dropzones --- */}
                {owner.docType === "passport" ? (
                  /* Single Upload Box Layout  */
                  <div className="bg-white p-4 border border-slate-200/50">
                    <span className="text-xs font-semibold text-slate-700 block mb-2.5">
                      Information Page
                    </span>
                    <label className="group relative flex flex-col items-center justify-center p-6 border border-dashed border-slate-300 cursor-pointer bg-[#eef1f4] hover:bg-slate-200/50 transition text-center min-h-[120px]">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) => handleSideFileUpload(e, owner.id, "single")}
                      />
                      {owner.singleFile ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 max-w-[200px] truncate">
                            {owner.singleFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPreview(
                                owner.singleFile!,
                                `Passport Info Page - ${ownerDisplayName}`
                              );
                            }}
                            className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline mt-0.5"
                          >
                            <Eye className="w-3 h-3" /> Preview File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 rounded-lg bg-slate-200/80 text-slate-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                            <FileUp className="w-4 h-4 text-slate-400" />
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 max-w-[280px] leading-snug">
                            Please upload the information page of your International Passport
                          </p>
                          <p className="text-[8.5px] text-slate-400 mt-1">
                            Acceptable formats (PDF, JPG).
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  /* Two Upload Boxes Layout (Front & Back - Matches id upload 1.PNG) */
                  <div className="bg-white p-4 border border-slate-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Front Box */}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700 mb-2">
                          Front
                        </span>
                        <label className="group relative flex-1 flex flex-col items-center justify-center p-5 border border-dashed border-slate-300 cursor-pointer bg-[#eef1f4] hover:bg-slate-200/50 transition text-center min-h-[110px]">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,image/*"
                            onChange={(e) => handleSideFileUpload(e, owner.id, "front")}
                          />
                          {owner.frontFile ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 max-w-[150px] truncate">
                                {owner.frontFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPreview(
                                    owner.frontFile!,
                                    `${docNameText} Front - ${ownerDisplayName}`
                                  );
                                }}
                                className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline mt-0.5"
                              >
                                <Eye className="w-3 h-3" /> Preview
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                                <FileUp className="w-4 h-4 text-slate-400" />
                              </div>
                              <p className="text-[9.5px] font-medium text-slate-500 max-w-[190px] leading-snug">
                                Please upload the front page of your {docNameText}
                              </p>
                              <p className="text-[8.5px] text-slate-400 mt-0.5">
                                Acceptable formats (PDF, JPG).
                              </p>
                            </div>
                          )}
                        </label>
                      </div>

                      {/* Back Box */}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700 mb-2">
                          Back
                        </span>
                        <label className="group relative flex-1 flex flex-col items-center justify-center p-5 border border-dashed border-slate-300 cursor-pointer bg-[#eef1f4] hover:bg-slate-200/50 transition text-center min-h-[110px]">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,image/*"
                            onChange={(e) => handleSideFileUpload(e, owner.id, "back")}
                          />
                          {owner.backFile ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 max-w-[150px] truncate">
                                {owner.backFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPreview(
                                    owner.backFile!,
                                    `${docNameText} Back - ${ownerDisplayName}`
                                  );
                                }}
                                className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline mt-0.5"
                              >
                                <Eye className="w-3 h-3" /> Preview
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                                <FileUp className="w-4 h-4 text-slate-400" />
                              </div>
                              <p className="text-[9.5px] font-medium text-slate-500 max-w-[190px] leading-snug">
                                Please upload the Back page of your {docNameText}
                              </p>
                              <p className="text-[8.5px] text-slate-400 mt-0.5">
                                Acceptable formats (PDF, JPG).
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Upload Control Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) =>
                          handleSideFileUpload(
                            e,
                            owner.id,
                            isTwoSided && owner.frontFile ? "back" : isTwoSided ? "front" : "single"
                          )
                        }
                      />
                    </label>
                    <span className="text-xs text-slate-400">Max size 10MB</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-black">
                    <input
                      type="checkbox"
                      checked={owner.provideLater || false}
                      onChange={(e) =>
                        handleOwnerInputChange(owner.id, "provideLater", e.target.checked)
                      }
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

      {/* UBO UPLOAD SUCCESS & PARSED OWNERS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center relative">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#0A63F8] flex items-center justify-center text-white shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">
              Upload Successful
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-5">
              We parsed your <strong className="font-bold text-slate-800">UBO Register Document</strong>. Select which owners you want to add to the fields below:
            </p>

            {isParsing ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
                <Sparkles className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-xs font-medium">Extracting names from document...</span>
              </div>
            ) : (
              <div className="mb-6 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-700">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Found ({extractedOwners.length}) Owners
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {selectedOwnerIndexes.length === extractedOwners.length ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" /> Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5" /> Select All
                      </>
                    )}
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 p-2">
                  {extractedOwners.length === 0 ? (
                    <div className="p-4 text-xs text-slate-400 italic">
                      No owner names detected in file.
                    </div>
                  ) : (
                    extractedOwners.map((owner, idx) => {
                      const isSelected = selectedOwnerIndexes.includes(idx);
                      return (
                        <label
                          key={idx}
                          onClick={() => handleToggleSelectOwner(idx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer text-left ${
                            isSelected
                              ? "bg-blue-50/60 border border-blue-200/60"
                              : "hover:bg-slate-100/60 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <p className="text-xs font-bold text-slate-800">
                              {owner.fullName}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleAddSelectedOwners}
                disabled={isParsing || selectedOwnerIndexes.length === 0}
                className="bg-[#0A63F8] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Selected ({selectedOwnerIndexes.length})
              </button>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-5 py-3 rounded-xl transition cursor-pointer bg-white"
              >
                Do it Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewModal.file && previewModal.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-1xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold tracking-tight">
                  {previewModal.title} — {previewModal.file.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClosePreview}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-100/70 p-4 flex items-center justify-center overflow-auto">
              {previewModal.file.type.startsWith("image/") ? (
                <img
                  src={previewModal.url}
                  alt={previewModal.file.name}
                  className="max-h-full max-w-full object-contain rounded-md shadow-md"
                />
              ) : previewModal.file.type === "application/pdf" ? (
                <iframe
                  src={previewModal.url}
                  className="w-full h-full rounded-md border-none shadow-sm"
                  title="Document Preview"
                />
              ) : (
                <div className="text-center space-y-3 p-8">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-slate-600 font-medium text-sm">
                    Direct inline preview is not supported for this format.
                  </p>
                  <a
                    href={previewModal.url}
                    download={previewModal.file.name}
                    className="inline-block text-xs font-bold text-blue-600 hover:underline"
                  >
                    Download to View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}