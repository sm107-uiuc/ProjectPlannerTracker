import { db } from "./db";
import { recommendations, recommendationSteps, users } from "@shared/schema";

async function seedRecommendations() {
  try {
    // First, create a user if none exists
    const existingUsers = await db.query.users.findMany();
    let userId = 1;
    
    if (existingUsers.length === 0) {
      console.log("Creating user for recommendations...");
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

    // Safety recommendations
    const safetyRecommendations = [
      {
        userId,
        goalType: "safety",
        title: "Implement Driver Safety Training Program",
        description: "Our analysis shows that 35% of your fleet has drivers with safety scores below the industry average. Implement a comprehensive safety training program focusing on defensive driving techniques.",
        actionableInsight: "Schedule monthly safety workshops and online training modules for all drivers, with special focus on those with lower safety scores.",
        potentialImpact: "Reduction in accident rates by up to 40% and improved CSA scores across the fleet.",
        estimatedSavings: "$75,000 - $120,000 annually",
        timeToImplement: "1-3 months",
        type: "warning",
        icon: "shield-alert",
        status: "notified"
      },
      {
        userId,
        goalType: "safety",
        title: "Install Advanced Driver Assistance Systems",
        description: "Your accident rate is 15% higher than the industry average. Consider installing ADAS technologies in your high-risk vehicles.",
        actionableInsight: "Prioritize installing forward collision warning, lane departure warning, and automatic emergency braking in vehicles with high incident rates.",
        potentialImpact: "Reduction in rear-end collisions by 40% and lane-departure accidents by 30%.",
        estimatedSavings: "$45,000 annually in repair costs",
        timeToImplement: "3-6 months",
        type: "danger",
        icon: "alert-triangle",
        status: "notified"
      }
    ];

    // Fuel recommendations
    const fuelRecommendations = [
      {
        userId,
        goalType: "fuel",
        title: "Optimize Route Planning",
        description: "Analysis of your fleet's current routes shows potential for 12% reduction in miles traveled through optimization.",
        actionableInsight: "Implement AI-powered route optimization software to reduce unnecessary miles and improve delivery efficiency.",
        potentialImpact: "Reduction in fuel consumption and vehicle wear, while improving on-time deliveries.",
        estimatedSavings: "$25,000 - $40,000 annually",
        timeToImplement: "1-2 months",
        type: "info",
        icon: "map",
        status: "notified"
      },
      {
        userId,
        goalType: "fuel",
        title: "Driver Behavior Monitoring",
        description: "Idling time for your fleet is 25% above the industry benchmark, resulting in excessive fuel consumption.",
        actionableInsight: "Deploy telematics with idle-time alerts and implement an incentive program for drivers who reduce idling.",
        potentialImpact: "Every 10% reduction in idle time can save 1% in overall fuel costs.",
        estimatedSavings: "$12,000 - $18,000 annually",
        timeToImplement: "2-4 weeks",
        type: "warning",
        icon: "gauge",
        status: "notified"
      }
    ];

    // Maintenance recommendations
    const maintenanceRecommendations = [
      {
        userId,
        goalType: "maintenance",
        title: "Implement Predictive Maintenance",
        description: "20% of your fleet's maintenance is reactive rather than preventive, leading to higher costs and downtime.",
        actionableInsight: "Deploy IoT sensors and predictive analytics to catch failures before they happen and optimize maintenance schedules.",
        potentialImpact: "Reduction in unplanned downtime and extended vehicle lifecycles.",
        estimatedSavings: "$35,000 - $50,000 annually",
        timeToImplement: "2-4 months",
        type: "info",
        icon: "tool",
        status: "notified"
      },
      {
        userId,
        goalType: "maintenance",
        title: "Standardize PM Compliance",
        description: "Preventive maintenance compliance varies significantly across your fleet, with 30% of vehicles consistently overdue.",
        actionableInsight: "Standardize PM scheduling across the fleet and implement automated reminders with escalation protocols.",
        potentialImpact: "Improved vehicle reliability and reduced roadside breakdowns.",
        estimatedSavings: "$22,000 annually in emergency repairs",
        timeToImplement: "1 month",
        type: "warning",
        icon: "calendar",
        status: "notified"
      }
    ];

    // Utilization recommendations
    const utilizationRecommendations = [
      {
        userId,
        goalType: "utilization",
        title: "Right-size Fleet Composition",
        description: "15% of your vehicles are utilized less than 40% of the time, indicating potential for fleet reduction.",
        actionableInsight: "Analyze usage patterns by vehicle type and location to identify candidates for removal or reallocation.",
        potentialImpact: "More efficient capital allocation and reduced overhead costs.",
        estimatedSavings: "$80,000 - $120,000 annually",
        timeToImplement: "3-6 months",
        type: "success",
        icon: "activity",
        status: "notified"
      },
      {
        userId,
        goalType: "utilization",
        title: "Implement Vehicle Sharing Program",
        description: "Multiple departments have peak usage at different times, suggesting opportunity for internal vehicle sharing.",
        actionableInsight: "Deploy fleet sharing technology allowing employees to reserve vehicles online and track usage by department.",
        potentialImpact: "Improved utilization rates and potential for future fleet reduction.",
        estimatedSavings: "$30,000 - $45,000 annually",
        timeToImplement: "2-3 months",
        type: "info",
        icon: "share",
        status: "notified"
      }
    ];

    // Combine all recommendations
    const allRecommendations = [
      ...safetyRecommendations,
      ...fuelRecommendations,
      ...maintenanceRecommendations,
      ...utilizationRecommendations
    ];

    console.log(`Inserting ${allRecommendations.length} recommendations...`);

    // Insert all recommendations
    const insertedRecommendations = await db
      .insert(recommendations)
      .values(allRecommendations)
      .returning();

    console.log(`Inserted ${insertedRecommendations.length} recommendations.`);

    // Create steps for each recommendation
    for (const rec of insertedRecommendations) {
      const stepsToInsert = [];
      
      if (rec.goalType === "safety") {
        if (rec.title.includes("Training")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Assess current safety training gaps", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Research and select training provider", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Schedule initial training sessions", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Implement tracking system for completion", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Review effectiveness after 3 months", order: 5, isCompleted: false }
          );
        } else if (rec.title.includes("Assistance")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Research compatible ADAS solutions", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Prioritize vehicles based on risk assessment", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Obtain approval for pilot program", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Install systems in first batch of vehicles", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Collect and analyze initial impact data", order: 5, isCompleted: false }
          );
        }
      } else if (rec.goalType === "fuel") {
        if (rec.title.includes("Route")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Evaluate current routing efficiency", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Research route optimization solutions", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Select and implement software solution", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Train dispatchers and drivers", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Compare before/after fuel consumption", order: 5, isCompleted: false }
          );
        } else if (rec.title.includes("Behavior")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Analyze current idle time by vehicle/driver", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Configure telematics for idle alerts", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Communicate new idle policy to drivers", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Create driver incentive program", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Review weekly idle reports for improvement", order: 5, isCompleted: false }
          );
        }
      } else if (rec.goalType === "maintenance") {
        if (rec.title.includes("Predictive")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Identify failure-prone components", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Research and select IoT monitoring solution", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Install sensors on pilot group of vehicles", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Integrate with maintenance management system", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Train maintenance team on new protocols", order: 5, isCompleted: false }
          );
        } else if (rec.title.includes("PM Compliance")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Audit current PM compliance rates", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Standardize PM intervals across fleet", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Configure automated scheduling reminders", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Create escalation process for overdue PMs", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Monitor compliance improvements weekly", order: 5, isCompleted: false }
          );
        }
      } else if (rec.goalType === "utilization") {
        if (rec.title.includes("Right-size")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Analyze vehicle utilization by location", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Identify low-utilization vehicles", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Create fleet reduction plan", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Present recommendations to management", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Implement approved reductions", order: 5, isCompleted: false }
          );
        } else if (rec.title.includes("Sharing")) {
          stepsToInsert.push(
            { recommendationId: rec.id, description: "Map departmental vehicle usage patterns", order: 1, isCompleted: false },
            { recommendationId: rec.id, description: "Identify sharing opportunities", order: 2, isCompleted: false },
            { recommendationId: rec.id, description: "Select vehicle sharing platform", order: 3, isCompleted: false },
            { recommendationId: rec.id, description: "Develop sharing policies and procedures", order: 4, isCompleted: false },
            { recommendationId: rec.id, description: "Train employees on new sharing system", order: 5, isCompleted: false }
          );
        }
      }

      if (stepsToInsert.length > 0) {
        await db.insert(recommendationSteps).values(stepsToInsert);
        console.log(`Added ${stepsToInsert.length} steps for recommendation ID ${rec.id}`);
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding recommendations:", error);
  }
}

seedRecommendations().then(() => process.exit(0));