import { seedUpdatedData } from "./seed-data";

async function runSeed() {
  try {
    console.log("Starting updated data seeding process...");
    await seedUpdatedData();
    console.log("Seeding process completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding process failed:", error);
    process.exit(1);
  }
}

runSeed();