import type { MaintenanceRecord } from "@/domain/entities";
import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";
import type { IVehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository.interface";

import { MaintenanceStatus } from "@/domain/enums/maintenance.enum";
import { VehicleStatus } from "@/domain/enums/vehicle.enum";

import type { CompleteMaintenanceDTO } from "./complete-maintenance.dto";

export class CompleteMaintenanceUseCase {
  constructor(
    private _maintenanceRepo: IMaintenanceRepository,
    private _vehicleRepo: IVehicleRepository,
  ) {}

  async execute(dto: CompleteMaintenanceDTO): Promise<MaintenanceRecord> {
    // Check if maintenance record exists
    const maintenance = await this._maintenanceRepo.findById(dto.maintenanceId, dto.tenantId);

    if (!maintenance) {
      throw new Error("Maintenance record not found");
    }

    // Check if maintenance is already completed
    if (maintenance.status === MaintenanceStatus.COMPLETED) {
      throw new Error("Maintenance is already completed");
    }

    // Check if vehicle exists
    const vehicle = await this._vehicleRepo.findById(maintenance.vehicleId, dto.tenantId);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Update maintenance record to completed
    const updated = await this._maintenanceRepo.update(dto.maintenanceId, dto.tenantId, {
      status: MaintenanceStatus.COMPLETED,
      completedAt: new Date(),
      performedBy: dto.performedBy,
      mileageAtMaintenance: dto.mileageAtMaintenance,
      cost: dto.actualCost !== undefined ? dto.actualCost : maintenance.cost,
      notes: dto.notes ? `${maintenance.notes || ""}\n${dto.notes}`.trim() : maintenance.notes,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new Error("Failed to update maintenance record");
    }

    // Update vehicle's last maintenance date and mileage
    await this._vehicleRepo.update(maintenance.vehicleId, dto.tenantId, {
      lastMaintenanceDate: new Date(),
      mileage: dto.mileageAtMaintenance,
      updatedAt: new Date(),
    });

    // Change vehicle status back to AVAILABLE (only if currently in MAINTENANCE)
    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      await this._vehicleRepo.update(maintenance.vehicleId, dto.tenantId, {
        status: VehicleStatus.AVAILABLE,
        updatedAt: new Date(),
      });
    }

    return updated;
  }
}
