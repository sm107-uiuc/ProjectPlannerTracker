import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PersonStanding, 
  Calculator, 
  BarChart3, 
  Lightbulb, 
  CheckCircle 
} from 'lucide-react';

interface LoaderScreenProps {
  messages?: string[];
  duration?: number;
  onComplete?: () => void;
  variant?: 'full' | 'overlay';
}

export const LoaderScreen: React.FC<LoaderScreenProps> = ({ 
  messages = [
    "Personalizing your actions",
    "Calculating your current Fleet Score",
    "Deriving required metrics",
    "Generating personalized recommendations",
    "Finalizing"
  ],
  duration = 5000,
  onComplete,
  variant = 'full'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepDuration = duration / messages.length;
  
  useEffect(() => {
    if (currentStep < messages.length) {
      const timer = setTimeout(() => {
        setCurrentStep(step => step + 1);
      }, stepDuration);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentStep, messages.length, onComplete, stepDuration]);

  const icons = [
    <PersonStanding key="person" className="h-8 w-8" />,
    <Calculator key="calculator" className="h-8 w-8" />,
    <BarChart3 key="chart" className="h-8 w-8" />,
    <Lightbulb key="lightbulb" className="h-8 w-8" />,
    <CheckCircle key="check" className="h-8 w-8" />
  ];

  const containerClasses = variant === 'full' 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
    : "absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-20 rounded-md";

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-md px-6">
        <div className="flex items-center justify-center mb-12">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <motion.div className="flex items-center justify-center">
                {icons[Math.min(currentStep, icons.length - 1)]}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="relative">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index < currentStep ? 'bg-green-500' : 
                  index === currentStep ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'
                }`}>
                  {index < currentStep && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className={`text-lg ${
                  index < currentStep ? 'text-gray-400' : 
                  index === currentStep ? 'text-blue-600 font-medium' : 'text-gray-300'
                }`}>
                  {message}
                </div>
              </div>
              {index !== messages.length - 1 && (
                <div className="absolute left-3 top-6 w-0.5 h-5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoaderScreen;