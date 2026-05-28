import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.BACKEND_PORT || 5000),
  apiPrefix: process.env.API_PREFIX || "/api",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "access-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  cookieSecure: process.env.COOKIE_SECURE === "true"
};
