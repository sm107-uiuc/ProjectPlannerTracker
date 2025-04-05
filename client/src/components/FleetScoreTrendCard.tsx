import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FleetScoreTrendCardProps {
  trend: string;
  isTrendPositive: boolean;
}

const FleetScoreTrendCard = ({ trend, isTrendPositive }: FleetScoreTrendCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Fleet Score Trend (Last 30 Days)</h2>
        <div className="flex flex-col h-[calc(100%-2rem)] justify-between">
          <div className="relative h-24 w-full">
            {/* Simple SVG chart placeholder */}
            <svg className="w-full h-full" viewBox="0 0 100 50">
              <path 
                d={isTrendPositive 
                  ? "M0,25 L10,30 L20,28 L30,32 L40,25 L50,20 L60,15 L70,18 L80,14 L90,10 L100,5" 
                  : "M0,15 L10,18 L20,14 L30,20 L40,25 L50,28 L60,32 L70,35 L80,30 L90,40 L100,45"
                } 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="flex items-center mt-2">
            <div 
              className={`text-sm font-medium px-2 py-1 rounded-md ${
                isTrendPositive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {isTrendPositive 
                ? <TrendingUp className="w-4 h-4 inline mr-1" /> 
                : <TrendingDown className="w-4 h-4 inline mr-1" />
              }
              {trend}
            </div>
            <span className="text-sm text-gray-500 ml-2">from previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetScoreTrendCard;
