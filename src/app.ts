import type { Application, NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import logger from "./config/logger";
import { errorHandler, notFoundHandler } from "./infrastructure/middlewares";

export default function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(STATUS_CODES.OK).json({ status: "ok" });
  });

  // Placeholder for Fleet Routes
  const fleetRouter = express.Router();
  fleetRouter.get("/", (_req, res) => {
    res.json({ message: "Fleet Service API v1" });
  });
  app.use("/api/v1/fleet", fleetRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
