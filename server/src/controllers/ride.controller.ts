import { Request, Response, NextFunction } from "express";
import rideRequestModel, { RideRequest } from "../models/rideRequest.model";
import rideTransactionModel from "../models/rideTransaction.model";
import locationModel, { Location } from "../models/location.model";
import walletModel from "../models/wallet.model";
import driverModel from "../models/driver.model";
import fareCalculationService from "../services/fareCalculation.service";
import geocodingService from "../services/geocoding.service";
import { ApiResponse, UserType, VehicleType } from "../utils/types";

class RideController {
	// Rider endpoints
	async createRideRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const riderId = req.user!.user_id;
			const {
				pickupLocation,
				dropoffLocation,
				vehicleType,
				serviceType,
				packageDetails,
				paymentMethod,
				scheduledTime,
				notes
			} = req.body;

			// Create locations if coordinates provided
			let startLocationId = pickupLocation.locationId;
			let endLocationId = dropoffLocation.locationId;

			if (!startLocationId && pickupLocation.latitude && pickupLocation.longitude) {
				const address = await geocodingService.reverseGeocode(
					pickupLocation.latitude,
					pickupLocation.longitude
				);

				const location = await locationModel.create({
					name: pickupLocation.name || "Pickup Location",
					address,
					latitude: pickupLocation.latitude,
					longitude: pickupLocation.longitude,
					type: "pickup",
					user_id: riderId
				});
				startLocationId = location.location_id;
			}
			if (!endLocationId && dropoffLocation.latitude && dropoffLocation.longitude) {
				const address = await geocodingService.reverseGeocode(
					dropoffLocation.latitude,
					dropoffLocation.longitude
				);

				const location = await locationModel.create({
					name: dropoffLocation.name || "Dropoff Location",
					address,
					latitude: dropoffLocation.latitude,
					longitude: dropoffLocation.longitude,
					type: "dropoff",
					user_id: riderId
				});
				endLocationId = location.location_id;
			}

			// Calculate distance and fare
			const startLoc = await locationModel.findById(startLocationId);
			const endLoc = await locationModel.findById(endLocationId);

