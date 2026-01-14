import type { MaintenanceRecord } from "@/domain/entities";
import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";

import type { GetMaintenanceByIdDTO } from "./get-maintenance-by-id.dto";

export class GetMaintenanceByIdUseCase {
  constructor(private _maintenanceRepo: IMaintenanceRepository) {}

  async execute(dto: GetMaintenanceByIdDTO): Promise<MaintenanceRecord | null> {
    const maintenance = await this._maintenanceRepo.findById(dto.maintenanceId, dto.tenantId);
    return maintenance;
  }
}
