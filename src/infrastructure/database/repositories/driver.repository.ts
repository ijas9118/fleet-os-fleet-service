import type { Driver } from "@/domain/entities";

import DriverModel from "@/infrastructure/database/models/driver.model";

import type { IDriverRepository } from "./driver.repository.interface";

/**
 * Driver Repository Implementation
 */
export class DriverRepository implements IDriverRepository {
  async create(data: Partial<Driver>): Promise<Driver> {
    const driver = new DriverModel(data);
    const saved = await driver.save();
    return this._toEntity(saved);
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    const driver = await DriverModel.findOne({ userId });
    return driver ? this._toEntity(driver) : null;
  }

  async findById(id: string): Promise<Driver | null> {
    const driver = await DriverModel.findById(id);
    return driver ? this._toEntity(driver) : null;
  }

  async update(userId: string, data: Partial<Driver>): Promise<Driver | null> {
    const driver = await DriverModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true },
    );
    return driver ? this._toEntity(driver) : null;
  }

  async findByTenantId(tenantId: string): Promise<Driver[]> {
    const drivers = await DriverModel.find({ tenantId });
    return drivers.map(d => this._toEntity(d));
  }

  async delete(userId: string): Promise<boolean> {
    const result = await DriverModel.deleteOne({ userId });
    return result.deletedCount > 0;
  }

  /**
   * Convert MongoDB document to domain entity
   */
  private _toEntity(doc: any): Driver {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      tenantId: doc.tenantId,
      licenseNumber: doc.licenseNumber,
      licenseExpiryDate: doc.licenseExpiryDate,
      phoneNumber: doc.phoneNumber,
      address: doc.address,
      emergencyContact: doc.emergencyContact,
      status: doc.status,
      onboardedAt: doc.onboardedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
