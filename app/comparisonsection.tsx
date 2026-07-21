"use client";

import React, { useState } from "react";

type CategoryKey = "neobank" | "card-programme" | "crypto-wallet" | "psp-platform" | "remittance";

interface MetricData {
  cost: string;
  costSub: string;
  time: string;
  timeSub: string;
  team: string;
  teamSub: string;
  compliance: string;
  complianceSub: string;
}

interface ChartData {
  fcTime: string;
  fcPercent: number; // Percentage width for progress bar
  baasTime: string;
  baasPercent: number;
  inHouseTime: string;
  inHousePercent: number;
}

interface CategoryContent {
  label: string;
  inHouse: MetricData;
  fintechConnect: MetricData;
  chart: ChartData;
}

const comparisonData: Record<CategoryKey, CategoryContent> = {
  neobank: {
    label: "Neobank",
    inHouse: {
      cost: "$500K – $1.5M",
      costSub: "Core banking, KYC, cards, wallets, compliance",
      time: "6 – 18 months",
      timeSub: "From kick-off to first customer",
      team: "5 – 10 engineers",
      teamSub: "Backend, security, compliance, DevOps, mobile",
      compliance: "12+ months",
      complianceSub: "EMI/banking licence, PCI-DSS, AML, GDPR",
    },
    fintechConnect: {
      cost: "Less than $50,000",
      costSub: "Core banking, KYC, cards, wallets, compliance",
      time: "6 – 12 weeks",
      timeSub: "From kick-off to first customer",
      team: "2 – 3 engineers",
      teamSub: "Backend, security, compliance, DevOps, mobile",
      compliance: "Included",
      complianceSub: "EMI/banking licence, PCI-DSS, AML, GDPR",
    },
    chart: {
      fcTime: "6 - 8 weeks",
      fcPercent: 20,
      baasTime: "6 - 12 months",
      baasPercent: 65,
      inHouseTime: "12 - 30 months",
      inHousePercent: 100,
    },
  },
  "card-programme": {
    label: "Card Programme",
    inHouse: {
      cost: "$350K – $900K",
      costSub: "Card issuer processor setup, BIN sponsorship, KYC",
      time: "6 – 12 months",
      timeSub: "From kick-off to first card print",
      team: "4 – 8 engineers",
      teamSub: "Payment specs, HSM keys, core integrations",
      compliance: "9 – 12 months",
      complianceSub: "PCI-DSS Level 1, tokenization compliance",
    },
    fintechConnect: {
      cost: "Less than $30,000",
      costSub: "Card issuer processor setup, BIN sponsorship, KYC",
      time: "4 – 6 weeks",
      timeSub: "From kick-off to first card print",
      team: "1 – 2 engineers",
      teamSub: "Payment specs, HSM keys, core integrations",
      compliance: "Included",
      complianceSub: "PCI-DSS Level 1, tokenization compliance",
    },
    chart: {
      fcTime: "4 - 6 weeks",
      fcPercent: 15,
      baasTime: "5 - 8 months",
      baasPercent: 55,
      inHouseTime: "9 - 18 months",
      inHousePercent: 90,
    },
  },
  "crypto-wallet": {
    label: "Crypto Wallet",
    inHouse: {
      cost: "$400K – $1.2M",
      costSub: "MPC key custody, node infra, liquidity rails",
      time: "8 – 14 months",
      timeSub: "From kick-off to active transactions",
      team: "6 – 10 engineers",
      teamSub: "Blockchain protocols, smart contracts, security",
      compliance: "10 – 15 months",
      complianceSub: "VASP licensing, Travel Rule, AML screening",
    },
    fintechConnect: {
      cost: "Less than $40,000",
      costSub: "MPC key custody, node infra, liquidity rails",
      time: "4 – 8 weeks",
      timeSub: "From kick-off to active transactions",
      team: "2 engineers",
      teamSub: "Blockchain protocols, smart contracts, security",
      compliance: "Included",
      complianceSub: "VASP licensing, Travel Rule, AML screening",
    },
    chart: {
      fcTime: "4 - 8 weeks",
      fcPercent: 18,
      baasTime: "6 - 10 months",
      baasPercent: 60,
      inHouseTime: "10 - 24 months",
      inHousePercent: 95,
    },
  },
  "psp-platform": {
    label: "PSP Platform",
    inHouse: {
      cost: "$600K – $2.0M",
      costSub: "Payment gateway, merchant acquiring, 3DS, ledger",
      time: "9 – 18 months",
      timeSub: "From kick-off to first processing client",
      team: "8 – 12 engineers",
      teamSub: "Gateway engine, risk engines, ISO 8583 specs",
      compliance: "12 – 18 months",
      complianceSub: "Acquiring rules, PCI-DSS, local clearing locks",
    },
    fintechConnect: {
      cost: "Less than $60,000",
      costSub: "Payment gateway, merchant acquiring, 3DS, ledger",
      time: "6 – 10 weeks",
      timeSub: "From kick-off to first processing client",
      team: "2 – 4 engineers",
      teamSub: "Gateway engine, risk engines, ISO 8583 specs",
      compliance: "Included",
      complianceSub: "Acquiring rules, PCI-DSS, local clearing locks",
    },
    chart: {
      fcTime: "6 - 10 weeks",
      fcPercent: 22,
      baasTime: "8 - 14 months",
      baasPercent: 70,
      inHouseTime: "14 - 36 months",
      inHousePercent: 100,
    },
  },
  remittance: {
    label: "Remittance",
    inHouse: {
      cost: "$300K – $1.0M",
      costSub: "FX engine, global pay-in/pay-out clearing rails",
      time: "6 – 15 months",
      timeSub: "From kick-off to cross-border transfer",
      team: "5 – 8 engineers",
      teamSub: "FX integrations, ledger reconciliation, mobile",
      compliance: "12+ months",
      complianceSub: "MSB licenses, Sanctions, AML/CFT screening",
    },
    fintechConnect: {
      cost: "Less than $35,000",
      costSub: "FX engine, global pay-in/pay-out clearing rails",
      time: "4 – 8 weeks",
      timeSub: "From kick-off to cross-border transfer",
      team: "1 – 3 engineers",
      teamSub: "FX integrations, ledger reconciliation, mobile",
      compliance: "Included",
      complianceSub: "MSB licenses, Sanctions, AML/CFT screening",
    },
    chart: {
      fcTime: "4 - 8 weeks",
      fcPercent: 18,
      baasTime: "5 - 10 months",
      baasPercent: 55,
      inHouseTime: "10 - 24 months",
      inHousePercent: 90,
    },
  },
};

