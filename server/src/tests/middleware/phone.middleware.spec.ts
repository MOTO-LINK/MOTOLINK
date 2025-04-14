import { requirePhoneVerification } from "../../middleware/phone.middleware";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Response } from "express";
import { PhoneModel } from "../../models/phone.model";
import { UserModel } from "../../models/user.model";
import pool from "../../utils/database";
import clearDatabase from "../../utils/clearDatabase";

describe("Phone Middleware", () => {
	let mockRequest: Partial<AuthRequest>;
	let mockResponse: Partial<Response>;
	let nextFunction: jasmine.Spy;
	let testUserId: string;

	beforeAll(async () => {
		await clearDatabase();
		// Create test user
		const userModel = new UserModel();
		const user = await userModel.create({
			name: "Phone Middleware Test User",
			email: "phonemiddleware@test.com",
			password: "password123",
			user_type: "rider"
		});
		testUserId = user.user_id;
	});

	beforeEach(() => {
		// Clear phone numbers before each test
		pool.query("DELETE FROM phone_numbers");
		
		mockRequest = {
			user: {
				userId: testUserId,
				userType: "rider"
			}
		};
		mockResponse = {
			status: jasmine.createSpy("status").and.returnValue({
				json: jasmine.createSpy("json")
			})
		};
		nextFunction = jasmine.createSpy("nextFunction");
	});

	afterAll(async () => {
		await pool.query("DELETE FROM users");
	});

	it("should proceed when phone is verified", async () => {
		const phoneModel = new PhoneModel();
		await phoneModel.create({
			user_id: testUserId,
			phone_number: "+1234567890",
			verification_code: "123456"
		});
		await phoneModel.verify(testUserId, "123456");

		await requirePhoneVerification(
			mockRequest as AuthRequest,
			mockResponse as Response,
			nextFunction
		);

		expect(nextFunction).toHaveBeenCalled();
	});

	it("should block when phone is not verified", async () => {
		const phoneModel = new PhoneModel();
		await phoneModel.create({
			user_id: testUserId,
			phone_number: "+1234567890",
			verification_code: "123456"
		});

		await requirePhoneVerification(
			mockRequest as AuthRequest,
			mockResponse as Response,
			nextFunction
		);

		expect(mockResponse.status).toHaveBeenCalledWith(403);
		expect(mockResponse.status?.(401).json).toHaveBeenCalledWith({
			status: "error",
			message: "Phone number not verified",
			requiresVerification: true
		});
	});

	it("should handle missing user in request", async () => {
		mockRequest.user = undefined;

		await requirePhoneVerification(
			mockRequest as AuthRequest,
			mockResponse as Response,
			nextFunction
		);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.status?.(401).json).toHaveBeenCalledWith({
			status: "error",
			message: "User not authenticated"
		});
	});
});
