'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronRight, GripVertical, ArrowRight } from 'lucide-react';

// --- Data Definitions ---

const V1_THEME = {
  name: 'Deep Cobalt',
  primary: '#0040DF',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  radius: '8px',
  buttonRadius: '8px',
  buttonText: '#FFFFFF',
  secondary: '#5E7E9E',
  cardBg: '#F8FAFC',
};

const V2_THEME = {
  name: 'Vibrant Violet',
  primary: '#7C3AED',
  surface: '#F8FAFC',
  text: '#0F172A',
  textMuted: '#64748B',
  radius: '16px',
  buttonRadius: '999px',
  buttonText: '#FFFFFF',
  secondary: '#4F46E5',
  cardBg: '#FFFFFF',
};

const DELTAS = [
  { id: 'primary', label: 'Primary colour', from: '#0040DF', to: '#7C3AED' },
  { id: 'radius', label: 'Button shape', from: 'Rounded (8px)', to: 'Pill (999px)' },
  { id: 'density', label: 'Density', from: 'Standard (16px)', to: 'Roomy (24px)' },
  { id: 'surface', label: 'Neutral surface', from: '#FFFFFF', to: '#F8FAFC' },
  { id: 'secondary', label: 'Secondary accent', from: '#5E7E9E', to: '#4F46E5' },
  { id: 'typography', label: 'Typography weight', from: 'Medium (500)', to: 'Semibold (600)' },
];

// --- Sub-Components ---

function PhoneMockup({ theme, isV2 = false }: { theme: typeof V1_THEME; isV2?: boolean }) {
  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: theme.surface,
        color: theme.text,
        // V2 has a slightly different inner layout spacing if needed, but using same structure here
      }}
    >
      {/* Phone Status Bar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[10px] font-bold">
        <span>09:41</span>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-current opacity-80" />
          <div className="h-2 w-3 rounded-sm bg-current opacity-80" />
          <div className="h-2 w-4 rounded-sm bg-current opacity-80" />
        </div>
      </div>

      <div className="flex-1 px-5 pt-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Apex Banking</h2>
          {isV2 && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#7C3AED] opacity-80">
              v2 in review
            </span>
          )}
        </div>

        {/* Main Card */}
        <div 
          className="mb-3 p-4 transition-all"
          style={{ 
            backgroundColor: theme.cardBg, 
            borderRadius: theme.radius,
            border: `1px solid rgba(0,0,0,0.05)`
          }}
        >
          <p className="text-[10px] font-medium opacity-60">Main Checking</p>
          <p className="mt-1 text-[22px] font-bold tracking-tight">$24,850.40</p>
        </div>

        {/* Secondary Card */}
        <div 
          className="mb-6 p-4 transition-all"
          style={{ 
            backgroundColor: theme.cardBg, 
            borderRadius: theme.radius,
            border: `1px solid rgba(0,0,0,0.05)`
          }}
        >
          <p className="text-[11px] font-semibold" style={{ color: theme.text }}>Standard Wire Queue</p>
          <p className="text-[10px] opacity-60 mt-0.5">Standard Density Layout</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-8">
        <button 
          className="flex w-full items-center justify-center py-3 text-[12px] font-bold transition-all"
          style={{ 
            backgroundColor: theme.primary,
            color: theme.buttonText,
            borderRadius: theme.buttonRadius,
          }}
        >
          Dispatch Transfer
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function CompareSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'phone' | 'desktop'>('phone');
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(percentage);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <section className="w-full bg-[#F8F9FC] py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden border-t border-slate-200">
      <div className="max-w-full mx-auto flex flex-col">
        
        {/* Header Section */}
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#0040DF]">
            Compare
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
            See exactly what changed between versions.
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-500">
            Pick any two versions of a theme, slide between them on the same screen, and read the changes token by token. Restore an earlier version as a new draft.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#E8EDF8] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold text-slate-600">
            <span className="uppercase tracking-wider text-[10px] text-slate-500">Version A:</span>
            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm border border-slate-200">
              <span className="text-slate-900">v1</span>
              <span className="rounded bg-[#0F5B3F] px-1.5 py-0.5 text-[9px] font-bold text-white">Approved</span>
            </div>
            
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            
            <span className="uppercase tracking-wider text-[10px] text-slate-500">Version B:</span>
            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm border border-slate-200">
              <span className="text-slate-900">v2</span>
              <span className="rounded bg-[#F3E8FF] px-1.5 py-0.5 text-[9px] font-bold text-[#7C3AED]">In review</span>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-white p-0.5 shadow-sm border border-slate-200">
            <button 
              onClick={() => setViewMode('phone')}
              className={`px-4 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${viewMode === 'phone' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Phone
            </button>
            <button 
              onClick={() => setViewMode('desktop')}
              className={`px-4 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Desktop
            </button>
          </div>
        </div>

        {/* Main Split View Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Slider Area */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div 
              ref={containerRef}
              className={`relative overflow-hidden bg-white shadow-2xl rounded-[40px] border-[8px] border-slate-900 transition-all duration-300 ${viewMode === 'phone' ? 'w-[320px] h-[600px]' : 'w-full max-w-[600px] h-[400px] rounded-2xl border-4'}`}
              onPointerDown={(e) => {
                // Only start dragging if clicking inside the container
                setIsDragging(true);
                // Optionally jump to position immediately
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                   const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                   setSliderPosition((x / rect.width) * 100);
                }
              }}
            >
              {/* Notch (Phone mode only) */}
              {viewMode === 'phone' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-2xl z-50" />
              )}

              {/* V2 Theme (Base Layer - Right side) */}
              <div className="absolute inset-0">
                <PhoneMockup theme={V2_THEME} isV2={true} />
              </div>

              {/* V1 Theme (Overlay Layer - Left side clipped) */}
              <div 
                className="absolute inset-0 z-10"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <PhoneMockup theme={V1_THEME} isV2={false} />
              </div>

              {/* Slider Divider Line */}
              <div 
                className="absolute top-0 bottom-0 z-20 w-0.5 bg-[#0040DF] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              />

              {/* Slider Handle */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex h-10 w-10 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 hover:scale-105 transition-transform pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0040DF]/5 text-[#0040DF]">
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>
            </div>

            <p className="mt-6 text-[11px] font-medium text-slate-500">
              Drag to compare v1 (Deep Cobalt) vs v2 (Vibrant Violet).
            </p>
          </div>

          {/* Right: Token Delta Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Detected Token Delta (6 items)
            </h3>
            
            <div className="space-y-3">
              {DELTAS.map((delta) => (
                <div 
                  key={delta.id} 
                  className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-bold text-slate-900">{delta.label}</p>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-500">
                      <span>{delta.from}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span className="font-semibold text-slate-700">{delta.to}</span>
                    </div>
                  </div>
                  <button className="rounded px-3 py-1.5 text-[11px] font-bold text-[#0040DF] bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    Show
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <button className="flex w-full items-center justify-center rounded-lg bg-[#0040DF] py-3 text-[13px] font-bold text-white shadow-md hover:bg-[#0036BD] transition-colors">
                Restore v1 as a new draft
              </button>
              <p className="text-[10px] text-slate-400">
                Your versions are never lost in our version history
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}