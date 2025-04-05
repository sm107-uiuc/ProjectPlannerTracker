import { useState } from 'react';
import { Goal } from '../lib/types';
import { scoringData } from '../lib/scoreData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import { ScrollArea } from '../components/ui/scroll-area';
import { Info, Calculator, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface ScoreCalculationCardProps {
  goal: Goal;
}

const ScoreCalculationCard = ({ goal }: ScoreCalculationCardProps) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'eventsTable'>('explanation');
  const [isExpanded, setIsExpanded] = useState(false);
  const data = scoringData[goal];
  
  // Sort events by weight (descending)
  const sortedEvents = [...data.events].sort((a, b) => b.weight - a.weight);
  
  // Group events by importance
  const highWeightEvents = sortedEvents.filter(e => e.weight >= 15);
  const mediumWeightEvents = sortedEvents.filter(e => e.weight >= 10 && e.weight < 15);
  const lowWeightEvents = sortedEvents.filter(e => e.weight < 10);
  
  return (
    <Card className="shadow-md overflow-hidden relative h-full" style={{ background: "linear-gradient(to bottom right, #f0f9ff, #ffffff, #ebf5ff)" }}>
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
      
      <CardContent className="px-4 pt-0 pb-4">
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
        
        <div className="mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-blue-600 text-sm font-medium w-full justify-between"
          >
            <span>View Event Weights</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        
        {isExpanded && (
          <ScrollArea className="mb-2 max-h-80">
            <div className="space-y-4">
              {/* High Impact Events */}
              {highWeightEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium py-2 px-3 bg-blue-50 rounded-t-md flex items-center">
                    High Impact Events
                    <Badge className="ml-2 bg-blue-100 text-blue-800">{highWeightEvents.length}</Badge>
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Event</TableHead>
                        <TableHead className="w-[50%]">Description</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {highWeightEvents.map((event) => (
                        <TableRow key={`high-${event.eventName}`}>
                          <TableCell className="font-medium">{event.eventName}</TableCell>
                          <TableCell className="text-xs">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-500">{event.weight}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Medium Impact Events */}
              {mediumWeightEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium py-2 px-3 bg-blue-50 rounded-t-md flex items-center">
                    Medium Impact Events
                    <Badge className="ml-2 bg-blue-100 text-blue-800">{mediumWeightEvents.length}</Badge>
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Event</TableHead>
                        <TableHead className="w-[50%]">Description</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mediumWeightEvents.map((event) => (
                        <TableRow key={`medium-${event.eventName}`}>
                          <TableCell className="font-medium">{event.eventName}</TableCell>
                          <TableCell className="text-xs">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-500">{event.weight}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Low Impact Events */}
              {lowWeightEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium py-2 px-3 bg-blue-50 rounded-t-md flex items-center">
                    Low Impact Events
                    <Badge className="ml-2 bg-blue-100 text-blue-800">{lowWeightEvents.length}</Badge>
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Event</TableHead>
                        <TableHead className="w-[50%]">Description</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowWeightEvents.map((event) => (
                        <TableRow key={`low-${event.eventName}`}>
                          <TableCell className="font-medium">{event.eventName}</TableCell>
                          <TableCell className="text-xs">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-500">{event.weight}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCalculationCard;