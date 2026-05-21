import { getPath } from '@/utils/helper';
import React from 'react';

export default function FeelProtectedSection() {
  return (
    <section className="w-full bg-[#a4f6f0] text-slate-900 py-10 lg:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
        
        {/* Left Column: Messaging & Compliance Metrics */}
        <div className="flex flex-col items-start max-w-3xl lg:max-w-none z-10">
          
          {/* Section Main Title */}
          <h2 className="text-2xl lg:text-[34px] font-bold tracking-tight leading-[1.15] mb-8">
            Feel protected.{' '}
            <span className="text-[#00c04b] inline">
              Stay compliant.
            </span>
          </h2>

          {/* Inline Compliance Highlights (Separated by matching middle dots) */}
          <p className="text-slate-850 text-base lg:text-[19px] font-normal leading-relaxed tracking-tight">
            High authorization rates <span className="mx-1.5 text-slate-700/60 font-bold">·</span> 
            Full compliance with PSD2, PCI Level 1, SCA, and 3D Secure 2.0 <span className="mx-1.5 text-slate-700/60 font-bold">·</span> 
            Regulator-compliant
          </p>
        </div>

        {/* Right Column: 3D Abstract Cube Graphic Placeholder */}
        <div className="relative w-full flex items-center justify-center lg:justify-end min-h-[200px] sm:min-h-[200px]">
          <div className="w-full max-w-[300px] aspect-square relative flex items-center justify-center">
            
            {/* 3D glass cube image asset */}
            <img 
              src={getPath("/blocks image.png")} 
              alt="Translucent interlocking 3D compliance and security glass cubes illustration" 
              className="w-full h-full object-contain object-center drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)] animate-fade-in"
              
            />

          </div>
        </div>

      </div>
    </section>
  );
}