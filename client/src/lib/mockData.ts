import { Goal, GoalData, GoalDisplayText, Vehicle } from './types';

export const goalDisplayText: GoalDisplayText = {
  safety: 'Improve Driver Safety',
  fuel: 'Reduce Fuel Costs',
  maintenance: 'Optimize Maintenance',
  utilization: 'Increase Vehicle Utilization'
};

export const goalData: Record<Goal, GoalData> = {
  safety: {
    fleetScore: 82,
    trend: '+5.2%',
    isTrendPositive: true,
    recommendations: [
      { 
        type: 'warning', 
        icon: 'alert-triangle', 
        text: 'Vehicle V-1053: High frequency of harsh braking events detected. Recommend driver coaching.' 
      },
      { 
        type: 'danger', 
        icon: 'alert-circle', 
        text: 'Vehicle V-3872: Speeding incidents increased by 23% over past week. Immediate intervention required.' 
      },
      { 
        type: 'info', 
        icon: 'info', 
        text: 'Fleet: Schedule monthly safety training sessions. Expected score improvement: +7 points.' 
      }
    ],
    columnEmphasis: 'driver-score-col'
  },
  fuel: {
    fleetScore: 76,
    trend: '-2.1%',
    isTrendPositive: false,
    recommendations: [
      { 
        type: 'warning', 
        icon: 'alert-triangle', 
        text: 'Fleet: Average idle time increased by 15%. Review driver habits and routes.' 
      },
      { 
        type: 'danger', 
        icon: 'alert-circle', 
        text: 'Vehicle V-8763: Fuel consumption 28% above fleet average. Inspect for mechanical issues.' 
      },
      { 
        type: 'info', 
        icon: 'info', 
        text: 'Implement route optimization to reduce total miles driven. Expected savings: 7-10%.' 
      }
    ],
    columnEmphasis: 'driver-score-col'
  },
  maintenance: {
    fleetScore: 84,
    trend: '+1.8%',
    isTrendPositive: true,
    recommendations: [
      { 
        type: 'warning', 
        icon: 'alert-triangle', 
        text: 'Vehicle V-6105: Oil change overdue by 2 weeks. Schedule maintenance ASAP.' 
      },
      { 
        type: 'danger', 
        icon: 'alert-circle', 
        text: 'Vehicle V-3872: Multiple diagnostic codes. Requires immediate inspection.' 
      },
      { 
        type: 'info', 
        icon: 'info', 
        text: 'Update preventive maintenance schedule for winter season. Expected score improvement: +4 points.' 
      }
    ],
    columnEmphasis: 'maintenance-score-col'
  },
  utilization: {
    fleetScore: 71,
    trend: '+3.5%',
    isTrendPositive: true,
    recommendations: [
      { 
        type: 'warning', 
        icon: 'alert-triangle', 
        text: 'Vehicle V-9012: Average utilization 22% below target. Reassign to high-demand routes.' 
      },
      { 
        type: 'info', 
        icon: 'info', 
        text: 'Consider reducing fleet size by 2 vehicles. Projected cost savings: $28,500/year.' 
      },
      { 
        type: 'info', 
        icon: 'info', 
        text: 'Implement shared vehicle scheduling system. Expected utilization increase: 15-20%.' 
      }
    ],
    columnEmphasis: 'overall-score-col'
  }
};

export const mockVehicles: Vehicle[] = [
  {
    id: 'V-7294',
    driverScore: 92,
    maintenanceScore: 89,
    overallScore: 91,
    status: 'Good'
  },
  {
    id: 'V-5182',
    driverScore: 88,
    maintenanceScore: 90,
    overallScore: 89,
    status: 'Good'
  },
  {
    id: 'V-2458',
    driverScore: 86,
    maintenanceScore: 85,
    overallScore: 85,
    status: 'Good'
  },
  {
    id: 'V-9012',
    driverScore: 84,
    maintenanceScore: 82,
    overallScore: 83,
    status: 'Good'
  },
  {
    id: 'V-3721',
    driverScore: 78,
    maintenanceScore: 81,
    overallScore: 79,
    status: 'Needs Review'
  },
  {
    id: 'V-6105',
    driverScore: 73,
    maintenanceScore: 79,
    overallScore: 75,
    status: 'Needs Review'
  },
  {
    id: 'V-1053',
    driverScore: 64,
    maintenanceScore: 82,
    overallScore: 70,
    status: 'Needs Review'
  },
  {
    id: 'V-8763',
    driverScore: 58,
    maintenanceScore: 75,
    overallScore: 65,
    status: 'Action Required'
  },
  {
    id: 'V-3872',
    driverScore: 52,
    maintenanceScore: 70,
    overallScore: 59,
    status: 'Action Required'
  }
];

