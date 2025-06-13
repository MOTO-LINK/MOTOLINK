import { Router } from "express";
import reportController from "../controllers/report.controller";

const router = Router();

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
