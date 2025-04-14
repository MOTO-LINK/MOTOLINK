import { QueryResult } from "pg";
import pool from "../utils/database";

export interface Driver {
	driver_id: string;
	national_id: string;
	vehicle_registration_number: string;
	vehicle_type: "motorcycle" | "rickshaw" | "scooter";
	current_location_id?: string;
	is_online: boolean;
	verified: boolean;
	verification_status: "pending" | "verified" | "declined";
	rating: string;
	documents?: string;
	created_at: Date;
	updated_at: Date;
}

export class DriverModel {
	async create(
		driver: Pick<
			Driver,
			"driver_id" | "national_id" | "vehicle_registration_number" | "vehicle_type"
		>
	): Promise<Driver> {
		const result: QueryResult<Driver> = await pool.query(
			`INSERT INTO drivers (
        driver_id, national_id, vehicle_registration_number, vehicle_type,
        is_online, verified, verification_status, rating
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
			[
				driver.driver_id,
				driver.national_id,
				driver.vehicle_registration_number,
				driver.vehicle_type,
				false, // is_online
				false, // verified
				"pending", // verification_status
				0 // initial rating
			]
		);
		return result.rows[0];
	}
}
