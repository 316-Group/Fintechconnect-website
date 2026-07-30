"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { getPath } from "@/utils/helper"

interface FormState {
  // Step 1
  workEmail: string
  country: string
  // Step 2
  firstName: string
  lastName: string
  companyName: string
  companyWebsite: string
  phonePrefix: string
  phone: string
  role: string
  industryType: string
  notes: string
}

interface FormErrors {
  workEmail?: string
  country?: string
  firstName?: string
  lastName?: string
  companyName?: string
  companyWebsite?: string
  phone?: string
  role?: string
  industryType?: string
}

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Other",
]

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
  { day: "TUE", date: "28", fullDate: "Wed, 28 July 2026" },
  { day: "WED", date: "29", fullDate: "Wed, 29 July 2026" },
  { day: "THU", date: "30", fullDate: "Thu, 30 July 2026" },
  { day: "FRI", date: "31", fullDate: "Fri, 31 July 2026" },
  { day: "SAT", date: "1", fullDate: "Sat, 1 August 2026" },
  { day: "SUN", date: "2", fullDate: "Sun, 2 August 2026" },
  { day: "MON", date: "3", fullDate: "Mon, 3 August 2026" },
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
  // Step flow: 1 (Email), 2 (Information), 3 (Options), 4 (Date/Time), 5 (Confirmation)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)

  const [formData, setFormData] = useState<FormState>({
    workEmail: "",
    country: "United Kingdom",
    firstName: "",
    lastName: "",
    companyName: "",
    companyWebsite: "",
    phonePrefix: "+44",
    phone: "",
    role: "",
    industryType: "",
    notes: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calendar Booking State
  const [selectedDateObj, setSelectedDateObj] = useState(DAYS_SLOTS[1]) // Default Wed 29
  const [selectedTime, setSelectedTime] = useState("9:15 AM")
  const [timezone, setTimezone] = useState("Europe/London")

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const tempErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.workEmail.trim() || !emailRegex.test(formData.workEmail)) {
      tempErrors.workEmail = "Please enter a valid work email."
    }
    if (!formData.country) {
      tempErrors.country = "Please select a country."
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const tempErrors: FormErrors = {}

    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required."
    if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required."
    if (!formData.companyName.trim()) tempErrors.companyName = "Company name is required."
    if (!formData.role) tempErrors.role = "Please select a role."
    if (!formData.industryType) tempErrors.industryType = "Please select an industry type."

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleStep2Submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsSubmitting(true)

    try {
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        workEmail: formData.workEmail,
        country: formData.country,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        phone: `${formData.phonePrefix} ${formData.phone}`.trim(),
        jobTitle: formData.role,
        companyType: formData.industryType,
        requirements: formData.notes || "Submitted via Demo Request Flow",
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
      setStep(3)
    } catch (error) {
      console.error("Submission failed:", error)
      // Transition to next step anyway for demonstration if backend is not live
      setStep(3)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[130vh] bg-slate-100 flex flex-col justify-between items-center gap-10 relative overflow-hidden font-sans px-4 sm:px-6 md:px-12 py-12 sm:py-20">
      {/* Background Decorative Diagonal Wave */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0 overflow-hidden leading-none">
  <img
    src="/diagonalbackground.png" 
    alt=""
    className="w-full h-auto min-h-[300px] object-cover object-bottom"
  />
</div>

      {/* Main Container Card */}
      <div className="relative z-10 mt-6 sm:mt-12 w-full max-w-xl bg-white rounded-xl shadow-2xl shadow-slate-300/60 border border-slate-100/80 overflow-hidden p-6 sm:p-10">
        
        {/* Step Indicator Bar (Steps 1 - 4) */}
{step < 5 && (
  <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-5 mb-8 text-xs font-bold">
    {/* Step 1: Your Email */}
    <div
      className="flex items-center gap-2 pb-2 relative transition-colors cursor-pointer text-slate-900"
      onClick={() => step > 1 && setStep(1)}
    >
      <span
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0",
          step > 1
            ? "bg-blue-600 text-white"
            : "border-2 border-blue-600 bg-white"
        )}
      >
        {step > 1 && (
          <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-slate-900 font-bold">Your Email</span>
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-blue-600 transition-all" />
    </div>

    {/* Step 2: Your Information */}
    <div
      className={cn(
        "flex items-center gap-2 pb-2 relative transition-colors text-slate-900",
        step > 2 ? "cursor-pointer" : ""
      )}
      onClick={() => step > 2 && setStep(2)}
    >
      <span
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0",
          step > 2
            ? "bg-blue-600 text-white"
            : "border-2 border-blue-600 bg-white"
        )}
      >
        {step > 2 && (
          <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-slate-900 font-bold">Your Information</span>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 rounded-full transition-all",
          step >= 2 ? "bg-blue-600" : "bg-slate-200"
        )}
      />
    </div>

    {/* Step 3 & 4: Lets talk */}
    <div className="flex items-center gap-2 pb-2 relative transition-colors text-slate-900">
      <span
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0",
          step > 4
            ? "bg-blue-600 text-white"
            : "border-2 border-blue-600 bg-white"
        )}
      >
        {step > 4 && (
          <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-slate-900 font-bold">Lets talk</span>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 rounded-full transition-all",
          step >= 3 ? "bg-blue-600" : "bg-slate-200"
        )}
      />
    </div>
  </div>
)}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL & COUNTRY */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-3 mt-0">
                Lets get you to the right place
              </h1>
              <p className="mt-1 text-xs text-slate-500 mb-6">
                We just need a few quick details.
              </p>

              <form onSubmit={handleStep1Submit} className="space-y-4">
                {/* Work Email */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="workEmail" className="text-xs font-bold text-slate-900">
                    Work Email
                  </label>
                  <div className="col-span-2">
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-100 transition-all",
                        errors.workEmail && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    />
                  </div>
                </div>

                {/* Country / Region */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="country" className="text-xs font-bold text-slate-900">
                    Country / Region
                  </label>
                  <div className="col-span-2 relative">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 text-slate-900 text-xs appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-100 transition-all",
                        errors.country && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="text-slate-900">
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-6 rounded-1xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    Continue <span>&rarr;</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: FULL CONTACT INFORMATION */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                How can we reach you?
              </h1>
              <p className="mt-1 text-xs text-slate-500 mb-6">
                Please provide your contact information
              </p>

              <form onSubmit={handleStep2Submit} className="space-y-3.5">
                {/* First Name */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="firstName" className="text-xs font-bold text-slate-900">
                    First Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.firstName && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="lastName" className="text-xs font-bold text-slate-900">
                    Last Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.lastName && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="companyName" className="text-xs font-bold text-slate-900">
                    Company
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.companyName && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    />
                  </div>
                </div>

                {/* Company Website */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="companyWebsite" className="text-xs font-bold text-slate-900">
                    Company Website
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="companyWebsite"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="phone" className="text-xs font-bold text-slate-900">
                    Phone
                  </label>
                  <div className="col-span-2 flex gap-1.5">
                    <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-2 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span>🇬🇧</span>
                      <select
                        name="phonePrefix"
                        value={formData.phonePrefix}
                        onChange={handleChange}
                        className="bg-transparent focus:outline-none text-xs cursor-pointer"
                      >
                        <option value="+44">+44</option>
                        <option value="+1">+1</option>
                        <option value="+49">+49</option>
                      </select>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="role" className="text-xs font-bold text-slate-900">
                    Role
                  </label>
                  <div className="col-span-2 relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs appearance-none cursor-pointer border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        !formData.role && "text-slate-400",
                        errors.role && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    >
                      <option value="" disabled hidden>
                        Select your role
                      </option>
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="text-slate-900">
                          {r}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Industry Type */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="industryType" className="text-xs font-bold text-slate-900">
                    Industry type
                  </label>
                  <div className="col-span-2 relative">
                    <select
                      id="industryType"
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs appearance-none cursor-pointer border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        !formData.industryType && "text-slate-400",
                        errors.industryType && "ring-1 ring-red-500 bg-red-50/30"
                      )}
                    >
                      <option value="" disabled hidden>
                        Select industry type
                      </option>
                      {INDUSTRY_TYPES.map((t) => (
                        <option key={t} value={t} className="text-slate-900">
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Anything else */}
                <div className="grid grid-cols-3 items-start gap-2 pt-1">
                  <label htmlFor="notes" className="text-xs font-bold text-slate-900 pt-1">
                    Anything else
                  </label>
                  <div className="col-span-2">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50/80 text-slate-900 text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Marketing Consent Disclaimer */}
                <p className="text-[10px] text-slate-400 leading-snug pt-2">
                  You may receive marketing communications from Fintech Connect & D4t Group including
                  product updates, industry news and events. You can unsubscribe at any time.
                </p>

                {/* Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-900 hover:text-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-6 rounded-1xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : <>Submit <span>&rarr;</span></>}
                  </button>
                </div>

                {/* Privacy Policy Disclaimer Footer */}
                <p className="text-[9px] text-slate-400 text-center pt-2">
                  Fintech Connect will handle your personal information in accordance with its{" "}
                  <a href="#" className="underline text-slate-500 hover:text-blue-600">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </motion.div>
          )}

          {/* STEP 3: SUBMISSION SUB-OPTIONS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Thanks for your submission
              </h2>
              <p className="mt-1 text-medium text-slate-500 leading-relaxed mb-6">
                Our representative will reach out within 72 hrs. Select an option below to connect
                more quickly
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Chat with Sales Card */}
                <div className="border border-slate-100 bg-slate-50/40 rounded-xl p-5 flex flex-col justify-between hover:border-slate-200 transition-all">
                  <div>
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-3 shadow-sm shadow-blue-500/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">Chat with Sales</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Chat now with our sales representatives
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Connecting to live chat...")}
                    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-2 px-3.5 rounded-xl w-max flex items-center gap-1 transition-all shadow-sm shadow-blue-500/20"
                  >
                    Start Chat <span>&rarr;</span>
                  </button>
                </div>

                {/* Schedule a Call Card */}
                <div className="border border-slate-100 bg-slate-50/40 rounded-xl p-5 flex flex-col justify-between hover:border-slate-200 transition-all">
                  <div>
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-3 shadow-sm shadow-blue-500/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">Schedule a Call</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Chat now with our sales representatives
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(4)}
                    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-2 px-3.5 rounded-xl w-max flex items-center gap-1 transition-all shadow-sm shadow-blue-500/20"
                  >
                    Book call <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DATE & TIME PICKER */}
{step === 4 && (
  <motion.div
    key="step-4"
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    className="space-y-5"
  >
    {/* Title & Description */}
    <div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        Select a date and time
      </h2>
      <p className="mt-1 text-medium text-slate-500 leading-relaxed">
        Book a 15-minute call with a our sales rep to tell us about your business and how we can help.
      </p>
    </div>

    {/* Horizontal Divider */}
    <div className="h-px bg-slate-100 w-full" />

    {/* Month Navigation Header */}
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-slate-900">July 2026</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    {/* Horizontal Days Strip */}
    <div className="grid grid-cols-7 gap-2">
      {DAYS_SLOTS.map((slot) => {
        const isSelected = selectedDateObj.date === slot.date
        return (
          <button
            type="button"
            key={slot.date}
            onClick={() => setSelectedDateObj(slot)}
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all",
              isSelected
                ? "border-2 border-blue-600 bg-white text-blue-600 shadow-sm"
                : "border-slate-100 bg-slate-50/50 text-slate-900 hover:bg-slate-100/70"
            )}
          >
            <span
              className={cn(
                "text-[10px] uppercase font-bold tracking-wider",
                isSelected ? "text-blue-500" : "text-slate-500"
              )}
            >
              {slot.day}
            </span>
            <span
              className={cn(
                "text-sm font-bold mt-1",
                isSelected ? "text-blue-600" : "text-slate-900"
              )}
            >
              {slot.date}
            </span>
          </button>
        )
      })}
    </div>

    {/* Horizontal Divider */}
    <div className="h-px bg-slate-100 w-full" />

    {/* Timezone Select */}
    <div className="flex items-center">
      <div className="relative inline-flex items-center">
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="bg-transparent text-sm font-bold text-slate-900 appearance-none pr-6 cursor-pointer focus:outline-none"
        >
          <option value="Europe/London">Europe/London</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Asia/Tokyo">Asia/Tokyo</option>
        </select>
        <svg
          className="w-3.5 h-3.5 absolute right-0 text-slate-700 pointer-events-none stroke-[2.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {/* Time Slot Grid */}
    <div className="grid grid-cols-3 gap-3">
      {TIME_SLOTS.map((time) => {
        const isSelected = selectedTime === time
        return (
          <button
            type="button"
            key={time}
            onClick={() => setSelectedTime(time)}
            className={cn(
              "py-3 rounded-2xl border text-xs font-semibold transition-all text-center",
              isSelected
                ? "border-2 border-blue-600 bg-white text-blue-600 shadow-sm"
                : "border-slate-100 bg-slate-50/40 text-slate-800 hover:bg-slate-100/70"
            )}
          >
            {time}
          </button>
        )
      })}
    </div>

    {/* Horizontal Divider */}
    <div className="h-px bg-slate-100 w-full" />

    {/* Action Buttons */}
    <div className="flex items-center justify-between pt-1">
      <button
        type="button"
        onClick={() => setStep(3)}
        className="text-xs font-bold text-slate-900 hover:text-slate-700 transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={() => setStep(5)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
      >
        Book <span>&rarr;</span>
      </button>
    </div>
  </motion.div>
)}

          {/* STEP 5: FINAL CONFIRMATION */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-center pt-2"
            >
              {/* Checkmark Icon Circle */}
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Your demo is confirmed !
              </h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-medium mx-auto mb-6">
                Our team will get in touch with you shortly. An email has been shared with your booking
                details below. See you soon
              </p>

              {/* Confirmation Details Card */}
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/80 text-left space-y-3 mb-6">
                {/* Demo */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800">Demo</p>
                    <p className="text-xs text-slate-500">Fintech Connect</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800">Date</p>
                    <p className="text-xs text-slate-500">{selectedDateObj.fullDate}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800">Time</p>
                    <p className="text-xs text-slate-500">{selectedTime} (BST)</p>
                  </div>
                </div>

                {/* Format */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800">Format</p>
                    <p className="text-xs text-slate-500">Online Meeting</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-6 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  Return to Home <span>&rarr;</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}