'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  Cpu,
  Landmark,
  Globe,
  Wallet,
  ShoppingCart,
} from 'lucide-react';

interface OperatingProfile {
  id: string;
  stepNumber: string;
  icon: React.ElementType;
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
    id: 'institutional-crypto-brokers',
    stepNumber: '01',
    icon: Landmark,
    title: 'Institutional Crypto Platforms & Brokers',
    profileSubtitle: 'Profile: High-Throughput Custody & Prime Brokerage',
    overview:
      'Engineered for prime brokers, OTC desks, and institutional exchanges seeking programmable custody, automated MPC wallet provisioning, and low-latency execution pipelines.',
    capabilities: [
      {
        title: 'MPC & Warm Vault Architecture',
        description:
          'Provision isolated threshold signature wallet pools with programmatic key-share distribution across cold, warm, and hot nodes.',
      },
      {
        title: 'Pre-Trade Risk & Credit Locks',
        description:
          'Enforce real-time credit limit checks, collateral ratios, and position exposure bounds prior to executing network transfers.',
      },
      {
        title: 'Automated OTC Settlement',
        description:
          'Settle high-value bilateral trades off-chain or via atomic cross-chain swaps with guaranteed finality and zero settlement slippage.',
      },
    ],
    tags: [
      'MPC Key Management',
      'OTC Settlement',
      'Pre-Trade Risk',
      'Prime Brokerage',
    ],
  },
  {
    id: 'cross-border-b2b-remitters',
    stepNumber: '02',
    icon: Globe,
    title: 'Cross-Border Settlement & B2B Remitters',
    profileSubtitle: 'Profile: Stablecoin Liquidity & Multi-Corridor Clearing',
    overview:
      'Streamline cross-border treasury movements and international corporate payouts using fiat-backed stablecoins, automated local rail off-ramps, and guaranteed FX conversion rates.',
    capabilities: [
      {
        title: 'Stablecoin On/Off Ramp Engine',
        description:
          'Automate conversion between fiat local banking rails (ACH, SEPA, FedNow) and USD/EUR stablecoin liquidity pools.',
      },
      {
        title: 'Dynamic FX & Spread Locking',
        description:
          'Lock in real-time FX exchange rates upon payout initiation to eliminate market volatility exposure across corridors.',
      },
      {
        title: 'Automated Travel Rule Delivery',
        description:
          'Programmatically attach required originator and beneficiary metadata packets directly to cross-border transfer payloads.',
      },
    ],
    tags: [
      'Stablecoin Clearing',
      'Travel-Rule Compliance',
      'Instant On/Off Ramp',
      'FX Spread Lock',
    ],
  },
  {
    id: 'web3-treasuries-neobanks',
    stepNumber: '03',
    icon: Wallet,
    title: 'Web3 Treasuries & Neobanks',
    profileSubtitle: 'Profile: Multi-Asset Treasury Management & Yield Routing',
    overview:
      'Provide Web3 organizations and digital-native neobanks with unified multi-chain asset governance, automated payroll distribution, and sub-ledger accounting controls.',
    capabilities: [
      {
        title: 'Multi-Chain Sub-Ledgering',
        description:
          'Partition native crypto and tokenized balances into segmented operational, reserve, and tax sub-ledgers across 20+ chains.',
      },
      {
        title: 'Programmatic Yield & Sweeps',
        description:
          'Configure automated sweep rules to route idle liquidity into audited, low-risk institutional yield protocols.',
      },
      {
        title: 'Multi-Sig Governance & Roles',
        description:
          'Enforce role-based access control (RBAC), approval hierarchies, and multi-signature requirements for high-value disbursements.',
      },
    ],
    tags: [
      'Multi-Chain Sub-Ledgers',
      'Treasury Sweeps',
      'RBAC & Multi-Sig',
      'Automated Payroll',
    ],
  },
  {
    id: 'merchant-gateways-enterprise-payments',
    stepNumber: '04',
    icon: ShoppingCart,
    title: 'Merchant Gateways & Enterprise Payments',
    profileSubtitle: 'Profile: Merchant Checkout & Automated Fiat Settlement',
    overview:
      'Enable global merchants and e-commerce platforms to accept multi-chain crypto payments with instant fiat conversion, dynamic invoice generation, and chargeback-free processing.',
    capabilities: [
      {
        title: 'Dynamic QR & Invoice Engine',
        description:
          'Generate localized, real-time crypto payment invoices with exact token amount calculations and countdown timers.',
      },
      {
        title: 'Instant Fiat Auto-Conversion',
        description:
          'Eliminate crypto volatility risk by instantly converting incoming token payments into USD/EUR bank deposits upon block confirmation.',
      },
      {
        title: 'Merchant Escrow & Split Fees',
        description:
          'Programmatically deduct platform take-rates and hold merchant funds in escrow pending fulfillment verification.',
      },
    ],
    tags: [
      'Instant Fiat Settlement',
      'Merchant Checkout',
      'Split Fee Engine',
      'Chargeback Prevention',
    ],
  },
];

export default function DropdownSection() {
  const [openProfileId, setOpenProfileId] = useState<string | null>(
    'institutional-crypto-brokers'
  );

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
              Built for institutions with bespoke custody frameworks.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Fintech Connect adapts to your existing risk infrastructure, proprietary signers, and regulatory compliance perimeters.
          </p>
        </div>

        {/* ACCORDION DROPDOWN LIST */}
        <div className="space-y-4">
          {operatingProfiles.map((profile) => {
            const isOpen = openProfileId === profile.id;
            const IconComponent = profile.icon;

            return (
              <div
                key={profile.id}
                className="bg-white rounded-2xl border border-slate-100/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* ACCORDION HEADER BUTTON */}
                <button
                  type="button"
                  onClick={() => toggleProfile(profile.id)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* ICON BADGE */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center font-bold text-blue-600 shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
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

                    {/* Key Feature Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
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