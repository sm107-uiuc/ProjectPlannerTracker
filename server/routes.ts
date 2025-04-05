import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertIntegrationServiceSchema, 
  insertFleetIntegrationSchema,
  insertVehicleSchema,
  insertRecommendationSchema,
  insertRecommendationStepSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Could not create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch user" });
    }
  });

  // Integration services routes
  app.get("/api/integration-services", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let services;
      
      if (category) {
        services = await storage.getIntegrationServicesByCategory(category);
      } else {
        services = await storage.getIntegrationServices();
      }
      
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch integration services" });
    }
  });

  app.post("/api/integration-services", async (req, res) => {
    try {
      const serviceData = insertIntegrationServiceSchema.parse(req.body);
      const service = await storage.createIntegrationService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Could not create integration service" });
    }
  });

  // Fleet integrations routes
  app.get("/api/users/:userId/integrations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const integrations = await storage.getFleetIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch fleet integrations" });
    }
  });

  app.post("/api/users/:userId/integrations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const integrationData = insertFleetIntegrationSchema.parse({
        ...req.body,
        userId
      });
      
      const integration = await storage.createFleetIntegration(integrationData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Could not create fleet integration" });
    }
  });

  app.patch("/api/integrations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status must be provided" });
      }
      
      const integration = await storage.updateFleetIntegrationStatus(id, status);
      
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
      
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: "Could not update integration status" });
    }
  });

  // Vehicle routes
  app.get("/api/users/:userId/vehicles", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const vehicles = await storage.getVehicles(userId);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch vehicles" });
    }
  });

  app.post("/api/users/:userId/vehicles", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const vehicleData = insertVehicleSchema.parse({
        ...req.body,
        userId
      });
      
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Could not create vehicle" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicleById(id);
      
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      const vehicle = await storage.updateVehicle(id, data);
      
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Could not update vehicle" });
    }
  });

  // Fleet metrics routes
  app.get("/api/users/:userId/metrics", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goalType = req.query.goalType as string;
      
      if (!goalType) {
        return res.status(400).json({ error: "Goal type must be provided" });
      }
      
      const metrics = await storage.getFleetMetrics(userId, goalType);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch fleet metrics" });
    }
  });

  app.post("/api/users/:userId/metrics", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const metricData = {
        ...req.body,
        userId
      };
      
      const metric = await storage.createFleetMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(500).json({ error: "Could not create fleet metric" });
    }
  });

  // Recommendations routes
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goalType = req.query.goalType as string | undefined;
      
      const recommendations = await storage.getRecommendations(userId, goalType);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch recommendations" });
    }
  });

  app.get("/api/recommendations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recommendation = await storage.getRecommendationById(id);
      
      if (!recommendation) {
        return res.status(404).json({ error: "Recommendation not found" });
      }
      
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch recommendation" });
    }
  });

  app.post("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendationData = insertRecommendationSchema.parse({
        ...req.body,
        userId
      });
      
      const recommendation = await storage.createRecommendation(recommendationData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Could not create recommendation" });
    }
  });

  app.patch("/api/recommendations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status must be provided" });
      }
      
      const recommendation = await storage.updateRecommendationStatus(id, status);
      
      if (!recommendation) {
        return res.status(404).json({ error: "Recommendation not found" });
      }
      
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ error: "Could not update recommendation status" });
    }
  });

  // Recommendation Steps routes
  app.get("/api/recommendations/:recommendationId/steps", async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.recommendationId);
      const steps = await storage.getRecommendationSteps(recommendationId);
      res.json(steps);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch recommendation steps" });
    }
  });

  app.post("/api/recommendations/:recommendationId/steps", async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.recommendationId);
      const stepData = insertRecommendationStepSchema.parse({
        ...req.body,
        recommendationId
      });
      
      const step = await storage.createRecommendationStep(stepData);
      res.status(201).json(step);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Could not create recommendation step" });
    }
  });

  app.patch("/api/recommendation-steps/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isCompleted } = req.body;
      
      if (typeof isCompleted !== 'boolean') {
        return res.status(400).json({ error: "isCompleted must be a boolean" });
      }
      
      const step = await storage.updateRecommendationStepStatus(id, isCompleted);
      
      if (!step) {
        return res.status(404).json({ error: "Recommendation step not found" });
      }
      
      res.json(step);
    } catch (error) {
      res.status(500).json({ error: "Could not update recommendation step status" });
    }
  });

  // AI chatbot routes
  app.get('/api/ai/has-key', async (req, res) => {
    try {
      // Check if Perplexity API key exists in environment variables
      const hasKey = process.env.PERPLEXITY_API_KEY ? true : false;
      res.json({ hasKey });
    } catch (error) {
      console.error('Error checking Perplexity API key:', error);
      res.status(500).json({ error: 'Server error checking API key status' });
    }
  });
  
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, goal } = req.body;
      
      if (!message || !goal) {
        return res.status(400).json({ error: 'Message and goal are required' });
      }
      
      // Check if we have the Perplexity API key
      if (!process.env.PERPLEXITY_API_KEY) {
        return res.status(503).json({ 
          error: 'Perplexity API key not configured',
          content: 'I cannot provide an intelligent response at this time. Please set up the Perplexity API key.'
        });
      }
      
      // Prepare the system message based on the selected goal
      const systemMessages = {
        safety: "You are an expert fleet safety advisor. Provide helpful, concise advice about fleet safety, accident prevention, driver training, and safety metrics. Your answers should be practical and actionable for fleet managers.",
        fuel: "You are an expert in fleet fuel efficiency. Provide helpful, concise advice about fuel optimization, eco-driving, fuel cost reduction, and related metrics. Your answers should be practical and actionable for fleet managers.",
        maintenance: "You are an expert in fleet maintenance. Provide helpful, concise advice about vehicle maintenance, downtime reduction, preventative maintenance, and related metrics. Your answers should be practical and actionable for fleet managers.",
        utilization: "You are an expert in fleet utilization. Provide helpful, concise advice about maximizing vehicle usage, optimizing routes, right-sizing fleets, and related metrics. Your answers should be practical and actionable for fleet managers."
      };
      
      const systemMessage = systemMessages[goal] || systemMessages.safety;
      
      // Call the Perplexity API
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: systemMessage
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 150,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Perplexity API error:', errorData);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      res.json({ content });
    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      res.status(500).json({ 
        error: 'Failed to get AI response',
        content: 'I encountered an error while processing your request. Please try again later.'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
