import type { MaintenanceType } from "@/domain/enums/maintenance.enum";

export interface ScheduleMaintenanceDTO {
  vehicleId: string;
  tenantId: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  scheduledDate: Date;
  notes?: string;
}
