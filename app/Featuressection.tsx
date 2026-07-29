"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/speed icon.png',
    title: 'Speed to Market',
    description: 'Our pre-built modules and ready-made UI components eliminate the infrastructure groundwork entirely, so your team ships faster than the competition.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'Cost Efficient',
    description: 'Avoid the upfront cost of building financial infrastructure from scratch. Fintech Connect operates on a transparent, modular model, you only pay for the modules you use.',
  },
  {
    iconPath: '/icons/flexible icon.png', 
    title: 'Flexible & Modular',
    description: 'Pick only the modules your product needs. Start with a single module and expand over time, or launch a full-stack solution from day one. Every module is independently deployable and works seamlessly with the others.',
  },
  {
    iconPath: '/icons/crypto icon.png', 
    title: 'Fiat & Crypto in one platform',
    description: 'Our infrastructure is purpose-built to support both traditional banking and digital assets natively. Manage fiat accounts, crypto wallets, and on/off ramps from a single, unified platform.',
  },
  {
    iconPath: '/icons/compliance icon.png',
    title: 'Compliance Ready',
    description: 'Every module ships with pre-certified compliance tools : KYC/KYB, AML screening, transaction monitoring, and audit-ready reporting. Stay ahead of regulators from day one.',
  },
  {
    iconPath: '/icons/regulatory icon.png', 
    title: 'Regulatory Readiness',
    description: 'Fintech Connect meets the essential regulatory requirements for modular core banking and crypto platforms across multiple jurisdictions. Our infrastructure is built to support EMI, BaaS, and crypto licensing frameworks globally.',
  },
];

// 1. Isolated Child Component to prevent batch re-renders
const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "0px 0px -30px 0px" 
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Grid row-aware stagger delay (resets every 3 items for a 3-column desktop layout)
  const staggerDelay = (index % 3) * 150;

  return (
    <div 
      ref={cardRef} 
      className={`p-8 bg-white rounded-2xl border border-blue-50/50 shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/70 transition-[transform,opacity] duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-16 pointer-events-none'
      }`}
      style={{ transitionDelay: `${staggerDelay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <img 
            src={getPath(feature.iconPath)} 
            alt={`${feature.title} icon`} 
            className="w-24 h-24 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
        <p className="text-gray-600 text-base leading-relaxed flex-grow">{feature.description}</p>
      </div>
    </div>
  );
};

// 2. Main Parent Section Component
const FeaturesSection = () => {
  return (
    <section className="bg-white py-10 md:py-24 overflow-hidden">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="md:text-center mb-6 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Build from scratch, launch in <span className="text-gray-900 line-through">months</span> <span className="text-blue-600">weeks</span>
          </h2>
          <p className="mt-6 mb-6 md:text-center mx-auto max-w-3xl text-lg md:text-xl text-gray-600">
            Fintech Connect gives your team a modular, pre-integrated platform of financial building blocks. Pick the modules you need, configure them to your brand, and go live with a fully regulated fintech product
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;