import { Request, Response } from "express";
import statisticsService from "../services/dashboard.service";

class DashboardController {
	/**
	 * Get complaints count for dashboard
	 */
	async getDashboardComplaints(_req: Request, res: Response) {
		try {
			const complaintsCount = await statisticsService.getDashboardComplaints();
			return res
				.status(200)
				.json({
					success: true,
					data: complaintsCount,
					message: "Complaints count retrieved successfully"
				});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve complaints count",
				error: (error as Error).message
			});
		}
	}

	/**
	 * Get financial settlements count for dashboard
	 */
	async getDashboardSettlements(_req: Request, res: Response) {
		try {
			const settlementsCount = await statisticsService.getDashboardSettlements();
			return res
				.status(200)
				.json({
					success: true,
					data: settlementsCount,
					message: "Settlements count retrieved successfully"
				});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve settlement requests count",
				error: (error as Error).message
			});
		}
	}

	/**
	 * Get orders count for dashboard
	 */
	async getDashboardOrders(_req: Request, res: Response) {
		try {
			const ordersCount = await statisticsService.getDashboardOrders();
			return res.status(200).json({
				success: true,
				data: ordersCount,
				message: "Orders count retrieved successfully"
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve orders count",
				error: (error as Error).message
			});
		}
	}

	/**
	 * Get clients count for dashboard
	 */
	async getDashboardClients(_req: Request, res: Response) {
		try {
			const clientsCount = await statisticsService.getDashboardClients();
			return res.status(200).json({
				success: true,
				data: clientsCount,
				message: "Clients count retrieved successfully"
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve clients count",
				error: (error as Error).message
			});
		}
	}

	/**
	 * Get representatives count for dashboard
	 */
	async getDashboardRepresentatives(_req: Request, res: Response) {
		try {
			const representativesCount = await statisticsService.getDashboardRepresentatives();
			return res.status(200).json({
				success: true,
				data: representativesCount,
				message: "Representatives count retrieved successfully"
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve representatives count",
				error: (error as Error).message
			});
		}
	}
}

export default new DashboardController();
