"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPath } from "@/utils/helper";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingLoading from "@/components/onboarding/OnboardingLoading";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Distinct state for each step's selections
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedBuildOption, setSelectedBuildOption] = useState<string>("");

  useEffect(() => {
    const isOnboarding = searchParams.get("onboarding") === "true";
    if (isOnboarding) {
      setShowOnboarding(true);
      fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.onboarding) {
            const profile = data.onboarding;
            if (profile.businessType) {
              setSelectedRoles([profile.businessType]);
            }
            if (profile.goals && profile.goals.length > 0) {
              setSelectedGoals(profile.goals);
            }
            if (profile.industries && profile.industries.length > 0) {
              setSelectedIndustries(profile.industries);
            }
            if (profile.buildOption) {
              setSelectedBuildOption(profile.buildOption);
            }
            if (profile.currentStep && profile.currentStep >= 1 && profile.currentStep <= 5) {
              setCurrentStep(profile.currentStep);
            }
          }
        })
        .catch((err) => console.warn("Failed to load onboarding progress:", err));
    }
  }, [searchParams]);

  const saveOnboardingData = async (data: {
    businessType?: string;
    goals?: string[];
    industries?: string[];
    buildOption?: string;
    currentStep?: number;
    completed?: boolean;
  }) => {
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Failed to persist onboarding step:", err);
    }
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
    saveOnboardingData({ currentStep: 2 });
  };

  const handleStep2Next = (roles: string[]) => {
    setSelectedRoles(roles);
    setCurrentStep(3);
    saveOnboardingData({
      businessType: roles[0] || "startup",
      currentStep: 3,
    });
  };

  const handleStep3Next = (goals: string[]) => {
    setSelectedGoals(goals);
    setCurrentStep(4);
    saveOnboardingData({
      goals,
      currentStep: 4,
    });
  };

  const handleStep4Next = (industries: string[]) => {
    setSelectedIndustries(industries);
    setCurrentStep(5);
    saveOnboardingData({
      industries,
      currentStep: 5,
    });
  };

  const handleStep5Next = (buildOption: string) => {
    setSelectedBuildOption(buildOption);
    setCurrentStep(6); // Move to Loading Screen
    saveOnboardingData({
      buildOption,
      currentStep: 5,
    });
  };

  const handleFinalFinish = () => {
    saveOnboardingData({
      businessType: selectedRoles[0] || undefined,
      goals: selectedGoals,
      industries: selectedIndustries,
      buildOption: selectedBuildOption || undefined,
      completed: true,
      currentStep: 6,
    });
    setShowOnboarding(false);
    router.replace("/dashboard/organization", { scroll: false });
  };

  const handleBack = () => {
    const prevStep = Math.max(1, currentStep - 1);
    setCurrentStep(prevStep);
    saveOnboardingData({ currentStep: prevStep });
  };

  const handleSkip = () => {
    saveOnboardingData({ completed: true });
    setShowOnboarding(false);
    router.replace("/dashboard/organization", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Background Dashboard UI */}
      <img
        src={getPath("/surveybackground.png")}
        alt="Dashboard Background"
        className="fixed inset-0 w-full h-full object-fill opacity-60 pointer-events-none"
      />

      {/* Conditional Onboarding Steps */}
      {showOnboarding && currentStep === 1 && (
        <OnboardingStep1 onNext={handleStep1Next} onSkip={handleSkip} />
      )}

      {showOnboarding && currentStep === 2 && (
        <OnboardingStep2
          initialSelection={selectedRoles[0]}
          onNext={handleStep2Next}
          onBack={handleBack}
        />
      )}

      {showOnboarding && currentStep === 3 && (
        <OnboardingStep3
          initialSelections={selectedGoals}
          onNext={handleStep3Next}
          onBack={handleBack}
        />
      )}

      {showOnboarding && currentStep === 4 && (
        <OnboardingStep4
          initialSelections={selectedIndustries}
          onNext={handleStep4Next}
          onBack={handleBack}
        />
      )}

      {/* Step 5 */}
      {showOnboarding && currentStep === 5 && (
        <OnboardingStep5
          initialSelection={selectedBuildOption}
          onNext={handleStep5Next}
          onBack={handleBack}
        />
      )}

      {/* Loading Screen */}
      {showOnboarding && currentStep === 6 && (
        <OnboardingLoading
          duration={12000}
          onComplete={() => {
            setCurrentStep(7); // Transition to Step 6 (Final Screen)
          }}
        />
      )}

      {/* Step 6: Final Completion Screen */}
      {showOnboarding && currentStep === 7 && (
        <OnboardingStep6 onContinue={handleFinalFinish} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <DashboardContent />
    </Suspense>
  );
}