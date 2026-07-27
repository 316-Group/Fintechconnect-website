import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/speed icon.png',
    title: 'Transfers delivered in seconds',
    description: 'Real-time payment rails and pre-integrated mobile money networks mean transfers reach recipients in seconds — not days. Compete with the fastest fintechs in the world from day one.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'FX spreads from 0.1%',
    description: 'Live mid-market rates with configurable spreads give you the pricing power to undercut legacy providers and win on cost — while maintaining healthy margins through volume.',
  },
  {
    iconPath: '/icons/compliance icon.png', 
    title: 'Automated AML — zero manual overhead',
    description: 'Automated sanctions screening, transaction monitoring, and regulatory reporting eliminate the manual compliance burden that slows down most MTOs. Stay compliant at scale without growing your compliance team.',
  },
  {
    iconPath: '/icons/flexible icon.png',
    title: '500M+ mobile money recipients reachable',
    description: "Pre-integrated with 7 major African mobile money networks covering 34 countries. Reach recipients who don't have bank accounts — the fastest-growing remittance market in the world.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-50/40 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Faster transfers. Lower costs. <br className="hidden md:inline" />
             <span className="text-blue-600">Wider reach.</span>
          </h2>
          
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            MTOs that build on Fintech Connect deliver faster transfers at lower cost — while staying fully compliant across every corridor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <img 
                    src={getPath(feature.iconPath)} 
                    alt={`${feature.title} icon`} 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;