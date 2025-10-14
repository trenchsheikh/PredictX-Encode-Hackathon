'use client';

import { useState, useEffect } from 'react';
import { IntroAnimation } from '@/components/ui/intro-animation';

interface IntroProviderProps {
  children: React.ReactNode;
}

export function IntroProvider({ children }: IntroProviderProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('darkbet-intro-seen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('darkbet-intro-seen', 'true');
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      {children}
    </>
  );
}
