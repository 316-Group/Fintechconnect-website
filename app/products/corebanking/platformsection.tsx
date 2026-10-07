'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Phone, 
  BarChart3, 
  Grid, 
  ArrowRight 
} from 'lucide-react';

interface LeftCapability {
  id: string;
  title: string;
  description: string;
}

interface RightFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const leftCapabilities: LeftCapability[] = [
  {
    id: 'account-config',
    title: 'Account product configuration',
    description: 'Shape account types and customer journeys around the commercial proposition you are building.',
  },
  {
    id: 'connected-ledger',
    title: 'Connected ledger & workflow',
    description: 'Give payment, card and wallet actions a common account foundation rather than separate product silos.',
  },
  {
    id: 'realtime-balance',
    title: 'Real-time balance visibility',
    description: 'Support clear available and pending balance states across the customer and operational experience.',
  },
  {
    id: 'developer-apis',
    title: 'Developer core banking APIs',
    description: 'Connect accounts, balances and transactions to your product through a documented API rather than a vendor integration project.',
  },
];

const rightFeatures: RightFeature[] = [
  {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: 'Fintech Connect Live Desk',
    description: 'Personalize high-value client interactions with dedicated multi-currency virtual accounts and automated statements.',
  },
  {
    icon: <Phone className="w-5 h-5 text-blue-600" />,
    title: 'Instant Corporate vIBANs',
    description: 'Issue unique localized corporate numbers and virtual accounts for all client payments across 70+ jurisdictions.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
    title: 'Automated Ledger Controls',
    description: 'Eliminate manual reconciliation with sub-millisecond double-entry ledger tracking and real-time balance reservations.',
  },
  {
    icon: <Grid className="w-5 h-5 text-blue-600" />,
    title: 'Modular App & API Marketplace',
    description: 'Secure client records and enable automated compliance with pre-built KYC, AML, and ERP integrations.',
  },
];

export default function PlatformSection() {
  const [activeTab, setActiveTab] = useState<string>('account-config');

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-20 text-slate-900 font-sans">
      <div className="max-w-full mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 max-w-4xl">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-[1.15] mb-4">
            Your financial platform for{' '}
            <span className="text-blue-600">
              innovative client services &amp; streamlined operations
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl">
            Deliver institutional-grade financial workflows through a unified, modular banking experience engineered for enterprise treasury and fintech operators.
          </p>
        </div>

        {/* Main Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Feature Selector Column + Bottom Consultation Info */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="flex flex-col space-y-3.5">
              {leftCapabilities.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-200 border cursor-pointer relative ${
                      isActive
                        ? 'bg-[#0042cc] text-white border-transparent shadow-md'
                        : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold text-base sm:text-lg pr-4 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </h3>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-300 shrink-0 mt-2" />
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Bottom Left Consultations Info (Remains on the bottom left) */}
            <div className="pt-2 flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span>
                Architect consultations scheduled within 24 business hours • ISO 20022 &amp; SOC2 Type II Certified
              </span>
            </div>
          </div>

          {/* Right Main Showcase Container (Stretches to enclose button & stretched image) */}
          <div className="lg:col-span-8 bg-[#f5f8ff] rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-100/80 flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch h-full">
            
            {/* Image Section (Stretches full height down to the bottom edge alongside the button) */}
            <div className="w-full lg:w-1/2 min-h-[340px] sm:min-h-[420px] lg:min-h-full h-full relative rounded-2xl overflow-hidden shadow-sm shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Fintech team collaborating around a laptop"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Content List Section & Embedded Bottom CTA Button */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-2 space-y-6">
              <div className="space-y-6">
                <h3 className="text-slate-900 font-bold text-base sm:text-lg leading-snug">
                  Empower your service teams and institutional clients with synchronized multi-currency ledgers, instant corporate accounts, and automated operations.
                </h3>

                <div className="space-y-5">
                  {rightFeatures.map((feat, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/70 flex items-center justify-center shrink-0 mt-0.5">
                        {feat.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-blue-600 mb-0.5">
                          {feat.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button placed inside the right container */}
              <div className="pt-4 border-t border-blue-100/60">
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#0042cc] hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition-colors shadow-sm shrink-0 cursor-pointer">
                  <span>Discuss your account architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}