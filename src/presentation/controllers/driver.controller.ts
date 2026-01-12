import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CompleteDriverOnboardingDTO } from "@/use-cases/driver/complete-driver-onboarding.dto";
import type { CompleteDriverOnboardingUseCase } from "@/use-cases/driver/complete-driver-onboarding.use-case";

/**
 * Driver HTTP Controller
 */
export class DriverController {
  constructor(
    private _completeOnboardingUseCase: CompleteDriverOnboardingUseCase,
  ) {}

  /**
   * Complete driver onboarding
   */
  completeOnboarding = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CompleteDriverOnboardingDTO = req.body;

      const driver = await this._completeOnboardingUseCase.execute(data);

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Driver onboarding completed successfully",
        data: driver,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to complete driver onboarding",
      });
    }
  };
}
