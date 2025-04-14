import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { UserModel } from "../models/user.model";
import { PhoneModel } from "../models/phone.model";
import { TokenPayload } from "../utils/types";

export interface AuthRequest extends Request {
	user?: TokenPayload;
	phoneVerified?: boolean;
}

export const authenticate = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			throw new Error("No token provided");
		}

		const token = authHeader.split(" ")[1];
		const decoded = verifyToken(token);
		console.log(decoded);
		
		const userModel = new UserModel();
		const user = await userModel.findById(decoded.userId);

		if (!user) {
			throw new Error("User not found");
		}

		if (user.account_locked) {
			throw new Error("Account is locked");
		}

		// Check phone verification status
		const phoneModel = new PhoneModel();
		const phoneNumber = await phoneModel.findByUserId(decoded.userId);
		req.phoneVerified = phoneNumber?.verified || false;

		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({
			status: "error",
			message: (error as Error).message || "Authentication failed"
		});
	}
};

export const authorize = (...allowedRoles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction): void => {
		if (!req.user || !allowedRoles.includes(req.user.userType)) {
			res.status(403).json({
				status: "error",
				message: "Unauthorized access"
			});
			return;
		}
		next();
	};
};
