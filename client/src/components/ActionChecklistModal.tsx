import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  X, 
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RecommendationInterface, RecommendationStep, RecommendationStatus } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

interface ActionChecklistModalProps {
  recommendation: RecommendationInterface;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const ActionChecklistModal = ({ 
  recommendation, 
  open, 
  onOpenChange,
  onComplete
}: ActionChecklistModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [status, setStatus] = useState<RecommendationStatus>(recommendation.status);

  // Fetch recommendation steps
  const { data: steps = [], isLoading: isLoadingSteps } = useQuery<RecommendationStep[]>({
    queryKey: [`/api/recommendations/${recommendation.id}/steps`],
    queryFn: ({ queryKey }) => apiRequest(queryKey[0] as string),
    enabled: open
  });

  // Fetch available integrations for linking
  const { data: integrationServices = [] } = useQuery<any[]>({
    queryKey: ['/api/integration-services'],
    queryFn: ({ queryKey }) => apiRequest(queryKey[0] as string),
    enabled: open
  });

  // Update recommendation status
  const updateStatusMutation = useMutation<RecommendationInterface, Error, RecommendationStatus>({
    mutationFn: async (newStatus: RecommendationStatus) => {
      return apiRequest({
        url: `/api/recommendations/${recommendation.id}/status`,
        method: 'PATCH',
        body: { status: newStatus }
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

  // Handle step toggle
  const handleToggleStep = (step: RecommendationStep) => {
    updateStepMutation.mutate({
      stepId: step.id,
      isCompleted: !step.isCompleted
    });
  };

  // Update status based on checklist completion
  useEffect(() => {
    if (steps.length > 0) {
      const completedSteps = steps.filter(step => step.isCompleted).length;
      const totalSteps = steps.length;
      
      let newStatus: RecommendationStatus = 'notified';
      
      if (completedSteps === 0) {
        newStatus = 'notified';
      } else if (completedSteps === totalSteps) {
        newStatus = 'completed';
      } else {
        newStatus = 'in_progress';
      }
      
      setStatus(newStatus);
    }
  }, [steps]);

  // Handle close with status update
  const handleClose = () => {
    if (status !== recommendation.status) {
      updateStatusMutation.mutate(status);
    }
    onOpenChange(false);
    onComplete();
  };

  // Find integration service by name (case insensitive)
  const findIntegrationService = (name: string) => {
    const searchName = name.toLowerCase();
    return integrationServices.find((service: any) => 
      service.name.toLowerCase().includes(searchName)
    );
  };

  // Get the correct integration service for a step
  const getIntegrationForStep = (stepDescription: string) => {
    const integrationNames = [
      'WEX', 'Auto Integrate', 'Fleetio', 'CEI', 'ChargePoint'
    ];
    
    for (const name of integrationNames) {
      if (stepDescription.toLowerCase().includes(name.toLowerCase())) {
        return findIntegrationService(name);
      }
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {recommendation.title}
          </DialogTitle>
          <DialogDescription>
            Complete these action items to address this recommendation
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <Badge className={`
              ${recommendation.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
              ${recommendation.type === 'danger' ? 'bg-red-100 text-red-800 border-red-200' : ''}
              ${recommendation.type === 'info' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
              ${recommendation.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : ''}
            `}>
              {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
            </Badge>
            <StatusBadge status={status} />
          </div>

          <p className="text-sm text-slate-600 mb-4">{recommendation.description}</p>

          <Separator className="my-4" />

          <h3 className="text-md font-medium mb-2">Action Checklist</h3>

          {isLoadingSteps ? (
            <div className="py-4 text-center text-slate-500">Loading checklist items...</div>
          ) : steps.length === 0 ? (
            <div className="py-4 text-center text-slate-500">No checklist items available</div>
          ) : (
            <div className="space-y-3 mb-4">
              {steps.map((step) => {
                const integrationService = getIntegrationForStep(step.description);
                
                return (
                  <div 
                    key={step.id}
                    className={`p-3 rounded-md border ${
                      step.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        id={`step-${step.id}`}
                        checked={step.isCompleted}
                        onCheckedChange={() => handleToggleStep(step)}
                        className="mt-0.5 h-5 w-5 rounded-sm border-slate-300"
                      />
                      <div className="ml-3 flex-1">
                        <Label 
                          htmlFor={`step-${step.id}`}
                          className={`text-sm ${step.isCompleted ? 'line-through text-slate-500' : 'text-slate-700'}`}
                        >
                          {step.description}
                        </Label>
                        
                        {step.isCompleted && step.completedAt && (
                          <p className="text-xs text-slate-500 mt-1">
                            Completed on {new Date(step.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {integrationService && (
                      <div className="mt-2 ml-8">
                        <Link href="/integrations">
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Connect with {integrationService.name}
                            </Button>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center">
            <StatusIndicator status={status} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleClose}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: RecommendationStatus }) => {
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
      return null;
  }
};

// Status indicator component
const StatusIndicator = ({ status }: { status: RecommendationStatus }) => {
  let icon;
  let text;
  let colorClasses;

  switch (status) {
    case 'notified':
      icon = <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />;
      text = "Not Started";
      colorClasses = "text-yellow-700";
      break;
    case 'risk_accepted':
      icon = <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />;
      text = "Risk Accepted";
      colorClasses = "text-orange-700";
      break;
    case 'in_progress':
      icon = <Clock className="h-4 w-4 text-blue-600 mr-2" />;
      text = "Partially Complete";
      colorClasses = "text-blue-700";
      break;
    case 'completed':
      icon = <CheckCircle className="h-4 w-4 text-green-600 mr-2" />;
      text = "Complete";
      colorClasses = "text-green-700";
      break;
    default:
      return null;
  }

  return (
    <div className="flex items-center">
      {icon}
      <span className={`text-sm font-medium ${colorClasses}`}>{text}</span>
    </div>
  );
};

export default ActionChecklistModal;