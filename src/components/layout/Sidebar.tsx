import { NavLink } from "react-router";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Budgets",
    path: "/budgets",
    icon: "◫",
  },
  {
    label: "Purchases",
    path: "/purchases",
    icon: "▣",
  },
  {
    label: "Products",
    path: "/products",
    icon: "◉",
  },
  {
    label: "Categories",
    path: "/categories",
    icon: "▦",
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: "◌",
  },
  {
    label: "Shopping List",
    path: "/shopping-list",
    icon: "☑",
  },
];

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-sm">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Smart Grocery
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Budget Analyzer
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold text-emerald-700">
              Smart Tip
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Monitor your grocery spending regularly to stay within budget.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
