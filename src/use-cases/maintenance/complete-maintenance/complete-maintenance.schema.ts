import { z } from "zod";

export const CompleteMaintenanceSchema = z.object({
  performedBy: z.string().min(1, "Performed by is required"),
  mileageAtMaintenance: z.number().min(0, "Mileage must be at least 0"),
  actualCost: z.number().min(0, "Cost must be at least 0").optional(),
  notes: z.string().max(1000, "Notes must be at most 1000 characters").optional(),
});

export type CompleteMaintenanceSchemaType = z.infer<typeof CompleteMaintenanceSchema>;
