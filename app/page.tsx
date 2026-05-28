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
      <section className="relative bg-black text-white pt-5 pb-10 lg:pt-32 lg:pb-32 overflow-hidden w-full">
        
        {/* 1. Replaced 'container mx-auto px-6 lg:px-20' with 'w-full' */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between">
          
          {/* 2. Text Box*/}
          <div className="w-full lg:w-[55%] flex flex-col items-start z-10 order-1 lg:order-1 mt-6 lg:mt-20 pl-6 lg:pl-20 pr-6 lg:pr-10">
      <div className="inline-flex items-center rounded-md border border-slate-800 bg-black px-3 py-2 text-xs text-[#00ebcd] font-light mb-6 tracking-wide">
        Modular. Integrated. Compliant.
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
        White label bespoke <br className="hidden lg:block" /> 
        solutions for{' '}
        <span className="text-[#0066ff] inline-block">Fintechs</span>
      </h1>

      <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-[650px] font-light">
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
    {/* fixed h-[800px] and use aspect ratios for better control */}
    <div className="w-full lg:w-[50%] order-1 lg:order-2 flex justify-end pr-0 pl-6 lg:pr-0 mt-10 lg:mt-0">
            <img 
              src={getPath("/Group 2085662636.png")} 
              alt="Fintech Connect dashboard"
              // 4. lg:object-right to anchor the image to the right edge
              className="w-full max-w-[600px] lg:max-w-none h-auto object-contain lg:object-right pointer-events-none"
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

      {/* Feel Protected Section */}
      <FeelProtectedSection />

      {/* Footer */}
      <FooterSection />
    </div>
   );
}