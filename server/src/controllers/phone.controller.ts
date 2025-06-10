import { Request, Response } from "express";
import { PhoneModel } from "../models/phone.model";
import TwilioService from "../services/twilio.service";

export class PhoneController {
	private phoneModel = new PhoneModel();
	private twilioService = TwilioService;

	async sendVerificationCode(req: Request, res: Response): Promise<void> {
		// !THIS IS ONLY FOR DEVELOPMENT AND TESTING PURPOSES
		let verificationCode;
		if (process.env.SKIP_VERIFICATION) {
			res.status(200).json({
				status: "success",
				message: "Verification code sent successfully"
			});
			return;
		}
		///======================================================================
		try {
			if (!req.user?.user_id) {
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
			if (existingPhone?.verified && existingPhone.user_id !== req.user.user_id) {
				res.status(400).json({
					status: "error",
					message: "Phone number already registered"
				});
				return;
			}

			// Store or update phone number and verification code
			if (existingPhone) {
				verificationCode = await this.phoneModel.updateVerificationCode(
					existingPhone.user_id
				);
			} else {
				const result = await this.phoneModel.create(req.user.user_id, phoneNumber);

				verificationCode = result.verification_code!;
			}

			await this.twilioService.sendVerificationCode(phoneNumber, verificationCode);

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

	async verifyPhoneNumber(req: Request, res: Response): Promise<void> {
		// !THIS IS ONLY FOR DEVELOPMENT
		if (process.env.SKIP_VERIFICATION) {
			const verified = await this.phoneModel.verifyCode(req.body.phone, "123456");
			console.log(verified)
			res.status(200).json({
				status: "success",
				message: "Phone number verified successfully"
			});
			return;
		}
		///======================================================================
		try {
			if (!req.user?.user_id) {
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

			const verified = await this.phoneModel.verifyCode(req.user.user_id, verificationCode);

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
