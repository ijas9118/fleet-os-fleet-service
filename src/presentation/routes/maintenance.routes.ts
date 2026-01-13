import { Router } from "express";

import { CompleteMaintenanceSchema } from "@/use-cases/maintenance/complete-maintenance";
import { ScheduleMaintenanceSchema } from "@/use-cases/maintenance/schedule-maintenance";

import type { MaintenanceController } from "../controllers/maintenance.controller";

import { requireAuth, validate } from "../middlewares";

export function buildMaintenanceRoutes(controller: MaintenanceController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", validate(ScheduleMaintenanceSchema), controller.scheduleMaintenance);
  router.patch("/:id/complete", validate(CompleteMaintenanceSchema), controller.completeMaintenance);
  router.get("/", controller.listMaintenance);
  router.get("/:id", controller.getMaintenanceById);

  return router;
}

export function buildVehicleMaintenanceRoutes(controller: MaintenanceController): Router {
  const router = Router();

  router.use(requireAuth);

  router.get("/:vehicleId/maintenance", controller.getVehicleMaintenanceHistory);

  return router;
}
