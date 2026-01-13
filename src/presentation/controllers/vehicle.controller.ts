import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { ArchiveVehicleUseCase } from "@/use-cases/vehicle/archive-vehicle";
import type { AssignVehicleUseCase } from "@/use-cases/vehicle/assign-vehicle";
import type { CreateVehicleUseCase } from "@/use-cases/vehicle/create-vehicle";
import type { GetVehicleUseCase } from "@/use-cases/vehicle/get-vehicle";
import type { ListVehiclesUseCase } from "@/use-cases/vehicle/list-vehicles";
import type { UnassignVehicleUseCase } from "@/use-cases/vehicle/unassign-vehicle";
import type { UpdateVehicleUseCase } from "@/use-cases/vehicle/update-vehicle";
import type { UpdateVehicleStatusUseCase } from "@/use-cases/vehicle/update-vehicle-status";

export class VehicleController {
  constructor(
    private _createVehicleUC: CreateVehicleUseCase,
    private _listVehiclesUC: ListVehiclesUseCase,
    private _getVehicleUC: GetVehicleUseCase,
    private _updateVehicleUC: UpdateVehicleUseCase,
    private _updateVehicleStatusUC: UpdateVehicleStatusUseCase,
    private _archiveVehicleUC: ArchiveVehicleUseCase,
    private _assignVehicleUC: AssignVehicleUseCase,
    private _unassignVehicleUC: UnassignVehicleUseCase,
  ) {}

  createVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Tenant ID not found in request",
        });
        return;
      }

      const vehicle = await this._createVehicleUC.execute({
        ...req.body,
        tenantId,
      });

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Vehicle created successfully",
        data: vehicle,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to create vehicle",
      });
    }
  };

  listVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId as string;
      const page = Number.parseInt(req.query.page as string) || 1;
      const limit = Number.parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const type = req.query.type as string;
      const assignedDriverId = req.query.assignedDriverId as string;

      const result = await this._listVehiclesUC.execute({
        tenantId,
        page,
        limit,
        search,
        status,
        type,
        assignedDriverId,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to retrieve vehicles",
      });
    }
  };

  getVehicle = async (req: Request, res: Response): Promise<void> => {
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

      const vehicle = await this._getVehicleUC.execute({
        vehicleId: id as string,
        tenantId,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: vehicle,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: error.message || "Vehicle not found",
      });
    }
  };

  updateVehicle = async (req: Request, res: Response): Promise<void> => {
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

      const vehicle = await this._updateVehicleUC.execute({
        vehicleId: id,
        tenantId,
        ...req.body,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle updated successfully",
        data: vehicle,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to update vehicle",
      });
    }
  };

  updateVehicleStatus = async (req: Request, res: Response): Promise<void> => {
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

      const vehicle = await this._updateVehicleStatusUC.execute({
        vehicleId: id as string,
        tenantId,
        status: req.body.status,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle status updated successfully",
        data: vehicle,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to update vehicle status",
      });
    }
  };

  archiveVehicle = async (req: Request, res: Response): Promise<void> => {
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

      await this._archiveVehicleUC.execute({
        vehicleId: id as string,
        tenantId,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle archived successfully",
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to archive vehicle",
      });
    }
  };

  assignVehicleToDriver = async (req: Request, res: Response): Promise<void> => {
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

      const vehicle = await this._assignVehicleUC.execute({
        vehicleId: id as string,
        driverId: req.body.driverId,
        tenantId,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle assigned to driver successfully",
        data: vehicle,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to assign vehicle to driver",
      });
    }
  };

  unassignVehicle = async (req: Request, res: Response): Promise<void> => {
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

      const vehicle = await this._unassignVehicleUC.execute({
        vehicleId: id as string,
        tenantId,
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Vehicle unassigned successfully",
        data: vehicle,
      });
    }
    catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to unassign vehicle",
      });
    }
  };
}
