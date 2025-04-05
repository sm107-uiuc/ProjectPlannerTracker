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
                {/* Draw the line chart */}
                <svg className="w-full h-full" viewBox={`0 0 ${dataPoints.length - 1} 100`} preserveAspectRatio="none">
                  <path
                    d={`M0,${100 - ((dataPoints[0] - lowestPoint) / (highestPoint - lowestPoint) * 100)} ${dataPoints.slice(1).map((point, i) => {
                      const yValue = 100 - ((point - lowestPoint) / (highestPoint - lowestPoint) * 100);
                      return `L${i + 1},${yValue}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* Line chart points */}
                <div className="absolute top-0 left-0 w-full h-full flex justify-between items-end">
                  {dataPoints.map((point, index) => {
                    if (index % 5 === 0 || index === dataPoints.length - 1) { // Show only every 5th point for clarity
                      const height = ((point - lowestPoint) / (highestPoint - lowestPoint) * 100);
                      return (
                        <div 
                          key={index}
                          className="relative"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute bottom-0 w-2 h-2 bg-blue-600 rounded-full" />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}
          </div>
          
          {/* Trend indicator and value */}
          <div className="flex items-center">
            <div 
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                isTrendPositive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {isTrendPositive 
                ? <ArrowUpRight className="w-4 h-4 inline mr-1" /> 
                : <TrendingDown className="w-4 h-4 inline mr-1" />
              }
              {formattedTrend}
            </div>
            <span className="text-sm text-gray-500 ml-2">from previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetScoreTrendCard;
