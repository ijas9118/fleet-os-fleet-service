import { Router } from "express";

import { CompleteDriverOnboardingSchema } from "@/use-cases/driver/complete-driver-onboarding.dto";

import type { DriverController } from "../controllers/driver.controller";

import { validate } from "../middlewares";

export function buildDriverRoutes(controller: DriverController): Router {
  const router = Router();

  /**
   * POST /complete-onboarding
   * Complete driver onboarding with additional details
   */
  router.post(
    "/complete-onboarding",
    validate(CompleteDriverOnboardingSchema),
    controller.completeOnboarding,
  );

  return router;
}
