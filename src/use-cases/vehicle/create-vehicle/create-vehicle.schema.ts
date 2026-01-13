import { z } from "zod";

import { FuelType, VehicleType } from "@/domain/enums/vehicle.enum";

export const CreateVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .max(20, "Registration number must be at most 20 characters")
    .toUpperCase(),
  make: z.string().min(1, "Make is required").max(50, "Make must be at most 50 characters"),
  vehicleModel: z.string().min(1, "Model is required").max(50, "Model must be at most 50 characters"),
  year: z
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, `Year cannot be more than ${new Date().getFullYear() + 1}`),
  vin: z
    .string()
    .min(17, "VIN must be exactly 17 characters")
    .max(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format")
    .toUpperCase(),
  type: z.enum(VehicleType),
  fuelType: z.enum(FuelType),
  mileage: z.number().min(0, "Mileage must be at least 0").default(0),
  insuranceExpiryDate: z.coerce.date().refine(date => date > new Date(), "Insurance expiry date must be in the future"),
  registrationExpiryDate: z.coerce
    .date()
    .refine(date => date > new Date(), "Registration expiry date must be in the future"),
  notes: z.string().max(500, "Notes must be at most 500 characters").optional(),
});

export type CreateVehicleSchemaType = z.infer<typeof CreateVehicleSchema>;
