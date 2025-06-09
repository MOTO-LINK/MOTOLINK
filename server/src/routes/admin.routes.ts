import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserType } from "../utils/types";

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

export default router;
