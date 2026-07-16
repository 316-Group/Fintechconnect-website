"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/app/navbar";
import Footersection from "@/app/Footersection";

// Type definition for stability
interface Connector {
  name: string;
  category: string;
  desc: string;
  iconType: string;
  url: string;
  isCTA?: boolean;
}

// Filter Categories
const categories = [
  "All connectors",
  "BaaS",
  "Card Issuing",
  "Crypto Infrastructure",
  "Compliance",
  "Payments",
  "Utilities"
];

// Global Standalone CTA Card definition (automatically appends to every tab)
const ctaCard: Connector = {
  name: "Add your partner",
  category: "All",
  desc: "We are open to adding your favourite provider to the system!",
  iconType: "add-partner",
  url: "mailto:partners@yourdomain.com", // Replace with your support email or "/contact" route
  isCTA: true
};

// Database for connectors
const connectorsData: Connector[] = [
  // --- BaaS Category ---
  {
    name: "Clear Junction",
    category: "BaaS",
    desc: "Clear Junction provides payment processing and financial services solutions, enabling businesses to access banking infrastructure, virtual IBANs, and local payment rails globally.",
    iconType: "clear-junction",
    url: "https://clearjunction.com/"
  },
  {
    name: "Banking Circle",
    category: "BaaS",
    desc: "Banking Circle offers innovative payment and banking solutions tailored for financial institutions and businesses, providing fast, cost-effective, and fully transparent global clearing capabilities.",
    iconType: "banking-circle",
    url: "https://www.bankingcircle.com/"
  },
  {
    name: "Railsr",
    category: "BaaS",
    desc: "Railsr is an enterprise-grade platform delivering secure infrastructure for moving, storing, and issuing digital assets, powered by multi-party computation (MPC) technology.",
    iconType: "railsr",
    url: "https://www.railsr.com/"
  },
  {
    name: "TransferMate",
    category: "BaaS",
    desc: "TransferMate offers a global B2B payments infrastructure that enables businesses to send and receive cross-border payments with speed, compliance, and cost efficiency, powered by its extensive local banking network.",
    iconType: "transfermate",
    url: "https://www.transfermate.com/"
  },
  {
    name: "BCB Group",
    category: "BaaS",
    desc: "BCB Group delivers payment services and digital banking infrastructure tailored for crypto and fintech companies, providing multi-currency accounts, instant settlements, and liquidity solutions.",
    iconType: "bcb-group",
    url: "https://bcbgroup.com/"
  },
  {
    name: "IFX",
    category: "BaaS",
    desc: "IFX Payments provides global payment solutions and multicurrency accounts, helping businesses streamline cross-border transactions with flexibility, transparency, and compliance-first technology.",
    iconType: "ifx",
    url: "https://www.ifxpayments.com/"
  },
  {
    name: "LHV",
    category: "BaaS",
    desc: "LHV is an Estonian bank offering business banking, accounts, and payments infrastructure (including access to SEPA) especially for fintech operations in Europe.",
    iconType: "lhv",
    url: "https://www.lhv.ee/en"
  },
  {
    name: "MyEUPay",
    category: "BaaS",
    desc: "MyEUPay delivers payment processing services, supporting a variety of payment methods and currencies to facilitate smooth, secure transactions for businesses across Europe, focusing on user-friendly integration and compliance.",
    iconType: "myeupay",
    url: "https://myeupay.com/"
  },
  {
    name: "Unlimit",
    category: "BaaS",
    desc: "Unlimit delivers global multi-currency accounts, payments, card issuing, and spend management with deep local rails in 120+ countries - streamlined under one API.",
    iconType: "unlimit",
    url: "https://www.unlimit.com/"
  },
  {
    name: "Breinrock",
    category: "BaaS",
    desc: "Breinrock offers digital banking, international payments, and compliance solutions, supporting businesses with global financial operations through secure and regulated services.",
    iconType: "breinrock",
    url: "https://breinrock.com/"
  },
  {
    name: "Plaid",
    category: "Utilities",
    desc: "Plaid acts as an open banking data network connecting applications securely with users' bank accounts, facilitating instant identity verification, balance checks, and asset evaluation.",
    iconType: "utilities",
    url: "https://plaid.com/"
  },
  // --- Crypto Infrastructure Category ---
  {
    name: "Fireblocks",
    category: "Crypto Infrastructure",
    desc: "Fireblocks ensures the secure transfer of digital assets with its comprehensive blockchain security platform, offering tools for managing, transferring, and securing digital assets across various cryptocurrencies and tokens with top-tier protection.",
    iconType: "fireblocks",
    url: "https://www.fireblocks.com/"
  },
  {
    name: "Dfns",
    category: "Crypto Infrastructure",
    desc: "Dfns is a security-first wallet infrastructure provider, offering custody and key management through decentralized MPC technology to safeguard digital assets.",
    iconType: "dfns",
    url: "https://www.dfns.co/"
  },
  {
    name: "Cobo",
    category: "Crypto Infrastructure",
    desc: "It is a global leader in digital asset custody solutions, providing institutional-grade security and infrastructure for managing crypto assets. With a focus on compliance, scalability, and innovation, Cobo supports enterprises, foundations, and funds with secure wallet-as-a-service, MPC custody, and DeFi solutions.",
    iconType: "cobo",
    url: "https://www.cobo.com/"
  },
  {
    name: "BitGo",
    category: "Crypto Infrastructure",
    desc: "BitGo provides enterprise-grade digital asset custody solutions - offering MPC-based custodian services and security solutions for crypto exchanges and institutions.",
    iconType: "bitgo",
    url: "https://www.bitgo.com/"
  },
  {
    name: "Chainalysis",
    category: "Crypto Infrastructure",
    desc: "Chainalysis delivers blockchain analytics and investigative tools - used by regulators and fintechs to detect fraud, trace illicit crypto flows, and comply with investigations.",
    iconType: "chainalysis",
    url: "https://www.chainalysis.com/"
  },
  {
    name: "Etherscan",
    category: "Crypto Infrastructure",
    desc: "Etherscan is the leading blockchain explorer for Ethereum, providing API and web interfaces for transaction lookup, smart contract tracking, address balances, and analytics.",
    iconType: "etherscan",
    url: "https://etherscan.io/"
  },
  {
    name: "Tronscan",
    category: "Crypto Infrastructure",
    desc: "Tronscan is the official blockchain explorer for the TRON network, allowing users to track transactions, smart contracts, and assets in real time.",
    iconType: "tronscan",
    url: "https://tronscan.org/"
  },
  // --- Payments Category ---
  {
    name: "Currency Cloud",
    category: "Payments",
    desc: "Currency Cloud specialises in delivering sophisticated cross-border payment solutions, allowing businesses to execute multi-currency transfers, access real-time FX rates, and automate international workflows.",
    iconType: "currency-cloud",
    url: "https://www.currencycloud.com/"
  },
  {
    name: "CentroLink",
    category: "Payments",
    desc: "CentroLink is operated by the Bank of Lithuania and offers real-time SEPA clearing, instant payments, and IBAN creation services - enabling your platform to support EU payments technically via direct integration.",
    iconType: "centrolink",
    url: "https://www.lb.lt/en/centrolink"
  },
  {
    name: "Visa Direct",
    category: "Payments",
    desc: "Visa Direct enables real-time push payments globally, allowing businesses and consumers to send funds directly to eligible cards and accounts.",
    iconType: "visa-direct",
    url: "https://partner.visa.com/site/programs/visa-direct.html"
  },
  {
    name: "Mastercard Send",
    category: "Payments",
    desc: "Mastercard Send powers fast, secure, and transparent money movement worldwide, enabling real-time payments across banks, digital wallets, and cards.",
    iconType: "mastercard-send",
    url: "https://www.mastercard.us/en-us/business/issuers/payment-processing/mastercard-send.html"
  },
  {
    name: "Thunes",
    category: "Payments",
    desc: "Thunes operates a global payment network connecting over 130 countries, facilitating cross-border payments through bank accounts, mobile wallets, and cash pick-up points.",
    iconType: "thunes",
    url: "https://www.thunes.com/"
  },
  {
    name: "TerraPay",
    category: "Payments",
    desc: "TerraPay provides a scalable global payments infrastructure, enabling secure cross-border transfers, remittances, and merchant payments across emerging markets.",
    iconType: "terrapay",
    url: "https://www.terrapay.com/"
  },
  {
    name: "Form3",
    category: "Payments",
    desc: "Form3 offers cloud-native payments infrastructure, providing secure, scalable, and resilient access to real-time payment systems via a single API.",
    iconType: "form3",
    url: "https://www.form3.tech/"
  },
  {
    name: "SWIFT",
    category: "Payments",
    desc: "SWIFT connects financial institutions across the globe with a standardized, secure messaging system that powers international payments and financial communications.",
    iconType: "swift",
    url: "https://www.swift.com/"
  },
  {
    name: "IBAN",
    category: "Payments",
    desc: "IBAN.com provides global IBAN validation, generation, and compliance tools to help businesses streamline international payments and reduce errors.",
    iconType: "iban",
    url: "https://www.iban.com/"
  },
  {
    name: "B4B",
    category: "Payments",
    desc: "B4B Payments offers payment solutions for businesses, including prepaid and corporate cards. Their platform provides real-time transaction tracking, customisable card programs, and seamless integration with existing systems, ensuring secure and efficient financial management.",
    iconType: "b4b",
    url: "https://www.b4bpayments.com/"
  },
  // --- Compliance Category ---
  {
    name: "ComplyAdvantage",
    category: "Compliance",
    desc: "ComplyAdvantage provides advanced solutions for anti-money laundering (AML) and compliance, leveraging AI and machine learning to offer real-time risk management, client onboarding, and transaction monitoring services to mitigate financial crime.",
    iconType: "complyadvantage",
    url: "https://complyadvantage.com/"
  },
  {
    name: "Salv",
    category: "Compliance",
    desc: "Salv is a compliance and risk monitoring platform that screens transactions, monitors sanctions/PEP data, and helps fintechs stay regulator-ready across jurisdictions.",
    iconType: "salv",
    url: "https://salv.com/"
  },
  {
    name: "SumSub",
    category: "Compliance",
    desc: "SumSub specialises in compliance and KYC/AML solutions, delivering an all-in-one platform for identity verification, authentication, and regulatory compliance to help businesses streamline their customer onboarding processes while ensuring adherence to global regulations.",
    iconType: "sumsub",
    url: "https://sumsub.com/"
  },
  {
    name: "Persona",
    category: "Compliance",
    desc: "Persona offers identity verification and KYC solutions with customizable workflows, enabling fintechs to onboard users securely while meeting global compliance requirements.",
    iconType: "persona",
    url: "https://withpersona.com/"
  },
  {
    name: "Veriff",
    category: "Compliance",
    desc: "Veriff provides AI-powered identity verification, combining biometric checks and fraud prevention tools to help businesses comply with KYC/AML regulations worldwide.",
    iconType: "veriff",
    url: "https://www.veriff.com/"
  },
  {
    name: "Name Scan",
    category: "Compliance",
    desc: "Name Scan provides name-based identity screening for sanctions and PEP lists globally - ideal for quick identity validation and KYB onboarding workflows.",
    iconType: "namescan",
    url: "https://namescan.io/"
  },
  {
    name: "MaxMind",
    category: "Compliance",
    desc: "MaxMind delivers IP intelligence and online fraud prevention tools - including GeoIP databases and fraud-scoring engines used to screen billions of transactions annually.",
    iconType: "maxmind",
    url: "https://www.maxmind.com/"
  },
  {
    name: "FraudLabsPro",
    category: "Compliance",
    desc: "FraudLabsPro is an API-based fraud detection suite providing real-time scoring, IP risk profiling, and transaction screening to mitigate risks.",
    iconType: "fraudlabspro",
    url: "https://www.fraudlabspro.com/"
  },
  {
    name: "BlockCyper",
    category: "Compliance",
    desc: "BlockCyper provides blockchain transaction verification tools and analytics - used to detect fraudulent smart contract activity and monitor token flows.",
    iconType: "blockcyper",
    url: "https://www.blockcypher.com/"
  },
  // --- Card Issuing Category ---
  {
    name: "Moorvand",
    category: "Card Issuing",
    desc: "Moorvand is a payments solutions provider offering BIN sponsorship, issuing, and electronic money services, helping fintechs bring innovative card and payment products to market.",
    iconType: "moorvand",
    url: "https://www.moorvand.com/"
  },
  {
    name: "Wallester",
    category: "Card Issuing",
    desc: "Wallester provides card issuing and expense management solutions through a powerful API-driven platform, enabling businesses to launch virtual and physical Visa cards with ease.",
    iconType: "wallester",
    url: "https://wallester.com/"
  },
  {
    name: "Intercash",
    category: "Card Issuing",
    desc: "Intercash sponsors BINs and manages white-label Visa/Mastercard programs globally - offering prepaid card issuance, payouts, and cross-border payment services in 180+ countries.",
    iconType: "intercash",
    url: "https://www.intercash.com/"
  },
  {
    name: "Rain",
    category: "Card Issuing",
    desc: "Rain enables fintechs and businesses to issue branded payment cards quickly and cost-effectively, offering flexible solutions for embedded finance and corporate spending.",
    iconType: "rain",
    url: "https://rain.us/"
  },
  {
    name: "Monavate",
    category: "Card Issuing",
    desc: "Monavate delivers BIN sponsorship and payments infrastructure for fintechs, offering speed, compliance, and scalability in card issuance and transaction processing.",
    iconType: "monavate",
    url: "https://www.monavate.com/"
  },
  {
    name: "Decta",
    category: "Card Issuing",
    desc: "Decta is a fintech platform offering global card issuing and merchant acquiring, enabling fintechs to issue debit and prepaid cards under their own brand.",
    iconType: "decta",
    url: "https://www.decta.com/"
  },
  {
    name: "Skrill",
    category: "Card Issuing",
    desc: "Skrill, part of Paysafe, is a global e-wallet and payments platform operating in 100+ countries, capable of handling card, bank transfers, remittances, and crypto.",
    iconType: "skrill",
    url: "https://www.skrill.com/"
  }
];

