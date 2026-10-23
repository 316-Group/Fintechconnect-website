'use client';
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, Zap, FileText } from 'lucide-react';

// --- Data Definitions ---

const CARDS_DATA = [
  {
    id: '01',
    title: 'Surfaces layer by depth.',
    description: 'In dark mode, higher elevation layers use lighter surface luminances ( #1E293B → #1E293B → #0F172A ) rather than drop shadows.',
  },
  {
    id: '02',
    title: 'Colour adjusts to stay readable.',
    description: 'The brand accent blue shifts slightly between modes to preserve optical punch without visual vibration against dark surfaces.',
  },
  {
    id: '03',
    title: 'Logos and images have dual variants.',
    description: 'Asset containers accept dual vectors, ensuring corporate logos never render with inverted colors or awkward rectangular halos.',
  },
];

const TOKEN_ROWS = [
  { id: 'surface-default', role: 'Surface (Default)', light: '#FFFFFF', dark: '#0F172A', lightContrast: '14.2', darkContrast: '11.8', lightSwatch: '#FFFFFF', darkSwatch: '#0F172A' },
  { id: 'surface-elevated', role: 'Surface (Elevated)', light: '#F8FAFC', dark: '#1E293B', lightContrast: '13.6', darkContrast: '10.4', lightSwatch: '#F8FAFC', darkSwatch: '#1E293B' },
  { id: 'text-primary', role: 'Text (Primary)', light: '#0F172A', dark: '#F8FAFC', lightContrast: '14.8', darkContrast: '13.2', lightSwatch: '#0F172A', darkSwatch: '#F8FAFC' },
  { id: 'text-muted', role: 'Text (Muted)', light: '#64748B', dark: '#94A3B8', lightContrast: '5.8', darkContrast: '6.1', lightSwatch: '#64748B', darkSwatch: '#94A3B8' },
  { id: 'action-primary', role: 'Action (Primary)', light: '#0040DF', dark: '#3B82F6', lightContrast: '7.8', darkContrast: '8.4', lightSwatch: '#0040DF', darkSwatch: '#3B82F6' },
  { id: 'border-subtle', role: 'Border (Subtle)', light: '#E2E8F0', dark: '#1E293B', lightContrast: '2.2', darkContrast: '2.4', lightSwatch: '#E2E8F0', darkSwatch: '#1E293B' },
  { id: 'success', role: 'Success', light: '#059669', dark: '#10B981', lightContrast: '6.4', darkContrast: '7.9', lightSwatch: '#059669', darkSwatch: '#10B981' },
  { id: 'warning', role: 'Warning', light: '#D97706', dark: '#F59E0B', lightContrast: '5.1', darkContrast: '9.1', lightSwatch: '#D97706', darkSwatch: '#F59E0B' },
  { id: 'danger', role: 'Danger', light: '#DC2626', dark: '#EF4444', lightContrast: '6.7', darkContrast: '7.3', lightSwatch: '#DC2626', darkSwatch: '#EF4444' },
];

// --- Main Component ---

