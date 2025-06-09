import { Router } from "express";
import walletController from "../controllers/wallet.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/balance", walletController.getBalance);
router.get("/transactions", walletController.getTransactions);
router.post("/topup/initialize", walletController.initializeTopUp);
router.post("/withdraw", walletController.requestWithdrawal);

// Paymob webhook (no auth required)
router.post("/paymob/callback", walletController.handlePaymobCallback);

export default router;
