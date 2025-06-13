import { UserType } from "../utils/types";
// db connection
import pool from "../utils/database";

interface DashboardCountStats {
	count: number;
}

class DashboardService {
	/**
	 * Get dashboard complaint count (for application reports)
	 */
	async getDashboardComplaints(): Promise<DashboardCountStats> {
		try {
			const query = `SELECT COUNT(*) as total
                           FROM reports;`;
			const result = await pool.query(query);
			return {
				count: parseInt(result.rows[0].total) || 0
			};
		} catch (error) {
			console.error("Error fetching dashboard complaints count:", error);
			throw new Error("Failed to fetch dashboard complaints count");
		}
	}

	/**
	 * Get dashboard financial settlement requests count (withdrawals and refunds)
	 */
	async getDashboardSettlements(): Promise<DashboardCountStats> {
		try {
			const query = `
                SELECT COUNT(*) as total
                FROM wallet_transactions
                WHERE purpose IN ('withdrawal', 'refund');
            `;
			const result = await pool.query(query);
			return {
				count: parseInt(result.rows[0].total) || 0
			};
		} catch (error) {
			console.error("Error fetching dashboard settlements count:", error);
			throw new Error("Failed to fetch dashboard settlements count");
		}
	}

	/**
	 * Get dashboard orders count
	 */
	async getDashboardOrders(): Promise<DashboardCountStats> {
		try {
			const query = `SELECT COUNT(*) as total FROM ride_requests;`;
			const result = await pool.query(query);
			return {
				count: parseInt(result.rows[0].total) || 0
			};
		} catch (error) {
			console.error("Error fetching dashboard orders count:", error);
			throw new Error("Failed to fetch dashboard orders count");
		}
	}

	/**
	 * Get dashboard riders count (clients)
	 */
	async getDashboardClients(): Promise<DashboardCountStats> {
		try {
			const query = `
                SELECT COUNT(*) as total
                FROM users
                WHERE user_type = $1
            `;
			const result = await pool.query(query, [UserType.RIDER]);
			return {
				count: parseInt(result.rows[0].total) || 0
			};
		} catch (error) {
			console.error("Error fetching dashboard riders count:", error);
			throw new Error("Failed to fetch dashboard riders count");
		}
	}

	/**
	 * Get dashboard drivers count (representatives)
	 */
	async getDashboardRepresentatives(): Promise<DashboardCountStats> {
		try {
			const query = `
                SELECT COUNT(*) as total
                FROM users
                WHERE user_type = $1
            `;
			const result = await pool.query(query, [UserType.DRIVER]);
			return {
				count: parseInt(result.rows[0].total) || 0
			};
		} catch (error) {
			console.error("Error fetching dashboard drivers count:", error);
			throw new Error("Failed to fetch dashboard drivers count");
		}
	}
}

export default new DashboardService();


