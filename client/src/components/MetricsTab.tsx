import { useState } from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, 
  PieChart, Pie, Cell, 
  ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Legend,
  Treemap
} from 'recharts';
import { 
  Calendar, Clock, TrendingDown, TrendingUp, 
  AlertTriangle, AlertCircle, CheckCircle2, Info,
  Map, Activity, Droplets, Car, Wrench, BarChart2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Goal } from '@/lib/types';
import { mockMetricsData } from '@/lib/mockData';
import { GeographyUSA } from './maps/GeographyUSA';

interface MetricsTabProps {
  selectedGoal: Goal;
}

export const MetricsTab = ({ selectedGoal }: MetricsTabProps) => {
  const [timeframe, setTimeframe] = useState('month');
  // We've consolidated overview and detailed views into single unified views
  
  // Use mock data directly 
  const metricsData = mockMetricsData;
  const kpiData = metricsData.kpiMetrics[selectedGoal];
  
  // Format value for display
  const formatValue = (value: number, prefix: string = '', suffix: string = '') => {
    return `${prefix}${value.toLocaleString('en-US', {
      maximumFractionDigits: 1,
    })}${suffix}`;
  };
  
  // Calculate trend indicator
  const getTrendIndicator = (current: number, previous: number) => {
    const percentage = ((current - previous) / previous) * 100;
    const isPositive = percentage > 0;
    
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span className="text-sm font-medium">{Math.abs(percentage).toFixed(1)}%</span>
      </div>
    );
  };
  
  const getValueColor = (current: number, target: number, higherIsBetter: boolean = true) => {
    if (higherIsBetter) {
      return current >= target ? 'text-green-500' : 'text-red-500';
    } else {
      return current <= target ? 'text-green-500' : 'text-red-500';
    }
  };

  // SAFETY METRICS RENDERERS
  const renderSafetyMetrics = () => {
    const safetyKpiData = metricsData.kpiMetrics.safety;
    const CHART_COLOR = "#3b82f6"; // Consistent blue color for all charts
    
    return (
      <>
        {/* Top row - Risk factors and US map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Risk Factors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Driver Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.incidentTypes}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false}  
                    tickLine={false} 
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill={CHART_COLOR} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Incident Map */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Incident Map</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <GeographyUSA 
                data={metricsData.incidentMap}
                title=""
                color={CHART_COLOR}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Second row - KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Current Score Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Current Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                  <div className="text-3xl font-bold text-slate-800">{safetyKpiData.current}</div>
                  <div className="text-sm text-slate-500 ml-2">/ {safetyKpiData.target}</div>
                </div>
                <div className="w-full mb-2">
                  <Progress 
                    value={(safetyKpiData.current / safetyKpiData.target) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="text-sm text-slate-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span>Up 4% from last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Incidents this Month Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Incidents this Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start">
                <div className="text-3xl font-bold text-slate-800 mb-2">{safetyKpiData.incidents}</div>
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-slate-600">Average severity: {safetyKpiData.severity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Training Compliance Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Training Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start">
                <div className="text-3xl font-bold text-slate-800 mb-2">{safetyKpiData.trainingCompliance}%</div>
                <div className="w-full mb-2">
                  <Progress 
                    value={safetyKpiData.trainingCompliance} 
                    className="h-2" 
                  />
                </div>
                <div className="text-sm text-slate-600">Target: 100%</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Third row - Trend and Vehicle Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 12-Month Score Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">12-Month Score Trend</CardTitle>
              <CardDescription className="text-xs text-slate-500">Performance metrics over the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="safety" 
                    stroke={CHART_COLOR} 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Vehicle Score Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Vehicle Score Distribution</CardTitle>
              <CardDescription className="text-xs text-slate-500">Distribution of fleet by performance score</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.vehicleScoreDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Fourth row - Additional charts from the detailed view */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Incident Time of Day Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Incident Time of Day Analysis</CardTitle>
              <CardDescription className="text-xs text-slate-500">When incidents are most likely to occur</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData.incidentTimeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value} incidents`, 'Count']}
                    labelFormatter={(hour) => `Time: ${hour}:00`}
                  />
                  <defs>
                    <linearGradient id="incidentTimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke={CHART_COLOR} 
                    fill="url(#incidentTimeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Regional Safety Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Regional Safety Comparison</CardTitle>
              <CardDescription className="text-xs text-slate-500">Safety metrics across regions</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  outerRadius={90} 
                  width={500} 
                  height={300} 
                  data={metricsData.regionalPerformance}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="region" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar 
                    name="Safety Score" 
                    dataKey="safety" 
                    stroke={CHART_COLOR} 
                    fill={CHART_COLOR} 
                    fillOpacity={0.5} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  // FUEL METRICS RENDERERS
  const renderFuelMetricsOverview = () => {
    const fuelKpiData = metricsData.kpiMetrics.fuel;
    const CHART_COLOR = "#3b82f6"; // Consistent blue color for all charts
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Fuel Efficiency Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                <span>Fuel Efficiency</span>
                {getTrendIndicator(fuelKpiData.current, fuelKpiData.previousPeriod)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getValueColor(fuelKpiData.current, fuelKpiData.target)}`}>
                    {formatValue(fuelKpiData.current, '', ' mpg')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target: {formatValue(fuelKpiData.target, '', ' mpg')}</div>
                </div>
                <div className="flex-1 ml-4">
                  <Progress 
                    value={(fuelKpiData.current / fuelKpiData.target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData.monthlyTrends}>
                  <defs>
                    <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="fuel" stroke="#3b82f6" fillOpacity={1} fill="url(#fuelGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Gallons Consumed Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Gallons Consumed</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-500">{fuelKpiData.gallonsConsumed.toLocaleString()}</div>
                <div className="text-xs text-slate-500 ml-2">this month</div>
              </div>
              <div className="text-xs text-slate-500 mt-1">Cost per mile: ${fuelKpiData.costPerMile.toFixed(2)}</div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={metricsData.fuelConsumption}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide yAxisId="left" orientation="left" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual" />
                  <Line yAxisId="left" type="monotone" dataKey="target" stroke="#64748b" name="Target" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Idle Time Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Idle Time</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {formatValue(fuelKpiData.idlePercentage, '', '%')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target: &lt;15%</div>
                </div>
                <div className="flex-1 ml-4">
                  <Progress 
                    value={fuelKpiData.idlePercentage} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Idle', value: fuelKpiData.idlePercentage, color: '#3b82f6' },
                      { name: 'Active', value: 100 - fuelKpiData.idlePercentage, color: '#93c5fd' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Idle', value: fuelKpiData.idlePercentage, color: '#3b82f6' },
                      { name: 'Active', value: 100 - fuelKpiData.idlePercentage, color: '#93c5fd' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        {/* Cost per Mile Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Regional Fuel Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.regionalPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis domain={[60, 80]} />
                  <Tooltip formatter={(value) => `${value} mpg`} />
                  <Legend />
                  <Bar dataKey="fuel" fill="#3b82f6" name="MPG" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Weather Impact */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Vehicle Idle Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.idleTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicle" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} hours`} />
                  <Legend />
                  <Bar dataKey="hours" fill="#3b82f6" name="Idle Hours" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderFuelMetricsDetailed = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Weather Impact on Fuel Efficiency */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Weather Impact on Fuel Efficiency</CardTitle>
              <CardDescription>How temperature affects MPG</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="temperature" 
                    name="Temperature" 
                    unit="°F" 
                    domain={[0, 110]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="mpg" 
                    name="Fuel Efficiency" 
                    unit=" mpg" 
                    domain={[20, 28]}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Efficiency by Temperature" 
                    data={metricsData.fuelEfficiencyByWeather} 
                    fill="#3b82f6" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Alternative Fuel Adoption */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Alternative Fuel Adoption</CardTitle>
              <CardDescription>Transition to alternative fuels over time</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metricsData.alternativeFuelAdoption}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="electric" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    name="Electric"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hybrid" 
                    stackId="1" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    name="Hybrid"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="diesel" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    name="Diesel"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gasoline" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    name="Gasoline"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Fuel Consumption Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              <span>Fuel Consumption Trend</span>
              <Select defaultValue="month" onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData.fuelConsumption}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[7000, 9000]} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} gallons`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Actual Consumption"
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#64748b"
                  strokeWidth={2}
                  name="Target Consumption"
                  dot={false}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  // MAINTENANCE METRICS RENDERERS
  const renderMaintenanceMetricsOverview = () => {
    const maintenanceKpiData = metricsData.kpiMetrics.maintenance;
    const CHART_COLOR = "#3b82f6"; // Consistent blue color for all charts
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Maintenance Score Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                <span>Maintenance Score</span>
                {getTrendIndicator(maintenanceKpiData.current, maintenanceKpiData.previousPeriod)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getValueColor(maintenanceKpiData.current, maintenanceKpiData.target)}`}>
                    {formatValue(maintenanceKpiData.current)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target: {formatValue(maintenanceKpiData.target)}</div>
                </div>
                <div className="flex-1 ml-4">
                  <Progress 
                    value={(maintenanceKpiData.current / maintenanceKpiData.target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData.monthlyTrends}>
                  <defs>
                    <linearGradient id="maintenanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="maintenance" stroke="#3b82f6" fillOpacity={1} fill="url(#maintenanceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Open Issues Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Open Issues</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-500">{maintenanceKpiData.openIssues}</div>
                <div className="text-xs text-slate-500 ml-2">requires attention</div>
              </div>
              <div className="text-xs text-slate-500 mt-1">Avg. repair cost: ${maintenanceKpiData.avgRepairCost}</div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricsData.maintenanceCompliance}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {metricsData.maintenanceCompliance.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.status === 'On Schedule' ? '#22c55e' : 
                          entry.status === 'Overdue' ? '#ef4444' : '#3b82f6'
                        } 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Preventive Compliance Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Preventive Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {formatValue(maintenanceKpiData.preventiveCompliance, '', '%')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Compliance rate</div>
                </div>
                <div className="flex-1 ml-4">
                  <Progress 
                    value={maintenanceKpiData.preventiveCompliance} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Preventive', value: 42, color: '#22c55e' },
                      { name: 'Reactive', value: 28, color: '#ef4444' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Preventive', value: 42, color: '#22c55e' },
                      { name: 'Reactive', value: 28, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        {/* Maintenance Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Maintenance Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricsData.maintenanceCosts}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                    labelLine
                  >
                    {metricsData.maintenanceCosts.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#3b82f6', '#3b82f6', '#22c55e', '#3b82f6', '#ef4444'
                        ][index % 5]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Regional Performance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Regional Maintenance Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.regionalPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis domain={[70, 85]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="maintenance" fill="#3b82f6" name="Maintenance Score" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderMaintenanceMetricsDetailed = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Parts Replacement Frequency */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Parts Replacement Frequency</CardTitle>
              <CardDescription>Most commonly replaced components</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.partsReplacement.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="part" type="category" />
                  <Tooltip formatter={(value) => `${value} replacements`} />
                  <Bar dataKey="frequency" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Repair Order Aging */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Repair Order Aging</CardTitle>
              <CardDescription>Distribution of open repair orders by age</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.repairOrderAging}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dayRange" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} orders`} />
                  <Legend />
                  <Bar dataKey="count" name="Orders">
                    {metricsData.repairOrderAging.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.priority === 'Low' ? '#22c55e' : 
                          entry.priority === 'Medium' ? '#3b82f6' : 
                          entry.priority === 'High' ? '#ef4444' : 
                          '#b91c1c'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Maintenance Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              <span>Maintenance Score Trend</span>
              <Select defaultValue="month" onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[65, 85]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="maintenance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Maintenance Score"
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  // UTILIZATION METRICS RENDERERS
  const renderUtilizationMetricsOverview = () => {
    const utilizationKpiData = metricsData.kpiMetrics.utilization;
    const CHART_COLOR = "#3b82f6"; // Consistent blue color for all charts
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Utilization Score Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                <span>Utilization Score</span>
                {getTrendIndicator(utilizationKpiData.current, utilizationKpiData.previousPeriod)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getValueColor(utilizationKpiData.current, utilizationKpiData.target)}`}>
                    {formatValue(utilizationKpiData.current)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target: {formatValue(utilizationKpiData.target)}</div>
                </div>
                <div className="flex-1 ml-4">
                  <Progress 
                    value={(utilizationKpiData.current / utilizationKpiData.target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData.monthlyTrends}>
                  <defs>
                    <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="utilization" stroke="#3b82f6" fillOpacity={1} fill="url(#utilizationGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Utilization Rate Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Utilization Rate</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-500">{utilizationKpiData.utilizationRate}%</div>
                <div className="text-xs text-slate-500 ml-2">of available hours</div>
              </div>
              <div className="text-xs text-slate-500 mt-1">Available hours: {utilizationKpiData.availableHours.toLocaleString()}</div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={metricsData.utilizationByType}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="utilized" fill="#3b82f6" name="Utilization Rate" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Downtime Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Downtime</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-2xl font-bold ${
                    utilizationKpiData.downtime < 10 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatValue(utilizationKpiData.downtime, '', '%')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target: &lt;5%</div>
                </div>
                <div className="flex-1 ml-4">
                  <Progress 
                    value={utilizationKpiData.downtime * 5} // Scale for better visualization
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
            <div className="h-32 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: 100 - utilizationKpiData.downtime, color: '#22c55e' },
                      { name: 'Downtime', value: utilizationKpiData.downtime, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Active', value: 100 - utilizationKpiData.downtime, color: '#22c55e' },
                      { name: 'Downtime', value: utilizationKpiData.downtime, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        {/* Regional Utilization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Regional Utilization</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.regionalPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis domain={[80, 95]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="utilization" fill="#3b82f6" name="Utilization" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Utilization Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Fleet Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData.vehicleScoreDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} vehicles`} />
                  <Bar dataKey="count" name="Vehicles">
                    {metricsData.vehicleScoreDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.category === 'Excellent' ? '#22c55e' : 
                          entry.category === 'Good' ? '#84cc16' : 
                          entry.category === 'Fair' ? '#3b82f6' : 
                          entry.category === 'Needs Improvement' ? '#f97316' : 
                          '#ef4444'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderUtilizationMetricsDetailed = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Utilization by Time of Day */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Utilization by Time of Day</CardTitle>
              <CardDescription>Peak usage times throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metricsData.utilizationByHour}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    labelFormatter={(hour) => `Time: ${hour}:00`}
                  />
                  <defs>
                    <linearGradient id="utilizationTimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="#3b82f6" 
                    fill="url(#utilizationTimeGradient)"
                    name="Utilization Rate"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Route Efficiency Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Route Efficiency Analysis</CardTitle>
              <CardDescription>Distance vs. time for different routes</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="distance" 
                    name="Distance" 
                    unit=" miles" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="time" 
                    name="Time" 
                    unit=" min" 
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Route Efficiency" 
                    data={metricsData.routeEfficiency} 
                    fill="#3b82f6" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Seasonal Utilization */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Seasonal Utilization Patterns</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metricsData.seasonalUtilization}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <defs>
                  <linearGradient id="regularGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="seasonalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="regular" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="url(#regularGradient)"
                  name="Regular Usage"
                />
                <Area 
                  type="monotone" 
                  dataKey="seasonal" 
                  stackId="1"
                  stroke="#f97316" 
                  fill="url(#seasonalGradient)"
                  name="Seasonal Usage"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  // Determine which metrics to display based on selected goal
  const renderGoalMetrics = () => {
    const renderSelectedContent = () => {
      if (selectedGoal === 'safety') {
        return renderSafetyMetrics();
      } else if (selectedGoal === 'fuel') {
        return renderFuelMetricsOverview();
      } else if (selectedGoal === 'maintenance') {
        return renderMaintenanceMetricsOverview();
      } else if (selectedGoal === 'utilization') {
        return renderUtilizationMetricsOverview();
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            {selectedGoal === 'safety' && <Activity className="h-5 w-5 mr-2 text-blue-500" />}
            {selectedGoal === 'fuel' && <Droplets className="h-5 w-5 mr-2 text-blue-500" />}
            {selectedGoal === 'maintenance' && <Wrench className="h-5 w-5 mr-2 text-blue-500" />}
            {selectedGoal === 'utilization' && <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />}
            {selectedGoal.charAt(0).toUpperCase() + selectedGoal.slice(1)} Metrics
          </h2>
        </div>

        {renderSelectedContent()}
      </div>
    );
  };

  return renderGoalMetrics();
};