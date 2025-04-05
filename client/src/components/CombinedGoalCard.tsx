import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Goal } from "../lib/types";
import { scoringData } from "../lib/scoreData";
import { useState } from "react";
import { CalendarDays, Target, Info, Calculator, ChevronRight, Percent } from "lucide-react";
import { format, addMonths } from "date-fns";

interface CombinedGoalCardProps {
  goal: Goal;
}

const CombinedGoalCard = ({ goal }: CombinedGoalCardProps) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'weights'>('explanation');
  const today = new Date();
  const targetDate = addMonths(today, 3); // Set target date 3 months from now
  const data = scoringData[goal];
  
  // Sort events by weight (descending)
  const sortedEvents = [...data.events].sort((a, b) => b.weight - a.weight);
  
  // Group events by importance
  const highWeightEvents = sortedEvents.filter(e => e.weight >= 15);
  const mediumWeightEvents = sortedEvents.filter(e => e.weight >= 10 && e.weight < 15);
  const lowWeightEvents = sortedEvents.filter(e => e.weight < 10);
  
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
    <Card className="shadow-md overflow-hidden relative h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Goal Description Side */}
        <div className="p-6 border-r border-gray-100">
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
        </div>

        {/* Score Calculation Side */}
        <div className="relative" style={{ background: "linear-gradient(to bottom right, #f0f9ff, #ffffff, #ebf5ff)" }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-500" />
                How Your Fleet Score Is Calculated
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Understanding the metrics behind your performance score
            </CardDescription>
          </CardHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'explanation' | 'weights')}
            className="w-full"
          >
            <div className="px-4 pt-0">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="explanation">Score Explanation</TabsTrigger>
                <TabsTrigger value="weights">Event Weights</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="explanation" className="pt-0 px-4 pb-4">
              <div className="text-sm text-gray-700 mb-4">
                {data.description}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4">
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
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors Influencing Your Score:</h4>
                <ul className="text-sm space-y-2">
                  {highWeightEvents.slice(0, 3).map((event) => (
                    <li key={event.eventName} className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{event.eventName}</span>
                        <span className="text-xs ml-2 text-blue-600">(Weight: {event.weight}%)</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="weights" className="pt-0 pb-0 px-0">
              <ScrollArea className="h-[280px] w-full rounded-md">
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <Percent className="h-4 w-4 mr-1 text-blue-500" />
                      Event Weight Distribution
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Events are weighted based on their impact on overall fleet performance.
                      Higher weights indicate greater significance in score calculation.
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="high-impact" className="border-b">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          High Impact Events
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{highWeightEvents.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {highWeightEvents.map((event) => (
                            <li key={event.eventName} className="text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{event.eventName}</span>
                                <Badge className="bg-blue-500">{event.weight}%</Badge>
                              </div>
                              <p className="text-xs text-gray-500">{event.description}</p>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="medium-impact" className="border-b">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          Medium Impact Events
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{mediumWeightEvents.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {mediumWeightEvents.map((event) => (
                            <li key={event.eventName} className="text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{event.eventName}</span>
                                <Badge className="bg-blue-500">{event.weight}%</Badge>
                              </div>
                              <p className="text-xs text-gray-500">{event.description}</p>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="low-impact" className="border-b">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          Low Impact Events
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{lowWeightEvents.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {lowWeightEvents.map((event) => (
                            <li key={event.eventName} className="text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{event.eventName}</span>
                                <Badge className="bg-blue-500">{event.weight}%</Badge>
                              </div>
                              <p className="text-xs text-gray-500">{event.description}</p>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default CombinedGoalCard;