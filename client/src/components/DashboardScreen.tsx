import { Goal } from "@/lib/types";
import { goalData, goalDisplayText, mockVehicles, getTopPerformers, getVehiclesNeedingAttention } from "@/lib/mockData";
import { Sidebar } from "@/components/Sidebar";
import FleetScoreCard from "@/components/FleetScoreCard";
import FleetScoreTrendCard from "@/components/FleetScoreTrendCard";
import RecommendationsCard from "@/components/RecommendationsCard";
import VehiclePerformanceTable from "@/components/VehiclePerformanceTable";
import PerformersCard from "@/components/PerformersCard";
import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardScreenProps {
  selectedGoal: Goal;
}

const DashboardScreen = ({ selectedGoal }: DashboardScreenProps) => {
  const data = goalData[selectedGoal];
  const topPerformers = getTopPerformers(mockVehicles);
  const vehiclesNeedingAttention = getVehiclesNeedingAttention(mockVehicles);

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Fleet Performance Dashboard</h1>
            <p className="text-sm text-gray-500">
              Based on: <span>{goalDisplayText[selectedGoal]}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <FleetScoreCard fleetScore={data.fleetScore} />
            <FleetScoreTrendCard 
              trend={data.trend} 
              isTrendPositive={data.isTrendPositive} 
            />
            <RecommendationsCard 
              goalName={goalDisplayText[selectedGoal]} 
              recommendations={data.recommendations} 
            />
          </div>

          <VehiclePerformanceTable 
            vehicles={mockVehicles} 
            columnEmphasis={data.columnEmphasis} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PerformersCard 
              title="Top Performing Vehicles" 
              vehicles={topPerformers} 
              variant="success" 
              showRank={true} 
            />
            <PerformersCard 
              title="Vehicles Needing Attention" 
              vehicles={vehiclesNeedingAttention} 
              variant="danger" 
              showRank={false} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardScreen;
