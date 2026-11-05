"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  Menu,
  FolderCode,
  BookOpen,
  Clock,
  Settings2,
  CheckCircle2,
  Lightbulb,
  Boxes,
  Settings,
  X,
} from "lucide-react";
import ProjectDetailsForm from "./projectdetailsform";
import ArchetypeSelectionForm from "./archetypeselectionform";
import PlatformConfigurationForm from "./platformconfigurationform";

/* --------------------------- Full Screen Build Options --------------------------- */

function BuildOptionsView({ onClose, onSelectGuided }: { onClose: () => void; onSelectGuided: () => void }) {
  return (
    <div className="w-full flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Let's build something.</h2>
          <p className="text-sm text-slate-500 max-w-3xl">
            Choose how you want to create your financial product. Start with a guided experience or design your own infrastructure from the ground up.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Guided Builder Card */}
        <div className="border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 transition-colors bg-#6941C61F">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
              <Sparkles className="w-3 h-3" /> Recommended for Teams
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5" /> ~8 min guided setup
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">Guided Builder</h3>
          <p className="text-sm text-slate-500 mb-6">
            Build faster with a recommended architecture tailored to your financial product. We'll walk you through the setup.
          </p>

          {/* ---- Guided Builder image placeholder ---- */}
          <div className="relative w-full h-[190px] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 overflow-hidden">
            <img src="/dashboard/guidedbuilderimg.png" alt="" className="w-full h-full object-contain" />
            
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Recommended modules and automated dependencies",
              "Preconfigured financial ledger & settlement flows",
              "Step-by-step regulatory & tier validation",
              "Ready-to-customize customer onboarding screens",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={onSelectGuided}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Start with Guided Builder <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Builder Card */}
        <div className="border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 transition-colors bg-#6941C61F">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
              <Settings2 className="w-3 h-3" /> Advanced Architects
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Settings className="w-3.5 h-3.5" /> Full architectural freedom
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">Custom Builder</h3>
          <p className="text-sm text-slate-500 mb-6">
            Take complete control of your architecture. Select, connect, and configure infrastructure modules yourself.
          </p>

          {/* ---- Custom Builder image placeholder ---- */}
          <div className="relative w-full h-[190px] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 overflow-hidden">
            <img src="/dashboard/custombuilderimg.png" alt="" className="w-full h-full object-contain" />
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Complete 40+ modular financial primitives catalog",
              "Unconstrained visual node canvas & routing mesh",
              "Raw webhook handlers, filters, and custom event relays",
              "Direct granular JSON payload & schema configurations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Boxes className="w-4 h-4" /> Start from Scratch
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Not sure where to start?</p>
            <p className="text-xs text-slate-500">Explore our verified blueprint templates and preconfigured architectures.</p>
          </div>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 whitespace-nowrap">
          Browse Templates <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Main Page -------------------------------- */

export default function MyProductsPage() {
  // 'list' = default empty state, 'options' = Let's build something, 'form' = Guided builder form
  const [view, setView] = useState<"list" | "options" | "archetype" | "details" | "preferences">("list");
  const [selectedArchetypeId, setSelectedArchetypeId] = useState("");

  return (
    <div className="w-full h-full">
      {view === "list" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Projects & Deployments</h1>
              <p className="text-sm text-slate-500 mt-1">Orchestrate and deploy your institutional BaaS modules, custom virtual cards, and payment pipelines.</p>
            </div>
            <button 
              onClick={() => setView("options")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          {/* Tabs & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 gap-4 pt-4">
            <div className="flex items-center gap-6">
              <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 flex items-center gap-2">
                Recently viewed <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-[10px]">0</span>
              </button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2">
                Shared with me <span className="bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px]">0</span>
              </button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-3">
                Archived
              </button>
            </div>

            <div className="flex items-center gap-3 pb-3">
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 shadow-sm">
                Org: <span className="font-semibold text-slate-900">All organizations</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 shadow-sm">
                Sort: <span className="font-semibold text-slate-900">Last edited</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
                <button className="p-1.5 bg-slate-50 text-blue-600 border-r border-slate-200">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600">
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <FolderCode className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-slate-900">No projects created yet</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
              You haven't deployed any financial products or programs in this organization yet. Kick off your infrastructure by launching a pre-validated starter or building a bespoke platform from scratch.
            </p>
            
            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => setView("options")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Create Your First Project
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors">
                <BookOpen className="w-4 h-4 text-slate-400" /> Read Quickstart Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "options" && (
        <BuildOptionsView 
          onClose={() => setView("list")} 
          onSelectGuided={() => setView("archetype")} 
        />
      )}

      {view === "archetype" && (
        <ArchetypeSelectionForm 
          onBack={() => setView("options")} 
          onContinue={(selectedId) => {
            setSelectedArchetypeId(selectedId);
            setView("details");
          }}
        />
      )}

      {view === "details" && (
        <ProjectDetailsForm 
          onBack={() => setView("archetype")} 
          initialArchetypeId={selectedArchetypeId}
          onContinue={() => setView("preferences")}
        />
      )}

      {view === "preferences" && (
        <PlatformConfigurationForm 
          onBack={() => setView("details")} 
          onComplete={() => {
            // Handle project creation here (e.g. API call or reset to list)
            console.log("Project Created!");
            setView("list");
          }} 
        />
      )}
    </div>

  );
}