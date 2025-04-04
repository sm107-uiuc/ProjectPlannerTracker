import { useState } from "react";
import { Goal } from "@/lib/types";
import { goalData, goalDisplayText, mockVehicles, getTopPerformers, getVehiclesNeedingAttention, mockMetricsData, additionalRecommendations } from "@/lib/mockData";
import { Sidebar } from "@/components/Sidebar";
import FleetScoreCard from "@/components/FleetScoreCard";
import FleetScoreTrendCard from "@/components/FleetScoreTrendCard";
import RecommendationsCard from "@/components/RecommendationsCard";
import VehiclePerformanceTable from "@/components/VehiclePerformanceTable";
import PerformersCard from "@/components/PerformersCard";
import { IntegrationsScreen } from "@/components/IntegrationsScreen";
import MetricsTab from "@/components/MetricsTab";
import RecommendationsTab from "@/components/RecommendationsTab";
import { 
  RefreshCw, 
  Filter, 
  Link as LinkIcon, 
  X, 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2, 
  Gauge, 
  CalendarRange,
  MessageSquareWarning,
  ArrowDownUp,
  Clock,
  Fuel,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Area, Line, Bar, BarChart, LineChart as RechartsLineChart, AreaChart, PieChart as RechartsPieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

interface DashboardScreenProps {
  selectedGoal: Goal;
}

const DashboardScreen = ({ selectedGoal }: DashboardScreenProps) => {
  const [showIntegrations, setShowIntegrations] = useState(false);
  const data = goalData[selectedGoal];
  const topPerformers = getTopPerformers(mockVehicles);
  const vehiclesNeedingAttention = getVehiclesNeedingAttention(mockVehicles);
  const metrics = mockMetricsData;
  const kpi = metrics.kpiMetrics[selectedGoal];

  // Color settings for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
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
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>
            
            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <MetricsTab selectedGoal={selectedGoal} />
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Current Score</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold">{kpi.current}</span>
                        <span className="text-gray-500 ml-2">/ {kpi.target}</span>
                      </div>
                      <Gauge className="h-10 w-10 text-primary opacity-80" />
                    </div>
                    <Progress 
                      value={(kpi.current / kpi.target) * 100} 
                      className="h-2 mt-2" 
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {kpi.current > kpi.previousPeriod ? 'Up' : 'Down'} {Math.abs(kpi.current - kpi.previousPeriod)}% from last period
                    </p>
                  </CardContent>
                </Card>
                
                {selectedGoal === 'safety' && (
                  <>
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Incidents this Month</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.incidents}</span>
                          <AlertTriangle className="h-10 w-10 text-amber-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Average severity: {kpi.severity}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Training Compliance</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.trainingCompliance}%</span>
                          <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <Progress value={kpi.trainingCompliance} className="h-2 mt-2" />
                        <p className="text-xs text-gray-500 mt-2">Target: 100%</p>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {selectedGoal === 'fuel' && (
                  <>
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Gallons Consumed</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.gallonsConsumed.toLocaleString()}</span>
                          <Fuel className="h-10 w-10 text-blue-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Cost per mile: ${kpi.costPerMile}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Idle Percentage</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.idlePercentage}%</span>
                          <Clock className="h-10 w-10 text-amber-500" />
                        </div>
                        <Progress value={kpi.idlePercentage} className="h-2 mt-2" />
                        <p className="text-xs text-gray-500 mt-2">Target: &lt; 10%</p>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {selectedGoal === 'maintenance' && (
                  <>
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.openIssues}</span>
                          <MessageSquareWarning className="h-10 w-10 text-amber-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Average repair cost: ${kpi.avgRepairCost}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Preventive Maintenance</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.preventiveCompliance}%</span>
                          <CalendarRange className="h-10 w-10 text-green-500" />
                        </div>
                        <Progress value={kpi.preventiveCompliance} className="h-2 mt-2" />
                        <p className="text-xs text-gray-500 mt-2">Compliance rate</p>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {selectedGoal === 'utilization' && (
                  <>
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.utilizationRate}%</span>
                          <TrendingUp className="h-10 w-10 text-green-500" />
                        </div>
                        <Progress value={kpi.utilizationRate} className="h-2 mt-2" />
                        <p className="text-xs text-gray-500 mt-2">Target: {kpi.target}%</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Downtime</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{kpi.downtime}%</span>
                          <ArrowDownUp className="h-10 w-10 text-amber-500" />
                        </div>
                        <Progress value={kpi.downtime} className="h-2 mt-2" />
                        <p className="text-xs text-gray-500 mt-2">Target: &lt; 5%</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 12-Month Score Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>12-Month Score Trend</CardTitle>
                    <CardDescription>Performance metrics over the past year</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={metrics.monthlyTrends}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={selectedGoal} 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={3}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Vehicle Score Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Score Distribution</CardTitle>
                    <CardDescription>Distribution of fleet by performance score</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.vehicleScoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8">
                          {metrics.vehicleScoreDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {selectedGoal === 'safety' && (
                  <>
                    {/* Incident Types Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Incident Types</CardTitle>
                        <CardDescription>Breakdown of safety incidents by type</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={metrics.incidentTypes}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {metrics.incidentTypes.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Regional Performance Comparison */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Regional Performance</CardTitle>
                        <CardDescription>Safety scores by region</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.regionalPerformance}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="region" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="safety" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {selectedGoal === 'fuel' && (
                  <>
                    {/* Fuel Consumption Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Fuel Consumption vs Target</CardTitle>
                        <CardDescription>Monthly fuel consumption compared to targets</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={metrics.fuelConsumption}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="actual" stroke="#8884d8" fill="#8884d8" />
                            <Area type="monotone" dataKey="target" stroke="#82ca9d" fill="#82ca9d" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Idle Time by Vehicle */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Idle Time by Vehicle</CardTitle>
                        <CardDescription>Hours spent idling by top vehicles</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.idleTime}
                            margin={{ top: 5, right:
                            30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="vehicle" type="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="hours" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {selectedGoal === 'maintenance' && (
                  <>
                    {/* Maintenance Cost Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Maintenance Cost Breakdown</CardTitle>
                        <CardDescription>Distribution of maintenance costs by type</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={metrics.maintenanceCosts}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {metrics.maintenanceCosts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Maintenance Compliance */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Maintenance Compliance</CardTitle>
                        <CardDescription>Status of scheduled maintenance tasks</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={metrics.maintenanceCompliance}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#4ade80" /> {/* On Schedule - green */}
                              <Cell fill="#f87171" /> {/* Overdue - red */}
                              <Cell fill="#facc15" /> {/* Upcoming - yellow */}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {selectedGoal === 'utilization' && (
                  <>
                    {/* Utilization by Vehicle Type */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Utilization by Vehicle Type</CardTitle>
                        <CardDescription>Utilized vs. idle time for each vehicle type</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.utilizationByType}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="utilized" stackId="a" fill="#4ade80" />
                            <Bar dataKey="idle" stackId="a" fill="#f87171" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Regional Performance Comparison */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Regional Performance</CardTitle>
                        <CardDescription>Utilization scores by region</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.regionalPerformance}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="region" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="utilization" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
            
            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Recommendations</CardTitle>
                  <CardDescription>
                    Key actions to improve your fleet's {goalDisplayText[selectedGoal].toLowerCase()} performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Critical Actions</h3>
                      <ul className="space-y-4">
                        {data.recommendations
                          .filter(rec => rec.type === 'danger')
                          .concat(additionalRecommendations[selectedGoal].filter(rec => rec.type === 'danger'))
                          .map((rec, index) => (
                            <li key={`critical-${index}`} className="flex items-start space-x-3 p-3 border border-red-200 rounded-md bg-red-50">
                              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{rec.text}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Warnings</h3>
                      <ul className="space-y-4">
                        {data.recommendations
                          .filter(rec => rec.type === 'warning')
                          .concat(additionalRecommendations[selectedGoal].filter(rec => rec.type === 'warning'))
                          .map((rec, index) => (
                            <li key={`warning-${index}`} className="flex items-start space-x-3 p-3 border border-amber-200 rounded-md bg-amber-50">
                              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>{rec.text}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Opportunities</h3>
                      <ul className="space-y-4">
                        {data.recommendations
                          .filter(rec => rec.type === 'info')
                          .concat(additionalRecommendations[selectedGoal].filter(rec => rec.type === 'info'))
                          .map((rec, index) => (
                            <li key={`info-${index}`} className="flex items-start space-x-3 p-3 border border-blue-200 rounded-md bg-blue-50">
                              <LinkIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{rec.text}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Successes</h3>
                      <ul className="space-y-4">
                        {data.recommendations
                          .filter(rec => rec.type === 'success')
                          .concat(additionalRecommendations[selectedGoal].filter(rec => rec.type === 'success'))
                          .map((rec, index) => (
                            <li key={`success-${index}`} className="flex items-start space-x-3 p-3 border border-green-200 rounded-md bg-green-50">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{rec.text}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Export Recommendations
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>
                    Manage your fleet service integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IntegrationsScreen />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DashboardScreen;
