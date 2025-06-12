import { Request, Response } from "express";
import statisticsService from "../services/statistics.service";

class StatisticsController {
	/**
	 * Get user statistics
	 */
	async getUserStats(_req: Request, res: Response) {
		// Changed req to _req
		try {
			const userStats = await statisticsService.getUserStats();
			return res.status(200).json({
				success: true,
				data: userStats
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve user statistics",
				error: (error as Error).message // Typed error
			});
		}
	}

	/**
	 * Get revenue statistics
	 */
	async getRevenueStats(req: Request, res: Response) {
		try {
			const { range = "daily", startDate, endDate } = req.query;

			// Validate range type
			if (!["daily", "monthly", "custom"].includes(range as string)) {
				return res.status(400).json({
					success: false,
					message: "Invalid range type. Must be one of: daily, monthly, custom"
				});
			}

			// For custom range, ensure startDate and endDate are provided
			if (range === "custom") {
				if (!startDate || !endDate) {
					return res.status(400).json({
						success: false,
						message: "For custom range, both startDate and endDate are required"
					});
				}
			}
			const revenueStats = await statisticsService.getRevenueStats(
				range as "daily" | "monthly" | "custom",
				startDate as string,
				endDate as string
			);

			return res.status(200).json({
				success: true,
				data: revenueStats
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve revenue statistics",
				error: (error as Error).message // Typed error
			});
		}
	}

	/**
	 * Get complaints statistics
	 */
	async getComplaintsStats(_req: Request, res: Response) {
		// Changed req to _req
		try {
			// TODO: Add validation for query parameters if any, similar to getRevenueStats

			const complaintsStats = await statisticsService.getComplaintsStats();
			return res.status(200).json({
				success: true,
				data: complaintsStats
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve complaints statistics",
				error: (error as Error).message // Typed error
			});
		}
	}

	/**
	 * Get financial settlements statistics
	 */
	async getFinancialSettlementsStats(_req: Request, res: Response) {
		// Changed req to _req
		try {
			// TODO: Add validation for query parameters if any

			const financialSettlementsStats =
				await statisticsService.getFinancialSettlementsStats();
			return res.status(200).json({
				success: true,
				data: financialSettlementsStats
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve financial settlements statistics",
				error: (error as Error).message // Typed error
			});
		}
	}

	/**
	 * Get requests statistics
	 */
	async getRequestsStats(_req: Request, res: Response) {
		// Changed req to _req
		try {
			// TODO: Add validation for query parameters if any

			const requestsStats = await statisticsService.getRequestsStats();
			return res.status(200).json({
				success: true,
				data: requestsStats
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve requests statistics",
				error: (error as Error).message // Typed error
			});
		}
	}
}

export default new StatisticsController();
