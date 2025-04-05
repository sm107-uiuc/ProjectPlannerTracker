import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

interface FleetScoreTrendCardProps {
  trend: string;
  isTrendPositive: boolean;
}

const FleetScoreTrendCard = ({ trend, isTrendPositive }: FleetScoreTrendCardProps) => {
  // Generate mock trend data points for the last 30 days
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate some realistic looking data with an upward or downward trend
    const generateTrendData = (positive: boolean) => {
      const baseValue = 75;
      const range = 20;
      const volatility = 5;
      const points = 30; // 30 days
      
      let currentValue = baseValue;
      const data: number[] = [];
      
      for (let i = 0; i < points; i++) {
        // Add some random movement
        const randomChange = (Math.random() * volatility) - (volatility / 2);
        
        // Add trend direction
        const trendChange = positive 
          ? (i / points) * range // gradually increasing
          : -((i / points) * range); // gradually decreasing
        
        currentValue += randomChange + (trendChange / points);
        // Keep within reasonable bounds
        currentValue = Math.max(Math.min(currentValue, baseValue + range), baseValue - range);
        data.push(Math.round(currentValue));
      }
      
      return data;
    };
    
    setDataPoints(generateTrendData(isTrendPositive));
  }, [isTrendPositive]);
  
  // Format the trend value (e.g., +5.2%)
  const formattedTrend = trend.startsWith('+') || trend.startsWith('-') 
    ? trend 
    : (isTrendPositive ? '+' : '') + trend;
  
  // Calculate highest and lowest points for scale
  const highestPoint = Math.max(...dataPoints);
  const lowestPoint = Math.min(...dataPoints);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Fleet Score Trend (Last 30 Days)</h2>
        <div className="flex flex-col h-[calc(100%-2rem)] justify-between">
          {/* Line chart visualization */}
          <div className="relative h-36 w-full mb-4">
            {dataPoints.length > 0 && (
              <>
                {/* Draw the area chart */}
                <svg className="w-full h-full" viewBox={`0 0 ${dataPoints.length - 1} 100`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4285F4" stopOpacity="1" />
                      <stop offset="100%" stopColor="#4285F4" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,${100 - ((dataPoints[0] - lowestPoint) / (highestPoint - lowestPoint) * 100)} ${dataPoints.slice(1).map((point, i) => {
                      const yValue = 100 - ((point - lowestPoint) / (highestPoint - lowestPoint) * 100);
                      return `L${i + 1},${yValue}`;
                    }).join(' ')} L${dataPoints.length - 1},100 L0,100 Z`}
                    fill="url(#areaGradient)"
                    stroke="#4285F4"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* Bottom dot markers */}
                <div className="absolute bottom-0 left-0 w-full h-10 flex justify-between items-center">
                  {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                    <div 
                      key={index}
                      className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Trend indicator and value - improved to match the screenshot */}
          <div className="flex items-center">
            <div 
              className={`text-sm font-medium px-3 py-2 rounded-full flex items-center ${
                isTrendPositive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}
            >
              <span className="mr-1.5 text-lg">
                {isTrendPositive ? "↗" : "↘"}
              </span>
              <span className="font-semibold">{formattedTrend}</span>
            </div>
            <span className="text-sm text-gray-500 ml-3">from previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetScoreTrendCard;
