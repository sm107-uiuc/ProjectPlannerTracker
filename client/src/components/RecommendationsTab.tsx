import { useState } from 'react';
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
  ExternalLink
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

// Table row component for recommendations
interface RecommendationRowProps {
  recommendation: RecommendationInterface;
  onViewDetails: (rec: RecommendationInterface) => void;
  onTakeAction: (rec: RecommendationInterface, e: React.MouseEvent) => void;
  onMarkComplete: (rec: RecommendationInterface) => void;
}

const RecommendationRow = ({ 
  recommendation, 
  onViewDetails, 
  onTakeAction,
  onMarkComplete
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
  
  // Handle marking a recommendation as complete
  const handleMarkComplete = (rec: RecommendationInterface) => {
    updateStatusMutation.mutate({ 
      id: rec.id, 
      status: 'completed' 
    });
  };

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
    <Card className="shadow-md border-slate-200">
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
