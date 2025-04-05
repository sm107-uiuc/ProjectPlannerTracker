import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@/lib/types";
import { LightbulbIcon, ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Define fact objects with text and source URL
interface Fact {
  text: string;
  source: string;
}

interface DidYouKnowCardProps {
  goal: Goal;
}

const DidYouKnowCard = ({ goal }: DidYouKnowCardProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);

  const safetyFacts: Fact[] = [
    {
      text: "Regular vehicle inspections can reduce accident rates by up to 30%.",
      source: "https://www.fleetmanagement.com/safety"
    },
    {
      text: "Driver training programs can decrease accident frequency by 40% on average.",
      source: "https://www.fleetmanagement.com/safety/driver-training"
    },
    {
      text: "Implementing telematics for driver behavior monitoring can reduce aggressive driving incidents by 60%.",
      source: "https://www.fleetmanagement.com/safety/telematics"
    },
    {
      text: "Vehicles with comprehensive safety feature packages have 22% fewer insurance claims.",
      source: "https://www.fleetmanagement.com/safety/features"
    },
    {
      text: "Fleet vehicles with preventative maintenance schedules have 20% fewer mechanical failure-related accidents.",
      source: "https://www.fleetmanagement.com/safety/maintenance"
    }
  ];
  
  const fuelFacts: Fact[] = [
    {
      text: "Proper tire inflation can improve fuel economy by up to 3%.",
      source: "https://www.fleetmanagement.com/fuel/tires"
    },
    {
      text: "Regular engine maintenance can improve fuel efficiency by up to 40%.",
      source: "https://www.fleetmanagement.com/fuel/maintenance"
    },
    {
      text: "Removing excess weight from vehicles can improve fuel economy by 1-2% for every 100 pounds removed.",
      source: "https://www.fleetmanagement.com/fuel/weight"
    },
    {
      text: "Aerodynamic improvements to fleet vehicles can reduce fuel consumption by 10-15%.",
      source: "https://www.fleetmanagement.com/fuel/aerodynamics"
    },
    {
      text: "Driver training focusing on eco-driving techniques can reduce fuel consumption by 5-15%.",
      source: "https://www.fleetmanagement.com/fuel/eco-driving"
    }
  ];
  
  const maintenanceFacts: Fact[] = [
    {
      text: "Proactive maintenance can reduce vehicle downtime by up to 25%.",
      source: "https://www.fleetmanagement.com/maintenance/proactive"
    },
    {
      text: "Predictive maintenance technologies can reduce repair costs by up to 30%.",
      source: "https://www.fleetmanagement.com/maintenance/predictive"
    },
    {
      text: "Implementing a scheduled maintenance program can extend vehicle lifetime by 20-40%.",
      source: "https://www.fleetmanagement.com/maintenance/scheduled"
    },
    {
      text: "Properly maintained fleet vehicles retain 15-25% more value at resale time.",
      source: "https://www.fleetmanagement.com/maintenance/resale"
    },
    {
      text: "Regular oil changes can increase engine life by up to 30%.",
      source: "https://www.fleetmanagement.com/maintenance/oil"
    }
  ];
  
  const utilizationFacts: Fact[] = [
    {
      text: "Advanced route optimization can reduce total fleet mileage by up to 20%.",
      source: "https://www.fleetmanagement.com/utilization/route"
    },
    {
      text: "Right-sizing your fleet can reduce total fleet costs by 15-30%.",
      source: "https://www.fleetmanagement.com/utilization/right-sizing"
    },
    {
      text: "Implementing vehicle sharing programs can improve utilization rates by 30-40%.",
      source: "https://www.fleetmanagement.com/utilization/sharing"
    },
    {
      text: "Intelligent vehicle assignment based on job requirements can increase productivity by 15%.",
      source: "https://www.fleetmanagement.com/utilization/assignment"
    },
    {
      text: "Tracking idle vehicles can identify up to 15% of unused capacity in most fleets.",
      source: "https://www.fleetmanagement.com/utilization/idle"
    }
  ];

  // Get facts based on the selected goal
  const getFacts = (): Fact[] => {
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
    <Card className="overflow-hidden border-blue-100 shadow-md bg-gradient-to-br from-blue-50 to-white">
      <CardContent className="pt-6 pb-5 px-5">
        <div className="flex items-start">
          {/* Animated lightbulb icon */}
          <motion.div 
            className="mr-4 flex-shrink-0 bg-blue-500 rounded-full p-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2
            }}
          >
            <LightbulbIcon className="h-6 w-6 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-blue-700">Did You Know?</h3>
              <div className="text-xs font-medium text-blue-400 bg-blue-100 px-2 py-1 rounded-full">
                Fact {currentFactIndex + 1} of {facts.length}
              </div>
            </div>
            
            {/* Fact text with animation */}
            <div className="min-h-[80px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentFactIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <p className="text-sm md:text-base text-gray-700 mb-2 font-medium">
                    {currentFact.text}
                  </p>
                  <div className="flex justify-end">
                    <a 
                      href={currentFact.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium hover:underline mt-1"
                    >
                      Learn more <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              {/* Previous button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePrevFact}
                className="p-0 h-9 w-9 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {/* Dots indicator */}
              <div className="flex space-x-2">
                {facts.map((_, index) => (
                  <motion.div 
                    key={index}
                    className={`h-2 w-2 rounded-full cursor-pointer 
                      ${index === currentFactIndex ? 'bg-blue-500' : 'bg-blue-200'}`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentFactIndex(index)}
                    animate={index === currentFactIndex ? { 
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={index === currentFactIndex ? { 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    } : {}}
                  />
                ))}
              </div>
              
              {/* Next button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextFact}
                className="p-0 h-9 w-9 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
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