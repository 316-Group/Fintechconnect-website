import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/compliance icon.png',
    title: 'Institutional-grade MPC custody',
    description: 'MPC wallets with hot/cold tiering, HSM key management, and multi-signature approval workflows protect client assets at institutional scale — without the operational complexity of building custody in-house.',
  },
  {
    iconPath: '/icons/flexible icon.png', 
    title: 'FATF Travel Rule compliant from day one',
    description: 'Pre-certified for FATF Travel Rule, EU MiCA, and global crypto AML requirements. On-chain transaction monitoring, sanctions screening, and automated regulatory reporting — all built in.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'Seamless fiat-crypto bridge',
    description: 'Instant fiat on/off ramps via bank transfer, card, and open banking — with competitive FX rates and full compliance at every conversion point. Give your users a seamless experience between fiat and crypto.',
  },
  {
    iconPath: '/icons/speed icon.png',
    title: 'Launch in 6-10 weeks',
    description: 'A complete crypto bank infrastructure — custody, fiat rails, KYC, AML, cards, and ledger — deployable in 6–10 weeks. No 2-year build cycles, no $3M+ engineering bills.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-50/40 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Everything your crypto wallet and card product needs. <br className="hidden md:inline" />
            One platform.
          </h2>
          
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            Crypto banks that build on Fintech Connect get the best of both worlds — without building either from scratch.
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