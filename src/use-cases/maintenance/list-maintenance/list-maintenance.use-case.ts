import type { MaintenanceRecord } from "@/domain/entities";
import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";

import type { ListMaintenanceDTO } from "./list-maintenance.dto";

export class ListMaintenanceUseCase {
  constructor(private _maintenanceRepo: IMaintenanceRepository) {}

  async execute(dto: ListMaintenanceDTO): Promise<{
    data: MaintenanceRecord[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;

    const result = await this._maintenanceRepo.findAll({
      tenantId: dto.tenantId,
      vehicleId: dto.vehicleId,
      status: dto.status,
      page,
      limit,
    });

    return {
      data: result.records,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
