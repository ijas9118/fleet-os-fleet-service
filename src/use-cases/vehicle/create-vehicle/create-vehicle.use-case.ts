import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { CreateVehicleDTO } from "./create-vehicle.dto";

export class CreateVehicleUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: CreateVehicleDTO): Promise<Vehicle> {
    // Check if registration number already exists for this tenant
    const existingByRegNumber = await this._vehicleRepo.findByRegistrationNumber(
      dto.registrationNumber,
      dto.tenantId,
    );

    if (existingByRegNumber) {
      throw new Error(`Vehicle with registration number ${dto.registrationNumber} already exists`);
    }

    // Check if VIN already exists
    const existingByVin = await this._vehicleRepo.findByVin(dto.vin, dto.tenantId);

    if (existingByVin) {
      throw new Error(`Vehicle with VIN ${dto.vin} already exists`);
    }

    // Create vehicle
    const vehicle = await this._vehicleRepo.create({
      tenantId: dto.tenantId,
      registrationNumber: dto.registrationNumber.toUpperCase(),
      make: dto.make,
      vehicleModel: dto.vehicleModel,
      year: dto.year,
      vin: dto.vin.toUpperCase(),
      type: dto.type,
      fuelType: dto.fuelType,
      status: VehicleStatus.AVAILABLE,
      mileage: dto.mileage || 0,
      insuranceExpiryDate: dto.insuranceExpiryDate,
      registrationExpiryDate: dto.registrationExpiryDate,
      notes: dto.notes,
      assignedDriverId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return vehicle;
  }
}
