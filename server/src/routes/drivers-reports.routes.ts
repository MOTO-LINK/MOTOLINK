import { Router } from 'express';
import { driversReportsController } from '../controllers/drivers-reports.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserType } from '../utils/types';

const router = Router();

/**
 * @route   GET /api/drivers-reports/summary
 * @desc    Get drivers summary statistics (total, online, verified, available)
 * @access  Private (Admin only)
 */
router.get('/summary', authenticateToken, authorizeRoles(UserType.ADMIN), driversReportsController.getDriversSummary);

/**
 * @route   GET /api/drivers-reports/details
 * @desc    Get drivers with detailed information and pagination
 * @access  Private (Admin only)
 */
router.get('/details', authenticateToken, authorizeRoles(UserType.ADMIN), driversReportsController.getDriversDetails);

export default router;
