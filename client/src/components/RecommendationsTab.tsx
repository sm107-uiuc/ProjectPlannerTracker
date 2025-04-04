import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Search } from 'lucide-react';
import { RecommendationInterface, Goal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import RecommendationDetail from './RecommendationDetail';
import { goalDisplayText } from '@/lib/mockData';

interface RecommendationsTabProps {
  selectedGoal: Goal;
}

export const RecommendationsTab = ({ selectedGoal }: RecommendationsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationInterface | null>(null);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'notified':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'risk_accepted':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'notified':
        return 'Notified';
      case 'risk_accepted':
        return 'Risk Accepted';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
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
                Notified ({getCountByStatus('notified')})
              </TabsTrigger>
              <TabsTrigger 
                value="in_progress" 
                className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                In Progress ({getCountByStatus('in_progress')})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Completed ({getCountByStatus('completed')})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content for all tabs */}
          <TabsContent value="all" className="m-0">
            <div className="divide-y divide-slate-200">
              {isLoading ? (
                <div className="py-8 text-center text-slate-500">Loading recommendations...</div>
              ) : filteredRecommendations.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No recommendations found</div>
              ) : (
                filteredRecommendations.map((rec: RecommendationInterface) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-800">{rec.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(rec.status)}`}>
                          {getStatusText(rec.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.description}</p>
                      <div className="mt-2 text-xs text-slate-400">
                        Created {new Date(rec.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="notified" className="m-0">
            <div className="divide-y divide-slate-200">
              {filteredRecommendations.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No notified recommendations</div>
              ) : (
                filteredRecommendations.map((rec: RecommendationInterface) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-800">{rec.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(rec.status)}`}>
                          {getStatusText(rec.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.description}</p>
                      <div className="mt-2 text-xs text-slate-400">
                        Created {new Date(rec.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="in_progress" className="m-0">
            <div className="divide-y divide-slate-200">
              {filteredRecommendations.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No in-progress recommendations</div>
              ) : (
                filteredRecommendations.map((rec: RecommendationInterface) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-800">{rec.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(rec.status)}`}>
                          {getStatusText(rec.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.description}</p>
                      <div className="mt-2 text-xs text-slate-400">
                        Created {new Date(rec.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="m-0">
            <div className="divide-y divide-slate-200">
              {filteredRecommendations.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No completed recommendations</div>
              ) : (
                filteredRecommendations.map((rec: RecommendationInterface) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-800">{rec.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(rec.status)}`}>
                          {getStatusText(rec.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.description}</p>
                      <div className="mt-2 text-xs text-slate-400">
                        Created {new Date(rec.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendationsTab;