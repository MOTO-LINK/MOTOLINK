import { AuthController } from "../../controllers/auth.controller";
import { Request, Response } from "express";
import { UserModel } from "../../models/user.model";
import { PhoneModel } from "../../models/phone.model";
import { TwilioService } from "../../services/twilio.service";
import pool from "../../utils/database";
import clearDatabase from "../../utils/clearDatabase";

describe("AuthController", () => {
	let authController: AuthController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let responseObject: any = {};

	beforeEach(() => {
		authController = new AuthController();
		mockRequest = {
			body: {}
		};
		mockResponse = {
			status: jasmine.createSpy("status").and.returnValue({
				json: (result: any) => {
					responseObject = result;
				}
			})
		};
	});

	beforeAll(async () => {
		clearDatabase();
	});

	afterAll(async () => {
		// Clear test database
		await pool.query("DELETE FROM phone_numbers");
		await pool.query("DELETE FROM drivers");
		await pool.query("DELETE FROM riders");
		await pool.query("DELETE FROM users");
	});

	describe("signup", () => {
		let twilioSpy: jasmine.Spy;
		beforeEach(() => {
			twilioSpy = spyOn(TwilioService.prototype, "sendVerificationCode").and.returnValue(
				Promise.resolve("123456")
			);
		});

		it("should create a new rider account successfully", async () => {
			mockRequest.body = {
				name: "Test Rider",
				email: "rider@test.com",
				password: "password123",
				userType: "rider",
				phoneNumber: "+1234567890"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(responseObject.status).toBe("success");
			expect(responseObject.data.user).toBeDefined();
			expect(responseObject.data.user.user_type).toBe("rider");
			expect(responseObject.data.token).toBeDefined();
			expect(responseObject.data.phoneVerified).toBe(false);
		});

		it("should create a new driver account successfully", async () => {
			mockRequest.body = {
				name: "Test Driver",
				email: "driver@test.com",
				password: "password123",
				userType: "driver",
				phoneNumber: "+1234567891",
				nationalId: "TEST123",
				vehicleRegistrationNumber: "VEH123",
				vehicleType: "motorcycle"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(responseObject.status).toBe("success");
			expect(responseObject.data.user).toBeDefined();
			expect(responseObject.data.user.user_type).toBe("driver");
			expect(responseObject.data.token).toBeDefined();
			expect(responseObject.data.phoneVerified).toBe(false);
		});

		it("should fail when required fields are missing", async () => {
			mockRequest.body = {
				name: "Test User",
				email: "test@test.com"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Missing required fields");
		});

		it("should fail when driver-specific fields are missing", async () => {
			mockRequest.body = {
				name: "Test Driver",
				email: "driver2@test.com",
				password: "password123",
				userType: "driver",
				phoneNumber: "+1234567892"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Missing required driver fields");
		});

		it("should fail when phone number is already registered", async () => {
			// First signup
			mockRequest.body = {
				name: "First User",
				email: "first@test.com",
				password: "password123",
				userType: "rider",
				phoneNumber: "+1234567893"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			// Second signup with same phone number
			mockRequest.body = {
				name: "Second User",
				email: "second@test.com",
				password: "password123",
				userType: "rider",
				phoneNumber: "+1234567893"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Phone number already registered");
		});

		it("should create account even if phone verification fails", async () => {
			twilioSpy.and.throwError("Twilio error");

			mockRequest.body = {
				name: "Test User",
				email: "twilioerror@test.com",
				password: "password123",
				userType: "rider",
				phoneNumber: "+1234567894"
			};

			await authController.signup(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(responseObject.status).toBe("success");
			expect(responseObject.data.phoneVerified).toBe(false);
		});
	});

	describe("login", () => {
		let verifiedUserId: string;
		let unverifiedUserId: string;

		beforeAll(async () => {
			// Create a verified user
			const verifiedUser = await new UserModel().create({
				name: "Verified User",
				email: "verified@test.com",
				password: "password123",
				user_type: "rider"
			});
			verifiedUserId = verifiedUser.user_id;

			await new PhoneModel().create({
				user_id: verifiedUserId,
				phone_number: "+1234567895",
				verification_code: "123456"
			});

			await new PhoneModel().verify(verifiedUserId, "123456");

			// Create an unverified user
			const unverifiedUser = await new UserModel().create({
				name: "Unverified User",
				email: "unverified@test.com",
				password: "password123",
				user_type: "rider"
			});
			unverifiedUserId = unverifiedUser.user_id;

			await new PhoneModel().create({
				user_id: unverifiedUserId,
				phone_number: "+1234567896",
				verification_code: "123456"
			});
		});

		it("should login successfully with verified phone number", async () => {
			mockRequest.body = {
				email: "verified@test.com",
				password: "password123"
			};

			await authController.login(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(responseObject.status).toBe("success");
			expect(responseObject.data.token).toBeDefined();
			expect(responseObject.data.phoneVerified).toBe(true);
		});

		it("should login successfully with unverified phone number", async () => {
			mockRequest.body = {
				email: "unverified@test.com",
				password: "password123"
			};

			await authController.login(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(responseObject.status).toBe("success");
			expect(responseObject.data.token).toBeDefined();
			expect(responseObject.data.phoneVerified).toBe(false);
		});

		it("should fail with incorrect password", async () => {
			mockRequest.body = {
				email: "verified@test.com",
				password: "wrongpassword"
			};

			await authController.login(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(401);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Invalid credentials");
		});

		it("should fail with non-existent email", async () => {
			mockRequest.body = {
				email: "nonexistent@test.com",
				password: "password123"
			};

			await authController.login(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(401);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Invalid credentials");
		});

		it("should fail when required fields are missing", async () => {
			mockRequest.body = {
				email: "verified@test.com"
			};

			await authController.login(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Email and password are required");
		});

		it("should fail when account is locked", async () => {
			// Lock the verified user's account
			await pool.query("UPDATE users SET account_locked = true WHERE user_id = $1", [
				verifiedUserId
			]);

			mockRequest.body = {
				email: "verified@test.com",
				password: "password123"
			};

			await authController.login(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Account is locked");

			// Unlock the account for other tests
			await pool.query("UPDATE users SET account_locked = false WHERE user_id = $1", [
				verifiedUserId
			]);
		});
	});
});
