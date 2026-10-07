import Budget, { MONTHS } from '../models/Budget.js';
import Purchase from '../models/Purchase.js';
import PurchaseItem from '../models/PurchaseItem.js';
import { getMonthlySpending, evaluateBudget, monthKey, roundMoney } from '../utils/spending.js';

const lineTotal = { $multiply: ['$quantity', '$unitPrice'] };

// GET /api/analytics/summary
export const getSummary = async (req, res) => {
  const [totals, byCategory, byProduct, byStore] = await Promise.all([
    PurchaseItem.aggregate([
      {
        $group: {
          _id: null,
          totalSpending: { $sum: lineTotal },
          itemCount: { $sum: 1 },
          purchases: { $addToSet: '$purchaseId' },
        },
      },
    ]),
    PurchaseItem.aggregate([
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $lookup: { from: 'categories', localField: 'product.categoryId', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $group: { _id: '$category.name', total: { $sum: lineTotal } } },
      { $sort: { total: -1 } },
    ]),
    PurchaseItem.aggregate([
      { $group: { _id: '$productName', total: { $sum: lineTotal }, timesBought: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]),
    Purchase.aggregate([
      { $group: { _id: '$storeId', visits: { $sum: 1 } } },
      { $lookup: { from: 'stores', localField: '_id', foreignField: '_id', as: 'store' } },
      { $unwind: '$store' },
      { $sort: { visits: -1 } },
      { $limit: 1 },
    ]),
  ]);

  const totalSpending = totals[0]?.totalSpending ?? 0;
  const purchaseCount = totals[0]?.purchases.length ?? 0;

  const toCategory = (row) => (row ? { name: row._id, total: roundMoney(row.total) } : null);

  res.status(200).json({
    totalSpending: roundMoney(totalSpending),
    purchaseCount,
    itemCount: totals[0]?.itemCount ?? 0,
    averagePerPurchase: purchaseCount > 0 ? roundMoney(totalSpending / purchaseCount) : 0,
    highestCategory: toCategory(byCategory[0]),
    lowestCategory: toCategory(byCategory[byCategory.length - 1]),
    topProduct: byProduct[0]
      ? { name: byProduct[0]._id, total: roundMoney(byProduct[0].total), timesBought: byProduct[0].timesBought }
      : null,
    mostVisitedStore: byStore[0] ? { name: byStore[0].store.name, visits: byStore[0].visits } : null,
  });
};

// GET /api/analytics/monthly-spending?year=2026 (spent vs budget per month, with month-over-month change)
export const getMonthlySpendingReport = async (req, res) => {
  const year = Number(req.query.year ?? new Date().getFullYear());
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return res.status(400).json({ message: 'year must be a whole number between 2000 and 2100' });
  }

  const [spendingByMonth, budgets] = await Promise.all([getMonthlySpending(), Budget.find({ year })]);
  const budgetByMonth = new Map(budgets.map((budget) => [budget.month, budget.amount]));

  let previousSpent = null;
  const months = MONTHS.map((month) => {
    const data = spendingByMonth.get(monthKey(year, month));
    const spent = data?.total ?? 0;
    const budget = budgetByMonth.get(month) ?? null;

    const changePercent =
      previousSpent > 0 ? roundMoney(((spent - previousSpent) / previousSpent) * 100) : null;
    previousSpent = spent;

    return {
      month,
      spent,
      purchaseCount: data?.purchaseCount ?? 0,
      budget,
      budgetStatus: budget ? evaluateBudget(budget, spent).status : null,
      changePercent,
    };
  });

  const activeMonths = months.filter((month) => month.spent > 0);
  const yearTotal = activeMonths.reduce((sum, month) => sum + month.spent, 0);
  const bySpent = [...activeMonths].sort((a, b) => b.spent - a.spent);

  res.status(200).json({
    year,
    total: roundMoney(yearTotal),
    monthlyAverage: activeMonths.length > 0 ? roundMoney(yearTotal / activeMonths.length) : 0,
    highestMonth: bySpent[0]?.month ?? null,
    lowestMonth: bySpent[bySpent.length - 1]?.month ?? null,
    months,
  });
};

// GET /api/analytics/category-breakdown (spending distribution by category, in percent)
export const getCategoryBreakdown = async (req, res) => {
  const rows = await PurchaseItem.aggregate([
    { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $lookup: { from: 'categories', localField: 'product.categoryId', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category._id',
        name: { $first: '$category.name' },
        total: { $sum: lineTotal },
        itemCount: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

  res.status(200).json({
    total: roundMoney(grandTotal),
    categories: rows.map((row) => ({
      categoryId: row._id,
      name: row.name,
      total: roundMoney(row.total),
      itemCount: row.itemCount,
      percent: grandTotal > 0 ? roundMoney((row.total / grandTotal) * 100) : 0,
    })),
  });
};

// GET /api/analytics/store-comparison (average price of each product per store, and the cheapest store)
export const getStoreComparison = async (req, res) => {
  const rows = await PurchaseItem.aggregate([
    { $lookup: { from: 'purchases', localField: 'purchaseId', foreignField: '_id', as: 'purchase' } },
    { $unwind: '$purchase' },
    { $lookup: { from: 'stores', localField: 'purchase.storeId', foreignField: '_id', as: 'store' } },
    { $unwind: '$store' },
    {
      $group: {
        _id: { productId: '$productId', storeId: '$store._id' },
        productName: { $first: '$productName' },
        storeName: { $first: '$store.name' },
        averagePrice: { $avg: '$unitPrice' },
        timesBought: { $sum: 1 },
      },
    },
  ]);

  const byProduct = new Map();
  for (const row of rows) {
    const key = String(row._id.productId);
    if (!byProduct.has(key)) {
      byProduct.set(key, { productId: key, productName: row.productName, stores: [] });
    }
    byProduct.get(key).stores.push({
      storeName: row.storeName,
      averagePrice: roundMoney(row.averagePrice),
      timesBought: row.timesBought,
    });
  }

  const products = [...byProduct.values()]
    .map((product) => {
      const stores = product.stores.sort((a, b) => a.averagePrice - b.averagePrice);
      const cheapest = stores[0];
      const priciest = stores[stores.length - 1];
      return {
        ...product,
        stores,
        cheapestStore: cheapest.storeName,
        priceDifference: roundMoney(priciest.averagePrice - cheapest.averagePrice),
      };
    })
    .sort((a, b) => b.priceDifference - a.priceDifference);

  res.status(200).json(products);
};
