import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@/lib/types";
import { CalendarDays, Target } from "lucide-react";
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
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <div className="mr-4 flex-shrink-0 bg-blue-500 rounded-full p-2">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-1">{title}</h3>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center mr-6">
            <CalendarDays className="h-4 w-4 mr-1 text-blue-500" />
            <span>Target End Date: {format(targetDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-1 text-blue-500" />
            <span>Target: {targetValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalDescriptionCard;