import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ListTodo, LineChart, ArrowRight, Hourglass } from 'lucide-react';

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
    let isMounted = true;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (isMounted && onComplete) {
            // Use setTimeout to avoid React state update warning
            setTimeout(() => {
              onComplete();
            }, 0);
          }
          return 100;
        }
        return prev + 5;
      });
    }, duration / 20);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [duration, onComplete]);

  // Always show hourglass as requested
  const getIcon = () => {
    return <Hourglass className="h-10 w-10 text-white" />;
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
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 rounded-md">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Top Tab Navigation (non-functional) */}
        <div className="flex mb-8 bg-slate-100 rounded-xl p-1 self-start">
          <div className={`px-4 py-2 rounded-lg ${tabName === 'overview' ? 'bg-white shadow-sm' : ''}`}>Overview</div>
          <div className={`px-4 py-2 rounded-lg ${tabName === 'metrics' ? 'bg-white shadow-sm' : ''}`}>Metrics</div>
          <div className={`px-4 py-2 rounded-lg ${tabName === 'recommendations' ? 'bg-white shadow-sm' : ''}`}>Recommendations</div>
        </div>
        
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
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
            {getIcon()}
          </div>
        </motion.div>
        
        {/* Message */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-medium text-blue-600 mb-6 flex items-center justify-center text-center"
        >
          {getMessage()}
        </motion.div>
        
        {/* Progress Bar */}
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "easeInOut" }}
          className="w-full max-w-sm bg-blue-500 h-2 rounded-full mb-3"
        />
        
        {/* Progress Text */}
        <div className="text-sm text-gray-500 font-medium">
          {progress}% complete
        </div>
      </div>
    </div>
  );
};

export default TabLoader;