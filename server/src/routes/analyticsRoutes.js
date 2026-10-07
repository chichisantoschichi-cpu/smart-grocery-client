import { Router } from 'express';
import {
  getSummary,
  getMonthlySpendingReport,
  getCategoryBreakdown,
  getStoreComparison,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/summary', getSummary);
router.get('/monthly-spending', getMonthlySpendingReport);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/store-comparison', getStoreComparison);

export default router;
