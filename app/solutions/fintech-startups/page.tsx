"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          if (heroRef.current) observer.unobserve(heroRef.current);
        }
      },
      { threshold: 0.05 } // Triggers immediately as the top of the content mounts
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Shared animation helper template string
  const getAnimatedClass = (isVisible: boolean) => 
    `transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
    }`;

  return (
    <div className="bg-blue-100 font-sans">
      
      <Navbar />

      {/* Master Content Wrapper - Added 'border-b-[5px] border-blue-600' to serve as the divider line */}
      <div ref={heroRef} className="pt-10 md:pt-12 w-full border-b-[5px] border-blue-600">
        
        {/* Hero Header & Description Section */}
        <section className="md:text-center pl-6 md:pt-12 pb-12 px-4 max-w-5xl mx-auto">
          {/* 1. Main Title Element */}
          <h1 
            className={`text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight max-w-full ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '0ms' }}
          >
            White label bespoke solutions for <span className="text-blue-600">Fintechs</span>
          </h1>
          
          {/* 2. Subtitle Description Paragraph */}
          <p 
            className={`text-slate-600 font-normal text-base md:text-lg mb-8 leading-relaxed md:max-w-[85%] mx-auto ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '150ms' }}
          >
            We are infrastructure builders for the financial industry. Fintech Connect by 316 Group gives 
            banks, fintechs, and financial institutions a modular, production ready platform to design.
          </p>
          
          {/* 3. Book Demo CTA Button */}
          <button 
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all shadow-sm shadow-blue-600/20 text-sm active:scale-95 ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '300ms' }}
          >
            Book demo
          </button>
        </section>

        {/* 4. Showcase Image Container Block (Both Mobile and Desktop animate together) */}
        <div 
          className={`${getAnimatedClass(heroVisible)}`}
          style={{ transitionDelay: '450ms' }}
        >
          {/* MOBILE ONLY IMAGE */}
          <div className="block md:hidden w-full overflow-hidden rounded-2xl shadow-2xl shadow-slate-300/60 pl-4 pr-0 pt-10 pb-20">
            <img 
              src={getPath("/mobileimage.png")} 
              alt="Fintech Connect dashboard visualization mobile"
              className="w-full h-auto transform scale-128 origin-left" 
            />
          </div>

          {/* DESKTOP ONLY IMAGE */}
          <img 
            src={getPath("/solutions/solutionsmodule.png")} 
            alt="Fintech Connect dashboard visualization"
            className="hidden md:block w-full h-auto md:px-20 md:py-12 md:mb-0 md:object-contain rounded-2xl shadow-2xl shadow-slate-300/60"
          />
        </div>

      </div>

      {/* NEW SECTION: Brand Value Proposition Section */}
      <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Left Column - Heading */}
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built to Help Startups <br></br> Accelerate Growth <br></br> Responsibly
            </h2>
          </div>
          
          {/* Right Column - Paragraph Description */}
          <div className="md:col-span-7">
            <p className="text-slate-800 text-base md:text-2xl leading-relaxed font-normal">
              Fintech Connect empowers fintech startups to move fast and stay compliant. Our 
              multi-bank integration lets you offer diverse account types and payment 
              rails globally - without waiting for licenses or building infrastructure 
              from scratch. You keep full control and ownership while we handle the 
              backend complexity.
            </p>
          </div>

        </div>
      </section>

      {/* Subsections continue downward unmodified */}
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