import type { Document } from "mongoose";

import { model, Schema } from "mongoose";

import type { Vehicle } from "@/domain/entities";

import { FuelType, VehicleStatus, VehicleType } from "@/domain/enums/vehicle.enum";

export interface IVehicleDocument extends Omit<Vehicle, "id">, Document<string> {}

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    vin: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    fuelType: {
      type: String,
      enum: Object.values(FuelType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VehicleStatus),
      default: VehicleStatus.AVAILABLE,
      required: true,
      index: true,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lastMaintenanceDate: {
      type: Date,
      required: false,
    },
    nextMaintenanceDate: {
      type: Date,
      required: false,
    },
    insuranceExpiryDate: {
      type: Date,
      required: true,
    },
    registrationExpiryDate: {
      type: Date,
      required: true,
    },
    assignedDriverId: {
      type: String,
      required: false,
      default: null,
      index: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient queries
vehicleSchema.index({ tenantId: 1, status: 1 });
vehicleSchema.index({ tenantId: 1, registrationNumber: 1 }, { unique: true });
vehicleSchema.index({ tenantId: 1, deletedAt: 1 });
vehicleSchema.index({ assignedDriverId: 1 });

const VehicleModel = model<IVehicleDocument>("Vehicle", vehicleSchema);

export default VehicleModel;
