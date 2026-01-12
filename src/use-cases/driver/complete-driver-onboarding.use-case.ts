import type { Driver } from "@/domain/entities";
import type { IDriverRepository } from "@/infrastructure/database/repositories/driver.repository.interface";

/**
 * Use Case: Complete Driver Onboarding
 * Completes the driver onboarding process by adding driver details
 */
import { AuthServiceClient } from "@/infrastructure/http/auth-service.client";

export interface CompleteDriverOnboardingInput {
  userId: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export class CompleteDriverOnboardingUseCase {
  private _authServiceClient: AuthServiceClient;

  constructor(private _driverRepository: IDriverRepository) {
    this._authServiceClient = new AuthServiceClient();
  }

  async execute(input: CompleteDriverOnboardingInput): Promise<Driver> {
    // Find existing driver
    const driver = await this._driverRepository.findByUserId(input.userId);

    if (!driver) {
      throw new Error("Driver not found. Please ensure the driver invitation was accepted.");
    }

    if (driver.status === "active") {
      throw new Error("Driver onboarding is already completed.");
    }

    // Update driver with onboarding details
    const updated = await this._driverRepository.update(input.userId, {
      licenseNumber: input.licenseNumber,
      licenseExpiryDate: input.licenseExpiryDate,
      phoneNumber: input.phoneNumber,
      address: input.address,
      emergencyContact: input.emergencyContact,
      status: "active",
      onboardedAt: new Date(),
    });

    if (!updated) {
      throw new Error("Failed to update driver information.");
    }

    // Notify Auth Service
    await this._authServiceClient.markUserOnboarded(input.userId);

    return updated;
  }
}
