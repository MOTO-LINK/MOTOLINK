import multer from "multer";
import { Request } from "express";
import config from "../utils/config";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type. Only JPEG, PNG and WebP images are allowed"));
	}
};

export const uploadSingle = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: config.app.maxFileSizeInMB * 1024 * 1024
	}
}).single("file");

export const uploadMultiple = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: config.app.maxFileSizeInMB * 1024 * 1024
	}
}).array("files", config.app.maxNumberFiles);
