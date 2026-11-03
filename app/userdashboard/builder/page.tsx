"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  ArrowRight,
  X,
  Building2,
  Database,
  Palette,
  Sliders,
  Bot,
  LayoutGrid,
} from "lucide-react";
import AnimatedCanvas from "@/app/products/animatedcanvas/animatedcanvas";

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
      
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col lg:flex-row">
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
              I'll explore on my own <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-[2] flex flex-col justify-center bg-slate-50 p-6 lg:p-8 border-l border-slate-100">
            <div className="relative h-48 lg:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 mb-6">
              <AnimatedCanvas className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>

            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                {currentFeature.rightLabel}
              </p>
              <h3 className="text-sm lg:text-base font-bold text-slate-900 mb-2">
                {currentFeature.rightTitle}
              </h3>
              <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed mb-4">
                {currentFeature.rightDescription}
              </p>
              
              {/* Dynamic Next / Start Building Button */}
              {activeFeature < features.length - 1 ? (
                <button 
                  onClick={() => setActiveFeature(prev => prev + 1)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={onClose}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
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

/* ------------------------------- Page -------------------------------- */

export default function DashboardHome() {
  // 1. Changed to true so the modal opens on page load
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  return (
    <>
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
      />

      <div className="space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50/70 to-white border border-slate-200">
          <div className="absolute inset-y-0 right-0 w-1/2 opacity-40 pointer-events-none">
            <div className="w-full h-full flex">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-blue-100/60" />
              ))}
            </div>
          </div>

          <div className="relative px-6 md:px-10 py-8 md:py-12 bg-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">Your financial infrastructure workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Build your next financial product.</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Everything you need to launch, configure, and scale financial products. Start with an architectural template or orchestrate your own custom core primitives from the ground up.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 shadow-sm transition-colors">
                <LayoutGrid className="w-3.5 h-3.5 text-blue-600" /> Build a Platform
              </button>
              <button className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> Explore Modules <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <LayoutGrid className="w-7 h-7 text-blue-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <h2 className="text-base font-bold text-slate-900">No projects created yet</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed">
            You haven&apos;t deployed any financial products or programs in this organization yet. Kick off your infrastructure by launching a pre-validated starter or building a bespoke platform from scratch.
          </p>
          <button 
            onClick={() => setShowWelcomeModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create Your First Project
          </button>
        </div>
      </div>
    </>
  );
}