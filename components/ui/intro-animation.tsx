'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Shield } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    { icon: Shield, text: 'DarkBet', color: 'text-yellow-400', fontClass: 'font-brand' },
    { icon: TrendingUp, text: 'DarkPool Betting', color: 'text-white', fontClass: 'font-heading' },
    { icon: Zap, text: 'Powered by BNB', color: 'text-yellow-400', fontClass: 'font-heading' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 1000);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div className="text-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center"
                >
                  <TrendingUp className="w-10 h-10 text-black" />
                </motion.div>
                
                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-yellow-400"
                />
              </div>
            </motion.div>

            {/* Animated Text Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: currentStep >= index ? 1 : 0.3,
                      y: currentStep >= index ? 0 : 20,
                      scale: currentStep === index ? 1.05 : 1
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`flex items-center justify-center space-x-3 ${
                      currentStep === index ? step.color : 'text-gray-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className={`text-2xl font-bold tracking-wide ${step.fontClass}`}>
                      {step.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
