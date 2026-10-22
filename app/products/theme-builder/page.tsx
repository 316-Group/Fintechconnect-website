'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from "@/utils/helper";
import Navbar from "@/app/navbar";
import Footersection from "@/app/Footersection";
import HoverSection from "@/app/solutions/fintech-startups/hoversection";
import BackgroundSection from './backgroundsection';
import CardsSection from './cardssection';
import ThemeSection from './themesection';
import NewPlatformSection from './newplatformsection';


export default function WhiteLabelHero() {
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
    <div className="bg-white">
      <Navbar />

      <div ref={heroRef} className="w-full">
        <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
          <div className="max-w-full mx-auto flex flex-col items-center space-y-12">
            
            {/* CENTERED HEADER, SUBTITLE & CTA */}
            <div className="max-w-5xl text-center space-y-6">
              <h1 
                className={`text-4xl sm:text-5xl lg:text-5xl text-slate-900 font-bold tracking-tight leading-[1.15] ${getAnimatedClass(heroVisible)}`}
                style={{ transitionDelay: '0ms' }}
              >
                Create A Theme And See It Across<br />
                <span className="text-blue-600">Everything Before You Commit.</span>
              </h1>

              <p 
                className={`text-base sm:text-lg text-slate-500 font-normal leading-relaxed max-w-6xl mx-auto ${getAnimatedClass(heroVisible)}`}
                style={{ transitionDelay: '150ms' }}
              >
                Define colour, type, spacing and shape once as design tokens. They are designed to carry across your mobile app, web portal, cards and notifications, so every screen stays consistent.
              </p>

              <div 
                className={`pt-2 ${getAnimatedClass(heroVisible)}`}
                style={{ transitionDelay: '300ms' }}
              >
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Book demo
                </button>
              </div>
            </div>

            {/* CENTERED HERO GRAPHIC / MOCKUP ASSET */}
            <div 
              className={`w-full overflow-hidden flex justify-center ${getAnimatedClass(heroVisible)}`}
              style={{ transitionDelay: '450ms' }}
            >
              <img
                src={getPath('/products/themebuilderhero.png')}
                alt="White Label Banking Experience Preview"
                className="w-full h-auto object-contain max-h-[760px] rounded-3xl"
                onError={(e) => {
                  // Fallback visual indicator until the image asset is imported
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

          </div>
        </section>
      </div>
      
      <CardsSection />
      <ThemeSection />
      <NewPlatformSection />
      <HoverSection />
      <BackgroundSection />
      <Footersection />
    </div>
  );
}