'use client';

import React from 'react';
import { getPath } from "@/utils/helper";
import Navbar from "@/app/navbar";
import Footersection from "@/app/Footersection";
import HoverSection from "@/app/solutions/fintech-startups/hoversection";
import BuildSection from './buildsection';

export default function WhiteLabelHero() {
  return (
    <div className="bg-white">
        <Navbar />

    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: TEXT CONTENT & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.15]">
              Your brand.<br />
              Your banking experience.<br />
              Built <span className="text-blue-600">exactly the way you envision it.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed max-w-xl">
              Native iOS and Android applications for seamless customer banking experiences. Configure design tokens, choose user journeys, and preview interaction states in real time before deployment review.
            </p>

            <div className="pt-2">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                Book demo
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: HERO GRAPHIC / MOCKUP ASSET SLOT */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
              <img
                src={getPath('/products/whitelabel hero.jpg')}
                alt="White Label Banking Experience Preview"
                className="w-full h-auto object-contain max-h-[760px] rounded-2xl"
                onError={(e) => {
                  // Fallback visual indicator until the image asset is imported
                  e.currentTarget.style.display = "none";
                }}
              />
              
            
          </div>

        </div>
      </div>
    </section>

    <BuildSection />

    <HoverSection />
    <Footersection />
    </div>
  
  );
}