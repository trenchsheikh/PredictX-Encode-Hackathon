'use client';

import { useState, useEffect } from 'react';

interface IntroProviderProps {
  children: React.ReactNode;
}

export function IntroProvider({ children }: IntroProviderProps) {
  const [_showIntro, _setShowIntro] = useState(false);
  const [_mounted, _setMounted] = useState(false);

  useEffect(() => {
    _setMounted(true);
    // Check if user has seen intro before
    const _hasSeenIntro = localStorage.getItem('darkbet-intro-seen');
    // Disable intro animation entirely
    _setShowIntro(false);
  }, []);

  const _handleIntroComplete = () => {
    _setShowIntro(false);
    localStorage.setItem('darkbet-intro-seen', 'true');
  };

  return (
    <>
      {/* Intro animation disabled */}
      {children}
    </>
  );
}
