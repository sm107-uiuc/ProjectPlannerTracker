import { pgTable, text, serial, integer, boolean, timestamp, json, real, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Recommendation status enum
export const RecommendationStatusEnum = z.enum([
  "notified", 
  "risk_accepted", 
  "in_progress", 
  "completed"
]);

export type RecommendationStatus = z.infer<typeof RecommendationStatusEnum>;

// User management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  role: text("role").default("fleet_manager"),
  companyName: text("company_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  fleetIntegrations: many(fleetIntegrations),
}));

// Integration services available
export const integrationServices = pgTable("integration_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // telematics, repair, fuel, safety, etc.
  logoUrl: text("logo_url"),
  apiEndpoint: text("api_endpoint"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrationServicesRelations = relations(integrationServices, ({ many }) => ({
  fleetIntegrations: many(fleetIntegrations),
}));

// User's integrations
export const fleetIntegrations = pgTable("fleet_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  serviceId: integer("service_id").notNull().references(() => integrationServices.id),
  status: text("status").default("pending").notNull(), // pending, active, error
  apiKey: text("api_key"),
  config: json("config"),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fleetIntegrationsRelations = relations(fleetIntegrations, ({ one }) => ({
  user: one(users, {
    fields: [fleetIntegrations.userId],
    references: [users.id],
  }),
  service: one(integrationServices, {
    fields: [fleetIntegrations.serviceId],
    references: [integrationServices.id],
  }),
}));

// Vehicle data
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  make: text("make"),
  model: text("model"),
  year: integer("year"),
  vin: text("vin"),
  licensePlate: text("license_plate"),
  driverScore: real("driver_score"),
  maintenanceScore: real("maintenance_score"),
  overallScore: real("overall_score"),
  status: text("status").default("Good"), 
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Repair order data
export const repairOrders = pgTable("repair_orders", {
  id: serial("id").primaryKey(),
  roNumber: text("ro_number").notNull().unique(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  laborCost: real("labor_cost"),
  partsCost: real("parts_cost"),
  authorizationStatus: text("authorization_status"),
  authorizerName: text("authorizer_name"),
  authorizationDate: date("authorization_date"),
  repairDate: date("repair_date"),
  componentsRepaired: text("components_repaired"),
  mechanicComments: text("mechanic_comments"),
  odometer: integer("odometer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fuel transaction data
export const fuelTransactions = pgTable("fuel_transactions", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  transactionDate: timestamp("transaction_date").notNull(),
  storeId: text("store_id"),
  storeAddress: text("store_address"),
  fuelType: text("fuel_type"),
  fuelPrice: real("fuel_price"),
  gallons: real("gallons"),
  totalAmount: real("total_amount"),
  odometerReading: integer("odometer_reading"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Driver safety records
export const safetyRecords = pgTable("safety_records", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  driverName: text("driver_name"),
  driverLicense: text("driver_license"),
  licenseExpiry: date("license_expiry"),
  licenseClass: text("license_class"),
  recordDate: date("record_date").notNull(),
  recordType: text("record_type"), // violation, accident, training
  severity: text("severity"),
  description: text("description"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fleet metrics to store calculated values for dashboard
export const fleetMetrics = pgTable("fleet_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value"),
  goalType: text("goal_type"), // safety, fuel, maintenance, utilization
  recordDate: date("record_date").notNull(),
  trend: real("trend"), // percentage change
  createdAt: timestamp("created_at").defaultNow(),
});

// Recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  goalType: text("goal_type").notNull(), // safety, fuel, maintenance, utilization
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionableInsight: text("actionable_insight"),
  potentialImpact: text("potential_impact"),
  estimatedSavings: text("estimated_savings"),
  timeToImplement: text("time_to_implement"),
  type: text("type").notNull(), // warning, danger, info, success
  icon: text("icon").notNull(),
  status: text("status").default("notified").notNull(), // notified, risk_accepted, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recommendation Checklist Items
export const recommendationSteps = pgTable("recommendation_steps", {
  id: serial("id").primaryKey(),
  recommendationId: integer("recommendation_id").notNull().references(() => recommendations.id),
  description: text("description").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for user insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  companyName: true,
});

// Schema for integration service
export const insertIntegrationServiceSchema = createInsertSchema(integrationServices).pick({
  name: true,
  description: true,
  category: true,
  logoUrl: true,
  apiEndpoint: true,
});

// Schema for fleet integration
export const insertFleetIntegrationSchema = createInsertSchema(fleetIntegrations).pick({
  userId: true,
  serviceId: true,
  status: true,
  apiKey: true,
  config: true,
});

// Schema for vehicle
export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  vehicleId: true,
  userId: true,
  make: true,
  model: true,
  year: true,
  vin: true,
  licensePlate: true,
  driverScore: true,
  maintenanceScore: true,
  overallScore: true,
  status: true,
});

// Schema for recommendations
export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  userId: true,
  goalType: true,
  title: true,
  description: true,
  actionableInsight: true,
  potentialImpact: true,
  estimatedSavings: true,
  timeToImplement: true,
  type: true,
  icon: true,
  status: true,
});

// Schema for recommendation steps
export const insertRecommendationStepSchema = createInsertSchema(recommendationSteps).pick({
  recommendationId: true,
  description: true,
  isCompleted: true,
  order: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertIntegrationService = z.infer<typeof insertIntegrationServiceSchema>;
export type IntegrationService = typeof integrationServices.$inferSelect;

export type InsertFleetIntegration = z.infer<typeof insertFleetIntegrationSchema>;
export type FleetIntegration = typeof fleetIntegrations.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

export type InsertRecommendationStep = z.infer<typeof insertRecommendationStepSchema>;
export type RecommendationStep = typeof recommendationSteps.$inferSelect;