export default function CardsSection() {
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  // Helper to determine if a specific element in the preview should be highlighted
  const isHighlighted = (id: string) => hoveredToken === id;

  return (
    <section className="w-full bg-[#F8F9FC] py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
      <div className="mx-auto max-w-full px-6 space-y-24">
        
        {/* ========================================================
            SECTION 1: Core Foundations
           ======================================================== */}
        <div>
          <div className="mb-12 text-center flex flex-col items-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#0040DF]">
              Core Foundations
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Three design decisions that make dual-mode seamless.
            </h2>
            <p className="max-w-2xl text-[14px] leading-relaxed text-slate-500">
              Built into our token architecture from day one, ensuring no manual overrides or styling debt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS_DATA.map((card) => (
              <div key={card.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0040DF] text-[11px] font-bold text-white">
                  {card.id}
                </div>
                <h3 className="mb-3 text-[15px] font-bold text-slate-900">{card.title}</h3>
                <p className="mb-8 text-[12px] leading-relaxed text-slate-500 flex-1">
                  {card.description}
                </p>
                
                {/* Image Placeholders */}
                {card.id === '01' && (
                  <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-900">
                    <button className="flex items-center gap-2 rounded-lg bg-[#0040DF] px-4 py-2 text-[11px] font-bold text-white">
                      Transfer Now <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {card.id === '02' && (
                  <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100">
                    {/* Placeholder for second image */}
                  </div>
                )}
                {card.id === '03' && (
                  <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-100">
                    {/* Styled Placeholder mimicking the image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      
                      
                    </div>
                    
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            SECTION 2: Designed Pairs
           ======================================================== */}
        <div>
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#0040DF]">
              Designed Pairs
            </p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
              Every role has a light value and a dark value.
            </h2>
            <p className="max-w-2xl text-[14px] leading-relaxed text-slate-500">
              Semantic tokens pair light surfaces with deep dark tones to maintain optical hierarchy rather than performing raw color inversion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Token Table */}
            <div className="lg:col-span-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] bg-slate-50 border-b border-slate-200 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <div>Semantic Role</div>
                <div>Light Mode Value</div>
                <div>Dark Mode Value</div>
                <div>Light Contrast</div>
                <div>Dark Contrast</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {TOKEN_ROWS.map((row) => (
                  <div 
                    key={row.id}
                    onMouseEnter={() => setHoveredToken(row.id)}
                    onMouseLeave={() => setHoveredToken(null)}
                    className={`grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] items-center px-4 py-2.5 text-[11px] transition-colors cursor-default ${hoveredToken === row.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="font-semibold text-slate-800">{row.role}</div>
                    
                    <div className="flex items-center gap-2 font-mono text-slate-500">
                      <span className="h-3 w-3 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: row.lightSwatch }} />
                      {row.light}
                    </div>
                    
                    <div className="flex items-center gap-2 font-mono text-slate-500">
                      <span className="h-3 w-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: row.darkSwatch }} />
                      {row.dark}
                    </div>
                    
                    <div className="text-slate-500">{row.lightContrast}</div>
                    <div className="text-slate-500">{row.darkContrast}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-center text-[10px] text-slate-500 font-medium">
                Hover over any role above to target its location on the component preview
              </div>
            </div>

            {/* Right: Target Mapping Preview */}
            <div className="lg:col-span-4 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-[11px] font-bold text-slate-900">Target Mapping</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">ALL TOKENS NEUTRAL</span>
              </div>
              
              <div className="bg-[#F8F9FC] p-4 flex-1">
                {/* Mini App UI Preview */}
                <div 
                  className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                    isHighlighted('surface-default') ? 'border-blue-500 ring-2 ring-blue-200' : 
                    isHighlighted('border-subtle') ? 'border-slate-400' : 'border-slate-200'
                  }`}
                  style={{
                    backgroundColor: isHighlighted('surface-default') ? '#F0F4FF' : '#FFFFFF'
                  }}
                >
                  
                  {/* Header Area */}
                  <div className="border-b border-slate-100 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-800">Monday Threshold</span>
                      <span 
                        className={`rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600 border border-emerald-100 transition-all ${
                          isHighlighted('success') ? 'ring-2 ring-emerald-400 bg-emerald-100' : ''
                        }`}
                      >
                        Approve Transfer
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400">Review required for transfers over $5,000</p>
                  </div>

                  {/* Stats Row */}
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-3">
                      <span 
                        className={`text-[9px] font-semibold uppercase tracking-wider transition-all ${
                          isHighlighted('text-muted') ? 'bg-yellow-100 text-yellow-800 px-1 rounded' : 'text-slate-400'
                        }`}
                      >
                        Cash Activity
                      </span>
                      <span 
                        className={`text-[9px] font-bold transition-all ${
                          isHighlighted('action-primary') ? 'bg-blue-100 text-blue-700 px-1 rounded' : 'text-blue-600'
                        }`}
                      >
                        View All
                      </span>
                    </div>

                    {/* List Items */}
                    <div className="space-y-2">
                      {/* Item 1 */}
                      <div 
                        className={`flex items-center justify-between rounded-lg border p-2 transition-all ${
                          isHighlighted('surface-elevated') ? 'bg-indigo-50 border-indigo-200' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="grid h-6 w-6 place-items-center rounded bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div>
                            <p 
                              className={`text-[9px] font-bold transition-all ${
                                isHighlighted('text-primary') ? 'bg-yellow-100 text-yellow-800 px-1 rounded' : 'text-slate-800'
                              }`}
                            >
                              Adam Campbell Payout
                            </p>
                            <p className="text-[8px] text-slate-400">Salary • Oct 24</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-800">+$4,500.00</p>
                          <span 
                            className={`inline-block rounded px-1 py-0.5 text-[7px] font-bold transition-all ${
                              isHighlighted('success') ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            Completed
                          </span>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div 
                        className={`flex items-center justify-between rounded-lg border p-2 transition-all ${
                          isHighlighted('surface-elevated') ? 'bg-indigo-50 border-indigo-200' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className={`grid h-6 w-6 place-items-center rounded transition-all ${
                              isHighlighted('warning') ? 'bg-amber-200 text-amber-800' : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-800">Acme Corp Invoice</p>
                            <p className="text-[8px] text-slate-400">Billing • Oct 23</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-800">+$12,000.00</p>
                          <span 
                            className={`inline-block rounded px-1 py-0.5 text-[7px] font-bold transition-all ${
                              isHighlighted('warning') ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            Pending
                          </span>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div 
                        className={`flex items-center justify-between rounded-lg border p-2 transition-all ${
                          isHighlighted('surface-elevated') ? 'bg-indigo-50 border-indigo-200' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className={`grid h-6 w-6 place-items-center rounded transition-all ${
                              isHighlighted('danger') ? 'bg-rose-200 text-rose-800' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-800">AWS Hosting</p>
                            <p className="text-[8px] text-slate-400">Infrastructure • Oct 23</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-800">-$340.50</p>
                          <span 
                            className={`inline-block rounded px-1 py-0.5 text-[7px] font-bold transition-all ${
                              isHighlighted('danger') ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            Failed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="border-t border-slate-100 p-3">
                    <button 
                      className={`w-full rounded py-1.5 text-[9px] font-bold text-white transition-all ${
                        isHighlighted('action-primary') 
                          ? 'bg-[#0040DF] ring-2 ring-blue-300 ring-offset-1' 
                          : 'bg-slate-900'
                      }`}
                      style={{
                         backgroundColor: isHighlighted('action-primary') ? '#0040DF' : '#0F172A'
                      }}
                    >
                      Approve Selected
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-100 bg-white p-3 text-[9px] text-slate-400 leading-relaxed">
                Components maintain identical visual hierarchy without muddying backgrounds or causing inverted glare.
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}