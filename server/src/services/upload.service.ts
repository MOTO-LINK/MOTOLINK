import fs from "fs/promises";
import path from "path";
import { DocumentType } from "../utils/types";

interface UploadedFile {
	filename: string;
	url: string;
	size: number;
	mimetype: string;
}

class UploadService {
	private uploadDir: string;
	private baseUrl: string;

	/**
	 * Initializes a new instance of the UploadService class.
	 *
	 * Sets the upload directory and base URL, then ensures the upload directory exists.
	 *
	 * @return {void}
	 */
	constructor() {
		this.uploadDir = path.join(__dirname, "../../uploads");
		this.baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
		this.ensureUploadDir();
	}

	/**
	 * Ensures the upload directory exists, creating it recursively if necessary.
	 * 
	 * Creates the 'documents' and 'profiles' subdirectories within the upload directory.
	 * 
	 * @return {Promise<void>} A promise that resolves when the upload directory has been ensured.
	 */
	private async ensureUploadDir(): Promise<void> {
		try {
			await fs.access(this.uploadDir);
		} catch {
			await fs.mkdir(this.uploadDir, { recursive: true });
			await fs.mkdir(path.join(this.uploadDir, "documents"), { recursive: true });
			await fs.mkdir(path.join(this.uploadDir, "profiles"), { recursive: true });
		}
	}

	/**
	 * Uploads a document file to the server.
	 *
	 * @param {Express.Multer.File} file - The file to be uploaded.
	 * @param {string} userId - The ID of the user uploading the document.
	 * @param {DocumentType} documentType - The type of document being uploaded.
	 * @return {Promise<UploadedFile>} A promise that resolves with information about the uploaded file.
	 */
	async uploadDocument(
		file: Express.Multer.File,
		userId: string,
		documentType: DocumentType
	): Promise<UploadedFile> {
		const fileExtension = path.extname(file.originalname);
		const filename = `${userId}_${documentType}_${Date.now()}${fileExtension}`;
		const filepath = path.join(this.uploadDir, "documents", filename);

		await fs.writeFile(filepath, file.buffer);

		return {
			filename,
			url: `${this.baseUrl}/uploads/documents/${filename}`,
			size: file.size,
			mimetype: file.mimetype
		};
	}

	/**
	 * Uploads a profile picture file to the server.
	 *
	 * @param {Express.Multer.File} file - The file to be uploaded.
	 * @param {string} userId - The ID of the user uploading the profile picture.
	 * @return {Promise<UploadedFile>} A promise that resolves with information about the uploaded file.
	 */
	async uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<UploadedFile> {
		const fileExtension = path.extname(file.originalname);
		const filename = `${userId}_profile_${Date.now()}${fileExtension}`;
		const filepath = path.join(this.uploadDir, "profiles", filename);

		await fs.writeFile(filepath, file.buffer);

		return {
			filename,
			url: `${this.baseUrl}/uploads/profiles/${filename}`,
			size: file.size,
			mimetype: file.mimetype
		};
	}

	/**
	 * Deletes a file from the server based on the provided URL.
	 *
	 * @param {string} fileUrl - The URL of the file to be deleted.
	 * @return {Promise<void>} A promise that resolves when the file has been deleted.
	 */
	async deleteFile(fileUrl: string): Promise<void> {
		try {
			const filename = fileUrl.split("/").pop();
			if (!filename) return;

			const documentPath = path.join(this.uploadDir, "documents", filename);
			const profilePath = path.join(this.uploadDir, "profiles", filename);

			try {
				await fs.unlink(documentPath);
			} catch {
				await fs.unlink(profilePath);
			}
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	}

	/**
	 * Validates the type of a file against a list of allowed types.
	 *
	 * @param {Express.Multer.File} file - The file to be validated.
	 * @param {string[]} allowedTypes - A list of allowed file types.
	 * @return {boolean} True if the file type is allowed, false otherwise.
	 */
	validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean {
		return allowedTypes.includes(file.mimetype);
	}

	/**
	 * Validates the size of a file against a maximum allowed size.
	 *
	 * @param {Express.Multer.File} file - The file to be validated.
	 * @param {number} maxSizeInMB - The maximum allowed file size in megabytes.
	 * @return {boolean} True if the file size is within the allowed limit, false otherwise.
	 */
	validateFileSize(file: Express.Multer.File, maxSizeInMB: number): boolean {
		const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
		return file.size <= maxSizeInBytes;
	}
}

export default new UploadService();
