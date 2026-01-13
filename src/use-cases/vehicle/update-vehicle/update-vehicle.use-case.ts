import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { UpdateVehicleDTO } from "./update-vehicle.dto";

export class UpdateVehicleUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: UpdateVehicleDTO): Promise<Vehicle> {
    // Check if vehicle exists
    const existing = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!existing) {
      throw new Error("Vehicle not found");
    }

    // Prevent updates to assigned vehicles if changing critical fields
    if (existing.status === VehicleStatus.ASSIGNED) {
      if (dto.registrationNumber || dto.vin) {
        throw new Error("Cannot update registration number or VIN of an assigned vehicle");
      }
    }

    // Check uniqueness if updating registration number
    if (dto.registrationNumber && dto.registrationNumber !== existing.registrationNumber) {
      const existingByRegNumber = await this._vehicleRepo.findByRegistrationNumber(
        dto.registrationNumber,
        dto.tenantId,
      );

      if (existingByRegNumber && existingByRegNumber.id !== dto.vehicleId) {
        throw new Error(`Vehicle with registration number ${dto.registrationNumber} already exists`);
      }
    }

    // Check uniqueness if updating VIN
    if (dto.vin && dto.vin !== existing.vin) {
      const existingByVin = await this._vehicleRepo.findByVin(dto.vin, dto.tenantId);

      if (existingByVin && existingByVin.id !== dto.vehicleId) {
        throw new Error(`Vehicle with VIN ${dto.vin} already exists`);
      }
    }

    // Prepare update data
    const updateData: Partial<Vehicle> = {
      ...dto,
      registrationNumber: dto.registrationNumber?.toUpperCase(),
      vin: dto.vin?.toUpperCase(),
      updatedAt: new Date(),
    };

    // Remove vehicleId and tenantId from update data
    delete (updateData as any).vehicleId;
    delete (updateData as any).tenantId;

    const updated = await this._vehicleRepo.update(dto.vehicleId, dto.tenantId, updateData);

    if (!updated) {
      throw new Error("Failed to update vehicle");
    }

    return updated;
  }
}
