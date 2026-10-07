import { Link } from "react-router";

import { ErrorState, LoadingState } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import { usePurchases } from "../../hooks/usePurchases";
import type { MonthlySpendingReport, Purchase } from "../../types";

// Splits a month's purchases into Week 1 (days 1-7) ... Week 5 (days 29-31)
const weeklyTotals = (purchases: Purchase[], year: number, monthIndex: number) => {
  const totals = [0, 0, 0, 0, 0];
  for (const purchase of purchases) {
    const date = new Date(purchase.purchaseDate);
    if (date.getFullYear() === year && date.getMonth() === monthIndex) {
      totals[Math.floor((date.getDate() - 1) / 7)] += purchase.totalAmount;
    }
  }
  return totals;
};

function AnalyticsPage() {
  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth();

  const reportQuery = useApi<MonthlySpendingReport>(`/analytics/monthly-spending?year=${year}`);
  const purchasesQuery = usePurchases();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  if (reportQuery.loading || purchasesQuery.loading) {
    return <LoadingState message="Loading analytics..." />;
  }

  if (reportQuery.error || purchasesQuery.error || !reportQuery.data) {
    return (
      <ErrorState
        message={reportQuery.error ?? purchasesQuery.error ?? "No analytics data."}
        onRetry={() => {
          reportQuery.refetch();
          purchasesQuery.refetch();
        }}
      />
    );
  }

  const report = reportQuery.data;

  // Months up to the current one that have spending or a budget
  const monthlySpendingData = report.months
    .slice(0, monthIndex + 1)
    .filter((item) => item.spent > 0 || item.budget !== null)
    .map((item) => ({
      month: item.month,
      spending: item.spent,
      budget: item.budget,
    }));

  const totalSpending = report.total;
  const averageMonthlySpending = report.monthlyAverage;

  const current = report.months[monthIndex];
  const currentMonth = { month: current.month, spending: current.spent };
  const currentBudget = current.budget ?? 0;

  const currentUsage =
    currentBudget > 0
      ? (currentMonth.spending / currentBudget) * 100
      : 0;

  const daysPassed = now.getDate();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const averageDailySpending =
    currentMonth.spending / daysPassed;

  const projectedMonthlySpending =
    averageDailySpending * daysInMonth;

  const projectionDifference =
    currentBudget > 0 ? projectedMonthlySpending - currentBudget : 0;

  const previous = monthIndex > 0 ? report.months[monthIndex - 1] : null;

  const monthlyChange =
    previous && previous.spent > 0
      ? ((currentMonth.spending - previous.spent) /
          previous.spent) *
        100
      : 0;

  const highestSpendingMonth =
    monthlySpendingData.find((item) => item.month === report.highestMonth) ??
    monthlySpendingData[0];

  const maxSpending = Math.max(
    ...monthlySpendingData.map((item) => item.spending),
    1,
  );

  const rangeLabel =
    monthlySpendingData.length > 0
      ? `${monthlySpendingData[0].month} – ${monthlySpendingData[monthlySpendingData.length - 1].month} ${year}`
      : `${year}`;

  const thisMonthWeeks = weeklyTotals(purchasesQuery.purchases, year, monthIndex);
  const previousMonthDate = new Date(year, monthIndex - 1, 1);
  const previousMonthWeeks = weeklyTotals(
    purchasesQuery.purchases,
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth(),
  );
  const weeklyComparisonData = thisMonthWeeks
    .map((amount, index) => ({
      week: `Week ${index + 1}`,
      current: amount,
      previous: previousMonthWeeks[index],
    }))
    // Week 5 only shows up when either month actually has days 29+ spending
    .filter((item, index) => index < 4 || item.current > 0 || item.previous > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Financial intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Grocery Analytics
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Turn your grocery purchase history into clear numbers,
            trends, and spending insights.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/analytics/spending"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Spending Analysis
          </Link>

          <Link
            to="/analytics/prices"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Price Trends
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Recorded Spending
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalSpending)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {monthlySpendingData.length} month(s) in {year}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Average Monthly
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(averageMonthlySpending)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Average grocery spending
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Current Budget Usage
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {currentUsage.toFixed(1)}%
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {currentBudget > 0 ? `${currentMonth.month} ${year}` : `No budget for ${currentMonth.month}`}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Projected Spending
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(projectedMonthlySpending)}
          </p>

          <p
            className={`mt-1 text-xs font-semibold ${
              projectionDifference > 0
                ? "text-rose-600"
                : "text-emerald-600"
            }`}
          >
            {projectionDifference > 0
              ? `${formatCurrency(
                  projectionDifference,
                )} over budget`
              : "Within budget projection"}
          </p>
        </div>
      </section>

      {/* Main Analytics */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        {/* Monthly trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Spending history
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Monthly spending trend
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {rangeLabel}
            </span>
          </div>

          <div className="mt-8 space-y-5">
            {monthlySpendingData.map((item) => {
              const width =
                (item.spending / maxSpending) * 100;

              const isCurrent =
                item.month === currentMonth.month;

              return (
                <div key={item.month}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? "text-emerald-700"
                          : "text-slate-600"
                      }`}
                    >
                      {item.month}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="hidden text-xs text-slate-400 sm:inline">
                        {item.budget !== null ? `Budget ${formatCurrency(item.budget)}` : "No budget"}
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.spending)}
                      </span>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.budget !== null && item.spending > item.budget
                          ? "bg-rose-500"
                          : isCurrent
                            ? "bg-emerald-500"
                            : "bg-emerald-300"
                      }`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highest month */}
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
            Spending highlight
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Highest spending month
          </h2>

          <p className="mt-3 text-4xl font-bold tracking-tight">
            {formatCurrency(
              highestSpendingMonth?.spending ?? 0,
            )}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {highestSpendingMonth ? `${highestSpendingMonth.month} ${year}` : "No spending yet"}
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Comparison with budget
            </p>

            <p className="mt-1 text-lg font-bold">
              {!highestSpendingMonth || highestSpendingMonth.budget === null
                ? "No budget set for this month"
                : highestSpendingMonth.spending >
              highestSpendingMonth.budget
                ? `${formatCurrency(
                    highestSpendingMonth.spending -
                      highestSpendingMonth.budget,
                  )} over budget`
                : `${formatCurrency(
                    highestSpendingMonth.budget -
                      highestSpendingMonth.spending,
                  )} remaining`}
            </p>
          </div>

          <div className="mt-8">
            <Link
              to="/analytics/spending"
              className="inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Explore spending →
            </Link>
          </div>
        </div>
      </section>

      {/* Current Budget Performance */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Current month
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Budget performance
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-600">
            {formatCurrency(currentMonth.spending)} /{" "}
            {currentBudget > 0 ? formatCurrency(currentBudget) : "No budget"}
          </p>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              currentUsage > 100
                ? "bg-rose-500"
                : currentUsage >= 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{
              width: `${Math.min(currentUsage, 100)}%`,
            }}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">
              Used
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {currentUsage.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Daily average
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {formatCurrency(averageDailySpending)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Change vs last month
            </p>

            <p
              className={`mt-1 text-sm font-bold ${
                monthlyChange > 0
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {monthlyChange >= 0 ? "+" : ""}
              {monthlyChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      {/* Weekly comparison */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Weekly comparison
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Current vs previous period
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weeklyComparisonData.map((item) => {
            const change =
              item.previous > 0
                ? ((item.current - item.previous) /
                    item.previous) *
                  100
                : 0;

            return (
              <div
                key={item.week}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.week}
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatCurrency(item.current)}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Previous:{" "}
                  {formatCurrency(item.previous)}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    change > 0
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default AnalyticsPage;
