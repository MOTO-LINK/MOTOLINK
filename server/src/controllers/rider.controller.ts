import { Request, Response, NextFunction } from "express";
import riderModel from "../models/rider.model";
import locationModel from "../models/location.model";

class RiderController {
	async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;

			const rider = await riderModel.getWithUserInfo(user_id);
			if (!rider) {
				res.status(404).json({
					success: false,
					error: {
						code: "RIDER_NOT_FOUND",
						message: "Rider profile not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: rider
			});
		} catch (error) {
			next(error);
		}
	}

	async getProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.params.id;

			if (!user_id) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_USER_ID",
						message: "User ID is required"
					}
				});
				return;
			}

			const rider = await riderModel.getWithUserInfo(user_id);
			if (!rider) {
				res.status(404).json({
					success: false,
					error: {
						code: "RIDER_NOT_FOUND",
						message: "Rider profile not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: rider
			});
		} catch (error) {
			next(error);
		}
	}

	async saveLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const { name, address, latitude, longitude, type, isDefault } = req.body;

			// Validate required fields
			if (!name || !address || !latitude || !longitude) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "Name, address, latitude, and longitude are required"
					}
				});
				return;
			}

			// Validate location type
			const validTypes = ["home", "work", "other"];
			const locationType = type || "other";

			if (!validTypes.includes(locationType)) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_TYPE",
						message: "Invalid location type"
					}
				});
				return;
			}

			const location = await locationModel.create({
				name,
				address,
				latitude,
				longitude,
				type: "saved",
				user_id: user_id,
				is_default: isDefault || false
			});

			res.status(201).json({
				success: true,
				data: location,
				message: "Location saved successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async getLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const { type } = req.query;

			const locations = await locationModel.findByUserId(user_id, type as string);

			res.status(200).json({
				success: true,
				data: locations
			});
		} catch (error) {
			next(error);
		}
	}

	async updateLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { locationId } = req.params;
			const { name, address, latitude, longitude, isDefault } = req.body;

			const updates: any = {};
			if (name !== undefined) updates.name = name;
			if (address !== undefined) updates.address = address;
			if (latitude !== undefined) updates.latitude = latitude;
			if (longitude !== undefined) updates.longitude = longitude;
			if (isDefault !== undefined) updates.is_default = isDefault;

			if (Object.keys(updates).length === 0) {
				res.status(400).json({
					success: false,
					error: {
						code: "NO_UPDATES",
						message: "No fields to update"
					}
				});
				return;
			}

			const location = await locationModel.update(locationId, userId, updates);

			res.status(200).json({
				success: true,
				data: location,
				message: "Location updated successfully"
			});
		} catch (error) {
			if ((error as Error).message === "Location not found or unauthorized") {
				res.status(404).json({
					success: false,
					error: {
						code: "LOCATION_NOT_FOUND",
						message: "Location not found or you don't have permission"
					}
				});
				return;
			}
			next(error);
		}
	}

	async deleteLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const { locationId } = req.params;

			const deleted = await locationModel.delete(locationId, user_id);

			if (!deleted) {
				res.status(404).json({
					success: false,
					error: {
						code: "LOCATION_NOT_FOUND",
						message: "Location not found or you don't have permission"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Location deleted successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async setDefaultLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const { locationId } = req.params;

			const location = await locationModel.setDefault(locationId, user_id);

			res.status(200).json({
				success: true,
				data: location,
				message: "Default location updated successfully"
			});
		} catch (error) {
			if ((error as Error).message === "Location not found or unauthorized") {
				res.status(404).json({
					success: false,
					error: {
						code: "LOCATION_NOT_FOUND",
						message: "Location not found or you don't have permission"
					}
				});
				return;
			}
			next(error);
		}
	}
}

export default new RiderController();
