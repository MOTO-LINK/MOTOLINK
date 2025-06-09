import { Router } from "express";
import driverController from "../controllers/driver.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";
import {
	validateDocumentUpload,
	validateStatusUpdate,
	validateAvailabilityUpdate,
	handleValidationErrors
} from "../middleware/validation.middleware";
import { UserType } from "../utils/types";

const router = Router();

// All routes require authentication and driver role
router.use(authenticateToken);
router.use(authorizeRoles(UserType.DRIVER));

// Document management
router.post(
	"/documents/upload",
	uploadSingle,
	validateDocumentUpload,
	handleValidationErrors,
	driverController.uploadDocument
);
router.get("/documents", driverController.getDocuments);
router.get("/verification-status", driverController.getVerificationStatus);

// Status management
router.patch(
	"/status",
	validateStatusUpdate,
	handleValidationErrors,
	driverController.updateStatus
);
router.patch(
	"/availability",
	validateAvailabilityUpdate,
	handleValidationErrors,
	driverController.updateAvailability
);

// Location
router.post("/location", driverController.updateLocation);

// Profile
router.get("/profile", driverController.getProfile);

export default router;
