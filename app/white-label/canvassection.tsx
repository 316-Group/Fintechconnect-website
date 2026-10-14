'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { getPath } from "@/utils/helper";

interface StepItem {
  id: number;
  title: string;
  description: string;
}

const stepsData: StepItem[] = [
  {
    id: 1,
    title: 'Canvas',
    description: 'Start blank, or choose a starting point with faint dot grid and safe-area ruler guides.',
  },
  {
    id: 2,
    title: 'Logo and name',
    description: 'Add your identity. Logo and institutional app name appear securely anchored in the mobile header.',
  },
  {
    id: 3,
    title: 'Colour',
    description: 'Choose your colour. Primary colour fills balance card and action triggers with verified accessibility.',
  },
  {
    id: 4,
    title: 'Type and shape',
    description: 'Set your type and shape language. Typography adjusts, button corners morph from rounded to pill.',
  },
  {
    id: 5,
    title: 'Components',
    description: 'Place the components your customers need. Balance cards, quick actions, and transaction lists drop in.',
  },
];

export default function CanvasSection() {
  const [openStep, setOpenStep] = useState<number | null>(1);

  const toggleStep = (id: number) => {
    setOpenStep(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto space-y-10">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-2">
            YOUR CANVAS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Start with an empty canvas. Bring your brand to life.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1">
            Begin from a blank screen or a template, then add your logo, colour, type and components one layer at a time. The platform supplies the native structure. You supply the identity.
          </p>
        </div>

        {/* SPLIT GRID: TIMELINE ACCORDION (LEFT) & CANVAS GRAPHIC ASSET (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start pt-4">
          
          {/* LEFT COLUMN: INTERACTIVE ACCORDION STEPS */}
          <div className="lg:col-span-5 space-y-5">
            <div className="divide-y divide-slate-100">
              {stepsData.map((step) => {
                const isOpen = openStep === step.id;
                return (
                  <div key={step.id} className="py-4 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="w-full flex items-center justify-between text-left py-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {step.id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Accordion Description Content */}
                    {isOpen && (
                      <div className="pl-10 pt-2 pb-1">
                        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Try it yourself
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Start from a template <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: CANVAS / EDITOR ASSET SLOT */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            
              <img
                src={getPath('/products/canvasimage.png')}
                alt="White Label Canvas Studio Editor"
                className="w-full h-auto object-contain max-h-[580px] rounded-2xl"
                
              
              />
            
          </div>

        </div>

      </div>
    </section>
  );
}