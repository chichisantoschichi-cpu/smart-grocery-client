interface SpendingPoint {
  week: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingPoint[];
}

function SpendingChart({ data }: SpendingChartProps) {
  const maxAmount = Math.max(...data.map((item) => item.amount), 1);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">Spending trend</p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">
          Weekly grocery spending
        </h3>
      </div>

      <div className="mt-6 space-y-5">
        {data.map((item) => {
          const width = (item.amount / maxAmount) * 100;

          return (
            <div key={item.week}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-600">
                  {item.week}
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SpendingChart;
