import { NextFunction, Request, Response } from "express";
import pinoHttp from "pino-http";
import { logger } from "../../config/logger";

const httpLogger = pinoHttp({ logger });
export const requestLogger = (req: Request, res: Response, next: NextFunction) => httpLogger(req, res, next);
