"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

interface FormState {
  firstName: string
  lastName: string
  workEmail: string
  companyName: string
  role: string
  industryType: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  workEmail?: string
  companyName?: string
  role?: string
  industryType?: string
}

const ROLES = [
  "Product Manager",
  "CTO / Tech Lead",
  "Head of Operations",
  "Business Development",
  "Executive / Founder",
  "Other",
]

const INDUSTRY_TYPES = [
  "Retail Bank",
  "Commercial Bank",
  "Credit Union",
  "Fintech Startup",
  "Neobank",
  "Enterprise / Institutional",
  "Other",
]

const DAYS_SLOTS = [
  { day: "TUE", date: "28" },
  { day: "WED", date: "29" },
  { day: "THU", date: "30" },
  { day: "FRI", date: "31" },
  { day: "SAT", date: "1" },
  { day: "SUN", date: "2" },
  { day: "MON", date: "3" },
]

const TIME_SLOTS = [
  "9:00 AM",
  "9:15 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
]

export default function BookingSection() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    workEmail: "",
    companyName: "",
    role: "",
    industryType: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Step 3 Interactive state
  const [selectedDate, setSelectedDate] = useState("29")
  const [selectedTime, setSelectedTime] = useState("9:15 AM")
  const [isBooked, setIsBooked] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required."
    if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required."
    if (!formData.workEmail.trim() || !emailRegex.test(formData.workEmail)) {
      tempErrors.workEmail = "Please enter a valid work email."
    }
    if (!formData.companyName.trim()) tempErrors.companyName = "Company name is required."
    if (!formData.role) tempErrors.role = "Please select a role."
    if (!formData.industryType) tempErrors.industryType = "Please select an industry type."

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Map form fields to match your Neon database backend requirements
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        workEmail: formData.workEmail,
        companyName: formData.companyName,
        jobTitle: formData.role,
        companyType: formData.industryType,
        requirements: "Submitted via Demo Request Flow",
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      console.log("Form successfully saved to DB:", data)
      setStep(2)
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between items-center relative overflow-hidden font-sans p-4 sm:p-6 md:p-12">
      
      {/* Background Decorative Gradient Wave */}
{/* Background Decorative Diagonal Gradient */}
<div className="absolute inset-x-0 bottom-0 pointer-events-none z-0 overflow-hidden leading-none">
  <svg
    viewBox="0 0 1440 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto min-h-[300px] object-cover object-bottom"
    preserveAspectRatio="none"
  >
    <defs>
      {/* Main vibrant blue linear gradient */}
      <linearGradient id="diagonal-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>

      {/* Bottom-right darker curved overlay for depth */}
      <linearGradient id="diagonal-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.1" />
        <stop offset="60%" stopColor="#1E40AF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.85" />
      </linearGradient>
    </defs>

    {/* Layer 1: Straight Diagonal Top Edge */}
    <path
      d="M0 160 L1440 465 V480 H0 Z"
      fill="url(#diagonal-blue-grad)"
    />

    {/* Layer 2: Inner Curved Shadow Layer (Bottom Right) */}
    <path
      d="M500 264 C820 320 1150 420 1440 458 V480 H500 Z"
      fill="url(#diagonal-accent-grad)"
    />
  </svg>
