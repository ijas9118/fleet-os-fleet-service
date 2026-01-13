import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { UpdateVehicleStatusDTO } from "./update-vehicle-status.dto";

export class UpdateVehicleStatusUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: UpdateVehicleStatusDTO): Promise<Vehicle> {
    // Check if vehicle exists
    const existing = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!existing) {
      throw new Error("Vehicle not found");
    }

    // Business rule: Cannot change status to ASSIGNED if vehicle is in MAINTENANCE or OUT_OF_SERVICE
    if (dto.status === VehicleStatus.ASSIGNED) {
      if (existing.status === VehicleStatus.MAINTENANCE || existing.status === VehicleStatus.OUT_OF_SERVICE) {
        throw new Error(
          `Cannot assign vehicle that is in ${existing.status} status. Please change status to AVAILABLE first.`,
        );
      }
    }

    // Business rule: Cannot change from ASSIGNED status directly (must unassign first)
    if (existing.status === VehicleStatus.ASSIGNED && dto.status !== VehicleStatus.ASSIGNED) {
      if (existing.assignedDriverId) {
        throw new Error("Cannot change status of an assigned vehicle. Please unassign the driver first.");
      }
    }

    const updated = await this._vehicleRepo.update(dto.vehicleId, dto.tenantId, {
      status: dto.status,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new Error("Failed to update vehicle status");
    }

    return updated;
  }
}
