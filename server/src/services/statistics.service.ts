import { UserType } from "../utils/types";
import fareCalculationService from "./fareCalculation.service";
import { format, subDays, startOfMonth, endOfMonth, parseISO, isValid } from "date-fns";
// db connection
import pool from "../utils/database";

interface UserStats {
	totalUsers: number;
	totalDrivers: number;
	totalRiders: number;
}

interface RevenueData {
	amount: number;
	currency: string;
	date: string;
}

interface RevenueStats {
	totalRevenue: number;
	currency: string;
	revenueByPeriod: RevenueData[];
}

interface ComplaintsStats {
	totalComplaints: number;
}

interface FinancialSettlementsStats {
	totalSettledAmount: number;
	currency: string;
	numberOfSettlements: number;
}

interface RequestsStats {
	totalRequests: number;
	completedRequests: number;
	cancelledRequests: number;
	pendingRequests: number;
}

type DateRangeType = "daily" | "monthly" | "custom";

class StatisticsService {
	/**
	 * Get user statistics: total number of users, drivers, and riders
	 */
	async getUserStats(): Promise<UserStats> {
		try {
			// Count total users by type
			const usersQuery = `
                SELECT COUNT(*)                                        as total_users,
                       SUM(CASE WHEN user_type = $1 THEN 1 ELSE 0 END) as total_drivers,
                       SUM(CASE WHEN user_type = $2 THEN 1 ELSE 0 END) as total_riders
                FROM users
                WHERE user_type IN ($1, $2)
            `;

			const result = await pool.query(usersQuery, [UserType.DRIVER, UserType.RIDER]);
			const stats = result.rows[0];

			return {
				totalUsers: parseInt(stats.total_users) || 0,
				totalDrivers: parseInt(stats.total_drivers) || 0,
				totalRiders: parseInt(stats.total_riders) || 0
			};
		} catch (error) {
			console.error("Error fetching user statistics:", error);
			throw new Error("Failed to fetch user statistics");
		}
	}

	/**
	 * Get revenue statistics for a specific date range
	 * @param rangeType The type of date range to get revenue data for
	 * @param startDate Optional start date for custom range (ISO format)
	 * @param endDate Optional end date for custom range (ISO format)
	 */
	async getRevenueStats(
		rangeType: DateRangeType = "daily",
		startDate?: string,
		endDate?: string
	): Promise<RevenueStats> {
		try {
			let query = "";
			const today = new Date();
			let start: Date;
			let end: Date = today;

			// Determine date range based on the range type
			switch (rangeType) {
				case "daily":
					// Last 7 days
					start = subDays(today, 6); // Include today, so 6 days back
					query = `
                        SELECT SUM(platform_fee + tax_amount) as revenue,
                               TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date
                        FROM ride_transactions
                        WHERE created_at >= $1
                          AND created_at <= $2
                        GROUP BY DATE (created_at)
                        ORDER BY date ASC
                    `;
					break;

				case "monthly":
					// Current month data by day
					start = startOfMonth(today);
					end = endOfMonth(today);
					query = `
                        SELECT SUM(platform_fee + tax_amount) as revenue,
                               TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date
                        FROM ride_transactions
                        WHERE created_at >= $1
                          AND created_at <= $2
                        GROUP BY DATE (created_at)
                        ORDER BY date ASC
                    `;
					break;

				case "custom": {
					if (!startDate || !endDate) {
						throw new Error("Start date and end date are required for custom range");
					}

					start = parseISO(startDate);
					end = parseISO(endDate);

					// Validate parsed dates
					if (!isValid(start)) {
						throw new Error(
							"Invalid startDate format. Please use ISO 8601 format (e.g., YYYY-MM-DD)."
						);
					}
					if (!isValid(end)) {
						throw new Error(
							"Invalid endDate format. Please use ISO 8601 format (e.g., YYYY-MM-DD)."
						);
					}
					if (start > end) {
						throw new Error("startDate cannot be after endDate");
					}

					const dayDiff = Math.ceil(
						(end.getTime() - start.getTime()) / (1000 * 3600 * 24)
					);
					if (dayDiff > 31) {
						query = `
                            SELECT SUM(platform_fee + tax_amount) as revenue,
                                   TO_CHAR(DATE(created_at), 'YYYY-MM') as date
                            FROM ride_transactions
                            WHERE created_at >= $1
                              AND created_at <= $2
                            GROUP BY TO_CHAR(DATE (created_at), 'YYYY-MM')
                            ORDER BY date ASC
                        `;
					} else {
						query = `
                            SELECT SUM(platform_fee + tax_amount) as revenue,
                                   TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date
                            FROM ride_transactions
                            WHERE created_at >= $1
                              AND created_at <= $2
                            GROUP BY DATE (created_at)
                            ORDER BY date ASC
                        `;
					}
					break;
				}
			}

			const result = await pool.query(query, [
				format(start, "yyyy-MM-dd"),
				format(end, "yyyy-MM-dd") + " 23:59:59"
			]);
			const rows = result.rows;

			const revenueByPeriod = rows.map((row) => ({
				amount: parseFloat(row.revenue) || 0,
				currency: fareCalculationService.getCurrency(),
				date: row.date
			}));

			const totalRevenue = revenueByPeriod.reduce((sum, data) => sum + data.amount, 0);

			return {
				totalRevenue,
				currency: fareCalculationService.getCurrency(),
				revenueByPeriod
			};
		} catch (error) {
			console.error("Error fetching revenue statistics:", error);
			throw new Error("Failed to fetch revenue statistics");
		}
	}

