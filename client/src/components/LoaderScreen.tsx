import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hourglass,
  Calculator, 
  LineChart, 
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
    "Analyzing fleet performance data",
    "Calculating your fleet score",
    "Processing metrics and trends",
    "Generating personalized recommendations",
    "Finalizing dashboard"
  ],
  duration = 5000,
  onComplete,
  variant = 'full'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepDuration = duration / messages.length;
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (currentStep < messages.length) {
      const timer = setTimeout(() => {
        setCurrentStep(step => step + 1);
        setProgress((currentStep + 1) * (100 / messages.length));
      }, stepDuration);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentStep, messages.length, onComplete, stepDuration]);

  // Use hourglass for all steps
  const hourglass = <Hourglass className="h-10 w-10 text-white" />;

  const containerClasses = variant === 'full' 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
    : "absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-20 rounded-md";

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-md px-6 flex flex-col items-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-10"
        >
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
            <motion.div className="flex items-center justify-center">
              {hourglass}
            </motion.div>
          </div>
        </motion.div>

        {/* Current Action Text */}
        <motion.div
          key={currentStep}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-medium text-blue-600 mb-10 text-center"
        >
          {currentStep < messages.length ? messages[currentStep] : "Ready!"}
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Progress Percentage */}
        <div className="text-sm text-gray-500 font-medium mb-8">
          {Math.round(progress)}% complete
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between w-full max-w-xs">
          {messages.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < currentStep 
                  ? 'bg-blue-500' 
                  : index === currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
              }`}
              animate={index === currentStep ? { 
                scale: [1, 1.2, 1],
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoaderScreen;