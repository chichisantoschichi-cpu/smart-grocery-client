interface BudgetProgressProps {
  budget: number;
  spent: number;
}

function BudgetProgress({ budget, spent }: BudgetProgressProps) {
  const remaining = Math.max(budget - spent, 0);
  const usage = budget > 0 ? (spent / budget) * 100 : 0;
  const safeUsage = Math.min(usage, 100);

  let status = "On Track";
  let statusClass = "bg-emerald-50 text-emerald-700";

  // Same thresholds as the API: over 100% = over budget, 80% and up = near limit
  if (usage > 100) {
    status = "Over Budget";
    statusClass = "bg-rose-50 text-rose-700";
  } else if (usage >= 80) {
    status = "Near Limit";
    statusClass = "bg-amber-50 text-amber-700";
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Budget progress</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Monthly grocery budget
          </h3>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {formatCurrency(spent)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              of {formatCurrency(budget)} used
            </p>
          </div>

          <p className="text-right text-sm font-semibold text-slate-700">
            {usage.toFixed(1)}%
          </p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              usage >= 100
                ? "bg-rose-500"
                : usage >= 90
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${safeUsage}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500">
            Remaining:{" "}
            <strong className="text-slate-900">
              {formatCurrency(remaining)}
            </strong>
          </span>

          <span className="text-slate-400">
            Budget period: current month
          </span>
        </div>
      </div>
    </section>
  );
}

export default BudgetProgress;
