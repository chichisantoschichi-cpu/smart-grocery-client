import { useMemo, useState } from "react";
import { Link } from "react-router";

import BudgetTable from "../../components/tables/BudgetTable";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui";
import { useBudgets } from "../../hooks/useBudgets";

function BudgetsPage() {
  const { budgets, loading, error, refetch, deleteBudget } = useBudgets();
  const [search, setSearch] = useState("");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const filteredBudgets = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return budgets;
    }

    return budgets.filter((budget) =>
      `${budget.month} ${budget.year}`
        .toLowerCase()
        .includes(query),
    );
  }, [budgets, search]);

  const totalBudget = budgets.reduce(
    (total, budget) => total + budget.amount,
    0,
  );

  const totalSpent = budgets.reduce(
    (total, budget) => total + budget.spent,
    0,
  );

  const totalRemaining = Math.max(
    totalBudget - totalSpent,
    0,
  );

  const averageUsage =
    totalBudget > 0
      ? (totalSpent / totalBudget) * 100
      : 0;

  const handleDelete = async (id: string) => {
    const budget = budgets.find((item) => item.id === id);
    if (!budget) return;

    if (!window.confirm(`Delete the ${budget.month} ${budget.year} budget?`)) return;

    try {
      await deleteBudget(id);
      window.alert("Budget deleted successfully.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete budget.");
    }
  };

  if (loading) {
    return <LoadingState message="Loading budgets..." variant="table" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Budget management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Grocery Budgets
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Set spending limits, monitor your progress, and keep
            your grocery expenses under control.
          </p>
        </div>

        <Link
          to="/budgets/new"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          + Create Budget
        </Link>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Budget
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalBudget)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across recorded budgets
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Spent
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalSpent)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Recorded spending
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Remaining
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalRemaining)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Available budget
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Average Usage
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {averageUsage.toFixed(1)}%
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across all budgets
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Budget History
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Search your recorded budget periods.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search month or year..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      </section>

      {/* Table */}
      {filteredBudgets.length > 0 ? (
        <BudgetTable
          budgets={filteredBudgets}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          title={budgets.length === 0 ? "No budgets yet" : "No budgets match your search"}
          description={
            budgets.length === 0
              ? "Create a grocery budget to start tracking spending and your remaining balance."
              : "Try another month or year, or clear your search."
          }
          action={
            budgets.length === 0 ? (
              <Link
                to="/budgets/new"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Create first budget
              </Link>
            ) : search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Clear search
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

export default BudgetsPage;
