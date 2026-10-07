import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { useCategories } from "../../hooks/useCategories";

import {
  productSchema,
  type ProductFormData,
} from "../../schemas/productSchema";

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

const units = [
  "kg",
  "g",
  "liter",
  "ml",
  "dozen",
  "pack",
  "piece",
  "bottle",
  "can",
  "box",
];

function ProductForm({
  mode,
  defaultValues,
  onSubmit,
}: ProductFormProps) {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      name: "",
      categoryId: "",
      unit: "",
      price: 0,
      stock: 0,
      minStock: 1,
    },
  });

  // Re-apply values once the category options exist so the select shows the saved category
  useEffect(() => {
    if (defaultValues && !categoriesLoading) {
      reset(defaultValues);
    }
  }, [defaultValues, categoriesLoading, reset]);

  const submitHandler = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to save product.",
      });
      return;
    }

    window.alert(
      mode === "create"
        ? "Product created successfully."
        : "Product updated successfully.",
    );

    navigate("/products");
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Product information
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {mode === "create"
              ? "Add grocery product"
              : "Update grocery product"}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Keep product details consistent so they can be used
            accurately in spending analysis.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Product name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Product Name
            </label>

            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="e.g. Jasmine Rice"
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

          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Category
            </label>

            <select
              id="categoryId"
              {...register("categoryId")}
              disabled={categoriesLoading}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.categoryId
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            >
              <option value="">
                {categoriesLoading ? "Loading categories..." : "Select category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label
              htmlFor="unit"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Unit
            </label>

            <select
              id="unit"
              {...register("unit")}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.unit
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            >
              <option value="">
                Select unit
              </option>

              {units.map((unit) => (
                <option
                  key={unit}
                  value={unit}
                >
                  {unit}
                </option>
              ))}
            </select>

            {errors.unit && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.unit.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="sm:col-span-2">
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Current Price
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₱
              </span>

              <input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                {...register("price", {
                  valueAsNumber: true,
                })}
                placeholder="60"
                className={`w-full rounded-xl border bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                  errors.price
                    ? "border-rose-300"
                    : "border-slate-200"
                }`}
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-400">
              Used as the default price when adding this product to a purchase.
            </p>

            {errors.price && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Stock on Hand
            </label>

            <input
              id="stock"
              type="number"
              min="0"
              step="any"
              {...register("stock", {
                valueAsNumber: true,
              })}
              placeholder="0"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.stock
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            />

            <p className="mt-1.5 text-xs text-slate-400">
              How many you currently have at home.
            </p>

            {errors.stock && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="minStock"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Minimum Stock
            </label>

            <input
              id="minStock"
              type="number"
              min="0"
              step="any"
              {...register("minStock", {
                valueAsNumber: true,
              })}
              placeholder="1"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.minStock
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Shows up in low stock when stock falls to this level.
            </p>

            {errors.minStock && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.minStock.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Before saving
        </p>

        <h3 className="mt-2 text-lg font-bold text-slate-900">
          Product data
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Stock goes up automatically when this product is recorded in
          a purchase, and low-stock items appear in the shopping list.
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
          onClick={() => navigate("/products")}
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
              ? "Create Product"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
