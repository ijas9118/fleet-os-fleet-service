export interface ListMaintenanceDTO {
  tenantId: string;
  page?: number;
  limit?: number;
  vehicleId?: string;
  status?: string;
}
