import type { Driver } from "@/domain/entities";

/**
 * Driver Repository Interface
 */
export interface IDriverRepository {
  /**
   * Create a new driver record
   */
  create: (data: Partial<Driver>) => Promise<Driver>;

  /**
   * Find a driver by user ID
   */
  findByUserId: (userId: string) => Promise<Driver | null>;

  /**
   * Find a driver by ID
   */
  findById: (id: string) => Promise<Driver | null>;

  /**
   * Update a driver record
   */
  update: (userId: string, data: Partial<Driver>) => Promise<Driver | null>;

  /**
   * Find all drivers by tenant ID
   */
  findByTenantId: (tenantId: string) => Promise<Driver[]>;

  /**
   * Delete a driver by user ID
   */
  delete: (userId: string) => Promise<boolean>;
}
