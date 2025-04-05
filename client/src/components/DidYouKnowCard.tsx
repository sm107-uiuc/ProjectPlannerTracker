import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@/lib/types";
import { LightbulbIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DidYouKnowCardProps {
  goal: Goal;
}

const DidYouKnowCard = ({ goal }: DidYouKnowCardProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);
  
  const safetyFacts = [
    "Regular vehicle inspections can reduce accident rates by up to 30%.",
    "Driver training programs can decrease accident frequency by 40% on average.",
    "Implementing telematics for driver behavior monitoring can reduce aggressive driving incidents by 60%.",
    "Vehicles with comprehensive safety feature packages have 22% fewer insurance claims.",
    "Fleet vehicles with preventative maintenance schedules have 20% fewer mechanical failure-related accidents."
  ];
  
  const fuelFacts = [
    "Proper tire inflation can improve fuel economy by up to 3%.",
    "Regular engine maintenance can improve fuel efficiency by up to 40%.",
    "Removing excess weight from vehicles can improve fuel economy by 1-2% for every 100 pounds removed.",
    "Aerodynamic improvements to fleet vehicles can reduce fuel consumption by 10-15%.",
    "Driver training focusing on eco-driving techniques can reduce fuel consumption by 5-15%."
  ];
  
  const maintenanceFacts = [
    "Proactive maintenance can reduce vehicle downtime by up to 25%.",
    "Predictive maintenance technologies can reduce repair costs by up to 30%.",
    "Implementing a scheduled maintenance program can extend vehicle lifetime by 20-40%.",
    "Properly maintained fleet vehicles retain 15-25% more value at resale time.",
    "Regular oil changes can increase engine life by up to 30%."
  ];
  
  const utilizationFacts = [
    "Advanced route optimization can reduce total fleet mileage by up to 20%.",
    "Right-sizing your fleet can reduce total fleet costs by 15-30%.",
    "Implementing vehicle sharing programs can improve utilization rates by 30-40%.",
    "Intelligent vehicle assignment based on job requirements can increase productivity by 15%.",
    "Tracking idle vehicles can identify up to 15% of unused capacity in most fleets."
  ];

  // Get facts based on the selected goal
  const getFacts = (): string[] => {
    switch (goal) {
      case 'safety':
        return safetyFacts;
      case 'fuel':
        return fuelFacts;
      case 'maintenance':
        return maintenanceFacts;
      case 'utilization':
        return utilizationFacts;
      default:
        return safetyFacts;
    }
  };
  
  // Reset fact index when goal changes
  useEffect(() => {
    setCurrentFactIndex(0);
  }, [goal]);

  const facts = getFacts();
  const currentFact = facts[currentFactIndex];
  
  const handlePrevFact = () => {
    setCurrentFactIndex(prev => (prev > 0 ? prev - 1 : facts.length - 1));
  };
  
  const handleNextFact = () => {
    setCurrentFactIndex(prev => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  return (
    <Card className="bg-blue-50">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0 bg-blue-500 rounded-full p-2">
            <LightbulbIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-700 mb-1">Did You Know?</h3>
              <div className="text-xs text-gray-500">
                Fact {currentFactIndex + 1} of {facts.length}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{currentFact}</p>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePrevFact}
                className="p-1 h-8 w-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex space-x-1">
                {facts.map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentFactIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextFact}
                className="p-1 h-8 w-8"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DidYouKnowCard;