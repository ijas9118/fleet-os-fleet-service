import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { IMaintenanceRepository } from "@/infrastructure/database/repositories/maintenance.repository.interface";
import type { CompleteMaintenanceUseCase } from "@/use-cases/maintenance/complete-maintenance";
import type { ScheduleMaintenanceUseCase } from "@/use-cases/maintenance/schedule-maintenance";

export class MaintenanceController {
  constructor(
    private _scheduleMaintenanceUC: ScheduleMaintenanceUseCase,
    private _completeMaintenanceUC: CompleteMaintenanceUseCase,
    private _maintenanceRepo: IMaintenanceRepository,
  ) {}

  scheduleMaintenance = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Tenant ID not found in request",
        });
        return;
      }

      const maintenance = await this._scheduleMaintenanceUC.execute({
        ...req.body,
        tenantId,
      });

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Maintenance scheduled successfully",
        data: maintenance,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to schedule maintenance",
      });
    }
  };

  completeMaintenance = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;
      const { id } = req.params;

      if (!tenantId) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Tenant ID not found in request",
        });
        return;
      }

      const maintenance = await this._completeMaintenanceUC.execute({
        maintenanceId: id,
        tenantId,
        ...req.body,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Maintenance completed successfully",
        data: maintenance,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to complete maintenance",
      });
    }
  };

  listMaintenance = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId as string;
      const page = Number.parseInt(req.query.page as string) || 1;
      const limit = Number.parseInt(req.query.limit as string) || 10;
      const vehicleId = req.query.vehicleId as string;
      const status = req.query.status as string;

      const result = await this._maintenanceRepo.findAll({
        tenantId,
        vehicleId,
        status,
        page,
        limit,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Maintenance records retrieved successfully",
        data: {
          records: result.records,
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to retrieve maintenance records",
      });
    }
  };

  getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;
      const { id } = req.params;

      if (!tenantId) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Tenant ID not found in request",
        });
        return;
      }

      const maintenance = await this._maintenanceRepo.findById(id as string, tenantId);

      if (!maintenance) {
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Maintenance record not found",
        });
        return;
      }

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Maintenance record retrieved successfully",
        data: maintenance,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to retrieve maintenance record",
      });
    }
  };

  getVehicleMaintenanceHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;
      const { vehicleId } = req.params;

      if (!tenantId) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Tenant ID not found in request",
        });
        return;
      }

      const records = await this._maintenanceRepo.findByVehicleId(vehicleId as string, tenantId);

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle maintenance history retrieved successfully",
        data: records,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to retrieve vehicle maintenance history",
      });
    }
  };
}
