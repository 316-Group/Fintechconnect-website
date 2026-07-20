"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { getPath } from '@/utils/helper';

export default function WhyUsSection() {
  // 1. Instantiating decoupled tracking state configurations
  const [part1Visible, setPart1Visible] = useState(false);
  const [part2Visible, setPart2Visible] = useState(false);

  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);

  // 2. Initialising Viewport Monitors per layout block
  useEffect(() => {
    const observer1 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPart1Visible(true);
          if (part1Ref.current) observer1.unobserve(part1Ref.current);
        }
      },
      { threshold: 0.15 }
    );

    if (part1Ref.current) observer1.observe(part1Ref.current);
    return () => observer1.disconnect();
  }, []);

  useEffect(() => {
    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPart2Visible(true);
          if (part2Ref.current) observer2.unobserve(part2Ref.current);
        }
      },
      { threshold: 0.15 }
    );

    if (part2Ref.current) observer2.observe(part2Ref.current);
    return () => observer2.disconnect();
  }, []);

  // Shared Base Utility Template String for the drop behavior
  const getAnimatedClass = (isVisible: boolean) => 
    `transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
    }`;

  return (
    <section className="relative bg-white text-black py-16 lg:py-24 overflow-hidden">
      
      {/* ========================================================
          PART 1: Content Left, Mockup & Floating Cards Right
         ======================================================== */}
      <div 
        ref={part1Ref} 
        className="w-full mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pb-30"
      >
        {/* Left Side: Content Area */}
        <div className="flex flex-col items-start max-w-xl order-2 lg:order-1">
          {/* Section Tag */}
          <span 
            className={`text-sm lg:text-base font-normal text-slate-900 mb-3 tracking-wide ${getAnimatedClass(part1Visible)}`}
            style={{ transitionDelay: '0ms' }}
          >
            Why Us
          </span>
          
          {/* Main Title */}
          <h2 
            className={`text-3xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight ${getAnimatedClass(part1Visible)}`}
            style={{ transitionDelay: '100ms' }}
          >
            Future-proof{' '}
            <span className="text-blue-500 inline-block">
              financial technology platform
            </span>
          </h2>
          
          {/* Paragraph */}
          <p 
            className={`text-slate-800 text-sm lg:text-lg leading-relaxed mb-8 font-normal ${getAnimatedClass(part1Visible)}`}
            style={{ transitionDelay: '200ms' }}
          >
            We empower financial institutions with cutting-edge tech solutions providing great 
            customer experiences, ultimate performance, and extreme scalability. Our modular 
            cloud-native digital banking platform, enables building unique fintech solutions 
            across the world. With the partner ecosystem and API orchestration layer, our 
            clients have quick access to payment services from market-leading companies.
          </p>
          
          {/* Contact Button */}
          <button 
            className={`bg-black hover:bg-slate-800 text-white text-sm lg:text-base font-semibold py-3.5 px-8 rounded-full transition-all shadow-sm active:scale-95 ${getAnimatedClass(part1Visible)}`}
            style={{ transitionDelay: '300ms' }}
          >
            Contact us
          </button>
        </div>

        {/* Right Side: Mockup & Asset Composition Area */}
        <div 
          className={`relative w-full max-w-full mx-auto lg:mx-0 order-1 lg:order-2 py-8 lg:py-0 ${getAnimatedClass(part1Visible)}`}
          style={{ transitionDelay: '150ms' }}
        >
          {/* Main Image Container */}
          <div className="w-full bg-slate-100 rounded-[36px] overflow-hidden shadow-sm border border-slate-200/50 relative">
            <img 
              src={getPath("/whyUs image.png")} 
              alt="Why Us image" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Floating Widget 1: Currencies Panel (Drops slightly after main image) */}
          <div 
            className={`absolute -top-4 -left-4 lg:-left-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-4 w-60 flex flex-col z-10 transition-transform duration-300 hover:-translate-y-1 ${
              part1Visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-8 pointer-events-none'
            }`}
            style={{ transitionDelay: '350ms', transitionProperty: 'opacity, transform' }}
          >
            {/* GBP Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇬🇧</span>
                <span className="font-semibold text-slate-900 text-sm lg:text-base">
                  26,529<span className="text-slate-400 font-normal">.00</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider">GBP</span>
            </div>
            
            {/* USD Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇺🇸</span>
                <span className="font-semibold text-slate-900 text-sm lg:text-base">
                  5,530<span className="text-slate-400 font-normal">.00</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider">USD</span>
            </div>

            {/* EUR Row */}
            <div className="flex items-center justify-between py-2 pt-2.5">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇪🇺</span>
                <span className="font-semibold text-slate-900 text-sm lg:text-base">
                  14,109<span className="text-slate-400 font-normal">.00</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider">EUR</span>
            </div>
          </div>

          {/* Floating Widget 2: "Done" Success Notification */}
          <div 
            className={`absolute -bottom-6 -right-4 lg:-right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-slate-100 px-6 py-4 flex flex-col items-center justify-center min-w-[110px] z-10 transition-transform duration-300 hover:-translate-y-1 ${
              part1Visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-6 pointer-events-none'
            }`}
            style={{ transitionDelay: '500ms', transitionProperty: 'opacity, transform' }}
          >
            <div className="w-10 h-10 bg-[#00ebd0] rounded-full flex items-center justify-center text-white mb-2 shadow-sm shadow-[#00ebd0]/20">
              <Check className="w-5 h-5 stroke-[3.5]" />
            </div>
            <span className="font-medium text-slate-800 text-sm">Done</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          PART 2: Extended Section (Image Left, Text Right)
         ======================================================== */}
      <div 
        ref={part2Ref} 
        className="w-full mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        {/* Left Side: 1 Large Dashboard Image */}
        <div 
          className={`relative max-w-full mx-auto lg:mx-0 py-4 ${getAnimatedClass(part2Visible)}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="w-full">
            <img 
              src={getPath("/transfersimage.png")} 
              alt="Transfers dashboard image" 
              className="w-full h-full object-cover object-center"
            /> 
          </div>
        </div>

        {/* Right Side: New Design Text Content Area */}
        <div className="flex flex-col items-start max-w-full">
          {/* Context Tag Line */}
          <span 
            className={`text-sm lg:text-base font-normal text-slate-500 mb-3 tracking-wide ${getAnimatedClass(part2Visible)}`}
            style={{ transitionDelay: '0ms' }}
          >
            Get more with 316 Money
          </span>
          
          {/* Section Main Header */}
          <h2 
            className={`text-3xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight ${getAnimatedClass(part2Visible)}`}
            style={{ transitionDelay: '150ms' }}
          >
            No middleman, One platform, proprietary software.
          </h2>
          
          {/* Text Paragraph */}
          <p 
            className={`text-slate-700 text-sm lg:text-base leading-relaxed mb-8 font-normal ${getAnimatedClass(part2Visible)}`}
            style={{ transitionDelay: '300ms' }}
          >
            Hold multiple currencies in cash to use for your international banking needs. 
            Get unbeatable exchange rates when you convert, effortlessly make payments 
            from your currency wallets at no extra cost.
          </p>
          
          {/* Action Button */}
          <button 
            className={`bg-black hover:bg-slate-800 text-white text-sm lg:text-base font-semibold py-3.5 px-8 rounded-full transition-all shadow-sm active:scale-95 ${getAnimatedClass(part2Visible)}`}
            style={{ transitionDelay: '400ms' }}
          >
            Learn more
          </button>
        </div>
      </div>

    </section>
  );
}