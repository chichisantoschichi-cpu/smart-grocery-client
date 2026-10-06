import { Link } from "react-router";

export interface PurchaseTableItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseTableRecord {
  id: string;
  store: string;
  purchaseDate: string;
  notes: string;
  items: PurchaseTableItem[];
}

interface PurchaseTableProps {
  purchases: PurchaseTableRecord[];
  onDelete: (id: string) => void;
}

function PurchaseTable({
  purchases,
  onDelete,
}: PurchaseTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Store
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Items
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Total
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {purchases.map((purchase) => {
              const total = purchase.items.reduce(
                (sum, item) => sum + item.subtotal,
                0,
              );

              const itemCount = purchase.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );

              return (
                <tr
                  key={purchase.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDate(purchase.purchaseDate)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {purchase.store}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Grocery purchase
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {purchase.items.length} products
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {itemCount} total units
                    </p>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(total)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/purchases/${purchase.id}`}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        to={`/purchases/${purchase.id}/edit`}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(purchase.id)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-slate-100 md:hidden">
        {purchases.map((purchase) => {
          const total = purchase.items.reduce(
            (sum, item) => sum + item.subtotal,
            0,
          );

          const itemCount = purchase.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          return (
            <article
              key={purchase.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {purchase.store}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(purchase.purchaseDate)}
                  </p>
                </div>

                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(total)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400">
                    Products
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {purchase.items.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400">
                    Total units
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {itemCount}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/purchases/${purchase.id}`}
                  className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-600"
                >
                  View
                </Link>

                <Link
                  to={`/purchases/${purchase.id}/edit`}
                  className="flex-1 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => onDelete(purchase.id)}
                  className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default PurchaseTable;
