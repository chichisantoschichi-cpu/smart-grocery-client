import { Link } from "react-router";

import { ErrorState, LoadingState } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import { useProducts } from "../../hooks/useProducts";
import { usePurchases } from "../../hooks/usePurchases";
import type { AnalyticsSummary, CategoryBreakdown } from "../../types";

function SpendingAnalysisPage() {
  const breakdownQuery = useApi<CategoryBreakdown>("/analytics/category-breakdown");
  const summaryQuery = useApi<AnalyticsSummary>("/analytics/summary");
  const purchasesQuery = usePurchases();
  const { products } = useProducts();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  if (breakdownQuery.loading || summaryQuery.loading || purchasesQuery.loading) {
    return <LoadingState message="Loading spending analysis..." />;
  }

  const error = breakdownQuery.error ?? summaryQuery.error ?? purchasesQuery.error;
  if (error || !breakdownQuery.data || !summaryQuery.data) {
    return (
      <ErrorState
        message={error ?? "No analytics data."}
        onRetry={() => {
          breakdownQuery.refetch();
          summaryQuery.refetch();
          purchasesQuery.refetch();
        }}
      />
    );
  }

  const summary = summaryQuery.data;

  // Category totals and percentages are computed by the API
  const categoriesWithPercentage = breakdownQuery.data.categories.map((category) => ({
    name: category.name,
    amount: category.total,
    percentage: category.percent,
  }));

  const totalSpending = breakdownQuery.data.total;

  // Product totals across all purchases
  const categoryByProductId = new Map(
    products.map((product) => [product.id, product.categoryName ?? "Uncategorized"]),
  );

  const productMap = new Map<
    string,
    {
      id: string;
      name: string;
      amount: number;
      purchases: number;
      category: string;
    }
  >();

  purchasesQuery.purchases.forEach((purchase) => {
    purchase.items.forEach((item) => {
      const existingProduct = productMap.get(item.productId);

      if (existingProduct) {
        existingProduct.amount += item.subtotal;
        existingProduct.purchases += 1;
      } else {
        productMap.set(item.productId, {
          id: item.productId,
          name: item.productName,
          amount: item.subtotal,
          purchases: 1,
          category: categoryByProductId.get(item.productId) ?? "—",
        });
      }
    });
  });

  const productAnalysis = Array.from(productMap.values()).sort(
    (a, b) => b.amount - a.amount,
  );

  const highestCategory =
    categoriesWithPercentage[0];

  const lowestCategory =
    categoriesWithPercentage[
      categoriesWithPercentage.length - 1
    ];

  const averagePurchase = summary.averagePerPurchase;

  const maxCategoryAmount = Math.max(
    ...categoriesWithPercentage.map(
      (item) => item.amount,
    ),
    1,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <Link
          to="/analytics"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Analytics
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-emerald-600">
            Category intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Spending Analysis
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            See how your grocery spending is distributed across
            categories and products.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Spending
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalSpending)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Highest Category
          </p>
          <p className="mt-2 truncate text-2xl font-bold text-slate-900">
            {highestCategory?.name ?? "No data"}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {formatCurrency(
              highestCategory?.amount ?? 0,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Lowest Category
          </p>
          <p className="mt-2 truncate text-2xl font-bold text-slate-900">
            {lowestCategory?.name ?? "No data"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {formatCurrency(
              lowestCategory?.amount ?? 0,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Average Purchase
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(averagePurchase)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Per recorded grocery trip
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Distribution
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Spending by category
          </h2>
        </div>

        <div className="mt-7 space-y-6">
          {categoriesWithPercentage.map(
            (category, index) => {
              const width =
                (category.amount /
                  maxCategoryAmount) *
                100;

              return (
                <div
                  key={category.name}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {category.percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-slate-900">
                      {formatCurrency(category.amount)}
                    </p>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? "bg-emerald-500"
                          : index === 1
                            ? "bg-emerald-400"
                            : "bg-emerald-300"
                      }`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      {/* Products */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-sm font-medium text-slate-500">
              Purchase behavior
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Top purchased products
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {productAnalysis.map(
              (product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {product.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {product.category} ·{" "}
                      {product.purchases} purchase records
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {formatCurrency(product.amount)}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Smart insight */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Spending insight
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {highestCategory?.name ?? "Your top category"} is
            your biggest spending area.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            It represents{" "}
            <strong>
              {highestCategory?.percentage.toFixed(1) ?? 0}%
            </strong>{" "}
            of your currently recorded grocery spending.
          </p>

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400">
              Most visited store
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {summary.mostVisitedStore?.name ?? "No purchases yet"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {summary.mostVisitedStore
                ? `${summary.mostVisitedStore.visits} recorded trips`
                : "Record a purchase to see this"}
            </p>
          </div>

          <Link
            to="/analytics/prices"
            className="mt-6 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Check product price trends →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default SpendingAnalysisPage;
