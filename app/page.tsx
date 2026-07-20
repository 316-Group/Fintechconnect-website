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
import FAQSection from '@/app/Faqsection';

import { useState, useEffect } from 'react';
import APISection from './APISection';
import PartnerSection from './partnersection';
import ComparisonSection from './comparisonsection';

export default function MarketingHome() {
  // Trigger state for structural entry animations
  const [isAnimate, setIsAnimate] = useState(false);

  // Typewriter Loop States
  const words = ['Fintechs', 'Neobanks', 'Crypto Banks'];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    // Fire the animation sequence immediately when the DOM components load
    setIsAnimate(true);
  }, []);

  // Typewriter effect logic
  useEffect(() => {
    const handleTyping = () => {
      const currentFullWord = words[wordIndex];

      if (!isDeleting) {
        // --- TYPING MODE ---
        // Get one character extra than current length
        setCurrentText(currentFullWord.substring(0, currentText.length + 1));
        setTypingSpeed(120); // Normal typing speed

        // If word is completely typed, transition to erasing after a delay
        if (currentText === currentFullWord) {
          setIsDeleting(true);
          setTypingSpeed(1500); // Hold the completed word for 1.5 seconds
        }
      } else {
        // --- ERASING MODE ---
        // Strip one character away
        setCurrentText(currentFullWord.substring(0, currentText.length - 1));
        setTypingSpeed(60); // Faster erasing speed

        // If word is completely erased, transition to typing next word after a brief pause
        if (currentText === '') {
          setIsDeleting(false);
          setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          setTypingSpeed(400); // Pause briefly before starting to type the next word
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, typingSpeed]);

  return (
    <div className="bg-black">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black text-white pt-5 pb-10 lg:pt-32 lg:pb-32 overflow-hidden w-full">
      
      <div className="w-full flex flex-col lg:flex-row items-start justify-between">
        
        {/* 1. Text Box (Fades and drifts up softly) */}
        <div 
          className={`w-full lg:w-[55%] flex flex-col items-start z-10 order-1 lg:order-1 mt-6 lg:mt-20 pl-6 lg:pl-20 pr-6 lg:pr-10 transition-all duration-1000 ease-out ${
            isAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center rounded-md border border-slate-800 bg-black px-3 py-2 text-xs text-[#00ebcd] font-light mb-6 tracking-wide">
            Modular. Integrated. Compliant.
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            White label bespoke <br className="hidden lg:block" /> 
            solutions for{' '}
            {/* Typewriter element container */}
            <span className="text-[#0066ff] inline-flex items-center border-r-2 border-[#0066ff] pr-1 animate-pulse">
              {currentText || "\u00A0"}
            </span>
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

        {/* 2. Image Container (Staggered layout: Fades and slides left with a slight delay) */}
        <div 
          className={`w-full lg:w-[50%] order-1 lg:order-2 flex justify-end pr-0 pl-6 lg:pr-0 mt-10 lg:mt-0 transition-all duration-1000 delay-300 ease-out ${
            isAnimate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <img 
            src={getPath("/Group 2085662636.png")} 
            alt="Fintech Connect dashboard"
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

      {/* APISection */}
      <APISection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Partner Section */}
      <PartnerSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Feel Protected Section */}
      <FeelProtectedSection />

      {/* Footer */}
      <FooterSection />
    </div>
   );
}