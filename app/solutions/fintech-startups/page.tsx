"use client";
import React from "react";
import Navbar from "@/app/navbar";
import { getPath } from "@/utils/helper";
import ParallaxSection from "@/app/solutions/fintech-startups/parallaxsection";
import DynamicSection from "@/app/solutions/fintech-startups/dynamicsection";
import { Globe } from "@/components/ui/globe";
import Footersection from "@/app/Footersection";
import Newmodulessection from "@/app/solutions/fintech-startups/newmodulessection";

export default function FintechStartups() {
  return (
    <div className="min-h-screen bg-blue-100 font-sans pb-24">
      
      <Navbar />

      {/* NEW: A master wrapper for all page content below the navbar.
      */}
      <div className="pt-10 md:pt-12 w-full">
        
        {/* Hero Header & Description Section */}
        <section className="text-center pb-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            White label bespoke solutions for <span className="text-blue-600">Fintechs</span>
          </h1>
          
          <p className="text-slate-600 font-normal text-base md:text-lg mb-8 leading-relaxed max-w-[80%] mx-auto">
            We are infrastructure builders for the financial industry. Fintech Connect by 316 Group gives 
            banks, fintechs, and financial institutions a modular, production ready platform to design.
          </p>
          
          {/* Book Demo CTA Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all shadow-sm shadow-blue-600/20 text-sm">
            Book demo
          </button>
        </section>

        {/* Single Large Bottom Image Asset */}
        
            
            {/*ACTUAL IMAGE PATH */}
            <img 
              src={getPath("/solutions/solutionsmodule.png")} 
              alt="Fintech Connect dashboard visualization"
              className="w-full h-auto px-6 md:px-20 py-8 md:py-12 md:mb-20 object-contain rounded-2xl shadow-2xl shadow-slate-300/60"
            />
            
          

        

      </div>

      <ParallaxSection />

      <Newmodulessection />

      <DynamicSection />

      

      <Footersection/>

    </div>
  );
}