"use client";

import React, { useState } from 'react';
import { getPath } from "@/utils/helper";

interface CardData {
  title: string;
  description: string;
  author: string;
  role: string;
  bgImage: string;
}

export default function HoverSection() {
  // Tracks which card is currently hovered. Default to the first card (index 0).
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const cards: CardData[] = [
    {
      title: "Launch with Fintech Connect",
      description: "Issue branded virtual and physical cards without owning any card infrastructure. Configure spend controls, and go live with your card programme in weeks.",
      author: "Noah Garden",
      role: "Chief Product Officer",
      bgImage: getPath("/cards/insurancecompanies.png")
    },
    {
      title: "Scale global operations seamlessly",
      description: "Automate multi-currency payouts, connect domestic rails instantly, and eliminate cross-border friction points for your entire user base.",
      author: "Sarah Jenkins",
      role: "Head of Engineering",
      bgImage: getPath("/cards/neobanks.png")
    },
    {
      title: "Uncompromising security and compliance",
      description: "Leverage bank-grade security protocols, built-in KYC, and robust fraud mitigation infrastructure out of the box.",
      author: "Marcus Vance",
      role: "Director of Compliance",
      bgImage: getPath("/cards/finance.png")
    },
    {
      title: "Maximize checkout conversion rates",
      description: "Offer dynamic local payment methods, optimized smart routing, and seamless layout elements designed to convert.",
      author: "Elena Rostova",
      role: "VP of Product",
      bgImage: getPath("/cards/web3.png")
    }
  ];

  return (
    <section className="w-full bg-[#fcfcfd] py-20 px-6 md:px-12 flex flex-col md:items-center overflow-hidden">
      
      {/* HEADER BLOCK */}
      <div className="md:text-center mb-16 max-w-3xl">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider block mb-3">
          Customer Stories
        </span>
        <h2 className="text-3xl pl-0 md:text-4.5xl font-bold text-slate-900 tracking-tight leading-[1.2]">
          Hear from Founders <><br /></> Who’ve Launched with Fintech Connect
        </h2>
      </div>

      {/* ACCORDION CARDS CONTAINER */}
      <div className="w-full max-w-full pl-0 md:pl-8 h-[770px] md:h-[520px] flex flex-col md:flex-row gap-4">
        {cards.map((card, idx) => {
          const isActive = activeIndex === idx;
          
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`relative h-full rounded-2xl overflow-hidden bg-black cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
                ${isActive ? 'flex-[4.5] md:flex-[4.5]' : 'flex-[1] md:flex-[1]'}`}
            >
              
              {/* Card Background Image & Abstract Overlay Mesh */}
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none transition-transform duration-700 ease-out">
                <img
                  src={card.bgImage}
                  alt={card.author}
                  className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
                />
                {/* Vignette / Dark bottom gradient to keep text crisp */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              </div>

              {/* CARD CONTENT */}
              <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end h-full w-full">
                
                {/* Wrapper containing content that hides/shows based on state */}
                <div className={`flex flex-col w-full transition-all duration-500 origin-left ${
                  isActive ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}>
                  
                  <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight leading-snug max-w-2xl mb-4 md:mb-26">
                    {card.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm md:text-base font-normal max-w-xl leading-relaxed mb-8">
                    {card.description}
                  </p>

                  <div className="border-t border-white/10 pt-4 flex items-center gap-2">
                    <span className="text-white font-bold text-sm md:text-base">
                      {card.author},
                    </span>
                    <span className="text-slate-400 text-sm md:text-base">
                      {card.role}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}