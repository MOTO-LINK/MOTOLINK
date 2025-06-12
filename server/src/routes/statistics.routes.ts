import { Router, Request, Response, NextFunction } from "express";
import statisticsController from "../controllers/statistics.controller";

const router = Router();

// complaints count
router.get("/dashboard/complaints", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardComplaints(req, res).catch(next);
});

// financial settlement requests
router.get("/dashboard/settlements", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardSettlements(req, res).catch(next);
});

// orders count
router.get("/dashboard/orders", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardOrders(req, res).catch(next);
});

// clients count
router.get("/dashboard/clients", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardClients(req, res).catch(next);
});

// representatives count
router.get("/dashboard/representatives", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardRepresentatives(req, res).catch(next);
});

export default router;
