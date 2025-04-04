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

  const httpServer = createServer(app);

  return httpServer;
}
