'use client';
import React from 'react';
import { Info, CheckCircle2, MoreHorizontal } from 'lucide-react';

// --- Reusable Card Wrapper with Hover Animation ---

function ComponentCard({ 
  index, 
  title, 
  tag, 
  description, 
  lightContent, 
  darkContent 
}: { 
  index: number; 
  title: string; 
  tag: string; 
  description: string; 
  lightContent: React.ReactNode; 
  darkContent: React.ReactNode; 
}) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 cursor-default">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-[14px] font-bold text-slate-900">
          {index}. {title}
        </h3>
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          {tag}
        </span>
      </div>

      {/* Content Area */}
      <div className="mb-4 flex-1 rounded-xl bg-[#F8F9FC] p-2.5 ring-1 ring-slate-100/50">
        <div className="grid h-full grid-cols-2 gap-2.5">
          
          {/* Light Mode Panel */}
          <div className="relative flex flex-col overflow-hidden rounded-lg bg-white border border-slate-100 p-3 shadow-sm">
            <span className="absolute top-2 left-0 w-full text-center text-[8px] font-bold uppercase tracking-widest text-slate-400/80">
              Light
            </span>
            <div className="mt-4 flex flex-1 flex-col justify-center">
              {lightContent}
            </div>
          </div>

          {/* Dark Mode Panel */}
          <div className="relative flex flex-col overflow-hidden rounded-lg bg-[#0B1120] border border-slate-800 p-3 shadow-sm text-white">
            <span className="absolute top-2 left-0 w-full text-center text-[8px] font-bold uppercase tracking-widest text-slate-500">
              Dark
            </span>
            <div className="mt-4 flex flex-1 flex-col justify-center">
              {darkContent}
            </div>
          </div>

        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

// --- Main Section Component ---

