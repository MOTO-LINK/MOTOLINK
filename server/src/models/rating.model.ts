import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface Rating {
	rating_id: string;
	ride_transaction_id: string;
	rating_user_id: string;
	rated_user_id: string;
	rating_value: number;
	feedback?: string;
	created_at?: Date;
}

export class RatingModel {
	async create(ratingData: {
		ride_transaction_id: string;
		rating_user_id: string;
		rated_user_id: string;
		rating_value: number;
		feedback?: string;
	}): Promise<Rating> {
		const result = await pool.query(
			`INSERT INTO ratings (
        rating_id, ride_transaction_id, rating_user_id, 
        rated_user_id, rating_value, feedback
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
			[
				uuidv4(),
				ratingData.ride_transaction_id,
				ratingData.rating_user_id,
				ratingData.rated_user_id,
				ratingData.rating_value,
				ratingData.feedback || null
			]
		);
		return result.rows[0];
	}

	async findByTransactionAndUser(transactionId: string, userId: string): Promise<Rating | null> {
		const result = await pool.query(
			`SELECT * FROM ratings 
       WHERE ride_transaction_id = $1 AND rating_user_id = $2`,
			[transactionId, userId]
		);
		return result.rows[0] || null;
	}

	async getUserRatings(
		userId: string,
		page: number = 1,
		limit: number = 20
	): Promise<{ ratings: Rating[]; average: number; total: number }> {
		const offset = (page - 1) * limit;

		const [ratingsResult, statsResult] = await Promise.all([
			pool.query(
				`SELECT r.*, u.name as rater_name
         FROM ratings r
         JOIN users u ON r.rating_user_id = u.user_id
         WHERE r.rated_user_id = $1
         ORDER BY r.created_at DESC
         LIMIT $2 OFFSET $3`,
				[userId, limit, offset]
			),
			pool.query(
				`SELECT COUNT(*) as total, AVG(rating_value) as average
         FROM ratings
         WHERE rated_user_id = $1`,
				[userId]
			)
		]);

		return {
			ratings: ratingsResult.rows,
			average: parseFloat(statsResult.rows[0].average) || 0,
			total: parseInt(statsResult.rows[0].total) || 0
		};
	}
}

export default new RatingModel();
