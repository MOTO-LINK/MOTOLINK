import { authenticate, authorize, AuthRequest } from "../../middleware/auth.middleware";
import { Response } from "express";
import { generateToken } from "../../utils/jwt.utils";
import { UserModel } from "../../models/user.model";
import { PhoneModel } from "../../models/phone.model";
import pool from "../../utils/database";
import clearDatabase from "../../utils/clearDatabase";

describe("Auth Middleware", () => {
	let mockRequest: Partial<AuthRequest>;
	let mockResponse: Partial<Response>;
	let nextFunction: jasmine.Spy;
	let testUserId: string;
	let testToken: string;

	beforeAll(async () => {
		await clearDatabase();

		// Create test user
		const userModel = new UserModel();
		const user = await userModel.create({
			name: "Auth Middleware Test User",
			email: "authmiddleware@test.com",
			password: "password123",
			user_type: "rider"
		});
		testUserId = user.user_id;
		testToken = generateToken({
			userId: testUserId,
			userType: "rider"
		});
	});

	beforeEach(() => {
		mockRequest = {
			headers: {}
		};
		mockResponse = {
			status: jasmine.createSpy("status").and.returnValue({
				json: jasmine.createSpy("json")
			})
		};
		nextFunction = jasmine.createSpy("nextFunction");
	});

	describe("authenticate", () => {
		it("should authenticate valid token", async () => {
			mockRequest.headers = {
				authorization: `Bearer ${testToken}`
			};

			await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(nextFunction).toHaveBeenCalled();
			expect(mockRequest.user).toBeDefined();
			expect(mockRequest.user?.userId).toBe(testUserId);
		});

		it("should fail without token", async () => {
			await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(mockResponse.status).toHaveBeenCalledWith(401);
			expect(mockResponse.status?.(401).json).toHaveBeenCalledWith({
				status: "error",
				message: "No token provided"
			});
		});

		it("should fail with invalid token format", async () => {
			mockRequest.headers = {
				authorization: "InvalidToken"
			};

			await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(mockResponse.status).toHaveBeenCalledWith(401);
		});

		it("should include phone verification status", async () => {
			const phoneModel = new PhoneModel();
			await phoneModel.create({
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			});
			await phoneModel.verify(testUserId, "123456");

			mockRequest.headers = {
				authorization: `Bearer ${testToken}`
			};

			await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(nextFunction).toHaveBeenCalled();
			expect(mockRequest.phoneVerified).toBe(true);
		});
	});

	describe("authorize", () => {
		beforeEach(() => {
			mockRequest = {
				user: {
					userId: testUserId,
					userType: "rider"
				}
			};
		});

		it("should authorize correct role", () => {
			const authorizeRider = authorize("rider");
			authorizeRider(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(nextFunction).toHaveBeenCalled();
		});

		it("should not authorize incorrect role", () => {
			const authorizeDriver = authorize("driver");
			authorizeDriver(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.status?.(403).json).toHaveBeenCalledWith({
				status: "error",
				message: "Unauthorized access"
			});
		});

		it("should handle multiple allowed roles", () => {
			const authorizeMultiple = authorize("rider", "admin");
			authorizeMultiple(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(nextFunction).toHaveBeenCalled();
		});

		it("should handle missing user", () => {
			mockRequest.user = undefined;
			const authorizeRider = authorize("rider");
			authorizeRider(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
		});
	});
});
