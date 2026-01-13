import { DriverRepository } from "@/infrastructure/database/repositories/driver.repository";
import { MaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository";
import { VehicleRepository } from "@/infrastructure/database/repositories/vehicle.repository";
import { DriverController } from "@/presentation/controllers/driver.controller";
import { MaintenanceController } from "@/presentation/controllers/maintenance.controller";
import { VehicleController } from "@/presentation/controllers/vehicle.controller";
import { CompleteDriverOnboardingUseCase } from "@/use-cases/driver/complete-driver-onboarding.use-case";
import { CompleteMaintenanceUseCase } from "@/use-cases/maintenance/complete-maintenance";
import { ScheduleMaintenanceUseCase } from "@/use-cases/maintenance/schedule-maintenance";
import { ArchiveVehicleUseCase } from "@/use-cases/vehicle/archive-vehicle";
import { AssignVehicleUseCase } from "@/use-cases/vehicle/assign-vehicle";
import { CreateVehicleUseCase } from "@/use-cases/vehicle/create-vehicle";
import { GetVehicleUseCase } from "@/use-cases/vehicle/get-vehicle";
import { ListVehiclesUseCase } from "@/use-cases/vehicle/list-vehicles";
import { UnassignVehicleUseCase } from "@/use-cases/vehicle/unassign-vehicle";
import { UpdateVehicleUseCase } from "@/use-cases/vehicle/update-vehicle";
import { UpdateVehicleStatusUseCase } from "@/use-cases/vehicle/update-vehicle-status";

export function buildContainer() {
  // --- Repositories ---
  const driverRepo = new DriverRepository();
  const vehicleRepo = new VehicleRepository();
  const maintenanceRepo = new MaintenanceRepository();

  // --- Driver Use Cases ---
  const completeDriverOnboardingUC = new CompleteDriverOnboardingUseCase(driverRepo);

  // --- Vehicle Use Cases ---
  const createVehicleUC = new CreateVehicleUseCase(vehicleRepo);
  const listVehiclesUC = new ListVehiclesUseCase(vehicleRepo);
  const getVehicleUC = new GetVehicleUseCase(vehicleRepo);
  const updateVehicleUC = new UpdateVehicleUseCase(vehicleRepo);
  const updateVehicleStatusUC = new UpdateVehicleStatusUseCase(vehicleRepo);
  const archiveVehicleUC = new ArchiveVehicleUseCase(vehicleRepo);
  const assignVehicleUC = new AssignVehicleUseCase(vehicleRepo, driverRepo);
  const unassignVehicleUC = new UnassignVehicleUseCase(vehicleRepo);

  // --- Maintenance Use Cases ---
  const scheduleMaintenanceUC = new ScheduleMaintenanceUseCase(maintenanceRepo, vehicleRepo);
  const completeMaintenanceUC = new CompleteMaintenanceUseCase(maintenanceRepo, vehicleRepo);

  // --- Controllers ---
  const driverController = new DriverController(completeDriverOnboardingUC);
  const vehicleController = new VehicleController(
    createVehicleUC,
    listVehiclesUC,
    getVehicleUC,
    updateVehicleUC,
    updateVehicleStatusUC,
    archiveVehicleUC,
    assignVehicleUC,
    unassignVehicleUC,
  );
  const maintenanceController = new MaintenanceController(
    scheduleMaintenanceUC,
    completeMaintenanceUC,
    maintenanceRepo,
  );

  return {
    driverController,
    vehicleController,
    maintenanceController,
  };
}
