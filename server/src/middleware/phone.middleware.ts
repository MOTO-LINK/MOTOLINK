import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { PhoneModel } from "../models/phone.model";

export const requirePhoneVerification = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		if (!req.user?.userId) {
			res.status(401).json({
				status: "error",
				message: "User not authenticated"
			});
			return;
		}

		const phoneModel = new PhoneModel();
		const phoneNumber = await phoneModel.findByUserId(req.user.userId);

		if (!phoneNumber || !phoneNumber.verified) {
			res.status(403).json({
				status: "error",
				message: "Phone number not verified",
				requiresVerification: true
			});
			return;
		}

		next();
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Error checking phone verification status"
		});
	}
};
