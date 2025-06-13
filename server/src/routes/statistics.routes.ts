import { Router, Request, Response, NextFunction } from "express";
import statisticsController from "../controllers/statistics.controller";
import { authorizeRoles } from "../middleware/auth.middleware";
import { UserType } from "../utils/types";

const router = Router();

router.use(authorizeRoles(UserType.ADMIN));

// complaints count
router.get("/complaints", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardComplaints(req, res).catch(next);
});

// financial settlement requests
router.get("/settlements", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardSettlements(req, res).catch(next);
});

// orders count
router.get("/orders", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardOrders(req, res).catch(next);
});

// clients count
router.get("/clients", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardClients(req, res).catch(next);
});

// representatives count
router.get("/representatives", (req: Request, res: Response, next: NextFunction) => {
	statisticsController.getDashboardRepresentatives(req, res).catch(next);
});

export default router;
