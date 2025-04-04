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
          <div className="w-20 h-20 flex items-center justify-center rounded-full border-8 border-gray-100">
            <span className="text-xl font-bold text-gray-800">{fleetScore}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetScoreCard;
