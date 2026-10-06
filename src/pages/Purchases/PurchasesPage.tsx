import { useMemo, useState } from "react";
import { Link } from "react-router";

import PurchaseTable from "../../components/tables/PurchaseTable";
import { purchasesData } from "../../data/mockData";

function PurchasesPage() {
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const stores = Array.from(
    new Set(purchasesData.map((purchase) => purchase.store)),
  );

  const filteredPurchases = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = purchasesData.filter(
      (purchase) => {
        const matchesSearch =
          !query ||
          purchase.store
            .toLowerCase()
            .includes(query) ||
          purchase.items.some((item) =>
            item.productName
              .toLowerCase()
              .includes(query),
          );

        const matchesStore =
          storeFilter === "All" ||
          purchase.store === storeFilter;

        return (
          matchesSearch && matchesStore
        );
      },
    );

    return [...filtered].sort((a, b) => {
      const dateA = new Date(
        a.purchaseDate,
      ).getTime();

      const dateB = new Date(
        b.purchaseDate,
      ).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [search, storeFilter, sortOrder]);

  const totalSpending = purchasesData.reduce(
    (total, purchase) =>
      total +
      purchase.items.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      ),
    0,
  );

  const totalPurchases = purchasesData.length;

  const totalUnits = purchasesData.reduce(
    (total, purchase) =>
      total +
      purchase.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
    0,
  );

  const averagePurchase =
    totalPurchases > 0
      ? totalSpending / totalPurchases
      : 0;

  const handleDelete = (id: string) => {
    const purchase = purchasesData.find(
      (item) => item.id === id,
    );

    if (!purchase) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the ${purchase.store} purchase from ${purchase.purchaseDate}?`,
    );

    if (!confirmed) {
      return;
    }

    window.alert(
      "Purchase deleted successfully.",
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Purchase management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Grocery Purchases
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Record grocery spending and review your purchase history.
          </p>
        </div>

        <Link
          to="/purchases/new"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          + Add Purchase
        </Link>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Spending
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalSpending)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across recorded purchases
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Purchase Records
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalPurchases}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Grocery trips recorded
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Units
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {totalUnits}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Products purchased
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Average Purchase
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(averagePurchase)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Average spending per trip
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">
          <div>
            <label
              htmlFor="search-purchases"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Search
            </label>

            <input
              id="search-purchases"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search store or product..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="store-filter"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Store
            </label>

            <select
              id="store-filter"
              value={storeFilter}
              onChange={(event) =>
                setStoreFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="All">
                All stores
              </option>

              {stores.map((store) => (
                <option
                  key={store}
                  value={store}
                >
                  {store}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-purchases"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Sort
            </label>

            <select
              id="sort-purchases"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredPurchases.length}
            </strong>{" "}
            of {purchasesData.length} purchases
          </p>

          {(search || storeFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStoreFilter("All");
              }}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* List */}
      {filteredPurchases.length > 0 ? (
        <PurchaseTable
          purchases={filteredPurchases}
          onDelete={handleDelete}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
            ₱
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No purchases found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Try adjusting your search or store filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default PurchasesPage;
