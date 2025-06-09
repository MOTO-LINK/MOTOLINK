import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import pool from "../utils/database";
import config from "../utils/config";
import { UserType } from "../utils/types";

export interface User {
	user_id: string;
	name: string;
	email: string;
	password: string;
	profile_picture?: string;
	dob: Date;
	user_type: UserType;
	account_locked: boolean;
	default_location_id?: string;
	created_at?: Date;
	updated_at?: Date;
	last_login?: Date;
}

export interface CreateUserInput {
	name: string;
	email: string;
	password: string;
	dob: Date;
	user_type: UserType;
	profile_picture?: string;
}

export class UserModel {
	/**
	 * Creates a new user and generates a wallet for the user.
	 *
	 * @param {CreateUserInput} userData - The user data to be inserted into the database.
	 * @return {Promise<Omit<User, "password">>} The newly created user data without the password.
	 */
	async create(userData: CreateUserInput): Promise<Omit<User, "password">> {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const hashedPassword = await bcrypt.hash(userData.password, config.saltRounds);
			const userId = uuidv4();

			// Create user
			const userResult = await client.query(
				`INSERT INTO users (
          user_id, name, email, password, profile_picture, dob, user_type, account_locked
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING user_id, name, email, profile_picture, dob, user_type, 
                  account_locked, created_at, updated_at`,
				[
					userId,
					userData.name,
					userData.email.toLowerCase(),
					hashedPassword,
					userData.profile_picture || null,
					userData.dob,
					userData.user_type,
					false
				]
			);

			// Create wallet for the user
			await client.query(
				`INSERT INTO wallets (wallet_id, user_id, balance, amount_owed, currency, status)
         VALUES ($1, $2, 0, 0, 'EGP', 'active')`,
				[uuidv4(), userId]
			);

			await client.query("COMMIT");

			return userResult.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");

			if ((error as any).constraint === "users_email_key") {
				throw new Error("Email already exists");
			}
			throw error;
		} finally {
			client.release();
		}
	}

	/**
	 * Finds a user by their email address.
	 *
	 * @param {string} email - The email address to search for.
	 * @return {Promise<User | null>} The user data if found, or null if not found.
	 */
	async findByEmail(email: string): Promise<User | null> {
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [
			email.toLowerCase()
		]);
		return result.rows[0] || null;
	}

	/**
	 * Finds a user by their user ID.
	 *
	 * @param {string} userId - The user ID to search for.
	 * @return {Promise<Omit<User, "password"> | null>} The user data without password if found, or null if not found.
	 */
	async findById(userId: string): Promise<Omit<User, "password"> | null> {
		const result = await pool.query(
			`SELECT user_id, name, email, profile_picture, dob, user_type, 
              account_locked, default_location_id, created_at, updated_at, last_login
       FROM users WHERE user_id = $1`,
			[userId]
		);
		return result.rows[0] || null;
	}

	/**
	 * Finds a user by their phone number.
	 *
	 * @param {string} phone - The phone number to search for.
	 * @return {Promise<User | null>} The user data if found, or null if not found.
	 */
	async findByPhone(phone: string): Promise<User | null> {
		const result = await pool.query(
			`SELECT u.* FROM users u
       JOIN phone_numbers p ON u.user_id = p.user_id
       WHERE p.phone_number = $1`,
			[phone]
		);
		return result.rows[0] || null;
	}

	/**
	 * Updates the last login timestamp of a user.
	 *
	 * @param {string} userId - The ID of the user to update.
	 * @return {Promise<void>} An empty promise that resolves when the update is complete.
	 */
	async updateLastLogin(userId: string): Promise<void> {
		await pool.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1", [
			userId
		]);
	}

	/**
	 * Updates a user's profile information.
	 *
	 * @param {string} userId - The ID of the user to update.
	 * @param {Partial<Pick<User, "name" | "email" | "profile_picture">>} updates - The updated profile information.
	 * @return {Promise<Omit<User, "password">>} The updated user data without the password.
	 */
	async updateProfile(
		userId: string,
		updates: Partial<Pick<User, "name" | "email" | "profile_picture">>
	): Promise<Omit<User, "password">> {
		const fields = [];
		const values = [];
		let paramCount = 1;

		if (updates.name !== undefined) {
			fields.push(`name = $${paramCount++}`);
			values.push(updates.name);
		}

		if (updates.email !== undefined) {
			fields.push(`email = $${paramCount++}`);
			values.push(updates.email.toLowerCase());
		}

		if (updates.profile_picture !== undefined) {
			fields.push(`profile_picture = $${paramCount++}`);
			values.push(updates.profile_picture);
		}

		fields.push(`updated_at = CURRENT_TIMESTAMP`);
		values.push(userId);

		const query = `
      UPDATE users 
      SET ${fields.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING user_id, name, email, profile_picture, dob, user_type, 
                account_locked, created_at, updated_at
    `;

		const result = await pool.query(query, values);
		return result.rows[0];
	}

	/**
	 * Updates a user's password.
	 *
	 * @param {string} userId - The ID of the user to update.
	 * @param {string} newPassword - The new password to be hashed and stored.
	 * @return {Promise<void>} An empty promise that resolves when the update is complete.
	 */
	async updatePassword(userId: string, newPassword: string): Promise<void> {
		const hashedPassword = await bcrypt.hash(newPassword, config.saltRounds);
		await pool.query(
			"UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
			[hashedPassword, userId]
		);
	}

	/**
	 * Locks a user's account.
	 *
	 * @param {string} userId - The ID of the user to lock.
	 * @return {Promise<void>} An empty promise that resolves when the account is locked.
	 */
	async lockAccount(userId: string): Promise<void> {
		await pool.query(
			"UPDATE users SET account_locked = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1",
			[userId]
		);
	}

	/**
	 * Unlocks a user's account.
	 *
	 * @param {string} userId - The ID of the user to unlock.
	 * @return {Promise<void>} An empty promise that resolves when the account is unlocked.
	 */
	async unlockAccount(userId: string): Promise<void> {
		await pool.query(
			"UPDATE users SET account_locked = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1",
			[userId]
		);
	}

	/**
	 * Verifies a plain password against a hashed password.
	 *
	 * @param {string} plainPassword - The plain password to verify.
	 * @param {string} hashedPassword - The hashed password to compare against.
	 * @return {Promise<boolean>} True if the plain password matches the hashed password, false otherwise.
	 */
	async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	/**
	 * Checks if an email address already exists in the database, optionally excluding a specific user ID.
	 *
	 * @param {string} email - The email address to check for existence.
	 * @param {string} [excludeUserId] - The ID of the user to exclude from the check (optional).
	 * @return {Promise<boolean>} True if the email address exists, false otherwise.
	 */
	async checkEmailExists(email: string, excludeUserId?: string): Promise<boolean> {
		let query = "SELECT 1 FROM users WHERE email = $1";
		const params: any[] = [email.toLowerCase()];

		if (excludeUserId) {
			query += " AND user_id != $2";
			params.push(excludeUserId);
		}

		const result = await pool.query(query + " LIMIT 1", params);
		return result.rows.length > 0;
	}
}

export default new UserModel();
