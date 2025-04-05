import { useState } from "react";
import { Goal } from "@/lib/types";
import { goalDisplayText } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/Sidebar";
import { LoaderScreen } from "@/components/LoaderScreen";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
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

interface EventItem {
  eventName: string;
  description: string;
}

interface EventWeight {
  eventName: string;
  weight: number;
  explanation: string;
}

const GoalSelectionScreen = ({ 
  selectedGoal, 
  onGoalSelect, 
  onViewDashboard 
}: GoalSelectionScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customGoal, setCustomGoal] = useState("");
  const [isWeightsDialogOpen, setIsWeightsDialogOpen] = useState(false);
  const [isGeneratingWeights, setIsGeneratingWeights] = useState(false);
  const [eventWeights, setEventWeights] = useState<EventWeight[]>([]);
  
  // List of all fleet events
  const fleetEvents: EventItem[] = [
    { eventName: "FatigueRisk", description: "Identifies when a driver has been operating the vehicle for extended periods without adequate breaks." },
    { eventName: "UnderutilizedVehicles", description: "Flags vehicles that are rarely dispatched or driven significantly less than fleet average." },
    { eventName: "EVChargingInefficiency", description: "EVs are plugged in and charged often but have very low trip miles afterward." },
    { eventName: "CheckEngineLightOn", description: "Light remains on for 3+ consecutive days." },
    { eventName: "FuelInefficiency", description: "MPG/MPGe significantly lower than expected for trip length and vehicle class." },
    { eventName: "RouteDeviation", description: "Driver strays from the recommended or assigned route." },
    { eventName: "HarshBraking", description: "Triggered when the vehicle decelerates sharply, indicating late reactions or potential near-miss events." },
    { eventName: "HarshAcceleration", description: "Detected when the driver accelerates rapidly, commonly after stops or during merging." },
    { eventName: "HarshCornering", description: "Identifies sudden, tight turns at speed." },
    { eventName: "AbsoluteSpeeding", description: "Occurs when a vehicle exceeds posted speed limits, regardless of surrounding traffic." },
    { eventName: "RelativeSpeeding", description: "Driver is moving significantly faster than surrounding traffic, even if under the posted limit." },
    { eventName: "LongIdling", description: "Vehicle remained stationary with engine running beyond a set threshold." }
  ];
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
  
  const handleGenerateWeights = async () => {
    // Validate custom goal length (minimum 200 characters)
    if (customGoal.length < 200) {
      alert("Please describe your goal in at least 200 characters for a more accurate analysis.");
      return;
    }
    
    setIsGeneratingWeights(true);
    
    try {
      const response = await fetch('/api/ai/generate-weights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          goalDescription: customGoal,
          events: fleetEvents
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate weights');
      }
      
      const data = await response.json();
      
      if (data.weights && Array.isArray(data.weights)) {
        setEventWeights(data.weights);
        setIsWeightsDialogOpen(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error generating weights:', error);
      alert(`Failed to generate weights: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGeneratingWeights(false);
    }
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
                minLength={50}
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                {customGoal.length}/50 characters minimum for AI analysis
              </p>
              
              {customGoal.length >= 50 && (
                <Button 
                  className="mt-4 bg-primary text-white hover:bg-primary/90"
                  onClick={handleGenerateWeights}
                  disabled={isGeneratingWeights}
                >
                  {isGeneratingWeights ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Weights...
                    </>
                  ) : (
                    'Generate Event Weights'
                  )}
                </Button>
              )}
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
            
            <Dialog open={isWeightsDialogOpen} onOpenChange={setIsWeightsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Generated Event Weights for Your Goal</DialogTitle>
                  <DialogDescription>
                    Based on your goal description, we've analyzed the importance of different fleet events.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="my-4">
                  <h3 className="font-medium text-lg mb-2">Your Goal:</h3>
                  <div className="bg-slate-50 p-3 rounded-md text-gray-700">
                    {customGoal}
                  </div>
                </div>
                
                <div className="my-6">
                  <h3 className="font-medium text-lg mb-4">Event Weights:</h3>
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left border">Event</th>
                          <th className="p-2 text-left border w-20">Weight (%)</th>
                          <th className="p-2 text-left border">Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventWeights.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 border font-medium">{item.eventName}</td>
                            <td className="p-2 border text-center">
                              <span 
                                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                                  item.weight >= 20 ? 'bg-red-100 text-red-800' : 
                                  item.weight >= 10 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-green-100 text-green-800'
                                }`}
                              >
                                {item.weight}%
                              </span>
                            </td>
                            <td className="p-2 border">{item.explanation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={() => setIsWeightsDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};

export default GoalSelectionScreen;
