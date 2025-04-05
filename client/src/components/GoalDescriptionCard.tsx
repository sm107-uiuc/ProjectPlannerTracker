import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@/lib/types";
import { CalendarDays, Target, CheckCircle } from "lucide-react";
import { format, addMonths } from "date-fns";

interface GoalDescriptionCardProps {
  goal: Goal;
}

const GoalDescriptionCard = ({ goal }: GoalDescriptionCardProps) => {
  const today = new Date();
  const targetDate = addMonths(today, 3); // Set target date 3 months from now
  
  const getGoalDescription = (): { title: string, description: string, targetValue: string } => {
    switch (goal) {
      case 'safety':
        return {
          title: "Safety Excellence",
          description: "Reduce accident rates and safety incidents by implementing proactive safety measures, driver training programs, and vehicle safety technologies.",
          targetValue: "Reduce incidents by 40%"
        };
      case 'fuel':
        return {
          title: "Fuel Optimization",
          description: "Improve fuel efficiency through proper vehicle maintenance, driver behavior analysis, route optimization, and adoption of fuel-efficient vehicles.",
          targetValue: "Reduce consumption by 25%"
        };
      case 'maintenance':
        return {
          title: "Maintenance Efficiency", 
          description: "Enhance vehicle reliability and reduce downtime through preventative maintenance scheduling, parts inventory management, and service vendor optimization.",
          targetValue: "Reduce downtime by 30%"
        };
      case 'utilization':
        return {
          title: "Fleet Utilization",
          description: "Maximize vehicle utilization rates through route optimization, right-sizing initiatives, shared vehicle programs, and improved assignment processes.",
          targetValue: "Increase utilization by 35%"
        };
      default:
        return {
          title: "Fleet Goal",
          description: "Select a specific goal to improve your fleet performance and efficiency.",
          targetValue: "N/A"
        };
    }
  };

  const { title, description, targetValue } = getGoalDescription();
  
  const getIconForGoal = () => {
    switch (goal) {
      case 'safety':
        return <Target className="h-6 w-6 text-white" />;
      case 'fuel':
        return <Target className="h-6 w-6 text-white" />;
      case 'maintenance':
        return <Target className="h-6 w-6 text-white" />;
      case 'utilization':
        return <Target className="h-6 w-6 text-white" />;
      default:
        return <Target className="h-6 w-6 text-white" />;
    }
  };
  
  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-white">
      <CardContent className="pt-6">
        <div className="flex items-start mb-5">
          <div className="mr-4 flex-shrink-0 bg-blue-500 rounded-full p-2.5">
            {getIconForGoal()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center mr-6 mb-2">
            <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
            <span>Target End Date: <span className="font-medium">{format(targetDate, 'MMM d, yyyy')}</span></span>
          </div>
          <div className="flex items-center mb-2">
            <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
            <span>Target: <span className="font-medium">{targetValue}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalDescriptionCard;