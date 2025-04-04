export type Goal = 'safety' | 'fuel' | 'maintenance' | 'utilization';

export type GoalDisplayText = {
  [key in Goal]: string;
};

export interface Recommendation {
  type: 'warning' | 'danger' | 'info' | 'success';
  icon: string;
  text: string;
}

export interface GoalData {
  fleetScore: number;
  trend: string;
  isTrendPositive: boolean;
  recommendations: Recommendation[];
  columnEmphasis: string;
}

export interface Vehicle {
  id: string;
  driverScore: number;
  maintenanceScore: number;
  overallScore: number;
  status: 'Good' | 'Needs Review' | 'Action Required';
}
