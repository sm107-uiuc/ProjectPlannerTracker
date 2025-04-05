import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RecommendationInterface, Goal } from "@/lib/types";
import { AlertTriangle, AlertCircle, Info, CheckCircle, MessageSquare, Zap, Gauge } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

interface RecommendationsCardProps {
  goalName: string;
  selectedGoal: Goal;
}

const RecommendationsCard = ({ goalName, selectedGoal }: RecommendationsCardProps) => {
  // Fetch the top 3 recommendations from API
  const { data: recommendations = [] } = useQuery({
    queryKey: [`/api/users/1/recommendations`, selectedGoal],
    queryFn: ({ queryKey }) => {
      const baseUrl = queryKey[0] as string;
      const goalType = queryKey[1] as string;
      const url = goalType ? `${baseUrl}?goalType=${goalType}` : baseUrl;
      return apiRequest(url);
    }
  });

  // Only show the top 3 highest priority recommendations
  const topRecommendations = recommendations.slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      case 'opportunity':
        return <Zap className="w-4 h-4" />;
      case 'improvement':
        return <Gauge className="w-4 h-4" />;
      case 'compliance':
        return <CheckCircle className="w-4 h-4" />;
      case 'info':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-600';
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'opportunity':
        return 'bg-green-100 text-green-600';
      case 'improvement':
        return 'bg-purple-100 text-purple-600';
      case 'compliance':
        return 'bg-blue-100 text-blue-600';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Key Recommendations</h2>
          <Button variant="link" size="sm" className="text-blue-600">View All</Button>
        </div>
        
        {recommendations.length === 0 ? (
          <p className="text-sm text-gray-500">Loading recommendations...</p>
        ) : (
          <ul className="space-y-4">
            {topRecommendations.map((rec: RecommendationInterface) => (
              <li key={rec.id} className="flex items-start">
                <div className={`rounded-full ${getColorClass(rec.type)} p-1 mr-3 mt-0.5`}>
                  {getTypeIcon(rec.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-800">{rec.title}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
