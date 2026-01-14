import type { FuelType, VehicleType } from "@/domain/enums/vehicle.enum";

export interface UpdateVehicleDTO {
  vehicleId: string;
  tenantId: string;
  registrationNumber?: string;
  make?: string;
  vehicleModel?: string;
  year?: number;
  vin?: string;
  type?: VehicleType;
  fuelType?: FuelType;
  mileage?: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  insuranceExpiryDate?: Date;
  registrationExpiryDate?: Date;
  notes?: string;
}
