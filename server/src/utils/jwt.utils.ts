import jwt from "jsonwebtoken";
import { UserType } from "./types";
import config from "./config";

interface TokenPayload {
	user_id: string;
	email: string;
	userType: UserType;
}

interface RefreshTokenPayload {
	user_id: string;
	type: "refresh";
}

export function generateToken(user_id: string, email: string, userType: UserType): string {
	const payload: TokenPayload = {
		user_id,
		email,
		userType
	};

	return jwt.sign(payload, config.jwtSecret, {
		expiresIn: config.jwtExpiresIn || "24h"
	});
}

export function generateRefreshToken(user_id: string): string {
	const payload: RefreshTokenPayload = {
		user_id,
		type: "refresh"
	};

	return jwt.sign(
		payload,
		config.jwtRefreshSecret,
		{
			expiresIn: config.jwtRefreshExpiresIn || "7d"
		}
	);
}

export function verifyToken(token: string): TokenPayload | null {
	try {
		return jwt.verify(token, config.jwtSecret) as TokenPayload;
	} catch (error) {
		return null;
	}
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
	try {
		const decoded = jwt.verify(token, config.jwtRefreshSecret) as RefreshTokenPayload;
		if (decoded.type !== "refresh") {
			return null;
		}
		return decoded;
	} catch (error) {
		return null;
	}
}

export function decodeToken(token: string): TokenPayload | null {
	try {
		return jwt.decode(token) as TokenPayload;
	} catch (error) {
		return null;
	}
}
