import { z } from "zod";

export const AssignVehicleSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  driverId: z.string().min(1, "Driver ID is required"),
});

export type AssignVehicleSchemaType = z.infer<typeof AssignVehicleSchema>;
