import { Card } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Goal } from "../lib/types";
import { scoringData } from "../lib/scoreData";
import { CalendarDays, Target, Info, Calculator } from "lucide-react";
import { format, addMonths } from "date-fns";

interface CombinedGoalCardProps {
  goal: Goal;
}

const CombinedGoalCard = ({ goal }: CombinedGoalCardProps) => {
  const today = new Date();
  const targetDate = addMonths(today, 3); // Set target date 3 months from now
  const data = scoringData[goal];
  
  // Sort events by weight (descending)
  const sortedEvents = [...data.events].sort((a, b) => b.weight - a.weight);
  
  // Group events by importance
  const highWeightEvents = sortedEvents.filter(e => e.weight >= 15);
  const mediumWeightEvents = sortedEvents.filter(e => e.weight >= 10 && e.weight < 15);
  
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
    <Card className="shadow-md overflow-hidden">
      <div className="flex flex-col">
        {/* Goal Description Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start mb-4">
            <div className="mr-4 flex-shrink-0 bg-blue-500 rounded-full p-2">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-1">{title}</h3>
              <p className="text-sm text-gray-700">{description}</p>
            </div>
          </div>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <div className="flex items-center mr-6">
              <CalendarDays className="h-4 w-4 mr-1 text-blue-500" />
              <span>Target End Date: {format(targetDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1 text-blue-500" />
              <span>Target: {targetValue}</span>
            </div>
          </div>
        </div>

        {/* Score Calculation Section */}
        <div className="p-6" style={{ background: "linear-gradient(to bottom right, #f0f9ff, #ffffff, #ebf5ff)" }}>
          <div className="flex items-center mb-4">
            <Calculator className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="text-base font-medium">How Your Fleet Score Is Calculated</h3>
          </div>
          
          <div className="text-sm text-gray-700 mb-4">
            {data.description}
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
            <div className="flex items-start">
              <Info className="text-blue-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">The Formula</h4>
                <p className="text-xs font-mono bg-white p-2 rounded border border-blue-100">
                  {data.formula}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="event-weights" className="border-b-0">
                <AccordionTrigger className="text-sm py-2 text-blue-600">
                  View Event Weights
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 max-h-80 overflow-auto">
                    <div className="overflow-x-auto">
                      <h5 className="text-sm font-medium py-1 px-2 bg-blue-50 rounded-t border border-blue-100 flex justify-between">
                        <span>Event Name</span>
                        <span>Description</span>
                        <span>Weight</span>
                      </h5>
                      <table className="w-full text-sm">
                        <tbody>
                          {sortedEvents.map((event) => (
                            <tr key={event.eventName} className="border-b border-gray-100">
                              <td className="py-2 px-2 font-medium">{event.eventName}</td>
                              <td className="py-2 px-2 text-xs text-gray-600">{event.description}</td>
                              <td className="py-2 px-2 text-right">
                                <Badge className="bg-blue-500">{event.weight}%</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CombinedGoalCard;