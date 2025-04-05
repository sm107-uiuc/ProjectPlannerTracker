import { useState } from "react";
import { Goal } from "../lib/types";
import { goalData, goalDisplayText, mockVehicles, getTopPerformers, getVehiclesNeedingAttention, mockMetricsData } from "../lib/mockData";
import { Sidebar } from "../components/Sidebar";
import FleetScoreCard from "../components/FleetScoreCard";
import FleetScoreTrendCard from "../components/FleetScoreTrendCard";
import RecommendationsCard from "../components/RecommendationsCard";
import VehiclePerformanceTable from "../components/VehiclePerformanceTable";
import PerformersCard from "../components/PerformersCard";
import { IntegrationsScreen } from "../components/IntegrationsScreen";
import { MetricsTab } from "../components/MetricsTab";
import { RecommendationsTab } from "../components/RecommendationsTab";
import { TabLoader } from "../components/TabLoader";
import DidYouKnowCard from "../components/DidYouKnowCard";
import ChatbotIcon from "../components/ChatbotIcon";
import CombinedGoalCard from "../components/CombinedGoalCard";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  RefreshCw, 
  Filter, 
  Link as LinkIcon, 
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface DashboardScreenProps {
  selectedGoal: Goal;
}

const DashboardScreen = ({ selectedGoal }: DashboardScreenProps) => {
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'recommendations'>('overview');
  const [isTabLoading, setIsTabLoading] = useState(false);
  
  const data = goalData[selectedGoal];
  const topPerformers = getTopPerformers(mockVehicles);
  const vehiclesNeedingAttention = getVehiclesNeedingAttention(mockVehicles);
  
  // Fetch fleet score data
  const { 
    data: fleetScoreData, 
    isLoading: isFleetScoreLoading,
    refetch: refetchFleetScore
  } = useQuery({
    queryKey: [`/api/users/1/fleet-score`, selectedGoal],
    queryFn: ({ queryKey }) => {
      const baseUrl = queryKey[0] as string;
      const goalType = queryKey[1] as string;
      const url = goalType ? `${baseUrl}?goalType=${goalType}` : baseUrl;
      return apiRequest(url);
    }
  });
  
  const handleTabChange = (tab: 'overview' | 'metrics' | 'recommendations') => {
    setIsTabLoading(true);
    setActiveTab(tab);
  };
  
  const handleRefresh = () => {
    refetchFleetScore();
  };
  
  return (
    <>
      <Sidebar />
      <ChatbotIcon goal={selectedGoal} />
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
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={handleRefresh}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isFleetScoreLoading ? 'animate-spin' : ''}`} />
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
          <Tabs 
            defaultValue="overview" 
            className="w-full" 
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as 'overview' | 'metrics' | 'recommendations')}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isTabLoading && activeTab === 'overview' ? (
                <TabLoader 
                  tabName="overview" 
                  duration={2000} 
                  onComplete={() => setIsTabLoading(false)} 
                />
              ) : (
                <>
                  {/* Main Layout: Combined Goal Card & Description on left, Fleet Score & Trend stacked on right */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Combined Goal Card (2/3 width) */}
                    <div className="lg:col-span-2">
                      <CombinedGoalCard goal={selectedGoal} />
                    </div>
                    
                    {/* Fleet Score Cards stacked vertically (1/3 width) */}
                    <div className="flex flex-col gap-6">
                      <FleetScoreCard fleetScore={fleetScoreData?.fleetScore || data.fleetScore} />
                      <FleetScoreTrendCard 
                        trend={fleetScoreData?.trend || data.trend} 
                        isTrendPositive={fleetScoreData?.isTrendPositive || data.isTrendPositive} 
                      />
                    </div>
                  </div>
                  
                  {/* Recommendations and Did You Know side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <RecommendationsCard 
                      goalName={goalDisplayText[selectedGoal]} 
                      selectedGoal={selectedGoal}
                    />
                    <DidYouKnowCard goal={selectedGoal} />
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
                </>
              )}
            </TabsContent>
            
            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              {isTabLoading && activeTab === 'metrics' ? (
                <TabLoader 
                  tabName="metrics" 
                  duration={2000} 
                  onComplete={() => setIsTabLoading(false)} 
                />
              ) : (
                <MetricsTab selectedGoal={selectedGoal} />
              )}
            </TabsContent>
            
            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              {isTabLoading && activeTab === 'recommendations' ? (
                <TabLoader 
                  tabName="recommendations" 
                  duration={2000} 
                  onComplete={() => setIsTabLoading(false)} 
                />
              ) : (
                <RecommendationsTab selectedGoal={selectedGoal} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DashboardScreen;