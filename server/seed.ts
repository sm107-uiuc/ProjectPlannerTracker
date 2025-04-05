import { db } from "./db";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";
import { seedUpdatedData } from "./seed-data";

async function seed() {
  console.log("Starting database seeding process...");
  
  // Seed integration services - keeping only WEX, Autointegrate, Fleetio, CEI, and ChargePoint
  const services = [
    {
      name: "WEX",
      description: "Fuel card management for fleet businesses",
      category: "fuel",
      logoUrl: "https://www.wexinc.com/favicon.ico",
      apiEndpoint: "https://api.wexinc.com"
    },
    {
      name: "Autointegrate",
      description: "Standard protocol for repair data across shops",
      category: "repair",
      logoUrl: "https://example.com/autointegrate.ico",
      apiEndpoint: "https://api.autointegrate.com"
    },
    {
      name: "Fleetio",
      description: "Fleet maintenance and management software",
      category: "maintenance",
      logoUrl: "https://www.fleetio.com/favicon.ico",
      apiEndpoint: "https://api.fleetio.com"
    },
    {
      name: "CEI",
      description: "Driver safety monitoring and accident management",
      category: "safety",
      logoUrl: "https://www.cei-network.com/favicon.ico",
      apiEndpoint: "https://api.cei-network.com"
    },
    {
      name: "ChargePoint",
      description: "Electric vehicle charging infrastructure",
      category: "ev",
      logoUrl: "https://www.chargepoint.com/favicon.ico",
      apiEndpoint: "https://api.chargepoint.com"
    }
  ];

  // Insert services into database
  for (const service of services) {
    try {
      // Check if service already exists
      const existingService = await db.select().from(schema.integrationServices)
        .where(eq(schema.integrationServices.name, service.name));
      
      if (existingService.length === 0) {
        await db.insert(schema.integrationServices).values(service);
        console.log(`Created integration service: ${service.name}`);
      } else {
        console.log(`Integration service already exists: ${service.name}`);
      }
    } catch (error) {
      console.error(`Error creating service ${service.name}:`, error);
    }
  }
  
  // Seed updated vehicles and recommendations
  console.log("Seeding updated vehicles and recommendations data...");
  await seedUpdatedData();

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});