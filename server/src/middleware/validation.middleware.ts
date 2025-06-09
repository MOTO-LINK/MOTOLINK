import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";
import { UserType, VehicleType, OrderType, DocumentType } from "../utils/types";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).json({
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Validation failed",
				details: errors.array()
			}
		});
		return;
	}

	next();
};

// Auth validations
export const validateRegister: ValidationChain[] = [
	body("name").trim().notEmpty().withMessage("Name is required"),
	body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
	body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
	body("phone")
		.matches(/^01[0-2,5]\d{8}$/)
		.withMessage("Invalid Egyptian phone number"),
	body("dob").isISO8601().toDate().withMessage("Valid date of birth is required"),
	body("userType").isIn(Object.values(UserType)).withMessage("Invalid user type"),
	body("vehicleType")
		.optional()
		.isIn(Object.values(VehicleType))
		.withMessage("Invalid vehicle type"),
	body("orderTypes").optional().isArray().withMessage("Order types must be an array"),
	body("orderTypes.*").optional().isIn(Object.values(OrderType)).withMessage("Invalid order type")
];

export const validateLogin: ValidationChain[] = [
	body("phone")
		.matches(/^01[0-2,5]\d{8}$/)
		.withMessage("Invalid Egyptian phone number"),
	body("password").notEmpty().withMessage("Password is required")
];

export const validatePhoneVerification: ValidationChain[] = [
	body("phone")
		.matches(/^01[0-2,5]\d{8}$/)
		.withMessage("Invalid Egyptian phone number"),
	body("code")
		.matches(/^\d{6}$/)
		.withMessage("Invalid verification code")
];

// Location validations
export const validateLocation: ValidationChain[] = [
	body("name").trim().notEmpty().withMessage("Location name is required"),
	body("address").trim().notEmpty().withMessage("Address is required"),
	body("latitude").isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
	body("longitude").isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
	body("isDefault").optional().isBoolean().withMessage("isDefault must be boolean")
];

// Document validations
export const validateDocumentUpload: ValidationChain[] = [
	body("documentType").isIn(Object.values(DocumentType)).withMessage("Invalid document type")
];

// Status validations
export const validateStatusUpdate: ValidationChain[] = [
	body("isOnline").isBoolean().withMessage("isOnline must be boolean")
];

export const validateAvailabilityUpdate: ValidationChain[] = [
	body("isAvailable").isBoolean().withMessage("isAvailable must be boolean")
];

// Password validations
export const validatePasswordChange: ValidationChain[] = [
	body("currentPassword").notEmpty().withMessage("Current password is required"),
	body("newPassword")
		.isLength({ min: 6 })
		.withMessage("New password must be at least 6 characters")
];

export const validatePasswordReset: ValidationChain[] = [
	body("phone")
		.matches(/^01[0-2,5]\d{8}$/)
		.withMessage("Invalid Egyptian phone number"),
	body("code")
		.matches(/^\d{6}$/)
		.withMessage("Invalid verification code"),
	body("newPassword")
		.isLength({ min: 6 })
		.withMessage("New password must be at least 6 characters")
];
