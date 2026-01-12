/**
 * Driver Domain Entity
 * Represents a driver in the fleet management system
 */
export interface Driver {
  /** Unique identifier for the driver record */
  id?: string;

  /** Reference to user ID from auth service */
  userId: string;

  /** Tenant ID this driver belongs to */
  tenantId: string;

  /** Driver's license number */
  licenseNumber: string;

  /** Driver's license expiry date */
  licenseExpiryDate: Date;

  /** Driver's phone number */
  phoneNumber: string;

  /** Driver's address */
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  /** Emergency contact information */
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };

  /** Driver status */
  status: "pending" | "active" | "inactive" | "suspended";

  /** Date when driver was onboarded */
  onboardedAt?: Date;

  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}
