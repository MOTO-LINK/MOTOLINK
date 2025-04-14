import { PhoneController } from "../../controllers/phone.controller";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Response } from "express";
import { UserModel } from "../../models/user.model";
import { PhoneModel } from "../../models/phone.model";
import { TwilioService } from "../../services/twilio.service";
import clearDatabase from "../../utils/clearDatabase";

describe("PhoneController", () => {
	let phoneController: PhoneController;
	let mockRequest: Partial<AuthRequest>;
	let mockResponse: Partial<Response>;
	let responseObject: any = {};
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
		phoneController = new PhoneController();
		mockRequest = {
			user: {
				userId: testUserId,
				userType: "rider"
			},
			body: {}
		};
		mockResponse = {
			status: jasmine.createSpy("status").and.returnValue({
				json: (result: any) => {
					responseObject = result;
				}
			})
		};

		spyOn(TwilioService.prototype, "sendVerificationCode").and.returnValue(
			Promise.resolve("123456")
		);
	});

	describe("sendVerificationCode", () => {
		it("should send verification code successfully", async () => {
			mockRequest.body = {
				phoneNumber: "+1234567890"
			};

			await phoneController.sendVerificationCode(
				mockRequest as AuthRequest,
				mockResponse as Response
			);

			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(responseObject.status).toBe("success");
			expect(responseObject.message).toBe("Verification code sent successfully");
		});

		it("should fail without phone number", async () => {
			await phoneController.sendVerificationCode(
				mockRequest as AuthRequest,
				mockResponse as Response
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Phone number is required");
		});
	});

	describe("verifyPhoneNumber", () => {
		it("should verify phone number successfully", async () => {
			mockRequest.body = {
				verificationCode: "123456"
			};

			spyOn(PhoneModel.prototype, "verify").and.returnValue(Promise.resolve(true));

			await phoneController.verifyPhoneNumber(
				mockRequest as AuthRequest,
				mockResponse as Response
			);

			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(responseObject.status).toBe("success");
			expect(responseObject.message).toBe("Phone number verified successfully");
		});

		it("should fail with invalid verification code", async () => {
			mockRequest.body = {
				verificationCode: "invalid"
			};

			spyOn(PhoneModel.prototype, "verify").and.returnValue(Promise.resolve(false));

			await phoneController.verifyPhoneNumber(
				mockRequest as AuthRequest,
				mockResponse as Response
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(responseObject.status).toBe("error");
			expect(responseObject.message).toBe("Invalid verification code");
		});
	});
});
