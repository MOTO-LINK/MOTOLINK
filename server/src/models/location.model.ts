import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface Location {
	location_id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	type: "pickup" | "dropoff" | "current" | "saved";
	user_id: string;
	is_default: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface CreateLocationInput {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	type: "pickup" | "dropoff" | "current" | "saved";
	user_id: string;
	is_default?: boolean;
}

export class LocationModel {
	async create(locationData: CreateLocationInput): Promise<Location> {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// If setting as default, unset other defaults for this user
			if (locationData.is_default) {
				await client.query("UPDATE locations SET is_default = false WHERE user_id = $1", [
					locationData.user_id
				]);
			}

			const result = await client.query(
				`INSERT INTO locations (
          location_id, name, address, latitude, longitude, 
          type, user_id, is_default
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
				[
					uuidv4(),
					locationData.name,
					locationData.address,
					locationData.latitude,
					locationData.longitude,
					locationData.type,
					locationData.user_id,
					locationData.is_default || false
				]
			);

			await client.query("COMMIT");
			return result.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async findByUserId(userId: string, type?: string): Promise<Location[]> {
		let query = "SELECT * FROM locations WHERE user_id = $1";
		const params: any[] = [userId];

		if (type) {
			query += " AND type = $2";
			params.push(type);
		}

		query += " ORDER BY is_default DESC, created_at DESC";

		const result = await pool.query(query, params);
		return result.rows;
	}

	async findById(locationId: string): Promise<Location | null> {
		const result = await pool.query("SELECT * FROM locations WHERE location_id = $1", [
			locationId
		]);
		return result.rows[0] || null;
	}

	async update(
		locationId: string,
		userId: string,
		updates: Partial<Omit<Location, "location_id" | "user_id" | "created_at" | "updated_at">>
	): Promise<Location> {
		const fields = [];
		const values = [];
		let paramCount = 1;

		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined) {
				fields.push(`${key} = $${paramCount++}`);
				values.push(value);
			}
		});

		if (fields.length === 0) {
			throw new Error("No fields to update");
		}

		fields.push("updated_at = CURRENT_TIMESTAMP");
		values.push(locationId, userId);

		const query = `
      UPDATE locations 
      SET ${fields.join(", ")}
      WHERE location_id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

		const result = await pool.query(query, values);
		if (result.rows.length === 0) {
			throw new Error("Location not found or unauthorized");
		}

		return result.rows[0];
	}

	async delete(locationId: string, userId: string): Promise<boolean> {
		const result = await pool.query(
			"DELETE FROM locations WHERE location_id = $1 AND user_id = $2",
			[locationId, userId]
		);
		return result.rowCount! > 0;
	}

	async setDefault(locationId: string, userId: string): Promise<Location> {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// Unset all defaults for this user
			await client.query("UPDATE locations SET is_default = false WHERE user_id = $1", [
				userId
			]);

			// Set new default
			const result = await client.query(
				`UPDATE locations 
         SET is_default = true, updated_at = CURRENT_TIMESTAMP
         WHERE location_id = $1 AND user_id = $2
         RETURNING *`,
				[locationId, userId]
			);

			if (result.rows.length === 0) {
				throw new Error("Location not found or unauthorized");
			}

			await client.query("COMMIT");
			return result.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async getDefault(userId: string): Promise<Location | null> {
		const result = await pool.query(
			"SELECT * FROM locations WHERE user_id = $1 AND is_default = true",
			[userId]
		);
		return result.rows[0] || null;
	}
}

export default new LocationModel();
