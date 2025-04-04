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
