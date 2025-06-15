import { Request, Response, NextFunction } from "express";
import geocodingService from "../services/geocoding.service";
import locationModel, { Location } from "../models/location.model";

class LocationController {
	async reverseGeocode(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { latitude, longitude } = req.query;

			if (!latitude || !longitude) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_COORDINATES",
						message: "Latitude and longitude are required"
					}
				});
				return;
			}

			const address = await geocodingService.reverseGeocode(
				parseFloat(latitude as string),
				parseFloat(longitude as string)
			);

			res.status(200).json({
				success: true,
				data: {
					address,
					latitude: parseFloat(latitude as string),
					longitude: parseFloat(longitude as string)
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async geocode(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { address } = req.query;

			if (!address) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_ADDRESS",
						message: "Address is required"
					}
				});
				return;
			}

			const result = await geocodingService.geocode(address as string);

			if (!result) {
				res.status(404).json({
					success: false,
					error: {
						code: "LOCATION_NOT_FOUND",
						message: "Could not find location for the given address"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: result
			});
		} catch (error) {
			next(error);
		}
	}

	async getLocationById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const locationId = req.params.id;
			const location = await locationModel.findById(locationId);

			if (!location) {
				res.status(404).json({
					success: false,
					error: {
						code: "LOCATION_NOT_FOUND",
						message: "Location not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: {
					address: location.address,
					latitude: location.latitude,
					longitude: location.longitude
				}
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new LocationController();
