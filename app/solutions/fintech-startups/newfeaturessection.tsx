import React from 'react';

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
    iconPath: '/icons/compliance icon.png',
    title: 'Compliance Ready',
    description: 'Every module ships with pre-certified compliance tools : KYC/KYB, AML screening, transaction monitoring, and audit-ready reporting. Stay ahead of regulators from day one.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-150 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-6 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Don't Choose Between Speed and Trust
          </h2>
          
          {/* To center the text beautifully on all screens */}
          <p className="mt-6 mb-6 mx-auto max-w-full text-lg md:text-xl text-gray-600">
            Many startups fail when their platforms can’t scale or suffer persistent latency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 bg-white rounded-2xl border border-blue-50/50 shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/70 transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <img 
                    src={getPath(feature.iconPath)} 
                    alt={`${feature.title} icon`} 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
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