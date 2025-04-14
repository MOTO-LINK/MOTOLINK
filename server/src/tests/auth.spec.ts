import supertest from "supertest";
import app from "../server";
import clearDatabase from "../utils/clearDatabase";

const request = supertest(app);

describe("Authentication Endpoints", () => {
	beforeAll(async () => {
		await clearDatabase();
	});

	describe("POST /api/auth/signup", () => {
		it("should create a new rider", async () => {
			const response = await request.post("/api/auth/signup").send({
				name: "Test Rider",
				email: "rider@test.com",
				password: "password123",
				userType: "rider",
				phoneNumber: "+1234567890",
				
			});

			expect(response.status).toBe(201);
			expect(response.body.status).toBe("success");
			expect(response.body.data.user.user_type).toBe("rider");
			expect(response.body.data.token).toBeDefined();
		});

		it("should create a new driver", async () => {
			const response = await request.post("/api/auth/signup").send({
				name: "Test Driver",
				email: "driver@test.com",
				password: "password123",
				userType: "driver",
				phoneNumber: "+1234567891",
				nationalId: "TEST123",
				vehicleRegistrationNumber: "VEH123",
				vehicleType: "motorcycle"
			});

			expect(response.status).toBe(201);
			expect(response.body.status).toBe("success");
			expect(response.body.data.user.user_type).toBe("driver");
			expect(response.body.data.token).toBeDefined();
		});

		it("should fail when driver fields are missing", async () => {
			const response = await request.post("/api/auth/signup").send({
				name: "Failed Driver",
				email: "failed@test.com",
				password: "password123",
				userType: "driver",
				phoneNumber: "+1234567892"
			});

			expect(response.status).toBe(400);
			expect(response.body.status).toBe("error");
			expect(response.body.message).toBe("Missing required driver fields");
		});
	});

	describe("POST /api/auth/login", () => {
		it("should login successfully with correct credentials", async () => {
			const response = await request.post("/api/auth/login").send({
				email: "rider@test.com",
				password: "password123"
			});

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("success");
			expect(response.body.data.token).toBeDefined();
		});

		it("should fail with incorrect password", async () => {
			const response = await request.post("/api/auth/login").send({
				email: "rider@test.com",
				password: "wrongpassword"
			});

			expect(response.status).toBe(401);
			expect(response.body.status).toBe("error");
			expect(response.body.message).toBe("Invalid credentials");
		});
	});
});
