// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { RiderModel } from "../models/rider.model";
import { DriverModel } from "../models/driver.model";
import { PhoneModel } from "../models/phone.model";
import { TwilioService } from "../services/twilio.service";
import { generateToken } from "../utils/jwt.utils";

export class AuthController {
	private userModel = new UserModel();
	private riderModel = new RiderModel();
	private driverModel = new DriverModel();
	private phoneModel = new PhoneModel();
	private twilioService = new TwilioService();

	async signup(req: Request, res: Response): Promise<void> {
		try {
			const {
				name,
				email,
				password,
				userType,
				phoneNumber,
				// Driver specific fields
				nationalId,
				vehicleRegistrationNumber,
				vehicleType,
				profilePicture
			} = req.body;

			// Basic validation
			if (!name || !email || !password || !userType || !phoneNumber) {
				res.status(400).json({
					status: "error",
					message: "Missing required fields"
				});
				return;
			}

			// Driver-specific validation
			if (userType === "driver") {
				if (!nationalId || !vehicleRegistrationNumber || !vehicleType) {
					res.status(400).json({
						status: "error",
						message: "Missing required driver fields"
					});
					return;
				}
			}

			// Check if phone number is already registered
			const existingPhone = await this.phoneModel.findByPhoneNumber(phoneNumber);
			if (existingPhone) {
				res.status(400).json({
					status: "error",
					message: "Phone number already registered"
				});
				return;
			}

			// Create base user
			const user = await this.userModel.create({
				name,
				email,
				password,
				user_type: userType,
				profile_picture:
					profilePicture ||
					"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
			});

			// Create specific user type record
			if (userType === "driver") {
				await this.driverModel.create({
					driver_id: user.user_id,
					national_id: nationalId,
					vehicle_registration_number: vehicleRegistrationNumber,
					vehicle_type: vehicleType
				});
			} else if (userType === "rider") {
				await this.riderModel.create({
					rider_id: user.user_id
				});
			}

			// Send verification code and store phone number
			try {
				const verificationCode = await this.twilioService.sendVerificationCode(phoneNumber);
				await this.phoneModel.create({
					user_id: user.user_id,
					phone_number: phoneNumber,
					verification_code: verificationCode
				});
			} catch (error) {
				// If phone verification fails, still create the account but mark it as unverified
				await this.phoneModel.create({
					user_id: user.user_id,
					phone_number: phoneNumber,
					verification_code: undefined
				});
			}

			// Generate token
			const token = generateToken({
				userId: user.user_id,
				userType: user.user_type
			});

			res.status(201).json({
				status: "success",
				data: {
					user,
					token,
					phoneVerified: false
				}
			});
		} catch (error) {
			res.status(400).json({
				status: "error",
				message: (error as Error).message
			});
		}
	}

	async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				res.status(400).json({
					status: "error",
					message: "Email and password are required"
				});
				return;
			}

			const user = await this.userModel.findByEmail(email);

			if (!user || !(await bcrypt.compare(password, user.password))) {
				res.status(401).json({
					status: "error",
					message: "Invalid credentials"
				});
				return;
			}

			if (user.account_locked) {
				res.status(403).json({
					status: "error",
					message: "Account is locked"
				});
				return;
			}

			// Check phone verification status
			const phoneNumber = await this.phoneModel.findByUserId(user.user_id);
			const phoneVerified = phoneNumber?.verified || false;

			await this.userModel.updateLastLogin(user.user_id);

			const token = generateToken({
				userId: user.user_id,
				userType: user.user_type
			});

			const { password: _, ...userWithoutPassword } = user;

			res.status(200).json({
				status: "success",
				data: {
					user: userWithoutPassword,
					token,
					phoneVerified
				}
			});
		} catch (error) {
			res.status(400).json({
				status: "error",
				message: (error as Error).message
			});
		}
	}
}
