import { 
  users, type User, type InsertUser,
  integrationServices, type IntegrationService, type InsertIntegrationService,
  fleetIntegrations, type FleetIntegration, type InsertFleetIntegration,
  vehicles, type Vehicle, type InsertVehicle,
  repairOrders, fuelTransactions, safetyRecords, fleetMetrics
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Integration services
  getIntegrationServices(): Promise<IntegrationService[]>;
  getIntegrationServicesByCategory(category: string): Promise<IntegrationService[]>;
  getIntegrationService(id: number): Promise<IntegrationService | undefined>;
  createIntegrationService(service: InsertIntegrationService): Promise<IntegrationService>;
  
  // Fleet integrations
  getFleetIntegrations(userId: number): Promise<(FleetIntegration & { service: IntegrationService })[]>;
  getFleetIntegration(id: number): Promise<FleetIntegration | undefined>;
  createFleetIntegration(integration: InsertFleetIntegration): Promise<FleetIntegration>;
  updateFleetIntegrationStatus(id: number, status: string): Promise<FleetIntegration | undefined>;
  
  // Vehicles
  getVehicles(userId: number): Promise<Vehicle[]>;
  getVehicleById(id: number): Promise<Vehicle | undefined>;
  getVehicleByVehicleId(vehicleId: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, data: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  
  // Fleet metrics
  getFleetMetrics(userId: number, goalType: string): Promise<any[]>;
  createFleetMetric(metric: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Integration services
  async getIntegrationServices(): Promise<IntegrationService[]> {
    return await db.select().from(integrationServices);
  }
  
  async getIntegrationServicesByCategory(category: string): Promise<IntegrationService[]> {
    return await db.select().from(integrationServices).where(eq(integrationServices.category, category));
  }
  
  async getIntegrationService(id: number): Promise<IntegrationService | undefined> {
    const [service] = await db.select().from(integrationServices).where(eq(integrationServices.id, id));
    return service;
  }
  
  async createIntegrationService(service: InsertIntegrationService): Promise<IntegrationService> {
    const [newService] = await db.insert(integrationServices).values(service).returning();
    return newService;
  }
  
  // Fleet integrations
  async getFleetIntegrations(userId: number): Promise<(FleetIntegration & { service: IntegrationService })[]> {
    const result = await db
      .select({
        integration: fleetIntegrations,
        service: integrationServices
      })
      .from(fleetIntegrations)
      .innerJoin(integrationServices, eq(fleetIntegrations.serviceId, integrationServices.id))
      .where(eq(fleetIntegrations.userId, userId));
      
    return result.map(row => ({
      ...row.integration,
      service: row.service
    }));
  }
  
  async getFleetIntegration(id: number): Promise<FleetIntegration | undefined> {
    const [integration] = await db.select().from(fleetIntegrations).where(eq(fleetIntegrations.id, id));
    return integration;
  }
  
  async createFleetIntegration(integration: InsertFleetIntegration): Promise<FleetIntegration> {
    const [newIntegration] = await db.insert(fleetIntegrations).values(integration).returning();
    return newIntegration;
  }
  
  async updateFleetIntegrationStatus(id: number, status: string): Promise<FleetIntegration | undefined> {
    const [updatedIntegration] = await db
      .update(fleetIntegrations)
      .set({ status })
      .where(eq(fleetIntegrations.id, id))
      .returning();
    return updatedIntegration;
  }
  
  // Vehicles
  async getVehicles(userId: number): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.userId, userId));
  }
  
  async getVehicleById(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }
  
  async getVehicleByVehicleId(vehicleId: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.vehicleId, vehicleId));
    return vehicle;
  }
  
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
    return newVehicle;
  }
  
  async updateVehicle(id: number, data: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle;
  }
  
  // Fleet metrics
  async getFleetMetrics(userId: number, goalType: string): Promise<any[]> {
    return await db
      .select()
      .from(fleetMetrics)
      .where(
        and(
          eq(fleetMetrics.userId, userId),
          eq(fleetMetrics.goalType, goalType)
        )
      )
      .orderBy(desc(fleetMetrics.recordDate));
  }
  
  async createFleetMetric(metric: any): Promise<any> {
    const [newMetric] = await db.insert(fleetMetrics).values(metric).returning();
    return newMetric;
  }
}

export const storage = new DatabaseStorage();
