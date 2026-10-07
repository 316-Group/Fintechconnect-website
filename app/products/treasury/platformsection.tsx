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
    id: 'position-view',
    title: 'Position view configuration',
    description: 'Define views by programme, account context, source, as-of time, and review purpose. Make assumptions visible so teams can understand what a position represents before acting on it.',
  },
  {
    id: 'settlement-context',
    title: 'Settlement and exception context',
    description: 'Relate expected settlements, external references, timing differences, and follow-up work in a structured operating view designed for investigation and ownership.',
  },
  {
    id: 'threshold-escalation',
    title: 'Threshold and escalation design',
    description: 'Configure conditions that surface liquidity questions to the appropriate roles, with ownership, evidence, and change control considered as part of the programme design.',
  },
];

const rightFeatures: RightFeature[] = [
  {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: 'Forecast assumptions',
    description: 'Record planned inflows, outflows, timing, and scenario assumptions with an explicit context for comparison and review.',
  },
  {
    icon: <Phone className="w-5 h-5 text-blue-600" />,
    title: 'Reconciliation Handoff',
    description: 'Relate treasury questions to reconciliation differences and evidence so exceptions can be assessed through an agreed ownership path.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
    title: 'Funding Work Items',
    description: 'Frame funding requests as controlled workflow items with relevant references, assigned roles, and programme-specific approval expectations.',
  },
  {
    icon: <Grid className="w-5 h-5 text-blue-600" />,
    title: 'Reporting Context',
    description: 'Prepare finance and operations views with clear source, period, scope, and configuration context for accountable discussion.',
  },
];

export default function PlatformSection() {
  const [activeTab, setActiveTab] = useState<string>('position-view');

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-20 text-slate-900 font-sans">
      <div className="max-w-full mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 max-w-4xl">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-[1.15] mb-4">
            A treasury foundation for{' '}
            <span className="text-blue-600">
              clearer financial operations
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl">
            Treasury Management is designed to connect the questions finance and operations teams ask with the records, workflows, and context needed to answer them. Use the module to frame position views, settlement oversight, liquidity review, forecasts, and reporting as related operating capabilities.
          </p>
        </div>

        {/* Main Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Feature Selector Column */}
          <div className="lg:col-span-4 flex flex-col space-y-3.5 justify-start">
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

          {/* Right Main Showcase Container */}
          <div className="lg:col-span-8 bg-[#f5f8ff] rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-100/80 flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
            
            {/* Image Section */}
            <div className="w-full lg:w-1/2 h-[320px] sm:h-[420px] lg:h-full min-h-[380px] relative rounded-2xl overflow-hidden shadow-sm shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Treasury management team collaborating around desktop screens"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Content List Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-2 space-y-6">
              <h3 className="text-slate-900 font-bold text-base sm:text-lg leading-snug">
                Build a treasury operating design that keeps financial context, human review, and connected dependencies in view.
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

          </div>

        </div>

        {/* Bottom Banner & CTA */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            <span>
              Designed to be scoped with your ledger, reconciliation, operational, and connector decisions.
            </span>
          </div>

          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0042cc] hover:bg-blue-700 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors shadow-sm shrink-0">
            <span>Discuss your treasury management product</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}