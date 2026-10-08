'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, ArrowUpRight, Cpu } from 'lucide-react';

interface OperatingProfile {
  id: string;
  stepNumber: string;
  title: string;
  profileSubtitle: string;
  overview: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  tags: string[];
}

const operatingProfiles: OperatingProfile[] = [
  {
    id: 'scaleups-neobanks',
    stepNumber: '01',
    title: 'Fintech Scaleups & Neobanks',
    profileSubtitle: 'Profile: Consumer & Business Account Virtualization',
    overview:
      'Engineered for rapid consumer and corporate onboarding with modular vIBAN issuance, automated sub-ledger partitioning, and flexible spend controls.',
    capabilities: [
      {
        title: 'Virtual Account Engine',
        description: 'Instantly spin up multi-currency vIBANs with sub-second ledger synchronization.',
      },
      {
        title: 'Programmable Sub-Ledgers',
        description: 'Partition funds into distinct available, pending hold, and vault balance buckets.',
      },
      {
        title: 'Custom Cards & Velocity Rules',
        description: 'Embed virtual and physical card issuance with real-time auth hook controls.',
      },
    ],
    tags: ['API Onboarding', 'vIBAN Issuance', 'Real-Time Balances', 'Spend Controls'],
  },
  {
    id: 'marketplaces-platforms',
    stepNumber: '02',
    title: 'Marketplaces & Platforms',
    profileSubtitle: 'Profile: Split Settlements & Seller Payout Routines',
    overview:
      'Automate complex multi-party money flows, platform fee deductions, seller escrow holds, and scheduled disbursement runs across global corridors.',
    capabilities: [
      {
        title: 'Automated Split Settlements',
        description: 'Programmatically split payment volume between platform take-rate and merchant accounts.',
      },
      {
        title: 'Merchant Escrow & Holds',
        description: 'Hold funds dynamically based on order delivery triggers or compliance conditions.',
      },
      {
        title: 'Corridor Mass Payouts',
        description: 'Trigger low-cost domestic rail payouts across 70+ countries using idempotent APIs.',
      },
    ],
    tags: ['Split Payments', 'Escrow Mechanics', 'Batch Payouts', 'Automated Fee Deduction'],
  },
  {
    id: 'banks-depositories',
    stepNumber: '03',
    title: 'Commercial Banks & Depository Institutions',
    profileSubtitle: 'Profile: Core Ledger Virtualization & Depository Sync',
    overview:
      'Modernize legacy core banking infrastructure without core replacement by introducing an agile, API-first middle layer for digital treasury client experiences.',
    capabilities: [
      {
        title: 'Core Ledger Shadowing',
        description: 'Maintain real-time shadow sub-ledgers without placing load on legacy mainframes.',
      },
      {
        title: 'ISO 20022 Data Enrichment',
        description: 'Enrich transaction messages with native ISO 20022 structured remittance metadata.',
      },
      {
        title: 'Enterprise Liquidity Portal',
        description: 'Provide institutional clients with real-time multi-account visibility and automated sweeps.',
      },
    ],
    tags: ['ISO 20022 Native', 'Core Shadowing', 'Enterprise Treasury', 'Audit Logs'],
  },
  {
    id: 'crossborder-operators',
    stepNumber: '04',
    title: 'Embedded & Cross-Border Operators',
    profileSubtitle: 'Profile: Multi-Corridor Float & Currency Pools',
    overview:
      'Optimize international liquidity and FX margins across multi-currency float pools with automated rate locking, internal clearing, and local domestic rails.',
    capabilities: [
      {
        title: 'Multi-Currency Float Pools',
        description: 'Unify multi-jurisdiction float into centralized real-time treasury balances.',
      },
      {
        title: 'Dynamic FX Rate Locking',
        description: 'Lock in real-time FX spreads automatically upon transaction initiation.',
      },
      {
        title: 'Local Rail Routing',
        description: 'Bypass costly SWIFT intermediary fees by routing through domestic ACH & SEPA rails.',
      },
    ],
    tags: ['Multi-Currency Float', 'Instant FX Locks', 'Local ACH / SEPA', 'Cross-Border Clearing'],
  },
];

export default function DropdownSection() {
  const [openProfileId, setOpenProfileId] = useState<string | null>('scaleups-neobanks');

  const toggleProfile = (id: string) => {
    setOpenProfileId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-[#F3F4FD] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              OPERATING FRAMEWORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Configured for diverse operating models.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-sm font-normal">
            Explore architectural configuration profiles tailored to specific entity topologies and transaction flows.
          </p>
        </div>

        {/* ACCORDION DROPDOWN LIST */}
        <div className="space-y-4">
          {operatingProfiles.map((profile) => {
            const isOpen = openProfileId === profile.id;

            return (
              <div
                key={profile.id}
                className="bg-white rounded-xl sm:rounded-xl border border-slate-100/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* ACCORDION HEADER BUTTON */}
                <button
                  type="button"
                  onClick={() => toggleProfile(profile.id)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* NUMBER BADGE */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center font-bold text-xs sm:text-sm text-blue-600 shrink-0">
                      {profile.stepNumber}
                    </div>

                    {/* TITLE & PROFILE SUBTITLE */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                        {profile.title}
                      </h3>
                      <p className="text-xs sm:text-lg text-slate-500 font-normal mt-0.5">
                        {profile.profileSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* CHEVRON ICON */}
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* EXPANDED CONTENT AREA */}
                {isOpen && (
                  <div className="px-6 pb-8 sm:px-8 sm:pb-8 pt-2 border-t border-slate-100/80 space-y-6">
                    {/* Overview Paragraph */}
                    <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                      {profile.overview}
                    </p>

                    {/* Capabilities Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.capabilities.map((cap, idx) => (
                        <div
                          key={idx}
                          className="bg-[#f8fafe] p-5 rounded-1xl border border-blue-50/80 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <h4 className="font-bold text-xs sm:text-lg text-slate-900">
                                {cap.title}
                              </h4>
                            </div>
                            <p className="text-lg text-slate-500 leading-relaxed font-normal">
                              {cap.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags Footer */}
                    {/*<div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" /> Key Features:
                      </span>
                      {profile.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-blue-700 bg-blue-50/80 border border-blue-100/80 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>*/}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}