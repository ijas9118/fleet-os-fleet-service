import type { FuelType, VehicleType } from "@/domain/enums/vehicle.enum";

export interface CreateVehicleDTO {
  tenantId: string;
  registrationNumber: string;
  make: string;
  vehicleModel: string;
  year: number;
  vin: string;
  type: VehicleType;
  fuelType: FuelType;
  mileage: number;
  insuranceExpiryDate: Date;
  registrationExpiryDate: Date;
  notes?: string;
}
