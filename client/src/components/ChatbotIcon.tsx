import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Goal } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ChatMessage {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotIconProps {
  goal: Goal;
}

const ChatbotIcon = ({ goal }: ChatbotIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample greeting message based on goal
  useEffect(() => {
    const greetingMessages: Record<Goal, string> = {
      'safety': "Hi there! I'm your fleet safety assistant. How can I help optimize your fleet's safety performance?",
      'fuel': "Hello! I'm your fuel efficiency expert. How can I help you reduce fuel costs?",
      'maintenance': "Hi! I'm your fleet maintenance advisor. How can I help keep your vehicles in top condition?",
      'utilization': "Welcome! I'm your fleet utilization specialist. How can I help maximize your fleet's usage?"
    };
    
    const initialMessage: ChatMessage = {
      id: 1,
      content: greetingMessages[goal],
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
  }, [goal]);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Use Perplexity AI API to get responses if available, or fallback to local responses
  const sendChatMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      try {
        // First check if we have the Perplexity API key
        const response = await apiRequest('/api/ai/has-key');
        
        // If we have a Perplexity API key
        if (response.hasKey) {
          return await apiRequest('/api/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
              goal,
              message
            })
          });
        } else {
          // Fallback to pre-defined responses
          return { content: generateLocalResponse(message, goal) };
        }
      } catch (error) {
        // Fallback to pre-defined responses if API request fails
        return { content: generateLocalResponse(message, goal) };
      }
    },
    onSuccess: (data) => {
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        content: data.content,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        content: "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  });
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setMessage('');
    
    // Send to Perplexity API or fallback
    sendChatMessageMutation.mutate(message);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const generateLocalResponse = (message: string, goal: Goal): string => {
    // Simple fallback response system based on keywords in the user's message
    const msg = message.toLowerCase();
    
    // Goal-specific keyword responses
    if (goal === 'safety') {
      if (msg.includes('accident') || msg.includes('crash')) {
        return "Accidents can significantly impact fleet safety scores. I recommend implementing defensive driving training and establishing a clear accident reporting protocol.";
      } else if (msg.includes('training') || msg.includes('driver')) {
        return "Regular safety training can reduce accidents by up to 40%. Consider implementing monthly safety briefings and incentivize drivers who maintain clean records.";
      } else if (msg.includes('score') || msg.includes('improve')) {
        return "To improve your safety score, focus on reducing harsh driving events, implementing regular vehicle inspections, and ensuring all drivers complete safety training programs.";
      }
    } else if (goal === 'fuel') {
      if (msg.includes('consumption') || msg.includes('usage')) {
        return "To reduce fuel consumption, ensure proper tire inflation, remove excess vehicle weight, and implement route optimization to minimize idle time and unnecessary mileage.";
      } else if (msg.includes('cost') || msg.includes('saving')) {
        return "Fuel costs can be reduced by implementing an eco-driving program, monitoring driver behavior for excessive idling, and considering alternative fuel options for applicable vehicles in your fleet.";
      } else if (msg.includes('efficiency') || msg.includes('improve')) {
        return "Improve fuel efficiency by scheduling regular maintenance, optimizing routes, and training drivers on economical driving techniques like smooth acceleration and avoiding excessive idling.";
      }
    } else if (goal === 'maintenance') {
      if (msg.includes('schedule') || msg.includes('plan')) {
        return "A proactive maintenance schedule should include regular oil changes, tire rotations, and fluid checks. I recommend setting up automated reminders based on mileage or time intervals.";
      } else if (msg.includes('cost') || msg.includes('expense')) {
        return "To reduce maintenance costs, focus on preventative maintenance, establish relationships with reliable service providers, and consider bulk parts purchasing for common replacement items.";
      } else if (msg.includes('downtime') || msg.includes('reduce')) {
        return "Minimize vehicle downtime by implementing predictive maintenance using telematics data, scheduling maintenance during off-hours, and maintaining a small pool of backup vehicles.";
      }
    } else if (goal === 'utilization') {
      if (msg.includes('improve') || msg.includes('increase')) {
        return "Improve utilization by implementing vehicle sharing programs, establishing clear reservation systems, and right-sizing your fleet based on actual usage patterns.";
      } else if (msg.includes('tracking') || msg.includes('monitor')) {
        return "Effective utilization tracking requires telematics systems that monitor vehicle usage time, idle time, and mileage. This data should be reviewed weekly to identify underutilized assets.";
      } else if (msg.includes('metric') || msg.includes('measure')) {
        return "Key utilization metrics include hours/miles per day, percentage of time in use, and idle time. Aim for at least 80% utilization rate for most fleet vehicles.";
      }
    }
    
    // General responses
    if (msg.includes('hello') || msg.includes('hi ')) {
      return `Hello! I'm your ${goal} performance advisor. How can I help you today?`;
    } else if (msg.includes('thank')) {
      return "You're welcome! Let me know if you need anything else regarding your fleet's performance.";
    } else if (msg.includes('report') || msg.includes('analytics')) {
      return `Our ${goal} analytics dashboard provides comprehensive reporting on your fleet's performance. You can access daily, weekly, and monthly trends from the Reports section.`;
    } else if (msg.includes('integration') || msg.includes('connect')) {
      return "We support integrations with major fleet management services like WEX, Auto Integrate, Fleetio, CEI, and ChargePoint. You can set these up in the Integrations section.";
    } else if (msg.includes('recommend') || msg.includes('suggestion')) {
      return `Based on your fleet's current ${goal} metrics, I recommend checking the Recommendations tab for personalized action items that can help improve your performance.`;
    }
    
    // Default response
    return `I understand you're asking about ${goal} performance. Could you provide more specific details about what you'd like to know?`;
  };
  
  return (
    <>
      {/* Chatbot Icon */}
      <button 
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-5 w-80 h-96 flex flex-col shadow-xl z-50">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-md font-medium">Fleet Assistant</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 text-gray-800">
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <div className="flex items-center space-x-2 w-full">
              <Textarea 
                placeholder="Type a message..." 
                className="min-h-[40px] resize-none flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatbotIcon;