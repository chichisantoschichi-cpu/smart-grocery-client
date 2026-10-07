import { Link, useParams } from "react-router";

import api from "../../api/axios";
import BudgetForm from "../../components/forms/BudgetForm";
import { LoadingState, NotFoundCard } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import type { BudgetFormData } from "../../schemas/budgetSchema";
import type { Budget } from "../../types";

function EditBudgetPage() {
  const { id } = useParams();
  const { data: budget, loading, error } = useApi<Budget>(`/budgets/${id}`);

  const updateBudget = async (data: BudgetFormData) => {
    await api.put(`/budgets/${id}`, data);
  };

  if (loading) {
    return <LoadingState message="Loading budget..." />;
  }

  if (error || !budget) {
    return (
      <NotFoundCard
        title="Budget Not Found"
        message={error ?? "The budget you are trying to edit does not exist."}
        backTo="/budgets"
        backLabel="Back to Budgets"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section>
        <Link
          to={`/budgets/${budget.id}`}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Budget
        </Link>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          Budget management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Edit Budget
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update the selected grocery budget.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <BudgetForm
          mode="edit"
          defaultValues={{
            month: budget.month,
            year: budget.year,
            amount: budget.amount,
          }}
          onSubmit={updateBudget}
        />
      </section>
    </div>
  );
}

export default EditBudgetPage;
