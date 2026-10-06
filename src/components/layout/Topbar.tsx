import { useLocation } from "react-router";

interface TopbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/budgets": "Budgets",
  "/products": "Products",
  "/categories": "Categories",
  "/purchases": "Purchases",
  "/analytics": "Analytics",
  "/analytics/spending": "Spending Analysis",
  "/analytics/prices": "Price Trends",
  "/shopping-list": "Shopping List",
};

function getPageTitle(pathname: string) {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  if (pathname.startsWith("/budgets/")) {
    return "Budget";
  }

  if (pathname.startsWith("/products/")) {
    return "Product";
  }

  if (pathname.startsWith("/categories/")) {
    return "Category";
  }

  if (pathname.startsWith("/purchases/")) {
    return "Purchase";
  }

  return "Smart Grocery";
}

function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 md:hidden"
          aria-label="Open navigation menu"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Smart Grocery
          </p>

          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            Grocery Overview
          </p>

          <p className="text-xs text-slate-500">
            Manage your spending smarter
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          SG
        </div>
      </div>
    </header>
  );
}

export default Topbar;
