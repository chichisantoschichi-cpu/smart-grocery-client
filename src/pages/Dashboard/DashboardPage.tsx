import { Link } from "react-router";

import CategoryChart from "../../components/dashboard/CategoryChart";
import InsightCard from "../../components/dashboard/InsightCard";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import SpendingChart from "../../components/dashboard/SpendingChart";
import SummaryCard from "../../components/dashboard/SummaryCard";

import { dashboardData } from "../../data/mockData";

function DashboardPage() {
  const { budget, spending, categories, weeklySpending, topProducts } =
    dashboardData;

  // Derived values — computed during render.
  const remainingBudget = Math.max(budget.amount - spending.total, 0);
  const budgetUsage =
    budget.amount > 0 ? (spending.total / budget.amount) * 100 : 0;

  const spendingChange =
    spending.previousMonth > 0
      ? ((spending.total - spending.previousMonth) /
          spending.previousMonth) *
        100
      : 0;

  const averageWeeklySpending =
    weeklySpending.length > 0
      ? weeklySpending.reduce((total, item) => total + item.amount, 0) /
        weeklySpending.length
      : 0;

  const daysPassed = 18;
  const averageDailySpending = spending.total / daysPassed;
  const projectedMonthlySpending = averageDailySpending * 30;
  const projectedOverBudget = Math.max(
    projectedMonthlySpending - budget.amount,
    0,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const highestCategory = categories.reduce(
    (highest, category) =>
      category.amount > highest.amount ? category : highest,
    categories[0],
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Good afternoon
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your grocery overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Keep an eye on your budget, understand your spending habits,
            and make smarter grocery decisions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/purchases/new"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Add Purchase
          </Link>

          <Link
            to="/budgets/new"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Set Budget
          </Link>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Monthly Budget"
          value={formatCurrency(budget.amount)}
          helper={budget.month}
          icon="budget"
        />

        <SummaryCard
          label="Total Spent"
          value={formatCurrency(spending.total)}
          helper="Recorded grocery spending"
          icon="spent"
          trend={`${Math.abs(spendingChange).toFixed(1)}% ${
            spendingChange >= 0 ? "higher" : "lower"
          }`}
          trendPositive={spendingChange < 0}
        />

        <SummaryCard
          label="Remaining"
          value={formatCurrency(remainingBudget)}
          helper={`${budgetUsage.toFixed(1)}% of budget used`}
          icon="remaining"
        />

        <SummaryCard
          label="Budget Usage"
          value={`${budgetUsage.toFixed(1)}%`}
          helper="Current month"
          icon="usage"
        />
      </section>

      {/* Budget + Insights */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <BudgetProgress
          budget={budget.amount}
          spent={spending.total}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Smart insights
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              What your numbers say
            </h3>
          </div>

          <div className="mt-5 space-y-3">
            {projectedOverBudget > 0 ? (
              <InsightCard
                type="warning"
                title="Budget alert"
                description={`At the current pace, you could exceed your monthly budget by ${formatCurrency(
                  projectedOverBudget,
                )}.`}
              />
            ) : (
              <InsightCard
                type="success"
                title="Budget is on track"
                description="Your current spending pace suggests that you can stay within your monthly grocery budget."
              />
            )}

            <InsightCard
              type="info"
              title={`Highest spending: ${highestCategory.name}`}
              description={`${highestCategory.name} accounts for ${highestCategory.percentage}% of your recorded grocery spending.`}
            />

            <InsightCard
              type={spendingChange > 0 ? "warning" : "success"}
              title={
                spendingChange > 0
                  ? "Spending increased"
                  : "Spending decreased"
              }
              description={`Your spending is ${Math.abs(spendingChange).toFixed(
                1,
              )}% ${
                spendingChange > 0 ? "higher" : "lower"
              } than the previous month.`}
            />
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SpendingChart data={weeklySpending} />
        <CategoryChart data={categories} />
      </section>

      {/* Bottom section */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
        {/* Top products */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Purchase behavior
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">
                Top products
              </h3>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {product.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {product.category} · {product.purchases} purchases
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-slate-900">
                  {formatCurrency(product.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Spending pace
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Average weekly spending
          </h3>

          <div className="mt-7">
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              {formatCurrency(averageWeeklySpending)}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Based on the current month's recorded purchases.
            </p>
          </div>

          <div className="mt-7 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Projected monthly spending
              </span>

              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(projectedMonthlySpending)}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${
                  projectedMonthlySpending > budget.amount
                    ? "bg-rose-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(
                    (projectedMonthlySpending / budget.amount) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Budget: {formatCurrency(budget.amount)}
              </span>

              <span
                className={
                  projectedMonthlySpending > budget.amount
                    ? "font-semibold text-rose-600"
                    : "font-semibold text-emerald-600"
                }
              >
                {projectedMonthlySpending > budget.amount
                  ? "Projected over budget"
                  : "Projected within budget"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
