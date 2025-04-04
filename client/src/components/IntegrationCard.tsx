import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { queryClient, apiRequest } from "../lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define interfaces locally until schema types are accessible
interface IntegrationService {
  id: number;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  apiEndpoint: string;
}

interface FleetIntegration {
  id: number;
  userId: number;
  serviceId: number;
  status: string;
  credentials: any;
  service?: IntegrationService;
}

interface IntegrationCardProps {
  service: IntegrationService;
  integration?: FleetIntegration;
  userId: number;
}

export const IntegrationCard = ({ service, integration, userId }: IntegrationCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
    integration?.status === 'connected' ? 'connected' : 'disconnected'
  );
  const [apiKey, setApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionResult, setConnectionResult] = useState<'success' | 'error' | null>(null);

  const handleConnectClick = () => {
    if (connectionStatus === 'connected') return;
    setIsDialogOpen(true);
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to connect.",
        variant: "destructive"
      });
      return;
    }
    
    setConnectionProgress(0);
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setConnectionResult(null);
    
    // Start progress animation
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      if (integration) {
        // Update existing integration
        await apiRequest(
          "PATCH",
          `/api/integrations/${integration.id}/status`, 
          { status: 'connected', credentials: { key: apiKey } }
        );
      } else {
        // Create new integration with the provided API key
        await apiRequest(
          "POST",
          `/api/users/${userId}/integrations`,
          { 
            serviceId: service.id,
            status: 'connected',
            credentials: { key: apiKey }
          }
        );
      }
      
      // Invalidate to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/integrations`] });
      
      // Complete the progress and show success
      setTimeout(() => {
        clearInterval(progressInterval);
        setConnectionProgress(100);
        setConnectionResult('success');
        
        // Close dialog and update state after a short delay
        setTimeout(() => {
          setConnectionStatus('connected');
          setIsConnecting(false);
          
          toast({
            title: "Integration Connected",
            description: `${service.name} was successfully connected to your account.`,
            variant: "default"
          });
          
          // Close the dialog after showing success for a moment
          setTimeout(() => {
            setIsDialogOpen(false);
          }, 1500);
        }, 1000);
      }, 1500);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Failed to connect integration:', error);
      setConnectionProgress(100);
      setConnectionResult('error');
      setConnectionStatus('disconnected');
      
      // Don't close dialog immediately on error, let user see the error
      setTimeout(() => {
        setIsConnecting(false);
      }, 1000);
    }
  };

  const handleCloseDialog = () => {
    if (!isConnecting) {
      setIsDialogOpen(false);
      setApiKey('');
      setConnectionProgress(0);
      setConnectionResult(null);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 pb-3">
          <CardTitle className="flex items-center gap-2">
            <img 
              src={service.logoUrl} 
              alt={`${service.name} logo`}
              className="h-6 w-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-logo.svg';
              }}
            />
            {service.name}
          </CardTitle>
          <CardDescription>
            {service.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          {/* Category information removed as requested */}
        </CardContent>
        <CardFooter className="bg-muted/20 pt-2">
          <Button 
            onClick={handleConnectClick}
            disabled={connectionStatus === 'connected'}
            className="w-full"
            variant={connectionStatus === 'connected' ? "outline" : "default"}
          >
            {connectionStatus === 'connected' && (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            )}
            {connectionStatus === 'connected' ? 'Connected' : 'Connect'}
          </Button>
        </CardFooter>
      </Card>

      {/* API Key Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {service.name}</DialogTitle>
            <DialogDescription>
              Enter your API key to connect your {service.name} account.
            </DialogDescription>
          </DialogHeader>
          
          {connectionResult === null ? (
            <>
              {isConnecting ? (
                <div className="py-6 space-y-4">
                  <Progress value={connectionProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    Connecting to {service.name}...
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your API key will be securely stored and can be revoked at any time.
                    </p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseDialog}
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConnect}
                  disabled={isConnecting || !apiKey.trim()}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : connectionResult === 'success' ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center font-medium">Successfully connected!</p>
              <p className="text-center text-sm text-muted-foreground">
                Your {service.name} account has been successfully connected.
              </p>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-center font-medium">Connection failed</p>
              <p className="text-center text-sm text-muted-foreground">
                There was a problem connecting to {service.name}. Please check your API key and try again.
              </p>
              <Button onClick={handleCloseDialog} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};