import type { Vehicle } from "@/domain/entities";

/**
 * Vehicle Repository Interface
 * Defines the contract for vehicle data access
 */
export interface IVehicleRepository {
  /**
   * Create a new vehicle
   */
  create: (data: Partial<Vehicle>) => Promise<Vehicle>;

  /**
   * Find vehicle by ID
   */
  findById: (id: string, tenantId: string) => Promise<Vehicle | null>;

  /**
   * Find vehicle by VIN
   */
  findByVin: (vin: string, tenantId: string) => Promise<Vehicle | null>;

  /**
   * Find vehicle by registration number
   */
  findByRegistrationNumber: (registrationNumber: string, tenantId: string) => Promise<Vehicle | null>;

  /**
   * Find all vehicles with filters and pagination
   */
  findAll: (params: {
    tenantId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    assignedDriverId?: string;
    includeDeleted?: boolean;
  }) => Promise<{ vehicles: Vehicle[]; total: number }>;

  /**
   * Update vehicle by ID
   */
  update: (id: string, tenantId: string, data: Partial<Vehicle>) => Promise<Vehicle | null>;

  /**
   * Soft delete vehicle by ID
   */
  softDelete: (id: string, tenantId: string) => Promise<boolean>;

  /**
   * Assign driver to vehicle
   */
  assignDriver: (vehicleId: string, driverId: string, tenantId: string) => Promise<Vehicle | null>;

  /**
   * Unassign driver from vehicle
   */
  unassignDriver: (vehicleId: string, tenantId: string) => Promise<Vehicle | null>;

  /**
   * Get vehicles assigned to a specific driver
   */
  findByDriverId: (driverId: string, tenantId: string) => Promise<Vehicle | null>;
}
