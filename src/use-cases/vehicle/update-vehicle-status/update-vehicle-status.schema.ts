import { z } from "zod";

import { VehicleStatus } from "@/domain/enums/vehicle.enum";

export const UpdateVehicleStatusSchema = z.object({
  status: z.enum(VehicleStatus),
});

export type UpdateVehicleStatusSchemaType = z.infer<typeof UpdateVehicleStatusSchema>;
