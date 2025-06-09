import { Router } from "express";
import riderController from "../controllers/rider.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserType } from "../utils/types";

const router = Router();

// All routes require authentication and rider role
router.use(authenticateToken);
router.use(authorizeRoles(UserType.RIDER));

// Profile
router.get("/profile", riderController.getProfile);

// Location management
router.post("/locations", riderController.saveLocation);
router.get("/locations", riderController.getLocations);
router.patch("/locations/:locationId", riderController.updateLocation);
router.delete("/locations/:locationId", riderController.deleteLocation);
router.patch("/locations/:locationId/default", riderController.setDefaultLocation);

export default router;
