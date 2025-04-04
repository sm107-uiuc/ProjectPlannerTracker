import { Vehicle } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface PerformersCardProps {
  title: string;
  vehicles: Vehicle[];
  variant: 'success' | 'danger';
  showRank: boolean;
}

const PerformersCard = ({ title, vehicles, variant, showRank }: PerformersCardProps) => {
  const getBackgroundColor = (vehicle: Vehicle) => {
    if (!showRank) {
      if (vehicle.status === 'Action Required') {
        return 'bg-red-50/50';
      } else if (vehicle.status === 'Needs Review') {
        return 'bg-amber-50/50';
      }
    }
    return '';
  };

  const getIconContainer = (index: number, vehicle: Vehicle) => {
    if (showRank) {
      return (
        <div className={`w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3`}>
          {index + 1}
        </div>
      );
    } else {
      if (vehicle.status === 'Action Required') {
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      } else {
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <ul className="space-y-3">
          {vehicles.map((vehicle, index) => (
            <li 
              key={vehicle.id} 
              className={`flex items-center justify-between ${getBackgroundColor(vehicle)} p-2 rounded-md`}
            >
              <div className="flex items-center">
                {getIconContainer(index, vehicle)}
                <span className="font-medium">{vehicle.id}</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold">{vehicle.overallScore}</span>
                <span className="text-gray-500 text-sm ml-1">/100</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PerformersCard;
