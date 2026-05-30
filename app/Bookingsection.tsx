"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

// Define types for form fields
interface FormState {
  fullName: string
  workEmail: string
  companyName: string
  jobTitle: string
  companyType: string
  requirements: string
}

interface FormErrors {
  fullName?: string
  workEmail?: string
  companyName?: string
  jobTitle?: string
  companyType?: string
  requirements?: string
}

const COMPANY_TYPES = [
  "Retail Bank",
  "Commercial Bank",
  "Credit Union",
  "Fintech Startup",
  "Neobank",
  "Enterprise / Institutional",
  "Other",
]

export default function BookingSection() {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    workEmail: "",
    companyName: "",
    jobTitle: "",
    companyType: "",
    requirements: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle inputs dynamically
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear field-specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Frontend form validation
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.fullName.trim()) tempErrors.fullName = "Full name is required."
    

    if (!formData.companyName.trim()) tempErrors.companyName = "Company name is required."
    if (!formData.jobTitle.trim()) tempErrors.jobTitle = "Job title is required."
    if (!formData.companyType) tempErrors.companyType = "Please select a company type."
    if (!formData.requirements.trim()) {
      tempErrors.requirements = "Please let us know what you are looking to build."
    } else if (formData.requirements.trim().length < 10) {
      tempErrors.requirements = "Please provide a bit more detail (at least 10 characters)."
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API deployment wrapper or endpoint processing
      await new Promise((resolve) => setTimeout(resolve, 1800))
      
      console.log("Form successfully submitted:", formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-6 font-sans">
      <div className="max-w-7xl w-full bg-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-12"
            >
              {/* Header */}
              <div className="text-center md:text-left mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
                  Book a Demo Session
                </h1>
                <p className="mt-3 text-lg text-slate-600">
                  See how our prebuilt templates can accelerate your platform launch.
                </p>
              </div>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm",
                        errors.fullName 
                          ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
                          : "border-slate-200 focus:ring-slate-100 focus:border-slate-900"
                      )}
                    />
                    {errors.fullName && (
                      <span className="text-xs font-medium text-red-500 mt-1">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Work Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="workEmail" className="text-sm font-semibold text-slate-700">
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm",
                        errors.workEmail 
                          ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
                          : "border-slate-200 focus:ring-slate-100 focus:border-slate-900"
                      )}
                    />
                    {errors.workEmail && (
                      <span className="text-xs font-medium text-red-500 mt-1">{errors.workEmail}</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="companyName" className="text-sm font-semibold text-slate-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Fintech Connect Corp"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm",
                        errors.companyName 
                          ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
                          : "border-slate-200 focus:ring-slate-100 focus:border-slate-900"
                      )}
                    />
                    {errors.companyName && (
                      <span className="text-xs font-medium text-red-500 mt-1">{errors.companyName}</span>
                    )}
                  </div>

                  {/* Job Title */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="jobTitle" className="text-sm font-semibold text-slate-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="Product Manager"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm",
                        errors.jobTitle 
                          ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
                          : "border-slate-200 focus:ring-slate-100 focus:border-slate-900"
                      )}
                    />
                    {errors.jobTitle && (
                      <span className="text-xs font-medium text-red-500 mt-1">{errors.jobTitle}</span>
                    )}
                  </div>
                </div>

                {/* Company Type Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="companyType" className="text-sm font-semibold text-slate-700">
                    Company Type
                  </label>
                  <div className="relative">
                    <select
                      id="companyType"
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 transition-all duration-200 text-sm appearance-none cursor-pointer",
                        errors.companyType 
                          ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
                          : "border-slate-200 focus:ring-slate-100 focus:border-slate-900",
                        !formData.companyType && "text-slate-400"
                      )}
                    >
                      <option value="" disabled hidden>Select your industry segment</option>
                      {COMPANY_TYPES.map((type) => (
                        <option key={type} value={type} className="text-slate-900">
                          {type}
                        </option>
                      ))}
                    </select>
                    {/* Native dropdown chevron icon replacement */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.companyType && (
                    <span className="text-xs font-medium text-red-500 mt-1">{errors.companyType}</span>
                  )}
                </div>

                {/* Requirements Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="requirements" className="text-sm font-semibold text-slate-700">
                    What are you looking to build?
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Tell us a bit about your app roadmap, target users, or required prebuilt integration templates..."
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm resize-none",
                      errors.requirements 
                        ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
                        : "border-slate-200 focus:ring-slate-100 focus:border-slate-900"
                    )}
                  />
                  {errors.requirements && (
                    <span className="text-xs font-medium text-red-500 mt-1">{errors.requirements}</span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-4 px-6 rounded-xl transition-all duration-150 shadow-md shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Securing your slot...
                      </>
                    ) : (
                      "Confirm & Schedule Demo"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Animated Success Screen Block */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100/60">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
                Demo Request Received!
              </h2>
              <p className="mt-3 text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Thank you, <span className="font-semibold text-slate-800">{formData.fullName.split(" ")[0]}</span>. 
                We've synchronized your parameters. A product architect will reach out to you at <span className="font-semibold text-slate-800">{formData.workEmail}</span> within 24 hours with an interactive tailored environment.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-xs font-semibold tracking-wide text-slate-400 hover:text-slate-600 underline decoration-2 underline-offset-4 transition-colors"
              >
                Book another demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}