"use client";
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data structure
const categories = [
  {
    title: 'Fintechs',
    items: [
      { name: 'Fintech Startups', desc: 'Fintech Connect meets essential regulatory requirements for modular core banking.', image: '/cards/fintech.png' },
      { name: 'Neobanks', desc: 'Accelerate your market entry with our pre-built banking modules.', image: '/cards/neobanks.png' },
      { name: 'Digital Wallet Providers', desc: 'Secure, scalable wallet infrastructure for global operations.', image: '/cards/digitalwallet.png' },
      { name: 'Money Transfer Services', desc: 'Global remittance rails built for speed and compliance.', image: '/cards/moneytransfer.png' },
    ]
  },
  {
    title: 'Banking',
    items: [
      { name: 'Commercial & Retail Banks', desc: 'Modernize operations while maintaining regulatory compliance.', image: '/cards/commercial.png' },
      { name: 'Payment Service Providers', desc: 'Utilize Fintech Connect to offer seamless payment solutions.', image: '/cards/PSPs.png' },
      { name: 'Credit Unions', desc: 'Offer modern financial services while maintaining member-focused operations.', image: '/cards/creditunions.png' },
      { name: 'Insurance Companies', desc: 'Offer innovative insurance products while maintaining regulatory compliance.', image: '/cards/insurancecompanies.png' },
    ]
  },
  {
    title: 'Crypto',
    items: [
      { name: 'Crypto & Web3 Banks', desc: 'Meets essential regulatory requirements for modular core banking.', image: '/cards/web3.png' },
      { name: 'Crypto Cards', desc: 'Secure, scalable card infrastructure for global operations.', image: '/cards/crypto.png' },
      { name: 'Crypto Wallets', desc: 'Secure, scalable wallet infrastructure.', image: '/cards/digitalwallet.png' },
      { name: 'Crypto Exchanges', desc: 'Global remittance rails built for speed and compliance.', image: '/cards/moneytransfer.png' },
    ]
  },
];

const Card = ({ item }: { item: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative min-w-[400px] h-[280px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 snap-start border border-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

      {/* Persistent Title */}

      {/* Gliding Dark Film Overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/60 z-10"
        initial={{ height: '30%' }}
        animate={{ height: isHovered ? '100%' : '30%' }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Description that appears on hover */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <AnimatePresence>
          {isHovered && (
            <motion.p 
              initial={{ opacity: 5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-slate-200 text-sm leading-relaxed mt-2"
            >
              {/* We group the title and desc together so they animate up synchronously */}
              <h3 className="text-white text-xl font-bold mb-1">{item.name}</h3>
              {item.desc}
            </motion.p>
          )}
          {/* If you are not hovering, show ONLY the title in its normal position */}
          {!isHovered && (
            <div className="text-white text-xl font-bold">{item.name}</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CarouselRow = ({ category }: { category: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Match min-w of card
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-[#0066ff]">{category.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition"><ChevronRight size={18} /></button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {category.items.map((item: any, i: number) => <Card key={i} item={item} />)}
      </div>
    </div>
  );
};

export default function CarouselSection() {
  return (
    <section className="bg-[#0a0a0a] py-24 text-white overflow-hidden">
      <div className="w-full pl-20 pr-20">
        <h2 className="text-center text-4xl font-bold mb-4">Fintech Connect powers <span className="text-blue-500">innovators</span></h2>
        <p className="mt-6 text-center text-slate-400 mb-16 max-w-3xl mx-auto">Fintech Connect gives your team a modular, pre-integrated platform of financial building blocks. Pick the modules you need, configure them to your brand, and go live with a fully regulated fintech product.</p>

        {categories.map((cat, idx) => (
          <CarouselRow key={idx} category={cat} />
        ))}
      </div>
    </section>
  );
}