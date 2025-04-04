import { useState } from "react";
import GoalSelectionScreen from "@/components/GoalSelectionScreen";
import DashboardScreen from "@/components/DashboardScreen";
import { Goal } from "@/lib/types";

export default function Home() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleViewDashboard = () => {
    if (selectedGoal) {
      setShowDashboard(true);
    }
  };

  return (
    <div className="flex h-screen">
      {showDashboard ? (
        <DashboardScreen selectedGoal={selectedGoal!} />
      ) : (
        <GoalSelectionScreen 
          selectedGoal={selectedGoal} 
          onGoalSelect={handleGoalSelect} 
          onViewDashboard={handleViewDashboard} 
        />
      )}
    </div>
  );
}
