import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import pool from "../utils/database";
import config from "../utils/config";

export type UserType = "rider" | "driver" | "admin";

export interface User {
	user_id: string;
	name: string;
	email: string;
	password: string;
	profile_picture?: string;
	user_type: UserType;
	account_locked: boolean;
	default_location_id?: string;
	created_at?: Date;
	updated_at?: Date;
}

export class UserModel {
	async create(
		user: Omit<User, "user_id" | "account_locked" | "created_at" | "updated_at">
	): Promise<Omit<User, "password">> {
		try {
			const hashedPassword = await bcrypt.hash(user.password, config.saltRounds);

			const result = await pool.query(
				`INSERT INTO users (
          user_id, name, email, password, profile_picture, user_type, account_locked
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
				[
					uuidv4(),
					user.name,
					user.email.toLowerCase(),
					hashedPassword,
					user.profile_picture || null,
					user.user_type,
					false
				]
			);

			const { password, ...userWithoutPassword } = result.rows[0];
			return userWithoutPassword;
		} catch (error) {
			if ((error as any).constraint === "users_email_key") {
				throw new Error("Email already exists");
			}
			throw error;
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [
			email.toLowerCase()
		]);
		return result.rows[0] || null;
	}

	async findById(userId: string): Promise<Omit<User, "password"> | null> {
		const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
		if (!result.rows[0]) return null;

		const { password, ...userWithoutPassword } = result.rows[0];
		return userWithoutPassword;
	}

	async updateLastLogin(userId: string): Promise<void> {
		await pool.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1", [
			userId
		]);
	}
}
