import { Request, Response, NextFunction } from "express";
import documentModel from "../models/document.model";
import driverModel from "../models/driver.model";
import userModel from "../models/user.model";
import { VerificationStatus, ApiResponse } from "../utils/types";
import pool from "../utils/database";

class AdminController {
	async getPendingDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { page = 1, limit = 20 } = req.query;
			const offset = (Number(page) - 1) * Number(limit);

			const pendingDocuments = await documentModel.getDocumentsByStatus(
				VerificationStatus.PENDING,
				limit as string | number,
				offset
			);
			const pendingDocumentsCount = await documentModel.getDocumentsCountByStatus(
				VerificationStatus.PENDING
			);

			const total = parseInt(pendingDocumentsCount);
			const totalPages = Math.ceil(total / Number(limit));

			res.status(200).json({
				success: true,
				data: {
					items: pendingDocuments,
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

	async verifyDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { documentId } = req.params;
			const { status, reason } = req.body;
			const adminId = req.user!.user_id;

			if (!status || !Object.values(VerificationStatus).includes(status)) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_STATUS",
						message: "Invalid verification status"
					}
				});
				return;
			}

			if (status === VerificationStatus.DECLINED && !reason) {
				res.status(400).json({
					success: false,
					error: {
						code: "REASON_REQUIRED",
						message: "Reason is required when declining a document"
					}
				});
				return;
			}

			// Update document status
			const document = await documentModel.updateVerificationStatus(
				documentId,
				status,
				adminId
			);

			// Check if all documents are verified for the driver
			if (status === VerificationStatus.VERIFIED) {
				const allVerified = await documentModel.areAllDocumentsVerified(document.user_id);

				if (allVerified) {
					// Update driver verification status
					await driverModel.updateVerificationStatus(
						document.user_id,
						VerificationStatus.VERIFIED,
						true
					);
				}
			} else if (status === VerificationStatus.DECLINED) {
				// Update driver verification status to declined
				await driverModel.updateVerificationStatus(
					document.user_id,
					VerificationStatus.DECLINED,
					false
				);
			}

			res.status(200).json({
				success: true,
				data: document,
				message: `Document ${status === VerificationStatus.VERIFIED ? "verified" : "declined"} successfully`
			});
		} catch (error) {
			next(error);
		}
	}

	async getDriversPendingVerification(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { page = 1, limit = 20 } = req.query;
			const offset = (Number(page) - 1) * Number(limit);

			const driversPendingVerification = await driverModel.getDriversByVerificationStatus(
				VerificationStatus.PENDING,
				limit as string | number,
				offset
			);
			const driversPendingVerificationCount =
				await driverModel.getDriversCountByVerificationStatus(VerificationStatus.PENDING);

			const total = parseInt(driversPendingVerificationCount);
			const totalPages = Math.ceil(total / Number(limit));

			res.status(200).json({
				success: true,
				data: {
					items: driversPendingVerification,
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

	async lockUserAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { user_id } = req.params;
			const { reason } = req.body;

			if (!reason) {
				res.status(400).json({
					success: false,
					error: {
						code: "REASON_REQUIRED",
						message: "Reason is required for locking an account"
					}
				});
				return;
			}

			await userModel.lockAccount(user_id);

			// Log the action (you might want to create an audit log table)
			console.log(
				`Account ${user_id} locked by admin ${req.user!.user_id} for reason: ${reason}`
			);

			res.status(200).json({
				success: true,
				message: "Account locked successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async unlockUserAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { user_id } = req.params;

			await userModel.unlockAccount(user_id);

			res.status(200).json({
				success: true,
				message: "Account unlocked successfully"
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new AdminController();
