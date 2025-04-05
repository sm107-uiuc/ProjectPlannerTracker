import { useState } from "react";
import { Goal } from "@/lib/types";
import { goalDisplayText } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/Sidebar";
import { LoaderScreen } from "@/components/LoaderScreen";
import { 
  Shield, 
  Fuel, 
  Wrench, 
  ChartBar, 
  Check 
} from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  selected: boolean;
  onClick: () => void;
}

const GoalCard = ({ 
  goal, 
  title, 
  description, 
  icon, 
  benefits, 
  selected, 
  onClick 
}: GoalCardProps) => (
  <Card 
    className={`cursor-pointer hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all ${selected ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
    onClick={onClick}
  >
    <CardContent className="pt-6">
      <div className="flex items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center mb-1">
            <Check className="w-4 h-4 text-green-600 mr-2" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

interface GoalSelectionScreenProps {
  selectedGoal: Goal | null;
  onGoalSelect: (goal: Goal) => void;
  onViewDashboard: () => void;
}

const GoalSelectionScreen = ({ 
  selectedGoal, 
  onGoalSelect, 
  onViewDashboard 
}: GoalSelectionScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const goals: { 
    goal: Goal; 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    benefits: string[] 
  }[] = [
    {
      goal: 'safety',
      title: goalDisplayText.safety,
      description: 'Reduce incidents and improve driving behavior',
      icon: <Shield className="w-5 h-5" />,
      benefits: ['Reduce harsh driving events', 'Lower accident rates']
    },
    {
      goal: 'fuel',
      title: goalDisplayText.fuel,
      description: 'Optimize consumption and lower expenses',
      icon: <Fuel className="w-5 h-5" />,
      benefits: ['Decrease idle time', 'Improve driving efficiency']
    },
    {
      goal: 'maintenance',
      title: goalDisplayText.maintenance,
      description: 'Prevent breakdowns and extend vehicle life',
      icon: <Wrench className="w-5 h-5" />,
      benefits: ['Reduce unexpected repairs', 'Proactive maintenance scheduling']
    },
    {
      goal: 'utilization',
      title: goalDisplayText.utilization,
      description: 'Maximize asset usage and efficiency',
      icon: <ChartBar className="w-5 h-5" />,
      benefits: ['Reduce downtime', 'Optimize scheduling']
    }
  ];
  
  const handleViewDashboard = () => {
    setIsLoading(true);
    // The loader will automatically call onViewDashboard after 5 seconds
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-background">
        {isLoading ? (
          <LoaderScreen 
            duration={5000} 
            onComplete={onViewDashboard}
          />
        ) : (
          <div className="max-w-3xl w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">What are you trying to achieve?</h1>
            <p className="text-gray-600 mb-8">Select your primary fleet goal to see a personalized dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.goal}
                  goal={goal.goal}
                  title={goal.title}
                  description={goal.description}
                  icon={goal.icon}
                  benefits={goal.benefits}
                  selected={selectedGoal === goal.goal}
                  onClick={() => onGoalSelect(goal.goal)}
                />
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Or describe your goal:</label>
              <Textarea 
                className="w-full min-h-[10rem] bg-white" 
                placeholder="e.g., Reduce carbon footprint and increase sustainability"
                rows={10}
                minLength={600}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handleViewDashboard}
                disabled={!selectedGoal}
              >
                Generate Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoalSelectionScreen;
