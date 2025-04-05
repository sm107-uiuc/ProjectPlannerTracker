import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Search, 
  ClipboardList, 
  MoreHorizontal, 
  ArrowUpDown, 
  CheckCheck, 
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { RecommendationInterface, Goal, RecommendationStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { RecommendationDetail } from './RecommendationDetail';
import { ActionChecklistModal } from './ActionChecklistModal';
import { goalDisplayText } from '@/lib/mockData';
import Confetti from 'react-confetti';

// Table row component for recommendations
interface RecommendationRowProps {
  recommendation: RecommendationInterface;
  onViewDetails: (rec: RecommendationInterface) => void;
  onTakeAction: (rec: RecommendationInterface, e: React.MouseEvent) => void;
  onMarkComplete: (rec: RecommendationInterface) => void;
  improvementPercentage?: number;
}

const RecommendationRow = ({ 
  recommendation, 
  onViewDetails, 
  onTakeAction,
  onMarkComplete,
  improvementPercentage = 0.5 // Default value if not provided
}: RecommendationRowProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'danger':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };
  
  const getStatusBadge = (status: RecommendationStatus) => {
    switch (status) {
      case 'notified':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Not Started</Badge>;
      case 'risk_accepted':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Risk Accepted</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partially Complete</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails(recommendation);
  };
  
  const handleTakeAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTakeAction(recommendation, e);
  };
  
  const handleMarkComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkComplete(recommendation);
  };
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          {getTypeIcon(recommendation.type)}
          <span className="ml-2">{recommendation.title}</span>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm text-slate-600 line-clamp-1">{recommendation.description}</p>
      </TableCell>
      <TableCell>{getStatusBadge(recommendation.status)}</TableCell>
      <TableCell>
        <div className="flex justify-end items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600 border-green-200 hover:bg-green-50"
            disabled={recommendation.status === 'completed'}
            onClick={handleMarkComplete}
          >
            <CheckCheck className="mr-1 h-3.5 w-3.5" />
            Mark Complete
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={handleViewDetails}
          >
            <ClipboardList className="mr-1 h-3.5 w-3.5" />
            View Steps
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={handleTakeAction}
          >
            <ExternalLink className="mr-1 h-3.5 w-3.5" />
            Take Action
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

interface RecommendationsTabProps {
  selectedGoal: Goal;
}

