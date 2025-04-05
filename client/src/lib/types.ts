export type Goal = 'safety' | 'fuel' | 'maintenance' | 'utilization';

export type GoalDisplayText = {
  [key in Goal]: string;
};

export type RecommendationStatus = 'notified' | 'risk_accepted' | 'in_progress' | 'completed';

export interface RecommendationInterface {
  id: number;
  userId: number;
  goalType: Goal;
  title: string;
  description: string;
  actionableInsight?: string;
  potentialImpact?: string;
  estimatedSavings?: string;
  timeToImplement?: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  icon: string;
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationStep {
  id: number;
  recommendationId: number;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
  order: number;
  createdAt: string;
}

// Legacy interface for backward compatibility
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
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  driverScore: number;
  maintenanceScore: number;
  overallScore: number;
  status: 'Good' | 'Needs Review' | 'Action Required';
}
