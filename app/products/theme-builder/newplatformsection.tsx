'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleDot, Plus } from 'lucide-react';
import { getPath } from '@/utils/helper';

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

interface CapabilityTab {
  id: string;
  label: string;
  title: string;
  description: string;
}

const CAPABILITY_TABS: CapabilityTab[] = [
  {
    id: 'accounts',
    label: 'Accounts & vIBANs',
    title: 'Multi-Currency Accounts & vIBANs',
    description:
      'Instant virtual account issuance across 40+ currencies with deterministic ledger positioning and local collection routing in EUR, GBP, USD, and SGD.',
  },
  {
    id: 'cards',
    label: 'Card Issuing',
    title: 'Programmable Card Issuing',
    description:
      'Launch virtual and physical cards in minutes with real-time spending controls, wallet tokenisation and per-transaction authorization rules.',
  },
  {
    id: 'fx',
    label: 'FX & Settlement',
    title: 'FX & Settlement Engine',
    description:
      'Interbank-grade currency conversion with same-day settlement and smart routing across local and cross-border payment rails.',
  },
  {
    id: 'ledger',
    label: 'Flexible Entry Ledger',
    title: 'Flexible Entry Ledger',
    description:
      'A double-entry accounting core with immutable audit trails, custom posting logic and real-time balance projection at any point in time.',
  },
  {
    id: 'compliance',
    label: 'Compliance & KYC',
    title: 'Compliance & KYC Orchestration',
    description:
      'Automated onboarding, screening and transaction monitoring workflows tuned for regulated markets and multi-jurisdiction coverage.',
  },
  {
    id: 'treasury',
    label: 'Treasury & Float',
    title: 'Treasury & Float Management',
    description:
      'Centralised liquidity oversight with automated sweeping, allocation policies and forward-looking float forecasting tools.',
  },
];

interface PlatformCard {
  id: 'ios' | 'android';
  label: string;
  bullets: string[];
}

const PLATFORM_CARDS: PlatformCard[] = [
  {
    id: 'ios',
    label: 'iOS Architecture',
    bullets: [
      'Large title collapsible iOS navigation headers',
      'Interactive swipe-back edge gesture recognition',
      'Modal presentation sheets with top-tab drag-to-dismiss gesture',
    ],
  },
  {
    id: 'android',
    label: 'Android Architecture',
    bullets: [
      'Material 3 top app bar and dynamic elevation shells',
      'Predictive system back gesture integration',
      'Material design navigation rail and bottom bar layouts',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Image placeholder — swap for <img /> once assets are imported             */
/* -------------------------------------------------------------------------- */

function ImagePlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300/80 bg-slate-100/70 ${className}`}
    >
      <span className="px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function NewPlatformSection() {
  const [activeTab, setActiveTab] = useState<string>(CAPABILITY_TABS[0].id);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');

  const active = CAPABILITY_TABS.find((t) => t.id === activeTab) ?? CAPABILITY_TABS[0];

  return (
    <div className="w-full font-sans text-slate-900">
      {/* ================================================================== */}
      {/*  SECTION 1 — CAPABILITIES                                          */}
      {/* ================================================================== */}
      <section className="bg-[#FAFBFF] px-4 pb-20 pt-16 sm:px-6 lg:px-20">
        <div className="mx-auto max-w-full">
          {/* Header row: copy left, mini controls right */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">
                <span className="h-1.5 w-1.5 rotate-45 bg-blue-600" aria-hidden />
                AUDIT MATRIX
              </span>
              <h2 className="text-7xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem]">
                Preview Before Review.
              </h2>
              <p className="max-w-full text-lg leading-relaxed text-slate-500">
                Designed to verify rendering consistency across form factors prior to governance review.
              </p>
            </div>

          </div>

          

          {/* Hero preview image */}
          <div>
            

            {/*
              REPLACE BELOW with your imported asset, e.g.:
              <img src={platformPreview} alt="Global treasury control preview" className="aspect-[21/10] w-full rounded-2xl object-cover" />
            */}
            <img 
                src={getPath('/products/previewimage.png')}
                alt="Global treasury control preview"
                className=" w-full rounded-2xl object-cover mt-10"
                onError={(e) => {
                  // Fallback visual indicator until the image asset is imported
                  e.currentTarget.style.display = "none";
                }}
            />
          
        
          </div>

          
        </div>
      </section>

      
    </div>
  );
}