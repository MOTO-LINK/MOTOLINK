import pool from "../utils/database";

export type ReportType = "application" | "driver" | "rider";

// Changed from type alias to enum
export enum ReportStatus {
	PENDING = "pending",
	RESOLVED = "resolved",
	DISMISSED = "dismissed",
}

export interface Report {
	report_id: string;
	reporter_id: string;
	reported_user_id: string | null;
	report_type: ReportType;
	description: string;
	report_time: Date;
	status: ReportStatus;
	resolution_notes: string | null;
	resolved_by: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface ReportWithUserDetails extends Report {
	reporter_email?: string;
	reporter_first_name?: string;
	reporter_last_name?: string;
	reported_user_email?: string;
	reported_user_first_name?: string;
	reported_user_last_name?: string;
	resolver_email?: string;
	resolver_first_name?: string;
	resolver_last_name?: string;
}

export class ReportModel {
	async getAll(): Promise<ReportWithUserDetails[]> {
		let conn;
		try {
			conn = await pool.connect();
			const sql = `
				SELECT r.*,
					   reporter.email      as reporter_email,
					   reporter.first_name as reporter_first_name,
					   reporter.last_name  as reporter_last_name,
					   reported.email      as reported_user_email,
					   reported.first_name as reported_user_first_name,
					   reported.last_name  as reported_user_last_name,
					   resolver.email      as resolver_email,
					   resolver.first_name as resolver_first_name,
					   resolver.last_name  as resolver_last_name
				FROM reports r
						 LEFT JOIN
					 users reporter ON r.reporter_id = reporter.user_id
						 LEFT JOIN
					 users reported ON r.reported_user_id = reported.user_id
						 LEFT JOIN
					 users resolver ON r.resolved_by = resolver.user_id
				ORDER BY r.report_time DESC
			`;
			const result = await conn.query(sql);
			return result.rows;
		} catch (error) {
			throw new Error(`Unable to get reports: ${(error as Error).message}`);
		} finally {
			if (conn) conn.release();
		}
	}

	async getById(id: string): Promise<ReportWithUserDetails> {
		let conn;
		try {
			conn = await pool.connect();
			const sql = `
				SELECT r.*,
					   reporter.email      as reporter_email,
					   reporter.first_name as reporter_first_name,
					   reporter.last_name  as reporter_last_name,
					   reported.email      as reported_user_email,
					   reported.first_name as reported_user_first_name,
					   reported.last_name  as reported_user_last_name,
					   resolver.email      as resolver_email,
					   resolver.first_name as resolver_first_name,
					   resolver.last_name  as resolver_last_name
				FROM reports r
						 LEFT JOIN
					 users reporter ON r.reporter_id = reporter.user_id
						 LEFT JOIN
					 users reported ON r.reported_user_id = reported.user_id
						 LEFT JOIN
					 users resolver ON r.resolved_by = resolver.user_id
				WHERE r.report_id = $1
			`;
			const result = await conn.query(sql, [id]);

			if (result.rows.length === 0) {
				throw new Error(`Report with ID ${id} not found`);
			}

			return result.rows[0];
		} catch (error) {
			throw new Error(`Unable to get report ${id}: ${(error as Error).message}`);
		} finally {
			if (conn) conn.release();
		}
	}

	async updateStatus(
		id: string,
		status: ReportStatus,
		resolutionNotes: string | null,
		resolvedBy: string
	): Promise<Report> {
		let conn;
		try {
			conn = await pool.connect();

			// First check if report exists
			const checkSql = `SELECT *
							  FROM reports
							  WHERE report_id = $1`;
			const checkResult = await conn.query(checkSql, [id]);

			if (checkResult.rows.length === 0) {
				throw new Error(`Report with ID ${id} not found`);
			}

			// Update the report status
			const updateSql = `
				UPDATE reports
				SET status           = $2,
					resolution_notes = $3,
					resolved_by      = $4,
					updated_at       = CURRENT_TIMESTAMP
				WHERE report_id = $1 RETURNING *
			`;

			const result = await conn.query(updateSql, [id, status, resolutionNotes, resolvedBy]);

			return result.rows[0];
		} catch (error) {
			throw new Error(`Unable to update report ${id}: ${(error as Error).message}`);
		} finally {
			if (conn) conn.release();
		}
	}

	async getByStatus(status: ReportStatus): Promise<ReportWithUserDetails[]> {
		let conn;
		try {
			conn = await pool.connect();
			const sql = `
				SELECT r.*,
					   reporter.email      as reporter_email,
					   reporter.first_name as reporter_first_name,
					   reporter.last_name  as reporter_last_name,
					   reported.email      as reported_user_email,
					   reported.first_name as reported_user_first_name,
					   reported.last_name  as reported_user_last_name,
					   resolver.email      as resolver_email,
					   resolver.first_name as resolver_first_name,
					   resolver.last_name  as resolver_last_name
				FROM reports r
						 LEFT JOIN
					 users reporter ON r.reporter_id = reporter.user_id
						 LEFT JOIN
					 users reported ON r.reported_user_id = reported.user_id
						 LEFT JOIN
					 users resolver ON r.resolved_by = resolver.user_id
				WHERE r.status = $1
				ORDER BY r.report_time DESC
			`;
			const result = await conn.query(sql, [status]);
			return result.rows;
		} catch (error) {
			throw new Error(`Unable to get ${status} reports: ${(error as Error).message}`);
		} finally {
			if (conn) conn.release();
		}
	}
}
