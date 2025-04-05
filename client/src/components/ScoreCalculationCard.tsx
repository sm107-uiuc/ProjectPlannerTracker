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
import { Info, Calculator, ChevronRight, Percent } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface ScoreCalculationCardProps {
  goal: Goal;
}

const ScoreCalculationCard = ({ goal }: ScoreCalculationCardProps) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'table'>('explanation');
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
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'explanation' | 'table')}
        className="w-full"
      >
        <div className="px-4 pt-0">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="explanation">Score Explanation</TabsTrigger>
            <TabsTrigger value="table">Events Table</TabsTrigger>
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
        
        <TabsContent value="table" className="pt-0 pb-0 px-0">
          <ScrollArea className="h-60 w-full rounded-md">
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <Percent className="h-4 w-4 mr-1 text-blue-500" />
                  Events Impact Table
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  A comprehensive reference of all events that affect your fleet score.
                </p>
              </div>
              
              <Table>
                <TableCaption>Fleet Score Events for {goal.charAt(0).toUpperCase() + goal.slice(1)}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Event</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-[80px]">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* High Impact Events */}
                  {highWeightEvents.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={3} className="bg-blue-50 font-medium text-blue-800">
                          High Impact Events
                        </TableCell>
                      </TableRow>
                      {highWeightEvents.map((event) => (
                        <TableRow key={`high-${event.eventName}`}>
                          <TableCell className="font-medium">{event.eventName}</TableCell>
                          <TableCell className="text-xs">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-500">{event.weight}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                  
                  {/* Medium Impact Events */}
                  {mediumWeightEvents.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={3} className="bg-blue-50 font-medium text-blue-800">
                          Medium Impact Events
                        </TableCell>
                      </TableRow>
                      {mediumWeightEvents.map((event) => (
                        <TableRow key={`medium-${event.eventName}`}>
                          <TableCell className="font-medium">{event.eventName}</TableCell>
                          <TableCell className="text-xs">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-500">{event.weight}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                  
                  {/* Low Impact Events */}
                  {lowWeightEvents.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={3} className="bg-blue-50 font-medium text-blue-800">
                          Low Impact Events
                        </TableCell>
                      </TableRow>
                      {lowWeightEvents.map((event) => (
                        <TableRow key={`low-${event.eventName}`}>
                          <TableCell className="font-medium">{event.eventName}</TableCell>
                          <TableCell className="text-xs">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-500">{event.weight}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ScoreCalculationCard;