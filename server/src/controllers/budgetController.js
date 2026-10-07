import Budget, { MONTHS } from '../models/Budget.js';
import { getMonthlySpending, evaluateBudget, monthKey, roundMoney } from '../utils/spending.js';

const withSpending = (budget, spendingByMonth) => {
  const spent = spendingByMonth.get(monthKey(budget.year, budget.month))?.total ?? 0;
  return { ...budget.toJSON(), ...evaluateBudget(budget.amount, spent) };
};

// GET /api/budgets (newest month first, each with spent/remaining/status)
export const getBudgets = async (req, res) => {
  const [budgets, spendingByMonth] = await Promise.all([Budget.find(), getMonthlySpending()]);

  const result = budgets
    .map((budget) => withSpending(budget, spendingByMonth))
    .sort((a, b) => b.year - a.year || MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month));

  res.status(200).json(result);
};

// GET /api/budgets/:id
export const getBudgetById = async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }
  const spendingByMonth = await getMonthlySpending();
  res.status(200).json(withSpending(budget, spendingByMonth));
};

// GET /api/budgets/:id/status (spent vs budget, daily allowance and month-end projection)
export const getBudgetStatus = async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }

  const spendingByMonth = await getMonthlySpending();
  const monthData = spendingByMonth.get(monthKey(budget.year, budget.month));
  const spent = monthData?.total ?? 0;
  const evaluation = evaluateBudget(budget.amount, spent);

  const monthIndex = MONTHS.indexOf(budget.month);
  const daysInMonth = new Date(budget.year, monthIndex + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === budget.year && today.getMonth() === monthIndex;
  const isFutureMonth = new Date(budget.year, monthIndex, 1) > today;

  let period = 'past';
  let daysElapsed = daysInMonth;
  if (isCurrentMonth) {
    period = 'current';
    daysElapsed = today.getDate();
  } else if (isFutureMonth) {
    period = 'upcoming';
    daysElapsed = 0;
  }
  const daysRemaining = daysInMonth - daysElapsed;

  const dailyAverage = daysElapsed > 0 ? spent / daysElapsed : 0;
  const projectedSpending = isCurrentMonth ? dailyAverage * daysInMonth : spent;
  const dailyAllowance =
    daysRemaining > 0 ? Math.max(evaluation.remaining, 0) / daysRemaining : 0;

  res.status(200).json({
    id: budget.id,
    month: budget.month,
    year: budget.year,
    amount: budget.amount,
    ...evaluation,
    purchaseCount: monthData?.purchaseCount ?? 0,
    period,
    daysInMonth,
    daysElapsed,
    daysRemaining,
    dailyAverage: roundMoney(dailyAverage),
    dailyAllowance: roundMoney(dailyAllowance),
    projectedSpending: roundMoney(projectedSpending),
    projectedToExceed: projectedSpending > budget.amount,
  });
};

// POST /api/budgets
export const createBudget = async (req, res) => {
  const { month, year, amount } = req.body;
  const budget = await Budget.create({ month, year, amount });
  res.status(201).json(budget);
};

// PUT /api/budgets/:id
export const updateBudget = async (req, res) => {
  const { month, year, amount } = req.body;
  const budget = await Budget.findByIdAndUpdate(
    req.params.id,
    { month, year, amount },
    { new: true, runValidators: true }
  );
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }
  res.status(200).json(budget);
};

// DELETE /api/budgets/:id
export const deleteBudget = async (req, res) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }
  res.status(200).json({ message: 'Budget deleted successfully' });
};