export const getTopPerformers = (vehicles: Vehicle[]): Vehicle[] => {
  return [...vehicles]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);
};

export const getVehiclesNeedingAttention = (vehicles: Vehicle[]): Vehicle[] => {
  return [...vehicles]
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 3);
};

// Additional recommendation items for expanded dashboard
export const additionalRecommendations = {
  safety: [
    { type: 'warning', icon: 'shield', text: 'Conduct safety briefing for northwest region drivers' },
    { type: 'info', icon: 'check', text: 'Vehicle B-45 safety certification expires in 30 days' },
    { type: 'danger', icon: 'x-circle', text: 'Critical: Update driver training for new safety regulations' },
    { type: 'success', icon: 'check-circle', text: 'Northeast division achieved 90+ safety score for Q1' }
  ],
  fuel: [
    { type: 'warning', icon: 'alert-triangle', text: 'Fuel costs increased 6% compared to last quarter' },
    { type: 'info', icon: 'truck', text: 'Consider alternative fuel options for long-haul routes' },
    { type: 'danger', icon: 'alert-circle', text: 'Urgent: Address abnormal fuel consumption in logistics division' },
    { type: 'success', icon: 'trending-up', text: 'Electric vehicle program reduced fuel costs by 8% in urban areas' }
  ],
  maintenance: [
    { type: 'danger', icon: 'x-circle', text: 'Critical: Immediate maintenance required for 3 vehicles' },
    { type: 'warning', icon: 'clock', text: 'Maintenance intervals should be adjusted for high-use vehicles' },
    { type: 'info', icon: 'file-text', text: 'New maintenance software training available for fleet managers' },
    { type: 'success', icon: 'dollar-sign', text: 'Predictive maintenance saved $23,000 in Q1 repair costs' }
  ],
  utilization: [
    { type: 'info', icon: 'bar-chart', text: 'Peak utilization periods identified for demand planning' },
    { type: 'success', icon: 'check-square', text: 'Vehicle turnaround time improved by 18% since last quarter' },
    { type: 'warning', icon: 'alert-triangle', text: 'Southern region consistently below target utilization' },
    { type: 'info', icon: 'maximize', text: 'Consider fleet expansion based on projected demand increase' }
  ]
};

