import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../modules/auth/auth.service";
import { AppError } from "./error-handler";
import { StatusCodes } from "http-status-codes";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  req.user = payload;
  next();
};
