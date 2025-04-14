import jwt from "jsonwebtoken";
import config from "./config";
import { TokenPayload } from "./types";

export const generateToken = (payload: Omit<TokenPayload, "iat" | "exp">): string => {
	return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload => {
	try {
		return jwt.verify(token, config.jwtSecret) as TokenPayload;
	} catch (error) {
		throw new Error("Invalid token");
	}
};
