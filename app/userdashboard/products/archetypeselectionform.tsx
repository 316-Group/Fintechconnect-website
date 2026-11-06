"use client";

import React, { useState } from "react";
import {
  Building2,
  Smartphone,
  Wallet,
  ArrowLeftRight,
  Percent,
  CreditCard,
  Lock,
  LineChart,
  LayoutGrid,
  Info,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

type Archetype = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  isCustom?: boolean;
};

export const archetypes: Archetype[] = [
  {
    id: "digital-banking",
    title: "Digital Banking",
    description: "Launch a complete digital banking experience with deposit accounts, routing, and overdraft controls.",
    icon: Building2,
    tags: ["Accounts", "KYC", "Ledger"],
  },
  {
    id: "neobank",
    title: "Neobank",
    description: "Build a modern banking platform with flexible financial services, instant P2P, and sub-accounts.",
    icon: Smartphone,
    tags: ["Multi-Currency", "P2P", "Cards"],
  },
  {
    id: "digital-wallet",
    title: "Digital Wallet",
    description: "Enable customers to store, manage, and transfer funds with multi-asset stored value.",
    icon: Wallet,
    tags: ["Stored-Value", "FX Pots", "QR"],
  },
  {
    id: "psp",
    title: "Payment Service Provider (PSP)",
    description: "Build payment infrastructure for businesses and merchants with dynamic orchestration.",
    icon: ArrowLeftRight,
    tags: ["Acquiring", "Payouts", "Routing"],
  },
  {
    id: "lending",
    title: "Lending Platform",
    description: "Create digital lending and credit management products with automated underwriting.",
    icon: Percent,
    tags: ["Underwriting", "Origination", "Servicing"],
  },
  {
    id: "card-issuing",
    title: "Card Issuing",
    description: "Issue and manage virtual and physical payment cards with real-time auth stream webhooks.",
    icon: CreditCard,
    tags: ["BIN Sponsorship", "Virtual/Physical", "3DS2"],
  },
  {
    id: "crypto-banking",
    title: "Crypto Banking",
    description: "Build financial experiences that support digital assets with institutional MPC custody.",
    icon: Lock,
    tags: ["MPC Custody", "Fiat On/Off Ramp"],
  },
  {
    id: "crypto-exchange",
    title: "Crypto Exchange",
    description: "Create digital asset trading infrastructure with low-latency order matching engine.",
    icon: LineChart,
    tags: ["Orderbook", "Liquidity Router"],
  },
  {
    id: "custom",
    title: "Custom Financial Platform",
    description: "Define a product that does not fit the standard categories using modular primitives.",
    icon: LayoutGrid,
    tags: ["Unconstrained Ledger Architecture"],
    isCustom: true,
  },
];

export default function ArchetypeSelectionForm({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (selectedId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
            Overview
          </span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Project Details</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">What are you building?</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Choose the type of financial product you want to launch. We'll recommend the infrastructure and capabilities you'll need.
            </p>
          </div>
          
          <div className="flex items-start gap-3 bg-blue-50/80 border border-blue-100 p-3 rounded-lg max-w-sm shrink-0">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 leading-relaxed">
              Pre-selected based on your institutional onboarding profile. You can't change this selection as it defines the platform you're building.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {archetypes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedId === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`relative flex flex-col text-left p-5 rounded-xl transition-all duration-200 group ${
                isSelected
                  ? "bg-blue-50/50 border-2 border-blue-500"
                  : item.isCustom
                  ? "bg-white border-2 border-dashed border-slate-300 hover:border-slate-400"
                  : "bg-white border border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 animate-in zoom-in duration-200">
                  <Check className="w-3 h-3" /> Selected
                </div>
              )}

              {/* Icon Box */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-blue-200 text-slate-900 group-hover:bg-blue-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Text Content */}
              <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                      isSelected
                        ? "bg-blue-100/60 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedId && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Selected: {archetypes.find((a) => a.id === selectedId)?.title} • 4 Core Modules Pre-loaded
            </div>
          )}
          
          <button
            onClick={() => onContinue(selectedId as string)}
            disabled={!selectedId}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 ${
              selectedId
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Continue to Project Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}