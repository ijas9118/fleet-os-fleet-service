import type { Vehicle } from "@/domain/entities";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import type { ListVehiclesDTO } from "./list-vehicles.dto";

export class ListVehiclesUseCase {
  constructor(private _vehicleRepo: IVehicleRepository) {}

  async execute(dto: ListVehiclesDTO): Promise<{
    data: Vehicle[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;

    const { vehicles, total } = await this._vehicleRepo.findAll({
      tenantId: dto.tenantId,
      page,
      limit,
      search: dto.search,
      status: dto.status,
      type: dto.type,
      assignedDriverId: dto.assignedDriverId,
      includeDeleted: dto.includeDeleted || false,
    });

    return {
      data: vehicles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
