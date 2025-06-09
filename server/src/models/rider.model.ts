import pool from "../utils/database";

export interface Rider {
	rider_id: string;
	current_location?: string;
	rating?: number;
	created_at?: Date;
	updated_at?: Date;
}

export class RiderModel {
	/**
	 * Creates a new rider record in the database.
	 *
	 * @param {string} riderId - The ID of the rider to create.
	 * @return {Promise<Rider>} The newly created rider record.
	 */
	async create(riderId: string): Promise<Rider> {
		const result = await pool.query(`INSERT INTO riders (rider_id) VALUES ($1) RETURNING *`, [
			riderId
		]);
		return result.rows[0];
	}

	/**
	 * Finds a rider by their ID.
	 *
	 * @param {string} riderId - The ID of the rider to search for.
	 * @return {Promise<Rider | null>} The rider data if found, or null if not found.
	 */
	async findById(riderId: string): Promise<Rider | null> {
		const result = await pool.query("SELECT * FROM riders WHERE rider_id = $1", [riderId]);
		return result.rows[0] || null;
	}

	/**
	 * Updates a rider's current location in the database.
	 *
	 * @param {string} riderId - The ID of the rider to update.
	 * @param {string} locationId - The new location ID of the rider.
	 * @return {Promise<void>} An empty promise that resolves when the update is complete.
	 */
	async updateLocation(riderId: string, locationId: string): Promise<void> {
		await pool.query(
			`UPDATE riders 
       SET current_location = $1, updated_at = CURRENT_TIMESTAMP
       WHERE rider_id = $2`,
			[locationId, riderId]
		);
	}

	/**
	 * Updates a rider's rating in the database based on the average rating from the ratings table.
	 *
	 * @param {string} riderId - The ID of the rider to update.
	 * @return {Promise<void>} An empty promise that resolves when the update is complete.
	 */
	async updateRating(riderId: string): Promise<void> {
		await pool.query(
			`UPDATE riders 
       SET rating = (
         SELECT AVG(rating_value)::numeric(3,2)
         FROM ratings
         WHERE rated_user_id = $1
       )
       WHERE rider_id = $1`,
			[riderId]
		);
	}

	/**
	 * Retrieves a rider's information along with their associated user data.
	 *
	 * @param {string} riderId - The ID of the rider to retrieve information for.
	 * @return {Promise<any>} The rider's information along with their associated user data, or null if not found.
	 */
	async getWithUserInfo(riderId: string): Promise<any> {
		const result = await pool.query(
			`SELECT r.*, u.name, u.email, u.profile_picture, p.phone_number
       FROM riders r
       JOIN users u ON r.rider_id = u.user_id
       LEFT JOIN phone_numbers p ON u.user_id = p.user_id
       WHERE r.rider_id = $1`,
			[riderId]
		);
		return result.rows[0] || null;
	}
}

export default new RiderModel();
