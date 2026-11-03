"use client";

import React from "react";
import {
  Building2,
  ChevronDown,
  Plus,
  Upload,
  Info,
  ArrowRight,
  ArrowLeft,
  Layers,
  Globe,
  Check,
} from "lucide-react";

export default function ProjectDetailsForm({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
            Overview
          </span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Project Details</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Give your project an identity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up the basic institutional parameters, jurisdiction profiles, and core ledger metadata of your financial product.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Form Column */}
        <div className="flex-1 w-full space-y-8">
          
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Apex Digital Banking"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                maxLength={64}
              />
            </div>
            <p className="text-xs text-slate-500">
              A distinct internal and external identifier for your deployed program and API access points.
            </p>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Project Description</label>
              <span className="text-[11px] text-slate-400">Optional specification</span>
            </div>
            <textarea
              placeholder="Describe the purpose, target audience, and scope of this financial program..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
            />
          </div>

          {/* Organization & Archetype */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer">
                  <option value="">Select organization...</option>
                  <option value="apex">Apex Global Finance Team</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Product Archetype</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer">
                  <option value="">Select archetype...</option>
                  <option value="card">Card Issuing (Virtual & Physical)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Market & Jurisdiction */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Primary Market & Jurisdiction <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer">
                <option value="">Select jurisdiction...</option>
                <option value="us">United States (US - OCC / FDIC Sponsor Partner)</option>
                <option value="uk">United Kingdom (FCA)</option>
                <option value="eu">European Union (EBA)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-500">
              Determines compliance rule engine baseline, KYC routing, and core correspondent settlement rail.
            </p>
          </div>

          {/* Supported Currencies */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Supported Currencies <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Currency
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px]">$</span>
                US Dollar
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px]">£</span>
                British Pound
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[9px]">₦</span>
                Nigerian Naira
              </div>
            </div>
          </div>

          {/* Target Customers */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              Target Customers <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button className="flex flex-col items-center justify-center py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                <span className="text-sm font-semibold text-slate-900">Individuals</span>
                <span className="text-[10px] text-slate-500">Retail / B2C</span>
              </button>
              <button className="flex flex-col items-center justify-center py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                <span className="text-sm font-semibold text-slate-900">Businesses</span>
                <span className="text-[10px] text-slate-500">Commercial / B2B</span>
              </button>
              <button className="flex flex-col items-center justify-center py-3 px-4 bg-blue-50 border-2 border-blue-200 rounded-lg relative overflow-hidden">
                <span className="text-sm font-semibold text-blue-700">Both (Hybrid)</span>
                <span className="text-[10px] text-blue-600">Omnichannel Program</span>
                <div className="absolute top-2 right-2 text-blue-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Program Brand Mark & Icon (Optional)</label>
            <div className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-blue-600">Upload Logo</span>
              <span className="text-[11px] text-slate-500 mt-1">Recommended: 512x512 PNG, SVG, or high-density WebP (max 2MB)</span>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="w-full lg:w-80 shrink-0 sticky top-24">
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Program Summary</h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Program Name</p>
                <p className="font-semibold text-slate-900 truncate">Apex Digital Banking</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Host Organization</p>
                <p className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Apex Global Finance Team
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Archetype</p>
                <p className="font-medium text-slate-700">Card Issuing (Virtual & Physical)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Market & Sponsor</p>
                <p className="font-medium text-slate-700">United States (OCC / FDIC Sponsor)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Settlement Currencies</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">USD</span>
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">EUR</span>
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">GBP</span>
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">NGN</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Demographics</p>
                <p className="font-medium text-slate-700">Hybrid (Individual & Corporate)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Initial Target Mode</p>
                <p className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Isolated Sandbox Mock Ledger
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50/50 rounded-xl flex gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              You can adjust tokenization ranges and sub-merchant BIN sponsorship routing later in the Program Configuration view.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Archetype
        </button>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors">
            Save as Draft
          </button>
          <button
            onClick={onContinue}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Continue to Preferences <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}