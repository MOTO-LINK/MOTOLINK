// src/server.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import apiRoutes from "./routes/index.routes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({
		status: "success",
		message: "Server is healthy"
	});
});

// API routes
app.use("/api", apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle undefined routes
app.use((_req: Request, res: Response) => {
	res.status(404).json({
		status: "error",
		message: "Route not found"
	});
});

// Start server only if not in test environment
//if (process.env.ENV !== "test") {
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
//}

export default app;
