import { Router, Request, Response, NextFunction } from "express";
import dashboardController from "../controllers/dashboard.controller";
import { authorizeRoles } from "../middleware/auth.middleware";
import { UserType } from "../utils/types";

const router = Router();

router.use(authorizeRoles(UserType.ADMIN));

// complaints count
router.get("/complaints", (req: Request, res: Response, next: NextFunction) => {
	dashboardController.getDashboardComplaints(req, res).catch(next);
});

// financial settlement requests
router.get("/settlements", (req: Request, res: Response, next: NextFunction) => {
	dashboardController.getDashboardSettlements(req, res).catch(next);
});

// orders count
router.get("/orders", (req: Request, res: Response, next: NextFunction) => {
	dashboardController.getDashboardOrders(req, res).catch(next);
});

// clients count
router.get("/clients", (req: Request, res: Response, next: NextFunction) => {
	dashboardController.getDashboardClients(req, res).catch(next);
});

// representatives count
router.get("/representatives", (req: Request, res: Response, next: NextFunction) => {
	dashboardController.getDashboardRepresentatives(req, res).catch(next);
});

export default router;
