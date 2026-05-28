import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const signAccessToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"] });

export const signRefreshToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"] });

export const verifyAccessToken = (token: string) => jwt.verify(token, env.jwtAccessSecret) as { userId: string; role: string };
export const verifyRefreshToken = (token: string) => jwt.verify(token, env.jwtRefreshSecret) as { userId: string; role: string };
