import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  categorySchema,
  type CategoryFormData,
} from "../../schemas/categorySchema";

interface CategoryFormProps {
  mode: "create" | "edit";
  defaultValues?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

function CategoryForm({
  mode,
  defaultValues,
  onSubmit,
}: CategoryFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (
    data: CategoryFormData,
  ) => {
    try {
      await onSubmit(data);
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to save category.",
      });
      return;
    }

    window.alert(
      mode === "create"
        ? "Category created successfully."
        : "Category updated successfully.",
    );

    navigate("/categories");
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Category information
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {mode === "create"
              ? "Create a new category"
              : "Update category information"}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Categories help organize products and make spending
            analysis easier to understand.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              {...register("name")}
              placeholder="e.g. Frozen Foods"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.name
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            />

            {errors.name && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="category-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="category-description"
              rows={5}
              {...register("description")}
              placeholder="Describe the type of grocery items that belong to this category."
              className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.description
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            />

            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Why categories matter
        </p>

        <h3 className="mt-2 text-lg font-bold text-slate-900">
          Better organization, better analysis
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Category data will later be used by the spending analytics
          to compare where your grocery budget is being spent.
        </p>
      </section>

      {errors.root && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errors.root.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Category"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
