import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  groceryProducts,
  storesData,
} from "../../data/mockData";

import {
  purchaseSchema,
  type PurchaseFormData,
} from "../../schemas/purchaseSchema";

interface PurchaseFormProps {
  mode: "create" | "edit";
  defaultValues?: PurchaseFormData;
}

const emptyItem = {
  productId: "",
  productName: "",
  quantity: 1,
  unitPrice: 0,
};

function PurchaseForm({
  mode,
  defaultValues,
}: PurchaseFormProps) {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues:
      defaultValues ?? {
        store: "",
        purchaseDate: new Date()
          .toISOString()
          .split("T")[0],
        notes: "",
        items: [emptyItem],
      },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleProductChange = (
    index: number,
    productId: string,
  ) => {
    const product = groceryProducts.find(
      (item) => item.id === productId,
    );

    if (!product) {
      return;
    }

    setValue(
      `items.${index}.productId`,
      product.id,
    );

    setValue(
      `items.${index}.productName`,
      product.name,
    );

    setValue(
      `items.${index}.unitPrice`,
      product.estimatedPrice,
    );
  };

  const submitHandler = (
    data: PurchaseFormData,
  ) => {
    console.log(
      mode === "create"
        ? "Create purchase:"
        : "Update purchase:",
      data,
    );

    window.alert(
      mode === "create"
        ? "Purchase recorded successfully."
        : "Purchase updated successfully.",
    );

    navigate("/purchases");
  };

  const totalAmount = watchedItems.reduce(
    (total, item) => {
      const quantity = Number(item?.quantity ?? 0);
      const unitPrice = Number(item?.unitPrice ?? 0);

      return total + quantity * unitPrice;
    },
    0,
  );

  const totalItems = watchedItems.reduce(
    (total, item) =>
      total + Number(item?.quantity ?? 0),
    0,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
    >
      {/* Purchase details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Purchase information
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Basic details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter where and when the grocery purchase was made.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Store */}
          <div>
            <label
              htmlFor="store"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Store
            </label>

            <select
              id="store"
              {...register("store")}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.store
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            >
              <option value="">
                Select store
              </option>

              {storesData.map((store) => (
                <option
                  key={store}
                  value={store}
                >
                  {store}
                </option>
              ))}
            </select>

            {errors.store && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.store.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="purchaseDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Purchase Date
            </label>

            <input
              id="purchaseDate"
              type="date"
              {...register("purchaseDate")}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.purchaseDate
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            />

            {errors.purchaseDate && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.purchaseDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            placeholder="Optional notes about this grocery trip..."
            className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
              errors.notes
                ? "border-rose-300"
                : "border-slate-200"
            }`}
          />

          {errors.notes && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.notes.message}
            </p>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Grocery items
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Items purchased
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add all products included in this grocery purchase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => append(emptyItem)}
            className="inline-flex w-fit items-center rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            + Add Item
          </button>
        </div>

        {errors.items?.message && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {errors.items.message}
          </p>
        )}

        <div className="mt-6 space-y-4">
          {fields.map((field, index) => {
            const quantity =
              Number(watchedItems[index]?.quantity ?? 0);

            const unitPrice =
              Number(watchedItems[index]?.unitPrice ?? 0);

            const lineTotal =
              quantity * unitPrice;

            return (
              <div
                key={field.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-800">
                    Item {index + 1}
                  </p>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Product */}
                  <div className="lg:col-span-2">
                    <label
                      htmlFor={`product-${index}`}
                      className="mb-2 block text-xs font-semibold text-slate-600"
                    >
                      Product
                    </label>

                    <select
                      id={`product-${index}`}
                      {...register(
                        `items.${index}.productId`,
                        {
                          onChange: (
                            event,
                          ) =>
                            handleProductChange(
                              index,
                              event.target.value,
                            ),
                        },
                      )}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                        errors.items?.[index]
                          ?.productId
                          ? "border-rose-300"
                          : "border-slate-200"
                      }`}
                    >
                      <option value="">
                        Select product
                      </option>

                      {groceryProducts.map(
                        (product) => (
                          <option
                            key={product.id}
                            value={product.id}
                          >
                            {product.name} (
                            {product.unit})
                          </option>
                        ),
                      )}
                    </select>

                    {errors.items?.[index]
                      ?.productId && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">
                        {
                          errors.items[index]
                            ?.productId?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label
                      htmlFor={`quantity-${index}`}
                      className="mb-2 block text-xs font-semibold text-slate-600"
                    >
                      Quantity
                    </label>

                    <input
                      id={`quantity-${index}`}
                      type="number"
                      min="0.01"
                      step="0.01"
                      {...register(
                        `items.${index}.quantity`,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                        errors.items?.[index]
                          ?.quantity
                          ? "border-rose-300"
                          : "border-slate-200"
                      }`}
                    />

                    {errors.items?.[index]
                      ?.quantity && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">
                        {
                          errors.items[index]
                            ?.quantity?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* Unit Price */}
                  <div>
                    <label
                      htmlFor={`unitPrice-${index}`}
                      className="mb-2 block text-xs font-semibold text-slate-600"
                    >
                      Unit Price
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        ₱
                      </span>

                      <input
                        id={`unitPrice-${index}`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        {...register(
                          `items.${index}.unitPrice`,
                          {
                            valueAsNumber: true,
                          },
                        )}
                        className={`w-full rounded-xl border bg-white py-3 pl-8 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                          errors.items?.[
                            index
                          ]?.unitPrice
                            ? "border-rose-300"
                            : "border-slate-200"
                        }`}
                      />
                    </div>

                    {errors.items?.[index]
                      ?.unitPrice && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">
                        {
                          errors.items[index]
                            ?.unitPrice?.message
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3">
                  <span className="text-xs font-medium text-slate-400">
                    Item subtotal
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(lineTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Products
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {fields.length}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Total Units
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalItems}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Total Purchase
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-700">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/purchases")}
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
              ? "Record Purchase"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default PurchaseForm;