export default function ComponentSection() {
  return (
    <section className="w-full bg-[#F8F9FC] py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
      <div className="mx-auto max-w-full">
        
        {/* Header Section */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-[#E8EDF8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0040DF]">
            Shared Component Library
          </div>
          <h2 className="mb-4 text-[32px] font-bold tracking-tight text-slate-900">
            Components in both modes.
          </h2>
          <p className="text-[14px] leading-relaxed text-slate-500">
            Side-by-side execution showing how token pairs maintain tactile weight, contrast, and action affordance across each UI element.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Buttons */}
          <ComponentCard
            index={1}
            title="Buttons"
            tag="Interactive"
            description="Primary actions adapt luminance for crisp visibility."
            lightContent={
              <div className="flex flex-col gap-2">
                <button className="w-full rounded-md bg-[#0040DF] py-1.5 text-[10px] font-semibold text-white shadow-sm">Primary</button>
                <button className="w-full rounded-md bg-[#00E5FF] py-1.5 text-[10px] font-semibold text-teal-900 shadow-sm">Secondary</button>
                <button className="w-full rounded-md bg-slate-100 py-1.5 text-[10px] font-semibold text-slate-400 cursor-not-allowed">Disabled</button>
              </div>
            }
            darkContent={
              <div className="flex flex-col gap-2">
                <button className="w-full rounded-md bg-[#3B82F6] py-1.5 text-[10px] font-semibold text-white shadow-sm">Primary</button>
                <button className="w-full rounded-md bg-[#22D3EE] py-1.5 text-[10px] font-semibold text-cyan-950 shadow-sm">Secondary</button>
                <button className="w-full rounded-md bg-slate-800 py-1.5 text-[10px] font-semibold text-slate-500 cursor-not-allowed">Disabled</button>
              </div>
            }
          />

          {/* 2. Input Field */}
          <ComponentCard
            index={2}
            title="Input Field"
            tag="Focus Ready"
            description="Clear structural borders without diffuse shadows."
            lightContent={
              <div className="w-full">
                <label className="mb-1 block text-[9px] font-bold text-slate-700">Account Holder</label>
                <div className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
                  Sample Customer
                </div>
              </div>
            }
            darkContent={
              <div className="w-full">
                <label className="mb-1 block text-[9px] font-bold text-slate-300">Account Holder</label>
                <div className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] text-slate-400">
                  Sample Customer
                </div>
              </div>
            }
          />

          {/* 3. Balance Card */}
          <ComponentCard
            index={3}
            title="Balance Card"
            tag="Ledger Metric"
            description="Tabular alignment ensures numerals never drift."
            lightContent={
              <div className="flex w-full flex-col items-start">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Available</span>
                <span className="text-[15px] font-bold text-slate-900 tracking-tight">$24,850.40</span>
                <span className="mt-1 text-[9px] text-slate-400">Pending: $1200.00</span>
              </div>
            }
            darkContent={
              <div className="flex w-full flex-col items-start">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Available</span>
                <span className="text-[15px] font-bold text-white tracking-tight">$24,850.40</span>
                <span className="mt-1 text-[9px] text-slate-500">Pending: $1200.00</span>
              </div>
            }
          />

          {/* 4. Transaction Row */}
          <ComponentCard
            index={4}
            title="Transaction Row"
            tag="Audit Entry"
            description="State pills communicate status instantly in both lights."
            lightContent={
              <div className="w-full space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-1 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-800">Supplier Settlement</span>
                      <span className="text-[8px] text-slate-400">State: Settled</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">-$4,210.00</span>
                  </div>
                ))}
              </div>
            }
            darkContent={
              <div className="w-full space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-1 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-200">Supplier Settlement</span>
                      <span className="text-[8px] text-slate-500">State: Settled</span>
                    </div>
                    <span className="text-[10px] font-bold text-white">-$4,210.00</span>
                  </div>
                ))}
              </div>
            }
          />

          {/* 5. Status Pill */}
          <ComponentCard
            index={5}
            title="Status Pill"
            tag="Lifecycle"
            description="Lifecycle states: Draft, In review, Approved, Scheduled."
            lightContent={
              <div className="flex w-full justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold text-orange-600 border border-orange-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> In review
                </span>
              </div>
            }
            darkContent={
              <div className="flex w-full justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2A1E00] px-3 py-1 text-[10px] font-bold text-orange-400 border border-orange-900/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> In review
                </span>
              </div>
            }
          />

          {/* 6. Toggle Switch */}
          <ComponentCard
            index={6}
            title="Toggle Switch"
            tag="Tactile"
            description="Clear physical containment on dark tracks."
            lightContent={
              <div className="flex w-full flex-col items-center gap-3">
                <div className="flex w-full items-center justify-between">
                   <span className="text-[8px] font-bold text-slate-500">ON</span>
                   <div className="relative inline-flex h-4 w-7 items-center rounded-full bg-[#0040DF]">
                     <span className="inline-block h-3 w-3 translate-x-3.5 rounded-full bg-white shadow transition-transform" />
                   </div>
                </div>
                <div className="flex w-full items-center justify-between">
                   <span className="text-[8px] font-bold text-slate-500">OFF</span>
                   <div className="relative inline-flex h-4 w-7 items-center rounded-full bg-slate-200">
                     <span className="inline-block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
                   </div>
                </div>
              </div>
            }
            darkContent={
              <div className="flex w-full flex-col items-center gap-3">
                <div className="flex w-full items-center justify-between">
                   <span className="text-[8px] font-bold text-slate-400">ON</span>
                   <div className="relative inline-flex h-4 w-7 items-center rounded-full bg-[#3B82F6]">
                     <span className="inline-block h-3 w-3 translate-x-3.5 rounded-full bg-white shadow transition-transform" />
                   </div>
                </div>
                <div className="flex w-full items-center justify-between">
                   <span className="text-[8px] font-bold text-slate-400">OFF</span>
                   <div className="relative inline-flex h-4 w-7 items-center rounded-full bg-slate-700">
                     <span className="inline-block h-3 w-3 translate-x-0.5 rounded-full bg-slate-400 shadow transition-transform" />
                   </div>
                </div>
              </div>
            }
          />

          {/* 7. Tab Bar */}
          <ComponentCard
            index={7}
            title="Tab Bar"
            tag="Navigation"
            description="Active tab marker shifts dynamically between themes."
            lightContent={
              <div className="flex w-full flex-col gap-1 text-[10px]">
                <span className="font-bold text-[#0040DF] bg-blue-50/50 px-1 py-0.5 rounded">Home</span>
                <span className="text-slate-500 px-1 py-0.5">Accounts</span>
                <span className="text-slate-500 px-1 py-0.5">Cards</span>
                <span className="text-slate-500 px-1 py-0.5">More</span>
                <span className="text-slate-500 px-1 py-0.5">Transfers</span>
              </div>
            }
            darkContent={
              <div className="flex w-full flex-col gap-1 text-[10px]">
                <span className="font-bold text-white bg-slate-800 px-1 py-0.5 rounded">Home</span>
                <span className="text-slate-400 px-1 py-0.5">Accounts</span>
                <span className="text-slate-400 px-1 py-0.5">Cards</span>
                <span className="text-slate-400 px-1 py-0.5">More</span>
                <span className="text-slate-400 px-1 py-0.5">Transfers</span>
              </div>
            }
          />

          {/* 8. Alert Banner */}
          <ComponentCard
            index={8}
            title="Alert Banner"
            tag="Notice"
            description="Tonal containers designed for reading comfort."
            lightContent={
              <div className="w-full flex items-start gap-2 rounded border border-blue-200 bg-white p-2 shadow-sm">
                <Info className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                <p className="text-[9px] leading-tight font-medium text-slate-700">
                  Batch execution scheduled for midnight settlement
                </p>
              </div>
            }
            darkContent={
              <div className="w-full flex items-start gap-2 rounded border border-blue-800 bg-[#0F172A] p-2 shadow-sm">
                <Info className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                <p className="text-[9px] leading-tight font-medium text-slate-300">
                  Batch execution scheduled for midnight settlement
                </p>
              </div>
            }
          />

        </div>
      </div>
    </section>
  );
}