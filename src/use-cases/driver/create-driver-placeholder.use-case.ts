import type { Driver } from "@/domain/entities";
import type { IDriverRepository } from "@/infrastructure/database/repositories/driver.repository.interface";

/**
 * Use Case: Create Driver Placeholder
 * Creates a driver record when a user is activated in the auth service
 */
export class CreateDriverPlaceholderUseCase {
  constructor(private _driverRepository: IDriverRepository) {}

  async execute(data: {
    userId: string;
    tenantId: string;
    email: string;
    name: string;
  }): Promise<Driver> {
    // Check if driver already exists
    const existing = await this._driverRepository.findByUserId(data.userId);
    if (existing) {
      // Driver already exists, return it
      return existing;
    }

    // Create new driver placeholder
    const driver = await this._driverRepository.create({
      userId: data.userId,
      tenantId: data.tenantId,
      status: "pending",
    } as Partial<Driver>);

    return driver;
  }
}
