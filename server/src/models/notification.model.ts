import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface Notification {
	notification_id: string;
	user_id: string;
	notification_type: "system" | "ride" | "message";
	message_content: string;
	viewed: boolean;
	sent: boolean;
	created_at?: Date;
}

export class NotificationModel {
	async create(notificationData: {
		user_id: string;
		notification_type: "system" | "ride" | "message";
		message_content: string;
	}): Promise<Notification> {
		const result = await pool.query(
			`INSERT INTO notifications (
        notification_id, user_id, notification_type, 
        message_content, viewed, sent
      ) VALUES ($1, $2, $3, $4, false, false)
      RETURNING *`,
			[
				uuidv4(),
				notificationData.user_id,
				notificationData.notification_type,
				notificationData.message_content
			]
		);
		return result.rows[0];
	}

	async findByUserId(
		userId: string,
		unreadOnly: boolean = false,
		page: number = 1,
		limit: number = 20
	): Promise<{ notifications: Notification[]; total: number }> {
		const offset = (page - 1) * limit;
		let query = "SELECT * FROM notifications WHERE user_id = $1";
		const params: any[] = [userId];

		if (unreadOnly) {
			query += " AND viewed = false";
		}

		const countQuery = query.replace("*", "COUNT(*) as total");
		query += " ORDER BY created_at DESC LIMIT $2 OFFSET $3";
		params.push(limit, offset);

		const [countResult, notificationsResult] = await Promise.all([
			pool.query(countQuery, [userId]),
			pool.query(query, params)
		]);

		return {
			notifications: notificationsResult.rows,
			total: parseInt(countResult.rows[0].total)
		};
	}

	async markAsViewed(notificationId: string, userId: string): Promise<boolean> {
		const result = await pool.query(
			`UPDATE notifications 
       SET viewed = true 
       WHERE notification_id = $1 AND user_id = $2`,
			[notificationId, userId]
		);
		return result.rowCount! > 0;
	}

	async markAllAsViewed(userId: string): Promise<void> {
		await pool.query(
			"UPDATE notifications SET viewed = true WHERE user_id = $1 AND viewed = false",
			[userId]
		);
	}

	async createBulkNotifications(
		userIds: string[],
		notificationType: "system" | "ride" | "message",
		messageContent: string
	): Promise<void> {
		const values = userIds
			.map(
				(userId) =>
					`('${uuidv4()}', '${userId}', '${notificationType}', '${messageContent}', false, false)`
			)
			.join(",");

		await pool.query(
			`INSERT INTO notifications (
        notification_id, user_id, notification_type, 
        message_content, viewed, sent
      ) VALUES ${values}`
		);
	}
}

export default new NotificationModel();
