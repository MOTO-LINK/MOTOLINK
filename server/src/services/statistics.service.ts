import { UserType } from '../utils/types';
import fareCalculationService from './fareCalculation.service';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
// db connection
import pool from "../utils/database";
interface UserStats {
  totalUsers: number;
  totalDrivers: number;
  totalRiders: number;
}

interface RevenueData {
  amount: number;
  currency: string;
  date: string;
}

interface RevenueStats {
  totalRevenue: number;
  currency: string;
  revenueByPeriod: RevenueData[];
}

type DateRangeType = 'daily' | 'monthly' | 'custom';

class StatisticsService {
  /**
   * Get user statistics: total number of users, drivers, and riders
   */
  async getUserStats(): Promise<UserStats> {
    try {
      // Count total users by type
      const usersQuery = `
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN user_type = $1 THEN 1 ELSE 0 END) as total_drivers,
          SUM(CASE WHEN user_type = $2 THEN 1 ELSE 0 END) as total_riders
        FROM users
        WHERE user_type IN ($1, $2)
      `;

      const result = await pool.query(usersQuery, [UserType.DRIVER, UserType.RIDER]);
      const stats = result.rows[0];

      return {
        totalUsers: parseInt(stats.total_users) || 0,
        totalDrivers: parseInt(stats.total_drivers) || 0,
        totalRiders: parseInt(stats.total_riders) || 0
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  /**
   * Get revenue statistics for a specific date range
   * @param rangeType The type of date range to get revenue data for
   * @param startDate Optional start date for custom range (ISO format)
   * @param endDate Optional end date for custom range (ISO format)
   */
  async getRevenueStats(rangeType: DateRangeType = 'daily', startDate?: string, endDate?: string): Promise<RevenueStats> {
    try {
      let query = '';
      const today = new Date();
      let start: Date;
      let end: Date = today;
      let groupByFormat = '';

      // Determine date range and grouping format based on the range type
      switch (rangeType) {
        case 'daily':
          // Last 7 days
          start = subDays(today, 6);  // Include today, so 6 days back
          groupByFormat = 'YYYY-MM-DD';
          query = `
            SELECT 
              SUM(platform_fee + tax_amount) as revenue,
              TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date
            FROM ride_transactions
            WHERE created_at >= $1 AND created_at <= $2
            GROUP BY DATE(created_at)
            ORDER BY date ASC
          `;
          break;

        case 'monthly':
          // Current month data by day
          start = startOfMonth(today);
          end = endOfMonth(today);
          groupByFormat = 'YYYY-MM-DD';
          query = `
            SELECT 
              SUM(platform_fee + tax_amount) as revenue,
              TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date
            FROM ride_transactions
            WHERE created_at >= $1 AND created_at <= $2
            GROUP BY DATE(created_at)
            ORDER BY date ASC
          `;
          break;

        case 'custom':
          if (!startDate || !endDate) {
            throw new Error('Start date and end date are required for custom range');
          }

          start = parseISO(startDate);
          end = parseISO(endDate);

          // If the range is more than 31 days, group by month instead of day
          const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
          if (dayDiff > 31) {
            groupByFormat = 'YYYY-MM';
            query = `
              SELECT 
                SUM(platform_fee + tax_amount) as revenue,
                TO_CHAR(DATE(created_at), 'YYYY-MM') as date
              FROM ride_transactions
              WHERE created_at >= $1 AND created_at <= $2
              GROUP BY TO_CHAR(DATE(created_at), 'YYYY-MM')
              ORDER BY date ASC
            `;
          } else {
            groupByFormat = 'YYYY-MM-DD';
            query = `
              SELECT 
                SUM(platform_fee + tax_amount) as revenue,
                TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date
              FROM ride_transactions
              WHERE created_at >= $1 AND created_at <= $2
              GROUP BY DATE(created_at)
              ORDER BY date ASC
            `;
          }
          break;
      }

      const result = await pool.query(query, [
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd') + ' 23:59:59'
      ]);

      const revenueByPeriod: RevenueData[] = result.rows.map(row => ({
        amount: parseFloat(row.revenue) || 0,
        currency: fareCalculationService.getCurrency(),
        date: row.date
      }));

      // Calculate total revenue
      const totalRevenue = revenueByPeriod.reduce((sum, item) => sum + item.amount, 0);

      return {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        currency: fareCalculationService.getCurrency(),
        revenueByPeriod
      };
    } catch (error) {
      console.error('Error fetching revenue statistics:', error);
      throw new Error('Failed to fetch revenue statistics');
    }
  }
}

export default new StatisticsService();
