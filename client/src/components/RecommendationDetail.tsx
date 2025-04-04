import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { RecommendationInterface, RecommendationStep, RecommendationStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RecommendationDetailProps {
  recommendation: RecommendationInterface;
  onBack: () => void;
}

export const RecommendationDetail = ({ recommendation, onBack }: RecommendationDetailProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<RecommendationStatus>(recommendation.status);

  // Fetch recommendation steps
  const { data: steps = [], isLoading: isLoadingSteps } = useQuery({
    queryKey: [`/api/recommendations/${recommendation.id}/steps`],
    queryFn: ({ queryKey }) => apiRequest(queryKey[0])
  });

  // Update recommendation status
  const updateStatusMutation = useMutation({
    mutationFn: async (status: RecommendationStatus) => {
      return apiRequest(`/api/recommendations/${recommendation.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: 'Recommendation status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/recommendations/${recommendation.id}`] });
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

  // Update step completion status
  const updateStepMutation = useMutation({
    mutationFn: async ({ stepId, isCompleted }: { stepId: number; isCompleted: boolean }) => {
      return apiRequest(`/api/recommendation-steps/${stepId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recommendations/${recommendation.id}/steps`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update step status. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const getStatusBadge = (status: RecommendationStatus) => {
    switch (status) {
      case 'notified':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Notified</Badge>;
      case 'risk_accepted':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Risk Accepted</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: RecommendationStatus) => {
    switch (status) {
      case 'notified':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'risk_accepted':
        return <ShieldAlert className="h-5 w-5 text-orange-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleToggleStep = (step: RecommendationStep) => {
    updateStepMutation.mutate({
      stepId: step.id,
      isCompleted: !step.isCompleted
    });
  };

  const handleStatusChange = (status: RecommendationStatus) => {
    setSelectedStatus(status);
    updateStatusMutation.mutate(status);
  };

  const renderStatusOptions = () => {
    const statuses: { value: RecommendationStatus; label: string }[] = [
      { value: 'notified', label: 'Notified' },
      { value: 'risk_accepted', label: 'Risk Accepted' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ];

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {statuses.map(status => (
          <Button
            key={status.value}
            variant={selectedStatus === status.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(status.value)}
            className={selectedStatus === status.value ? "" : "hover:bg-slate-100"}
          >
            {getStatusIcon(status.value)}
            <span className="ml-1">{status.label}</span>
          </Button>
        ))}
      </div>
    );
  };

  const allStepsCompleted = steps.length > 0 && steps.every((step: RecommendationStep) => step.isCompleted);

  return (
    <Card className="shadow-lg border-slate-200 overflow-hidden">
      <CardHeader className="bg-slate-50 pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <Badge className={`${getTypeColor(recommendation.type)} px-2 py-1`}>
              {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
            </Badge>
          </div>
          <div className="w-8 h-8"></div> {/* Spacer for balance */}
        </div>
        <CardTitle className="text-center mt-2 text-lg font-semibold text-slate-800">
          {recommendation.title}
        </CardTitle>
        <div className="flex justify-center mt-1">
          {getStatusBadge(recommendation.status)}
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <p className="text-slate-600 mb-4">{recommendation.description}</p>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-slate-800 mb-2">Status</h3>
          {renderStatusOptions()}
        </div>

        <Separator className="my-4" />
        
        <div>
          <h3 className="text-sm font-medium text-slate-800 mb-3">Action Steps</h3>
          {isLoadingSteps ? (
            <div className="py-4 text-center text-slate-500">Loading steps...</div>
          ) : steps.length === 0 ? (
            <div className="py-4 text-center text-slate-500">No steps available</div>
          ) : (
            <div className="space-y-3">
              {steps.map((step: RecommendationStep) => (
                <div 
                  key={step.id} 
                  className={`flex items-start p-3 rounded-md border ${
                    step.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <div 
                    className={`flex-shrink-0 h-5 w-5 mr-3 mt-0.5 rounded-full border ${
                      step.isCompleted 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-slate-300 bg-white'
                    } flex items-center justify-center cursor-pointer`}
                    onClick={() => handleToggleStep(step)}
                  >
                    {step.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.isCompleted ? 'text-slate-700' : 'text-slate-600'}`}>
                      {step.description}
                    </p>
                    {step.isCompleted && step.completedAt && (
                      <p className="text-xs text-slate-500 mt-1">
                        Completed on {new Date(step.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end bg-slate-50 py-3 px-6">
        {allStepsCompleted && recommendation.status !== 'completed' && (
          <Button 
            onClick={() => handleStatusChange('completed')}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecommendationDetail;