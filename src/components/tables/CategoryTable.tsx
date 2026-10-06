import { Link } from "react-router";

export interface CategoryRecord {
  id: string;
  name: string;
  description: string;
  productCount: number;
  spending: number;
}

interface CategoryTableProps {
  categories: CategoryRecord[];
  onDelete: (id: string) => void;
}

function CategoryTable({
  categories,
  onDelete,
}: CategoryTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Category
              </th>

              <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Products
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Spending
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                      {category.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {category.name}
                      </p>

                      <p className="mt-1 max-w-md truncate text-xs text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {category.productCount}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(category.spending)}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(category.id)
                      }
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

      {/* Mobile */}
      <div className="divide-y divide-slate-100 md:hidden">
        {categories.map((category) => (
          <article
            key={category.id}
            className="p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                {category.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  {category.name}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Products
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {category.productCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Spending
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formatCurrency(category.spending)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/categories/${category.id}/edit`}
                className="flex-1 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() =>
                  onDelete(category.id)
                }
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

export default CategoryTable;
