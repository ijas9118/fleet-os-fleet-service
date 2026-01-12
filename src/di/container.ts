import { DriverRepository } from "@/infrastructure/database/repositories/driver.repository";
import { DriverController } from "@/presentation/controllers/driver.controller";
import { CompleteDriverOnboardingUseCase } from "@/use-cases/driver/complete-driver-onboarding.use-case";

export function buildContainer() {
  // --- Repositories ---
  const driverRepo = new DriverRepository();

  // --- Use Cases ---
  const completeDriverOnboardingUC = new CompleteDriverOnboardingUseCase(driverRepo);

  // --- Controllers ---
  const driverController = new DriverController(completeDriverOnboardingUC);

  return {
    driverController,
  };
}
