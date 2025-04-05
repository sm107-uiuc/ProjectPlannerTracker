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
    id: '1G1FY6S08L4112233',
    vin: '1G1FY6S08L4112233',
    make: 'Chevrolet',
    model: 'Bolt',
    year: 2024,
    driverScore: 92,
    maintenanceScore: 89,
    overallScore: 91,
    status: 'Good'
  },
  {
    id: 'JTDKARFU8L3998877',
    vin: 'JTDKARFU8L3998877',
    make: 'Toyota',
    model: 'Prius',
    year: 2023,
    driverScore: 88,
    maintenanceScore: 90,
    overallScore: 89,
    status: 'Good'
  },
  {
    id: '5YJ3E1EA8LF778901',
    vin: '5YJ3E1EA8LF778901',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    driverScore: 86,
    maintenanceScore: 85,
    overallScore: 85,
    status: 'Good'
  },
  {
    id: '1N4AZ1CP8LC667788',
    vin: '1N4AZ1CP8LC667788',
    make: 'Nissan',
    model: 'Leaf',
    year: 2023,
    driverScore: 84,
    maintenanceScore: 82,
    overallScore: 83,
    status: 'Good'
  },
  {
    id: 'KM8K33A64MU334455',
    vin: 'KM8K33A64MU334455',
    make: 'Hyundai',
    model: 'Kona Electric',
    year: 2024,
    driverScore: 78,
    maintenanceScore: 81,
    overallScore: 79,
    status: 'Needs Review'
  },
  {
    id: '1C4RJFBG5LC123456',
    vin: '1C4RJFBG5LC123456',
    make: 'Jeep',
    model: 'Grand Cherokee',
    year: 2024,
    driverScore: 73,
    maintenanceScore: 79,
    overallScore: 75,
    status: 'Needs Review'
  },
  {
    id: '2T1BURHE8KC123789',
    vin: '2T1BURHE8KC123789',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    driverScore: 64,
    maintenanceScore: 82,
    overallScore: 70,
    status: 'Needs Review'
  },
  {
    id: '1GCUYDED9LZ217654',
    vin: '1GCUYDED9LZ217654',
    make: 'Chevrolet',
    model: 'Silverado',
    year: 2024,
    driverScore: 58,
    maintenanceScore: 75,
    overallScore: 65,
    status: 'Action Required'
  },
  {
    id: '1FMSK8DH5LGC76513',
    vin: '1FMSK8DH5LGC76513',
    make: 'Ford',
    model: 'Explorer',
    year: 2024,
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
  
  // Incident map data
  incidentMap: [
    { state: 'California', value: 28 },
    { state: 'Texas', value: 22 },
    { state: 'Florida', value: 18 },
    { state: 'New York', value: 15 },
    { state: 'Pennsylvania', value: 12 },
    { state: 'Illinois', value: 14 },
    { state: 'Ohio', value: 11 },
    { state: 'Georgia', value: 16 },
    { state: 'North Carolina', value: 13 },
    { state: 'Michigan', value: 12 },
    { state: 'New Jersey', value: 10 },
    { state: 'Virginia', value: 9 },
    { state: 'Washington', value: 11 },
    { state: 'Arizona', value: 13 },
    { state: 'Massachusetts', value: 8 },
    { state: 'Tennessee', value: 9 },
    { state: 'Indiana', value: 7 },
    { state: 'Missouri', value: 8 },
    { state: 'Maryland', value: 7 },
    { state: 'Wisconsin', value: 6 },
    { state: 'Minnesota', value: 5 },
    { state: 'Colorado', value: 8 },
    { state: 'Alabama', value: 7 },
    { state: 'South Carolina', value: 8 },
    { state: 'Louisiana', value: 7 },
    { state: 'Kentucky', value: 5 },
    { state: 'Oregon', value: 6 },
    { state: 'Oklahoma', value: 6 },
    { state: 'Connecticut', value: 4 },
    { state: 'Iowa', value: 3 },
    { state: 'Mississippi', value: 5 },
    { state: 'Arkansas', value: 4 },
    { state: 'Kansas', value: 3 },
    { state: 'Utah', value: 5 },
    { state: 'Nevada', value: 6 },
    { state: 'New Mexico', value: 4 },
    { state: 'Nebraska', value: 2 },
    { state: 'West Virginia', value: 3 },
    { state: 'Idaho', value: 2 },
    { state: 'Hawaii', value: 1 },
    { state: 'Maine', value: 2 },
    { state: 'New Hampshire', value: 2 },
    { state: 'Rhode Island', value: 1 },
    { state: 'Montana', value: 2 },
    { state: 'Delaware', value: 1 },
    { state: 'South Dakota', value: 1 },
    { state: 'Alaska', value: 1 },
    { state: 'North Dakota', value: 1 },
    { state: 'Vermont', value: 1 },
    { state: 'Wyoming', value: 1 }
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
  
  // Fuel efficiency by weather
  fuelEfficiencyByWeather: [
    { temperature: 20, mpg: 22.1 },
    { temperature: 30, mpg: 23.5 },
    { temperature: 40, mpg: 24.8 },
    { temperature: 50, mpg: 25.7 },
    { temperature: 60, mpg: 26.2 },
    { temperature: 70, mpg: 25.9 },
    { temperature: 80, mpg: 24.7 },
    { temperature: 90, mpg: 23.2 },
    { temperature: 100, mpg: 22.0 }
  ],
  
  // Alternative fuel adoption
  alternativeFuelAdoption: [
    { month: 'Jan', electric: 5, hybrid: 12, diesel: 65, gasoline: 93 },
    { month: 'Feb', electric: 6, hybrid: 14, diesel: 64, gasoline: 91 },
    { month: 'Mar', electric: 8, hybrid: 15, diesel: 63, gasoline: 89 },
    { month: 'Apr', electric: 10, hybrid: 17, diesel: 62, gasoline: 86 },
    { month: 'May', electric: 12, hybrid: 18, diesel: 61, gasoline: 84 },
    { month: 'Jun', electric: 15, hybrid: 20, diesel: 60, gasoline: 80 },
    { month: 'Jul', electric: 18, hybrid: 22, diesel: 58, gasoline: 77 },
    { month: 'Aug', electric: 20, hybrid: 24, diesel: 56, gasoline: 75 },
    { month: 'Sep', electric: 23, hybrid: 26, diesel: 54, gasoline: 72 },
    { month: 'Oct', electric: 25, hybrid: 28, diesel: 52, gasoline: 70 },
    { month: 'Nov', electric: 28, hybrid: 30, diesel: 50, gasoline: 67 },
    { month: 'Dec', electric: 30, hybrid: 32, diesel: 48, gasoline: 65 }
  ],
  
  // Parts replacement frequency
  partsReplacement: [
    { part: 'Brakes', frequency: 42 },
    { part: 'Oil Filters', frequency: 135 },
    { part: 'Air Filters', frequency: 92 },
    { part: 'Tires', frequency: 68 },
    { part: 'Wiper Blades', frequency: 53 },
    { part: 'Batteries', frequency: 27 },
    { part: 'Spark Plugs', frequency: 38 },
    { part: 'Fuel Pumps', frequency: 15 },
    { part: 'Alternators', frequency: 19 },
    { part: 'Starters', frequency: 21 }
  ],
  
  // Repair order aging
  repairOrderAging: [
    { dayRange: '0-1', count: 42, priority: 'Low' },
    { dayRange: '2-3', count: 28, priority: 'Low' },
    { dayRange: '4-5', count: 18, priority: 'Medium' },
    { dayRange: '6-7', count: 12, priority: 'Medium' },
    { dayRange: '8-10', count: 8, priority: 'High' },
    { dayRange: '11+', count: 5, priority: 'Critical' }
  ],
  
  // Utilization by time of day
  utilizationByHour: [
    { hour: 0, utilization: 15 }, { hour: 1, utilization: 12 }, { hour: 2, utilization: 8 },
    { hour: 3, utilization: 5 }, { hour: 4, utilization: 10 }, { hour: 5, utilization: 22 },
    { hour: 6, utilization: 35 }, { hour: 7, utilization: 55 }, { hour: 8, utilization: 75 },
    { hour: 9, utilization: 85 }, { hour: 10, utilization: 90 }, { hour: 11, utilization: 92 },
    { hour: 12, utilization: 88 }, { hour: 13, utilization: 85 }, { hour: 14, utilization: 82 },
    { hour: 15, utilization: 80 }, { hour: 16, utilization: 78 }, { hour: 17, utilization: 75 },
    { hour: 18, utilization: 65 }, { hour: 19, utilization: 55 }, { hour: 20, utilization: 48 },
    { hour: 21, utilization: 40 }, { hour: 22, utilization: 30 }, { hour: 23, utilization: 20 }
  ],
  
  // Route efficiency 
  routeEfficiency: [
    { distance: 15, time: 22, id: 'R-001' }, { distance: 28, time: 42, id: 'R-002' },
    { distance: 12, time: 18, id: 'R-003' }, { distance: 35, time: 48, id: 'R-004' },
    { distance: 42, time: 65, id: 'R-005' }, { distance: 8, time: 15, id: 'R-006' },
    { distance: 22, time: 30, id: 'R-007' }, { distance: 18, time: 25, id: 'R-008' },
    { distance: 31, time: 40, id: 'R-009' }, { distance: 25, time: 38, id: 'R-010' },
    { distance: 15, time: 28, id: 'R-011' }, { distance: 40, time: 52, id: 'R-012' }
  ],
  
  // Incident time by hour chart
  incidentTimeByHour: [
    { state: 'CA', value: 32 }, { state: 'TX', value: 28 }, { state: 'FL', value: 25 },
    { state: 'NY', value: 22 }, { state: 'IL', value: 20 }, { state: 'PA', value: 18 },
    { state: 'OH', value: 17 }, { state: 'GA', value: 16 }, { state: 'NC', value: 14 },
    { state: 'MI', value: 13 }, { state: 'NJ', value: 12 }, { state: 'VA', value: 11 },
    { state: 'WA', value: 10 }, { state: 'AZ', value: 9 }, { state: 'MA', value: 8 },
    { state: 'TN', value: 7 }, { state: 'IN', value: 6 }, { state: 'MO', value: 5 },
    { state: 'MD', value: 4 }, { state: 'WI', value: 3 }
  ],
  
  // Incident time distribution (hour of day)
  incidentTimeDistribution: [
    { hour: 0, count: 5 }, { hour: 1, count: 3 }, { hour: 2, count: 2 }, { hour: 3, count: 2 },
    { hour: 4, count: 3 }, { hour: 5, count: 8 }, { hour: 6, count: 12 }, { hour: 7, count: 18 },
    { hour: 8, count: 15 }, { hour: 9, count: 10 }, { hour: 10, count: 8 }, { hour: 11, count: 7 },
    { hour: 12, count: 9 }, { hour: 13, count: 8 }, { hour: 14, count: 7 }, { hour: 15, count: 10 },
    { hour: 16, count: 15 }, { hour: 17, count: 20 }, { hour: 18, count: 18 }, { hour: 19, count: 12 },
    { hour: 20, count: 10 }, { hour: 21, count: 8 }, { hour: 22, count: 6 }, { hour: 23, count: 4 }
  ],
  
  // Seasonal utilization
  seasonalUtilization: [
    { month: 'Jan', regular: 65, seasonal: 8 },
    { month: 'Feb', regular: 68, seasonal: 10 },
    { month: 'Mar', regular: 70, seasonal: 15 },
    { month: 'Apr', regular: 72, seasonal: 20 },
    { month: 'May', regular: 75, seasonal: 30 },
    { month: 'Jun', regular: 80, seasonal: 38 },
    { month: 'Jul', regular: 82, seasonal: 40 },
    { month: 'Aug', regular: 80, seasonal: 42 },
    { month: 'Sep', regular: 78, seasonal: 35 },
    { month: 'Oct', regular: 75, seasonal: 25 },
    { month: 'Nov', regular: 70, seasonal: 15 },
    { month: 'Dec', regular: 68, seasonal: 12 }
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
