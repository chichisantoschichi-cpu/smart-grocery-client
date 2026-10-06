interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

function CategoryChart({ data }: CategoryChartProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Spending breakdown
        </p>

        <h3 className="mt-1 text-xl font-bold text-slate-900">
          By category
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {data.map((category) => (
          <div key={category.name}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {category.name}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(category.amount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>

              <span className="w-12 text-right text-xs font-medium text-slate-400">
                {category.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryChart;
