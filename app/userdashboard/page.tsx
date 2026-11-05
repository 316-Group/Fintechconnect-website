"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  ArrowRight,
  ArrowUpRight,
  X,
  Building2,
  Database,
  Palette,
  Sliders,
  Bot,
  LayoutGrid,
  MessageCircle,
  ShieldCheck,
  Landmark,
  CreditCard,
  Users,
  UserCheck,
  SearchCheck,
  FileText,
  CirclePlus,
  ExternalLink,
} from "lucide-react";
import AnimatedCanvas from "@/app/userdashboard/animatedcanvas/animatedcanvas";

/* --------------------------- Welcome Modal --------------------------- */

function WelcomeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeFeature, setActiveFeature] = useState(0);

  if (!isOpen) return null;

  const features = [
    {
      number: "01",
      title: "Build Your Product",
      description: "Define your financial product using a guided architecture or create your own custom configuration.",
      icon: Building2,
      rightLabel: "PRODUCT ARCHITECTURE STUDIO",
      rightTitle: "Design and deploy modular financial products.",
      rightDescription: "Architect your product using pre-validated blueprints or drag-and-drop primitives for complete control over your financial stack.",
      rightButton: "Start Building"
    },
    {
      number: "02",
      title: "Connect Infrastructure",
      description: "Bring together the banking, ledger, payments and other capabilities your product requires.",
      icon: Database,
      rightLabel: "INFRASTRUCTURE TOPOLOGY ORCHESTRATOR",
      rightTitle: "Connect banking cores, ledgers, and payment rails.",
      rightDescription: "Seamlessly bind pre-integrated financial infrastructure providers with automated mTLS encryption and compliance mapping.",
      rightButton: "Explore Infrastructure"
    },
    {
      number: "03",
      title: "Design Your Experience",
      description: "Create and customize the customer-facing experience using White-label Studio.",
      icon: Palette,
      rightLabel: "WHITE-LABEL STUDIO BUILDER",
      rightTitle: "Craft native fintech apps with White-label Studio.",
      rightDescription: "Create and customize the customer-facing experience using drag-and-drop components, live ledger data bindings, and instant multi-framework code export.",
      rightButton: "Launch White Label Studio"
    },
    {
      number: "04",
      title: "Configure Programs",
      description: "Set up the financial products, deposit tiers, and compliance offerings your platform will provide.",
      icon: Sliders,
      rightLabel: "PROGRAM RULES & GOVERNANCE",
      rightTitle: "Define deposit limits, program tiers, and regulatory rules.",
      rightDescription: "Configure treasury sweep parameters, yield rates, interchange revenue splits, and automated compliance policies.",
      rightButton: "View Programs"
    },
    {
      number: "05",
      title: "AI Copilot",
      description: "Accelerate your development with AI-powered tools while maintaining the highest security standards.",
      icon: Bot,
      rightLabel: "AI FINANCIAL COPILOT",
      rightTitle: "Accelerate product builds with AI Copilot.",
      rightDescription: "Generate compliant ledger schemas, synthesize regulatory rules, and auto-scaffold core banking flows with enterprise-grade financial intelligence.",
      rightButton: "Start Building"
    },
  ];

    const currentFeature = features[activeFeature];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px]" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto">
          {/* ---------------- Left column ---------------- */}
          <div className="flex-[3] p-6 lg:p-8 lg:pr-6">
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-blue-600 mb-2">Welcome to FintechConnect</p>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Everything you need to build your financial product.
              </h2>
              <p className="text-[12px] text-slate-600 mt-2 leading-relaxed max-w-2xl">
                Fintech Connect brings financial infrastructure, product architecture, and customer-facing experiences together in one cohesive, auditable workspace.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">What you can do here</p>
              <div className="space-y-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === index;
                  return (
                    <button
                      key={feature.number}
                      onClick={() => setActiveFeature(index)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 text-left group ${
                        isActive
                          ? "bg-blue-50/80 border-blue-200 hover:bg-blue-50"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-blue-600" : "bg-slate-100 group-hover:bg-slate-200"
                      }`}>
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[11px] font-bold ${isActive ? "text-blue-700" : "text-slate-700"}`}>
                            {feature.number}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-900">— {feature.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{feature.description}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isActive ? "text-blue-600" : "text-slate-400 opacity-0 group-hover:opacity-100"} transition-opacity`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={onClose} className="flex items-center gap-2 text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              I&apos;ll explore on my own <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* ---------------- Right column ---------------- */}
          <div className="flex-[2] flex flex-col bg-slate-50 p-6 lg:p-8 border-l border-slate-100">
            {/* Canvas — grows to fill available space, minimum 400px tall */}
            <div className="relative flex-1 min-h-[350px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 mb-5">
              <AnimatedCanvas className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>

            {/* Copy */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                {currentFeature.rightLabel}
              </p>
              <h3 className="text-sm lg:text-base font-bold text-slate-900 mb-2">
                {currentFeature.rightTitle}
              </h3>
              <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">
                {currentFeature.rightDescription}
              </p>
            </div>

            {/* Button pinned to bottom-right of the modal */}
            <div className="flex justify-end">
              {activeFeature < features.length - 1 ? (
                <button
                  onClick={() => setActiveFeature(prev => prev + 1)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  {currentFeature.rightButton} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Static content constants --------------------- */

/** Replace this with the path (or imported image src) you want to use as the banner background. */
const BANNER_IMAGE = "/dashboard/bannerbackground.jpg";

const NEXT_STEPS: {
  title: string;
  description: string;
  type: "guided" | "modules" | "launch";
  image: string;
}[] = [
  {
    title: "Create your first Product",
    description:
      "Define the pages and flow of the financial product you want to launch. Use a guided starting point or build your own.",
    type: "guided",
    image: "/dashboard/homecard1.png",
  },
  {
    title: "Connect your infrastructure",
    description:
      "Add the banking, ledger and payments modules your product runs on.",
    type: "modules",
    image: "/dashboard/homecard2.png",
  },
  {
    title: "Design your experience",
    description:
      "Shape how customers see and use your product in White-label Studio.",
    type: "launch",
    image: "/dashboard/homecard3.png",
  },
];

const AML_SETUP = [
  {
    icon: Users,
    title: "Sanction Screening",
    description: "Check customers against the lists you choose.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: UserCheck,
    title: "PEP Checks",
    description: "Flag politically exposed persons.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: SearchCheck,
    title: "Transaction Monitoring",
    description: "Alert on thresholds, velocity and patterns.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: FileText,
    title: "Case review",
    description: "Route alerts to reviewers with recorded decisions.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

const TEMPLATES = [
  {
    title: "Digital Checking Account",
    description: "Full checking account stack with virtual cards, ledger, and KYC onboarding.",
    tags: ["Banking", "Ledger", "Cards"],
  },
  {
    title: "High-Yield Savings",
    description: "Configurable savings product with yield tiers and automated treasury sweep.",
    tags: ["Savings", "Treasury"],
  },
  {
    title: "Card Issuing Program",
    description: "Launch a card program with spend controls, rewards, and compliance rules.",
    tags: ["Cards", "Payments", "Compliance"],
  },
];

/* ------------------------------- Page -------------------------------- */

export default function DashboardHome() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  return (
    <>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      <div className="space-y-8">
        {/* ---------------- Hero banner with background image ---------------- */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200">
          {/* Background image layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${BANNER_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden
          />
          {/* Readability overlay — lightens the left side where the text lives */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" aria-hidden />

          <div className="relative px-6 md:px-10 py-8 md:py-12">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">
                Your financial infrastructure workspace
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Build your next financial product.
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Everything you need to launch, configure, and scale financial products. Start with an architectural template or orchestrate your own custom core primitives from the ground up.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => setShowWelcomeModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 shadow-sm transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-blue-600" /> Build a Platform
              </button>
              <button className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> Explore Modules <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------- Your Next Steps --------------------------- */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Your next steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEXT_STEPS.map((step) => (
              <div
                key={step.title}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* ---- Image ---- */}
                <div className="relative h-58 bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                 />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-1">
                    {step.description}
                  </p>

                  {/* ---- Actions ---- */}
                  <div className="mt-5">
                    {step.type === "guided" && (
                      <div className="flex items-center gap-2">
                        <button className="flex-[1.3] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors">
                          <Plus className="w-3.5 h-3.5" /> Use Guided Flow
                        </button>
                        <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                          Start from scratch
                        </button>
                      </div>
                    )}

                    {step.type === "modules" && (
                      <div className="flex justify-end">
                        <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                          <CirclePlus className="w-3.5 h-3.5" /> Browse Modules
                        </button>
                      </div>
                    )}

                    {step.type === "launch" && (
                      <div className="flex justify-end">
                        <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                          Launch White label studio
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------- Pre-integrated Connectors + AML Setup ------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connectors — single card, spans 2 columns */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF0FF] via-[#F5F2FF] to-white border border-slate-200/70 min-h-[240px]">
            {/* ---- Background image placeholder on the right ---- */}
            <div className="absolute inset-y-0 right-0 w-[55%] flex items-center justify-center pointer-events-none">
              {<img src="/dashboard/connectors.png" alt="" className="w-full h-full object-contain" /> }
              
            </div>

            {/* Content on the left */}
            <div className="relative p-7 sm:p-9 max-w-[55%]">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-10">
                Pre-integrated Connectors
              </h2>
              <p className="text-lg max-w-md text-slate-600 pt-2.5 leading-relaxed">
                Connect user bank accounts for identity verification, transaction
                history, and real-time balance checks.
              </p>
              <a
                href="/connectors"
                className="inline-flex items-center gap-1 text-xl font-semibold text-blue-600 hover:text-blue-700 mt-5 transition-colors"
              >
                Browse Integrators <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* AML setup — right column */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">AML setup</h3>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                  Tools to screen, monitor and review activity on your platform.
                </p>
              </div>
              <a
                href="/compliance"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0 mt-0.5"
              >
                Open Compliance →
              </a>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {AML_SETUP.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-slate-500 leading-snug mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------ Start with a Template ------------------------ */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Start with a Template</h2>
              <p className="text-xs text-slate-500 mt-1">
                Pre-validated blueprints to accelerate your build.
              </p>
            </div>
            <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.title}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex flex-col"
              >
                {/* ---- Image placeholder — drop your own image here ---- */}
                <div className="relative h-50 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 border-b border-slate-200 flex items-center justify-center">
                  <img
                    src="/dashboard/templateimage.png"
                    alt="Template placeholder"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed flex-1">
                    {tpl.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tpl.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 mt-3 text-[11px] font-semibold text-blue-600">
                    Use template
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}