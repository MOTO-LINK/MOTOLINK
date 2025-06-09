import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import phoneModel from "../models/phone.model";
import uploadService from "../services/upload.service";

class ProfileController {
	/**
	 * Retrieves the profile information of the currently authenticated user.
	 *
	 * @param {Request} req - The Express request object.
	 * @param {Response} res - The Express response object.
	 * @param {NextFunction} next - The Express next function.
	 * @return {Promise<void>} A promise that resolves with no value.
	 */
	async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.user_id;

			const [user, phone] = await Promise.all([
				userModel.findById(userId),
				phoneModel.findByUserId(userId)
			]);

			if (!user) {
				res.status(404).json({
					success: false,
					error: {
						code: "USER_NOT_FOUND",
						message: "User not found"
					}
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: {
					...user,
					phone: phone?.phone_number,
					phone_verified: phone?.verified || false
				}
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates the profile information of the currently authenticated user.
	 *
	 * @param {Request} req - The Express request object.
	 * @param {Response} res - The Express response object.
	 * @param {NextFunction} next - The Express next function.
	 * @return {Promise<void>} A promise that resolves with no value.
	 */
	async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const { name, email } = req.body;

			const updates: any = {};
			if (name !== undefined) updates.name = name;
			if (email !== undefined) updates.email = email;

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

			// Check if email is being changed and if it's already taken
			if (email) {
				const emailExists = await userModel.checkEmailExists(email, user_id);
				if (emailExists) {
					res.status(409).json({
						success: false,
						error: {
							code: "EMAIL_EXISTS",
							message: "Email already in use"
						}
					});
					return;
				}
			}

			const user = await userModel.updateProfile(user_id, updates);

			res.status(200).json({
				success: true,
				data: user,
				message: "Profile updated successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Uploads a profile picture for the currently authenticated user.
	 *
	 * @param {Request} req - The Express request object.
	 * @param {Response} res - The Express response object.
	 * @param {NextFunction} next - The Express next function.
	 * @return {Promise<void>} A promise that resolves with no value.
	 */
	async uploadProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const file = req.file;

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

			// Validate file type
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

			// Validate file size (max 2MB for profile pictures)
			if (!uploadService.validateFileSize(file, 2)) {
				res.status(400).json({
					success: false,
					error: {
						code: "FILE_TOO_LARGE",
						message: "File size must not exceed 2MB"
					}
				});
				return;
			}

			// Get current user to check for existing profile picture
			const user = await userModel.findById(user_id);
			if (user?.profile_picture) {
				// Delete old profile picture
				await uploadService.deleteFile(user.profile_picture);
			}

			// Upload new profile picture
			const uploadedFile = await uploadService.uploadProfilePicture(file, user_id);

			// Update user profile
			const updatedUser = await userModel.updateProfile(user_id, {
				profile_picture: uploadedFile.url
			});

			res.status(200).json({
				success: true,
				data: {
					profile_picture: updatedUser.profile_picture
				},
				message: "Profile picture updated successfully"
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Changes the password of the currently authenticated user.
	 *
	 * @param {Request} req - The Express request object.
	 * @param {Response} res - The Express response object.
	 * @param {NextFunction} next - The Express next function.
	 * @return {Promise<void>} A promise that resolves with no value.
	 */
	async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_id = req.user!.user_id;
			const { currentPassword, newPassword } = req.body;

			if (!currentPassword || !newPassword) {
				res.status(400).json({
					success: false,
					error: {
						code: "MISSING_FIELDS",
						message: "Current password and new password are required"
					}
				});
				return;
			}

			// Verify current password
			const user = await userModel.findByEmail(req.user!.email);
			if (!user) {
				res.status(404).json({
					success: false,
					error: {
						code: "USER_NOT_FOUND",
						message: "User not found"
					}
				});
				return;
			}

			const isValidPassword = await userModel.verifyPassword(currentPassword, user.password);
			if (!isValidPassword) {
				res.status(401).json({
					success: false,
					error: {
						code: "INVALID_PASSWORD",
						message: "Current password is incorrect"
					}
				});
				return;
			}

			// Update password
			await userModel.updatePassword(user_id, newPassword);

			res.status(200).json({
				success: true,
				message: "Password changed successfully"
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new ProfileController();
