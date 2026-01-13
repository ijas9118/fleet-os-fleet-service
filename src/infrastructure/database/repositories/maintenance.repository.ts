import type { MaintenanceRecord } from "@/domain/entities";

import MaintenanceModel from "@/infrastructure/database/models/maintenance.model";

import type { IMaintenanceRepository } from "./maintenance.repository.interface";

/**
 * Maintenance Repository Implementation
 */
export class MaintenanceRepository implements IMaintenanceRepository {
  async create(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const maintenance = new MaintenanceModel(data);
    const saved = await maintenance.save();
    return this._toEntity(saved);
  }

  async findById(id: string, tenantId: string): Promise<MaintenanceRecord | null> {
    const maintenance = await MaintenanceModel.findOne({
      _id: id,
      tenantId,
    });
    return maintenance ? this._toEntity(maintenance) : null;
  }

  async findByVehicleId(vehicleId: string, tenantId: string): Promise<MaintenanceRecord[]> {
    const records = await MaintenanceModel.find({
      vehicleId,
      tenantId,
    }).sort({ scheduledDate: -1 });

    return records.map(r => this._toEntity(r));
  }

  async findAll(params: {
    tenantId: string;
    vehicleId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ records: MaintenanceRecord[]; total: number }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter: any = { tenantId: params.tenantId };

    if (params.vehicleId) {
      filter.vehicleId = params.vehicleId;
    }

    if (params.status) {
      filter.status = params.status;
    }

    const [records, total] = await Promise.all([
      MaintenanceModel.find(filter).sort({ scheduledDate: -1 }).skip(skip).limit(limit).lean(),
      MaintenanceModel.countDocuments(filter),
    ]);

    return {
      records: records.map(r => this._toEntity(r)),
      total,
    };
  }

  async update(id: string, tenantId: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | null> {
    const maintenance = await MaintenanceModel.findOneAndUpdate({ _id: id, tenantId }, { $set: data }, { new: true });
    return maintenance ? this._toEntity(maintenance) : null;
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const result = await MaintenanceModel.deleteOne({ _id: id, tenantId });
    return result.deletedCount > 0;
  }

  /**
   * Convert MongoDB document to domain entity
   */
  private _toEntity(doc: any): MaintenanceRecord {
    return {
      id: doc._id.toString(),
      vehicleId: doc.vehicleId,
      tenantId: doc.tenantId,
      type: doc.type,
      status: doc.status,
      description: doc.description,
      cost: doc.cost,
      scheduledDate: doc.scheduledDate,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      performedBy: doc.performedBy,
      mileageAtMaintenance: doc.mileageAtMaintenance,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
