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
                Capabilities
              </span>
              <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem]">
                Architected for high-concurrency scale and absolute correctness.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                Everything required to deploy a modern, regulated digital financial institution
                without maintaining fragmented legacy core vendors.
              </p>
            </div>

          </div>

          {/* Capability tab pills */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {CAPABILITY_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-[11px] font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Hero preview image */}
          <div>
            

            {/*
              REPLACE BELOW with your imported asset, e.g.:
              <img src={platformPreview} alt="Global treasury control preview" className="aspect-[21/10] w-full rounded-2xl object-cover" />
            */}
            <img 
                src={getPath('/products/desktopplatform.png')}
                alt="Global treasury control preview"
                className=" w-full rounded-2xl object-cover mt-10"
                onError={(e) => {
                  // Fallback visual indicator until the image asset is imported
                  e.currentTarget.style.display = "none";
                }}
            />
          
        
          </div>

          {/* Caption block (updates with the active tab) */}
          <div className="mt-8 border-t border-slate-200/80 pt-6">
            <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">{active.title}</h3>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-500 sm:text-[13px]">
              {active.description}
            </p>
    
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  SECTION 2 — NATIVE FEEL                                           */}
      {/* ================================================================== */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-20">
        <div className="mx-auto max-w-full space-y-12">
          {/* Centered header */}
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
              Native Feel
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Familiar on both platforms.
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Each platform keeps its own navigation, shadows and gestures, so the app feels
              natural to the people using it.
            </p>
          </div>

          {/* Two platform cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {PLATFORM_CARDS.map((card) => (
              <div key={card.id} className="flex flex-col rounded-3xl bg-[#ECEFFC] p-6 sm:p-8">
                {/* Card label */}
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                  <span className="text-xs font-extrabold text-slate-800">{card.label}</span>
                </div>

                {/* Phone image */}
                <div className="flex flex-1 items-center justify-center py-8">
                  {/*
                    REPLACE BELOW with your imported asset, e.g.:
                    <img src={iosPhone} alt="iOS architecture preview" className="aspect-[9/19] w-[220px] rounded-[2.25rem] object-cover" />
                  */}
                  <img
                    src={getPath(`/products/iosimage.png`)}
                    alt={`ios architecture preview`}
                    className="aspect-[9/19] w-[220px] rounded-[2.25rem] object-cover"
                  />
                </div>

                {/* Feature bullets */}
                <ul className="space-y-2.5">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}