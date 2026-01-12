import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

/**
 * Middleware to validate request body against a Zod schema
 */
export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    }
    catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors || [error.message],
      });
    }
  };
}
