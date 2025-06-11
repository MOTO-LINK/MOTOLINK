import { Router } from "express";
import statisticsController from "../controllers/statistics.controller";

const router = Router();

// Route to get user statistics
router.get(
  "/users",
  // isAdmin, // Uncomment if admin access is required
  (req, res) => statisticsController.getUserStats(req, res) // Correctly call the controller method
);

// Route to get revenue statistics
router.get(
  "/revenue",
  // isAdmin, // Uncomment if admin access is required
  (req, res) => statisticsController.getRevenueStats(req, res) // Correctly call the controller method
);

export default router;
