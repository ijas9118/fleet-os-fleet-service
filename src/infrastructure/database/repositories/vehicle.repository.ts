import type { Vehicle } from "@/domain/entities";

import VehicleModel from "@/infrastructure/database/models/vehicle.model";

import type { IVehicleRepository } from "./vehicle.repository.interface";

/**
 * Vehicle Repository Implementation
 */
export class VehicleRepository implements IVehicleRepository {
  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = new VehicleModel(data);
    const saved = await vehicle.save();
    return this._toEntity(saved);
  }

  async findById(id: string, tenantId: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOne({
      _id: id,
      tenantId,
      deletedAt: null,
    });
    return vehicle ? this._toEntity(vehicle) : null;
  }

  async findByVin(vin: string, tenantId: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOne({
      vin: vin.toUpperCase(),
      tenantId,
      deletedAt: null,
    });
    return vehicle ? this._toEntity(vehicle) : null;
  }

  async findByRegistrationNumber(registrationNumber: string, tenantId: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOne({
      registrationNumber: registrationNumber.toUpperCase(),
      tenantId,
      deletedAt: null,
    });
    return vehicle ? this._toEntity(vehicle) : null;
  }

  async findAll(params: {
    tenantId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    assignedDriverId?: string;
    includeDeleted?: boolean;
  }): Promise<{ vehicles: Vehicle[]; total: number }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter: any = { tenantId: params.tenantId };

    if (!params.includeDeleted) {
      filter.deletedAt = null;
    }

    if (params.status) {
      filter.status = params.status;
    }

    if (params.type) {
      filter.type = params.type;
    }

    if (params.assignedDriverId !== undefined) {
      // If assignedDriverId is empty string, find unassigned vehicles
      filter.assignedDriverId = params.assignedDriverId === "" ? null : params.assignedDriverId;
    }

    // Search across multiple fields
    if (params.search) {
      const searchRegex = new RegExp(params.search, "i");
      filter.$or = [
        { registrationNumber: searchRegex },
        { make: searchRegex },
        { vehicleModel: searchRegex },
        { vin: searchRegex },
      ];
    }

    const [vehicles, total] = await Promise.all([
      VehicleModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      VehicleModel.countDocuments(filter),
    ]);

    return {
      vehicles: vehicles.map(v => this._toEntity(v)),
      total,
    };
  }

  async update(id: string, tenantId: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOneAndUpdate(
      { _id: id, tenantId, deletedAt: null },
      { $set: data },
      { new: true },
    );
    return vehicle ? this._toEntity(vehicle) : null;
  }

  async softDelete(id: string, tenantId: string): Promise<boolean> {
    const result = await VehicleModel.findOneAndUpdate(
      { _id: id, tenantId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true },
    );
    return !!result;
  }

  async assignDriver(vehicleId: string, driverId: string, tenantId: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOneAndUpdate(
      { _id: vehicleId, tenantId, deletedAt: null },
      { $set: { assignedDriverId: driverId } },
      { new: true },
    );
    return vehicle ? this._toEntity(vehicle) : null;
  }

  async unassignDriver(vehicleId: string, tenantId: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOneAndUpdate(
      { _id: vehicleId, tenantId, deletedAt: null },
      { $set: { assignedDriverId: null } },
      { new: true },
    );
    return vehicle ? this._toEntity(vehicle) : null;
  }

  async findByDriverId(driverId: string, tenantId: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findOne({
      assignedDriverId: driverId,
      tenantId,
      deletedAt: null,
    });
    return vehicle ? this._toEntity(vehicle) : null;
  }

  /**
   * Convert MongoDB document to domain entity
   */
  private _toEntity(doc: any): Vehicle {
    return {
      id: doc._id.toString(),
      tenantId: doc.tenantId,
      registrationNumber: doc.registrationNumber,
      make: doc.make,
      vehicleModel: doc.vehicleModel,
      year: doc.year,
      vin: doc.vin,
      type: doc.type,
      fuelType: doc.fuelType,
      status: doc.status,
      mileage: doc.mileage,
      lastMaintenanceDate: doc.lastMaintenanceDate,
      nextMaintenanceDate: doc.nextMaintenanceDate,
      insuranceExpiryDate: doc.insuranceExpiryDate,
      registrationExpiryDate: doc.registrationExpiryDate,
      assignedDriverId: doc.assignedDriverId,
      notes: doc.notes,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
