import PurchaseItem from '../models/PurchaseItem.js';
import { MONTHS } from '../models/Budget.js';

// Group dates in the server's local timezone so a purchase on Oct 1 (PH time)
// is not counted under September (UTC).
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const roundMoney = (value) => Math.round(value * 100) / 100;

export const monthKey = (year, monthName) => `${year}-${monthName}`;

// Returns a Map of "2026-October" -> { total, purchaseCount }
export const getMonthlySpending = async () => {
  const rows = await PurchaseItem.aggregate([
    { $lookup: { from: 'purchases', localField: 'purchaseId', foreignField: '_id', as: 'purchase' } },
    { $unwind: '$purchase' },
    {
      $group: {
        _id: {
          year: { $year: { date: '$purchase.purchaseDate', timezone: TIMEZONE } },
          month: { $month: { date: '$purchase.purchaseDate', timezone: TIMEZONE } },
        },
        total: { $sum: { $multiply: ['$quantity', '$unitPrice'] } },
        purchases: { $addToSet: '$purchaseId' },
      },
    },
  ]);

  return new Map(
    rows.map((row) => [
      monthKey(row._id.year, MONTHS[row._id.month - 1]),
      { total: roundMoney(row.total), purchaseCount: row.purchases.length },
    ])
  );
};

// Spent vs budget, with a status rule:
// under 80% = on-track, 80-100% = warning, over 100% = over-budget
export const evaluateBudget = (amount, spent) => {
  const remaining = roundMoney(amount - spent);
  const percentUsed = roundMoney((spent / amount) * 100);

  let status = 'on-track';
  if (spent > amount) status = 'over-budget';
  else if (percentUsed >= 80) status = 'warning';

  return { spent: roundMoney(spent), remaining, percentUsed, status };
};
