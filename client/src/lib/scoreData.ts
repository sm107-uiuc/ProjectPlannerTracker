import { Goal } from './types';

export interface ScoringEvent {
  eventName: string;
  description: string;
  weight: number; // 0-100
}

export interface GoalScoring {
  events: ScoringEvent[];
  formula: string;
  description: string;
}

export const scoringData: Record<Goal, GoalScoring> = {
  safety: {
    events: [
      {
        eventName: "HarshBraking",
        description: "Triggered when the vehicle decelerates sharply, indicating late reactions or potential near-miss events. Often correlated with driver distraction or following too closely.",
        weight: 14
      },
      {
        eventName: "HarshAcceleration",
        description: "Detected when the driver accelerates rapidly, commonly after stops or during merging. Impacts fuel economy, driveline stress, and passenger comfort.",
        weight: 10
      },
      {
        eventName: "HarshCornering",
        description: "Identifies sudden, tight turns at speed. Associated with rollover risk, tire wear, and poor control in commercial vehicles or passenger vans.",
        weight: 12
      },
      {
        eventName: "AbsoluteSpeeding",
        description: "Occurs when a vehicle exceeds posted speed limits, regardless of surrounding traffic. Strongly linked to high-severity accidents and traffic violations.",
        weight: 16
      },
      {
        eventName: "RelativeSpeeding",
        description: "Driver is moving significantly faster than surrounding traffic, even if under the posted limit. Indicates aggressive driving and higher crash likelihood in mixed-speed environments.",
        weight: 12
      },
      {
        eventName: "SeatbeltViolation",
        description: "Driver or passenger moved the vehicle without fastening the seatbelt. Increases injury risk and violates compliance rules.",
        weight: 8
      },
      {
        eventName: "Collision",
        description: "Telematics-verified collision event based on g-force or OEM event data. High severity, direct safety impact.",
        weight: 20
      },
      {
        eventName: "FatigueRisk",
        description: "Identifies when a driver has been operating the vehicle for extended periods (e.g., 6+ hours) without adequate breaks. Derived from trip chaining and time-on-road analysis. Correlates strongly with drowsy driving and accident risk.",
        weight: 12
      },
      {
        eventName: "BackToBackTripsNoBreak",
        description: "Driver completes multiple consecutive trips with no significant rest time between them, increasing fatigue and potential for driving errors.",
        weight: 10
      },
      {
        eventName: "DriverTrafficViolation",
        description: "A traffic ticket or moving violation was recorded against the driver. May include speeding, reckless driving, or other infractions. Severity can be linked to license points or fine amounts.",
        weight: 14
      },
      {
        eventName: "DriverAccidentReported",
        description: "A vehicle and/or driver was involved in an accident. May include injury info, severity score, and fault. Sourced from safety program providers (e.g., CEI, Samba Safety).",
        weight: 16
      },
      {
        eventName: "DriverLicenseExpired",
        description: "Driver's license has passed its expiration date. A high-risk compliance issue that could result in legal liability during an incident or audit.",
        weight: 12
      }
    ],
    formula: "Score = 100 - (∑(event_count × event_weight) / total_events) × normalization_factor",
    description: "The Safety score is calculated by tracking safety-critical events like harsh braking, speeding, seatbelt violations, and fatigue indicators. Each event type is assigned a specific weight based on its correlation with accident risk. The formula normalizes these weighted events across your fleet, resulting in a score from 0-100, where higher values indicate safer driving."
  },
  fuel: {
    events: [
      {
        eventName: "FuelInefficiency",
        description: "MPG/MPGe significantly lower than expected for trip length and vehicle class. Can indicate poor driver habits, tire underinflation, payload issues, or vehicle health degradation.",
        weight: 18
      },
      {
        eventName: "RouteDeviation",
        description: "Driver strays from the recommended or assigned route, increasing fuel usage and potentially violating compliance or SLA targets. Derived from GPS path vs route plan.",
        weight: 14
      },
      {
        eventName: "FuelCardMisuse",
        description: "Frequent low-quantity fuel purchases or fueling far from assigned routes. Indicates possible fraud, theft, or fuel policy violation. Requires integration with fuel card transaction data.",
        weight: 12
      },
      {
        eventName: "LongIdling",
        description: "Vehicle remained stationary with engine running beyond a set threshold. Increases fuel waste, emissions, and may indicate inefficiencies in routing or driver behavior.",
        weight: 16
      },
      {
        eventName: "HarshAcceleration",
        description: "Detected when the driver accelerates rapidly, commonly after stops or during merging. Impacts fuel economy, driveline stress, and passenger comfort.",
        weight: 14
      },
      {
        eventName: "TirePressureCriticalCount",
        description: "Critical tire pressure levels have been detected. Increases risk of blowouts, poor handling, and fuel inefficiency.",
        weight: 10
      },
      {
        eventName: "EVChargingInefficiency",
        description: "EVs are plugged in and charged often but have very low trip miles afterward. Suggests inefficient planning or charging-for-idle behavior, reducing ROI on EV assets.",
        weight: 12
      },
      {
        eventName: "EVBatteryMisuse",
        description: "Fully charged EVs remain idle for extended periods (e.g., more than 1 day). Suggests poor scheduling or lack of driver routing tools that prioritize EVs.",
        weight: 10
      },
      {
        eventName: "FrequentTollRoutes",
        description: "Driver or vehicle frequently uses high-cost toll routes when viable alternatives exist. May be optimized through better routing or schedule planning.",
        weight: 8
      },
      {
        eventName: "EvBatteryLevelCritical",
        description: "Battery level is critically low — may result in vehicle stalling if not charged soon. High operational impact.",
        weight: 16
      }
    ],
    formula: "Score = 100 - (∑(event_count × event_weight) / total_fuel_consumption) × efficiency_factor",
    description: "The Fuel score measures how efficiently your fleet uses energy resources. It accounts for factors like idling time, routing efficiency, fuel card usage patterns, and driver behaviors that impact consumption. EV-specific metrics are included for electric vehicles. The score is normalized against your fleet's total fuel/energy consumption for a comparable 0-100 rating."
  },
  maintenance: {
    events: [
      {
        eventName: "CheckEngineLightOn",
        description: "Light remains on for 3+ consecutive days. Unlike real-time DTCs, this focuses on unresolved mechanical issues or maintenance neglect by the driver.",
        weight: 16
      },
      {
        eventName: "DTCSetCount",
        description: "Diagnostic Trouble Codes (DTCs) have been triggered by the vehicle's onboard system. Indicates potential mechanical issues requiring attention.",
        weight: 14
      },
      {
        eventName: "ServiceWarningSetCount",
        description: "Service light or maintenance alert triggered. Ignoring it may lead to long-term damage or breakdowns.",
        weight: 12
      },
      {
        eventName: "EngineOilLifeLowCount",
        description: "The vehicle has low oil life but continues to operate. Increases the risk of engine damage and unscheduled downtime.",
        weight: 14
      },
      {
        eventName: "TirePressureCriticalCount",
        description: "Critical tire pressure levels have been detected. Increases risk of blowouts, poor handling, and fuel inefficiency.",
        weight: 12
      },
      {
        eventName: "OilLifeLow",
        description: "Generic indicator that oil life is low, similar to engineOilLifeLowCount. Triggers preventive maintenance.",
        weight: 14
      },
      {
        eventName: "BatteryVoltageCritical",
        description: "Critically low battery voltage detected. May lead to vehicle not starting, especially in cold climates or older batteries.",
        weight: 12
      },
      {
        eventName: "HighRepairCostVehicle",
        description: "A vehicle has incurred unusually high repair costs (e.g., repeated large quotes or part replacements). Helps identify candidates for replacement or deep diagnostic inspection.",
        weight: 16
      },
      {
        eventName: "UnauthorizedRepairAttempt",
        description: "A repair was started or completed without formal authorization. Highlights gaps in policy adherence and cost control processes.",
        weight: 10
      },
      {
        eventName: "HarshBraking",
        description: "Triggered when the vehicle decelerates sharply, indicating late reactions or potential near-miss events. Often correlated with driver distraction or following too closely.",
        weight: 10
      },
      {
        eventName: "HarshCornering",
        description: "Identifies sudden, tight turns at speed. Associated with rollover risk, tire wear, and poor control in commercial vehicles or passenger vans.",
        weight: 8
      }
    ],
    formula: "Score = 100 - (∑(event_count × event_weight) / total_vehicles) × maintenance_factor",
    description: "The Maintenance score evaluates how well your fleet adheres to service schedules and responds to vehicle health indicators. It tracks diagnostic codes, service warnings, critical component status, and driving behaviors that accelerate wear and tear. Higher scores indicate a well-maintained fleet with fewer unexpected repair costs and downtime risks."
  },
  utilization: {
    events: [
      {
        eventName: "UnderutilizedVehicles",
        description: "Flags vehicles that are rarely dispatched or driven significantly less than fleet average. Useful for rotation policies, cost per mile analysis, and ROI improvement.",
        weight: 18
      },
      {
        eventName: "UnderutilizedEVs",
        description: "EVs are assigned fewer trips than ICE counterparts, even for short or local routes where they are more optimal. Results in missed emission reduction opportunities.",
        weight: 16
      },
      {
        eventName: "DriveTimeOutsideShiftWindow",
        description: "Trips occurring outside assigned shift windows (e.g., late night or early morning) may indicate policy breaches or driver fatigue risk.",
        weight: 10
      },
      {
        eventName: "MultiDayNoActivity",
        description: "Vehicle has had no ignition or trip activity for several consecutive days. May signal operational bottleneck, assignment issue, or unreported downtime.",
        weight: 20
      },
      {
        eventName: "TollViolation",
        description: "A toll was incurred but not properly paid or registered (e.g., missing Toll Tag or invalid plate). May result in fines or administrative fees. Indicates potential policy breaches or tagging issues.",
        weight: 8
      },
      {
        eventName: "PowerTakeOff",
        description: "Tracks use of auxiliary equipment (like cranes, lifts) powered by the vehicle. Affects utilization and fuel tracking.",
        weight: 14
      },
      {
        eventName: "EVChargingInefficiency",
        description: "EVs are plugged in and charged often but have very low trip miles afterward. Suggests inefficient planning or charging-for-idle behavior, reducing ROI on EV assets.",
        weight: 14
      },
      {
        eventName: "RouteDeviation",
        description: "Driver strays from the recommended or assigned route, increasing fuel usage and potentially violating compliance or SLA targets. Derived from GPS path vs route plan.",
        weight: 12
      },
      {
        eventName: "LongIdling",
        description: "Vehicle remained stationary with engine running beyond a set threshold. Increases fuel waste, emissions, and may indicate inefficiencies in routing or driver behavior.",
        weight: 16
      }
    ],
    formula: "Score = 100 × (∑(actual_utilization × vehicle_weight) / ∑(target_utilization × vehicle_weight))",
    description: "The Utilization score measures how effectively your fleet assets are deployed. It considers factors like idle time, vehicle assignment efficiency, and adherence to operational schedules. The score compares actual utilization against targets for each vehicle class, accounting for their specific operational roles. This helps identify underutilized assets and optimization opportunities."
  }
};