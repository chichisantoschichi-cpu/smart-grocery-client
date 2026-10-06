import { Link, useParams } from "react-router";

import CategoryForm from "../../components/forms/CategoryForm";
import { categoriesData } from "../../data/categoryData";

function EditCategoryPage() {
  const { id } = useParams();

  const category = categoriesData.find(
    (item) => item.id === id,
  );

  if (!category) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-semibold text-rose-600">
          404
        </p>

        <h1 className="mt-1 text-2xl font-bold text-rose-900">
          Category Not Found
        </h1>

        <p className="mt-2 text-sm leading-6 text-rose-700">
          The category you are trying to edit does not exist.
        </p>

        <Link
          to="/categories"
          className="mt-6 inline-flex rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Categories
        </Link>
      </div>
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
          description:
            category.description,
        }}
      />
    </div>
  );
}

export default EditCategoryPage;
