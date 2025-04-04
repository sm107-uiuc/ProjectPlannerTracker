import React from "react";
import { useQuery } from "@tanstack/react-query";
import { IntegrationCard } from "./IntegrationCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
  service: IntegrationService;
}

// Mock user ID until authentication is implemented
const MOCK_USER_ID = 1;

export const IntegrationsScreen = () => {
  // Fetch integration services
  const { data: services, isLoading: isLoadingServices } = useQuery<IntegrationService[]>({
    queryKey: ['/api/integration-services'],
  });
  
  // Fetch user's integrations
  const { data: integrations, isLoading: isLoadingIntegrations } = useQuery<
    (FleetIntegration & { service: IntegrationService })[]
  >({
    queryKey: [`/api/users/${MOCK_USER_ID}/integrations`],
  });
  
  const availableServices = services || [];
  
  // Find integration for a service
  const getIntegrationForService = (serviceId: number) => {
    return integrations?.find(integration => integration.serviceId === serviceId);
  };
  
  const isLoading = isLoadingServices || isLoadingIntegrations;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mt-2">
          Connect your fleet systems to unlock powerful insights and automation
        </p>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <Card className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      ) : (
        <>
          {/* Connected Integrations Summary */}
          {integrations && integrations.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Connected Systems</CardTitle>
                <CardDescription>Your fleet is currently connected to these systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {integrations.map(integration => (
                    integration.status === 'connected' && (
                      <div key={integration.id} className="flex items-center bg-muted/50 rounded-full px-3 py-1">
                        <img 
                          src={integration.service.logoUrl} 
                          alt={`${integration.service.name} logo`}
                          className="h-4 w-4 mr-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-logo.svg';
                          }}
                        />
                        <span className="text-sm">{integration.service.name}</span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableServices.map(service => (
              <IntegrationCard 
                key={service.id} 
                service={service} 
                integration={getIntegrationForService(service.id)}
                userId={MOCK_USER_ID}
              />
            ))}
            
            {availableServices.length === 0 && (
              <Card className="col-span-full p-6 flex flex-col items-center justify-center text-center">
                <CardTitle className="mb-2">No integrations found</CardTitle>
                <CardDescription>
                  There are no integration services available at the moment.
                </CardDescription>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};