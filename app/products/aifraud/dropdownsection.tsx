'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, Cpu } from 'lucide-react';

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
    id: 'corporate-expense-fleet',
    stepNumber: '01',
    title: 'Corporate Expense & Fleet Operators',
    profileSubtitle: 'Profile: Dynamic Fleet & Employee Spend Management',
    overview:
      'Automate enterprise procurement and employee travel expense management with instant virtual card creation, automated receipt matching, and strict merchant category locks.',
    capabilities: [
      {
        title: 'Merchant Category (MCC) Locking',
        description: 'Restrict card usage strictly to fuel stations, airlines, hotel chains, or pre-approved SaaS suppliers.',
      },
      {
        title: 'Automated Spend Thresholds',
        description: 'Set daily, weekly, or per-transaction spending caps with real-time approval workflow triggers.',
      },
      {
        title: 'Real-time ERP & Accounting Sync',
        description: 'Automatically stream transaction receipts and line-item categorization directly to your ERP or accounting ledger.',
      },
    ],
    tags: ['MCC Locking', 'Fleet Controls', 'ERP Sync', 'Real-time Approvals'],
  },
  {
    id: 'neobanks-consumer-wallets',
    stepNumber: '02',
    title: 'Fintech Neobanks & Consumer Wallets',
    profileSubtitle: 'Profile: Physical & Virtual Debit/Credit Programme',
    overview:
      'Issue white-labeled physical and Apple/Google Pay virtual cards directly to consumer wallets with customizable cashback tiers, push provisioning, and instant freeze controls.',
    capabilities: [
      {
        title: 'Instant Push Provisioning',
        description: 'Allow users to add newly issued virtual cards directly to Apple Wallet or Google Pay within seconds.',
      },
      {
        title: 'Customizable Rewards Engine',
        description: 'Configure real-time cashback, merchant discounts, and loyalty point accruals per customer account tier.',
      },
      {
        title: 'Interactive Card Controls',
        description: 'Enable instant card freezing, PIN resets, online purchase toggles, and international usage restrictions.',
      },
    ],
    tags: ['Apple/Google Pay', 'Push Provisioning', 'Rewards Engine', 'Card Freeze Controls'],
  },
  {
    id: 'marketplaces-contractor-payouts',
    stepNumber: '03',
    title: 'Marketplaces & Contractor Payouts',
    profileSubtitle: 'Profile: Gig-Economy & Vendor Disbursement Cards',
    overview:
      'Streamline gig-worker disbursements, seller payouts, and contractor fee management with instant payout cards tied directly to marketplace balance sub-ledgers.',
    capabilities: [
      {
        title: 'Instant On-Demand Payouts',
        description: 'Disburse gig earnings or seller funds directly onto dedicated payout cards immediately upon task completion.',
      },
      {
        title: 'Sub-Ledger Earnings Isolation',
        description: 'Separate gross earnings, marketplace take-rates, and tax reserves into distinct balance partitions.',
      },
      {
        title: 'Global Contractor Multi-Currency',
        description: 'Issue localized virtual card accounts to international contractors across 60+ currencies.',
      },
    ],
    tags: ['Instant Payouts', 'Gig Economy', 'Tax Sub-Ledgers', 'Multi-Currency'],
  },
  {
    id: 'embedded-vertical-saas',
    stepNumber: '04',
    title: 'Embedded & Vertical SaaS Platforms',
    profileSubtitle: 'Profile: White-Label Native Financial Workflows',
    overview:
      'Embed card issuance directly into industry-specific software (healthcare, construction, logistics) to monetize software usage through interchange revenue sharing models.',
    capabilities: [
      {
        title: 'Interchange Revenue Sharing',
        description: 'Monetize platform transaction volume through programmatic interchange revenue split structures.',
      },
      {
        title: 'White-Label UI Components',
        description: 'Integrate fully customizable, PCI-compliant card management components directly into your web app.',
      },
      {
        title: 'Contextual Single-Use Virtual Cards',
        description: 'Generate ephemeral single-use virtual cards automatically when purchase orders or invoices are approved.',
      },
    ],
    tags: ['Embedded Finance', 'Interchange Revenue', 'PCI-Compliant SDK', 'Single-Use Virtual Cards'],
  },
];

export default function DropdownSection() {
  const [openProfileId, setOpenProfileId] = useState<string | null>('corporate-expense-fleet');

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
              Configured for diverse issuance models.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-sm font-normal">
            Explore architectural configurations tailored to specific corporate, retail, and embedded platform programmes.
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
                      <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
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
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                      {profile.overview}
                    </p>

                    {/* Capabilities Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.capabilities.map((cap, idx) => (
                        <div
                          key={idx}
                          className="bg-[#f8fafe] p-5 rounded-xl border border-blue-50/80 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                {cap.title}
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                              {cap.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feature Tags List */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" /> Programme Features:
                      </span>
                      {profile.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-blue-700 bg-blue-50/80 border border-blue-100/80 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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