import { z } from "zod";

import { MaintenanceType } from "@/domain/enums/maintenance.enum";

export const ScheduleMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  type: z.enum(Object.values(MaintenanceType) as [string, ...string[]]),
  description: z.string().min(1, "Description is required").max(500, "Description must be at most 500 characters"),
  cost: z.number().min(0, "Cost must be at least 0").optional(),
  scheduledDate: z.coerce.date().refine(date => date >= new Date(), "Scheduled date cannot be in the past"),
  notes: z.string().max(1000, "Notes must be at most 1000 characters").optional(),
});

export type ScheduleMaintenanceSchemaType = z.infer<typeof ScheduleMaintenanceSchema>;
