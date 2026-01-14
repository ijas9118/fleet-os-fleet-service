import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { ArchiveVehicleDTO } from "./archive-vehicle.dto";

export class ArchiveVehicleUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: ArchiveVehicleDTO): Promise<void> {
    // Check if vehicle exists
    const existing = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!existing) {
      throw new Error("Vehicle not found");
    }

    // Business rule: Cannot delete assigned vehicles
    if (existing.status === VehicleStatus.ASSIGNED || existing.assignedDriverId) {
      throw new Error("Cannot archive an assigned vehicle. Please unassign the driver first.");
    }

    const success = await this._vehicleRepo.softDelete(dto.vehicleId, dto.tenantId);

    if (!success) {
      throw new Error("Failed to archive vehicle");
    }
  }
}
