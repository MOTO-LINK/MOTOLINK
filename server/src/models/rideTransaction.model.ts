import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface RideTransaction {
	transaction_id: string;
	request_id: string;
	driver_id: string;
	start_time: Date;
	end_time?: Date;
	actual_distance?: number;
	payment_status: "pending" | "success" | "failure" | "refunded";
	base_fare: number;
	platform_fee: number;
	tax_amount: number;
	cancellation_fee?: number;
	promo_code_id?: string;
	discount_amount?: number;
	total_fee: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface CreateTransactionInput {
	request_id: string;
	driver_id: string;
	base_fare: number;
	platform_fee: number;
	tax_amount: number;
	total_fee: number;
}

export class RideTransactionModel {
	async create(transactionData: CreateTransactionInput): Promise<RideTransaction> {
		const result = await pool.query(
			`INSERT INTO ride_transactions (
        transaction_id, request_id, driver_id, start_time,
        payment_status, base_fare, platform_fee, tax_amount, total_fee
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
			[
				uuidv4(),
				transactionData.request_id,
				transactionData.driver_id,
				new Date(),
				"pending",
				transactionData.base_fare,
				transactionData.platform_fee,
				transactionData.tax_amount,
				transactionData.total_fee
			]
		);
		return result.rows[0];
	}

	async findByRequestId(requestId: string): Promise<RideTransaction | null> {
		const result = await pool.query("SELECT * FROM ride_transactions WHERE request_id = $1", [
			requestId
		]);
		return result.rows[0] || null;
	}

	async completeRide(
		transactionId: string,
		actualDistance: number,
		paymentStatus: string
	): Promise<RideTransaction> {
		const result = await pool.query(
			`UPDATE ride_transactions 
       SET end_time = CURRENT_TIMESTAMP,
           actual_distance = $1,
           payment_status = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE transaction_id = $3
       RETURNING *`,
			[actualDistance, paymentStatus, transactionId]
		);
		return result.rows[0];
	}

	async applyPromoCode(
		transactionId: string,
		promoCodeId: string,
		discountAmount: number
	): Promise<RideTransaction> {
		const result = await pool.query(
			`UPDATE ride_transactions 
       SET promo_code_id = $1,
           discount_amount = $2,
           total_fee = total_fee - $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE transaction_id = $3
       RETURNING *`,
			[promoCodeId, discountAmount, transactionId]
		);
		return result.rows[0];
	}

	async getDriverEarnings(
		driverId: string,
		startDate: Date,
		endDate: Date
	): Promise<{
		totalEarnings: number;
		totalRides: number;
		platformFees: number;
	}> {
		const result = await pool.query(
			`SELECT 
        COUNT(*) as total_rides,
        SUM(base_fare) as total_earnings,
        SUM(platform_fee) as platform_fees
       FROM ride_transactions
       WHERE driver_id = $1
         AND payment_status = 'success'
         AND end_time BETWEEN $2 AND $3`,
			[driverId, startDate, endDate]
		);

		const data = result.rows[0];
		return {
			totalEarnings: parseFloat(data.total_earnings) || 0,
			totalRides: parseInt(data.total_rides) || 0,
			platformFees: parseFloat(data.platform_fees) || 0
		};
	}
}

export default new RideTransactionModel();
