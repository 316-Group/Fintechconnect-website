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
    id: 'real-time-transaction-scoring',
    stepNumber: '01',
    title: 'Real-Time Transaction Risk Scoring',
    profileSubtitle: 'Profile: In-Flight Machine Learning Inference & Scoring',
    overview:
      'Evaluate authorization payloads instantly against advanced behavioral models, device fingerprinting, and network anomaly detection heuristics before funds leave the vault.',
    capabilities: [
      {
        title: 'Sub-Millisecond Model Inference',
        description: 'Execute deep neural networks and gradient boosting classifiers within the synchronous authorization window.',
      },
      {
        title: 'Behavioral Baseline Profiling',
        description: 'Detect velocity spikes, unusual spending geography shifts, and device anomalies against historical customer baselines.',
      },
      {
        title: 'Automated Decision Routing',
        description: 'Dynamically route transactions across Approve, Challenge, Step-up MFA, or Decline pathways based on risk scores.',
      },
    ],
    tags: ['Sub-ms Inference', 'Behavioral Biometrics', 'Device Fingerprinting', 'Automated Routing'],
  },
  {
    id: 'adaptive-policy-orchestration',
    stepNumber: '02',
    title: 'Adaptive Policy & Rule Orchestration',
    profileSubtitle: 'Profile: Dynamic Risk Thresholds & Compliance Controls',
    overview:
      'Empower risk engineering teams to deploy, version-control, and test sophisticated rule sets without requiring disruptive code deployments or core infrastructure updates.',
    capabilities: [
      {
        title: 'Visual Policy Builder',
        description: 'Construct multi-variable logical rules combining velocity checks, MCC restrictions, and ML risk tiers.',
      },
      {
        title: 'Shadow Mode Testing',
        description: 'Evaluate new fraud rules against live historical traffic in shadow mode to measure false-positive impacts safely.',
      },
      {
        title: 'Version-Controlled Audit Logs',
        description: 'Maintain immutable records of every rule modification, policy author, and deployment timestamp for compliance audits.',
      },
    ],
    tags: ['Visual Rule Builder', 'Shadow Testing', 'Version Control', 'Audit Trails'],
  },
  {
    id: 'intelligent-analyst-casework',
    stepNumber: '03',
    title: 'Intelligent Analyst Casework & Triage',
    profileSubtitle: 'Profile: Human-in-the-Loop Investigation Workbenches',
    overview:
      'Streamline manual fraud investigations by aggregating linked entity networks, transaction graphs, and automated evidence packages into a unified analyst workbench.',
    capabilities: [
      {
        title: 'Automated Evidence Packaging',
        description: 'Instantly assemble KYC records, related alert timelines, and device fingerprints when an escalation triggers.',
      },
      {
        title: 'Entity Link Analysis',
        description: 'Visualize hidden connections between colluding fraud rings using shared devices, funding sources, or IP addresses.',
      },
      {
        title: 'SLA-Driven Queue Routing',
        description: 'Intelligently distribute cases to analysts based on specialization, current caseload, and severity SLAs.',
      },
    ],
    tags: ['Case Management', 'Entity Link Analysis', 'Evidence Aggregation', 'Queue Routing'],
  },
  {
    id: 'feedback-loop-model-retraining',
    stepNumber: '04',
    title: 'Feedback Loop & Model Retraining',
    profileSubtitle: 'Profile: Closed-Loop Machine Learning Optimization',
    overview:
      'Connect downstream chargeback adjudications and manual analyst verdicts directly back to upstream model training pipelines to continually suppress false positives.',
    capabilities: [
      {
        title: 'Chargeback Reconciliation Sync',
        description: 'Automatically map confirmed fraud chargebacks and dispute outcomes back to original model prediction scores.',
      },
      {
        title: 'Drift Monitoring & Alerts',
        description: 'Detect data drift and feature degradation in production machine learning models with automated alerting triggers.',
      },
      {
        title: 'Automated Labeling Pipelines',
        description: 'Streamline training dataset generation using verified analyst review labels and final transaction disposition states.',
      },
    ],
    tags: ['Model Retraining', 'Drift Monitoring', 'Chargeback Sync', 'Feedback Loops'],
  },
];

export default function DropdownSection() {
  const [openProfileId, setOpenProfileId] = useState<string | null>('real-time-transaction-scoring');

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
              Configured for advanced AI fraud prevention.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-sm font-normal">
            Explore architectural frameworks tailored to real-time machine learning scoring, adaptive policy orchestration, and automated threat defense.
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