			if (!startLoc || !endLoc) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_LOCATIONS",
						message: "Invalid pickup or dropoff location"
					}
				});
				return;
			}

			const distance = geocodingService.calculateDistance(
				startLoc.latitude,
				startLoc.longitude,
				endLoc.latitude,
				endLoc.longitude
			);

			const estimatedTime = fareCalculationService.estimateTime(distance);
			const fareBreakdown = fareCalculationService.calculateFare(
				vehicleType as VehicleType,
				distance,
				estimatedTime,
				serviceType
			);

			// Check wallet balance if payment method is wallet
			if (paymentMethod === "wallet") {
				const balance = await walletModel.getBalance(riderId);
				if (balance < fareBreakdown.total) {
					res.status(400).json({
						success: false,
						error: {
							code: "INSUFFICIENT_BALANCE",
							message: `Insufficient wallet balance. Required: ${fareBreakdown.total} ${fareBreakdown.currency}, Available: ${balance} ${fareBreakdown.currency}`
						}
					});
					return;
				}
			}

			// Create ride request
			const rideRequest = await rideRequestModel.create({
				rider_id: riderId,
				start_location_id: startLocationId,
				end_location_id: endLocationId,
				ride_type: vehicleType,
				service_type: serviceType,
				scheduled_time: scheduledTime,
				package_details: packageDetails,
				distance,
				estimated_fee: fareBreakdown.total,
				payment_type: paymentMethod,
				notes
			});

			// Notify nearby drivers (implement with WebSocket later)

			res.status(201).json({
				success: true,
				data: {
					request: rideRequest,
					fareBreakdown,
					estimatedTime
				},
				message: "Ride request created successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async estimateFare(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const {
				pickupLocation,
				dropoffLocation,
				vehicleType,
				serviceType = "transportation"
			} = req.body;

			if (!pickupLocation || !dropoffLocation || !vehicleType) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "Pickup location, dropoff location, and vehicle type are required"
					}
				});
				return;
			}

			// Calculate distance
			const distance = geocodingService.calculateDistance(
				pickupLocation.latitude,
				pickupLocation.longitude,
				dropoffLocation.latitude,
				dropoffLocation.longitude
			);

			const estimatedTime = fareCalculationService.estimateTime(distance);
			const fareBreakdown = fareCalculationService.calculateFare(
				vehicleType as VehicleType,
				distance,
				estimatedTime,
				serviceType
			);

			res.status(200).json({
				success: true,
				data: {
					distance,
					estimatedTime,
					fareBreakdown
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async cancelRideRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const userType = req.user!.user_type;
			const { requestId } = req.params;
			const { reason } = req.body;

			if (!reason) {
				res.status(400).json({
					success: false,
					error: {
						code: "REASON_REQUIRED",
						message: "Cancellation reason is required"
					}
				});
				return;
			}

			const rideRequest = await rideRequestModel.findById(requestId);
			if (!rideRequest) {
				res.status(404).json({
					success: false,
					error: {
						code: "REQUEST_NOT_FOUND",
						message: "Ride request not found"
					}
				});
				return;
			}

			// Verify user is part of this ride
			if (
				(userType === UserType.RIDER && rideRequest.rider_id !== userId) ||
				(userType === UserType.DRIVER && rideRequest.driver_id !== userId)
			) {
				res.status(403).json({
					success: false,
					error: {
						code: "UNAUTHORIZED",
						message: "You are not authorized to cancel this ride"
					}
				});
				return;
			}

			// Check if cancellation fee applies
			let cancellationFee = 0;
			if (rideRequest.status === "accepted" || rideRequest.status === "arrived") {
				const transaction = await rideTransactionModel.findByRequestId(requestId);
				if (transaction) {
					const minutesSinceAcceptance =
						(Date.now() - new Date(transaction.start_time).getTime()) / (1000 * 60);

					cancellationFee = fareCalculationService.calculateCancellationFee(
						rideRequest.ride_type,
						minutesSinceAcceptance
					);

					// Apply cancellation fee if rider cancels
					if (userType === UserType.RIDER && cancellationFee > 0) {
						try {
							// Transfer cancellation fee from rider to driver
							await walletModel.debit(
								rideRequest.rider_id,
								cancellationFee,
								"cancellation_fee",
								rideRequest.driver_id,
								requestId,
								`Cancellation fee for ride ${requestId}`
							);

							await walletModel.credit(
								rideRequest.driver_id!,
								cancellationFee,
								"cancellation_fee",
								requestId,
								`Cancellation fee received for ride ${requestId}`
							);
						} catch (error) {
							console.error("Failed to process cancellation fee:", error);
						}
					}
				}
			}

			// Cancel the ride
			const cancelledRide = await rideRequestModel.cancel(
				requestId,
				reason,
				userType === UserType.RIDER ? "rider" : "driver"
			);

			res.status(200).json({
				success: true,
				data: {
					ride: cancelledRide,
					cancellationFee
				},
				message: "Ride cancelled successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async getActiveRide(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const userType = req.user!.user_type;
			const activeRidesDetails: Array<
				RideRequest & { startLocation: Location | null; endLocation: Location | null }
			> = [];

			const activeRides =
				userType === UserType.RIDER
					? await rideRequestModel.findActiveByRiderId(userId)
					: await rideRequestModel.findActiveByDriverId(userId);

			if (!activeRides) {
				res.status(404).json({
					success: false,
					error: {
						code: "NO_ACTIVE_RIDE",
						message: "No active ride found"
					}
				});
				return;
			}

			for (const activeRide of activeRides) {
				// Get location details
				const [startLocation, endLocation] = await Promise.all([
					locationModel.findById(activeRide.start_location_id),
					locationModel.findById(activeRide.end_location_id)
				]);

				activeRidesDetails.push({
					...activeRide,
					startLocation,
					endLocation
				});
			};

			res.status(200).json({
				success: true,
				data: {
					"activeRides": activeRidesDetails
				}
			});
		} catch (error) {
			next(error);
		}
	}

	// Driver endpoints
	async getAvailableRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const driverId = req.user!.user_id;

			// Get driver info
			const driver = await driverModel.findById(driverId);
			if (!driver || !driver.is_online || !driver.is_available) {
				res.status(400).json({
					success: false,
					error: {
						code: "DRIVER_NOT_AVAILABLE",
						message: "You must be online and available to see ride requests"
					}
				});
				return;
			}

			// Get pending requests matching driver's vehicle type
			const requests = await rideRequestModel.findPendingRequests(
				driver.vehicle_type,
				undefined,
				driverId
			);

			res.status(200).json({
				success: true,
				data: requests
			});
		} catch (error) {
			next(error);
		}
	}

	async acceptRideRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const driverId = req.user!.user_id;
			const { requestId } = req.params;

			// Verify driver is available
			const driver = await driverModel.findById(driverId);
			if (!driver || !driver.is_online || !driver.is_available) {
				res.status(400).json({
					success: false,
					error: {
						code: "DRIVER_NOT_AVAILABLE",
						message: "You must be online and available to accept rides"
					}
				});
				return;
			}

			// Check if driver already has an active ride
			const activeRide = await rideRequestModel.findActiveByDriverId(driverId);
			if (activeRide) {
				res.status(400).json({
					success: false,
					error: {
						code: "ACTIVE_RIDE_EXISTS",
						message: "You already have an active ride"
					}
				});
				return;
			}

			// Get ride request
			const rideRequest = await rideRequestModel.findById(requestId);
			if (!rideRequest || rideRequest.status !== "pending") {
				res.status(404).json({
					success: false,
					error: {
						code: "REQUEST_NOT_AVAILABLE",
						message: "Ride request is no longer available"
					}
				});
				return;
			}

			// Update request status and assign driver
			const updatedRequest = await rideRequestModel.updateStatus(
				requestId,
				"accepted",
				driverId
			);

			// Create transaction record
			const fareBreakdown = fareCalculationService.calculateFare(
				rideRequest.ride_type,
				rideRequest.distance!,
				fareCalculationService.estimateTime(rideRequest.distance!),
				rideRequest.service_type
			);

			const transaction = await rideTransactionModel.create({
				request_id: requestId,
				driver_id: driverId,
				base_fare:
					fareBreakdown.baseFare +
					fareBreakdown.distanceCharge +
					fareBreakdown.timeCharge,
				platform_fee: fareBreakdown.platformFee,
				tax_amount: fareBreakdown.taxAmount,
				total_fee: fareBreakdown.total
			});

			// Update driver availability
			await driverModel.updateStatus(driverId, { is_available: false });

			res.status(200).json({
				success: true,
				data: {
					request: updatedRequest,
					transaction
				},
				message: "Ride request accepted successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async declineRideRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const driverId = req.user!.user_id;
			const { requestId } = req.params;

			// Record the rejection
			await rideRequestModel.recordRejection(requestId, driverId);

			res.status(200).json({
				success: true,
				message: "Ride request declined"
			});
		} catch (error) {
			next(error);
		}
	}

	async updateRideStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const driverId = req.user!.user_id;
			const { requestId } = req.params;
			const { status } = req.body;

			const validStatuses = ["arrived", "in_progress", "completed"];
			if (!validStatuses.includes(status)) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_STATUS",
						message: "Invalid ride status"
					}
				});
				return;
			}

			// Verify driver owns this ride
			const rideRequest = await rideRequestModel.findById(requestId);
			if (!rideRequest || rideRequest.driver_id !== driverId) {
				res.status(403).json({
					success: false,
					error: {
						code: "UNAUTHORIZED",
						message: "You are not authorized to update this ride"
					}
				});
				return;
			}

			// Update ride status
			const updatedRequest = await rideRequestModel.updateStatus(requestId, status);

			// Handle ride completion
			if (status === "completed") {
				const transaction = await rideTransactionModel.findByRequestId(requestId);
				if (!transaction) {
					res.status(400).json({
						success: false,
						error: {
							code: "TRANSACTION_NOT_FOUND",
							message: "Transaction not found for this ride"
						}
					});
					return;
				}

				// Process payment
				try {
					if (rideRequest.payment_type === "wallet") {
						// Transfer money from rider to driver
						const netDriverAmount = transaction.base_fare; // Driver gets base fare
						const platformAmount = transaction.platform_fee + transaction.tax_amount; // Platform gets fees + tax

						// Debit from rider
						await walletModel.debit(
							rideRequest.rider_id,
							transaction.total_fee,
							"ride_payment",
							driverId,
							requestId,
							`Payment for ride ${requestId}`
						);

						// Credit to driver
						await walletModel.credit(
							driverId,
							netDriverAmount,
							"ride_payment",
							requestId,
							`Payment received for ride ${requestId}`
						);

						// Credit platform fees to platform wallet (if you have one)
						// For now, we'll just log it
						console.log(`Platform earned ${platformAmount} from ride ${requestId}`);
					}

					// Complete the transaction
					await rideTransactionModel.completeRide(
						transaction.transaction_id,
						rideRequest.distance!,
						"success"
					);

					// Make driver available again
					await driverModel.updateStatus(driverId, { is_available: true });
				} catch (paymentError) {
					console.error("Payment processing failed:", paymentError);

					// Update transaction status to failed
					await rideTransactionModel.completeRide(
						transaction.transaction_id,
						rideRequest.distance!,
						"failure"
					);

					res.status(400).json({
						success: false,
						error: {
							code: "PAYMENT_FAILED",
							message: "Payment processing failed"
						}
					});
					return;
				}
			}

			res.status(200).json({
				success: true,
				data: updatedRequest,
				message: `Ride status updated to ${status}`
			});
		} catch (error) {
			next(error);
		}
	}

	async getRideHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const userType = req.user!.user_type;
			const { page = 1, limit = 20 } = req.query;

			const { rides, total } = await rideRequestModel.getRideHistory(
				userId,
				userType === UserType.RIDER ? "rider" : "driver",
				Number(page),
				Number(limit)
			);

			const totalPages = Math.ceil(total / Number(limit));

			res.status(200).json({
				success: true,
				data: {
					items: rides,
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

	async trackDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const riderId = req.user!.user_id;
			const { requestId } = req.params;

			const rideRequest = await rideRequestModel.findById(requestId);
			if (!rideRequest || rideRequest.rider_id !== riderId) {
				res.status(403).json({
					success: false,
					error: {
						code: "UNAUTHORIZED",
						message: "You are not authorized to track this ride"
					}
				});
				return;
			}

			if (!rideRequest.driver_id) {
				res.status(400).json({
					success: false,
					error: {
						code: "NO_DRIVER_ASSIGNED",
						message: "No driver assigned to this ride yet"
					}
				});
				return;
			}

			// Get driver's current location
			const driver = await driverModel.findById(rideRequest.driver_id);
			if (!driver || !driver.current_location_id) {
				res.status(404).json({
					success: false,
					error: {
						code: "DRIVER_LOCATION_NOT_FOUND",
						message: "Driver location not available"
					}
				});
				return;
			}

			const driverLocation = await locationModel.findById(driver.current_location_id);

			res.status(200).json({
				success: true,
				data: {
					driverId: rideRequest.driver_id,
					location: driverLocation
				}
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new RideController();
