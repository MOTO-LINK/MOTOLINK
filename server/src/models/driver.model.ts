import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";
import { VehicleType, OrderType, VerificationStatus } from "../utils/types";

export interface Driver {
	driver_id: string;
	national_id?: string;
	vehicle_registration_number?: string;
	vehicle_type: VehicleType;
	order_types: OrderType[];
	current_location_id?: string;
	is_online: boolean;
	is_available: boolean;
	verified: boolean;
	verification_status: VerificationStatus;
	rating?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface DriverPendingVerification extends Driver {
	name: string;
	email: string;
	phone_number: string;
	total_documents: number;
	verified_documents: number;
}

export interface CreateDriverInput {
	driver_id: string;
	vehicle_type: VehicleType;
	order_types: OrderType[];
}

export class DriverModel {
	/**
	 * Creates a new driver record in the database.
	 *
	 * @param {CreateDriverInput} driverData - The input data for the new driver.
	 * @return {Promise<Driver>} The newly created driver record.
	 */
	async create(driverData: CreateDriverInput): Promise<Driver> {
		const result = await pool.query(
			`INSERT INTO drivers (
        driver_id, vehicle_type, order_types, is_online, is_available, 
        verified, verification_status
      ) VALUES ($1, $2, $3, false, false, false, $4)
      RETURNING *`,
			[
				driverData.driver_id,
				driverData.vehicle_type,
				driverData.order_types,
				VerificationStatus.PENDING
			]
		);
		return result.rows[0];
	}

	/**
	 * Finds a driver by their driver ID.
	 *
	 * @param {string} driverId - The ID of the driver to search for.
	 * @return {Promise<Driver | null>} The driver data if found, or null if not found.
	 */
	async findById(driverId: string): Promise<Driver | null> {
		const result = await pool.query(
			`
			SELECT d.*, u.account_locked
      		FROM drivers d
      		JOIN users u ON d.driver_id = u.user_id
			WHERE d.driver_id = $1`,
			[driverId]
		);
		return result.rows[0] || null;
	}

	/**
	 * Updates a driver's document information in the database.
	 *
	 * @param {string} driverId - The ID of the driver to update.
	 * @param {string} nationalId - The driver's national ID.
	 * @param {string} vehicleRegistration - The driver's vehicle registration number.
	 * @return {Promise<Driver>} The updated driver record.
	 */
	async updateDocumentInfo(
		driverId: string,
		nationalId: string,
		vehicleRegistration: string
	): Promise<Driver> {
		const result = await pool.query(
			`UPDATE drivers 
       SET national_id = $1, vehicle_registration_number = $2, updated_at = CURRENT_TIMESTAMP
       WHERE driver_id = $3
       RETURNING *`,
			[nationalId, vehicleRegistration, driverId]
		);
		return result.rows[0];
	}

	/**
	 * Updates a driver's status information in the database.
	 *
	 * @param {string} driverId - The ID of the driver to update.
	 * @param {Partial<Pick<Driver, "is_online" | "is_available">>} updates - The updated status information.
	 * @return {Promise<Driver>} The updated driver record.
	 */
	async updateStatus(
		driverId: string,
		updates: Partial<Pick<Driver, "is_online" | "is_available">>
	): Promise<Driver> {
		const fields = [];
		const values = [];
		let paramCount = 1;

		if (updates.is_online !== undefined) {
			fields.push(`is_online = $${paramCount++}`);
			values.push(updates.is_online);
		}

		if (updates.is_available !== undefined) {
			fields.push(`is_available = $${paramCount++}`);
			values.push(updates.is_available);
		}

		fields.push(`updated_at = CURRENT_TIMESTAMP`);
		values.push(driverId);

		const query = `
      UPDATE drivers 
      SET ${fields.join(", ")}
      WHERE driver_id = $${paramCount}
      RETURNING *
    `;

		const result = await pool.query(query, values);
		return result.rows[0];
	}

