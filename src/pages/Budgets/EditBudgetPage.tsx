import { Link, useParams } from "react-router";

import BudgetForm from "../../components/forms/BudgetForm";
import { budgetsData } from "../../data/mockData";

function EditBudgetPage() {
  const { id } = useParams();

  const budget = budgetsData.find(
    (item) => item.id === id,
  );

  if (!budget) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-rose-900">
          Budget Not Found
        </h1>

        <p className="mt-2 text-sm text-rose-700">
          The budget you are trying to edit does not exist.
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
        />
      </section>
    </div>
  );
}

export default EditBudgetPage;
