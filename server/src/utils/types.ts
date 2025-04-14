export interface Config {
	port: number;
	jwtSecret: string;
	saltRounds: number;
}

export interface TokenPayload {
	userId: string;
	userType: "rider" | "driver" | "admin";
	iat?: number;
	exp?: number;
}
