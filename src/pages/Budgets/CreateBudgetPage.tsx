import { Link } from "react-router";

import api from "../../api/axios";
import BudgetForm from "../../components/forms/BudgetForm";
import type { BudgetFormData } from "../../schemas/budgetSchema";

function CreateBudgetPage() {
  const createBudget = async (data: BudgetFormData) => {
    await api.post("/budgets", data);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section>
        <Link
          to="/budgets"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Budgets
        </Link>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          Budget setup
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Create Budget
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Set a spending limit for a specific grocery budget
          period.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <BudgetForm mode="create" onSubmit={createBudget} />
      </section>
    </div>
  );
}

export default CreateBudgetPage;
