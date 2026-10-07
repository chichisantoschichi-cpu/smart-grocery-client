import { Link } from "react-router";

import api from "../../api/axios";
import CategoryForm from "../../components/forms/CategoryForm";
import type { CategoryFormData } from "../../schemas/categorySchema";

function CreateCategoryPage() {
  const createCategory = async (data: CategoryFormData) => {
    await api.post("/categories", data);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section>
        <Link
          to="/categories"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Categories
        </Link>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          Category setup
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Add Category
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Create a category for organizing grocery products.
        </p>
      </section>

      <CategoryForm mode="create" onSubmit={createCategory} />
    </div>
  );
}

export default CreateCategoryPage;
