import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { queryClient, apiRequest } from "../lib/queryClient";

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

  const handleConnect = async () => {
    if (connectionStatus === 'connected') return;
    
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      if (integration) {
        // Update existing integration
        await apiRequest(
          "PATCH",
          `/api/integrations/${integration.id}/status`, 
          { status: 'connected' }
        );
      } else {
        // Create new integration
        await apiRequest(
          "POST",
          `/api/users/${userId}/integrations`,
          { 
            serviceId: service.id,
            status: 'connected',
            credentials: { key: 'demo-api-key' } // In real app, get from form
          }
        );
      }
      
      // Invalidate to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/integrations`] });
      
      // Simulate API connection delay
      setTimeout(() => {
        setConnectionStatus('connected');
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to connect integration:', error);
      setConnectionStatus('disconnected');
      setIsConnecting(false);
    }
  };

  return (
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
        <p className="text-sm text-muted-foreground">
          Category: <span className="capitalize">{service.category}</span>
        </p>
      </CardContent>
      <CardFooter className="bg-muted/20 pt-2">
        <Button 
          onClick={handleConnect}
          disabled={isConnecting || connectionStatus === 'connected'}
          className="w-full"
          variant={connectionStatus === 'connected' ? "outline" : "default"}
        >
          {isConnecting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {connectionStatus === 'connected' && !isConnecting && (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          )}
          {connectionStatus === 'connected' ? 'Connected' : isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
};