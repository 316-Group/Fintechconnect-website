import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/compliance icon.png',
    title: 'MPC security without the complexity',
    description: 'Institutional-grade MPC wallets with hot/warm/cold tiering give your users instant access for everyday spending and maximum security for long-term holdings — without you building any custody infrastructure.',
  },
  {
    iconPath: '/icons/flexible icon.png', 
    title: 'Visa & Mastercard issuing in weeks',
    description: 'Skip the 12-month BIN sponsorship process. Fintech Connect provides a pre-established card issuing infrastructure with Visa and Mastercard — so you can launch physical and virtual crypto cards in weeks.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'Real-time conversion at point of sale',
    description: 'Your users tap their card and pay in local currency — instantly. Fintech Connect handles the real-time crypto-to-fiat conversion, FX hedging, and settlement behind the scenes at competitive mid-market rates.',
  },
  {
    iconPath: '/icons/speed icon.png',
    title: 'Launch in 4–8 weeks',
    description: 'A complete crypto wallet and card infrastructure — MPC custody, card issuing, FX conversion, AML, KYC, staking — deployable in 4–8 weeks. No multi-year build cycles, no $2M+ engineering bills.',
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