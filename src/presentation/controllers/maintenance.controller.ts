import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CompleteMaintenanceUseCase } from "@/use-cases/maintenance/complete-maintenance";
import type { GetMaintenanceByIdUseCase } from "@/use-cases/maintenance/get-maintenance-by-id";
import type { GetVehicleMaintenanceHistoryUseCase } from "@/use-cases/maintenance/get-vehicle-maintenance-history";
import type { ListMaintenanceUseCase } from "@/use-cases/maintenance/list-maintenance";
import type { ScheduleMaintenanceUseCase } from "@/use-cases/maintenance/schedule-maintenance";
import type { UpdateMaintenanceStatusUseCase } from "@/use-cases/maintenance/update-maintenance-status";

export class MaintenanceController {
  constructor(
    private _scheduleMaintenanceUC: ScheduleMaintenanceUseCase,
    private _completeMaintenanceUC: CompleteMaintenanceUseCase,
    private _listMaintenanceUC: ListMaintenanceUseCase,
    private _getMaintenanceByIdUC: GetMaintenanceByIdUseCase,
    private _getVehicleMaintenanceHistoryUC: GetVehicleMaintenanceHistoryUseCase,
    private _updateMaintenanceStatusUC: UpdateMaintenanceStatusUseCase,
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

      const result = await this._listMaintenanceUC.execute({
        tenantId,
        vehicleId,
        status,
        page,
        limit,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Maintenance records retrieved successfully",
        data: result,
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

      const maintenance = await this._getMaintenanceByIdUC.execute({
        maintenanceId: id as string,
        tenantId,
      });

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

      const records = await this._getVehicleMaintenanceHistoryUC.execute({
        vehicleId: vehicleId as string,
        tenantId,
      });

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

  updateMaintenanceStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;
      const { id } = req.params;
      const { status } = req.body;

      if (!tenantId) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Tenant ID not found in request",
        });
        return;
      }

      if (!status) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Status is required",
        });
        return;
      }

      const maintenance = await this._updateMaintenanceStatusUC.execute({
        maintenanceId: id as string,
        tenantId,
        status,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Maintenance status updated successfully",
        data: maintenance,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to update maintenance status",
      });
    }
  };
}
