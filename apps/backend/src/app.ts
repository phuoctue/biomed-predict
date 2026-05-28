import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { requestLogger } from "./common/middleware/request-logger";
import { errorHandler } from "./common/middleware/error-handler";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import patientRoutes from "./modules/patients/patients.routes";
import drugRoutes from "./modules/drugs/drugs.routes";
import evaluationRoutes from "./modules/evaluations/evaluations.routes";

export const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(`${env.apiPrefix}/auth`, authRoutes);
app.use(`${env.apiPrefix}/users`, userRoutes);
app.use(`${env.apiPrefix}/patients`, patientRoutes);
app.use(`${env.apiPrefix}/drugs`, drugRoutes);
app.use(`${env.apiPrefix}/evaluations`, evaluationRoutes);

app.use(errorHandler);
