import { Router } from "express";
import authRoutes from "./auth.routes";
import phoneRoutes from "./phone.routes";
import chatRoutes from "./chat.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/phone", phoneRoutes);
router.use("/chats", chatRoutes);

export default router;
