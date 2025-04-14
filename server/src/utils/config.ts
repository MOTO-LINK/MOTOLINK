import dotenv from "dotenv";
import { Config } from "./types";

dotenv.config();

const config: Config = {
	port: parseInt(process.env.PORT || "3000", 10),
	jwtSecret: process.env.JWT_SECRET || "your-secret-key",
	saltRounds: parseInt(process.env.SALT_ROUNDS || "10", 10)
};

export default config;
