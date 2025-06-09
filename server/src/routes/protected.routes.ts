// src/routes/protected.routes.ts
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { requirePhoneVerification } from "../middleware/phone.middleware";

const router = Router();

// Routes that require both authentication and phone verification
router.use(authenticateToken, requirePhoneVerification);

export default router;
