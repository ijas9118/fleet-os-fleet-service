import { Router } from "express";

import type { buildContainer } from "@/di/container";

import { buildDriverRoutes } from "./driver.routes";

export function buildRoutes(container: ReturnType<typeof buildContainer>) {
  const router = Router();

  // Mount routes
  router.use("/drivers", buildDriverRoutes(container.driverController));

  return router;
}