export const RecommendationsTab = ({ selectedGoal }: RecommendationsTabProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationInterface | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionRecommendation, setActionRecommendation] = useState<RecommendationInterface | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completeMessage, setCompleteMessage] = useState('');
  
  // Helper function to generate random improvement percentage between 0.1 and 0.9
  const getRandomImprovement = () => {
    return (Math.floor(Math.random() * 9) + 1) / 10; // 0.1 to 0.9
  };
  
  // Random success messages 
  const successMessages = [
    "Great job! Fleet performance improved!",
    "Excellent work! Your fleet is running better!",
    "Success! Fleet efficiency improving!",
    "Well done! Making progress on fleet goals!",
    "Fantastic! Keep up the good work!"
  ];
  
  // Get random success message
  const getRandomSuccessMessage = () => {
    const index = Math.floor(Math.random() * successMessages.length);
    return successMessages[index];
  };

  // Fetch recommendations from API
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: [`/api/users/1/recommendations`, selectedGoal],
    queryFn: ({ queryKey }) => {
      const baseUrl = queryKey[0] as string;
      const goalType = queryKey[1] as string;
      const url = goalType ? `${baseUrl}?goalType=${goalType}` : baseUrl;
      return apiRequest(url);
    }
  });
  
  // Update recommendation status mutation
  const updateStatusMutation = useMutation<RecommendationInterface, Error, { id: number, status: RecommendationStatus }>({
    mutationFn: async ({ id, status }) => {
      return apiRequest({
        url: `/api/recommendations/${id}/status`,
        method: 'PATCH',
        body: { status }
      });
    },
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: 'Recommendation status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/1/recommendations`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update recommendation status. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Handle opening the action modal
  const handleTakeAction = (rec: RecommendationInterface, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking through to the recommendation detail
    setActionRecommendation(rec);
    setActionModalOpen(true);
  };

  // Handle action modal completion
  const handleActionComplete = () => {
    // Refresh the recommendations data
    // This happens automatically due to the cache invalidation in the modal
  };
  
  // Fetch the current fleet score
  const { data: fleetScoreData } = useQuery({
    queryKey: [`/api/users/1/fleet-score`, selectedGoal],
    queryFn: ({ queryKey }) => {
      const baseUrl = queryKey[0] as string;
      const goalType = queryKey[1] as string;
      const url = goalType ? `${baseUrl}?goalType=${goalType}` : baseUrl;
      return apiRequest(url);
    }
  });
  
  // Update fleet score mutation
  const updateFleetScoreMutation = useMutation({
    mutationFn: async ({ goalType, score, improvementPercentage }: { goalType: string, score: number, improvementPercentage: number }) => {
      return apiRequest({
        url: `/api/users/1/fleet-score`,
        method: 'POST',
        body: { goalType, score, improvementPercentage }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/1/fleet-score`] });
    },
    onError: () => {
      console.error('Failed to update fleet score');
    }
  });
  
  // Handle marking a recommendation as complete
  const handleMarkComplete = (rec: RecommendationInterface) => {
    // Generate a random improvement percentage between 0.1 and 0.9
    const improvementPercentage = getRandomImprovement();
    
    // Calculate new score
    const currentScore = fleetScoreData?.fleetScore || 0;
    const newScore = Math.min(currentScore + improvementPercentage, 100);
    
    // Mark recommendation as complete
    updateStatusMutation.mutate({ 
      id: rec.id, 
      status: 'completed' 
    }, {
      onSuccess: () => {
        // Update fleet score
        updateFleetScoreMutation.mutate({
          goalType: selectedGoal,
          score: newScore,
          improvementPercentage
        });
        
        // Show confetti and success message
        setCompleteMessage(`${getRandomSuccessMessage()} (${improvementPercentage.toFixed(1)}% ↑)`);
        setShowConfetti(true);
        
        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    });
  };

  // Effect to reset recommendation statuses on page refresh
  useEffect(() => {
    // Only reset if we have recommendations and none are already reset
    if (recommendations.length > 0 && recommendations.some((r: RecommendationInterface) => r.status !== 'notified')) {
      // Reset all recommendations to "notified" status
      recommendations.forEach((rec: RecommendationInterface) => {
        if (rec.status !== 'notified') {
          updateStatusMutation.mutate({
            id: rec.id,
            status: 'notified'
          });
        }
      });
    }
  }, []);
  
  // Calculate improvement percentage for each recommendation
  const recommendationImprovements = recommendations.reduce((acc: Record<number, number>, rec: RecommendationInterface) => {
    acc[rec.id] = getRandomImprovement();
    return acc;
  }, {} as Record<number, number>);
  
  // Filter recommendations based on search term and status filter
  const filteredRecommendations = recommendations.filter((rec: RecommendationInterface) => {
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getCountByStatus = (status: string) => {
    if (status === 'all') {
      return recommendations.length;
    }
    return recommendations.filter((rec: RecommendationInterface) => rec.status === status).length;
  };

  if (selectedRecommendation) {
    return (
      <RecommendationDetail 
        recommendation={selectedRecommendation} 
        onBack={() => setSelectedRecommendation(null)} 
      />
    );
  }

  return (
    <Card className="shadow-md border-slate-200 relative">
      {/* Confetti animation when a recommendation is marked as complete */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
            gravity={0.25}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-lg shadow-xl border border-green-200 z-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-lg font-medium text-green-600">{completeMessage}</span>
            </div>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-slate-800">
          {goalDisplayText[selectedGoal]} Recommendations
        </CardTitle>
        <CardDescription>
          Review and manage recommendations to improve your fleet performance.
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search recommendations..."
            className="pl-9 bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilterStatus}>
          <div className="px-6">
            <TabsList className="grid grid-cols-4 h-auto p-1 bg-slate-100">
              <TabsTrigger 
                value="all" 
                className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                All ({getCountByStatus('all')})
              </TabsTrigger>
              <TabsTrigger 
                value="notified" 
                className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Not Started ({getCountByStatus('notified')})
              </TabsTrigger>
              <TabsTrigger 
                value="in_progress" 
                className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Partially Complete ({getCountByStatus('in_progress')})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Complete ({getCountByStatus('completed')})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content for all tabs - Table View */}
          <TabsContent value="all" className="m-0 px-6 py-4">
            {isLoading ? (
              <div className="py-8 text-center text-slate-500">Loading recommendations...</div>
            ) : filteredRecommendations.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No recommendations found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations.map((rec) => (
                    <RecommendationRow
                      key={rec.id}
                      recommendation={rec}
                      onViewDetails={setSelectedRecommendation}
                      onTakeAction={handleTakeAction}
                      onMarkComplete={handleMarkComplete}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="notified" className="m-0 px-6 py-4">
            {filteredRecommendations.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No recommendations in Not Started status</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations.map((rec) => (
                    <RecommendationRow
                      key={rec.id}
                      recommendation={rec}
                      onViewDetails={setSelectedRecommendation}
                      onTakeAction={handleTakeAction}
                      onMarkComplete={handleMarkComplete}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="in_progress" className="m-0 px-6 py-4">
            {filteredRecommendations.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No recommendations in Partially Complete status</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations.map((rec) => (
                    <RecommendationRow
                      key={rec.id}
                      recommendation={rec}
                      onViewDetails={setSelectedRecommendation}
                      onTakeAction={handleTakeAction}
                      onMarkComplete={handleMarkComplete}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="m-0 px-6 py-4">
            {filteredRecommendations.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No recommendations in Complete status</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations.map((rec) => (
                    <RecommendationRow
                      key={rec.id}
                      recommendation={rec}
                      onViewDetails={setSelectedRecommendation}
                      onTakeAction={handleTakeAction}
                      onMarkComplete={handleMarkComplete}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Action Checklist Modal */}
      {actionRecommendation && (
        <ActionChecklistModal
          recommendation={actionRecommendation}
          open={actionModalOpen}
          onOpenChange={setActionModalOpen}
          onComplete={handleActionComplete}
        />
      )}
    </Card>
  );
};
