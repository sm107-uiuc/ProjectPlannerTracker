import { Card, CardContent } from "@/components/ui/card";
import { Recommendation } from "@/lib/types";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface RecommendationsCardProps {
  goalName: string;
  recommendations: Recommendation[];
}

const RecommendationsCard = ({ goalName, recommendations }: RecommendationsCardProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'alert-triangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'alert-circle':
        return <AlertCircle className="w-4 h-4" />;
      case 'info':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-600';
      case 'danger':
        return 'bg-red-100 text-red-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Recommendations based on {goalName}</h2>
        <ul className="space-y-4">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <div className={`rounded-full ${getColorClass(rec.type)} p-1 mr-3 mt-0.5`}>
                {getIcon(rec.icon)}
              </div>
              <div>
                <p className="text-sm text-gray-800">{rec.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
