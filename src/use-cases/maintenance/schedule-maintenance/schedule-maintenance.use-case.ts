import type { MaintenanceRecord } from "@/domain/entities";
import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { MaintenanceStatus } from "@/domain/enums/maintenance.enum";
import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { ScheduleMaintenanceDTO } from "./schedule-maintenance.dto";

export class ScheduleMaintenanceUseCase {
  constructor(
    private _maintenanceRepo: IMaintenanceRepository,
    private _vehicleRepo: IVehicleRepository,
  ) {}

  async execute(dto: ScheduleMaintenanceDTO): Promise<MaintenanceRecord> {
    // Check if vehicle exists
    const vehicle = await this._vehicleRepo.findById(dto.vehicleId, dto.tenantId);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Create maintenance record
    const maintenance = await this._maintenanceRepo.create({
      vehicleId: dto.vehicleId,
      tenantId: dto.tenantId,
      type: dto.type,
      status: MaintenanceStatus.SCHEDULED,
      description: dto.description,
      cost: dto.cost,
      scheduledDate: dto.scheduledDate,
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update vehicle's next maintenance date
    await this._vehicleRepo.update(dto.vehicleId, dto.tenantId, {
      nextMaintenanceDate: dto.scheduledDate,
      updatedAt: new Date(),
    });

    // Change vehicle status to MAINTENANCE
    await this._vehicleRepo.update(dto.vehicleId, dto.tenantId, {
      status: VehicleStatus.MAINTENANCE,
      updatedAt: new Date(),
    });

    return maintenance;
  }
}
