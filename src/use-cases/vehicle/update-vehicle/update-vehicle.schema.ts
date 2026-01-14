import { z } from "zod";

import { FuelType, VehicleType } from "@/domain/enums/vehicle.enum";

export const UpdateVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .max(20, "Registration number must be at most 20 characters")
    .toUpperCase()
    .optional(),
  make: z.string().min(1, "Make is required").max(50, "Make must be at most 50 characters").optional(),
  vehicleModel: z.string().min(1, "Model is required").max(50, "Model must be at most 50 characters").optional(),
  year: z
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, `Year cannot be more than ${new Date().getFullYear() + 1}`)
    .optional(),
  vin: z
    .string()
    .min(17, "VIN must be exactly 17 characters")
    .max(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format")
    .toUpperCase()
    .optional(),
  type: z.enum(VehicleType).optional(),
  fuelType: z.enum(FuelType).optional(),
  mileage: z.number().min(0, "Mileage must be at least 0").optional(),
  lastMaintenanceDate: z.coerce.date().optional(),
  nextMaintenanceDate: z.coerce.date().optional(),
  insuranceExpiryDate: z.coerce
    .date()
    .refine(date => date > new Date(), "Insurance expiry date must be in the future")
    .optional(),
  registrationExpiryDate: z.coerce
    .date()
    .refine(date => date > new Date(), "Registration expiry date must be in the future")
    .optional(),
  notes: z.string().max(500, "Notes must be at most 500 characters").optional(),
});

export type UpdateVehicleSchemaType = z.infer<typeof UpdateVehicleSchema>;
