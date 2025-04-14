// src/routes/protected.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requirePhoneVerification } from "../middleware/phone.middleware";

const router = Router();

// Routes that require both authentication and phone verification
router.use(authenticate, requirePhoneVerification);

export default router;
