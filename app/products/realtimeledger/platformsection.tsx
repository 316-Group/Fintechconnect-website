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
    id: 'journal-design',
    title: 'Journal Design and Posting Rules',
    description: 'Create a legible framework for ledger accounts, journals and posting logic.',
  },
  {
    id: 'pending-reserved',
    title: 'Pending and Reserved States',
    description: 'Show how a programme may separate available, pending, held and booked value.',
  },
  {
    id: 'corrections-new-entries',
    title: 'Corrections Through New Entries',
    description: 'Present a history-preserving approach to change.',
  },
];

const rightFeatures: RightFeature[] = [
  {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: 'Idempotent Intent',
    description: 'Use a stable request reference to design for safe retries. The final contract should define how repeated instructions are recognized and how a programme investigates an unexpected duplicate.',
  },
  {
    icon: <Phone className="w-5 h-5 text-blue-600" />,
    title: 'Correlated records',
    description: 'Relate client, platform, provider and ledger references across an event lifecycle. This supports an explainable investigation path without assuming which external systems or connectors a programme will use.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
    title: 'Reconciliation Context',
    description: 'Retain the record context needed to compare internal entries with external activity. Matching rules, tolerances, settlement treatment and break handling remain choices for the programme and its responsible teams.',
  },
  {
    icon: <Grid className="w-5 h-5 text-blue-600" />,
    title: 'Controlled Adjustments',
    description: 'Design sensitive adjustments with defined roles, reason capture and review points. The appropriate control pattern depends on transaction risk, accounting policy, delegated authority and the programme responsibility map.',
  },
];

export default function PlatformSection() {
  const [activeTab, setActiveTab] = useState<string>('journal-design');

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-20 text-slate-900 font-sans">
      <div className="max-w-full mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 max-w-4xl">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4">
            Your ledger foundation for{' '}
            <span className="text-blue-600">
              explainable financial products and controlled operations.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl">
            Real-Time Ledger is designed to give a programme one coherent way to model financial events, their state and their record of change. Use it to connect product intent with a proposed journal structure, maintain traceable references across a workflow, and prepare records for review.
          </p>
        </div>

        {/* Main Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Feature Selector Column */}
          <div className="lg:col-span-4 flex flex-col space-y-4 relative z-20">
            {leftCapabilities.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-200 border cursor-pointer relative ${
                    isActive
                      ? 'bg-[#003bd1] text-white border-transparent shadow-xl lg:-mr-12 xl:-mr-16 z-30'
                      : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 z-10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold text-base sm:text-lg pr-4 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-blue-400/60 shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Main Showcase Container */}
          <div className="lg:col-span-8 bg-[#f5f8ff] rounded-[32px] p-4 sm:p-6 lg:p-8 border border-slate-100/80 flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch relative z-0">
            
            {/* Image Section */}
            <div className="w-full lg:w-1/2 h-[340px] sm:h-[420px] lg:h-auto min-h-[380px] relative rounded-2xl overflow-hidden shadow-sm shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Ledger product interaction and dashboard view"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Content List Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-2 space-y-6">
              <h3 className="text-slate-900 font-bold text-base sm:text-lg leading-snug">
                Designed for teams that need to discuss product behaviour, finance treatment and operating evidence from the same underlying model.
              </h3>

              <div className="space-y-6">
                {rightFeatures.map((feat, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100/70 flex items-center justify-center shrink-0 mt-0.5">
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-blue-600 mb-1">
                        {feat.title}
                      </h4>
                      <p className="text-xs sm:text-xs text-slate-600 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Banner & CTA */}
        <div className="mt-12 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <span>
              Product configuration, finance review and operating controls should be designed together.
            </span>
          </div>

          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003bd1] hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition-colors shadow-sm shrink-0">
            <span>Discuss your ledger foundation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}