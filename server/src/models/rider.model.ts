// src/models/rider.model.ts
import pool from "../utils/database";

export interface Rider {
	rider_id: string;
	current_location_id?: string;
	rating: number;
	created_at: Date;
	updated_at: Date;
}

export class RiderModel {
	async create(rider: Pick<Rider, "rider_id">): Promise<Rider> {
		const result = await pool.query(
			`INSERT INTO riders (rider_id, rating) 
       VALUES ($1, $2) RETURNING *`,
			[rider.rider_id, 0]
		);
		return result.rows[0];
	}
}
