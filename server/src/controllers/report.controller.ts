import { Request, Response, NextFunction } from "express";
import { ReportModel, ReportStatus } from "../models/report.model";
import { ApiResponse, UserType } from "../utils/types";

const reportModel = new ReportModel();

class ReportController {
	/**
	 * Get all reports/complaints
	 * @route GET /api/reports
	 */
	async getAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// Add optional filtering by status if provided in query params
			const { status } = req.query;
			const validStatuses = Object.values(ReportStatus);

			let reports;
			if (status && validStatuses.includes(status as ReportStatus)) {
				reports = await reportModel.getByStatus(status as ReportStatus);
			} else {
				reports = await reportModel.getAll();
			}

			const response: ApiResponse = {
				success: true,
				data: reports,
				message: "Reports retrieved successfully"
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get all pending reports
	 * @route GET /api/reports/pending
	 */
	async getPendingReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const reports = await reportModel.getByStatus(ReportStatus.PENDING);

			const response: ApiResponse = {
				success: true,
				data: reports,
				message: "Pending reports retrieved successfully"
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get all resolved reports
	 * @route GET /api/reports/resolved
	 */
	async getResolvedReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const reports = await reportModel.getByStatus(ReportStatus.RESOLVED);

			const response: ApiResponse = {
				success: true,
				data: reports,
				message: "Resolved reports retrieved successfully"
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get all dismissed reports
	 * @route GET /api/reports/dismissed
	 */
	async getDismissedReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const reports = await reportModel.getByStatus(ReportStatus.DISMISSED);

			const response: ApiResponse = {
				success: true,
				data: reports,
				message: "Dismissed reports retrieved successfully"
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get a specific report by ID
	 * @route GET /api/reports/:id
	 */
	async getReportById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const report = await reportModel.getById(id);

			const response: ApiResponse = {
				success: true,
				data: report,
				message: "Report retrieved successfully"
			};

			res.status(200).json(response);
		} catch (error) {
			const errorMsg = (error as Error).message;
			// Check if the error message indicates a "not found" scenario
			const isNotFound = errorMsg.toLowerCase().includes("not found");
			const statusCode = isNotFound ? 404 : 500;
			const errorCode = isNotFound ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR";

			const response: ApiResponse = {
				success: false,
				data: null,
				message: `Error retrieving report: ${errorMsg}`,
				error: {
					code: errorCode,
					message: errorMsg
				}
			};

			res.status(statusCode).json(response);
		}
	}

	/**
	 * Update report status (admin only)
	 * @route PUT /api/reports/:id/status
	 */
	async updateReportStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// Check if user is admin
			if (req.user && req.user.user_type !== UserType.ADMIN) {
				const response: ApiResponse = {
					success: false,
					data: null,
					message: "Unauthorized: Only admins can update report status",
					error: {
						code: "UNAUTHORIZED",
						message: "You don't have permission to perform this action"
					}
				};
				res.status(403).json(response);
				return;
			}

			const { id } = req.params;
			const { status, resolutionNotes } = req.body;
			const validStatuses = Object.values(ReportStatus);

			// Validate status
			if (!status || !validStatuses.includes(status as ReportStatus)) {
				const response: ApiResponse = {
					success: false,
					data: null,
					message: "Invalid status value",
					error: {
						code: "INVALID_INPUT",
						message: `Status must be one of: ${validStatuses.join(", ")}`
					}
				};
				res.status(400).json(response);
				return;
			}

			// Try to update the report status
			try {
				const updatedReport = await reportModel.updateStatus(
					id,
					status as ReportStatus,
					resolutionNotes || null,
					req.user!.user_id
				);

				const response: ApiResponse = {
					success: true,
					data: updatedReport,
					message: `Report status updated to ${status} successfully`
				};

				res.status(200).json(response);
			} catch (error) {
				const errorMsg = (error as Error).message;
				const statusCode = errorMsg.includes("not found") ? 404 : 500;

				const response: ApiResponse = {
					success: false,
					data: null,
					message: `Error updating report: ${errorMsg}`,
					error: {
						code: errorMsg.includes("not found") ? "NOT_FOUND" : "UPDATE_FAILED",
						message: errorMsg
					}
				};

				res.status(statusCode).json(response);
			}
		} catch (error) {
			next(error);
		}
	}
}

export default new ReportController();