	/**
	 * Updates a driver's verification status in the database.
	 *
	 * @param {string} driverId - The ID of the driver to update.
	 * @param {VerificationStatus} status - The new verification status.
	 * @param {boolean} verified - Whether the driver is verified or not.
	 * @return {Promise<Driver>} The updated driver record.
	 */
	async updateVerificationStatus(
		driverId: string,
		status: VerificationStatus,
		verified: boolean
	): Promise<Driver> {
		const result = await pool.query(
			`UPDATE drivers 
       SET verification_status = $1, verified = $2, updated_at = CURRENT_TIMESTAMP
       WHERE driver_id = $3
       RETURNING *`,
			[status, verified, driverId]
		);
		return result.rows[0];
	}

	/**
	 * Updates a driver's current location in the database.
	 *
	 * @param {string} driverId - The ID of the driver to update.
	 * @param {string} locationId - The new location ID of the driver.
	 * @return {Promise<void>} An empty promise that resolves when the update is complete.
	 */
	async updateLocation(driverId: string, locationId: string): Promise<void> {
		await pool.query(
			`UPDATE drivers 
       SET current_location_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE driver_id = $2`,
			[locationId, driverId]
		);
	}

	/**
	 * Retrieves a list of available drivers based on the provided vehicle type and order type.
	 *
	 * @param {VehicleType} [vehicleType] - The type of vehicle to filter drivers by.
	 * @param {OrderType} [orderType] - The type of order to filter drivers by.
	 * @return {Promise<Driver[]>} A promise that resolves to an array of available driver records.
	 */
	async getAvailableDrivers(vehicleType?: VehicleType, orderType?: OrderType): Promise<Driver[]> {
		let query = `
      SELECT d.*, u.name, u.profile_picture, u.account_locked, p.phone_number
      FROM drivers d
      JOIN users u ON d.driver_id = u.user_id
      LEFT JOIN phone_numbers p ON u.user_id = p.user_id
      WHERE d.is_online = true 
        AND d.is_available = true 
        AND d.verified = true
		AND u.account_locked = false
    `;

		const params: any[] = [];
		let paramCount = 1;

		if (vehicleType) {
			query += ` AND d.vehicle_type = $${paramCount++}`;
			params.push(vehicleType);
		}

		if (orderType) {
			query += ` AND $${paramCount++} = ANY(d.order_types)`;
			params.push(orderType);
		}

		const result = await pool.query(query, params);
		return result.rows;
	}

	/**
	 * Updates a driver's rating in the database based on the average rating from the ratings table.
	 *
	 * @param {string} driverId - The ID of the driver to update.
	 * @return {Promise<void>} An empty promise that resolves when the update is complete.
	 */
	async updateRating(driverId: string): Promise<void> {
		await pool.query(
			`UPDATE drivers 
       SET rating = (
         SELECT AVG(rating_value)::numeric(3,2)
         FROM ratings
         WHERE rated_user_id = $1
       )
       WHERE driver_id = $1`,
			[driverId]
		);
	}

	async getDriversByVerificationStatus(
		status: string,
		limit: string | number,
		offset: string | number
	): Promise<DriverPendingVerification[]> {
		const result = await pool.query(
			`
        SELECT d.*, u.name, u.email, p.phone_number,
               (SELECT COUNT(*) FROM documents WHERE user_id = d.driver_id) as total_documents,
               (SELECT COUNT(*) FROM documents WHERE user_id = d.driver_id AND verification_status = 'verified') as verified_documents
        FROM drivers d
        JOIN users u ON d.driver_id = u.user_id
        LEFT JOIN phone_numbers p ON u.user_id = p.user_id
        WHERE d.verification_status = $1
        ORDER BY d.created_at ASC
        LIMIT $2 OFFSET $3
      `,
			[status, limit, offset]
		);

		return result.rows;
	}

	async getDriversCountByVerificationStatus(status: string): Promise<string> {
		const result = await pool.query(
			`
        SELECT COUNT(*) as total
        FROM drivers
        WHERE verification_status = $1
      `,
			[status]
		);

		return result.rows[0].total;
	}
}

export default new DriverModel();
