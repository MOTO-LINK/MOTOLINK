import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { verifyToken } from "../utils/jwt.utils";
import { UserType } from "../utils/types";

interface AuthenticatedSocket extends Socket {
	userId?: string;
	userType?: UserType;
}

class WebSocketService {
	private io: SocketIOServer | null = null;
	private userSockets: Map<string, string> = new Map(); // userId -> socketId

	initialize(server: HTTPServer): void {
		this.io = new SocketIOServer(server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"]
			}
		});

		this.io.use(this.authenticateSocket);

		this.io.on("connection", (socket: AuthenticatedSocket) => {
			console.log(`User ${socket.userId} connected`);

			// Store user socket mapping
			if (socket.userId) {
				this.userSockets.set(socket.userId, socket.id);
			}

			// Join user-specific room
			socket.join(`user:${socket.userId}`);

			// Join role-specific room
			if (socket.userType === UserType.DRIVER) {
				socket.join("drivers");
			} else if (socket.userType === UserType.RIDER) {
				socket.join("riders");
			}

			// Handle location updates from drivers
			socket.on("driver:location:update", (data) => {
				this.handleDriverLocationUpdate(socket, data);
			});

			// Handle ride events
			socket.on("ride:status:update", (data) => {
				this.handleRideStatusUpdate(socket, data);
			});

			// Handle chat messages
			socket.on("chat:message:send", (data) => {
				this.handleChatMessage(socket, data);
			});

			// Handle disconnect
			socket.on("disconnect", () => {
				console.log(`User ${socket.userId} disconnected`);
				if (socket.userId) {
					this.userSockets.delete(socket.userId);
				}
			});
		});
	}

	private authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void): void {
		const token = socket.handshake.auth.token;

		if (!token) {
			return next(new Error("Authentication token required"));
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			return next(new Error("Invalid token"));
		}

		socket.userId = decoded.user_id;
		socket.userType = decoded.userType;
		next();
	}

	private handleDriverLocationUpdate(socket: AuthenticatedSocket, data: any): void {
		const { latitude, longitude, requestId } = data;

		// Broadcast to specific ride room if requestId provided
		if (requestId) {
			socket.to(`ride:${requestId}`).emit("driver:location:updated", {
				driverId: socket.userId,
				latitude,
				longitude,
				timestamp: new Date().toISOString()
			});
		}
	}

	private handleRideStatusUpdate(socket: AuthenticatedSocket, data: any): void {
		const { requestId, status } = data;

		// Broadcast to ride room
		socket.to(`ride:${requestId}`).emit("ride:status:updated", {
			requestId,
			status,
			timestamp: new Date().toISOString()
		});
	}

	private handleChatMessage(socket: AuthenticatedSocket, data: any): void {
		const { requestId, message, recipientId } = data;

		// Send to specific recipient
		const recipientSocketId = this.userSockets.get(recipientId);
		if (recipientSocketId) {
			this.io?.to(recipientSocketId).emit("chat:message:received", {
				requestId,
				senderId: socket.userId,
				message,
				timestamp: new Date().toISOString()
			});
		}
	}

	// Methods to emit events from controllers
	emitToUser(userId: string, event: string, data: any): void {
		this.io?.to(`user:${userId}`).emit(event, data);
	}

	emitToRide(requestId: string, event: string, data: any): void {
		this.io?.to(`ride:${requestId}`).emit(event, data);
	}

	emitToDrivers(event: string, data: any): void {
		this.io?.to("drivers").emit(event, data);
	}

	joinRideRoom(userId: string, requestId: string): void {
		const socketId = this.userSockets.get(userId);
		if (socketId) {
			const socket = this.io?.sockets.sockets.get(socketId);
			socket?.join(`ride:${requestId}`);
		}
	}

	leaveRideRoom(userId: string, requestId: string): void {
		const socketId = this.userSockets.get(userId);
		if (socketId) {
			const socket = this.io?.sockets.sockets.get(socketId);
			socket?.leave(`ride:${requestId}`);
		}
	}
}

export default new WebSocketService();
