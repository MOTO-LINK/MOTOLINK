import { Request, Response, NextFunction } from "express";
import driverModel from "../models/driver.model";
import documentModel from "../models/document.model";
import locationModel from "../models/location.model";
import uploadService from "../services/upload.service";
import { DocumentType } from "../utils/types";
import config from "../utils/config";

class DriverController {
	async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { documentType } = req.body;
			const file = req.file;
			const userId = req.user!.user_id;

			if (!file) {
				res.status(400).json({
					success: false,
					error: {
						code: "NO_FILE",
						message: "No file uploaded"
					}
				});
				return;
			}

			if (!documentType || !Object.values(DocumentType).includes(documentType)) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_DOCUMENT_TYPE",
						message: "Invalid document type"
					}
				});
				return;
			}

			// Validate file type (images only)
			const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
			if (!uploadService.validateFileType(file, allowedTypes)) {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_FILE_TYPE",
						message: "Only image files (JPEG, PNG, WebP) are allowed"
					}
				});
				return;
			}

			// Validate file size (max 5MB)
			if (!uploadService.validateFileSize(file, config.app.maxFileSizeInMB)) {
				res.status(400).json({
					success: false,
					error: {
						code: "FILE_TOO_LARGE",
						message: "File size must not exceed 5MB"
					}
				});
				return;
			}

			// Check if document already exists
			const existingDoc = await documentModel.findByUserAndType(userId, documentType);

			// Upload file
			const uploadedFile = await uploadService.uploadDocument(file, userId, documentType);

			// Delete old file if exists
			if (existingDoc) {
				await uploadService.deleteFile(existingDoc.document_url);
				await documentModel.deleteDocument(existingDoc.document_id, userId);
			}

			// Create document record
			const document = await documentModel.create({
				user_id: userId,
				document_type: documentType,
				document_url: uploadedFile.url
			});

			res.status(201).json({
				success: true,
				data: document,
				message: "Document uploaded successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const documents = await documentModel.findByUserId(userId);

			const requiredTypes = documentModel.getRequiredDocumentTypes("driver");
			const uploadedTypes = documents.map((doc) => doc.document_type);
			const missingTypes = requiredTypes.filter((type) => !uploadedTypes.includes(type));

			res.status(200).json({
				success: true,
				data: {
					documents,
					requiredTypes,
					missingTypes,
					allDocumentsUploaded: missingTypes.length === 0
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async getVerificationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;

			const [driver, documents] = await Promise.all([
				driverModel.findById(userId),
				documentModel.findByUserId(userId)
			]);

			if (!driver) {
				res.status(404).json({
					success: false,
					error: {
						code: "DRIVER_NOT_FOUND",
						message: "Driver profile not found"
					}
				});
				return;
			}

			const requiredDocs = await documentModel.getRequiredDocumentTypes("driver");
			const uploadedDocs = documents.map((doc) => doc.document_type);
			const missingDocs = requiredDocs.filter((type) => !uploadedDocs.includes(type));
			const allDocsVerified = await documentModel.areAllDocumentsVerified(userId);

			res.status(200).json({
				success: true,
				data: {
					verificationStatus: driver.verification_status,
					verified: driver.verified,
					documents: documents.map((doc) => ({
						type: doc.document_type,
						status: doc.verification_status,
						uploadedAt: doc.created_at,
						verifiedAt: doc.verification_date
					})),
					missingDocuments: missingDocs,
					allDocumentsUploaded: missingDocs.length === 0,
					allDocumentsVerified: allDocsVerified
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { isOnline } = req.body;

			if (typeof isOnline !== "boolean") {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_STATUS",
						message: "isOnline must be a boolean value"
					}
				});
				return;
			}

			const driver = await driverModel.findById(userId);
			if (!driver) {
				res.status(404).json({
					success: false,
					error: {
						code: "DRIVER_NOT_FOUND",
						message: "Driver profile not found"
					}
				});
				return;
			}

			// Check if driver is verified before allowing to go online
			if (isOnline && !driver.verified) {
				res.status(403).json({
					success: false,
					error: {
						code: "NOT_VERIFIED",
						message: "You must be verified to go online"
					}
				});
				return;
			}

			const updatedDriver = await driverModel.updateStatus(userId, {
				is_online: isOnline,
				is_available: isOnline // When going online, also set available
			});

			res.status(200).json({
				success: true,
				data: {
					isOnline: updatedDriver.is_online,
					isAvailable: updatedDriver.is_available
				},
				message: `You are now ${isOnline ? "online" : "offline"}`
			});
		} catch (error) {
			next(error);
		}
	}

	async updateAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { isAvailable } = req.body;

			if (typeof isAvailable !== "boolean") {
				res.status(400).json({
					success: false,
					error: {
						code: "INVALID_STATUS",
						message: "isAvailable must be a boolean value"
					}
				});
				return;
			}

			const driver = await driverModel.findById(userId);
			if (!driver) {
				res.status(404).json({
					success: false,
					error: {
						code: "DRIVER_NOT_FOUND",
						message: "Driver profile not found"
					}
				});
				return;
			}

			// Can only be available if online
			if (isAvailable && !driver.is_online) {
				res.status(400).json({
					success: false,
					error: {
						code: "NOT_ONLINE",
						message: "You must be online to set availability"
					}
				});
				return;
			}

			const updatedDriver = await driverModel.updateStatus(userId, {
				is_available: isAvailable
			});

			res.status(200).json({
				success: true,
				data: {
					isAvailable: updatedDriver.is_available
				},
				message: `You are now ${isAvailable ? "available" : "unavailable"} for rides`
			});
		} catch (error) {
			next(error);
		}
	}

	async updateLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;
			const { latitude, longitude } = req.body;

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

			// Create or update current location
			const existingLocations = await locationModel.findByUserId(userId, "current");

			if (existingLocations.length > 0) {
				// Update existing current location
				await locationModel.update(existingLocations[0].location_id, userId, {
					latitude,
					longitude,
					address: `${latitude}, ${longitude}` // You might want to use a geocoding service here
				});
			} else {
				// Create new current location
				const location = await locationModel.create({
					name: "Current Location",
					address: `${latitude}, ${longitude}`,
					latitude,
					longitude,
					type: "current",
					user_id: userId
				});

				// Update driver's current_location
				await driverModel.updateLocation(userId, location.location_id);
			}

			res.status(200).json({
				success: true,
				message: "Location updated successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;

			const driver = await driverModel.findById(userId);
			if (!driver) {
				res.status(404).json({
					success: false,
					error: {
						code: "DRIVER_NOT_FOUND",
						message: "Driver profile not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: driver
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new DriverController();
