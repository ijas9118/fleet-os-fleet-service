import type { MaintenanceStatus } from "@ahammedijas/fleet-os-shared";

export interface UpdateMaintenanceStatusDTO {
  maintenanceId: string;
  tenantId: string;
  status: MaintenanceStatus;
}
