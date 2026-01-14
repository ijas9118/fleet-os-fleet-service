import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import type { GetDriverVehicleDTO } from "./get-driver-vehicle.dto";

export class GetDriverVehicleUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: GetDriverVehicleDTO): Promise<Vehicle | null> {
    const vehicle = await this._vehicleRepo.findByDriverId(dto.driverId, dto.tenantId);

    // Returns null if driver has no vehicle assigned
    return vehicle;
  }
}
