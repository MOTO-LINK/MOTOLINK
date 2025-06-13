// src/routes/phone.routes.ts
import { Router } from "express";
import { PhoneController } from "../controllers/phone.controller";

const router = Router();
const phoneController = new PhoneController();

router.post("/send-code", (req, res) => phoneController.sendVerificationCode(req, res));

router.post("/verify", (req, res) => phoneController.verifyPhoneNumber(req, res));

export default router;
