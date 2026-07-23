"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/app/navbar";
import { getPath } from "@/utils/helper";
import ParallaxSection from "@/app/solutions/neobanks/parallaxsection";
import DynamicSection from "@/app/solutions/neobanks/dynamicsection";
import { Globe } from "@/components/ui/globe";
import Footersection from "@/app/Footersection";
import Newmodulessection from "@/app/solutions/neobanks/newmodulessection";
import BackgroundSection from "@/app/solutions/neobanks/backgroundsection";
import HoverSection from "@/app/solutions/neobanks/hoversection";
import NewfeaturesSection from "@/app/solutions/neobanks/newfeaturessection";
import Newpartnersection from "@/app/solutions/neobanks/newpartnersection";

export default function ForNeobanks() {
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
            Power your insurance business with <span className="text-blue-600">embedded finance and real-time payments</span>
          </h1>
          
          {/* 2. Subtitle Description Paragraph */}
          <p 
            className={`text-slate-600 font-normal text-base md:text-lg mb-8 leading-relaxed md:max-w-[85%] mx-auto ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '150ms' }}
          >
           Fintech Connect gives banks a modular, production-ready platform to launch digital products, automate compliance, and serve customers better — without rebuilding your core from scratch.
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
              src={getPath("/solutions/.png")} 
              alt="Fintech Connect dashboard visualization mobile"
              className="w-full h-auto transform scale-128 origin-left" 
            />
          </div>

          {/* DESKTOP ONLY IMAGE */}
          <img 
            src={getPath("/solutions/neobanks.png")} 
            alt="Fintech Connect dashboard visualization"
            className="hidden md:block w-full max-h-230 mx-auto md:pl-70 md:py-0 md:mb-0 md:object-contain rounded-2xl shadow-2xl shadow-slate-300/60"
/>
        </div>

      </div>

      {/* NEW SECTION: Brand Value Proposition Section */}
      <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Left Column - Heading */}
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built to help insurance companies <br></br> compete digitally while <br></br> staying member first
            </h2>
          </div>
          
          {/* Right Column - Paragraph Description */}
          <div className="md:col-span-7">
            <p className="text-slate-800 text-base md:text-2xl leading-relaxed font-normal">
              Banks face a paradox: legacy infrastructure is too slow to compete, 
              but rebuilding from scratch takes years and costs millions. Fintech Connect 
              solves this by giving your team a modular, API-first platform that layers on 
              top of your existing systems — or replaces them entirely at your own pace.
            </p>
          </div>

        </div>
      </section>

      {/* Subsections continue downward unmodified */}
      <ParallaxSection />
      <Newmodulessection />
      <Newpartnersection />
      <NewfeaturesSection />
      <DynamicSection />
      <BackgroundSection />
      <HoverSection />
      <Footersection/>

    </div>
  );
}