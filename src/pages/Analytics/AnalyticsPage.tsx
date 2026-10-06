import { Link } from "react-router";

import { dashboardData } from "../../data/mockData";
import {
  monthlySpendingData,
  weeklyComparisonData,
} from "../../data/analyticsData";

function AnalyticsPage() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const totalSpending = monthlySpendingData.reduce(
    (total, item) => total + item.spending,
    0,
  );

  const averageMonthlySpending =
    monthlySpendingData.length > 0
      ? totalSpending / monthlySpendingData.length
      : 0;

  const currentMonth =
    monthlySpendingData[monthlySpendingData.length - 1];

  const currentBudget = dashboardData.budget.amount;

  const currentUsage =
    currentBudget > 0
      ? (currentMonth.spending / currentBudget) * 100
      : 0;

  const daysPassed = 18;
  const averageDailySpending =
    currentMonth.spending / daysPassed;

  const projectedMonthlySpending =
    averageDailySpending * 30;

  const projectionDifference =
    projectedMonthlySpending - currentBudget;

  const previousMonth =
    monthlySpendingData[monthlySpendingData.length - 2];

  const monthlyChange =
    previousMonth && previousMonth.spending > 0
      ? ((currentMonth.spending - previousMonth.spending) /
          previousMonth.spending) *
        100
      : 0;

  const highestSpendingMonth =
    monthlySpendingData.reduce(
      (highest, item) =>
        item.spending > highest.spending ? item : highest,
      monthlySpendingData[0],
    );

  const maxSpending = Math.max(
    ...monthlySpendingData.map((item) => item.spending),
    1,
  );

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
            Last 6 recorded months
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
            October 2026
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
              May – October 2026
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
                        Budget {formatCurrency(item.budget)}
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.spending)}
                      </span>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.spending > item.budget
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
              highestSpendingMonth.spending,
            )}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {highestSpendingMonth.month} 2026
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Comparison with budget
            </p>

            <p className="mt-1 text-lg font-bold">
              {highestSpendingMonth.spending >
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
            {formatCurrency(currentBudget)}
          </p>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              currentUsage >= 100
                ? "bg-rose-500"
                : currentUsage >= 90
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
              Month-to-date change
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
