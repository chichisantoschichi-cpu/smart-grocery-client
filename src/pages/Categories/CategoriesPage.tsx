import { useMemo, useState } from "react";
import { Link } from "react-router";

import CategoryTable from "../../components/tables/CategoryTable";
import { useCategories } from "../../hooks/useCategories";

function CategoriesPage() {
  const { categories, loading, error, refetch, deleteCategory } = useCategories();

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const categoriesWithStats = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        description: category.description ?? "",
        productCount: category.productCount ?? 0,
        spending: category.totalSpending ?? 0,
      })),
    [categories],
  );

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = categoriesWithStats.filter(
      (category) =>
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query),
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "products-high") {
        return b.productCount - a.productCount;
      }
      if (sortOrder === "spending-high") {
        return b.spending - a.spending;
      }
      return a.name.localeCompare(b.name);
    });
  }, [categoriesWithStats, search, sortOrder]);

  const totalProducts = categoriesWithStats.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  const totalSpending = categoriesWithStats.reduce(
    (sum, category) => sum + category.spending,
    0,
  );

  const categoriesWithProducts = categoriesWithStats.filter(
    (category) => category.productCount > 0,
  ).length;

  const highestSpendingCategory = categoriesWithStats.reduce(
    (highest, category) =>
      category.spending > highest.spending ? category : highest,
    categoriesWithStats[0],
  );

  const handleDelete = async (id: string) => {
    const category = categoriesWithStats.find((item) => item.id === id);
    if (!category) return;

    if (category.productCount > 0) {
      window.alert(
        `Cannot delete "${category.name}" because ${category.productCount} product(s) are still using this category.`,
      );
      return;
    }

    if (!window.confirm(`Delete "${category.name}"?`)) return;

    try {
      await deleteCategory(id);
      window.alert("Category deleted successfully.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete category.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h2 className="text-lg font-bold text-rose-900">Could not load categories</h2>
        <p className="mt-2 text-sm text-rose-700">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Product organization
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Grocery Categories
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Organize your grocery products into categories and
            understand which groups contribute most to your
            spending.
          </p>
        </div>

        <Link
          to="/categories/new"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          + Add Category
        </Link>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Categories
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {categories.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Available product groups
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Linked Products
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {totalProducts}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Products across the catalog
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Categories
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {categoriesWithProducts}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Categories currently in use
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Highest Spending
          </p>

          <p className="mt-2 truncate text-2xl font-bold text-slate-900">
            {highestSpendingCategory?.name ?? "No data"}
          </p>

          <p className="mt-1 text-xs text-emerald-600">
            {formatCurrency(highestSpendingCategory?.spending ?? 0)}{" "}
            recorded
          </p>
        </div>
      </section>

      {/* Analytics highlight */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Category spending
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalSpending)}
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Total recorded spending currently associated
                with your grocery categories.
              </p>
            </div>

            <Link
              to="/analytics/spending"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View analysis →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-slate-500">
            Highest spending category
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {highestSpendingCategory?.name ?? "No data"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {formatCurrency(highestSpendingCategory?.spending ?? 0)}{" "}
            in recorded purchases.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <label
              htmlFor="category-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Search
            </label>

            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search category..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="category-sort"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Sort
            </label>

            <select
              id="category-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="name">Name A–Z</option>
              <option value="products-high">Most Products</option>
              <option value="spending-high">Highest Spending</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredCategories.length}
            </strong>{" "}
            of {categories.length} categories
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="w-fit text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* Table */}
      {filteredCategories.length > 0 ? (
        <CategoryTable
          categories={filteredCategories}
          onDelete={handleDelete}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
            #
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No categories found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Try another search term.
          </p>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;