export interface CompleteMaintenanceDTO {
  maintenanceId: string;
  tenantId: string;
  performedBy: string;
  mileageAtMaintenance: number;
  actualCost?: number;
  notes?: string;
}
