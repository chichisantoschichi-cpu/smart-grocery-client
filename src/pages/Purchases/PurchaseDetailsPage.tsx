import { Link, useParams } from "react-router";

import { LoadingState, NotFoundCard } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import { useProducts } from "../../hooks/useProducts";
import type { Purchase } from "../../types";

function PurchaseDetailsPage() {
  const { id } = useParams();
  const { data: purchase, loading, error } = useApi<Purchase>(`/purchases/${id}`);
  const { products } = useProducts();

  // Look up unit and category of each item from the product list
  const productById = new Map(products.map((product) => [product.id, product]));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  if (loading) {
    return <LoadingState message="Loading purchase..." />;
  }

  if (error || !purchase) {
    return (
      <NotFoundCard
        title="Purchase Not Found"
        message={error ?? "No purchase record matches this ID."}
        backTo="/purchases"
        backLabel="Back to Purchases"
      />
    );
  }

  const totalAmount = purchase.totalAmount;

  const totalUnits = purchase.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const averageItemCost =
    purchase.items.length > 0
      ? totalAmount / purchase.items.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/purchases"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Purchases
          </Link>

          <p className="mt-6 text-sm font-semibold text-emerald-600">
            Purchase details
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {purchase.storeName ?? "Unknown store"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {formatDate(purchase.purchaseDate)}
          </p>
        </div>

        <Link
          to={`/purchases/${purchase.id}/edit`}
          className="inline-flex w-fit rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Edit Purchase
        </Link>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total purchase
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Products
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {purchase.items.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total units
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {totalUnits}
          </p>
        </div>
      </section>

      {/* Purchase information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-emerald-600">
            Grocery trip
          </p>

          <h2 className="text-xl font-bold text-slate-900">
            Purchase information
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Store
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {purchase.storeName ?? "Unknown store"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatDate(purchase.purchaseDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average item cost
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatCurrency(averageItemCost)}
            </p>
          </div>
        </div>

        {purchase.notes && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notes
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {purchase.notes}
            </p>
          </div>
        )}
      </section>

      {/* Items */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <p className="text-sm font-semibold text-emerald-600">
            Purchase items
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            What was purchased
          </h2>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Product
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quantity
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Unit Price
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {purchase.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.productName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {productById.get(item.productId)?.categoryName ?? "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-right text-sm text-slate-700">
                    {item.quantity} {productById.get(item.productId)?.unit ?? ""}
                  </td>

                  <td className="px-5 py-4 text-right text-sm text-slate-700">
                    {formatCurrency(item.unitPrice)}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/70">
                <td
                  colSpan={3}
                  className="px-5 py-4 text-right text-sm font-bold text-slate-700"
                >
                  Total
                </td>

                <td className="px-5 py-4 text-right text-lg font-bold text-emerald-700">
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-100 md:hidden">
          {purchase.items.map((item) => (
            <div
              key={item.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {item.productName}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {productById.get(item.productId)?.categoryName ?? "—"}
                  </p>
                </div>

                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {item.quantity} {productById.get(item.productId)?.unit ?? ""}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Unit Price
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Total
              </span>

              <span className="text-lg font-bold text-emerald-700">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PurchaseDetailsPage;
