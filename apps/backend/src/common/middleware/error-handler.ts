import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = StatusCodes.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
};
