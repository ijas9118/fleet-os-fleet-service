import { Router } from "express";

import type { buildContainer } from "@/di/container";

import { buildDriverRoutes } from "./driver.routes";
import { buildMaintenanceRoutes, buildVehicleMaintenanceRoutes } from "./maintenance.routes";
import { buildVehicleRoutes } from "./vehicle.routes";

export function buildRoutes(container: ReturnType<typeof buildContainer>) {
  const router = Router();

  // Mount routes
  router.use("/drivers", buildDriverRoutes(container.driverController));
  router.use("/vehicles", buildVehicleRoutes(container.vehicleController));
  router.use("/vehicles", buildVehicleMaintenanceRoutes(container.maintenanceController));
  router.use("/maintenance", buildMaintenanceRoutes(container.maintenanceController));

  return router;
}
