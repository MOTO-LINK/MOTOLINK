import dotenv from "dotenv";
import { StringValue } from "ms";

dotenv.config();

const config = {
	// Server
	port: parseInt(process.env.PORT || "3000"),
	env: process.env.ENV || "dev",

	// Database
	database: {
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT || "5432"),
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		// Test database
		testHost: process.env.POSTGRES_HOST_TEST,
		testPort: parseInt(process.env.POSTGRES_PORT_TEST || "5432"),
		testUser: process.env.POSTGRES_USER_TEST,
		testPassword: process.env.POSTGRES_PASSWORD_TEST,
		testDatabase: process.env.POSTGRES_DB_TEST,
		// Dev database
		devDatabase: process.env.POSTGRES_DB_DEV
	},

	// JWT
	jwtSecret: process.env.JWT_SECRET || "your-secret-key",
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
	jwtExpiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || "24h",
	jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as StringValue) || "7d",

	// Bcrypt
	saltRounds: parseInt(process.env.SALT_ROUNDS || "10"),

	// Twilio
	twilio: {
		accountSid: process.env.TWILIO_ACCOUNT_SID,
		authToken: process.env.TWILIO_AUTH_TOKEN,
		phoneNumber: process.env.TWILIO_PHONE_NUMBER,
		messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID
	},

	// Paymob
	paymob: {
		apiKey: process.env.PAYMOB_API_KEY,
		integrationId: process.env.PAYMOB_INTEGRATION_ID,
		iframeId: process.env.PAYMOB_IFRAME_ID,
		hmacSecret: process.env.PAYMOB_HMAC_SECRET
	},

	// Google
	google: {
		mapsApiKey: process.env.GOOGLE_MAPS_API_KEY
	},

	// App specific
	app: {
		name: "Motolink",
		supportEmail: process.env.SUPPORT_EMAIL || "support@motolink.com",
		maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5"),
		lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || "30"), // minutes
		verificationCodeExpiry: parseInt(process.env.VERIFICATION_CODE_EXPIRY || "10"), // minutes
		defaultCurrency: "EGP",
		maxFileSizeInMB: parseInt(process.env.MAX_FILE_SIZE_MB || "5"),
		maxNumberFiles: parseInt(process.env.MAX_FILE_NUMBER || "5")
	}
};

export default config;
