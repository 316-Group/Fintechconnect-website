import React from 'react';
import { getPath } from "@/utils/helper";

export default function BackgroundSection() {
  // PLACEHOLDER: Replace this string with your actual imported image path later
  const backgroundImageSrc = getPath("/background.png");

  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[62vh] flex items-center justify-center overflow-hidden bg-[#1532a8] px-6 py-12 md:text-center">
      
      {/* BACKGROUND IMAGE PLACEHOLDER 
          This absolute layer sits underneath the text content.
          The 'mix-blend-luminosity' or 'opacity' options help blend your graphic with the blue background brand color.
      */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60 mix-blend-normal">
        <img 
          src={backgroundImageSrc} 
          alt="Background Infrastructure Graphic" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* INNER CONTENT WRAPPER */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:items-center md:justify-center">
        
        {/* Main Hero Header */}
        <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] max-w-4xl mb-6 md:mb-8">
          Accelerate Your FinTech Launch with Infrastructure That Grows With You
        </h1>

        {/* Subtitle Paragraph Description */}
        <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-8 md:mb-10 whitespace-pre-line">
          Skip building core banking.{"\n"}
          Use Fintech Connect to launch fast, stay compliant, and scale globally.
        </p>

        {/* Action Button CTA */}
        <button 
          onClick={() => console.log("Book Demo Clicked")}
          className="bg-white text-black text-sm md:text-base font-bold px-8 py-3.5 rounded-lg shadow-lg hover:bg-slate-50 active:scale-[0.98] transition-all duration-200"
        >
          Book Demo
        </button>

      </div>
    </section>
  );
}