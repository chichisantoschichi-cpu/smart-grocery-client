import { Router } from 'express';
import {
  getBudgets,
  getBudgetById,
  getBudgetStatus,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';

const router = Router();

router.route('/').get(getBudgets).post(createBudget);
router.route('/:id').get(getBudgetById).put(updateBudget).delete(deleteBudget);
router.get('/:id/status', getBudgetStatus);

export default router;
