import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  groceryProducts,
} from "../../data/mockData";

import {
  initialShoppingList,
  type ShoppingListItem,
} from "../../data/shoppingListData";

import {
  shoppingListItemSchema,
  type ShoppingListItemFormData,
} from "../../schemas/shoppingListSchema";

function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>(
    initialShoppingList,
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ShoppingListItemFormData>({
    resolver: zodResolver(
      shoppingListItemSchema,
    ),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

  const selectedProductId = watch("productId");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          items.map(
            (item) => item.category,
          ),
        ),
      ),
    [items],
  );

  const visibleItems = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.productName
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [items, search, categoryFilter]);

  const totalItems = items.length;

  const completedItems = items.filter(
    (item) => item.checked,
  ).length;

  const remainingItems =
    totalItems - completedItems;

  const completionPercentage =
    totalItems > 0
      ? (completedItems /
          totalItems) *
        100
      : 0;

  const estimatedTotal = items.reduce(
    (total, item) =>
      total +
      item.quantity *
        item.estimatedPrice,
    0,
  );

  const estimatedRemaining = items
    .filter((item) => !item.checked)
    .reduce(
      (total, item) =>
        total +
        item.quantity *
          item.estimatedPrice,
      0,
    );

  const formatCurrency = (
    value: number,
  ) =>
    new Intl.NumberFormat(
      "en-PH",
      {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
      },
    ).format(value);

  const toggleItem = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              checked:
                !item.checked,
            }
          : item,
      ),
    );
  };

  const updateQuantity = (
    id: string,
    change: number,
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const newQuantity = Math.max(
          item.quantity + change,
          1,
        );

        return {
          ...item,
          quantity:
            newQuantity,
        };
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) =>
      current.filter(
        (item) =>
          item.id !== id,
      ),
    );
  };

  const clearCompleted = () => {
    const completedCount =
      items.filter(
        (item) => item.checked,
      ).length;

    if (completedCount === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        `Remove ${completedCount} completed item(s) from your shopping list?`,
      );

    if (!confirmed) {
      return;
    }

    setItems((current) =>
      current.filter(
        (item) => !item.checked,
      ),
    );
  };

  const addItem = (
    data: ShoppingListItemFormData,
  ) => {
    const product =
      groceryProducts.find(
        (item) =>
          item.id ===
          data.productId,
      );

    if (!product) {
      return;
    }

    const existing =
      items.find(
        (item) =>
          item.productId ===
          product.id,
      );

    if (existing) {
      setItems((current) =>
        current.map((item) =>
          item.productId ===
          product.id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  data.quantity,
              }
            : item,
        ),
      );
    } else {
      setItems((current) => [
        ...current,
        {
          id: `list-${Date.now()}`,
          productId:
            product.id,
          productName:
            product.name,
          category:
            product.category,
          unit:
            product.unit,
          quantity:
            data.quantity,
          estimatedPrice:
            product.estimatedPrice,
          checked: false,
        },
      ]);
    }

    reset({
      productId: "",
      quantity: 1,
    });

    window.alert(
      `${product.name} added to your shopping list.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Grocery planning
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Shopping List
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Plan your next grocery trip and estimate how much
            your shopping list may cost.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCompleted}
          className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Clear Completed
        </button>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Items
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalItems}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Items on your list
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Remaining
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {remainingItems}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Still to buy
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {completedItems}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Already checked
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Estimated Total
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(
              estimatedTotal,
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Based on reference prices
          </p>
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Shopping progress
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {completedItems} of {totalItems} items completed
            </h2>
          </div>

          <p className="text-2xl font-bold text-emerald-700">
            {completionPercentage.toFixed(0)}%
          </p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500">
            Remaining estimated cost:
            {" "}
            <strong className="text-slate-900">
              {formatCurrency(
                estimatedRemaining,
              )}
            </strong>
          </span>

          <span className="text-emerald-700">
            {remainingItems === 0
              ? "Shopping list complete"
              : "Keep going"}
          </span>
        </div>
      </section>

      {/* Add Item */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Add to list
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Plan another grocery item
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(
            addItem,
          )}
          className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_auto]"
        >
          <div>
            <label
              htmlFor="shopping-product"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Product
            </label>

            <select
              id="shopping-product"
              {...register("productId")}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.productId
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            >
              <option value="">
                Select a product
              </option>

              {groceryProducts.map(
                (product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} � ?
                    {product.estimatedPrice}
                    /{product.unit}
                  </option>
                ),
              )}
            </select>

            {errors.productId && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="shopping-quantity"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Quantity
            </label>

            <input
              id="shopping-quantity"
              type="number"
              min="1"
              step="1"
              {...register(
                "quantity",
                {
                  valueAsNumber:
                    true,
                },
              )}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                errors.quantity
                  ? "border-rose-300"
                  : "border-slate-200"
              }`}
            />

            {errors.quantity && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 md:w-auto"
            >
              + Add Item
            </button>
          </div>
        </form>

        {selectedProductId && (
          <p className="mt-4 text-xs text-slate-400">
            Adding a product that is already on the list will
            increase its quantity instead of creating a duplicate.
          </p>
        )}
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label
              htmlFor="shopping-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Search
            </label>

            <input
              id="shopping-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search your shopping list..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="shopping-category"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Category
            </label>

            <select
              id="shopping-category"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="All">
                All categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </section>

      {/* Shopping items */}
      {visibleItems.length > 0 ? (
        <section className="space-y-3">
          {visibleItems.map(
            (item) => {
              const itemTotal =
                item.quantity *
                item.estimatedPrice;

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
                    item.checked
                      ? "border-emerald-100 bg-emerald-50/30"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleItem(
                          item.id,
                        )
                      }
                      aria-label={
                        item.checked
                          ? `Mark ${item.productName} as incomplete`
                          : `Mark ${item.productName} as complete`
                      }
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                        item.checked
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white text-transparent hover:border-emerald-400"
                      }`}
                    >
                      ?
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3
                            className={`truncate text-base font-bold ${
                              item.checked
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {item.productName}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                              {item.category}
                            </span>

                            <span className="text-xs text-slate-400">
                              {item.unit}
                            </span>
                          </div>
                        </div>

                        <p
                          className={`text-base font-bold ${
                            item.checked
                              ? "text-slate-400"
                              : "text-slate-900"
                          }`}
                        >
                          {formatCurrency(
                            itemTotal,
                          )}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  -1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50"
                            >
                              -
                            </button>

                            <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs text-slate-400">
                            @{" "}
                            {formatCurrency(
                              item.estimatedPrice,
                            )}{" "}
                            / {item.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.id,
                            )
                          }
                          className="w-fit text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
            ?
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No shopping items found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Try another search or category, or add a new grocery
            item to your list.
          </p>

          {(search ||
            categoryFilter !==
              "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter(
                  "All",
                );
              }}
              className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Clear Filters
            </button>
          )}
        </section>
      )}
    </div>
  );
}

export default ShoppingListPage;

