import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "./error-handler";
import { StatusCodes } from "http-status-codes";

export const roleMiddleware = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN);
    }
    next();
  };
};
