import React from 'react';
import { getPath } from '@/utils/helper';

export default function AboutUs() {
  return (
    <div className="w-full bg-white text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* SECTION 1: HERO CONTAINER ("We are here to help") */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text Base */}
        <div className="lg:col-span-5 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Here to innovate 
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal max-w-xl">
            Fintech connect is a platform that helps businesses and individuals connect with the right technology solutions to drive growth and success. We are dedicated to providing innovative and tailored solutions that meet the unique needs of our clients across various industries. Our team of experienced professionals is committed to delivering exceptional service and support to help our clients achieve their goals.
          </p>
          <div>
            <button className="bg-blue-500 hover:bg-[#43a047] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none">
              Book a call
            </button>
          </div>
        </div>

        {/* Right Column Layout Collage Overlap Graphic */}
        <div className="lg:col-span-7 relative h-[380px] sm:h-[450px] md:h-[500px] w-full flex items-center justify-center">
          {/* Main Backframe Element (Top Right Profile Graphic) */}
          <div className="absolute top-4 right-4 w-[60%] h-[65%] rounded-2xl bg-slate-100 shadow-xl overflow-hidden border border-slate-200/40">
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-medium text-sm">
              <img 
                src={getPath("/whyUs image.png")} 
                alt="Profile Graphic Placeholder" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Foreground Frame Offset Element (Bottom Center Workspace Graphic) */}
          <div className="absolute bottom-4 left-10 w-[52%] h-[55%] rounded-2xl shadow-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium text-sm">
              <img 
                src={getPath("/frontend.png")} 
                alt="Profile Graphic Placeholder" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: MID BANNER BACKGROUND MATRICES ("A bit about us") */}
      <section className="w-full bg-blue-200 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Diamond Layout Image Cluster */}
          <div className="lg:col-span-5 flex items-center justify-center py-8">
            <div className="grid grid-cols-2 gap-4 transform rotate-45 scale-90 sm:scale-100">
              {/* Card 1 Top Left */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-slate-200/90 shadow-md overflow-hidden border border-white/60">
                <div className="w-full h-full transform -rotate-45 scale-150 flex items-center justify-center text-slate-400 text-xs text-center font-medium px-2">
                  <img 
                src={getPath("/cards/moneytransfer.png")} 
                alt="Profile Graphic Placeholder" 
                className="w-full h-full object-cover"
              />
                </div>
              </div>
              {/* Card 2 Top Right */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-slate-300/90 shadow-md overflow-hidden border border-white/60">
                <div className="w-full h-full transform -rotate-45 scale-150 flex items-center justify-center text-slate-500 text-xs text-center font-medium px-2">
                  <img 
                src={getPath("/cards/fintech.png")} 
                alt="Profile Graphic Placeholder" 
                className="w-full h-full object-cover"
              />
                </div>
              </div>
              {/* Card 3 Bottom Left */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-slate-300/90 shadow-md overflow-hidden border border-white/60">
                <div className="w-full h-full transform -rotate-45 scale-150 flex items-center justify-center text-slate-500 text-xs text-center font-medium px-2">
                  <img 
                src={getPath("/cards/insurance.png")} 
                alt="Profile Graphic Placeholder" 
                className="w-full h-full object-cover"
              />
                </div>
              </div>
              {/* Card 4 Bottom Right */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-slate-200/90 shadow-md overflow-hidden border border-white/60">
                <div className="w-full h-full transform -rotate-45 scale-150 flex items-center justify-center text-slate-400 text-xs text-center font-medium px-2">
                  <img 
                src={getPath("/cards/commercial.png")} 
                alt="Profile Graphic Placeholder" 
                className="w-full h-full object-cover"
              />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Content Panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-block">
              <span className="text-emerald-700 text-sm font-bold tracking-wider uppercase border-b-2 border-emerald-500 pb-0.5">
                About us
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              Empowering individuals and businesses with innovative and tailored solutions across industries
            </h2>
            <div className="text-slate-600 text-base leading-relaxed space-y-4 pt-2 font-normal">
              <p>
                We are a technology first company with several years of experience in providing digital solutions for businesses in their drive towards digital transformation.
              </p>
              <p>
                Our solutions and products have proven to help businesses reduce cost and increase efficiency cut across several industries including tech, retail, storage, supply chain, banking, payments, fulfilment and fashion. We are a team of experienced professionals dedicated to providing innovative and customized solutions to help businesses thrive.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: CORE COMPASS HOVERS ("Our Values") */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 lg:px-8">
        {/* Core Value Title Structure */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight relative inline-block">
            Our Values
            <span className="absolute bottom-[-6px] left-0 w-2/3 h-[3px] bg-emerald-600 rounded-full" />
          </h2>
        </div>

        {/* 3 Column Grid Structuring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card Module 1: Integrity */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
            {/* Structural Graphic Loop Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
              
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                Integrity
              </h3>
              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                Integrity is one of our core values at our organization. We believe that it is essential to building and maintaining successful business relationships. We strive to act with honesty, transparency, and ethical behaviour in all our dealings with clients, partners, and employees.
              </p>
            </div>
          </div>

          {/* Card Module 2: Transparency */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
            {/* Structural Graphic Loop Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
              
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                Transparency
              </h3>
              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                We believe that open and honest communication is essential to building trust and maintaining strong relationships with our clients, partners, shareholders and stakeholders in general. We are upfront with our clients about our capabilities, limitations, and pricing.
              </p>
            </div>
          </div>

          {/* Card Module 3: Ethics */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
            {/* Structural Graphic Loop Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
              
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                Ethics
              </h3>
              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                We adhere to ethical standards in all our business practices. We have a code of ethics that guides our behaviour and decision-making. This code emphasizes the importance of honesty, fairness, and respect in all our dealings with clients, partners, and employees.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}