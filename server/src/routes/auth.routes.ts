import { Router } from "express";
import authController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
	validateRegister,
	validateLogin,
	validatePasswordReset,
	handleValidationErrors
} from "../middleware/validation.middleware";

const router = Router();

// Public routes
router.post("/register", validateRegister, handleValidationErrors, authController.register);
router.post("/login", validateLogin, handleValidationErrors, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post(
	"/reset-password",
	validatePasswordReset,
	handleValidationErrors,
	authController.resetPassword
);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.post("/logout", authenticateToken, authController.logout);

export default router;
