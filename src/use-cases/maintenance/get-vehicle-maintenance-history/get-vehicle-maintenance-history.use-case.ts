import type { MaintenanceRecord } from "@/domain/entities";
import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";

import type { GetVehicleMaintenanceHistoryDTO } from "./get-vehicle-maintenance-history.dto";

export class GetVehicleMaintenanceHistoryUseCase {
  constructor(private _maintenanceRepo: IMaintenanceRepository) {}

  async execute(dto: GetVehicleMaintenanceHistoryDTO): Promise<MaintenanceRecord[]> {
    const records = await this._maintenanceRepo.findByVehicleId(dto.vehicleId, dto.tenantId);
    return records;
  }
}
