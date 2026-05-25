import React from "react";
import Navbar from "@/app/navbar";
import { getPath } from "@/utils/helper";

export default function FintechStartups() {
  return (
    <div className="min-h-screen bg-blue-100 font-sans pb-24">
      
      <Navbar />

      {/* NEW: A master wrapper for all page content below the navbar. 
        pt-32 (128px) clears standard fixed navbars on mobile.
        md:pt-40 (160px) adds even more breathing room on desktop. 
      */}
      <div className="pt-32 md:pt-80 w-full">
        
        {/* Hero Header & Description Section */}
        <section className="text-center pb-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            White label bespoke solutions for <span className="text-blue-600">Fintechs</span>
          </h1>
          
          <p className="text-slate-600 font-normal text-base md:text-lg mb-8 leading-relaxed max-w-[200px] mx-auto">
            We are infrastructure builders for the financial industry. Fintech Connect by 316 Group gives 
            banks, fintechs, and financial institutions a modular, production ready platform to design.
          </p>
          
          {/* Book Demo CTA Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all shadow-sm shadow-blue-600/20 text-sm">
            Book demo
          </button>
        </section>

        {/* Single Large Bottom Image Asset */}
        <section className="max-w-[1000px] mx-auto px-8 mt-12 md:mt-16">
          <div className="w-full flex justify-center lg:px-16">
            
            {/*ACTUAL IMAGE PATH */}
            <img 
              src={getPath("/solutions/solutionsmodule.png")} 
              alt="Fintech Connect dashboard visualization"
              className="w-full h-auto object-contain rounded-2xl shadow-2xl shadow-slate-300/60"
            />
            
          </div>
        </section>

      </div>
    </div>
  );
}