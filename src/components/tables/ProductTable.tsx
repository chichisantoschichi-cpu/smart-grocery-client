import { Link } from "react-router";

import type { Product, StockStatus } from "../../types";

const STOCK_BADGES: Record<StockStatus, { label: string; className: string }> = {
  "in-stock": { label: "In stock", className: "bg-emerald-50 text-emerald-700" },
  "low-stock": { label: "Low stock", className: "bg-amber-50 text-amber-700" },
  "out-of-stock": { label: "Out of stock", className: "bg-rose-50 text-rose-700" },
};

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Product
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Category
              </th>

              <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Unit
              </th>

              <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Stock
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Price
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {product.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Min. stock: {product.minStock} {product.unit}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                    {product.categoryName ?? "Uncategorized"}
                  </span>
                </td>

                <td className="px-5 py-4 text-center text-sm font-medium text-slate-600">
                  {product.unit}
                </td>

                <td className="px-5 py-4 text-center">
                  <p className="text-sm font-semibold text-slate-900">{product.stock}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STOCK_BADGES[product.stockStatus].className}`}
                  >
                    {STOCK_BADGES[product.stockStatus].label}
                  </span>
                </td>

                <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {products.map((product) => (
          <article
            key={product.id}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {product.name}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  {product.categoryName ?? "Uncategorized"}
                </span>
              </div>

              <p className="shrink-0 text-sm font-bold text-slate-900">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Unit
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {product.unit}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Stock
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {product.stock}{" "}
                  <span
                    className={`ml-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STOCK_BADGES[product.stockStatus].className}`}
                  >
                    {STOCK_BADGES[product.stockStatus].label}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/products/${product.id}/edit`}
                className="flex-1 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductTable;
