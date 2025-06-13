import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import DashboardRoutes from "./dashboard.routes";
import { UserType } from "../utils/types";
import reportRoutes from "./report.routes";

const router = Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles(UserType.ADMIN));

// Document verification
router.get("/documents/pending", adminController.getPendingDocuments);
router.patch("/documents/:documentId/verify", adminController.verifyDocument);

// Driver verification
router.get("/drivers/pending", adminController.getDriversPendingVerification);

// User management
router.post("/users/:userId/lock", adminController.lockUserAccount);
router.post("/users/:userId/unlock", adminController.unlockUserAccount);

// Admin Dashboard statistics
router.use("/dashboard", DashboardRoutes);

// Report management
router.use("/reports", reportRoutes);

export default router;
