import { z } from "zod";

export const CompleteDriverOnboardingSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDate: z.coerce.date().refine(
    date => date > new Date(),
    "License expiry date must be in the future",
  ),
  phoneNumber: z.string().regex(
    /^\+?[1-9]\d{1,14}$/,
    "Invalid phone number format",
  ),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phoneNumber: z.string().regex(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid emergency contact phone number format",
    ),
  }),
});

export type CompleteDriverOnboardingDTO = z.infer<typeof CompleteDriverOnboardingSchema>;
