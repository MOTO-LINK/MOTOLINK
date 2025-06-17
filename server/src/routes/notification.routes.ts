import { Router } from "express";
import notificationController from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken)

router.get("/", notificationController.getNotifications);
router.put("/read/:notificationId", notificationController.markAsRead);
router.put("/read/all", notificationController.markAllAsRead);

export default router;
