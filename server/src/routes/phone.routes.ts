// src/routes/phone.routes.ts
import { Router } from "express";
import { PhoneController } from "../controllers/phone.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const phoneController = new PhoneController();

router.post("/send-code", authenticateToken, (req, res) => phoneController.sendVerificationCode(req, res));

router.post("/verify", authenticateToken, (req, res) => phoneController.verifyPhoneNumber(req, res));

export default router;
