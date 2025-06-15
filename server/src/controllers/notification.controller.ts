import { Request, Response, NextFunction } from "express";
import notificationModel from "../models/notification.model";
//import fcmTokenModel from "../models/fcm-token.model";

class NotificationController {
	async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { page = 1, limit = 20, unreadOnly = false } = req.query;

			const { notifications, total } = await notificationModel.findByUserId(
				userId,
				unreadOnly === "true",
				Number(page),
				Number(limit)
			);

			const totalPages = Math.ceil(total / Number(limit));

			res.status(200).json({
				success: true,
				data: {
					items: notifications,
					pagination: {
						page: Number(page),
						limit: Number(limit),
						total,
						totalPages
					}
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { notificationId } = req.params;

			const marked = await notificationModel.markAsViewed(notificationId, userId);

			if (!marked) {
				res.status(404).json({
					success: false,
					error: {
						code: "NOTIFICATION_NOT_FOUND",
						message: "Notification not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Notification marked as read"
			});
		} catch (error) {
			next(error);
		}
	}

	async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;

			await notificationModel.markAllAsViewed(userId);

			res.status(200).json({
				success: true,
				message: "All notifications marked as read"
			});
		} catch (error) {
			next(error);
		}
	}

/**	async updatePushToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { token, platform, deviceId } = req.body;

			if (!token || !platform) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "Token and platform are required"
					}
				});
				return;
			}

			await fcmTokenModel.saveToken(userId, token, platform, deviceId);

			res.status(200).json({
				success: true,
				message: "Push token updated successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async removePushToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { token } = req.body;

			if (!token) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_TOKEN",
						message: "Token is required"
					}
				});
				return;
			}

			await fcmTokenModel.removeUserToken(userId, token);

			res.status(200).json({
				success: true,
				message: "Push token removed successfully"
			});
		} catch (error) {
			next(error);
		}
	}*/
}

export default new NotificationController();
