import { db } from "./db";
import * as schema from "@shared/schema";
import { users, vehicles, recommendations, recommendationSteps, InsertRecommendationStep } from "@shared/schema";

export async function seedUpdatedData() {
  try {
    // First, ensure a user exists
    const existingUsers = await db.query.users.findMany();
    let userId = 1;
    
    if (existingUsers.length === 0) {
      console.log("Creating user for updated data...");
      const [newUser] = await db
        .insert(users)
        .values({
          username: "fleetadmin",
          password: "password123",
          displayName: "Fleet Admin",
          companyName: "Fleet Corp"
        })
        .returning();
      userId = newUser.id;
      console.log(`Created user with ID: ${userId}`);
    } else {
      userId = existingUsers[0].id;
      console.log(`Using existing user with ID: ${userId}`);
    }

    // Create vehicles with real VINs
    const vehicles = [
      // Safety-focused vehicles
      { vehicleId: "1FTEW1E50LFB43025", userId, vin: "1FTEW1E50LFB43025", make: "Ford", model: "F-150", year: 2023, driverScore: 68, maintenanceScore: 82, overallScore: 74, status: "Needs Review" },
      { vehicleId: "1C4RJFBG5LC123456", userId, vin: "1C4RJFBG5LC123456", make: "Jeep", model: "Grand Cherokee", year: 2024, driverScore: 72, maintenanceScore: 84, overallScore: 78, status: "Needs Review" },
      { vehicleId: "2T1BURHE8KC123789", userId, vin: "2T1BURHE8KC123789", make: "Toyota", model: "Camry", year: 2023, driverScore: 65, maintenanceScore: 79, overallScore: 71, status: "Needs Review" },
      { vehicleId: "1GCUYDED9LZ217654", userId, vin: "1GCUYDED9LZ217654", make: "Chevrolet", model: "Silverado", year: 2024, driverScore: 55, maintenanceScore: 75, overallScore: 63, status: "Action Required" },
      { vehicleId: "1N4BL4BV5LC253012", userId, vin: "1N4BL4BV5LC253012", make: "Nissan", model: "Altima", year: 2023, driverScore: 74, maintenanceScore: 88, overallScore: 80, status: "Good" },
      
      // Maintenance-focused vehicles
      { vehicleId: "JTMRFREV5KJ019283", userId, vin: "JTMRFREV5KJ019283", make: "Toyota", model: "RAV4", year: 2024, driverScore: 86, maintenanceScore: 68, overallScore: 76, status: "Needs Review" },
      { vehicleId: "1FMSK8DH5LGC76513", userId, vin: "1FMSK8DH5LGC76513", make: "Ford", model: "Explorer", year: 2024, driverScore: 82, maintenanceScore: 62, overallScore: 70, status: "Needs Review" },
      { vehicleId: "1G1ZD5ST6LF112233", userId, vin: "1G1ZD5ST6LF112233", make: "Chevrolet", model: "Malibu", year: 2023, driverScore: 88, maintenanceScore: 70, overallScore: 78, status: "Needs Review" },
      { vehicleId: "2HKRW1H59MH445566", userId, vin: "2HKRW1H59MH445566", make: "Honda", model: "CR-V", year: 2023, driverScore: 84, maintenanceScore: 65, overallScore: 73, status: "Needs Review" },
      { vehicleId: "4S4BTACC8L3778899", userId, vin: "4S4BTACC8L3778899", make: "Subaru", model: "Outback", year: 2024, driverScore: 90, maintenanceScore: 69, overallScore: 78, status: "Needs Review" },
      
      // Emissions/EV vehicles
      { vehicleId: "5YJ3E1EA8LF778901", userId, vin: "5YJ3E1EA8LF778901", make: "Tesla", model: "Model 3", year: 2024, driverScore: 92, maintenanceScore: 88, overallScore: 90, status: "Good" },
      { vehicleId: "1N4AZ1CP8LC667788", userId, vin: "1N4AZ1CP8LC667788", make: "Nissan", model: "Leaf", year: 2023, driverScore: 85, maintenanceScore: 80, overallScore: 82, status: "Good" },
      { vehicleId: "1G1FY6S08L4112233", userId, vin: "1G1FY6S08L4112233", make: "Chevrolet", model: "Bolt", year: 2024, driverScore: 88, maintenanceScore: 82, overallScore: 85, status: "Good" },
      { vehicleId: "JTDKARFU8L3998877", userId, vin: "JTDKARFU8L3998877", make: "Toyota", model: "Prius", year: 2023, driverScore: 86, maintenanceScore: 78, overallScore: 81, status: "Good" },
      { vehicleId: "KM8K33A64MU334455", userId, vin: "KM8K33A64MU334455", make: "Hyundai", model: "Kona Electric", year: 2024, driverScore: 89, maintenanceScore: 81, overallScore: 84, status: "Good" },
      
      // Utilization/Efficiency focused vehicles
      { vehicleId: "1FTYE1YM7LKA56789", userId, vin: "1FTYE1YM7LKA56789", make: "Ford", model: "Transit", year: 2023, driverScore: 78, maintenanceScore: 75, overallScore: 77, status: "Needs Review" },
      { vehicleId: "WD3PE7CD0KP223344", userId, vin: "WD3PE7CD0KP223344", make: "Mercedes", model: "Sprinter", year: 2024, driverScore: 82, maintenanceScore: 79, overallScore: 80, status: "Good" },
      { vehicleId: "1GCWGAFG4L1234567", userId, vin: "1GCWGAFG4L1234567", make: "Chevrolet", model: "Express", year: 2023, driverScore: 72, maintenanceScore: 68, overallScore: 70, status: "Needs Review" },
      { vehicleId: "3C6TRVDG1LE556677", userId, vin: "3C6TRVDG1LE556677", make: "Ram", model: "ProMaster", year: 2024, driverScore: 75, maintenanceScore: 71, overallScore: 73, status: "Needs Review" },
      { vehicleId: "1N6BF0KM3LN887766", userId, vin: "1N6BF0KM3LN887766", make: "Nissan", model: "NV Cargo", year: 2023, driverScore: 79, maintenanceScore: 76, overallScore: 77, status: "Needs Review" }
    ];

    // Use the vehicles array directly
    const allVehicles = vehicles;

    console.log(`Inserting ${allVehicles.length} vehicles...`);

    // Add the vehicles one by one to avoid type issues
    for (const vehicle of allVehicles) {
      try {
        const existingVehicle = await db.query.vehicles.findFirst({
          where: (vehicles, { eq }) => eq(vehicles.vin, vehicle.vin)
        });

        if (!existingVehicle) {
          const vehicleData = {
            vehicleId: vehicle.vehicleId,
            userId: vehicle.userId,
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            driverScore: vehicle.driverScore,
            maintenanceScore: vehicle.maintenanceScore,
            overallScore: vehicle.overallScore,
            status: vehicle.status
          };
          await db.insert(vehicles).values(vehicleData);
          console.log(`Added vehicle: ${vehicle.vin}`);
        } else {
          console.log(`Vehicle ${vehicle.vin} already exists. Skipping.`);
        }
      } catch (error) {
        console.error(`Error adding vehicle ${vehicle.vin}:`, error);
      }
    }

    // Updated recommendations based on the content file
    const safetyRecommendations = [
      {
        userId,
        goalType: "safety",
        title: "Reduce Hard Acceleration Events in Fleet",
        description: "Multiple vehicles have shown a pattern of hard acceleration, particularly after stop signs in residential zones and after traffic lights.",
        actionableInsight: "Coach drivers to apply throttle more gradually in low-speed urban zones.",
        potentialImpact: "Reduced risk of accidents, improved fuel economy, and decreased wear on vehicle components.",
        estimatedSavings: "$15,000 - $25,000 annually",
        timeToImplement: "2-4 weeks",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      },
      {
        userId,
        goalType: "safety",
        title: "Address Collision Prevention in Lane Changes",
        description: "Side swipe collisions detected while changing lanes; lateral g-force spikes occurred without turn signal usage.",
        actionableInsight: "Assign targeted backing-up training or review camera/sensor usage.",
        potentialImpact: "Reduction in side-swipe accidents and resulting damage claims.",
        estimatedSavings: "$30,000 - $50,000 annually",
        timeToImplement: "1-2 months",
        type: "danger",
        icon: "alert-circle",
        status: "notified"
      },
      {
        userId,
        goalType: "safety",
        title: "Reduce Excessive Vehicle Idling",
        description: "Vehicles idling for over 12 minutes after trip end, parked, gear in neutral, even in moderate temperatures.",
        actionableInsight: "Instruct drivers to use engine-off if waiting exceeds 5 minutes during stops.",
        potentialImpact: "Reduced fuel waste, lower emissions, and decreased engine wear.",
        estimatedSavings: "$10,000 - $18,000 annually",
        timeToImplement: "1-2 weeks",
        type: "info",
        icon: "info",
        status: "notified"
      },
      {
        userId,
        goalType: "safety",
        title: "Improve Braking Behavior at Intersections",
        description: "Multiple hard braking events occurring at signalized intersections with speed above 30 mph prior to braking.",
        actionableInsight: "Recommend practicing smoother deceleration when approaching intersections.",
        potentialImpact: "Reduced risk of rear-end collisions and improved overall safety scores.",
        estimatedSavings: "$20,000 - $35,000 annually",
        timeToImplement: "2-4 weeks",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      }
    ];

    const maintenanceRecommendations = [
      {
        userId,
        goalType: "maintenance",
        title: "Address Ignored Service Reminders",
        description: "Service reminders being triggered repeatedly and dismissed by drivers without follow-up action.",
        actionableInsight: "Enforce service compliance checks weekly and notify driver supervisors if ignored.",
        potentialImpact: "Prevent major mechanical failures and extend vehicle lifespan.",
        estimatedSavings: "$25,000 - $40,000 annually",
        timeToImplement: "1-2 weeks",
        type: "warning",
        icon: "tool",
        status: "notified"
      },
      {
        userId,
        goalType: "maintenance",
        title: "Respond to Check Engine Lights Immediately",
        description: "Check engine lights remaining on for 3+ consecutive days without vehicle downtime or shop visits recorded.",
        actionableInsight: "Escalate vehicles with check engine lights for immediate service center evaluation.",
        potentialImpact: "Prevent minor issues from becoming major mechanical failures.",
        estimatedSavings: "$35,000 - $60,000 annually",
        timeToImplement: "Immediate",
        type: "danger",
        icon: "alert-circle",
        status: "notified"
      },
      {
        userId,
        goalType: "maintenance",
        title: "Address Multiple Diagnostic Trouble Codes",
        description: "Multiple diagnostic codes triggering including emissions and transmission warnings without subsequent service.",
        actionableInsight: "Schedule mechanic inspection when DTCs are triggered more than once per week.",
        potentialImpact: "Early detection of serious mechanical issues before they cause breakdowns.",
        estimatedSavings: "$45,000 - $70,000 annually",
        timeToImplement: "1 week",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      },
      {
        userId,
        goalType: "maintenance",
        title: "Monitor Oil Life in City-Heavy Vehicles",
        description: "Oil life dropping rapidly over short periods with city trips and high idle time detected.",
        actionableInsight: "Correlate idle-heavy vehicles with faster oil wear and shorten oil change cycles for them.",
        potentialImpact: "Extended engine life and reduced risk of oil-related failures.",
        estimatedSavings: "$15,000 - $25,000 annually",
        timeToImplement: "2-3 weeks",
        type: "info",
        icon: "info",
        status: "notified"
      }
    ];

    const emissionsRecommendations = [
      {
        userId,
        goalType: "fuel",
        title: "Identify and Address Poor Fuel Efficiency Vehicles",
        description: "Vehicles consistently showing lower MPG than peers in the same class over a 2-week period.",
        actionableInsight: "Inspect underperforming vehicles and consider route reassignment or phased retirement.",
        potentialImpact: "Improved fleet-wide fuel economy and reduced carbon footprint.",
        estimatedSavings: "$20,000 - $35,000 annually",
        timeToImplement: "1-2 months",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      },
      {
        userId,
        goalType: "fuel",
        title: "Optimize ICE and EV Route Assignments",
        description: "Short trips under 5 miles are being assigned to ICE vehicles even when EVs are available in the yard.",
        actionableInsight: "Realign route assignment logic to favor EVs for last-mile deliveries.",
        potentialImpact: "Reduced emissions and better utilization of existing electric vehicles.",
        estimatedSavings: "$18,000 - $30,000 annually",
        timeToImplement: "2-4 weeks",
        type: "info",
        icon: "info",
        status: "notified"
      },
      {
        userId,
        goalType: "fuel",
        title: "Improve EV Fleet Utilization",
        description: "EVs remaining fully charged and idle for multiple days with no trips assigned or logged.",
        actionableInsight: "Integrate EVs into regular dispatch cycles to avoid idle charging.",
        potentialImpact: "Better ROI on EV investment and reduced overall fleet emissions.",
        estimatedSavings: "$15,000 - $25,000 annually",
        timeToImplement: "1-2 weeks",
        type: "info",
        icon: "info",
        status: "notified"
      },
      {
        userId,
        goalType: "fuel",
        title: "Address Fuel-Inefficient Driving Behaviors",
        description: "Vehicle MPG 20% lower than expected for route profile due to excessive idling and aggressive acceleration.",
        actionableInsight: "Retrain drivers on efficient driving techniques and evaluate vehicle health.",
        potentialImpact: "Improved fuel economy across the fleet and reduced carbon emissions.",
        estimatedSavings: "$25,000 - $40,000 annually",
        timeToImplement: "3-6 weeks",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      }
    ];

    const efficiencyRecommendations = [
      {
        userId,
        goalType: "utilization",
        title: "Optimize Power Take-Off Equipment Usage",
        description: "PTO engaged for extended hours with minimal distance driven, indicating static equipment usage.",
        actionableInsight: "Assess if stationary PTO use aligns with job type or if better route/equipment pairing is needed.",
        potentialImpact: "More efficient use of specialized equipment and potential fleet reduction.",
        estimatedSavings: "$30,000 - $50,000 annually",
        timeToImplement: "1-3 months",
        type: "info",
        icon: "info",
        status: "notified"
      },
      {
        userId,
        goalType: "utilization",
        title: "Address Underutilized Fleet Vehicles",
        description: "Vehicles logging minimal mileage compared to fleet median with no maintenance downtime reported.",
        actionableInsight: "Rotate underutilized vehicles into active routes or reassign to increase daily mileage.",
        potentialImpact: "Better ROI on vehicle assets and potential fleet reduction.",
        estimatedSavings: "$40,000 - $70,000 annually",
        timeToImplement: "1-2 months",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      },
      {
        userId,
        goalType: "utilization",
        title: "Investigate Inactive Fleet Vehicles",
        description: "Multiple vehicles showing no ignition or trip events for consecutive days while other fleet vehicles remain active.",
        actionableInsight: "Audit if vehicles are parked, forgotten, or misassigned and consider redeployment.",
        potentialImpact: "Increased asset utilization and potential fleet reduction.",
        estimatedSavings: "$35,000 - $60,000 annually",
        timeToImplement: "2-4 weeks",
        type: "warning",
        icon: "alert-triangle",
        status: "notified"
      },
      {
        userId,
        goalType: "utilization",
        title: "Improve Trip Spacing and Driver Assignment",
        description: "Drivers running consecutive trips with minimal breaks between trips.",
        actionableInsight: "Ensure dispatchers build in proper spacing or assign another driver mid-day.",
        potentialImpact: "Reduced driver fatigue and improved service quality.",
        estimatedSavings: "$20,000 - $30,000 annually",
        timeToImplement: "1-2 weeks",
        type: "info",
        icon: "info",
        status: "notified"
      }
    ];

    // Combine all recommendations
    const allRecommendations = [
      ...safetyRecommendations,
      ...maintenanceRecommendations,
      ...emissionsRecommendations,
      ...efficiencyRecommendations
    ];

    console.log(`Inserting ${allRecommendations.length} recommendations...`);

    // Insert recommendations
    const insertedRecommendations = await db
      .insert(recommendations)
      .values(allRecommendations)
      .returning();
      
    console.log(`Inserted ${insertedRecommendations.length} recommendations.`);

    // Create steps for each recommendation
    for (const rec of insertedRecommendations) {
      let stepsToInsert: InsertRecommendationStep[] = [];
      
      if (rec.goalType === "safety") {
        if (rec.title.includes("Hard Acceleration")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze telematics data to identify drivers with frequent hard acceleration events", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Create targeted training module focusing on smooth acceleration techniques", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Schedule individual coaching sessions for the highest-risk drivers", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Configure alerts for drivers when hard acceleration is detected", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Review improvement after 30 days and follow up with drivers showing no change", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Collision Prevention")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze collision events to identify common patterns and risk factors", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Develop training program focusing on proper lane change procedures", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Schedule hands-on training sessions with professional driving instructors", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Install/activate lane change assistance technology where available", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement follow-up assessments to verify improvement", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Excessive Vehicle Idling")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze idling data to identify highest-risk drivers and locations", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Create and distribute updated idling policy to all drivers", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Configure telematics to alert drivers when idling exceeds 5 minutes", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Track and report on idling metrics weekly to management", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement rewards program for drivers with lowest idle times", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Braking Behavior")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze braking event data to identify high-risk locations and drivers", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Create safe braking distance reference guide for drivers", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Conduct practical training on smooth deceleration techniques", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Configure in-cab alerts for approaching known high-risk intersections", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Track improvement and provide feedback to drivers regularly", order: 5, isCompleted: false }
          ];
        }
      } else if (rec.goalType === "maintenance") {
        if (rec.title.includes("Ignored Service Reminders")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Review service reminder dismissal data to identify patterns", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Implement escalation protocol for repeatedly dismissed reminders", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Configure weekly compliance reports for management review", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Train supervisors on tracking and addressing non-compliance", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Develop consequence system for persistent non-compliance", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Check Engine Lights")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Create daily report of vehicles with active check engine lights", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Implement mandatory next-day service protocol for CEL vehicles", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Configure alert system to notify managers of active CELs", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Train drivers on proper reporting procedures for warning lights", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Track CEL frequency to identify problematic vehicles", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Diagnostic Trouble Codes")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Implement automated DTC monitoring system integrated with telematics", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Configure severity-based response protocols for different codes", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Train maintenance staff on proactive DTC resolution", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Establish relationships with service centers for priority handling", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Track recurring DTCs to identify systemic issues in specific models", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Oil Life")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze oil degradation patterns across the fleet", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Identify correlation between routes, driving patterns and oil wear", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Create vehicle-specific oil change schedules based on usage patterns", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Configure monitoring system for real-time oil life tracking", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Educate drivers on the impact of driving habits on engine health", order: 5, isCompleted: false }
          ];
        }
      } else if (rec.goalType === "fuel") {
        if (rec.title.includes("Poor Fuel Efficiency")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Identify bottom 20% of vehicles by fuel economy within each class", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Conduct diagnostic tests on underperforming vehicles", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Analyze route assignments for potential mismatches", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Create replacement plan for consistently inefficient vehicles", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement ongoing monitoring system for fleet fuel efficiency", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("ICE and EV Route")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Audit current route assignments relative to vehicle types", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Identify all routes under 5 miles suitable for EV assignment", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Configure dispatch system to prioritize EVs for short routes", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Train dispatchers on optimal vehicle-to-route matching", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Track emissions reduction from improved assignments", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("EV Fleet Utilization")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze EV usage patterns to identify underutilized vehicles", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Identify barriers to EV assignment in dispatch decisions", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Create EV utilization targets for each operating location", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Configure reminders for dispatchers about idle fully-charged EVs", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement weekly EV utilization reporting for management", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Fuel-Inefficient Driving")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze driving behavior data to identify efficiency opportunities", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Develop eco-driving training program for all drivers", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Schedule hands-on training sessions with professional instructors", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Configure real-time feedback systems for inefficient driving behaviors", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Create recognition program for most-improved and most-efficient drivers", order: 5, isCompleted: false }
          ];
        }
      } else if (rec.goalType === "utilization") {
        if (rec.title.includes("Power Take-Off")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Collect and analyze PTO usage data across the fleet", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Match PTO usage with job requirements and expected patterns", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Identify vehicles with high stationary PTO time for possible reassignment", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Create guidelines for appropriate PTO usage by job type", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Train supervisors to monitor and optimize PTO usage", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Underutilized Fleet")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Identify all vehicles with utilization below 50% of fleet median", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Analyze reason codes for low utilization (seasonal, specialty, etc.)", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Create rotation schedule to balance mileage across similar vehicles", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Identify candidates for reassignment or fleet reduction", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement minimum utilization standards by vehicle class", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Inactive Fleet")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Generate report of vehicles with zero activity for 3+ days", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Conduct physical audit to locate and inspect inactive vehicles", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Interview department heads about vehicle assignment and needs", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Create redeployment plan for unnecessary duplicate vehicles", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement daily utilization tracking and alerts for management", order: 5, isCompleted: false }
          ];
        } else if (rec.title.includes("Trip Spacing")) {
          stepsToInsert = [
            { recommendationId: rec.id, description: "Analyze driver schedules to identify consecutive trip patterns", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Create scheduling guidelines with minimum break requirements", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Configure scheduling system to enforce break time between trips", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Train dispatchers on optimizing driver schedules and handoffs", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement fatigue monitoring system for high-risk drivers", order: 5, isCompleted: false }
          ];
        }
      }

      if (stepsToInsert.length > 0) {
        await db.insert(recommendationSteps).values(stepsToInsert);
        console.log(`Added ${stepsToInsert.length} steps for recommendation ID ${rec.id}`);
      }
    }

    console.log("Seeding completed successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding updated data:", error);
    return false;
  }
}