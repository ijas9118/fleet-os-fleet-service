import type { VehicleStatus } from "@/domain/enums/vehicle.enum";

export interface UpdateVehicleStatusDTO {
  vehicleId: string;
  tenantId: string;
  status: VehicleStatus;
}
