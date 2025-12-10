import {
  AppError,
  // BadRequestError,
  // ConflictError,
  // ForbiddenError,
  // NotFoundError,
} from "../errors";

export function mapToHttpError(err: unknown): AppError {
  if (err instanceof AppError)
    return err;

  return new AppError("Internal Server Error");
}
