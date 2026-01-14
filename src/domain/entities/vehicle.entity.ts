import type { FuelType, VehicleStatus, VehicleType } from "../enums/vehicle.enum";

/**
 * Vehicle Domain Entity
 * Represents a vehicle in the fleet management system
 */
export interface Vehicle {
  /** Unique identifier for the vehicle record */
  id?: string;

  /** Tenant ID this vehicle belongs to */
  tenantId: string;

  /** Vehicle registration/license plate number */
  registrationNumber: string;

  /** Vehicle manufacturer */
  make: string;

  /** Vehicle model name */
  vehicleModel: string;

  /** Manufacturing year */
  year: number;

  /** Vehicle Identification Number (VIN) */
  vin: string;

  /** Type of vehicle (sedan, SUV, truck, etc.) */
  type: VehicleType;

  /** Fuel type */
  fuelType: FuelType;

  /** Current vehicle status */
  status: VehicleStatus;

  /** Current mileage/odometer reading */
  mileage: number;

  /** Date of last maintenance */
  lastMaintenanceDate?: Date;

  /** Date when next maintenance is due */
  nextMaintenanceDate?: Date;

  /** Insurance policy expiry date */
  insuranceExpiryDate: Date;

  /** Vehicle registration expiry date */
  registrationExpiryDate: Date;

  /** ID of the driver currently assigned to this vehicle (nullable) */
  assignedDriverId?: string | null;

  /** Additional notes or description */
  notes?: string;

  /** Soft delete timestamp */
  deletedAt?: Date | null;

  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}
