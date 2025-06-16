import { Request, Response } from "express";
import pool from "../utils/database";
import { ApiResponse, PaginatedResponse } from "../utils/types";

interface DriversSummary {
  totalDrivers: number;
  onlineDrivers: number;
  verifiedDrivers: number;
  availableDrivers: number;
}

interface DriverDetail {
  driver_id: string;
  name: string;
  phone_number: string;
  photo_url: string;
  due_payments: number;
  location_address: string;
  completed_rides: number;
  vehicle_type: string;
  rating: number;
  is_online: boolean;
  is_available: boolean;
}

export const driversReportsController = {
  /**
   * Get drivers summary statistics
   * Returns:
   * - Total number of drivers
   * - Number of online drivers
   * - Number of verified drivers
   * - Number of available drivers
   */
  getDriversSummary: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get filter parameters
      const vehicleType = req.query.vehicleType as string;
      const isVerified = req.query.isVerified === 'true';
      const isOnline = req.query.isOnline === 'true';
      const isAvailable = req.query.isAvailable === 'true';

      // Build filter conditions and parameters
      const filterClauses: string[] = [];
      const queryParams: any[] = [];

      if (vehicleType) {
        filterClauses.push("d.vehicle_type = $" + (queryParams.length + 1));
        queryParams.push(vehicleType);
      }

      if (req.query.isVerified !== undefined) {
        filterClauses.push("d.verified = $" + (queryParams.length + 1));
        queryParams.push(isVerified);
      }

      if (req.query.isOnline !== undefined) {
        filterClauses.push("d.is_online = $" + (queryParams.length + 1));
        queryParams.push(isOnline);
      }

      if (req.query.isAvailable !== undefined) {
        filterClauses.push("d.is_available = $" + (queryParams.length + 1));
        queryParams.push(isAvailable);
      }

      const whereClause = filterClauses.length > 0 ? "WHERE " + filterClauses.join(" AND ") : "";

      // Get total counts
      const totalCountsQuery = `
        SELECT COUNT(d.driver_id)                                  AS total_drivers,
               COUNT(CASE WHEN d.is_online = true THEN 1 END)      AS online_drivers,
               COUNT(CASE WHEN d.verified = true THEN 1 END)       AS verified_drivers,
               COUNT(CASE WHEN d.is_available = true THEN 1 END)   AS available_drivers
        FROM drivers d
        ${whereClause}
      `;

      const totalCountsResult = await pool.query(totalCountsQuery, queryParams);

      if (!totalCountsResult.rows || totalCountsResult.rows.length === 0) {
        console.error("Drivers summary query returned no rows. This might indicate an issue with the query or an unexpected database state.");
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
          totalDrivers: parseInt(counts.total_drivers || '0'),
          onlineDrivers: parseInt(counts.online_drivers || '0'),
          verifiedDrivers: parseInt(counts.verified_drivers || '0'),
          availableDrivers: parseInt(counts.available_drivers || '0')
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
   * - Driver ID
   * - Name
   * - Phone number
   * - Photo URL
   * - Due payments
   * - Current location
   * - Number of completed rides
   * - Vehicle type
   * - Rating
   * - Online status
   * - Availability status
   */
  getDriversDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get pagination parameters with defaults
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Get filter parameters
      const vehicleType = req.query.vehicleType as string;
      const isVerified = req.query.isVerified === 'true';
      const isOnline = req.query.isOnline === 'true';
      const isAvailable = req.query.isAvailable === 'true';
      const minRating = parseFloat(req.query.minRating as string);

      // Build filter conditions and parameters
      const filterClauses: string[] = [];
      const queryParams: any[] = [];

      if (vehicleType) {
        filterClauses.push("d.vehicle_type = $" + (queryParams.length + 1));
        queryParams.push(vehicleType);
      }

      // Only apply these filters if they are explicitly provided in the request
      if (req.query.isVerified !== undefined) {
        filterClauses.push("d.verified = $" + (queryParams.length + 1));
        queryParams.push(isVerified);
      }

      if (req.query.isOnline !== undefined) {
        filterClauses.push("d.is_online = $" + (queryParams.length + 1));
        queryParams.push(isOnline);
      }

      if (req.query.isAvailable !== undefined) {
        filterClauses.push("d.is_available = $" + (queryParams.length + 1));
        queryParams.push(isAvailable);
      }

      if (!isNaN(minRating)) {
        filterClauses.push("d.rating >= $" + (queryParams.length + 1));
        queryParams.push(minRating);
      }

      const whereClause = filterClauses.length ? `WHERE ${filterClauses.join(" AND ")}` : "";

      // get total count for pagination
      const countQuery = `SELECT COUNT(*) AS total FROM drivers d ${whereClause}`;
      const countResult = await pool.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      // Fetch paginated rows with field names matching DriverDetail
      const driversQuery = `
        SELECT d.driver_id,
               u.name,
               pn.phone_number,
               u.photo_url,
               COALESCE((
                   SELECT SUM(rt.driver_fee - rt.platform_fee)
                   FROM ride_transactions rt
                   JOIN ride_requests rr ON rt.request_id = rr.request_id
                   WHERE rr.driver_id = d.driver_id AND rr.ride_status = 'completed'
                       AND rt.payment_status = 'due'
               ), 0) AS due_payments,
               l.address AS location_address,
               (
                   SELECT COUNT(*)
                   FROM ride_requests rr
                   WHERE rr.driver_id = d.driver_id AND rr.ride_status = 'completed'
               ) AS completed_rides,
               d.vehicle_type,
               d.rating,
               d.is_online,
               d.is_available
        FROM drivers d
        JOIN users u ON d.driver_id = u.user_id
        LEFT JOIN phone_numbers pn ON u.user_id = pn.user_id AND pn.is_primary = true
        LEFT JOIN locations l ON d.current_location_id = l.location_id
        ${whereClause}
        ORDER BY d.is_online DESC, d.is_available DESC, d.rating DESC
        LIMIT $${queryParams.length + 1}
        OFFSET $${queryParams.length + 2}
      `;

      const rowsResult = await pool.query(driversQuery, [...queryParams, limit, offset]);

      const response: ApiResponse<PaginatedResponse<DriverDetail>> = {
        success: true,
        data: {
          items: rowsResult.rows,
          pagination: { page, limit, total, totalPages }
        }
      };
      res.status(200).json(response);
    } catch (error) {
      console.error("Error getting drivers details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch drivers details",
        error: error instanceof Error ? error.message : error
      });
    }
  }
};
