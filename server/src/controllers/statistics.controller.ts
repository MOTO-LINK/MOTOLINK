import { Request, Response } from "express";
import statisticsService from "../services/statistics.service";
import { parseISO, isValid } from "date-fns/fp"; // Import isValid and parseISO

class StatisticsController {
	/**
	 * Get user statistics
	 */
	async getUserStats(_req: Request, res: Response) {
		try {
			const userStats = await statisticsService.getUserStats();
			res.status(200).json({
				success: true,
				data: userStats
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve user statistics",
				error: error.message
			});
			return; 
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
				res.status(400).json({
					success: false,
					message: "Invalid range type. Must be one of: daily, monthly, custom"
				});
				return; 
			}

			// For custom range, validate dates
			if (range === "custom") {
				if (!startDate || !endDate) {
					res.status(400).json({
						success: false,
						message: "For custom range, both startDate and endDate are required"
					});
					return; 
				}

				const parsedStartDate = parseISO(startDate as string);
				const parsedEndDate = parseISO(endDate as string);

				if (!isValid(parsedStartDate)) {
					res.status(400).json({
						success: false,
						message:
							"Invalid startDate format. Please use ISO 8601 format (e.g., YYYY-MM-DD)."
					});
					return; 
				}

				if (!isValid(parsedEndDate)) {
					res.status(400).json({
						success: false,
						message:
							"Invalid endDate format. Please use ISO 8601 format (e.g., YYYY-MM-DD)."
					});
					return; 
				}

				if (parsedStartDate > parsedEndDate) {
					res.status(400).json({
						success: false,
						message: "startDate cannot be after endDate"
					});
					return; 
				}
			}
			const revenueStats = await statisticsService.getRevenueStats(
				range as "daily" | "monthly" | "custom",
				startDate as string,
				endDate as string
			);

			res.status(200).json({
				success: true,
				data: revenueStats
			});
			
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve revenue statistics",
				error: error.message
			});
		}
	}
}

export default new StatisticsController();
