"use client";

import React, { useState } from 'react';
import { getPath } from '@/utils/helper';
import Navbar from '@/app/navbar';
import FooterSection from '../Footersection';

// Placeholder Logo Component (Replace SVG paths with your official SVG file when ready)
const FintechConnectLogo = () => (
  <div className="flex items-center gap-2">
    <div className="flex flex-col text-white font-bold tracking-tight text-sm leading-none">
      <span>Fintech</span>
      <span>Connect</span>
    </div>
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  </div>
);

const relatedWhitepapers = [
  {
    bgColor: "bg-[#5A10FF]", // Vibrant purple matching the image
    date: "Jan 10,2024",
    title: "Security Architecture & Compliance Whitepaper",
    subtitle: "Technical documentation for security and compliance teams",
    pages: "42 pages",
    updated: "Updated 2025",
    bullets: [
      "Security Architecture Overview",
      "Encryption & Data Residency",
      "Compliance Certifications",
      "Incident Response Framework",
      "Penetration Testing Summary",
    ],
  },
  {
    bgColor: "bg-black", // Dark theme matching the image
    date: "Jan 10,2024",
    title: "Security Architecture & Compliance Whitepaper",
    subtitle: "Technical documentation for security and compliance teams",
    pages: "42 pages",
    updated: "Updated 2025",
    bullets: [
      "Security Architecture Overview",
      "Encryption & Data Residency",
      "Compliance Certifications",
      "Incident Response Framework",
      "Penetration Testing Summary",
    ],
  },
];

