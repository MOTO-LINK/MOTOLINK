import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface Wallet {
	wallet_id: string;
	user_id: string;
	balance: number;
	amount_owed: number;
	currency: string;
	status: "active" | "inactive" | "suspended";
	last_updated?: Date;
	created_at?: Date;
}

export interface WalletTransaction {
	transaction_id: string;
	wallet_id: string;
	amount: number;
	type: "credit" | "debit";
	purpose: "ride_payment" | "top_up" | "withdrawal" | "refund" | "cancellation_fee";
	payment_to?: string;
	status: "pending" | "completed" | "failed" | "reversed";
	reference_id?: string;
	description?: string;
	created_at?: Date;
}

export interface GatewayTransaction {
	gateway_transaction_id: string;
	user_id: string;
	wallet_transaction_id: string;
	total_fee: number;
	payment_status: 'pending' | 'success' | 'failure' | 'refunded';
	invoice_id: string;
	payment_data: object;
	created_at?: Date;
	updated_at?: Date;
}

export class WalletModel {
	async findByUserId(userId: string): Promise<Wallet | null> {
		const result = await pool.query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
		return result.rows[0] || null;
	}

	async getBalance(userId: string): Promise<number> {
		const wallet = await this.findByUserId(userId);
		return wallet?.balance || 0;
	}

	async credit(
		userId: string,
		amount: number,
		purpose: string,
		referenceId?: string,
		description?: string
	): Promise<WalletTransaction> {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// Get wallet
			const walletResult = await client.query(
				"SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE",
				[userId]
			);

			if (!walletResult.rows[0]) {
				throw new Error("Wallet not found");
			}

			const wallet = walletResult.rows[0];

			// Update balance
			await client.query(
				`UPDATE wallets 
         SET balance = balance + $1, 
             last_updated = CURRENT_TIMESTAMP
         WHERE wallet_id = $2`,
				[amount, wallet.wallet_id]
			);

			// Create transaction record
			const transactionResult = await client.query(
				`INSERT INTO wallet_transactions (
          transaction_id, wallet_id, amount, type, purpose,
          status, reference_id, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
				[
					uuidv4(),
					wallet.wallet_id,
					amount,
					"credit",
					purpose,
					"completed",
					referenceId,
					description
				]
			);

			await client.query("COMMIT");
			return transactionResult.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async debit(
		userId: string,
		amount: number,
		purpose: string,
		paymentTo?: string,
		referenceId?: string,
		description?: string
	): Promise<WalletTransaction> {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// Get wallet
			const walletResult = await client.query(
				"SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE",
				[userId]
			);

			if (!walletResult.rows[0]) {
				throw new Error("Wallet not found");
			}

			const wallet = walletResult.rows[0];

			// Check sufficient balance
			if (wallet.balance < amount) {
				throw new Error("Insufficient balance");
			}

			// Update balance
			await client.query(
				`UPDATE wallets 
         SET balance = balance - $1, 
             last_updated = CURRENT_TIMESTAMP
         WHERE wallet_id = $2`,
				[amount, wallet.wallet_id]
			);

			// Create transaction record
			const transactionResult = await client.query(
				`INSERT INTO wallet_transactions (
          transaction_id, wallet_id, amount, type, purpose,
          payment_to, status, reference_id, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
				[
					uuidv4(),
					wallet.wallet_id,
					amount,
					"debit",
					purpose,
					paymentTo,
					"completed",
					referenceId,
					description
				]
			);

			await client.query("COMMIT");
			return transactionResult.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async getTransactions(
		userId: string,
		page: number = 1,
		limit: number = 20,
		type?: "credit" | "debit"
	): Promise<{ transactions: WalletTransaction[]; total: number }> {
		const wallet = await this.findByUserId(userId);
		if (!wallet) {
			return { transactions: [], total: 0 };
		}

		const offset = (page - 1) * limit;
		let query = "SELECT * FROM wallet_transactions WHERE wallet_id = $1";
		const params: any[] = [wallet.wallet_id];
		let paramCount = 2;

		if (type) {
			query += ` AND type = $${paramCount++}`;
			params.push(type);
		}

		const countQuery = query.replace("*", "COUNT(*) as total");
		query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
		params.push(limit, offset);

		const [countResult, transactionsResult] = await Promise.all([
			pool.query(countQuery, params.slice(0, -2)),
			pool.query(query, params)
		]);

		return {
			transactions: transactionsResult.rows,
			total: parseInt(countResult.rows[0].total)
		};
	}

	async getGatewayTransactions(
		userId: string,
		page: number = 1,
		limit: number = 20,
	): Promise<{ gatewayTransactions: GatewayTransaction[]; total: number }> {
		let query = `SELECT * FROM gateway_transactions WHERE user_id = $1`
		const countQuery = query.replace("*", "COUNT(*) as total");

		query += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`

		const [countResult, transactionsResult] = await Promise.all([
			pool.query(countQuery, [userId]),
			pool.query(query, [userId, limit, (page - 1) * limit])
		]);

		return {
			gatewayTransactions: transactionsResult.rows,
			total: parseInt(countResult.rows[0].total)
		};
	}

	async suspendWallet(userId: string, _reason: string): Promise<void> {
		await pool.query(
			`UPDATE wallets 
       SET status = 'suspended', 
           last_updated = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
			[userId]
		);
	}

	async activateWallet(userId: string): Promise<void> {
		await pool.query(
			`UPDATE wallets 
       SET status = 'active', 
           last_updated = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
			[userId]
		);
	}
}

export default new WalletModel();