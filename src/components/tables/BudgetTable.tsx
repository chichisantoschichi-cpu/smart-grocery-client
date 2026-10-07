import { Link } from "react-router";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

import type { Budget, BudgetHealth } from "../../types";

// Labels for the status computed by the API (under 80% / 80-100% / over 100%)
const STATUS_BADGES: Record<BudgetHealth, { label: string; className: string }> = {
  "on-track": { label: "On Track", className: "bg-emerald-50 text-emerald-700" },
  warning: { label: "Near Limit", className: "bg-amber-50 text-amber-700" },
  "over-budget": { label: "Over Budget", className: "bg-rose-50 text-rose-700" },
};

interface BudgetTableProps {
  budgets: Budget[];
  onDelete: (id: string) => void;
}

function BudgetTable({
  budgets,
  onDelete,
}: BudgetTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Budget Period
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Budget
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Spent
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Remaining
              </th>

              <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {budgets.map((budget) => {
              const remaining = Math.max(
                budget.amount - budget.spent,
                0,
              );

              const status = STATUS_BADGES[budget.status];

              return (
                <tr
                  key={budget.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <Link
                      to={`/budgets/${budget.id}`}
                      className="font-semibold text-slate-900 hover:text-emerald-600"
                    >
                      {budget.month} {budget.year}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(budget.amount)}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(budget.spent)}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(remaining)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <Badge className={status.className}>
                      {status.label}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/budgets/${budget.id}`}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        to={`/budgets/${budget.id}/edit`}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                      >
                        Edit
                      </Link>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(budget.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {budgets.map((budget) => {
          const remaining = Math.max(
            budget.amount - budget.spent,
            0,
          );

          const usage =
            budget.amount > 0
              ? (budget.spent / budget.amount) * 100
              : 0;

          const status = STATUS_BADGES[budget.status];

          return (
            <article
              key={budget.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/budgets/${budget.id}`}
                    className="font-bold text-slate-900"
                  >
                    {budget.month} {budget.year}
                  </Link>

                  <p className="mt-1 text-xs text-slate-400">
                    Monthly grocery budget
                  </p>
                </div>

                <Badge className={status.className}>
                  {status.label}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400">
                    Budget
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(budget.amount)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400">
                    Spent
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(budget.spent)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400">
                    Remaining
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    Budget usage
                  </span>

                  <span className="font-semibold text-slate-700">
                    {usage.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
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
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/budgets/${budget.id}`}
                  className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-600"
                >
                  View
                </Link>

                <Link
                  to={`/budgets/${budget.id}/edit`}
                  className="flex-1 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700"
                >
                  Edit
                </Link>

                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={() => onDelete(budget.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetTable;
