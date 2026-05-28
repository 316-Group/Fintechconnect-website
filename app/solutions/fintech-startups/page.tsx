"use client";
import React from "react";
import Navbar from "@/app/navbar";
import { getPath } from "@/utils/helper";
import ParallaxSection from "@/app/solutions/fintech-startups/parallaxsection";
import DynamicSection from "@/app/solutions/fintech-startups/dynamicsection";
import { Globe } from "@/components/ui/globe";
import Footersection from "@/app/Footersection";
import Newmodulessection from "@/app/solutions/fintech-startups/newmodulessection";
import BackgroundSection from "@/app/solutions/fintech-startups/backgroundsection";
import HoverSection from "@/app/solutions/fintech-startups/hoversection";
import NewfeaturesSection from "@/app/solutions/fintech-startups/newfeaturessection";


export default function FintechStartups() {
  return (
    <div className="bg-blue-100 font-sans">
      
      <Navbar />

      {/* NEW: A master wrapper for all page content below the navbar.
      */}
      <div className="pt-10 md:pt-12 w-full">
        
        {/* Hero Header & Description Section */}
        <section className="md:text-center pl-6 md:pt-12 pb-12 px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight max-w-full">
            White label bespoke solutions for <span className="text-blue-600">Fintechs</span>
          </h1>
          
          <p className="text-slate-600 font-normal text-base md:text-lg mb-8 leading-relaxed md:max-w-[85%] mx-auto">
            We are infrastructure builders for the financial industry. Fintech Connect by 316 Group gives 
            banks, fintechs, and financial institutions a modular, production ready platform to design.
          </p>
          
          {/* Book Demo CTA Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all shadow-sm shadow-blue-600/20 text-sm">
            Book demo
          </button>
        </section>

        {/* Single Large Bottom Image Asset */}

{/* MOBILE ONLY IMAGE - Hidden on medium screens (md) and up */}
<img 
  src={getPath("/mobileimage.png")} 
  alt="Fintech Connect dashboard visualization mobile"
  className="block md:hidden w-full h-auto pl-4 pr-0 py-4 pb-6 rounded-2xl shadow-2xl shadow-slate-300/60"
/>

{/* DESKTOP ONLY IMAGE - Hidden on mobile, blocks out on medium screens (md) and up */}
<img 
  src={getPath("/solutions/solutionsmodule.png")} 
  alt="Fintech Connect dashboard visualization"
  className="hidden md:block w-full h-auto md:px-20 md:py-12 md:mb-0 md:object-contain rounded-2xl shadow-2xl shadow-slate-300/60"
/>
                 

      </div>

      <ParallaxSection />

      <Newmodulessection />

      <NewfeaturesSection />

      <DynamicSection />

      <BackgroundSection />

      <HoverSection />

      <Footersection/>

    </div>
  );
}