// Mock metrics data for the dashboard
export const mockMetricsData = {
  // Monthly trend data
  monthlyTrends: [
    { month: 'Jan', safety: 78, fuel: 65, maintenance: 70, utilization: 85 },
    { month: 'Feb', safety: 75, fuel: 68, maintenance: 73, utilization: 83 },
    { month: 'Mar', safety: 80, fuel: 70, maintenance: 72, utilization: 87 },
    { month: 'Apr', safety: 82, fuel: 72, maintenance: 74, utilization: 88 },
    { month: 'May', safety: 79, fuel: 69, maintenance: 75, utilization: 89 },
    { month: 'Jun', safety: 83, fuel: 67, maintenance: 76, utilization: 90 },
    { month: 'Jul', safety: 85, fuel: 68, maintenance: 75, utilization: 91 },
    { month: 'Aug', safety: 84, fuel: 66, maintenance: 73, utilization: 92 },
    { month: 'Sep', safety: 86, fuel: 69, maintenance: 74, utilization: 90 },
    { month: 'Oct', safety: 88, fuel: 71, maintenance: 76, utilization: 89 },
    { month: 'Nov', safety: 87, fuel: 70, maintenance: 77, utilization: 90 },
    { month: 'Dec', safety: 89, fuel: 68, maintenance: 78, utilization: 93 }
  ],
  
  // Vehicle distribution by score
  vehicleScoreDistribution: [
    { range: '90-100', count: 15, category: 'Excellent' },
    { range: '80-89', count: 23, category: 'Good' },
    { range: '70-79', count: 18, category: 'Fair' },
    { range: '60-69', count: 12, category: 'Needs Improvement' },
    { range: 'Below 60', count: 7, category: 'Critical' }
  ],
  
  // Incident types
  incidentTypes: [
    { name: 'Harsh Braking', value: 32 },
    { name: 'Speeding', value: 28 },
    { name: 'Rapid Acceleration', value: 22 },
    { name: 'Sharp Cornering', value: 18 },
    { name: 'Phone Usage', value: 15 },
    { name: 'Fatigue', value: 10 }
  ],
  
  // Maintenance costs
  maintenanceCosts: [
    { name: 'Preventive', value: 42 },
    { name: 'Repairs', value: 28 },
    { name: 'Tires', value: 15 },
    { name: 'Fluids', value: 10 },
    { name: 'Other', value: 5 }
  ],
  
  // Regional performance
  regionalPerformance: [
    { region: 'North', safety: 85, fuel: 72, maintenance: 79, utilization: 91 },
    { region: 'South', safety: 78, fuel: 68, maintenance: 75, utilization: 83 },
    { region: 'East', safety: 82, fuel: 70, maintenance: 77, utilization: 88 },
    { region: 'West', safety: 80, fuel: 74, maintenance: 76, utilization: 90 },
    { region: 'Central', safety: 83, fuel: 71, maintenance: 78, utilization: 89 }
  ],
  
  // Fuel consumption
  fuelConsumption: [
    { month: 'Jan', actual: 8500, target: 8000 },
    { month: 'Feb', actual: 8200, target: 8000 },
    { month: 'Mar', actual: 8300, target: 8000 },
    { month: 'Apr', actual: 8100, target: 7900 },
    { month: 'May', actual: 7900, target: 7900 },
    { month: 'Jun', actual: 7800, target: 7800 },
    { month: 'Jul', actual: 8000, target: 7800 },
    { month: 'Aug', actual: 7700, target: 7700 },
    { month: 'Sep', actual: 7500, target: 7700 },
    { month: 'Oct', actual: 7400, target: 7600 },
    { month: 'Nov', actual: 7300, target: 7600 },
    { month: 'Dec', actual: 7200, target: 7500 }
  ],
  
  // Idle time
  idleTime: [
    { vehicle: 'V-7294', hours: 12.5 },
    { vehicle: 'V-5182', hours: 18.2 },
    { vehicle: 'V-2458', hours: 9.8 },
    { vehicle: 'V-9012', hours: 15.3 },
    { vehicle: 'V-3721', hours: 11.7 },
    { vehicle: 'V-6105', hours: 14.2 },
    { vehicle: 'V-1053', hours: 10.1 }
  ],
  
  // Maintenance compliance
  maintenanceCompliance: [
    { status: 'On Schedule', count: 62 },
    { status: 'Overdue', count: 12 },
    { status: 'Upcoming', count: 26 }
  ],

  // Utilization by vehicle type
  utilizationByType: [
    { type: 'Heavy Duty', utilized: 91, idle: 9 },
    { type: 'Medium Duty', utilized: 87, idle: 13 },
    { type: 'Light Duty', utilized: 82, idle: 18 },
    { type: 'Passenger', utilized: 78, idle: 22 },
    { type: 'Specialty', utilized: 69, idle: 31 }
  ],
  
  // KPI metrics
  kpiMetrics: {
    safety: {
      current: 82,
      target: 90,
      previousPeriod: 78,
      incidents: 17,
      severity: 'Medium',
      trainingCompliance: 92
    },
    fuel: {
      current: 68,
      target: 80,
      previousPeriod: 70,
      gallonsConsumed: 26450,
      costPerMile: 0.42,
      idlePercentage: 12.5
    },
    maintenance: {
      current: 75,
      target: 85,
      previousPeriod: 74,
      openIssues: 23,
      avgRepairCost: 840,
      preventiveCompliance: 88
    },
    utilization: {
      current: 91,
      target: 85,
      previousPeriod: 87,
      availableHours: 6240,
      utilizationRate: 91,
      downtime: 9
    }
  }
};
