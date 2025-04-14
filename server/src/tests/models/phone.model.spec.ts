import { PhoneModel } from "../../models/phone.model";
import pool from "../../utils/database";
import { UserModel } from "../../models/user.model";
import clearDatabase from "../../utils/clearDatabase";
import { v4 as uuidv4 } from "uuid";

describe("PhoneModel", () => {
	const phoneModel = new PhoneModel();
	let testUserId: string;

	beforeAll(async () => {
		clearDatabase();

		// Create test user
		const userModel = new UserModel();
		const user = await userModel.create({
			name: "Phone Test User",
			email: "phonetest@test.com",
			password: "password123",
			user_type: "rider"
		});
		testUserId = user.user_id;
	});

	beforeEach(async () => {
		// Clear phone numbers before each test
		await pool.query("DELETE FROM phone_numbers");
	});

	describe("create", () => {
		it("should create a new phone number record", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			const result = await phoneModel.create(phoneData);

			expect(result.user_id).toBe(testUserId);
			expect(result.phone_number).toBe("+1234567890");
			expect(result.verified).toBe(false);
			expect(result.verification_code).toBe("123456");
			expect(result.last_verification_attempt).toBeDefined();
		});

		it("should not allow duplicate phone numbers", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			await phoneModel.create(phoneData);

			await expectAsync(
				phoneModel.create({
					...phoneData,
					user_id: "different-user-id"
				})
			).toBeRejected();
		});
	});

	describe("findByUserId", () => {
		it("should find phone number by user ID", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			await phoneModel.create(phoneData);
			const result = await phoneModel.findByUserId(testUserId);

			expect(result).toBeDefined();
			expect(result?.phone_number).toBe("+1234567890");
		});

		it("should return null for non-existent user ID", async () => {
			const result = await phoneModel.findByUserId(uuidv4());
			expect(result).toBeNull();
		});
	});

	describe("findByPhoneNumber", () => {
		it("should find record by phone number", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			await phoneModel.create(phoneData);
			const result = await phoneModel.findByPhoneNumber("+1234567890");

			expect(result).toBeDefined();
			expect(result?.user_id).toBe(testUserId);
		});

		it("should return null for non-existent phone number", async () => {
			const result = await phoneModel.findByPhoneNumber("+9999999999");
			expect(result).toBeNull();
		});
	});

	describe("updateVerificationCode", () => {
		it("should update verification code", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			await phoneModel.create(phoneData);
			await phoneModel.updateVerificationCode(testUserId, "654321");

			const result = await phoneModel.findByUserId(testUserId);
			expect(result?.verification_code).toBe("654321");
		});
	});

	describe("verify", () => {
		it("should verify phone number with correct code", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			await phoneModel.create(phoneData);
			const verified = await phoneModel.verify(testUserId, "123456");

			expect(verified).toBe(true);

			const result = await phoneModel.findByUserId(testUserId);
			expect(result?.verified).toBe(true);
			expect(result?.verification_code).toBeNull();
		});

		it("should not verify with incorrect code", async () => {
			const phoneData = {
				user_id: testUserId,
				phone_number: "+1234567890",
				verification_code: "123456"
			};

			await phoneModel.create(phoneData);
			const verified = await phoneModel.verify(testUserId, "wrong-code");

			expect(verified).toBe(false);

			const result = await phoneModel.findByUserId(testUserId);
			expect(result?.verified).toBe(false);
			expect(result?.verification_code).toBe("123456");
		});
	});
});
