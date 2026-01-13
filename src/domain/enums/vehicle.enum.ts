/**
 * Vehicle Status Enum
 * Represents the current status of a vehicle
 */
export enum VehicleStatus {
  AVAILABLE = "available",
  ASSIGNED = "assigned",
  MAINTENANCE = "maintenance",
  OUT_OF_SERVICE = "out_of_service",
}

/**
 * Vehicle Type Enum
 * Represents different types of vehicles
 */
export enum VehicleType {
  SEDAN = "sedan",
  SUV = "suv",
  TRUCK = "truck",
  VAN = "van",
  PICKUP = "pickup",
  MINIVAN = "minivan",
  COUPE = "coupe",
}

/**
 * Fuel Type Enum
 * Represents the fuel type of a vehicle
 */
export enum FuelType {
  PETROL = "petrol",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
  CNG = "cng",
  LPG = "lpg",
}
