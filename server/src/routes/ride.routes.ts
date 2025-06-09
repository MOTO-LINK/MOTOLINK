import { Router } from "express";
import rideController from "../controllers/ride.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserType } from "../utils/types";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Shared routes
router.get("/active", rideController.getActiveRide);
router.get("/history", rideController.getRideHistory);
router.post("/:requestId/cancel", rideController.cancelRideRequest);

// Rider routes
router.post("/request", authorizeRoles(UserType.RIDER), rideController.createRideRequest);
router.post("/estimate", authorizeRoles(UserType.RIDER), rideController.estimateFare);
router.get("/:requestId/track", authorizeRoles(UserType.RIDER), rideController.trackDriver);

// Driver routes
router.get("/available", authorizeRoles(UserType.DRIVER), rideController.getAvailableRequests);
router.post(
	"/:requestId/accept",
	authorizeRoles(UserType.DRIVER),
	rideController.acceptRideRequest
);
router.post(
	"/:requestId/decline",
	authorizeRoles(UserType.DRIVER),
	rideController.declineRideRequest
);
router.patch(
	"/:requestId/status",
	authorizeRoles(UserType.DRIVER),
	rideController.updateRideStatus
);

export default router;
