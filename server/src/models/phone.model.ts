import pool from "../utils/database";
import crypto from "crypto";

export interface PhoneNumber {
	user_id: string;
	phone_number: string;
	verified: boolean;
	verification_code?: string;
	last_verification_attempt?: Date;
}

export class PhoneModel {
	async create(userId: string, phoneNumber: string): Promise<PhoneNumber> {
		const result = await pool.query(
			`INSERT INTO phone_numbers (user_id, phone_number, verified, verification_code)
       VALUES ($1, $2, false, $3)
       ON CONFLICT (phone_number) 
       DO UPDATE SET user_id = $1, verified = false, verification_code = $3
       RETURNING *`,
			[userId, phoneNumber, this.generateVerificationCode()]
		);
		return result.rows[0];
	}

	async findByUserId(userId: string): Promise<PhoneNumber | null> {
		const result = await pool.query("SELECT * FROM phone_numbers WHERE user_id = $1", [userId]);
		return result.rows[0] || null;
	}

	async findByPhoneNumber(phoneNumber: string): Promise<PhoneNumber | null> {
		const result = await pool.query("SELECT * FROM phone_numbers WHERE phone_number = $1", [
			phoneNumber
		]);
		return result.rows[0] || null;
	}

	async updateVerificationCode(phoneNumber: string): Promise<string> {
		const code = this.generateVerificationCode();
		await pool.query(
			`UPDATE phone_numbers 
       SET verification_code = $1, last_verification_attempt = CURRENT_TIMESTAMP
       WHERE phone_number = $2`,
			[code, phoneNumber]
		);
		return code;
	}

	async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
		console.log(phoneNumber)
		// !THIS IS ONLY FOR DEVELOPMENT
		if (process.env.SKIP_VERIFICATION && code === "123456") {
			const result = await pool.query(
				`UPDATE phone_numbers 
       SET verified = true, verification_code = NULL
       WHERE phone_number = $1
       RETURNING *`,
				[phoneNumber]
			);
			return result.rows.length > 0;
		}
		const result = await pool.query(
			`UPDATE phone_numbers 
       SET verified = true, verification_code = NULL
       WHERE phone_number = $1 AND verification_code = $2
       RETURNING *`,
			[phoneNumber, code]
		);
		return result.rows.length > 0;
	}

	async checkPhoneExists(phoneNumber: string, excludeUserId?: string): Promise<boolean> {
		let query = "SELECT 1 FROM phone_numbers WHERE phone_number = $1";
		const params: any[] = [phoneNumber];

		if (excludeUserId) {
			query += " AND user_id != $2";
			params.push(excludeUserId);
		}
		const result = await pool.query(query + " LIMIT 1", params);
		return result.rows.length > 0;
	}

	async isVerified(phoneNumber: string): Promise<boolean> {
		const result = await pool.query(
			"SELECT verified FROM phone_numbers WHERE phone_number = $1",
			[phoneNumber]
		);
		return result.rows[0]?.verified || false;
	}

	async canRequestNewCode(phoneNumber: string): Promise<boolean> {
		const result = await pool.query(
			`SELECT last_verification_attempt FROM phone_numbers WHERE phone_number = $1`,
			[phoneNumber]
		);

		if (!result.rows[0]) return true;

		const lastAttempt = result.rows[0].last_verification_attempt;
		if (!lastAttempt) return true;

		const timeDiff = Date.now() - new Date(lastAttempt).getTime();
		const minutesPassed = timeDiff / (1000 * 60);

		return minutesPassed >= 1; // Allow new code after 1 minute
	}

	private generateVerificationCode(): string {
		return crypto.randomInt(100000, 999999).toString();
	}
}

export default new PhoneModel();
