import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import reportController from "../controllers/report.controller";
import { UserType } from "../utils/types";

const router = Router();

router.use(authenticateToken, authorizeRoles(UserType.ADMIN));

// Get all reports/complaints
router.get("/", reportController.getAllReports);

// Get reports by specific status
router.get("/pending", reportController.getPendingReports);
router.get("/resolved", reportController.getResolvedReports);
router.get("/dismissed", reportController.getDismissedReports);

// Get a specific report by ID
router.get("/:id", reportController.getReportById);

// Update report status (admin only)
router.put("/:id/status", reportController.updateReportStatus);

export default router;
