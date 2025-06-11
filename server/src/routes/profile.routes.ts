import { Router } from "express";
import profileController from "../controllers/profile.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";
import { UserType } from "../utils/types";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", profileController.getProfile);
router.get("/:id", authorizeRoles(UserType.ADMIN), profileController.getProfileById);
router.patch("/", profileController.updateProfile);
router.post("/picture", uploadSingle, profileController.uploadProfilePicture);
router.post("/change-password", profileController.changePassword);

export default router;
