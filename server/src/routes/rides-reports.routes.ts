import { Router } from 'express';
import { ridesReportsController } from '../controllers/rides-reports.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserType } from '../utils/types';

const router = Router();

/**
 * @route   GET /api/rides-reports/summary
 * @desc    Get ride summary statistics (total riders, rides, completed/canceled)
 * @access  Private (Admin only)
 */
router.get('/summary', authenticateToken, authorizeRoles(UserType.ADMIN), ridesReportsController.getRidesSummary);

/**
 * @route   GET /api/rides-reports/latest
 * @desc    Get latest rides with details and pagination
 * @access  Private (Admin only)
 */
router.get('/latest', authenticateToken, authorizeRoles(UserType.ADMIN), ridesReportsController.getLatestRides);

export default router;
