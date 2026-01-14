export interface ListVehiclesDTO {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  assignedDriverId?: string;
  includeDeleted?: boolean;
}