	/**
	 * Get complaints statistics
	 */
	async getComplaintsStats(): Promise<ComplaintsStats> {
		try {
			const query = `SELECT COUNT(*) as total_complaints
                           FROM reports
                           WHERE type = 'complaint';`;
			const result = await pool.query(query);
			return {
				totalComplaints: parseInt(result.rows[0].total_complaints) || 0
			};
		} catch (error) {
			console.error("Error fetching complaints statistics:", error);
			throw new Error("Failed to fetch complaints statistics");
		}
	}

	/**
	 * Get financial settlements statistics
	 */
	async getFinancialSettlementsStats(): Promise<FinancialSettlementsStats> {
		try {
			const query = `
                SELECT SUM(amount) as total_settled_amount,
                       COUNT(*)    as number_of_settlements
                FROM wallet_transactions
                WHERE type = 'settlement';
            `;
			const result = await pool.query(query);
			const stats = result.rows[0];
			return {
				totalSettledAmount: parseFloat(stats.total_settled_amount) || 0,
				currency: fareCalculationService.getCurrency(),
				numberOfSettlements: parseInt(stats.number_of_settlements) || 0
			};
		} catch (error) {
			console.error("Error fetching financial settlements statistics:", error);
			throw new Error("Failed to fetch financial settlements statistics");
		}
	}

	/**
	 * Get requests statistics (e.g., ride requests)
	 */
	async getRequestsStats(): Promise<RequestsStats> {
		try {
			const query = `
                SELECT COUNT(*)                                              as total_requests,
                       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_requests,
                       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_requests,
                       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)   as pending_requests
                FROM ride_requests;
            `;
			const result = await pool.query(query);
			const stats = result.rows[0];
			return {
				totalRequests: parseInt(stats.total_requests) || 0,
				completedRequests: parseInt(stats.completed_requests) || 0,
				cancelledRequests: parseInt(stats.cancelled_requests) || 0,
				pendingRequests: parseInt(stats.pending_requests) || 0
			};
		} catch (error) {
			console.error("Error fetching requests statistics:", error);
			throw new Error("Failed to fetch requests statistics");
		}
	}
}

export default new StatisticsService();
