import { StringValue } from "ms";

export interface Config {
	// Server
	port: number;
	env: string;

	// Database
	database: {
		host: string;
		port: number;
		user: string;
		password: string;
		database: string;
		// Test database
		testHost: string;
		testPort: number;
		testUser: string;
		testPassword: string;
		testDatabase: string;
		// Dev database
		devDatabase: string;
	};

	// JWT
	jwtSecret: string;
	jwtRefreshSecret: string;
	jwtExpiresIn: StringValue;
	jwtRefreshExpiresIn: StringValue;

	// Bcrypt
	saltRounds: number;

	// Twilio
	twilio: {
		accountSid: string;
		authToken: string;
		phoneNumber: string;
		messagingServiceSid: string;
	};

	// Paymob
	paymob: {
		apiKey: string;
		integrationId: string;
		iframeId: string;
		hmacSecret: string;
	};

	// App specific
	app: {
		name: string;
		supportEmail: string;
		maxLoginAttempts: number;
		lockoutDuration: number; // minutes
		verificationCodeExpiry: number; // minutes
		defaultCurrency: string;
		maxFileSizeInMB: number;
		maxNumberFiles: number;
	};
}

// Enums matching your database
export enum UserType {
	RIDER = "rider",
	DRIVER = "driver",
	ADMIN = "admin"
}

export enum DocumentType {
	NATIONAL_ID_FRONT = "national_id_front",
	NATIONAL_ID_BACK = "national_id_back",
	LICENSE_FRONT = "license_front",
	VEHICLE_REGISTRATION_FRONT = "vehicle_registration_front",
	VEHICLE_REGISTRATION_BACK = "vehicle_registration_back"
}

export enum VehicleType {
	MOTORCYCLE = "motorcycle",
	RICKSHAW = "rickshaw",
	SCOOTER = "scooter"
}

export enum OrderType {
	ANYTHING = "anything",
	TICKETS = "tickets",
	RESTAURANTS = "restaurants",
	SUPERMARKETS = "supermarkets",
	PHARMACIES = "pharmacies"
}

export enum VerificationStatus {
	PENDING = "pending",
	VERIFIED = "verified",
	DECLINED = "declined",
	REJECTED = "rejected"
}

// Request/Response interfaces
export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	phone: string;
	dob: Date;
	userType: UserType;
	nationalId?: string;
	vehicleRegistration?: string;
	vehicleType?: VehicleType; // For drivers
	orderTypes?: OrderType[]; // For drivers
}

export interface LoginRequest {
	phone: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	data?: {
		user: any;
		token: string;
		refreshToken?: string;
	};
	message?: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: {
		code: string;
		message: string;
	};
}

export interface PaginatedResponse<T> {
	items: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

// Extend Express Request type
declare global {
	namespace Express {
		interface Request {
			user?: {
				user_id: string;
				user_type: UserType;
				email: string;
				iat?: number;
				exp?: number;
			};
		}
	}
}
