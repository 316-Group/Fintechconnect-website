import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/speed icon.png',
    title: '+4–8% approval rate uplift',
    description: 'Intelligent routing dynamically selects the best acquirer and rail for every transaction, reducing unnecessary declines and recovering revenue that static routing rules leave on the table.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'Up to 70% chargeback reduction',
    description: 'AI fraud scoring trained on billions of transactions blocks fraud before it happens, dramatically reducing chargebacks and protecting your merchants from financial loss.',
  },
  {
    iconPath: '/icons/flexible icon.png', 
    title: 'Same-day settlement as standard',
    description: 'Move from T+2 to same-day settlement with automated reconciliation and real-time ledger visibility. Give your merchants faster access to their funds and reduce your operational overhead.',
  },
  {
    iconPath: '/icons/compliance icon.png',
    title: 'PCI-DSS Level 1 — inherited, not earned',
    description: 'Skip the 12-month certification process. Fintech Connect is PCI-DSS Level 1 certified. Build on our infrastructure and inherit our compliance posture from day one — no annual audit required.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-50/40 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Process more. Decline less. <br className="hidden md:inline" />
             <span className="text-blue-600">Settle faster.</span>
          </h2>
          
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            PSPs that build on Fintech Connect see higher approval rates, lower fraud losses, and faster time to market — without the infrastructure overhead.
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