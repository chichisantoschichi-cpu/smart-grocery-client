import { NavLink } from "react-router";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Budgets",
    path: "/budgets",
  },
  {
    label: "Products",
    path: "/products",
  },
  {
    label: "Categories",
    path: "/categories",
  },
  {
    label: "Purchases",
    path: "/purchases",
  },
  {
    label: "Analytics",
    path: "/analytics",
  },
  {
    label: "Shopping List",
    path: "/shopping-list",
  },
];

function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-[min(82vw,320px)] flex-col border-r border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              Smart Grocery
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Budget & Spending Analyzer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center rounded-xl px-3 py-3",
                    "text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "mr-3 h-2 w-2 rounded-full transition",
                        isActive
                          ? "bg-emerald-500"
                          : "bg-slate-300",
                      ].join(" ")}
                    />

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              Smart Grocery
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              Make smarter grocery decisions with better spending insights.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;
