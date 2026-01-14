import type { MaintenanceStatus, MaintenanceType } from "../enums/maintenance.enum";

/**
 * Maintenance Record Domain Entity
 * Represents a maintenance record for a vehicle
 */
export interface MaintenanceRecord {
  /** Unique identifier for the maintenance record */
  id?: string;

  /** ID of the vehicle this maintenance is for */
  vehicleId: string;

  /** Tenant ID this maintenance record belongs to */
  tenantId: string;

  /** Type of maintenance */
  type: MaintenanceType;

  /** Status of the maintenance */
  status: MaintenanceStatus;

  /** Description of the maintenance work */
  description: string;

  /** Cost of the maintenance (optional) */
  cost?: number;

  /** Scheduled date for the maintenance */
  scheduledDate: Date;

  /** Date when maintenance was started (optional) */
  startedAt?: Date;

  /** Date when maintenance was completed (optional) */
  completedAt?: Date;

  /** ID of the user who performed the maintenance */
  performedBy?: string;

  /** Mileage at the time of maintenance */
  mileageAtMaintenance?: number;

  /** Additional notes */
  notes?: string;

  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}