// Component to render the custom geometric company icons
const ConnectorIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "transfermate":
      return (
        <div className="w-16 h-16 bg-[#0c2461] rounded-xl flex flex-col items-center justify-center p-2 text-white">
          <span className="text-sm font-black tracking-tight leading-none">TM</span>
          <span className="text-[7px] font-bold tracking-widest leading-none mt-1 text-sky-400">GLOBAL</span>
        </div>
      );
    case "bcb-group":
      return (
        <div className="w-16 h-16 bg-[#4a0e91] rounded-xl flex items-center justify-center p-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.5h3.75a2.25 2.25 0 012.25 2.25v.5A2.25 2.25 0 0112.75 14.5H9m0-5V15m0-5.5h3m-3 5.5h4.5a2.25 2.25 0 002.25-2.25v-.5a2.25 2.25 0 00-2.25-2.25H9" />
          </svg>
        </div>
      );
    case "ifx":
      return (
        <div className="w-16 h-16 bg-[#1e272e] rounded-xl flex items-center justify-center p-3 text-white">
          <span className="text-xl font-black italic tracking-tighter">IF<span className="text-cyan-400">X</span></span>
        </div>
      );
    case "lhv":
      return (
        <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center p-3 text-white font-extrabold text-base tracking-wider">
          LHV
        </div>
      );
    case "myeupay":
      return (
        <div className="w-16 h-16 bg-[#1a5fb4] rounded-xl flex flex-col items-center justify-center p-2 text-white">
          <span className="text-xs font-light leading-none">my</span>
          <span className="text-[10px] font-bold tracking-widest leading-none text-[#5ce1b6]">EU</span>
          <span className="text-[9px] font-light leading-none">pay</span>
        </div>
      );
    case "unlimit":
      return (
        <div className="w-16 h-16 bg-[#bfff00] rounded-xl flex items-center justify-center p-3 text-black">
          <span className="text-xl font-black tracking-tight leading-none lowercase">un</span>
        </div>
      );
    case "fireblocks":
      return (
        <div className="w-16 h-16 bg-[#1e293b] rounded-xl flex items-center justify-center p-3 text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12 3l10 16H2L12 3z" />
          </svg>
        </div>
      );
    case "dfns":
      return (
        <div className="w-16 h-16 bg-[#1a112c] rounded-xl flex items-center justify-center p-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
      );
    case "cobo":
      return (
        <div className="w-16 h-16 bg-[#4f10f2] rounded-xl flex items-center justify-center p-2 text-white font-extrabold text-lg">
          cobo
        </div>
      );
    case "bitgo":
      return (
        <div className="w-16 h-16 bg-black rounded-xl flex flex-col items-center justify-center p-2 text-white border border-slate-800">
          <span className="text-xs font-black tracking-tight">BitGo</span>
        </div>
      );
    case "chainalysis":
      return (
        <div className="w-16 h-16 bg-[#fdf2e9] rounded-xl flex items-center justify-center p-3 text-[#ff6600]">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
          </svg>
        </div>
      );
    case "etherscan":
      return (
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-3 text-slate-800">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-3zm1.5 0v-4.5m15 4.5v-10.5m-7.5 10.5v-7.5M12 3l9 9" />
          </svg>
        </div>
      );
    case "tronscan":
      return (
        <div className="w-16 h-16 bg-[#040814] rounded-xl flex flex-col items-center justify-center p-2 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-500" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span className="text-[7px] font-black tracking-widest mt-1">TRONSCAN</span>
        </div>
      );
    case "breinrock":
      return (
        <div className="w-16 h-16 bg-[#003865] rounded-xl flex flex-col items-center justify-center p-2 text-white">
          <span className="text-[8px] font-black tracking-widest leading-none">BREIN</span>
          <span className="text-[8px] font-light tracking-wide leading-none mt-0.5 text-blue-300">ROCK</span>
        </div>
      );
    case "clear-junction":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h6a4 4 0 014 4v1a4 4 0 01-4 4H9m-1-5h4" />
            <circle cx="7" cy="11" r="2" fill="white" />
          </svg>
        </div>
      );
    case "currency-cloud":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" className="w-full h-full text-[#ff6b35]" fill="currentColor">
            <path d="M4 16c3-1 5-4 8-4s5 3 8 4M4 8c3-1 5-4 8-4s5 3 8 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      );
    case "banking-circle":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-2">
          <svg viewBox="0 0 24 24" className="w-full h-full text-white animate-spin-slow" fill="currentColor">
            {[...Array(16)].map((_, i) => (
              <rect key={i} x="11.5" y="1" width="1" height="6" rx="0.5" transform={`rotate(${i * 22.5} 12 12)`} />
            ))}
          </svg>
        </div>
      );
    case "railsr":
      return (
        <div className="w-16 h-16 bg-[#1a1a2e] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-red-500" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );
    case "compliance":
      return (
        <div className="w-16 h-16 bg-[#1e1b4b] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a5b4fc]" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      );
    case "utilities":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#38bdf8]" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
      );
    case "moorvand":
      return (
        <div className="w-16 h-16 bg-[#00a896] rounded-xl flex items-center justify-center p-3">
          <span className="text-white text-xl font-black italic tracking-tighter">MV</span>
        </div>
      );
    case "wallester":
      return (
        <div className="w-16 h-16 bg-black border border-slate-800 rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#39ff14]" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </div>
      );
    case "intercash":
      return (
        <div className="w-16 h-16 bg-[#00173d] rounded-xl flex items-center justify-center p-3">
          <span className="text-blue-400 text-lg font-bold tracking-tight">inter</span>
        </div>
      );
    case "rain":
      return (
        <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center p-3">
          <span className="text-pink-500 text-xl font-extrabold tracking-widest uppercase">RN</span>
        </div>
      );
    case "monavate":
      return (
        <div className="w-16 h-16 bg-[#171717] rounded-xl flex items-center justify-center p-3 border border-yellow-500/20">
          <span className="text-yellow-400 text-2xl font-black">M.</span>
        </div>
      );
    case "decta":
      return (
        <div className="w-16 h-16 bg-[#4f83e2] rounded-xl flex items-center justify-center p-3">
          <span className="text-white text-sm font-black tracking-wider uppercase">DECTA</span>
        </div>
      );
    case "skrill":
      return (
        <div className="w-16 h-16 bg-[#3d003d] rounded-xl flex items-center justify-center p-3">
          <span className="text-white text-base font-bold">Skrill</span>
        </div>
      );
    case "complyadvantage":
      return (
        <div className="w-16 h-16 bg-black rounded-xl flex flex-col items-center justify-center p-2 text-white">
          <span className="text-[8px] font-black tracking-widest leading-none">COMPLY</span>
          <span className="text-[8px] font-light tracking-widest leading-none mt-0.5 text-slate-400">ADVANTAGE</span>
        </div>
      );
    case "salv":
      return (
        <div className="w-16 h-16 bg-[#2d3142] rounded-xl flex items-center justify-center p-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
      );
    case "sumsub":
      return (
        <div className="w-16 h-16 bg-[#0c1a30] rounded-xl flex items-center justify-center p-3 text-[#00ebcd]">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      );
    case "persona":
      return (
        <div className="w-16 h-16 bg-[#6366f1] rounded-xl flex items-center justify-center p-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case "veriff":
      return (
        <div className="w-16 h-16 bg-[#002f24] rounded-xl flex items-center justify-center p-3 text-[#00eb9b]">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      );
    case "namescan":
      return (
        <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center p-3 text-[#0f172a]">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case "maxmind":
      return (
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-3 text-blue-500">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.684A1.125 1.125 0 003 6.69v11.22c0 .425.241.815.622 1.006l4.875 2.437c.317.159.69.159 1.006 0l4.907-2.453a1.125 1.125 0 001.006 0z" />
          </svg>
        </div>
      );
    case "fraudlabspro":
      return (
        <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center p-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
      );
    case "blockcyper":
      return (
        <div className="w-16 h-16 bg-[#4c1d95] rounded-xl flex items-center justify-center p-3 text-purple-200">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
      );
    case "centrolink":
      return (
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-2 text-green-600">
          <span className="text-[9px] font-black tracking-tighter leading-none text-[#5ce1b6]">CENTRO</span>
          <span className="text-[9px] font-light tracking-widest leading-none text-slate-800">LINK</span>
        </div>
      );
    case "visa-direct":
      return (
        <div className="w-16 h-16 bg-[#0a2540] rounded-xl flex items-center justify-center p-3 text-white font-black italic">
          VISA
        </div>
      );
    case "mastercard-send":
      return (
        <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center gap-1 p-2">
          <div className="w-4 h-4 bg-[#eb001b] rounded-full opacity-90"></div>
          <div className="w-4 h-4 bg-[#ff5f00] rounded-full -ml-3 opacity-90"></div>
        </div>
      );
    case "thunes":
      return (
        <div className="w-16 h-16 bg-[#004b49] rounded-xl flex items-center justify-center p-3 text-emerald-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
          </svg>
        </div>
      );
    case "terrapay":
      return (
        <div className="w-16 h-16 bg-[#0f1d4a] rounded-xl flex items-center justify-center p-3">
          <span className="text-[#00ebcd] text-xs font-black tracking-widest uppercase">TERRA</span>
        </div>
      );
    case "form3":
      return (
        <div className="w-16 h-16 bg-[#050f24] rounded-xl flex items-center justify-center p-3 text-cyan-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
      );
    case "swift":
      return (
        <div className="w-16 h-16 bg-[#005a9c] rounded-xl flex items-center justify-center p-3 text-white">
          <span className="text-sm font-extrabold tracking-widest">SWIFT</span>
        </div>
      );
    case "iban":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-3">
          <span className="text-white text-base font-black tracking-tighter">IBAN</span>
        </div>
      );
    case "b4b":
      return (
        <div className="w-16 h-16 bg-[#111827] rounded-xl flex items-center justify-center p-3 text-white">
          <span className="text-cyan-400 text-lg font-black italic">B4B</span>
        </div>
      );
    case "add-partner":
      return (
        <div className="w-16 h-16 bg-[#2563eb] rounded-xl flex items-center justify-center p-3 text-white shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center p-3 text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      );
  }
};

export default function ConnectorsPage() {
  const [activeTab, setActiveTab] = useState("All connectors");
  
  // Animation Visibility States
  const [heroVisible, setHeroVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  // References for Animation Targets
  const heroRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Animation Helper for Hero Section elements
  const getAnimatedClass = (visible: boolean) => {
    return `transition-all duration-[800ms] ease-out transform ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;
  };

  // Intersection Observer for scroll-triggered entry animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHeroVisible(true);
    }, observerOptions);

    const filterObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setFilterVisible(true);
    }, observerOptions);

    const gridObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setGridVisible(true);
    }, observerOptions);

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (filterRef.current) filterObserver.observe(filterRef.current);
    if (gridRef.current) gridObserver.observe(gridRef.current);

    return () => {
      heroObserver.disconnect();
      filterObserver.disconnect();
      gridObserver.disconnect();
    };
  }, []);

  // Gracefully animate grid-cascade entry after an active tab change
  useEffect(() => {
    if (!gridVisible) {
      const timer = setTimeout(() => {
        setGridVisible(true);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [gridVisible]);

  // Filtering Logic Engine:
  // 1. Filter standard connectors matching selected category
  const activeBaseConnectors = connectorsData.filter(item => 
    activeTab === "All connectors" ? true : item.category === activeTab
  );

  // 2. Append the standalone CTA card to the end of your filtered array dynamically
  const filteredConnectors = [...activeBaseConnectors, ctaCard];

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans flex flex-col">
      <Navbar />

      {/* VIBRANT CRIMSON HERO SECTION */}
      <div 
        ref={heroRef}
        className="w-full bg-blue-600 text-white py-20 lg:py-28 px-6 md:px-20 overflow-hidden"
      >
        <div className="max-w-[full] mx-auto flex flex-col justify-center">
          <h1 
            className={`text-4xl md:text-6xl font-bold tracking-tight mb-8 ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '0ms' }}
          >
            Fintech Connect Connectors
          </h1>
          <p 
            className={`text-lg md:text-xl font-normal max-w-7xl text-white/95 leading-relaxed ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '150ms' }}
          >
            Accelerate your financial project launch with proven Fintech Connect partners who bring their expertise, reliability, and security.
          </p>
        </div>
      </div>

      {/* FILTER BUTTON SEGMENT BAR CONTAINER */}
      <div 
        ref={filterRef}
        className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm overflow-x-auto scrollbar-none"
      >
        <div className="max-w-[92.5%] mx-auto px-3 lg:px-6 py-6">
          <div 
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-700 ${
              filterVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {categories.map((category, idx) => {
              const isActive = activeTab === category;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(category);
                    setGridVisible(false); // Reset grid visual entry state for clean cascade retrigger
                  }}
                  className={`py-4 px-2 text-center text-xs md:text-sm font-semibold border-r border-b lg:border-b-0 border-slate-200 last:border-r-0 transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#2563eb] text-white border-[#2563eb]' 
                      : 'bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONNECTORS GRID SECTION */}
      <section className="py-16 md:py-24 flex-grow">
        <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredConnectors.length > 0 ? (
              filteredConnectors.map((connector, index) => {
                const isCTA = connector.isCTA;
                
                return (
                  <a
                    href={connector.url}
                    target={isCTA ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    key={index}
                    className={`bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start text-left hover:shadow-xl hover:-translate-y-1 block group transition-all duration-700 ${
                      gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
                    }`}
                    style={{ 
                      transitionDelay: `${(index % 3) * 120}ms`,
                      transitionProperty: 'opacity, transform',
                      transitionDuration: '700ms'
                    }}
                  >
                    {/* Custom Graphic Square */}
                    <div className="mb-8 transform group-hover:scale-105 transition-transform duration-300">
                      <ConnectorIcon type={connector.iconType} />
                    </div>

                    {/* Text Meta Details */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {connector.name}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed font-normal flex-grow mb-4">
                      {connector.desc}
                    </p>

                    {/* Conditional rendering for dynamic card triggers */}
                    {isCTA ? (
                      <div className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-6 rounded-lg transition-colors text-center shadow-md">
                        Contact us
                      </div>
                    ) : (
                      <div className="mt-auto flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors gap-1">
                        <span>Visit website</span>
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </div>
                    )}
                  </a>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400 font-medium text-lg">
                No connectors found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footersection />
    </div>
  );
}