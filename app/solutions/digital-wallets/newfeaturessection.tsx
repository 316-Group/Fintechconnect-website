import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/speed icon.png',
    title: 'Launch in 4–6 weeks',
    description: 'A complete wallet infrastructure — wallet engine, card issuing, KYC, payments, FX, and fraud — deployable via API in 4–6 weeks. No 18-month build cycles, no $1M+ engineering bills.',
  },
  {
    iconPath: '/icons/compliance icon.png', 
    title: 'Compliance included from day one',
    description: 'PCI-DSS, ISO 27001, SOC 2 Type II, GDPR, and AML/KYC compliance are pre-certified and built into the platform. No separate compliance build required — your wallet is compliant before you write a single line of code.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'AI fraud protection at <50ms',
    description: 'Every wallet transaction is scored by our AI fraud engine in under 50ms — with 99.4% detection accuracy and a false positive rate below 0.1%. Protect your users and your margins without slowing down the payment experience.',
  },
  {
    iconPath: '/icons/flexible icon.png',
    title: 'Scales to 10M+ wallet users',
    description: 'Built on cloud-native microservices with 99.99% uptime SLA. The same infrastructure that powers your first 1,000 wallets scales to 10 million — with no re-architecture required.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-50/40 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Everything your wallet needs — <br className="hidden md:inline" />
            nothing you don't.
          </h2>
          
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            Fintech Connect gives wallet providers a complete infrastructure layer — so you focus on product, not plumbing.
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