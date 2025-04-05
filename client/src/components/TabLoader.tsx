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
    <div className="w-full space-y-4 py-4">
      {/* Skeleton Loader based on tab type */}
      <div className="space-y-6 w-full animate-pulse">
        {tabName === 'overview' && (
          <>
            {/* First row - Goal Description Card skeleton */}
            <div className="w-full h-40 bg-gray-200 rounded-md"></div>
            
            {/* Second row - 3 cards skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded-md"></div>
              <div className="h-32 bg-gray-200 rounded-md"></div>
              <div className="h-32 bg-gray-200 rounded-md"></div>
            </div>
            
            {/* Third row - Recommendations Card skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-md"></div>
            
            {/* Fourth row - Table skeleton */}
            <div className="w-full h-72 bg-gray-200 rounded-md"></div>
            
            {/* Fifth row - Two cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded-md"></div>
              <div className="h-48 bg-gray-200 rounded-md"></div>
            </div>
          </>
        )}
        
        {tabName === 'metrics' && (
          <>
            {/* Metrics charts skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-md"></div>
              <div className="h-64 bg-gray-200 rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-md"></div>
              <div className="h-64 bg-gray-200 rounded-md"></div>
            </div>
            <div className="w-full h-80 bg-gray-200 rounded-md"></div>
          </>
        )}
        
        {tabName === 'recommendations' && (
          <>
            {/* Recommendations tab skeleton */}
            <div className="flex space-x-4 mb-4">
              <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
            </div>
            <div className="w-full h-96 bg-gray-200 rounded-md"></div>
            <div className="w-full h-16 bg-gray-200 rounded-md"></div>
          </>
        )}
      </div>
      
      {/* Simple loading text at bottom */}
      <div className="w-full text-center text-sm text-blue-500">{getMessage()}</div>
    </div>
  );
};

export default TabLoader;