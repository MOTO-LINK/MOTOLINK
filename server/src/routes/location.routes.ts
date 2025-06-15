import { Router } from "express";
import locationController from "../controllers/location.controller";

const router = Router();

// Public geocoding endpoints
router.get("/geocode/reverse", locationController.reverseGeocode);
router.get("/geocode/forward", locationController.geocode);
router.get("/:id", locationController.getLocationById);

export default router;
