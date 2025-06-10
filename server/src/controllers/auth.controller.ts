import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import phoneModel from "../models/phone.model";
import driverModel from "../models/driver.model";
import riderModel from "../models/rider.model";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils";
import { UserType, RegisterRequest, LoginRequest, ApiResponse } from "../utils/types";
import twilioService from "../services/twilio.service";

class AuthController {
	async register(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const {
				name,
				email,
				password,
				phone,
				dob,
				userType,
				nationalId,
				vehicleType,
				orderTypes
			} = req.body as RegisterRequest;

			// Validate required fields
			if (!name || !email || !password || !phone || !dob || !userType) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "All required fields must be provided"
					}
				});
				return;
			}

			// Validate driver-specific fields
			if (
				userType === UserType.DRIVER &&
				(!vehicleType || !orderTypes || orderTypes.length === 0)
			) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_DRIVER_FIELDS",
						message: "Vehicle type and order types are required for drivers"
					}
				});
				return;
			}

			// Check if email or phone already exists
			const [emailExists, phoneExists] = await Promise.all([
				userModel.checkEmailExists(email),
				phoneModel.checkPhoneExists(phone)
			]);

			if (emailExists) {
				res.status(409).json({
					success: false,
					error: {
						code: "EMAIL_EXISTS",
						message: "Email already registered"
					}
				});
				return;
			}

			if (phoneExists) {
				res.status(409).json({
					success: false,
					error: {
						code: "PHONE_EXISTS",
						message: "Phone number already registered"
					}
				});
				return;
			}

			// Create user
			const user = await userModel.create({
				name,
				email,
				password,
				dob: new Date(dob),
				user_type: userType
			});

			// Create phone number record
			const phoneRecord = await phoneModel.create(user.user_id, phone);

			// Create driver or rider record
			if (userType === UserType.DRIVER) {
				await driverModel.create({
					driver_id: user.user_id,
					vehicle_type: vehicleType!,
					order_types: orderTypes!
				});
			} else if (userType === UserType.RIDER) {
				await riderModel.create(user.user_id);
			}

			// Send verification code
			await twilioService.sendVerificationCode(phone, phoneRecord.verification_code!);

			// Generate tokens
			const token = generateToken(user.user_id, user.email, user.user_type);
			const refreshToken = generateRefreshToken(user.user_id);

			const response: ApiResponse = {
				success: true,
				data: {
					user: {
						...user,
						phone,
						phone_verified: false
					},
					token,
					refreshToken
				},
				message: "Registration successful. Please verify your phone number."
			};

			res.status(201).json(response);
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { phone, password } = req.body as LoginRequest;

			if (!phone || !password) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_CREDENTIALS",
						message: "Phone and password are required"
					}
				});
				return;
			}

			// Find user by phone
			const user = await userModel.findByPhone(phone);
			if (!user) {
				res.status(401).json({
					success: false,
					error: {
						code: "INVALID_CREDENTIALS",
						message: "Invalid phone number or password"
					}
				});
				return;
			}

			// Check if account is locked
			if (user.account_locked) {
				res.status(403).json({
					success: false,
					error: {
						code: "ACCOUNT_LOCKED",
						message: "Your account has been locked. Please contact support."
					}
				});
				return;
			}

			// Verify password
			const isValidPassword = await userModel.verifyPassword(password, user.password);
			if (!isValidPassword) {
				res.status(401).json({
					success: false,
					error: {
						code: "INVALID_CREDENTIALS",
						message: "Invalid phone number or password"
					}
				});
				return;
			}

			// Check phone verification
			const phoneRecord = await phoneModel.findByPhoneNumber(phone);
			if (!phoneRecord?.verified) {
				// Resend verification code
				const code = await phoneModel.updateVerificationCode(phone);
				await twilioService.sendVerificationCode(phone, code);

				res.status(403).json({
					success: false,
					error: {
						code: "PHONE_NOT_VERIFIED",
						message: "Please verify your phone number. A new code has been sent."
					}
				});
				return;
			}

			// Update last login
			await userModel.updateLastLogin(user.user_id);

			// Get additional user info based on type
			let additionalInfo = {};
			if (user.user_type === UserType.DRIVER) {
				additionalInfo = (await driverModel.findById(user.user_id)) || {};
			} else if (user.user_type === UserType.RIDER) {
				additionalInfo = (await riderModel.findById(user.user_id)) || {};
			}

			// Generate tokens    // Generate tokens
			const token = generateToken(user.user_id, user.email, user.user_type);
			const refreshToken = generateRefreshToken(user.user_id);

			const { password: _, ...userWithoutPassword } = user;

			const response: ApiResponse = {
				success: true,
				data: {
					user: {
						...userWithoutPassword,
						phone,
						...additionalInfo
					},
					token,
					refreshToken
				},
				message: "Login successful"
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { phone } = req.body;

			if (!phone) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_PHONE",
						message: "Phone number is required"
					}
				});
				return;
			}

			const phoneRecord = await phoneModel.findByPhoneNumber(phone);
			if (!phoneRecord) {
				res.status(404).json({
					success: false,
					error: {
						code: "PHONE_NOT_FOUND",
						message: "Phone number not registered"
					}
				});
				return;
			}

			// Generate and send verification code
			const code = await phoneModel.updateVerificationCode(phone);
			await twilioService.sendVerificationCode(phone, code);

			res.status(200).json({
				success: true,
				message: "Verification code sent to your phone"
			});
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { phone, code, newPassword } = req.body;

			if (!phone || !code || !newPassword) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "Phone, code, and new password are required"
					}
				});
				return;
			}

			// Verify code
			const phoneRecord = await phoneModel.findByPhoneNumber(phone);
			if (!phoneRecord || phoneRecord.verification_code !== code) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_CODE",
						message: "Invalid verification code"
					}
				});
				return;
			}

			// Update password
			const user = await userModel.findByPhone(phone);
			if (!user) {
				res.status(404).json({
					success: false,
					error: {
						code: "USER_NOT_FOUND",
						message: "User not found"
					}
				});
				return;
			}

			await userModel.updatePassword(user.user_id, newPassword);

			// Clear verification code
			await phoneModel.verifyCode(phone, code);

			res.status(200).json({
				success: true,
				message: "Password reset successful"
			});
		} catch (error) {
			next(error);
		}
	}

	async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_TOKEN",
						message: "Refresh token is required"
					}
				});
				return;
			}

			// Verify refresh token
			const decoded = verifyRefreshToken(refreshToken);
			if (!decoded) {
				res.status(401).json({
					success: false,
					error: {
						code: "INVALID_TOKEN",
						message: "Invalid refresh token"
					}
				});
				return;
			}

			// Get user
			const user = await userModel.findById(decoded.user_id);
			if (!user) {
				res.status(404).json({
					success: false,
					error: {
						code: "USER_NOT_FOUND",
						message: "User not found"
					}
				});
				return;
			}

			// Generate new tokens
			const newToken = generateToken(user.user_id, user.email, user.user_type);
			const newRefreshToken = generateRefreshToken(user.user_id);

			res.status(200).json({
				success: true,
				data: {
					token: newToken,
					refreshToken: newRefreshToken
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// TODO: Implement logout by blacklisting the JWT token
			res.status(200).json({
				success: true,
				message: "Logout successful"
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new AuthController();
