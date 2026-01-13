import type { MaintenanceRecord } from "@/domain/entities";
import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";

import type { UpdateMaintenanceStatusDTO } from "./update-maintenance-status.dto";

export class UpdateMaintenanceStatusUseCase {
  constructor(private _maintenanceRepo: IMaintenanceRepository) {}

  async execute(dto: UpdateMaintenanceStatusDTO): Promise<MaintenanceRecord> {
    // Get existing maintenance record
    const maintenance = await this._maintenanceRepo.findById(dto.maintenanceId, dto.tenantId);

    if (!maintenance) {
      throw new Error("Maintenance record not found");
    }

    // Update status
    const updated = await this._maintenanceRepo.update(dto.maintenanceId, dto.tenantId, {
      status: dto.status,
    });

    if (!updated) {
      throw new Error("Failed to update maintenance status");
    }

    return updated;
  }
}
