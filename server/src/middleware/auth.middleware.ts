import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { UserType } from "../utils/types";

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

	if (!token) {
		res.status(401).json({
			success: false,
			error: {
				code: "NO_TOKEN",
				message: "Authentication token required"
			}
		});
		return;
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		res.status(403).json({
			success: false,
			error: {
				code: "INVALID_TOKEN",
				message: "Invalid or expired token"
			}
		});
		return;
	}

	req.user = {
		user_id: decoded.user_id,
		email: decoded.email,
		user_type: decoded.userType
	};

	next();
}

export function authorizeRoles(...allowedRoles: UserType[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: {
					code: "UNAUTHORIZED",
					message: "Authentication required"
				}
			});
			return;
		}

		if (!allowedRoles.includes(req.user.user_type) && req.user.user_type !== UserType.ADMIN) {
			res.status(403).json({
				success: false,
				error: {
					code: "FORBIDDEN",
					message: "You don't have permission to access this resource"
				}
			});
			return;
		}

		next();
	};
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (token) {
		const decoded = verifyToken(token);
		if (decoded) {
			req.user = {
				user_id: decoded.user_id,
				email: decoded.email,
				user_type: decoded.userType
			};
		}
	}

	next();
}