export default function WhitepaperSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    companyName: '',
    role: '',
    institutionType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white">
      <Navbar />
      
      {/* HERO / FORM SECTION */}
      <section className="bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-12 font-sans text-slate-900">
        <div className="max-w-full md:p-12 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Content & Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-sm font-semibold text-slate-700">
                Security Documentation
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Security Architecture & <br />
              <span className="text-blue-600">Compliance Whitepaper</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              A comprehensive 42-page technical document covering Fintech Connect's full security architecture, certification framework, penetration testing results, data residency policies, and incident response procedures.
            </p>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                PCI-DSS Level 1
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                ISO 27001
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                SOC 2 Type II
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                GDPR Compliant
              </div>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-4 text-slate-800 font-medium text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>42 pages of technical security documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>Full encryption and data residency architecture</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>MPC crypto custody security model</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>Penetration testing methodology and findings summary</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>P1-P4 incident response SLA framework</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>Regulatory compliance mapping (PCI-DSS, ISO 27001, SOC 2, GDPR)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                <span>Third-party audit and certification status</span>
              </li>
            </ul>

          </div>

          {/* RIGHT COLUMN: Preview Header + Form */}
          <div className="lg:col-span-5 w-full bg-slate-100/70 rounded-3xl overflow-hidden border border-slate-200/60 shadow-xl shadow-slate-200/50">
            
            {/* Top Blue Container for Preview Image */}
            <div className="bg-blue-600 pb-0 sm:pt-10 flex justify-center min-h-[full] relative overflow-hidden">
              <img 
                src={getPath('/whitepaper.png')} 
                alt="Security Architecture Whitepaper Preview" 
                className="w-full max-w-[full] px-12 h-full object-cover rounded-xl shadow-2xl"
              />
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Download the Whitepaper
              </h3>
              <p className="text-slate-600 text-sm mt-1 mb-12">
                Instant access - sent to your work email
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Mike"
                      required
                      className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Daniel"
                      required
                      className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    placeholder="Mike123@company.com"
                    required
                    className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your company"
                    required
                    className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                {/* Role Select */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-200/80 text-slate-900 appearance-none text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all invalid:text-slate-400"
                    >
                      <option value="" disabled hidden>
                        Select your role
                      </option>
                      <option value="cto_ciso">CTO / CISO / Head of Security</option>
                      <option value="developer">Engineering / Product Lead</option>
                      <option value="compliance">Compliance / Risk Officer</option>
                      <option value="executive">Executive / Business Lead</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Institution Type Select */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Institution Type
                  </label>
                  <div className="relative">
                    <select
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-200/80 text-slate-900 appearance-none text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all invalid:text-slate-400"
                    >
                      <option value="" disabled hidden>
                        Select institution type
                      </option>
                      <option value="psp">Payment Service Provider (PSP)</option>
                      <option value="fintech">Fintech / Neobank</option>
                      <option value="bank">Commercial Bank / Credit Union</option>
                      <option value="insurance">Insurance Company</option>
                      <option value="enterprise">Enterprise Merchant</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-600/30 text-sm mt-4 active:scale-[0.99]"
                >
                  Download Whitepaper
                </button>

              </form>
            </div>

          </div>

        </div>
      </section>

      {/* MORE WHITEPAPERS SECTION (MATCHING ATTACHED IMAGE) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 font-sans bg-white">
        <div className="max-w-full px-12 mx-auto">
          
          {/* Section Header */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-8">
            Browse some more white papers and resources{" "}
            <span className="text-blue-600">for your business</span>
          </h2>

          <div className="w-full h-px bg-slate-200 mb-12"></div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {relatedWhitepapers.map((paper, idx) => (
              <div
                key={idx}
                className={`${paper.bgColor} text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[520px] shadow-xl relative overflow-hidden`}
              >
                {/* Header Row: Logo & Date */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                    {/* SVG / Logo Placeholder */}
                    <svg width="150" height="50" viewBox="220 0 150 201" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.0129111 -0.999917 -0.999917 -0.0129111 353.906 103.367)" fill="#0A63F8"/>
          <path d="M49.302 120.528C45.9887 120.528 42.8654 119.937 39.9321 118.755C36.9987 117.552 34.4874 115.928 32.3982 113.88C30.3089 111.833 28.6629 109.385 27.46 106.537C26.2571 103.666 25.6556 100.606 25.6556 97.3565C25.6556 94.1066 26.2571 91.0572 27.46 88.2082C28.6629 85.3382 30.3089 82.8796 32.3982 80.8326C34.4874 78.7856 36.9987 77.1712 39.9321 75.9894C42.8654 74.8076 45.9887 74.2167 49.302 74.2167C53.4593 74.2167 57.2579 75.1136 60.6978 76.9074C64.1587 78.68 66.9549 81.1386 69.0864 84.283L60.3812 89.6644C59.1572 87.8706 57.5745 86.4566 55.633 85.4226C53.6915 84.3885 51.5811 83.8715 49.302 83.8715C45.5034 83.8715 42.3273 85.1588 39.7738 87.7334C37.2203 90.2869 35.9435 93.4946 35.9435 97.3565C35.9435 101.218 37.2203 104.437 39.7738 107.011C42.3273 109.565 45.5034 110.842 49.302 110.842C51.6022 110.842 53.7126 110.335 55.633 109.322C57.5745 108.288 59.1572 106.874 60.3812 105.08L69.0864 110.462C66.9549 113.606 64.1587 116.075 60.6978 117.869C57.2579 119.642 53.4593 120.528 49.302 120.528ZM89.3773 120.528C84.2914 120.528 80.039 118.871 76.6203 115.558C73.2226 112.245 71.5238 108.13 71.5238 103.213C71.5238 98.2956 73.2226 94.1805 76.6203 90.8672C80.039 87.554 84.2914 85.8974 89.3773 85.8974C92.7327 85.8974 95.7716 86.6571 98.4939 88.1766C101.216 89.6749 103.348 91.7536 104.888 94.4126C106.429 97.0505 107.199 99.9839 107.199 103.213C107.199 106.442 106.429 109.385 104.888 112.044C103.348 114.682 101.216 116.761 98.4939 118.281C95.7716 119.779 92.7327 120.528 89.3773 120.528ZM83.5844 109.037C85.1249 110.599 87.0559 111.38 89.3773 111.38C91.6987 111.38 93.6296 110.599 95.1702 109.037C96.7107 107.476 97.481 105.534 97.481 103.213C97.481 100.891 96.7107 98.9498 95.1702 97.3882C93.6296 95.8265 91.6987 95.0457 89.3773 95.0457C87.0559 95.0457 85.1249 95.8265 83.5844 97.3882C82.0439 98.9498 81.2736 100.891 81.2736 103.213C81.2736 105.534 82.0439 107.476 83.5844 109.037ZM132.302 85.8974C136.1 85.8974 139.16 87.0475 141.482 89.3478C143.803 91.627 144.964 94.6659 144.964 98.4645V119.737H135.499V101.662C135.499 99.6568 134.908 98.0529 133.726 96.8501C132.565 95.6472 131.014 95.0457 129.073 95.0457C127.047 95.0457 125.401 95.6683 124.135 96.9134C122.889 98.1374 122.267 99.7623 122.267 101.788V119.737H112.802V86.6888H122.267V89.9809C124.926 87.2586 128.271 85.8974 132.302 85.8974ZM171.364 85.8974C175.162 85.8974 178.222 87.0475 180.544 89.3478C182.865 91.627 184.026 94.6659 184.026 98.4645V119.737H174.561V101.662C174.561 99.6568 173.97 98.0529 172.788 96.8501C171.628 95.6472 170.077 95.0457 168.135 95.0457C166.109 95.0457 164.463 95.6683 163.197 96.9134C161.952 98.1374 161.329 99.7623 161.329 101.788V119.737H151.864V86.6888H161.329V89.9809C163.988 87.2586 167.333 85.8974 171.364 85.8974ZM223.975 103.339C223.975 104.479 223.911 105.471 223.785 106.315H199.157C199.748 108.172 200.793 109.628 202.291 110.683C203.789 111.738 205.572 112.266 207.641 112.266C209.413 112.266 211.028 111.918 212.484 111.221C213.94 110.525 215.09 109.649 215.934 108.594L222.297 114.102C220.503 116.128 218.319 117.711 215.744 118.85C213.17 119.969 210.384 120.528 207.387 120.528C202.133 120.528 197.743 118.861 194.219 115.527C190.716 112.171 188.964 108.003 188.964 103.023C188.964 99.8362 189.724 96.9345 191.243 94.3176C192.784 91.7008 194.905 89.6433 197.606 88.1449C200.307 86.6466 203.304 85.8974 206.596 85.8974C211.555 85.8974 215.692 87.554 219.005 90.8672C222.318 94.1805 223.975 98.3378 223.975 103.339ZM206.469 94.0644C204.697 94.0644 203.146 94.6025 201.816 95.6788C200.487 96.734 199.579 98.1796 199.094 100.016H213.94C213.412 98.1585 212.484 96.7023 211.154 95.6472C209.825 94.592 208.263 94.0644 206.469 94.0644ZM245.31 120.528C240.224 120.528 235.972 118.871 232.553 115.558C229.155 112.245 227.457 108.13 227.457 103.213C227.457 98.2956 229.155 94.1805 232.553 90.8672C235.972 87.554 240.224 85.8974 245.31 85.8974C248.602 85.8974 251.588 86.636 254.268 88.1133C256.949 89.5694 259.059 91.5742 260.6 94.1277L252.369 99.1292C251.673 97.8841 250.702 96.8923 249.457 96.1536C248.212 95.415 246.83 95.0457 245.31 95.0457C242.989 95.0457 241.058 95.8265 239.517 97.3882C237.977 98.9498 237.206 100.891 237.206 103.213C237.206 105.534 237.977 107.476 239.517 109.037C241.058 110.599 242.989 111.38 245.31 111.38C246.83 111.38 248.212 111.01 249.457 110.272C250.702 109.533 251.673 108.541 252.369 107.296L260.6 112.266C259.059 114.841 256.949 116.867 254.268 118.344C251.588 119.8 248.602 120.528 245.31 120.528ZM285.987 95.299H277.503V107.423C277.503 110.061 278.886 111.38 281.65 111.38C283.022 111.38 284.467 110.989 285.987 110.208V119.104C284.109 120.053 281.998 120.528 279.656 120.528C275.773 120.528 272.861 119.494 270.919 117.426C268.999 115.337 268.038 112.519 268.038 108.974V95.299H263.037V86.6888H268.038V78.4901H277.503V86.6888H285.987V95.299Z" fill="white"/>
          <path d="M3.88977 62.0001V16.6194H30.4375V21.1574H8.42784V35.4199H27.3257V39.958H8.42784V62.0001H3.88977ZM33.1391 29.5853H37.6771V62.0001H33.1391V29.5853ZM35.4405 23.9127C34.7058 23.9127 34.0791 23.675 33.5604 23.1996C33.0634 22.7025 32.8149 22.0867 32.8149 21.3519C32.8149 20.6172 33.0634 20.0121 33.5604 19.5367C34.0791 19.0397 34.7058 18.7912 35.4405 18.7912C36.1536 18.7912 36.7587 19.0397 37.2557 19.5367C37.7744 20.0121 38.0337 20.6172 38.0337 21.3519C38.0337 22.0867 37.7852 22.7025 37.2881 23.1996C36.7911 23.675 36.1752 23.9127 35.4405 23.9127ZM73.6236 41.9353V62.0001H69.0855V42.8429C69.0855 41.0709 68.6533 39.461 67.7889 38.0131C66.9245 36.5653 65.7684 35.4091 64.3206 34.5447C62.8727 33.6803 61.2628 33.2481 59.4908 33.2481C57.7404 33.2481 56.1304 33.6803 54.6609 34.5447C53.2131 35.4091 52.057 36.5653 51.1926 38.0131C50.3282 39.461 49.896 41.0709 49.896 42.8429V62.0001H45.3579V29.5853H49.896V34.0585C51.0413 32.4162 52.5324 31.1088 54.3692 30.1363C56.2061 29.1639 58.205 28.6777 60.366 28.6777C62.8079 28.6777 65.0337 29.2719 67.0434 30.4605C69.0531 31.649 70.6522 33.2481 71.8408 35.2579C73.0293 37.2676 73.6236 39.4934 73.6236 41.9353ZM96.6791 34.1233H88.932L88.8996 62.0001H84.3615L84.3939 34.1233H78.5268V29.5853H84.3939L84.3615 19.407H88.8996L88.932 29.5853H96.6791V34.1233ZM115.84 62.8428C112.858 62.8428 110.135 62.0757 107.671 60.5414C105.229 59.0071 103.274 56.9542 101.804 54.3826C100.356 51.7894 99.6324 48.9261 99.6324 45.7927C99.6324 43.4156 100.054 41.2006 100.897 39.1476C101.739 37.0731 102.895 35.2579 104.365 33.702C105.856 32.1244 107.585 30.8927 109.551 30.0067C111.518 29.1207 113.614 28.6777 115.84 28.6777C118.238 28.6777 120.443 29.1531 122.452 30.1039C124.484 31.0547 126.223 32.3838 127.671 34.0909C129.141 35.7981 130.243 37.797 130.978 40.0877C131.734 42.3783 132.047 44.8526 131.918 47.5107H104.43C104.689 49.5636 105.337 51.4004 106.375 53.0212C107.434 54.6419 108.773 55.9277 110.394 56.8785C112.036 57.8077 113.852 58.2832 115.84 58.3048C118.001 58.3048 119.946 57.7429 121.674 56.6192C123.425 55.4955 124.83 53.9504 125.888 51.9839L130.491 53.0536C129.195 55.9277 127.239 58.2832 124.624 60.12C122.009 61.9352 119.081 62.8428 115.84 62.8428ZM104.3 43.8478H127.347C127.196 41.8381 126.58 40.0012 125.499 38.3373C124.441 36.6517 123.068 35.3119 121.383 34.3178C119.697 33.3022 117.85 32.7943 115.84 32.7943C113.83 32.7943 111.993 33.2914 110.329 34.2854C108.665 35.2579 107.304 36.5869 106.245 38.2724C105.186 39.9364 104.538 41.7948 104.3 43.8478ZM160.302 53.8639L164.354 56.0682C162.884 58.1211 161.015 59.7634 158.746 60.9952C156.498 62.227 154.056 62.8428 151.42 62.8428C148.438 62.8428 145.715 62.0757 143.252 60.5414C140.81 59.0071 138.854 56.9542 137.384 54.3826C135.937 51.7894 135.213 48.9261 135.213 45.7927C135.213 43.4156 135.634 41.2006 136.477 39.1476C137.32 37.0731 138.476 35.2579 139.945 33.702C141.436 32.1244 143.165 30.8927 145.132 30.0067C147.098 29.1207 149.194 28.6777 151.42 28.6777C154.056 28.6777 156.498 29.2935 158.746 30.5253C161.015 31.7571 162.884 33.4102 164.354 35.4848L160.302 37.6566C159.178 36.2303 157.827 35.139 156.25 34.3827C154.672 33.6047 153.062 33.2157 151.42 33.2157C149.237 33.2157 147.26 33.7992 145.488 34.9661C143.716 36.1115 142.312 37.6349 141.274 39.5366C140.259 41.4383 139.751 43.5236 139.751 45.7927C139.751 48.0617 140.269 50.1471 141.307 52.0487C142.366 53.9504 143.781 55.4739 145.553 56.6192C147.325 57.7429 149.281 58.3048 151.42 58.3048C153.192 58.3048 154.856 57.8942 156.412 57.073C157.968 56.2518 159.264 55.1822 160.302 53.8639ZM198.028 41.9353V62.0001H193.49V42.8429C193.49 41.0709 193.058 39.461 192.193 38.0131C191.329 36.5653 190.173 35.4091 188.725 34.5447C187.277 33.6803 185.667 33.2481 183.895 33.2481C182.145 33.2481 180.535 33.6803 179.065 34.5447C177.617 35.4091 176.461 36.5653 175.597 38.0131C174.733 39.461 174.3 41.0709 174.3 42.8429V62.0001H169.762V13.3779H174.3V34.0585C175.446 32.4162 176.937 31.1088 178.774 30.1363C180.61 29.1639 182.609 28.6777 184.77 28.6777C187.212 28.6777 189.438 29.2719 191.448 30.4605C193.458 31.649 195.057 33.2481 196.245 35.2579C197.434 37.2676 198.028 39.4934 198.028 41.9353Z" fill="white"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.999793 -0.0203619 -0.0203619 0.999793 253.736 21.9693)" fill="#0A63F8"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.849868 -0.526995 -0.526995 0.849868 302.125 28.4821)" fill="#0A63F8"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.480664 -0.876905 -0.876905 0.480664 337.863 59.1159)" fill="#0A63F8"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.503146 -0.864202 -0.864202 -0.503146 346.105 149.786)" fill="#0A63F8"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.721529 -0.692385 -0.692385 -0.721529 324.629 178.293)" fill="#0A63F8"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.900044 -0.435799 -0.435799 -0.900044 288.037 194.412)" fill="#0A63F8"/>
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.999533 -0.0305672 -0.0305672 -0.999533 248.223 200.014)" fill="#0A63F8"/>
        </svg>
                    
                    <span className="text-sm font-medium tracking-wide text-white/90">
                      {paper.date}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mb-6 font-normal">
                    {paper.subtitle}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-white/80 mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{paper.pages}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{paper.updated}</span>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-3.5 mb-10">
                    {paper.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-3 text-xs sm:text-sm text-white/90 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Button */}
                <div>
                  <button className="bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-lg transition-colors shadow-sm active:scale-95">
                    Download
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      <FooterSection />
    </div>
  );
}