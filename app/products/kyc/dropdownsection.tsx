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
    id: 'define-programme-question',
    stepNumber: '01',
    title: 'Define the programme question',
    profileSubtitle: 'Identify the onboarding, verification, or review challenge.',
    overview:
      'Establish clear compliance targets, jurisdiction-specific regulatory requirements, and risk appetite parameters across individual (KYC) and entity (KYB) onboarding flows.',
    capabilities: [
      {
        title: 'Jurisdictional Rule Mapping',
        description:
          'Align identity verification requirements with local Anti-Money Laundering (AML) and Counter-Financing of Terrorism (CFT) mandates.',
      },
      {
        title: 'Entity & Individual Profiling',
        description:
          'Differentiate friction levels and document collection rules for low-risk consumers vs. high-risk corporate entities.',
      },
      {
        title: 'Target Failure Modes',
        description:
          'Identify drop-off points, false-positive screening thresholds, and manual review bottlenecks in legacy verification paths.',
      },
    ],
    tags: ['Regulatory Scoping', 'Jurisdiction Rules', 'Risk Appetite', 'KYC/KYB Requirements'],
  },
  {
    id: 'map-workflow-responsibilities',
    stepNumber: '02',
    title: 'Map workflow responsibilities',
    profileSubtitle: 'Establish who owns evidence, exceptions, and decisions.',
    overview:
      'Define clear boundary lines between automated algorithmic checks, vendor data sources, internal compliance caseworkers, and executive decision-makers.',
    capabilities: [
      {
        title: 'Automated vs. Manual Gates',
        description:
          'Configure automated pass/fail criteria while defining explicit escalation routes for edge cases and potential matches.',
      },
      {
        title: 'Evidence Ownership & Audit',
        description:
          'Assign ownership for source document retention, PEP/sanctions alert adjudication, and UBO verification logs.',
      },
      {
        title: 'Role-Based Casework Routing',
        description:
          'Route complex corporate ownership structures (KYB) and high-risk alerts directly to specialized compliance analysts.',
      },
    ],
    tags: ['Casework Ownership', 'Escalation Paths', 'Role-Based Access', 'Audit Evidence'],
  },
  {
    id: 'review-intended-contracts',
    stepNumber: '03',
    title: 'Review intended contracts',
    profileSubtitle: 'Examine required inputs, outputs, and state changes.',
    overview:
      'Audit data models, API payloads, webhooks, and state machine transitions to ensure seamless integration into core onboarding and banking backends.',
    capabilities: [
      {
        title: 'Data Ingestion Schemas',
        description:
          'Validate structured payloads for individual PII, corporate registry metadata, ultimate beneficial owner (UBO) trees, and proof of address.',
      },
      {
        title: 'Deterministic State Transitions',
        description:
          'Ensure unambiguous workflow state updates (Pending, Approved, Escalated, Rejected) across integrated microservices.',
      },
      {
        title: 'Webhook & Event Subscriptions',
        description:
          'Receive real-time notifications for screening updates, document re-submissions, and periodic KYC refresh triggers.',
      },
    ],
    tags: ['Schema Validation', 'State Machine', 'Webhooks', 'API Payload Contract'],
  },
  {
    id: 'validate-controlled-scenario',
    stepNumber: '04',
    title: 'Validate a controlled scenario',
    profileSubtitle: 'Evaluate a representative journey within approved scope.',
    overview:
      'Run end-to-end test cases in a sandbox environment using synthetic identity datasets and edge-case corporate documentation before production deployment.',
    capabilities: [
      {
        title: 'Synthetic Identity Testing',
        description:
          'Simulate pass, fail, document fraud, and sanctions match scenarios across diverse international jurisdictions.',
      },
      {
        title: 'UBO Tree Unwrapping Simulation',
        description:
          'Test multi-tiered corporate ownership verification and automated registry lookup routines against complex entity structures.',
      },
      {
        title: 'Performance & SLA Metrics',
        description:
          'Benchmark verification latency, false-positive rates, and caseworker decision speed under representative traffic loads.',
      },
    ],
    tags: ['Sandbox Validation', 'UBO Unwrapping', 'False-Positive Tuning', 'SLA Benchmarking'],
  },
];

export default function DropdownSection() {
  const [openProfileId, setOpenProfileId] = useState<string | null>('define-programme-question');

  const toggleProfile = (id: string) => {
    setOpenProfileId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-[#F3F4FD] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            PLAN YOUR EVALUATION PATH
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            A clear route from discovery to a scoped test.
          </h2>
        </div>

        {/* ACCORDION DROPDOWN LIST */}
        <div className="space-y-4">
          {operatingProfiles.map((profile) => {
            const isOpen = openProfileId === profile.id;

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