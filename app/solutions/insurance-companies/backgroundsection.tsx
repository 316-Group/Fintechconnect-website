"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from "@/utils/helper";

export default function BackgroundSection() {
  const backgroundImageSrc = getPath("/background.png");

  // 1. Core visibility state and section reference hooks
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.15 } // Fires when 15% of the section is visible in view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Shared Animation utility class string for content parts
  const getAnimatedClass = (visible: boolean) => 
    `transition-all duration-700 ease-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
    }`;

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[60vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1532a8] px-6 py-12 md:text-center"
    >
      
      {/* BACKGROUND IMAGE PLACEHOLDER 
          Fades and scales dynamically to create an immersive depth effect as text drops.
      */}
      <div 
        className={`absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-normal transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-60 scale-100' : 'opacity-0 scale-105'
        }`}
      >
        <img 
          src={backgroundImageSrc} 
          alt="Background Infrastructure Graphic" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* INNER CONTENT WRAPPER */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:items-center md:justify-center">
        
        {/* Main Hero Header */}
        <h1 
          className={`text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] max-w-4xl mb-6 md:mb-8 ${getAnimatedClass(isVisible)}`}
          style={{ transitionDelay: '0ms' }}
        >
          Accelerate Your FinTech Launch with Infrastructure That Grows With You
        </h1>

        {/* Subtitle Paragraph Description */}
        <p 
          className={`text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-8 md:mb-10 whitespace-pre-line ${getAnimatedClass(isVisible)}`}
          style={{ transitionDelay: '150ms' }}
        >
          Skip building core banking.{"\n"}
          Use Fintech Connect to launch fast, stay compliant, and scale globally.
        </p>

        {/* Action Button CTA */}
        <button 
          onClick={() => console.log("Book Demo Clicked")}
          className={`bg-white text-black text-sm md:text-base font-bold px-8 py-3.5 rounded-lg shadow-lg hover:bg-slate-50 active:scale-[0.96] transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
          }`}
          style={{ 
            transitionDelay: '300ms',
            transitionProperty: 'opacity, transform, background-color' 
          }}
        >
          Book Demo
        </button>

      </div>
    </section>
  );
}