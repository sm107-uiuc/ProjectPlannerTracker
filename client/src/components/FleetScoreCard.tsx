import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FleetScoreCardProps {
  fleetScore: number;
}

const FleetScoreCard = ({ fleetScore }: FleetScoreCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Fleet Score</h2>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">{fleetScore}</span>
              <span className="text-gray-500 ml-1">/100</span>
            </div>
            <div className="mt-2">
              <Progress value={fleetScore} className="h-2" />
            </div>
          </div>
          <div className="w-20 h-20 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray={`${fleetScore}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-xl font-bold text-gray-800">{fleetScore}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetScoreCard;
