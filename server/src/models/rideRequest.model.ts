import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";
import { VehicleType } from "../utils/types";

export interface RideRequest {
	request_id: string;
	rider_id: string;
	driver_id?: string;
	start_location_id: string;
	end_location_id: string;
	ride_type: VehicleType;
	service_type: "delivery" | "transportation";
	scheduled_time?: Date;
	package_details?: any;
	distance?: number;
	estimated_fee?: number;
	request_time: Date;
	payment_type: "cash" | "wallet";
	status: "pending" | "accepted" | "arrived" | "in_progress" | "completed" | "cancelled";
	cancel_reason?: string;
	notes?: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface CreateRideRequestInput {
	rider_id: string;
	start_location_id: string;
	end_location_id: string;
	ride_type: VehicleType;
	service_type: "delivery" | "transportation";
	scheduled_time?: Date;
	package_details?: any;
	distance: number;
	estimated_fee: number;
	payment_type: "cash" | "wallet";
	notes?: string;
}

export class RideRequestModel {
	async create(requestData: CreateRideRequestInput): Promise<RideRequest> {
		const result = await pool.query(
			`INSERT INTO ride_requests (
        request_id, rider_id, start_location_id, end_location_id,
        ride_type, service_type, scheduled_time, package_details,
        distance, estimated_fee, request_time, payment_type,
        status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
			[
				uuidv4(),
				requestData.rider_id,
				requestData.start_location_id,
				requestData.end_location_id,
				requestData.ride_type,
				requestData.service_type,
				requestData.scheduled_time || null,
				requestData.package_details ? JSON.stringify(requestData.package_details) : null,
				requestData.distance,
				requestData.estimated_fee,
				new Date(),
				requestData.payment_type,
				"pending",
				requestData.notes || null
			]
		);
		return result.rows[0];
	}

	async findById(requestId: string): Promise<RideRequest | null> {
		const result = await pool.query("SELECT * FROM ride_requests WHERE request_id = $1", [
			requestId
		]);
		return result.rows[0] || null;
	}

	async findActiveByRiderId(riderId: string): Promise<RideRequest[] | null> {
		const result = await pool.query(
			`SELECT * FROM ride_requests 
       WHERE rider_id = $1 
         AND status IN ('pending', 'accepted', 'arrived', 'in_progress')
       ORDER BY created_at DESC`,
			[riderId]
		);
		return result.rows || null;
	}

	async findActiveByDriverId(driverId: string): Promise<RideRequest[] | null> {
		const result = await pool.query(
			`SELECT * FROM ride_requests 
       WHERE driver_id = $1 
         AND status IN ('accepted', 'arrived', 'in_progress')
       ORDER BY created_at DESC
       LIMIT 1`,
			[driverId]
		);
		return result.rows || null;
	}

	async findPendingRequests(
		vehicleType?: VehicleType,
		serviceType?: string,
		excludeDriverId?: string
	): Promise<RideRequest[]> {
		let query = `
      SELECT r.*, 
             l1.latitude as start_lat, l1.longitude as start_lng,
             l2.latitude as end_lat, l2.longitude as end_lng
      FROM ride_requests r
      JOIN locations l1 ON r.start_location_id = l1.location_id
      JOIN locations l2 ON r.end_location_id = l2.location_id
      WHERE r.status = 'pending'
    `;
		const params: any[] = [];
		let paramCount = 1;

		if (vehicleType) {
			query += ` AND r.ride_type = $${paramCount++}`;
			params.push(vehicleType);
		}

		if (serviceType) {
			query += ` AND r.service_type = $${paramCount++}`;
			params.push(serviceType);
		}

		// Exclude requests already seen/rejected by driver
		if (excludeDriverId) {
			query += ` AND NOT EXISTS (
        SELECT 1 FROM ride_request_rejections 
        WHERE request_id = r.request_id AND driver_id = $${paramCount++}
      )`;
			params.push(excludeDriverId);
		}

		query += " ORDER BY r.request_time ASC";

		const result = await pool.query(query, params);
		return result.rows;
	}

	async updateStatus(requestId: string, status: string, driverId?: string): Promise<RideRequest> {
		let query = `
      UPDATE ride_requests 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
    `;
		const params: any[] = [status];
		let paramCount = 2;

		if (driverId && status === "accepted") {
			query += `, driver_id = $${paramCount++}`;
			params.push(driverId);
		}

		query += ` WHERE request_id = $${paramCount} RETURNING *`;
		params.push(requestId);

		const result = await pool.query(query, params);
		return result.rows[0];
	}

	async cancel(
		requestId: string,
		reason: string,
		cancelledBy: "rider" | "driver" | "system"
	): Promise<RideRequest> {
		const result = await pool.query(
			`UPDATE ride_requests 
       SET status = 'cancelled', 
           cancel_reason = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE request_id = $2
       RETURNING *`,
			[`${cancelledBy}: ${reason}`, requestId]
		);
		return result.rows[0];
	}

	async getRideHistory(
		userId: string,
		userType: "rider" | "driver",
		page: number = 1,
		limit: number = 20
	): Promise<{ rides: RideRequest[]; total: number }> {
		const offset = (page - 1) * limit;
		const userField = userType === "rider" ? "rider_id" : "driver_id";

		const countQuery = `
      SELECT COUNT(*) as total
      FROM ride_requests
      WHERE ${userField} = $1 AND status IN ('completed', 'cancelled')
    `;

		const query = `
      SELECT r.*, 
             l1.name as start_location_name, l1.address as start_address,
             l2.name as end_location_name, l2.address as end_address,
             u.name as ${userType === "rider" ? "driver_name" : "rider_name"}
      FROM ride_requests r
      JOIN locations l1 ON r.start_location_id = l1.location_id
      JOIN locations l2 ON r.end_location_id = l2.location_id
      LEFT JOIN users u ON u.user_id = r.${userType === "rider" ? "driver_id" : "rider_id"}
      WHERE r.${userField} = $1 AND r.status IN ('completed', 'cancelled')
      ORDER BY r.request_time DESC
      LIMIT $2 OFFSET $3
    `;

		const [countResult, ridesResult] = await Promise.all([
			pool.query(countQuery, [userId]),
			pool.query(query, [userId, limit, offset])
		]);

		return {
			rides: ridesResult.rows,
			total: parseInt(countResult.rows[0].total)
		};
	}

	async recordRejection(requestId: string, driverId: string): Promise<void> {
		await pool.query(
			`INSERT INTO ride_request_rejections (request_id, driver_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
			[requestId, driverId]
		);
	}
}

export default new RideRequestModel();
