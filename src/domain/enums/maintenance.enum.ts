/**
 * Maintenance Type Enum
 * Represents different types of vehicle maintenance
 */
export enum MaintenanceType {
  OIL_CHANGE = "oil_change",
  TIRE_ROTATION = "tire_rotation",
  BRAKE_SERVICE = "brake_service",
  ENGINE_SERVICE = "engine_service",
  TRANSMISSION_SERVICE = "transmission_service",
  BATTERY_REPLACEMENT = "battery_replacement",
  AIR_FILTER_REPLACEMENT = "air_filter_replacement",
  GENERAL_INSPECTION = "general_inspection",
  REPAIR = "repair",
  OTHER = "other",
}

/**
 * Maintenance Status Enum
 * Represents the status of a maintenance record
 */
export enum MaintenanceStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
