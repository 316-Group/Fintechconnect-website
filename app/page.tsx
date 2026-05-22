"use client";
import React from 'react';
import Navbar from './navbar';
import BenefitsSection from '@/app/BenefitsSection';
import FeaturesSection from './Featuressection';
import WhyUsSection from './Whyussection';
import FooterSection from './Footersection';
import GlobalAccountsSection from './Globalaccounts';
import FeelProtectedSection from './Feelprotectedsection';
import CarouselSection from './Carouselsection';
import ModulesSection from './Modulessection';

import { getPath } from '@/utils/helper';

export default function MarketingHome() {
  return (
    <div className="bg-black">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
<section className="relative bg-black text-white pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden w-full">
  
  {/* Container for both text and image */}
  <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between">
    
    {/* Text Box Container */}
    <div className="w-full lg:w-[45%] flex flex-col items-start z-10 order-2 lg:order-1 mt-10 lg:mt-0">
      <div className="inline-flex items-center rounded-md border border-slate-800 bg-black px-3 py-2 text-xs text-[#00ebcd] font-light mb-6 tracking-wide">
        Modular. Integrated. Compliant.
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
        White label bespoke <br className="hidden lg:block" /> 
        solutions for{' '}
        <span className="text-[#0066ff] inline-block">Fintechs</span>
      </h1>

      <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-[550px] font-light">
        We are infrastructure builders for the financial industry. Fintech Connect by 316 
        Group gives banks, fintechs, and financial institutions a modular, production 
        ready platform to design, assemble, and launch regulated financial products in 
        weeks, not years.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button className="bg-[#5ce1b6] hover:bg-[#4cd0a5] text-black font-semibold py-3 px-6 rounded-md transition-all active:scale-95 shadow-lg text-center">
          Request Demo
        </button>
        <button className="border border-blue-500 bg-transparent hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-md transition-all active:scale-95 text-center">
          Book Consultation
        </button>
      </div>
    </div>

    {/* Image Container */}
    {/* We remove the fixed h-[800px] and use aspect ratios for better control */}
    <div className="w-full lg:w-[55%] order-1 lg:order-2 pr-0 lg:mr-[-82px] flex justify-end">
      <img 
        src={getPath("/Group 2085662636.png")} 
        alt="Fintech Connect dashboard"
        className="w-full max-w-[500px] lg:max-w-none lg:h-auto object-contain pointer-events-none"
      />
    </div>
  </div>
</section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Carousel Section */}
      <CarouselSection />

      {/* Modules Section */}
      <ModulesSection />
      
      {/* Why Us Section */}
      <WhyUsSection />

      {/* Global Accounts Section */}
      <GlobalAccountsSection />

      {/* Trust Bar */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="w-full pl-25 pr-6 lg:pr-25">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by forward-thinking institutions
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Partner Logos later */}
            <div className="text-2xl font-bold text-slate-400 italic">GLOBAL BANK</div>
            <div className="text-2xl font-bold text-slate-400 italic">MERIDIAN</div>
            <div className="text-2xl font-bold text-slate-400 italic">EQUITY TRUST</div>
            <div className="text-2xl font-bold text-slate-400 italic">NEO-FIN</div>
          </div>
        </div>
      </section>

      {/* Feel Protected Section */}
      <FeelProtectedSection />

      {/* Footer */}
      <FooterSection />
    </div>
   );
}