import { DriverModel } from "../../models/driver.model";
import { UserModel } from "../../models/user.model";
import clearDatabase from "../../utils/clearDatabase";
import pool from "../../utils/database";

describe("DriverModel", () => {
	const driverModel = new DriverModel();
	const userModel = new UserModel();
	let userId: string;

	beforeAll(async () => {
		await clearDatabase();

		const user = await userModel.create({
			name: "Test Driver",
			email: "testdriver@example.com",
			password: "password123",
			user_type: "driver"
		});
		userId = user.user_id;
	});

	afterAll(async () => {
		await pool.query("DELETE FROM drivers");
		await pool.query("DELETE FROM users");
	})

	describe("create", () => {
		it("should create a new driver", async () => {
			const driver = await driverModel.create({
				driver_id: userId,
				national_id: "TEST123",
				vehicle_registration_number: "VEH123",
				vehicle_type: "motorcycle"
			});

			expect(driver.driver_id).toBe(userId);
			expect(driver.national_id).toBe("TEST123");
			expect(driver.vehicle_registration_number).toBe("VEH123");
			expect(driver.vehicle_type).toBe("motorcycle");
			expect(driver.is_online).toBe(false);
			expect(driver.verified).toBe(false);
			expect(driver.verification_status).toBe("pending");
			expect(parseFloat(driver.rating)).toEqual(0.00);
		});

		it("should not create driver with duplicate national_id", async () => {
			await expectAsync(
				driverModel.create({
					driver_id: "another-id",
					national_id: "TEST123",
					vehicle_registration_number: "VEH456",
					vehicle_type: "motorcycle"
				})
			).toBeRejected();
		});
	});
});
