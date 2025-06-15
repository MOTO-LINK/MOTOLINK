import { Request, Response } from "express";
import pool from "../utils/database";
import { ApiResponse, PaginatedResponse } from "../utils/types";

// Define allowed ride statuses as a constant
const ALLOWED_RIDE_STATUS = [
    "pending",
    "accepted",
    "in_progress",
    "arrived",
    "completed",
    "cancelled"
];

interface RideRequestSummary {
    totalRiders: number;
    totalRideRequests: number;
    completedRideRequests: number;
    canceledRideRequests: number;
}

interface RideRequestDetail {
    request_id: string;
    rider_id: string;
    rider_name: string;
    ride_status: string;
    ride_cost: number;
    start_place: string;
    end_place: string;
}

export const ridesReportsController = {
    /**
     * Get ride request summary statistics
     * Returns:
     * - Total number of riders
     * - Total number of ride requests
     * - Total number of completed ride requests
     * - Total number of canceled ride requests
     */
	getRidesSummary: async (req: Request, res: Response): Promise<void> => {
        try {
            // Get filter parameters
            const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const ride_status = req.query.ride_status as string;
            const driverId = req.query.driverId as string;
            const riderId = req.query.riderId as string;

            // Calculate date range for filtering
            const startDate = new Date(year, month - 1, 1); // First day of specified month
            const endDate = new Date(year, month, 0); // Last day of specified month
            endDate.setHours(23, 59, 59, 999); // End of day on the last day

            // Validate ride_status if provided
            if (ride_status && !ALLOWED_RIDE_STATUS.includes(ride_status)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ride status",
                    error: { code: "INVALID_STATUS", message: `Status must be one of: ${ALLOWED_RIDE_STATUS.join(", ")}` }
                });
                return;
            }

            // Build filter conditions and parameters more robustly
            const dateFilter = "rr.request_time >= $1 AND rr.request_time <= $2";
            const filterClauses: string[] = [dateFilter];
            const queryParams: (string | number | Date)[] = [startDate, endDate];

            if (ride_status) {
                filterClauses.push("rr.ride_status = $" + (queryParams.length + 1));
                queryParams.push(ride_status);
            }
            if (driverId) {
                filterClauses.push("rr.driver_id = $" + (queryParams.length + 1));
                queryParams.push(driverId);
            }
            if (riderId) {
                filterClauses.push("rr.rider_id = $" + (queryParams.length + 1));
                queryParams.push(riderId);
            }

            const whereClause = filterClauses.length > 0 ? "WHERE " + filterClauses.join(" AND ") : "";

            // Get total counts
            const totalCountsQuery = `
                SELECT COUNT(DISTINCT rr.rider_id)                         AS total_riders,
                       COUNT(rr.request_id)                                AS total_ride_requests,
                       COUNT(CASE WHEN rr.ride_status = 'completed' THEN 1 END) AS completed_ride_requests,
                       COUNT(CASE WHEN rr.ride_status = 'cancelled' THEN 1 END) AS canceled_ride_requests
                FROM ride_requests rr
                ${whereClause}
            `;

            const totalCountsResult = await pool.query(totalCountsQuery, queryParams);
            const counts = totalCountsResult.rows[0];

            // Prepare the response
            const response: ApiResponse<RideRequestSummary> = {
                success: true,
                data: {
                    totalRiders: parseInt(counts.total_riders),
                    totalRideRequests: parseInt(counts.total_ride_requests),
                    completedRideRequests: parseInt(counts.completed_ride_requests),
                    canceledRideRequests: parseInt(counts.canceled_ride_requests)
                }
            };

            res.status(200).json(response);

        } catch (error) {
            console.error("Error getting ride requests summary:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get ride requests summary",
                error: {
                    code: "SERVER_ERROR",
                    message: (error as Error).message
                }
            });
        }
    },

    /**
     * Get latest ride requests with details
     * Returns paginated list of ride requests with:
     * - Request ID
     * - Rider ID and name
     * - Ride status
     * - Ride cost
     * - Start and end places
     */
	getLatestRides: async (req: Request, res: Response): Promise<void> => {
        try {
            // Get pagination parameters with defaults
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            // Get filter parameters
            const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const ride_status = req.query.ride_status as string;
            const driverId = req.query.driverId as string;
            const riderId = req.query.riderId as string;

            // Calculate date range for filtering - full month
            const startDate = new Date(year, month - 1, 1); // First day of specified month
            const endDate = new Date(year, month, 0); // Last day of specified month
            endDate.setHours(23, 59, 59, 999); // End of day on the last day

            // Override with specific dates if provided
            if (req.query.startDate && req.query.endDate) {
                const customStartDate = new Date(req.query.startDate as string);
                const customEndDate = new Date(req.query.endDate as string);
                if (!isNaN(customStartDate.getTime()) && !isNaN(customEndDate.getTime())) {
                    customEndDate.setHours(23, 59, 59, 999); // End of day
                    startDate.setTime(customStartDate.getTime());
                    endDate.setTime(customEndDate.getTime());
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Invalid date format for startDate or endDate. Use ISO format."
                    });
                    return;
                }
            }

            // Validate ride_status if provided
            if (ride_status && !ALLOWED_RIDE_STATUS.includes(ride_status)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ride status",
                    error: {
                        code: "INVALID_STATUS",
                        message: `Status must be one of: ${ALLOWED_RIDE_STATUS.join(", ")}`
                    }
                });
                return;
            }

            // Build filter conditions and parameters
            const dateFilter = "rr.request_time >= $1 AND rr.request_time <= $2";
            const filterClauses: string[] = [dateFilter];
            const queryParams: (string | number | Date)[] = [startDate, endDate];

            if (ride_status) {
                filterClauses.push("rr.ride_status = $" + (queryParams.length + 1));
                queryParams.push(ride_status);
            }
            if (driverId) {
                filterClauses.push("rr.driver_id = $" + (queryParams.length + 1));
                queryParams.push(driverId);
            }
            if (riderId) {
                filterClauses.push("rr.rider_id = $" + (queryParams.length + 1));
                queryParams.push(riderId);
            }

            const whereClause = filterClauses.length ? `WHERE ${filterClauses.join(" AND ")}` : "";

            // get total count for pagination
            const countQuery = `SELECT COUNT(*) AS total FROM ride_requests rr ${whereClause}`;
            const countResult = await pool.query(countQuery, queryParams);
            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);

            // fetch paginated rows with field names matching RideRequestDetail
            const ordersQuery = `
                SELECT rr.request_id,
                       rr.rider_id,
                       u.name        AS rider_name,
                       rr.ride_status,
                       rt.total_fee  AS ride_cost,
                       sl.address    AS start_place,
                       el.address    AS end_place
                FROM ride_requests rr
                 LEFT JOIN ride_transactions rt ON rr.request_id = rt.request_id
                 LEFT JOIN riders r ON rr.rider_id = r.rider_id
                 LEFT JOIN users u ON r.rider_id = u.user_id
                 LEFT JOIN locations sl ON rr.start_location_id = sl.location_id
                 LEFT JOIN locations el ON rr.end_location_id = el.location_id
                ${whereClause}
                ORDER BY rr.updated_at DESC
                LIMIT $${queryParams.length + 1}
                OFFSET $${queryParams.length + 2}
            `;
            const rowsResult = await pool.query(ordersQuery, [...queryParams, limit, offset]);

            const response: ApiResponse<PaginatedResponse<RideRequestDetail>> = {
                success: true,
                data: {
                    items: rowsResult.rows,
                    pagination: { page, limit, total, totalPages }
                }
            };
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch latest rides",
                error: error instanceof Error ? error.message : error
            });
        }
    }
};
