import { Response } from "express";
import { PhoneModel } from "../models/phone.model";
import { TwilioService } from "../services/twilio.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class PhoneController {
	private phoneModel = new PhoneModel();
	private twilioService = new TwilioService();

	async sendVerificationCode(req: AuthRequest, res: Response): Promise<void> {
		try {
			if (!req.user?.userId) {
				res.status(401).json({
					status: "error",
					message: "User not authenticated"
				});
				return;
			}

			const { phoneNumber } = req.body;

			if (!phoneNumber) {
				res.status(400).json({
					status: "error",
					message: "Phone number is required"
				});
				return;
			}

			// Check if phone number is already verified for another user
			const existingPhone = await this.phoneModel.findByPhoneNumber(phoneNumber);
			if (existingPhone?.verified && existingPhone.user_id !== req.user.userId) {
				res.status(400).json({
					status: "error",
					message: "Phone number already registered"
				});
				return;
			}

			const verificationCode = await this.twilioService.sendVerificationCode(phoneNumber);

			// Store or update phone number and verification code
			if (existingPhone) {
				await this.phoneModel.updateVerificationCode(
					existingPhone.user_id,
					verificationCode
				);
			} else {
				await this.phoneModel.create({
					user_id: req.user.userId,
					phone_number: phoneNumber,
					verification_code: verificationCode
				});
			}

			res.status(200).json({
				status: "success",
				message: "Verification code sent successfully"
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: (error as Error).message
			});
		}
	}

	async verifyPhoneNumber(req: AuthRequest, res: Response): Promise<void> {
		try {
			if (!req.user?.userId) {
				res.status(401).json({
					status: "error",
					message: "User not authenticated"
				});
				return;
			}

			const { verificationCode } = req.body;

			if (!verificationCode) {
				res.status(400).json({
					status: "error",
					message: "Verification code is required"
				});
				return;
			}

			const verified = await this.phoneModel.verify(req.user.userId, verificationCode);

			if (!verified) {
				res.status(400).json({
					status: "error",
					message: "Invalid verification code"
				});
				return;
			}

			res.status(200).json({
				status: "success",
				message: "Phone number verified successfully"
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: (error as Error).message
			});
		}
	}
}
