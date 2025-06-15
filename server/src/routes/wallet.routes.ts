import { Router } from "express";
import walletController from "../controllers/wallet.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/balance", authenticateToken, walletController.getBalance);
router.get("/transactions", authenticateToken, walletController.getTransactions);
router.get("/gateway-transactions", authenticateToken, walletController.getGatewayTransactions);
router.post("/topup/initialize", authenticateToken, walletController.initializeTopUp);
router.post("/withdraw", authenticateToken, walletController.requestWithdrawal);

// Paymob webhook (no auth required)
router.post("/paymob/callback", walletController.handlePaymobCallback);

export default router;
