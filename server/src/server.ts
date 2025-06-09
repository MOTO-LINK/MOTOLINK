import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { errorHandler } from "./middleware/error.middleware";
import apiRoutes from "./routes/index.routes";
import websocketService from "./services/websocket.service";
import config from "./utils/config";
import { Config } from "./utils/types";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Websocket service
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({
		status: "success",
		message: "Server is healthy"
	});
});

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

for (const key in config) {
	console.log(`${key}: ${config[key as keyof Config]}`);
	console.log(`${typeof config[key as keyof Config]}`);
}
// Start server only if not in test environment
//if (process.env.ENV !== "test") {
httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);
	console.log(`Environment: ${process.env.ENV}`);
    
	// Initialize WebSocket
	websocketService.initialize(httpServer);
	console.log("WebSocket server initialized");
});
//}

export default app;
