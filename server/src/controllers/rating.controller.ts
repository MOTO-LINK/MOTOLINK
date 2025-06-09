import { Request, Response, NextFunction } from "express";
import ratingModel from "../models/rating.model";
import rideTransactionModel from "../models/rideTransaction.model";
import rideRequestModel from "../models/rideRequest.model";
import driverModel from "../models/driver.model";
import riderModel from "../models/rider.model";
import { UserType } from "../utils/types";

class RatingController {
	async submitRating(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const userType = req.user!.user_type;
			const { rideTransactionId, rating, feedback } = req.body;

			if (!rideTransactionId || !rating) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "Transaction ID and rating are required"
					}
				});
				return;
			}

			if (rating < 1 || rating > 5) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_RATING",
						message: "Rating must be between 1 and 5"
					}
				});
				return;
			}

			// Check if rating already exists
			const existingRating = await ratingModel.findByTransactionAndUser(
				rideTransactionId,
				userId
			);

			if (existingRating) {
				res.status(400).json({
					success: false,
					error: {
						code: "RATING_EXISTS",
						message: "You have already rated this ride"
					}
				});
				return;
			}

			// Get transaction and verify user was part of the ride
			const transaction = await rideTransactionModel.findByRequestId(rideTransactionId);
			if (!transaction) {
				res.status(404).json({
					success: false,
					error: {
						code: "TRANSACTION_NOT_FOUND",
						message: "Transaction not found"
					}
				});
				return;
			}

			const rideRequest = await rideRequestModel.findById(transaction.request_id);
			if (!rideRequest) {
				res.status(404).json({
					success: false,
					error: {
						code: "RIDE_NOT_FOUND",
						message: "Ride not found"
					}
				});
				return;
			}

			// Determine who to rate
			let ratedUserId: string;
			if (userType === UserType.RIDER) {
				if (rideRequest.rider_id !== userId) {
					res.status(403).json({
						success: false,
						error: {
							code: "UNAUTHORIZED",
							message: "You are not authorized to rate this ride"
						}
					});
					return;
				}
				ratedUserId = rideRequest.driver_id!;
			} else {
				if (rideRequest.driver_id !== userId) {
					res.status(403).json({
						success: false,
						error: {
							code: "UNAUTHORIZED",
							message: "You are not authorized to rate this ride"
						}
					});
					return;
				}
				ratedUserId = rideRequest.rider_id;
			}

			// Submit rating
			const newRating = await ratingModel.create({
				ride_transaction_id: rideTransactionId,
				rating_user_id: userId,
				rated_user_id: ratedUserId,
				rating_value: rating,
				feedback
			});

			// Update user's average rating
			if (userType === UserType.RIDER) {
				await driverModel.updateRating(ratedUserId);
			} else {
				await riderModel.updateRating(ratedUserId);
			}

			res.status(201).json({
				success: true,
				data: newRating,
				message: "Rating submitted successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { page = 1, limit = 20 } = req.query;

			const { ratings, average, total } = await ratingModel.getUserRatings(
				userId,
				Number(page),
				Number(limit)
			);

			const totalPages = Math.ceil(total / Number(limit));

			res.status(200).json({
				success: true,
				data: {
					ratings,
					average: Math.round(average * 10) / 10,
					totalRatings: total,
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
}

export default new RatingController();
