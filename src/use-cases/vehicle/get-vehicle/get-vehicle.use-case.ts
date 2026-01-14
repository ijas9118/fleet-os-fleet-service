import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import type { GetVehicleDTO } from "./get-vehicle.dto";

export class GetVehicleUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: GetVehicleDTO): Promise<Vehicle> {
    const vehicle = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return vehicle;
  }
}
