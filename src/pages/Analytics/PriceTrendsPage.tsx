import { useMemo, useState } from "react";
import { Link } from "react-router";

import { ErrorState, LoadingState } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import { useProducts } from "../../hooks/useProducts";
import { usePurchases } from "../../hooks/usePurchases";
import type { PriceHistory } from "../../types";

const monthLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-PH", { month: "short", year: "2-digit" }).format(new Date(iso));

function PriceTrendsPage() {
  const productsQuery = useProducts();
  const purchasesQuery = usePurchases();
  const [selectedProduct, setSelectedProduct] = useState("");

  // Latest price paid vs the purchase before it, for every product that has been bought
  const productSummary = useMemo(() => {
    const pricesByProduct = new Map<string, { date: number; price: number }[]>();
    for (const purchase of purchasesQuery.purchases) {
      for (const item of purchase.items) {
        const list = pricesByProduct.get(item.productId) ?? [];
        list.push({ date: new Date(purchase.purchaseDate).getTime(), price: item.unitPrice });
        pricesByProduct.set(item.productId, list);
      }
    }

    return productsQuery.products
      .filter((product) => pricesByProduct.has(product.id))
      .map((product) => {
        const prices = pricesByProduct.get(product.id)!.sort((a, b) => a.date - b.date);
        const latest = prices[prices.length - 1].price;
        const previous = prices[prices.length - 2]?.price ?? 0;
        const change = previous > 0 ? ((latest - previous) / previous) * 100 : 0;

        return {
          id: product.id,
          product: product.name,
          unit: product.unit,
          latest,
          change,
        };
      });
  }, [productsQuery.products, purchasesQuery.purchases]);

  // Default to the first product until the user picks one
  const productId = selectedProduct || productSummary[0]?.id || "";

  const historyQuery = useApi<PriceHistory>(
    productId ? `/products/${productId}/price-history` : null,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(value);

  if (productsQuery.loading || purchasesQuery.loading) {
    return <LoadingState message="Loading price trends..." />;
  }

  const listError = productsQuery.error ?? purchasesQuery.error;
  if (listError) {
    return (
      <ErrorState
        message={listError}
        onRetry={() => {
          productsQuery.refetch();
          purchasesQuery.refetch();
        }}
      />
    );
  }

  const product = productsQuery.products.find((item) => item.id === productId);
  const stats = historyQuery.data?.stats ?? null;

  // Average price paid per month for the chart
  const monthlyPrices = new Map<string, { total: number; count: number }>();
  for (const entry of historyQuery.data?.history ?? []) {
    const key = monthLabel(entry.date);
    const current = monthlyPrices.get(key) ?? { total: 0, count: 0 };
    monthlyPrices.set(key, { total: current.total + entry.unitPrice, count: current.count + 1 });
  }
  const history = Array.from(monthlyPrices.entries()).map(([month, value]) => ({
    month,
    price: Math.round((value.total / value.count) * 100) / 100,
  }));

  const currentPrice =
    history[history.length - 1]?.price ?? 0;

  const previousPrice =
    history[history.length - 2]?.price ?? 0;

  const priceChange =
    currentPrice - previousPrice;

  const percentageChange =
    previousPrice > 0
      ? (priceChange / previousPrice) * 100
      : 0;

  // Min, max, average and overall trend are computed by the API
  const highestPrice = stats?.highest ?? 0;
  const lowestPrice = stats?.lowest ?? 0;
  const averagePrice = stats?.average ?? 0;
  const trend = stats?.changeAmount ?? 0;

  const trendLabel =
    trend > 0
      ? "Increasing"
      : trend < 0
        ? "Decreasing"
        : "Stable";

  const trendClass =
    trend > 0
      ? "text-amber-600"
      : trend < 0
        ? "text-emerald-600"
        : "text-slate-600";

  const maxPrice =
    Math.max(
      ...history.map(
        (item) => item.price,
      ),
      1,
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <Link
          to="/analytics"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Analytics
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-emerald-600">
            Product intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Price Trends
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Compare historical grocery prices and identify which
            products are becoming more expensive.
          </p>
        </div>
      </section>

      {/* Product selector */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Product
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Select a product to analyze
            </h2>
          </div>

          <select
            value={productId}
            onChange={(event) =>
              setSelectedProduct(
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:max-w-xs"
          >
            {productSummary.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.product}
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Current Price
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(currentPrice)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Per {product?.unit ?? "unit"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Previous Price
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(previousPrice)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Previous recorded month
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Price Change
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              priceChange > 0
                ? "text-amber-600"
                : priceChange < 0
                  ? "text-emerald-600"
                  : "text-slate-900"
            }`}
          >
            {priceChange >= 0
              ? "+"
              : ""}
            {formatCurrency(
              priceChange,
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Latest vs previous
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Change %
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              percentageChange > 0
                ? "text-amber-600"
                : percentageChange < 0
                  ? "text-emerald-600"
                  : "text-slate-900"
            }`}
          >
            {percentageChange >= 0
              ? "+"
              : ""}
            {percentageChange.toFixed(2)}%
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Latest price movement
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Trend
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${trendClass}`}
          >
            {trendLabel}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Based on history
          </p>
        </div>
      </section>

      {/* History */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Historical prices
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {product?.name ?? "Product"} price history
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {historyQuery.loading ? "Loading..." : `${history.length} month(s)`}
            </span>
          </div>

          <div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">
            {history.map((item) => {
              const height =
                (item.price / maxPrice) *
                100;

              return (
                <div
                  key={item.month}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-bold text-slate-700">
                    {formatCurrency(
                      item.price,
                    )}
                  </span>

                  <div className="flex h-48 w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-emerald-500 transition-all hover:bg-emerald-600"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-slate-500">
            Price statistics
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Historical range
          </h2>

          <div className="mt-7 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Lowest recorded
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatCurrency(
                  lowestPrice,
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Highest recorded
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatCurrency(
                  highestPrice,
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs text-emerald-700">
                Average recorded price
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatCurrency(
                  averagePrice,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-sm font-medium text-slate-500">
            Product comparison
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Latest price movements
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
                  Latest
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Change
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Change %
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {productSummary.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.product}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Per {item.unit}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">
                      {formatCurrency(
                        item.latest,
                      )}
                    </td>

                    <td
                      className={`px-5 py-4 text-right text-sm font-bold ${
                        item.change > 0
                          ? "text-amber-600"
                          : item.change < 0
                            ? "text-emerald-600"
                            : "text-slate-600"
                      }`}
                    >
                      {item.change >= 0
                        ? "+"
                        : ""}
                      {item.change.toFixed(2)}%
                    </td>

                    <td
                      className={`px-5 py-4 text-right text-sm font-bold ${
                        item.change > 0
                          ? "text-amber-600"
                          : item.change < 0
                            ? "text-emerald-600"
                            : "text-slate-600"
                      }`}
                    >
                      {item.change >= 0
                        ? "↑"
                        : "↓"}{" "}
                      {Math.abs(
                        item.change,
                      ).toFixed(2)}%
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-100 md:hidden">
          {productSummary.map(
            (item) => (
              <div
                key={item.id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {item.product}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Per {item.unit}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(
                      item.latest,
                    )}
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Latest price change
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      item.change > 0
                        ? "text-amber-600"
                        : item.change < 0
                          ? "text-emerald-600"
                          : "text-slate-600"
                    }`}
                  >
                    {item.change >= 0
                      ? "↑"
                      : "↓"}{" "}
                    {Math.abs(
                      item.change,
                    ).toFixed(2)}%
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

export default PriceTrendsPage;
