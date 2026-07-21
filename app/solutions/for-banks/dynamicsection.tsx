"use client";

import React, { useState, useEffect, useRef } from 'react';
//import { Globe } from "@/components/ui/globe";

export default function DynamicSection() {
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
      { threshold: 0.15 } // Fires when 15% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Shared Animation utility class string
  const getAnimatedClass = (visible: boolean) => 
    `transition-all duration-700 ease-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
    }`;

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-[#fcfcfd] py-10 md:py-16 px-6 md:px-5 overflow-hidden min-h-[75vh] flex items-center"
    >
      
      {/* GLOBE CONTAINER 
          Wrapped in a dedicated animation container to protect its original absolute values.
      */}
      <div 
        className={`absolute top-3/5 md:top-145 -translate-y-2/3 -right-29 md:-right-85 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] pointer-events-none z-0 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ transitionDelay: '400ms' }}
      >
        {/* <Globe className="w-full h-full" /> */}
      </div>

      {/* CONTENT INNER WRAPPER */}
      <div className="relative z-10 max-w-full mx-auto px-1 md:px-16 w-full flex flex-col md:gap-24">
        
        {/* Top Text Block */}
        <div className="max-w-2xl">
          <h2 
            className={`text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-6 ${getAnimatedClass(isVisible)}`}
            style={{ transitionDelay: '0ms' }}
          >
            Tap into the world’s local payments network
          </h2>
          <p 
            className={`text-sm md:text-base text-slate-500 leading-relaxed font-normal mb-6 ${getAnimatedClass(isVisible)}`}
            style={{ transitionDelay: '150ms' }}
          >
            Airwallex’s proprietary local payments network offers you a faster, more cost-effective, and
            transparent alternative to legacy banking. Operate like a local business from anywhere in the
            world - open accounts with local bank details in minutes, accept payments in local currency to
            avoid costly forced conversion fees, hold funds in a multi-currency wallet, convert currencies
            at interbank rates, and make high-speed transfers around the world in a few clicks.
          </p>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 w-full max-w-full">
          
          {/* Stat 1 */}
          <div 
            className={`flex flex-col max-w-[210px] ${getAnimatedClass(isVisible)}`}
            style={{ transitionDelay: '300ms' }}
          >
            <span className="text-4xl md:text-5xl font-bold text-[#ff5a36] mb-3">
              70+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              countries where you can collect funds like a local
            </span>
          </div>

          {/* Stat 2 */}
          <div 
            className={`flex flex-col max-w-[210px] ${getAnimatedClass(isVisible)}`}
            style={{ transitionDelay: '400ms' }}
          >
            <span className="text-4xl md:text-5xl font-bold text-[#e6007a] mb-3">
              120+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              countries to which you can make local transfers
            </span>
          </div>

          {/* Stat 3 */}
          <div 
            className={`flex flex-col max-w-[210px] ${getAnimatedClass(isVisible)}`}
            style={{ transitionDelay: '500ms' }}
          >
            <span className="text-4xl md:text-5xl font-bold text-[#4a00e0] mb-3">
              $235B+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              global payments processed annually
            </span>
          </div>

          {/* Stat 4 */}
          <div 
            className={`flex flex-col max-w-[210px] ${getAnimatedClass(isVisible)}`}
            style={{ transitionDelay: '600ms' }}
          >
            <span className="text-4xl md:text-5xl font-bold text-[#9400d3] mb-3">
              180+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              countries from which you can accept payments
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}