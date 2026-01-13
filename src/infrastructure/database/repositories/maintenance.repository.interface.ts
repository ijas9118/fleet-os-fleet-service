import type { MaintenanceRecord } from "@/domain/entities";

/**
 * Maintenance Repository Interface
 * Defines the contract for maintenance data access
 */
export interface IMaintenanceRepository {
  /**
   * Create a new maintenance record
   */
  create: (data: Partial<MaintenanceRecord>) => Promise<MaintenanceRecord>;

  /**
   * Find maintenance record by ID
   */
  findById: (id: string, tenantId: string) => Promise<MaintenanceRecord | null>;

  /**
   * Find all maintenance records for a vehicle
   */
  findByVehicleId: (vehicleId: string, tenantId: string) => Promise<MaintenanceRecord[]>;

  /**
   * Find all maintenance records with filters
   */
  findAll: (params: {
    tenantId: string;
    vehicleId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => Promise<{ records: MaintenanceRecord[]; total: number }>;

  /**
   * Update maintenance record
   */
  update: (id: string, tenantId: string, data: Partial<MaintenanceRecord>) => Promise<MaintenanceRecord | null>;

  /**
   * Delete maintenance record
   */
  delete: (id: string, tenantId: string) => Promise<boolean>;
}
