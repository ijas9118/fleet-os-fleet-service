import type { Document } from "mongoose";

import { model, Schema } from "mongoose";

import type { Driver } from "@/domain/entities";

export interface IDriverDocument extends Omit<Driver, "id">, Document<string> {}

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { _id: false },
);

const driverSchema = new Schema<IDriverDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    licenseNumber: {
      type: String,
      required: false, // Not required initially, completed during onboarding
      sparse: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: addressSchema,
      required: false,
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "suspended"],
      default: "pending",
      required: true,
    },
    onboardedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient tenant-based queries
driverSchema.index({ tenantId: 1, status: 1 });

const DriverModel = model<IDriverDocument>("Driver", driverSchema);

export default DriverModel;