const categoryKeys: { key: CategoryKey; label: string }[] = [
  { key: "neobank", label: "Neobank" },
  { key: "card-programme", label: "Card Programme" },
  { key: "crypto-wallet", label: "Crypto Wallet" },
  { key: "psp-platform", label: "PSP Platform" },
  { key: "remittance", label: "Remittance" },
];

export default function ComparisonSection() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("neobank");

  const currentData = comparisonData[activeTab];

  return (
    <section className="bg-white text-slate-900 py-10 md:py-24 px-6 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-full mx-auto">
        
        {/* HEADER SECTION */}
        <div className="md:text-center max-w-6xl mx-auto mb-10">
          <p className="text-sm font-semibold text-slate-600 mb-2 tracking-wide">
            Save time &amp; money
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
            Why spend months building <><br /></> what you can launch{" "}
            <span className="text-blue-600">in 6 weeks?</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal max-w-6xl mx-auto">
            Every month you spend building from scratch is a month your competitors are already live. Fintech
            Connect ships with pre-built connectors to the world's leading banking, payments, compliance,
            and crypto infrastructure providers at in record time and at unbeatable prices
          </p>
        </div>

        {/* INTERACTIVE CATEGORY TABS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 md:mb-16">
          {categoryKeys.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                    : "bg-slate-200/80 hover:bg-slate-300/80 text-slate-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 3 COMPARISON CARDS CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:px-12 gap-6 lg:gap-0 items-center max-w-full mx-auto">
          
          {/* CARD 1: BUILDING IN-HOUSE */}
          <div className="bg-white lg:rounded-r-none border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between h-full">
            {/* Header Banner */}
            <div className="bg-[#A6FFFA] px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900 font-bold text-lg">
                Building In-House
              </h3>
            </div>
            
            {/* Body Specs */}
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Estimated Cost
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {currentData.inHouse.cost}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  {currentData.inHouse.costSub}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Time to Market
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {currentData.inHouse.time}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  {currentData.inHouse.timeSub}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Engineering Team Required
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {currentData.inHouse.team}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  {currentData.inHouse.teamSub}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Compliance Setup
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {currentData.inHouse.compliance}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  {currentData.inHouse.complianceSub}
                </p>
              </div>
            </div>
          </div>

          {/* CARD 2: BUILDING WITH FINTECH CONNECT (ELEVATED HERO CARD) */}
          <div className="bg-[#0052FF] text-white shadow-2xl z-10 lg:-my-4 overflow-hidden flex flex-col justify-between">
            {/* Header Banner */}
            <div className="bg-[#93C5FD] px-6 py-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-slate-900 font-extrabold text-lg tracking-tight">
                  Building with Fintech Connect
                </span>
              </div>
            </div>

            {/* Body Specs */}
            <div className="p-6 md:p-8 md:py-20 flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                  Estimated Cost
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {currentData.fintechConnect.cost}
                </p>
                <p className="text-xs text-blue-200 mt-1 font-normal">
                  {currentData.fintechConnect.costSub}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                  Time to Market
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {currentData.fintechConnect.time}
                </p>
                <p className="text-xs text-blue-200 mt-1 font-normal">
                  {currentData.fintechConnect.timeSub}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                  Engineering Team Required
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {currentData.fintechConnect.team}
                </p>
                <p className="text-xs text-blue-200 mt-1 font-normal">
                  {currentData.fintechConnect.teamSub}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                  Compliance Setup
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {currentData.fintechConnect.compliance}
                </p>
                <p className="text-xs text-blue-200 mt-1 font-normal">
                  {currentData.fintechConnect.complianceSub}
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: TIME TO MARKET COMPARISON */}
          <div className="bg-white lg:rounded-l-none border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between h-full">
            {/* Header Banner */}
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-blue-600 font-bold text-lg">
                Time to Market Comparison
              </h3>
            </div>

            {/* Body with Chart Progress Bars */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow gap-8">
              <div className="space-y-6 my-auto">
                {/* Fintech Connect Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Fintech Connect</span>
                    <span className="font-bold">{currentData.chart.fcTime}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00E599] h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${currentData.chart.fcPercent}%` }}
                    />
                  </div>
                </div>

                {/* Industry Average - BaaS Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Industry Average - BaaS</span>
                    <span className="font-bold">{currentData.chart.baasTime}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-700 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${currentData.chart.baasPercent}%` }}
                    />
                  </div>
                </div>

                {/* Building in house Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Building in house</span>
                    <span className="font-bold">{currentData.chart.inHouseTime}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-100 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${currentData.chart.inHousePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Call To Action Button */}
              <button className="w-full bg-[#00E599] hover:bg-[#00cc88] text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer shadow-sm active:scale-98">
                Speak to our team
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}