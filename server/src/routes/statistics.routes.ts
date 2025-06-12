import { Router, Request, Response, NextFunction } from "express";
import statisticsController from "../controllers/statistics.controller";

const router = Router();

// Route to get user statistics
router.get("/users", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getUserStats(req, res).catch(next);
});

// Route to get revenue statistics
router.get("/revenue", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getRevenueStats(req, res).catch(next);
});

// Route to get complaints statistics
router.get("/complaints", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getComplaintsStats(req, res).catch(next);
});

// Route to get financial settlements statistics
router.get("/financial-settlements", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getFinancialSettlementsStats(req, res).catch(next);
});

// Route to get requests statistics
router.get("/requests", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getRequestsStats(req, res).catch(next);
});

export default router;
