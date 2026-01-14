import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { UnassignVehicleDTO } from "./unassign-vehicle.dto";

export class UnassignVehicleUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: UnassignVehicleDTO): Promise<Vehicle> {
    // Check if vehicle exists
    const vehicle = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check if vehicle has an assigned driver
    if (!vehicle.assignedDriverId) {
      throw new Error("Vehicle does not have an assigned driver");
    }

    // Unassign driver from vehicle
    const updated = await this._vehicleRepo.unassignDriver(dto.vehicleId, dto.tenantId);

    if (!updated) {
      throw new Error("Failed to unassign driver from vehicle");
    }

    // Update vehicle status to AVAILABLE
    const finalVehicle = await this._vehicleRepo.update(dto.vehicleId, dto.tenantId, {
      status: VehicleStatus.AVAILABLE,
      updatedAt: new Date(),
    });

    if (!finalVehicle) {
      throw new Error("Failed to update vehicle status");
    }

    return finalVehicle;
  }
}
