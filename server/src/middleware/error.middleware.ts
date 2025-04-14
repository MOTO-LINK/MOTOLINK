import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
	status?: number;
}

export const errorHandler = (
	error: CustomError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	const status = error.status || 500;
	const message = error.message || "Internal server error";

	res.status(status).json({
		status: "Error",
		message
	});
};
