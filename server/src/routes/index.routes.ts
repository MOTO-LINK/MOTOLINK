import { Router } from "express";
import authRoutes from "./auth.routes";
import phoneRoutes from "./phone.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/phone", phoneRoutes);

export default router;