</div>

      {/* Main Container Card */}
      <div className="relative z-10 my-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-slate-300/60 border border-slate-100/80 overflow-hidden p-6 sm:p-10">
        
        {/* Step Indicator Navigation */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4 mb-8 text-xs font-medium tracking-wide">
          <div
            className={cn(
              "flex items-center gap-2 pb-2 relative transition-colors cursor-pointer",
              step === 1 ? "text-blue-600 font-semibold" : "text-slate-500"
            )}
            onClick={() => setStep(1)}
          >
            {step > 1 ? (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">✓</span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            )}
            <span>Your info</span>
            {step === 1 && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </div>

          <div
            className={cn(
              "flex items-center gap-2 pb-2 relative transition-colors",
              step >= 2 ? "text-blue-600 font-semibold" : "text-slate-400"
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-current inline-block" />
            <span>Let's talk</span>
            {step >= 2 && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </div>
        </div>

        {/* Step Views */}
        <AnimatePresence mode="wait">
          {/* STEP 1: FORM */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                How can we reach you ?
              </h1>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                Please provide your contact information
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="firstName" className="text-xs font-medium text-slate-700">
                    First Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Mike"
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.firstName && "ring-1 ring-red-500 bg-red-50/50"
                      )}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="lastName" className="text-xs font-medium text-slate-700">
                    Last Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Daniel"
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.lastName && "ring-1 ring-red-500 bg-red-50/50"
                      )}
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="workEmail" className="text-xs font-medium text-slate-700">
                    Work Email
                  </label>
                  <div className="col-span-2">
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="Mike123@company.com"
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.workEmail && "ring-1 ring-red-500 bg-red-50/50"
                      )}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="companyName" className="text-xs font-medium text-slate-700">
                    Company Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company"
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.companyName && "ring-1 ring-red-500 bg-red-50/50"
                      )}
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="role" className="text-xs font-medium text-slate-700">
                    Role
                  </label>
                  <div className="col-span-2 relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-slate-900 text-xs appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        !formData.role && "text-slate-400",
                        errors.role && "ring-1 ring-red-500 bg-red-50/50"
                      )}
                    >
                      <option value="" disabled hidden>Select your role</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="text-slate-900">{r}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Industry Type Select */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="industryType" className="text-xs font-medium text-slate-700">
                    Industry Type
                  </label>
                  <div className="col-span-2 relative">
                    <select
                      id="industryType"
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-slate-900 text-xs appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        !formData.industryType && "text-slate-400",
                        errors.industryType && "ring-1 ring-red-500 bg-red-50/50"
                      )}
                    >
                      <option value="" disabled hidden>Select industry type</option>
                      {INDUSTRY_TYPES.map((type) => (
                        <option key={type} value={type} className="text-slate-900">{type}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-800 hover:text-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit <span>&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: SUBMISSION CONFIRMATION & OPTIONS */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Thanks for your submission
              </h2>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed mb-6">
                Our representative will reach out within 24 hrs.<br />
                Select an option below to connect more quickly
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* Chat Card */}
                <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-200 transition-all">
                  <div>
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white mb-3">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">Chat with Sales</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Chat now with our sales representatives
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Connecting to sales chat...")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-2 px-3 rounded-lg w-max flex items-center gap-1 transition-all"
                  >
                    Start Chat <span>&rarr;</span>
                  </button>
                </div>

                {/* Schedule Call Card */}
                <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-200 transition-all">
                  <div>
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white mb-3">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">Schedule a Call</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Chat now with our sales representatives
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-2 px-3 rounded-lg w-max flex items-center gap-1 transition-all"
                  >
                    Book call <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CALENDAR & TIME SLOT BOOKING */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Select a date and time
              </h2>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed mb-5">
                Book a 15-minute call with a our sales rep to tell us about your business and how we can help.
              </p>

              {isBooked ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 my-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    ✓
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Call Scheduled!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    July {selectedDate}, 2026 at {selectedTime}
                  </p>
                </div>
              ) : (
                <>
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900">July 2026</span>
                    <div className="flex gap-1">
                      <button className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                        &lt;
                      </button>
                      <button className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Date Picker */}
                  <div className="grid grid-cols-7 gap-1.5 mb-5">
                    {DAYS_SLOTS.map((slot) => {
                      const isSelected = selectedDate === slot.date
                      return (
                        <button
                          key={slot.date}
                          onClick={() => setSelectedDate(slot.date)}
                          className={cn(
                            "flex flex-col items-center justify-center py-2 rounded-xl border transition-all text-[10px]",
                            isSelected
                              ? "border-blue-600 text-blue-600 font-bold bg-blue-50/40"
                              : "border-slate-100 text-slate-700 bg-slate-50/50 hover:bg-slate-100"
                          )}
                        >
                          <span className="text-[9px] text-slate-400 uppercase font-medium">{slot.day}</span>
                          <span className="text-xs font-bold mt-0.5">{slot.date}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Timezone Selection Dropdown */}
                  <div className="mb-4">
                    <div className="relative inline-block text-left">
                      <select className="bg-transparent text-xs font-bold text-slate-900 appearance-none pr-5 cursor-pointer focus:outline-none">
                        <option>Europe/London</option>
                        <option>America/New_York</option>
                        <option>Asia/Tokyo</option>
                      </select>
                      <span className="absolute right-0 top-0.5 text-[10px] pointer-events-none text-slate-500">▼</span>
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedTime === time
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-2 rounded-xl border text-[10px] font-semibold transition-all",
                            isSelected
                              ? "border-blue-600 text-blue-600 bg-blue-50/30"
                              : "border-slate-100 text-slate-700 bg-slate-50/30 hover:bg-slate-100"
                          )}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-slate-800 hover:text-slate-600 transition-colors"
                >
                  Back
                </button>
                {!isBooked && (
                  <button
                    onClick={() => setIsBooked(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    Book <span>&rarr;</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}