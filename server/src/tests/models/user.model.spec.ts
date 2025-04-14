import { UserModel } from "../../models/user.model";
import clearDatabase from "../../utils/clearDatabase";
import { v4 as uuidv4 } from "uuid";

describe("UserModel", () => {
	const userModel = new UserModel();

	beforeAll(async () => {
		await clearDatabase();
	});

	describe("create", () => {
		it("should create a new user", async () => {
			const user = await userModel.create({
				name: "Test User",
				email: "test@example.com",
				password: "password123",
				user_type: "rider"
			});

			expect(user.user_id).toBeDefined();
			expect(user.name).toBe("Test User");
			expect(user.email).toBe("test@example.com");
			expect(user.user_type).toBe("rider");
			expect((user as any).password).toBeUndefined();
		});

		it("should not create user with duplicate email", async () => {
			await expectAsync(
				userModel.create({
					name: "Duplicate User",
					email: "test@example.com",
					password: "password123",
					user_type: "rider"
				})
			).toBeRejectedWith(new Error("Email already exists"));
		});
	});

	describe("findByEmail", () => {
		it("should find user by email", async () => {
			const user = await userModel.findByEmail("test@example.com");
			expect(user).toBeDefined();
			expect(user?.email).toBe("test@example.com");
		});

		it("should return null for non-existent email", async () => {
			const user = await userModel.findByEmail("nonexistent@example.com");
			expect(user).toBeNull();
		});
	});
	describe("findById", () => {
		let userId: string;

		beforeAll(async () => {
			const user = await userModel.create({
				name: "Find By ID User",
				email: "findbyid@example.com",
				password: "password123",
				user_type: "rider"
			});
			userId = user.user_id;
		});

		it("should find user by id", async () => {
			const user = await userModel.findById(userId);
			expect(user).toBeDefined();
			expect(user?.user_id).toBe(userId);
			expect((user as any).password).toBeUndefined();
		});

		it("should return null for non-existent id", async () => {
			const user = await userModel.findById(uuidv4());
			expect(user).toBeNull();
		});
	});
});
