import { Router } from "express";
import { prisma } from "../../config/prisma";
import { z } from "zod";
import { comparePassword, hashPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from "./auth.service";
import { AppError } from "../../common/middleware/error-handler";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["ADMIN", "DOCTOR", "PHARMACIST"]),
  specialty: z.string().optional()
});

router.post("/register", async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new AppError("Email already used", StatusCodes.CONFLICT);

  const user = await prisma.user.create({
    data: { ...payload, password: await hashPassword(payload.password) }
  });

  res.status(StatusCodes.CREATED).json({
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
});

router.post("/login", async (req, res) => {
  const payload = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);

  const isValid = await comparePassword(payload.password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: `${env.apiPrefix}/auth/refresh`
  });

  res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError("No refresh token", StatusCodes.UNAUTHORIZED);
  const payload = verifyRefreshToken(token);
  const accessToken = signAccessToken(payload.userId, payload.role);
  res.json({ accessToken });
});

router.post("/logout", async (_req, res) => {
  res.clearCookie("refreshToken", { path: `${env.apiPrefix}/auth/refresh` });
  res.status(StatusCodes.NO_CONTENT).send();
});

export default router;
