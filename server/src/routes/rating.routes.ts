import { Router } from "express";
import ratingController from "../controllers/rating.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post("/submit", ratingController.submitRating);
router.get("/my-ratings", ratingController.getUserRatings);

export default router;
