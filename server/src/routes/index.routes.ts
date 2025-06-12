import { Router } from "express";
import authRoutes from "./auth.routes";
import phoneRoutes from "./phone.routes";
import driverRoutes from "./driver.routes";
import riderRoutes from "./rider.routes";
import profileRoutes from "./profile.routes";
//import servicesRoutes from "./services.routes";
import adminRoutes from "./admin.routes";
import locationRoutes from "./location.routes";
import rideRoutes from "./ride.routes";
import walletRoutes from "./wallet.routes";
import ratingRoutes from "./rating.routes";
import chatRoutes from "./chat.routes";
import statisticsRoutes from "./statistics.routes";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "API is healthy",
		timestamp: new Date().toISOString(),
		version: "1.0.0",
		environment: process.env.ENV
	});
});

// API documentation
router.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Motolink API",
		version: "1.0.0",
		endpoints: {
			auth: "/api/auth",
			phone: "/api/phone",
			driver: "/api/driver",
			rider: "/api/rider",
			profile: "/api/profile",
			//services: "/api/services",
			admin: "/api/admin",
			location: "/api/location",
			rides: "/api/rides",
			wallet: "/api/wallet",
			ratings: "/api/ratings",
			statistics: "/api/statistics"
		}
	});
});

// Route groups
router.use("/auth", authRoutes);
router.use("/phone", phoneRoutes);
router.use("/driver", driverRoutes);
router.use("/rider", riderRoutes);
router.use("/profile", profileRoutes);
//router.use("/services", servicesRoutes);
router.use("/admin", adminRoutes);
router.use("/location", locationRoutes);
router.use("/rides", rideRoutes);
router.use("/wallet", walletRoutes);
router.use("/ratings", ratingRoutes);
router.use("/chats", chatRoutes);
router.use("/statistics", statisticsRoutes);
export default router;
