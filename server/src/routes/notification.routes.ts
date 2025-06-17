import { Router } from "express";
import notificationController from "../controllers/notification.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserType } from "../utils/types";

const router = Router();

router.use(authenticateToken)

router.get("/", notificationController.getNotifications);
router.put("/read/:notificationId", notificationController.markAsRead);
router.put("/read/all", notificationController.markAllAsRead);

router.post("/:userId", authorizeRoles(UserType.ADMIN), notificationController.createNotification);

export default router;
