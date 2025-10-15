'use client';

import { useState, useEffect } from 'react';
import { IntroAnimation } from '@/components/ui/intro-animation';

interface IntroProviderProps {
  children: React.ReactNode;
}

export function IntroProvider({ children }: IntroProviderProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('darkbet-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('darkbet-intro-seen', 'true');
  };

  return (
    <>
      {mounted && showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      {children}
    </>
  );
}
