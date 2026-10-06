import { useMemo, useState } from "react";
import { Link } from "react-router";

import ProductTable from "../../components/tables/ProductTable";
import {
  groceryProducts,
} from "../../data/mockData";

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("name");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(value);

  const categories = Array.from(
    new Set(
      groceryProducts.map(
        (product) => product.category,
      ),
    ),
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = groceryProducts.filter(
      (product) => {
        const matchesSearch =
          !query ||
          product.name
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          categoryFilter === "All" ||
          product.category === categoryFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      },
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "price-high") {
        return (
          b.estimatedPrice -
          a.estimatedPrice
        );
      }

      if (sortOrder === "price-low") {
        return (
          a.estimatedPrice -
          b.estimatedPrice
        );
      }

      return a.name.localeCompare(
        b.name,
      );
    });
  }, [
    search,
    categoryFilter,
    sortOrder,
  ]);

  const averagePrice =
    groceryProducts.length > 0
      ? groceryProducts.reduce(
          (total, product) =>
            total +
            product.estimatedPrice,
          0,
        ) / groceryProducts.length
      : 0;

  const highestPricedProduct =
    groceryProducts.reduce(
      (highest, product) =>
        product.estimatedPrice >
        highest.estimatedPrice
          ? product
          : highest,
      groceryProducts[0],
    );

  const lowestPricedProduct =
    groceryProducts.reduce(
      (lowest, product) =>
        product.estimatedPrice <
        lowest.estimatedPrice
          ? product
          : lowest,
      groceryProducts[0],
    );

  const handleDelete = (id: string) => {
    const product =
      groceryProducts.find(
        (item) => item.id === id,
      );

    if (!product) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${product.name}" from your products?`,
      );

    if (!confirmed) {
      return;
    }

    window.alert(
      "Product deleted successfully.",
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Product catalog
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Grocery Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the grocery items used across purchases,
            budgets, and spending analysis.
          </p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          + Add Product
        </Link>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {groceryProducts.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Available grocery items
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Categories
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {categories.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Product groups
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Average Price
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(
              averagePrice,
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across all products
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Price Range
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(
              lowestPricedProduct?.estimatedPrice ??
                0,
            )}
            {" – "}
            {formatCurrency(
              highestPricedProduct?.estimatedPrice ??
                0,
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Lowest to highest
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">
          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Search
            </label>

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search product or category..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Category
            </label>

            <select
              id="category-filter"
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

          <div>
            <label
              htmlFor="product-sort"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Sort
            </label>

            <select
              id="product-sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="name">
                Name A–Z
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="price-low">
                Price: Low to High
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            {groceryProducts.length}{" "}
            products
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
              className="w-fit text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Product list */}
      {filteredProducts.length >
      0 ? (
        <ProductTable
          products={
            filteredProducts
          }
          onDelete={
            handleDelete
          }
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
            ◉
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No products found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Try another search term or category filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
