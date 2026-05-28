import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware";

const router = Router();
router.get("/me", authMiddleware, async (req, res) => {
  res.json({ message: "User profile endpoint" });
});
export default router;
