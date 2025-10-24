'use client';

import { useState, useEffect, createContext, useContext } from 'react';

import { usePrivy } from '@privy-io/react-auth';

import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  showOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  isOnboardingComplete: false,
  showOnboarding: () => {},
  resetOnboarding: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('darkbet_onboarding_completed');
      setIsOnboardingComplete(completed === 'true');
    }
  }, []);

  // Show onboarding modal on first visit
  useEffect(() => {
    if (!mounted || !ready) return;

    // Check if onboarding is complete
    const completed = localStorage.getItem('darkbet_onboarding_completed');

    if (completed !== 'true') {
      // Show onboarding modal after a short delay
      const timer = setTimeout(() => {
        setShowOnboardingModal(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mounted, ready]);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
    setShowOnboardingModal(false);
  };

  const showOnboarding = () => {
    setShowOnboardingModal(true);
  };

  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('darkbet_onboarding_completed');
      localStorage.removeItem('concordium_id_commitment');
      localStorage.removeItem('concordium_attributes');
      localStorage.removeItem('bet_restrictions');
      setIsOnboardingComplete(false);
      setShowOnboardingModal(true);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        showOnboarding,
        resetOnboarding,
      }}
    >
      {children}

      <OnboardingFlow
        open={showOnboardingModal}
        onOpenChange={setShowOnboardingModal}
        onComplete={handleOnboardingComplete}
      />
    </OnboardingContext.Provider>
  );
}
