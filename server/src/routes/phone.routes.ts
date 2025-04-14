// src/routes/phone.routes.ts
import { Router } from "express";
import { PhoneController } from "../controllers/phone.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const phoneController = new PhoneController();

router.post("/send-code", authenticate, (req, res) => phoneController.sendVerificationCode(req, res));

router.post("/verify", authenticate, (req, res) => phoneController.verifyPhoneNumber(req, res));

export default router;
