import { Request, Response, NextFunction } from "express";
import { PhoneModel } from "../models/phone.model";

export const requirePhoneVerification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		if (!req.user?.user_id) {
			res.status(401).json({
				status: "error",
				message: "User not authenticated"
			});
			return;
		}

		const phoneModel = new PhoneModel();
		const phoneNumber = await phoneModel.findByUserId(req.user.user_id);

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
