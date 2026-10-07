import { Link, useParams } from "react-router";

import api from "../../api/axios";
import CategoryForm from "../../components/forms/CategoryForm";
import { LoadingState, NotFoundCard } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import type { CategoryFormData } from "../../schemas/categorySchema";
import type { Category } from "../../types";

function EditCategoryPage() {
  const { id } = useParams();
  const { data: category, loading, error } = useApi<Category>(`/categories/${id}`);

  const updateCategory = async (data: CategoryFormData) => {
    await api.put(`/categories/${id}`, data);
  };

  if (loading) {
    return <LoadingState message="Loading category..." />;
  }

  if (error || !category) {
    return (
      <NotFoundCard
        title="Category Not Found"
        message={error ?? "The category you are trying to edit does not exist."}
        backTo="/categories"
        backLabel="Back to Categories"
      />
    );
  }

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
          Category management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Edit Category
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update the information for {category.name}.
        </p>
      </section>

      <CategoryForm
        mode="edit"
        defaultValues={{
          name: category.name,
          description: category.description ?? "",
        }}
        onSubmit={updateCategory}
      />
    </div>
  );
}

export default EditCategoryPage;
