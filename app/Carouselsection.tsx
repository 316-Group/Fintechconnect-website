import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// data structure
const categories = [
  {
    title: 'Fintechs',
    items: [
      { name: 'Fintech Startups', 
        desc: 'Fintech Connect meets essential regulatory requirements for modular core banking.',
        image: '/cards/fintech.png'
      },
      { name: 'Neobanks', 
        desc: 'Accelerate your market entry with our pre-built banking modules.', 
        image: '/cards/neobanks.png' 
    },
      { name: 'Digital Wallet Providers', 
        desc: 'Secure, scalable wallet infrastructure for global operations.', 
        image: '/cards/digitalwallet.png' 
    },
      { name: 'Money Transfer Services', 
        desc: 'Global remittance rails built for speed and compliance.', 
        image: '/cards/moneytransfer.png' },
    ]
  },
  {
    title: 'Banking',
    items: [
      { name: 'Commercial & Retail Banks', 
        desc: 'Commercial and retail banks can leverage Fintech Connect to modernize their operations while maintaining regulatory compliance.',
        image: '/cards/commercial.png'
      },
      { name: 'Payment Service Providers', 
        desc: 'Payment service providers can utilize Fintech Connect to offer seamless payment solutions.',
        image: '/cards/PSPs.png'
      },
      { name: 'Credit Unions', 
        desc: 'Credit unions can utilize Fintech Connect to offer modern financial services while maintaining member-focused operations.',
        image: '/cards/creditunions.png'
      },
      { name: 'Insurance Companies', 
        desc: 'Insurance companies can utilize Fintech Connect to offer innovative insurance products while maintaining regulatory compliance.',
        image: '/cards/insurancecompanies.png'
      },
    ]
  },
  {
    title: 'Crypto',
    items: [
      { name: 'Crypto & Web3 Banks', 
        desc: 'Fintech Connect meets essential regulatory requirements for modular core banking.', 
        image: '/cards/web3.png' 
    },
      { name: 'Crypto Cards', 
        desc: 'Secure, scalable card infrastructure for global operations.', 
        image: '/cards/crypto.png' 
    },
      { name: 'Crypto Wallets', 
        desc: 'Secure, scalable wallet infrastructure for global operations.', 
        image: '/cards/digitalwallet.png' 
    },
      { name: 'Crypto Exchanges', 
        desc: 'Global remittance rails built for speed and compliance.',
        image: '/cards/moneytransfer.png'
        },
    ]
  },
];

const Card = ({ item }: { item: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative min-w-[400px] h-[280px] border border-slate-800 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Rendering */}
      <img
        src={item.image} 
        alt={item.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
      
      {/* Content Container */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.div 
          animate={{ y: isHovered ? -40 : 0 }} 
          className="text-white font-semibold text-lg"
        >
          {item.name}
        </motion.div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-slate-400 text-xs mt-2 leading-relaxed"
            >
              {item.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function CarouselSection() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="w-full pl-25 pr-6 lg:pr-10">
        <h2 className="text-center text-4xl font-bold mb-4">Fintech Connect powers {' '}
            <span className="text-blue-500">innovators</span>
        </h2>
        <p className="text-center text-slate-400 max-w-3xl mx-auto mb-16">Fintech Connect gives your team a modular, pre-integrated platform of financial building blocks. Pick the modules you need, configure them to your brand, and go live with a fully regulated fintech product</p>

        {categories.map((cat, idx) => (
          <div key={idx} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-medium text-[#0066ff]">{cat.title}</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition"><ChevronLeft size={18} /></button>
                <button className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition"><ChevronRight size={18} /></button>
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-hidden">
              {cat.items.map((item, i) => <Card key={i} item={item} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}