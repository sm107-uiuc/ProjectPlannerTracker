import { db } from "./db";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  // Seed integration services
  const services = [
    {
      name: "Geotab",
      description: "Real-time telematics and GPS tracking for your fleet",
      category: "telematics",
      logoUrl: "https://www.geotab.com/favicon.ico",
      apiEndpoint: "https://api.geotab.com"
    },
    {
      name: "Samsara",
      description: "Connected operations cloud for fleet management",
      category: "telematics",
      logoUrl: "https://www.samsara.com/favicon.ico",
      apiEndpoint: "https://api.samsara.com"
    },
    {
      name: "WEX",
      description: "Fuel card management for fleet businesses",
      category: "fuel",
      logoUrl: "https://www.wexinc.com/favicon.ico",
      apiEndpoint: "https://api.wexinc.com"
    },
    {
      name: "FleetCor",
      description: "Payment solutions for fuel and maintenance management",
      category: "fuel",
      logoUrl: "https://www.fleetcor.com/favicon.ico",
      apiEndpoint: "https://api.fleetcor.com"
    },
    {
      name: "Verra Mobility",
      description: "Tolling, violation and title & registration solutions",
      category: "registration",
      logoUrl: "https://www.verramobility.com/favicon.ico",
      apiEndpoint: "https://api.verramobility.com"
    },
    {
      name: "Autointegrate",
      description: "Standard protocol for repair data across shops",
      category: "repair",
      logoUrl: "https://example.com/autointegrate.ico",
      apiEndpoint: "https://api.autointegrate.com"
    },
    {
      name: "CEI",
      description: "Driver safety monitoring and accident management",
      category: "safety",
      logoUrl: "https://www.cei-network.com/favicon.ico",
      apiEndpoint: "https://api.cei-network.com"
    },
    {
      name: "Samba Safety",
      description: "Driver risk management and training solutions",
      category: "safety",
      logoUrl: "https://www.sambasafety.com/favicon.ico",
      apiEndpoint: "https://api.sambasafety.com"
    },
    {
      name: "ChargePoint",
      description: "Electric vehicle charging infrastructure",
      category: "ev",
      logoUrl: "https://www.chargepoint.com/favicon.ico",
      apiEndpoint: "https://api.chargepoint.com"
    },
    {
      name: "EVGO",
      description: "Fast charging network for electric vehicles",
      category: "ev",
      logoUrl: "https://www.evgo.com/favicon.ico",
      apiEndpoint: "https://api.evgo.com"
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

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});