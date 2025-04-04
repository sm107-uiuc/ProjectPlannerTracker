import { useState } from "react";
import { Goal } from "@/lib/types";
import { goalData, goalDisplayText, mockVehicles, getTopPerformers, getVehiclesNeedingAttention } from "@/lib/mockData";
import { Sidebar } from "@/components/Sidebar";
import FleetScoreCard from "@/components/FleetScoreCard";
import FleetScoreTrendCard from "@/components/FleetScoreTrendCard";
import RecommendationsCard from "@/components/RecommendationsCard";
import VehiclePerformanceTable from "@/components/VehiclePerformanceTable";
import PerformersCard from "@/components/PerformersCard";
import { IntegrationsScreen } from "@/components/IntegrationsScreen";
import { RefreshCw, Filter, Link as LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DashboardScreenProps {
  selectedGoal: Goal;
}

const DashboardScreen = ({ selectedGoal }: DashboardScreenProps) => {
  const [showIntegrations, setShowIntegrations] = useState(false);
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
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => setShowIntegrations(true)}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Integrations
            </Button>
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
        
        {/* Integrations Dialog */}
        <Dialog open={showIntegrations} onOpenChange={setShowIntegrations}>
          <DialogContent className="max-w-4xl h-[85vh] p-0">
            <DialogHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center justify-between w-full">
                <DialogTitle className="text-2xl">Integrations</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowIntegrations(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="px-6 py-4 overflow-auto flex-1">
              <IntegrationsScreen />
            </div>
          </DialogContent>
        </Dialog>

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
