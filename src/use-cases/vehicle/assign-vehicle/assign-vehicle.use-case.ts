import type { Vehicle } from "@/domain/entities";
import type { IDriverRepository } from "@/infrastructure/database/repositories/driver.repository.interface";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { AssignVehicleDTO } from "./assign-vehicle.dto";

export class AssignVehicleUseCase {
  constructor(
    private _vehicleRepo: IVehicleRepository,
    private _driverRepo: IDriverRepository,
  ) {}

  async execute(dto: AssignVehicleDTO): Promise<Vehicle> {
    // Check if vehicle exists
    const vehicle = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check if driver exists
    const driver = await this._driverRepo.findByUserId(dto.driverId);

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Validate same tenant
    if (driver.tenantId !== dto.tenantId) {
      throw new Error("Driver does not belong to the same tenant");
    }

    // Validate driver status is active
    if (driver.status !== "active") {
      throw new Error(`Cannot assign vehicle to driver with status: ${driver.status}. Driver must be active.`);
    }

    // Check if vehicle is available
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new Error(
        `Vehicle is not available for assignment. Current status: ${vehicle.status}. Please change status to AVAILABLE first.`,
      );
    }

    // Check if vehicle is already assigned
    if (vehicle.assignedDriverId) {
      throw new Error("Vehicle is already assigned to another driver. Please unassign first.");
    }

    // Check if driver already has a vehicle assigned
    const driverVehicle = await this._vehicleRepo.findByDriverId(dto.driverId, dto.tenantId);

    if (driverVehicle) {
      throw new Error(
        `Driver already has vehicle ${driverVehicle.registrationNumber} assigned. Please unassign first.`,
      );
    }

    // Assign driver to vehicle
    const updated = await this._vehicleRepo.assignDriver(dto.vehicleId, dto.driverId, dto.tenantId);

    if (!updated) {
      throw new Error("Failed to assign vehicle to driver");
    }

    // Update vehicle status to ASSIGNED
    const finalVehicle = await this._vehicleRepo.update(dto.vehicleId, dto.tenantId, {
      status: VehicleStatus.ASSIGNED,
      updatedAt: new Date(),
    });

    if (!finalVehicle) {
      throw new Error("Failed to update vehicle status");
    }

    return finalVehicle;
  }
}
