import type { Document } from "mongoose";

import { model, Schema } from "mongoose";

import type { MaintenanceRecord } from "@/domain/entities";

import { MaintenanceStatus, MaintenanceType } from "@/domain/enums/maintenance.enum";

export interface IMaintenanceDocument extends Omit<MaintenanceRecord, "id">, Document<string> {}

const maintenanceSchema = new Schema<IMaintenanceDocument>(
  {
    vehicleId: {
      type: String,
      required: true,
      index: true,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(MaintenanceType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MaintenanceStatus),
      required: true,
      default: MaintenanceStatus.SCHEDULED,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      min: 0,
      required: false,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    startedAt: {
      type: Date,
      required: false,
    },
    completedAt: {
      type: Date,
      required: false,
    },
    performedBy: {
      type: String,
      required: false,
    },
    mileageAtMaintenance: {
      type: Number,
      min: 0,
      required: false,
    },
    notes: {
      type: String,
      trim: true,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient queries
maintenanceSchema.index({ tenantId: 1, vehicleId: 1 });
maintenanceSchema.index({ tenantId: 1, status: 1 });
maintenanceSchema.index({ vehicleId: 1, scheduledDate: 1 });

const MaintenanceModel = model<IMaintenanceDocument>("MaintenanceRecord", maintenanceSchema);

export default MaintenanceModel;
