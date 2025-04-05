import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ListTodo, LineChart } from 'lucide-react';

interface TabLoaderProps {
  tabName: 'overview' | 'metrics' | 'recommendations';
  duration?: number;
  onComplete?: () => void;
}

export const TabLoader: React.FC<TabLoaderProps> = ({ 
  tabName, 
  duration = 2000, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 5;
      });
    }, duration / 20);
    
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  const getIcon = () => {
    switch (tabName) {
      case 'overview':
        return <BarChart3 className="h-8 w-8 text-white" />;
      case 'metrics':
        return <LineChart className="h-8 w-8 text-white" />;
      case 'recommendations':
        return <ListTodo className="h-8 w-8 text-white" />;
    }
  };

  const getMessage = () => {
    switch (tabName) {
      case 'overview':
        return "Loading fleet overview data...";
      case 'metrics':
        return "Calculating performance metrics...";
      case 'recommendations':
        return "Preparing personalized recommendations...";
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20 rounded-md">
      <div className="w-full max-w-md px-6 flex flex-col items-center">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="mb-5"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
            {getIcon()}
          </div>
        </motion.div>
        
        <div className="text-lg font-medium text-blue-600 mb-4">
          {getMessage()}
        </div>
        
        <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-500">
          {progress}% complete
        </div>
      </div>
    </div>
  );
};

export default TabLoader;