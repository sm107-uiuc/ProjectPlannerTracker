import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, CheckCircle2, AlertCircle, Clock, ShieldAlert, Link as LinkIcon } from 'lucide-react';
import { RecommendationInterface, RecommendationStep, RecommendationStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';
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
  const { data: steps = [], isLoading: isLoadingSteps } = useQuery<RecommendationStep[]>({
    queryKey: [`/api/recommendations/${recommendation.id}/steps`],
    queryFn: ({ queryKey }) => apiRequest(queryKey[0] as string)
  });

  // Update recommendation status
  const updateStatusMutation = useMutation<RecommendationInterface, Error, RecommendationStatus>({
    mutationFn: async (status: RecommendationStatus) => {
      return apiRequest({
        url: `/api/recommendations/${recommendation.id}/status`,
        method: 'PATCH',
        body: { status }
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
  const updateStepMutation = useMutation<
    RecommendationStep, 
    Error, 
    { stepId: number; isCompleted: boolean }
  >({
    mutationFn: async ({ stepId, isCompleted }) => {
      return apiRequest({
        url: `/api/recommendation-steps/${stepId}/complete`,
        method: 'PATCH',
        body: { isCompleted }
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

  // Status Checklist Item Component
  const StatusChecklistItem = ({ status, label, isActive, onClick }: { 
    status: RecommendationStatus, 
    label: string, 
    isActive: boolean, 
    onClick: () => void 
  }) => {
    const getBackgroundColor = () => {
      if (!isActive) return 'bg-white';
      
      switch (status) {
        case 'notified': return 'bg-yellow-50';
        case 'risk_accepted': return 'bg-orange-50';
        case 'in_progress': return 'bg-blue-50';
        case 'completed': return 'bg-green-50';
        default: return 'bg-white';
      }
    };
    
    const getBorderColor = () => {
      if (!isActive) return 'border-gray-200';
      
      switch (status) {
        case 'notified': return 'border-yellow-200';
        case 'risk_accepted': return 'border-orange-200';
        case 'in_progress': return 'border-blue-200';
        case 'completed': return 'border-green-200';
        default: return 'border-gray-200';
      }
    };
    
    return (
      <div 
        className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${getBackgroundColor()} ${getBorderColor()}`}
        onClick={onClick}
      >
        <div className={`flex-shrink-0 h-5 w-5 mr-3 flex items-center justify-center ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
          {getStatusIcon(status)}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{label}</p>
          <p className="text-xs text-slate-500">
            {status === 'notified' && 'Issue identified and awaiting action'}
            {status === 'risk_accepted' && 'Risk acknowledged, no immediate action'}
            {status === 'in_progress' && 'Currently being addressed'}
            {status === 'completed' && 'All required actions completed'}
          </p>
        </div>
        {isActive && (
          <div className="ml-2 h-5 w-5 flex-shrink-0 flex items-center justify-center">
            <CheckCircle2 className={`h-4 w-4 ${status === 'completed' ? 'text-green-500' : 'text-slate-500'}`} />
          </div>
        )}
      </div>
    );
  };

  const renderStatusOptions = () => {
    const statuses: { value: RecommendationStatus; label: string }[] = [
      { value: 'notified', label: 'NOTIFIED' },
      { value: 'risk_accepted', label: 'RISK ACCEPTED' },
      { value: 'in_progress', label: 'IN PROGRESS' },
      { value: 'completed', label: 'COMPLETED' }
    ];

    return (
      <div className="space-y-2 mt-4">
        {statuses.map(status => (
          <StatusChecklistItem
            key={status.value}
            status={status.value}
            label={status.label}
            isActive={selectedStatus === status.value}
            onClick={() => handleStatusChange(status.value)}
          />
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
        
        {/* Actionable Insights Section */}
        {(recommendation.actionableInsight || recommendation.potentialImpact || recommendation.estimatedSavings || recommendation.timeToImplement) && (
          <>
            <div className="mb-4 bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-3">Actionable Insights</h3>
              <div className="space-y-3">
                {recommendation.actionableInsight && (
                  <div>
                    <h4 className="text-xs font-semibold text-blue-700">ACTION STRATEGY</h4>
                    <p className="text-sm text-slate-700">{recommendation.actionableInsight}</p>
                  </div>
                )}
                
                {recommendation.potentialImpact && (
                  <div>
                    <h4 className="text-xs font-semibold text-blue-700">POTENTIAL IMPACT</h4>
                    <p className="text-sm text-slate-700">{recommendation.potentialImpact}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-6">
                  {recommendation.estimatedSavings && (
                    <div>
                      <h4 className="text-xs font-semibold text-blue-700">ESTIMATED SAVINGS</h4>
                      <p className="text-sm text-slate-700">{recommendation.estimatedSavings}</p>
                    </div>
                  )}
                  
                  {recommendation.timeToImplement && (
                    <div>
                      <h4 className="text-xs font-semibold text-blue-700">TIME TO IMPLEMENT</h4>
                      <p className="text-sm text-slate-700">{recommendation.timeToImplement}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
          </>
        )}
        
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
      <CardFooter className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 py-3 px-6">
        <Link href="/integrations">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <LinkIcon className="h-4 w-4 mr-2" />
            Connect Integration
          </Button>
        </Link>
        
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