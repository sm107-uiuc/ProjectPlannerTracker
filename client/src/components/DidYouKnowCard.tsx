import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@/lib/types";
import { LightbulbIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface DidYouKnowCardProps {
  goal: Goal;
}

const DidYouKnowCard = ({ goal }: DidYouKnowCardProps) => {
  const [fact, setFact] = useState<string>("");
  
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

  useEffect(() => {
    // Select a random fact based on the selected goal
    let facts: string[] = [];
    
    switch (goal) {
      case 'safety':
        facts = safetyFacts;
        break;
      case 'fuel':
        facts = fuelFacts;
        break;
      case 'maintenance':
        facts = maintenanceFacts;
        break;
      case 'utilization':
        facts = utilizationFacts;
        break;
      default:
        facts = safetyFacts;
    }
    
    const randomIndex = Math.floor(Math.random() * facts.length);
    setFact(facts[randomIndex]);
  }, [goal]);

  return (
    <Card className="bg-blue-50">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0 bg-blue-500 rounded-full p-2">
            <LightbulbIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-1">Did You Know?</h3>
            <p className="text-sm text-gray-700">{fact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DidYouKnowCard;