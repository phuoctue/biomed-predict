import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware";

const router = Router();
router.get("/", authMiddleware, async (_req, res) => {
  res.json({ message: "Evaluations endpoint" });
});
export default router;
