import { Router } from "express";

import { AssignVehicleSchema } from "@/use-cases/vehicle/assign-vehicle";
import { CreateVehicleSchema } from "@/use-cases/vehicle/create-vehicle";
import { UpdateVehicleSchema } from "@/use-cases/vehicle/update-vehicle";
import { UpdateVehicleStatusSchema } from "@/use-cases/vehicle/update-vehicle-status";

import type { VehicleController } from "../controllers/vehicle.controller";

import { requireAuth, validate } from "../middlewares";

export function buildVehicleRoutes(controller: VehicleController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", validate(CreateVehicleSchema), controller.createVehicle);
  router.get("/", controller.listVehicles);
  router.get("/:id", controller.getVehicle);
  router.put("/:id", validate(UpdateVehicleSchema), controller.updateVehicle);
  router.patch("/:id/status", validate(UpdateVehicleStatusSchema), controller.updateVehicleStatus);
  router.delete("/:id", controller.archiveVehicle);
  router.post("/:id/assign", validate(AssignVehicleSchema), controller.assignVehicleToDriver);
  router.post("/:id/unassign", controller.unassignVehicle);

  return router;
}
