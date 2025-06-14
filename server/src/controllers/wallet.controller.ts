import { Request, Response, NextFunction } from "express";
import walletModel from "../models/wallet.model";
import paymobService from "../services/paymob.service";

class WalletController {
	async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;

			const wallet = await walletModel.findByUserId(userId);
			if (!wallet) {
				res.status(404).json({
					success: false,
					error: {
						code: "WALLET_NOT_FOUND",
						message: "Wallet not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: {
					balance: wallet.balance,
					amountOwed: wallet.amount_owed,
					currency: wallet.currency,
					status: wallet.status
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { page = 1, limit = 20, type } = req.query;

			const { transactions, total } = await walletModel.getTransactions(
				userId,
				Number(page),
				Number(limit),
				type as "credit" | "debit" | undefined
			);

			const totalPages = Math.ceil(total / Number(limit));

			res.status(200).json({
				success: true,
				data: {
					items: transactions,
					pagination: {
						page: Number(page),
						limit: Number(limit),
						total,
						totalPages
					}
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async initializeTopUp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { amount } = req.body;

			if (!amount || amount <= 0) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_AMOUNT",
						message: "Amount must be greater than 0"
					}
				});
				return;
			}

			// Create Paymob payment session
			const paymentData = await paymobService.createPaymentSession({
				userId,
				amount,
				currency: "EGP",
				purpose: "wallet_topup"
			});

			res.status(200).json({
				success: true,
				data: paymentData,
				message: "Payment session created successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async handlePaymobCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const paymentData = req.body;

			// Verify payment with Paymob
			const isValid = paymobService.verifyPayment(paymentData);
			if (!isValid) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_PAYMENT",
						message: "Payment verification failed"
					}
				});
				return;
			}

			// Process payment based on status
			if (paymentData.success === "true") {
				const { userId, amount } = await paymobService.extractPaymentInfo(paymentData);

				// Credit wallet
				await walletModel.credit(
					userId,
					amount,
					"top_up",
					paymentData.id,
					`Wallet top-up via Paymob`
				);

				res.status(200).json({
					success: true,
					message: "Wallet topped up successfully"
				});
			} else {
				res.status(400).json({
					success: false,
					error: {
						code: "PAYMENT_FAILED",
						message: "Payment was not successful"
					}
				});
			}
		} catch (error) {
			next(error);
		}
	}

	async requestWithdrawal(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { amount, withdrawalMethod, accountDetails } = req.body;

			if (!amount || amount <= 0) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_AMOUNT",
						message: "Amount must be greater than 0"
					}
				});
				return;
			}

			// Check balance
			const balance = await walletModel.getBalance(userId);
			if (balance < amount) {
				res.status(400).json({
					success: false,
					error: {
						code: "INSUFFICIENT_BALANCE",
						message: "Insufficient balance for withdrawal"
					}
				});
				return;
			}

			// For now, just debit the amount and log the withdrawal request
			// In production, you'd integrate with a payment processor
			await walletModel.debit(
				userId,
				amount,
				"withdrawal",
				undefined,
				undefined,
				`Withdrawal request via ${withdrawalMethod}`
			);

			res.status(200).json({
				success: true,
				message: "Withdrawal request submitted successfully"
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new WalletController();
