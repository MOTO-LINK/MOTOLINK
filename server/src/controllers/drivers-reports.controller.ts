import { Request, Response } from "express";
import pool from "../utils/database";
import { ApiResponse, PaginatedResponse } from "../utils/types";

interface DriversSummary {
  totalDrivers: number;
}

interface DriverDetail {
  name: string;
  phone_number: string;
  photo_url: string;
  due_payments: number;
  location_address: string;
  completed_rides: number;
}

export const driversReportsController = {
  /**
   * Get drivers summary statistics
   * Returns:
   * - Total number of drivers
   */
  getDriversSummary: async (_req: Request, res: Response): Promise<void> => {
    try {
      // Get total counts
      const totalCountsQuery = `
				SELECT COUNT(d.driver_id) AS total_drivers
				FROM drivers d
			`;

      const totalCountsResult = await pool.query(totalCountsQuery);

      if (!totalCountsResult.rows || totalCountsResult.rows.length === 0) {
        console.error(
            "Drivers summary query returned no rows. This might indicate an issue with the query or an unexpected database state."
        );
        res.status(500).json({
          success: false,
          message: "Failed to retrieve driver summary: No data returned from query."
        });
        return;
      }

      const counts = totalCountsResult.rows[0];

      // Prepare the response
      const response: ApiResponse<DriversSummary> = {
        success: true,
        data: {
          totalDrivers: parseInt(counts.total_drivers || "0")
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error getting drivers summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get drivers summary",
        error: {
          code: "SERVER_ERROR",
          message: (error as Error).message
        }
      });
    }
  },

  /**
   * Get drivers with detailed information
   * Returns paginated list of drivers with:
   * - Name
   * - Phone number
   * - Photo URL
   * - Due payments
   * - Current location
   * - Number of completed rides
   */
  getDriversDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get pagination parameters with defaults
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Get month and year from the request
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
      const year = parseInt(req.query.year as string) || new Date().getFullYear();

      // Initialize query parameters array with month and year
      const queryParams: (string | number)[] = [month, year];

      const countQuery = `SELECT COUNT(*) AS total
								FROM drivers d`;
      const countResult = await pool.query(countQuery);
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      // Fetch paginated rows with field names matching DriverDetail
      const driversQuery = `
				SELECT d.driver_id,
					   u.name,
					   pn.phone_number,
					   u.photo_url,
					   COALESCE((SELECT SUM(rt.driver_fee)
								 FROM ride_transactions rt
										  JOIN ride_requests rr ON rt.request_id = rr.request_id
								 WHERE rr.driver_id = d.driver_id
								   AND rr.ride_status = 'completed'
								   AND EXTRACT(MONTH FROM rt.created_at) = $${queryParams.length + 1}
								   AND EXTRACT(YEAR FROM rt.created_at) = $${queryParams.length + 2}),
								0)                                                           AS due_payments,
					   l.address                                                             AS location_address,
					   (SELECT COUNT(*)
						FROM ride_requests rr
						WHERE rr.driver_id = d.driver_id
						  AND rr.ride_status = 'completed'
						  AND EXTRACT(MONTH FROM rr.created_at) = $${queryParams.length + 1}
						  AND EXTRACT(YEAR FROM rr.created_at) = $${queryParams.length + 2}) AS completed_rides
				FROM drivers d
						 JOIN users u ON d.driver_id = u.user_id
						 LEFT JOIN phone_numbers pn ON u.user_id = pn.user_id AND pn.is_primary = true
						 LEFT JOIN locations l ON d.current_location_id = l.location_id
				ORDER BY due_payments DESC LIMIT $${queryParams.length + 3}
				OFFSET $${queryParams.length + 4}
			`;

      const rowsResult = await pool.query(driversQuery, [...queryParams, limit, offset]);

      // Map results to match DriverDetail interface
      const driverDetails: DriverDetail[] = rowsResult.rows.map(
          (row: {
            name: string;
            phone_number: string | null; // Can be null from LEFT JOIN
            photo_url: string | null;
            due_payments: string | number;
            location_address: string | null;
            completed_rides: string | number;
          }) => ({
            name: row.name,
            phone_number: row.phone_number || "", // Provide fallback
            photo_url: row.photo_url || "",
            due_payments: parseFloat(String(row.due_payments)),
            location_address: row.location_address || "",
            completed_rides: parseInt(String(row.completed_rides))
          })
      );

      const response: ApiResponse<PaginatedResponse<DriverDetail>> = {
        success: true,
        data: {
          items: driverDetails,
          pagination: { page, limit, total, totalPages }
        }
      };
      res.status(200).json(response);
    } catch (error) {
      console.error("Error getting drivers details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch drivers details",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
};