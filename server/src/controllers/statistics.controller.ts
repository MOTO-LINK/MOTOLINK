import { Request, Response } from 'express';
import statisticsService from '../services/statistics.service';
import { parseISO, isValid } from 'date-fns'; // Import isValid and parseISO

class StatisticsController {
  /**
   * Get user statistics
   */
  async getUserStats(req: Request, res: Response) {
    try {
      const userStats = await statisticsService.getUserStats();
      return res.status(200).json({
        success: true,
        data: userStats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user statistics',
        error: error.message
      });
    }
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStats(req: Request, res: Response) {
    try {
      const { range = 'daily', startDate, endDate } = req.query;

      // Validate range type
      if (!['daily', 'monthly', 'custom'].includes(range as string)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid range type. Must be one of: daily, monthly, custom'
        });
      }

      // For custom range, validate dates
      if (range === 'custom') {
        if (!startDate || !endDate) {
          return res.status(400).json({
            success: false,
            message: 'For custom range, both startDate and endDate are required'
          });
        }

        const parsedStartDate = parseISO(startDate as string);
        const parsedEndDate = parseISO(endDate as string);

        if (!isValid(parsedStartDate)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid startDate format. Please use ISO 8601 format (e.g., YYYY-MM-DD).'
          });
        }

        if (!isValid(parsedEndDate)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid endDate format. Please use ISO 8601 format (e.g., YYYY-MM-DD).'
          });
        }

        if (parsedStartDate > parsedEndDate) {
          return res.status(400).json({
            success: false,
            message: 'startDate cannot be after endDate'
          });
        }
      }
      const revenueStats = await statisticsService.getRevenueStats(
        range as 'daily' | 'monthly' | 'custom',
        startDate as string,
        endDate as string
      );

      return res.status(200).json({
        success: true,
        data: revenueStats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve revenue statistics',
        error: error.message
      });
    }
  }
}

export default new StatisticsController();
