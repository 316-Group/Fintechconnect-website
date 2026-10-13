'use client';

import React from 'react';
import { getPath } from "@/utils/helper";
import Navbar from "@/app/navbar";
import Footersection from "@/app/Footersection";
import HoverSection from "@/app/solutions/fintech-startups/hoversection";
import BuildSection from './buildsection';
import BackgroundSection from './backgroundsection';
import NewCardsSection from './newcardssection';

export default function WhiteLabelHero() {
  return (
    <div className="bg-white">
      <Navbar />

      <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:pl-4 lg:pr-14 font-sans text-slate-900 overflow-hidden">
        <div className="max-w-full mx-auto flex flex-col items-center space-y-12">
          
          {/* CENTERED HEADER, SUBTITLE & CTA */}
          <div className="max-w-5xl text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
              Your brand. Your banking experience.<br />
              Built <span className="text-blue-600">exactly the way you envision it.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed max-w-6xl mx-auto">
              Native iOS and Android applications for seamless customer banking experiences. Configure design tokens, choose user journeys, and preview interaction states in real time before deployment review.
            </p>

            <div className="pt-2">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                Book demo
              </button>
            </div>
          </div>

          {/* CENTERED HERO GRAPHIC / MOCKUP ASSET */}
          
            <img
              src={getPath('/products/whitelabel hero.png')}
              alt="White Label Banking Experience Preview"
              className="w-full h-auto object-contain max-h-[760px] rounded-3xl"
              onError={(e) => {
                // Fallback visual indicator until the image asset is imported
                e.currentTarget.style.display = "none";
              }}
            />
        

        </div>
      </section>
      
      <NewCardsSection />
      <BuildSection />

      <HoverSection />
      <BackgroundSection />
      <Footersection />
    </div>
  );
}