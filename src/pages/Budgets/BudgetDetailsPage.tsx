import { Link, useParams } from "react-router";

import { budgetsData } from "../../data/mockData";

function BudgetDetailsPage() {
  const { id } = useParams();

  const budget = budgetsData.find(
    (item) => item.id === id,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  if (!budget) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-semibold text-rose-600">
          404
        </p>

        <h1 className="mt-1 text-2xl font-bold text-rose-900">
          Budget Not Found
        </h1>

        <p className="mt-2 text-sm text-rose-700">
          No budget record matches this ID.
        </p>

        <Link
          to="/budgets"
          className="mt-6 inline-flex rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Budgets
        </Link>
      </div>
    );
  }

  // Derived values
  const remaining = Math.max(
    budget.amount - budget.spent,
    0,
  );

  const usage =
    budget.amount > 0
      ? (budget.spent / budget.amount) * 100
      : 0;

  let status = "On Track";
  let statusClass = "bg-emerald-50 text-emerald-700";

  if (usage >= 100) {
    status = "Over Budget";
    statusClass = "bg-rose-50 text-rose-700";
  } else if (usage >= 90) {
    status = "Near Limit";
    statusClass = "bg-amber-50 text-amber-700";
  } else if (usage >= 70) {
    status = "Watch Spending";
    statusClass = "bg-yellow-50 text-yellow-700";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/budgets"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Budgets
          </Link>

          <p className="mt-6 text-sm font-semibold text-emerald-600">
            Budget details
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {budget.month} {budget.year}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monthly grocery spending budget
          </p>
        </div>

        <Link
          to={`/budgets/${budget.id}/edit`}
          className="inline-flex w-fit rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Edit Budget
        </Link>
      </section>

      {/* Main summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Budget</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(budget.amount)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Spent</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(budget.spent)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Remaining</p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(remaining)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Status</p>

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass}`}
          >
            {status}
          </span>
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Budget Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {formatCurrency(budget.spent)} of{" "}
              {formatCurrency(budget.amount)} has been used.
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-900">
            {usage.toFixed(1)}%
          </p>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              usage >= 100
                ? "bg-rose-500"
                : usage >= 90
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{
              width: `${Math.min(usage, 100)}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500">
            Used:{" "}
            <strong className="text-slate-900">
              {formatCurrency(budget.spent)}
            </strong>
          </span>

          <span className="text-slate-500">
            Remaining:{" "}
            <strong className="text-emerald-600">
              {formatCurrency(remaining)}
            </strong>
          </span>
        </div>
      </section>

      {/* Insight */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 ${
          usage > 90
            ? "border-amber-200 bg-amber-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Smart insight
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {usage > 90
            ? "You're getting close to your budget limit."
            : "Your spending is currently within a manageable range."}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {usage > 90
            ? `You have ${formatCurrency(
                remaining,
              )} remaining in this budget period.`
            : `You still have ${formatCurrency(
                remaining,
              )} available for the rest of this budget period.`}
        </p>
      </section>
    </div>
  );
}

export default BudgetDetailsPage;
